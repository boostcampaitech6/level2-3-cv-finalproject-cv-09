# ------------------------------------------
# TextDiffuser-2: Unleashing the Power of Language Models for Text Rendering
# Paper Link: https://arxiv.org/abs/2311.16465
# Code Link: https://github.com/microsoft/unilm/tree/master/textdiffuser-2
# Copyright (c) Microsoft Corporation.
# ------------------------------------------

import argparse
import logging
import math
import os
import random
import shutil
from pathlib import Path

import datasets
import numpy as np
import torch
import torch.nn.functional as F
import torch.utils.checkpoint
import transformers
from accelerate import Accelerator
from accelerate.logging import get_logger
from accelerate.utils import ProjectConfiguration, set_seed
from datasets import Dataset

from huggingface_hub import create_repo, upload_folder
from packaging import version
from torchvision import transforms
from tqdm.auto import tqdm
from transformers import CLIPTextModel, CLIPTokenizer

import diffusers
from diffusers import AutoencoderKL, DDPMScheduler, DiffusionPipeline, UNet2DConditionModel
from diffusers.loaders import AttnProcsLayers
from diffusers.models.attention_processor import LoRAAttnProcessor
from diffusers.optimization import get_scheduler
from diffusers.utils import is_wandb_available
from diffusers.utils.import_utils import is_xformers_available

from PIL import Image

import string
alphabet = string.digits + string.ascii_lowercase + \
    string.ascii_uppercase + string.punctuation + ' '
'''alphabet
0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ 
'''

logger = get_logger(__name__, log_level="INFO")


def save_model_card(
        repo_id: str, images=None, base_model=str,
        dataset_name=str, repo_folder=None
        ):
    img_str = ""
    for i, image in enumerate(images):
        image.save(os.path.join(repo_folder, f"image_{i}.png"))
        img_str += f"![img_{i}](./image_{i}.png)\n"

    yaml = f"""
---
license: creativeml-openrail-m
base_model: {base_model}
tags:
- stable-diffusion
- stable-diffusion-diffusers
- text-to-image
- diffusers
- lora
inference: true
---
    """
    model_card = f"""
# LoRA text2image fine-tuning - {repo_id}
These are LoRA adaption weights for {base_model}. \
The weights were fine-tuned on the {dataset_name} dataset. \
You can find some example images in the following. \n
{img_str}
"""
    with open(os.path.join(repo_folder, "README.md"), "w") as f:
        f.write(yaml + model_card)


def check_merge(box1, box2):

    x_center1, y_center1, x_min1, y_min1, x_max1, y_max1, pred1 = box1
    x_center2, y_center2, x_min2, y_min2, x_max2, y_max2, pred2 = box2

    if y_center1 >= y_min2 and y_center1 <= y_max2:
        if y_center2 >= y_min1 and y_center2 <= y_max1:
            pass
        else:
            return False
    else:
        return False

    distance1 = x_max2 - x_min1
    distance2 = (x_max2 - x_min2) + (x_max1 - x_min1)

    if distance2 / distance1 >= 0.8:
        if x_min1 < x_min2:
            pred = pred1 + ' ' + pred2
        else:
            pred = pred2 + ' ' + pred1

        x_min = min(x_min1, x_min2)
        y_min = min(y_min1, y_min2)
        x_max = max(x_max1, x_max2)
        y_max = max(y_max1, y_max2)

        x_center = (x_min + x_max) // 2
        y_center = (y_min + y_max) // 2

        return [x_center, y_center, x_min, y_min, x_max, y_max, pred]

    else:
        return False


def merge_boxes(boxes):
    results = []
    while True:
        if len(boxes) == 0:
            break

        flag = False
        sample = boxes[0]
        boxes.remove(sample)
        for item in boxes:
            result = check_merge(sample, item)
            if result:
                boxes.remove(item)
                boxes.append(result)
                boxes = sorted(boxes, key=lambda x: x[0])
                flag = True
                break
            else:
                pass

        if flag is False:
            results.append(sample)

    return results


def parse_args():
    parser = argparse.ArgumentParser(description="Simple example")
    parser.add_argument(
        "--pretrained_model_name_or_path",
        type=str,
        default="runwayml/stable-diffusion-v1-5",
    )
    parser.add_argument(
        "--revision",
        type=str,
        default=None,
        required=False,
    )
    parser.add_argument(
        "--dataset_name",
        type=str,
        default='lambdalabs/pokemon-blip-captions'
    )
    parser.add_argument(
        "--dataset_config_name",
        type=str,
        default=None,
    )
    parser.add_argument(
        "--train_data_dir",
        type=str,
        default=None
    )
    parser.add_argument(
        "--image_column",
        type=str,
        default="image",
    )
    parser.add_argument(
        "--caption_column",
        type=str,
        default="text",
    )
    parser.add_argument(
        "--max_train_samples",
        type=int,
        default=None,
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="diffusion_experiment_result",
    )
    parser.add_argument(
        "--cache_dir",
        type=str,
        default=None,
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=None,
    )
    parser.add_argument(
        "--resolution",
        type=int,
        default=512,
    )
    parser.add_argument(
        "--center_crop",
        default=False,
        action="store_true",
    )
    parser.add_argument(
        "--random_flip",
        action="store_true",
    )
    parser.add_argument(
        "--train_batch_size",
        type=int,
        default=1,
    )
    parser.add_argument("--num_train_epochs", type=int, default=6)
    parser.add_argument(
        "--max_train_steps",
        type=int,
        default=None,
    )
    parser.add_argument(
        "--gradient_accumulation_steps",
        type=int,
        default=4,
    )
    parser.add_argument(
        "--gradient_checkpointing",
        action="store_true",
    )
    parser.add_argument(
        "--learning_rate",
        type=float,
        default=1e-4,
    )
    parser.add_argument(
        "--text_encoder_learning_rate",
        type=float,
        default=1e-5,
    )
    parser.add_argument(
        "--scale_lr",
        action="store_true",
        default=False,
    )
    parser.add_argument(
        "--lr_scheduler",
        type=str,
        default="constant",
    )
    parser.add_argument(
        "--lr_warmup_steps", type=int, default=0,
    )
    parser.add_argument(
        "--snr_gamma",
        type=float,
        default=None,
    )
    parser.add_argument(
        "--use_8bit_adam", action="store_true",
    )
    parser.add_argument(
        "--allow_tf32",
        action="store_true",
    )
    parser.add_argument(
        "--dataloader_num_workers",
        type=int,
        default=8,
    )
    parser.add_argument("--adam_beta1", type=float, default=0.9,)
    parser.add_argument("--adam_beta2", type=float, default=0.999,)
    parser.add_argument("--adam_weight_decay", type=float, default=1e-2,)
    parser.add_argument("--adam_epsilon", type=float, default=1e-08,)
    parser.add_argument("--max_grad_norm", default=1.0, type=float,)
    parser.add_argument("--push_to_hub", action="store_true",)
    parser.add_argument("--hub_token", type=str, default=None,)
    parser.add_argument(
        "--prediction_type",
        type=str,
        default=None,
        )
    parser.add_argument(
        "--hub_model_id",
        type=str,
        default=None,
    )
    parser.add_argument(
        "--logging_dir",
        type=str,
        default="logs",
    )
    parser.add_argument(
        "--mixed_precision",
        type=str,
        default="no",
        choices=["no", "fp16", "bf16"],
    )
    parser.add_argument(
        "--report_to",
        type=str,
        default="tensorboard",
    )
    parser.add_argument("--local_rank", type=int, default=-1,)
    parser.add_argument(
        "--checkpointing_steps",
        type=int,
        default=2500,
    )
    parser.add_argument(
        "--checkpoints_total_limit",
        type=int,
        default=10,
    )
    parser.add_argument(
        "--resume_from_checkpoint",
        type=str,
        default="latest",
    )
    parser.add_argument(
        "--enable_xformers_memory_efficient_attention", action="store_true",
    )
    parser.add_argument("--noise_offset", type=float, default=0,)
    parser.add_argument(
        "--rank",
        type=int,
        default=4,
    )
    parser.add_argument(
        "--vis_num",
        type=int,
        default=16,
    )
    parser.add_argument(
        "--vis_interval",
        type=int,
        default=1000,
    )

    parser.add_argument(
        "--granularity",
        type=int,
        default=128,
    )
    parser.add_argument(
        "--coord_mode",
        type=str,
        default='ltrb',
        choices=['lt', 'center', 'ltrb'],
    )
    parser.add_argument(
        "--drop_coord",
        action='store_true',
    )
    parser.add_argument(
        "--max_length",
        default=77,
        type=int,
    )
    parser.add_argument(
        "--dataset_path",
        type=str,
        default='/data/ephemeral/home/dataset/final',
    )

    args = parser.parse_args()
    env_local_rank = int(os.environ.get("LOCAL_RANK", -1))
    if env_local_rank != -1 and env_local_rank != args.local_rank:
        args.local_rank = env_local_rank

    # Sanity checks
    if args.dataset_name is None and args.train_data_dir is None:
        raise ValueError("Need either a dataset name or a training folder.")

    return args


DATASET_NAME_MAPPING = {
    "MARIO-10M": ("image", "text"),
}


class DreamBoothDataset(Dataset):

    def __init__(
        self,
        dataset_path,
        root_folder,
        coord_mode,
        granularity,
        max_length,
        tokenizer
    ):
        self.dir = sorted(os.listdir(root_folder))
        self.dataset_path = dataset_path
        self.coord_mode = coord_mode
        self.granularity = granularity
        self.max_length = max_length
        self.tokenizer = tokenizer

        self.image_transforms = transforms.Compose(
            [transforms.ToTensor(),]
        )

    def __len__(self):
        return len(self.dir)

    def __getitem__(self, index):
        images = []
        prompts_train = []
        prompts_cond = []
        prompts_nocond = []
        path = self.dir[index[0]]
        image_name = os.listdir(f'{self.dataset_path}/{path}')
        image_name = image_name[0]

        image_path = f'{self.dataset_path}/{path}/{image_name}/image.jpg'
        image = Image.open(image_path).convert("RGB")
        images.append(image)

        try:
            caption = open(
                f'{self.dataset_path}/{path}/{image_name}/caption.txt'
            ).readlines()[0]
        except:
            caption = 'null'
            print('erorr of caption')
        ocrs = open(
            f'{self.dataset_path}/{path}/{image_name}/ocr.txt').readlines()

        ocrs_temp = []
        for line in ocrs:
            line = line.strip()
            line_list = line.split(' ')
            items = str(line_list[-2]).split(',')
            pred = " ".join(line_list[0:-2])
            x1, y1, x2, y2, x3, y3, x4, y4 = int(items[0]), int(items[1]), int(items[2]), int(items[3]), int(items[4]), int(items[5]), int(items[6]), int(items[7])
            x_min = min(x1, x2, x3, x4)
            y_min = min(y1, y2, y3, y4)
            x_max = max(x1, x2, x3, x4)
            y_max = max(y1, y2, y3, y4)
            x_center = (x_min + x_max) // 2
            y_center = (y_min + y_max) // 2
            ocrs_temp.append(
                [x_center, y_center, x_min, y_min, x_max, y_max, pred])
        ocrs_temp = sorted(ocrs_temp, key=lambda x: x[0])
        ocrs_temp = merge_boxes(ocrs_temp)
        ocrs_temp = sorted(ocrs_temp, key=lambda x: x[1])

        random.shuffle(ocrs_temp)

        ocr_ids = []
        for line in ocrs_temp:

            x_center, y_center, x_min, y_min, x_max, y_max, pred = line

            if self.coord_mode == 'lt':
                x_left = x_min
                y_top = y_min
                x_left = x_left // (512 // self.granularity)
                y_top = y_top // (512 // self.granularity)
                x_left = np.clip(x_left, 0, self.granularity)
                y_top = np.clip(y_top, 0, self.granularity)
                ocr_ids.extend(['l'+str(x_left), 't'+str(y_top)])

            elif self.coord_mode == 'center':
                x_center = x_center // (512 // self.granularity)
                y_center = y_center // (512 // self.granularity)
                x_center = np.clip(x_center, 0, self.granularity)
                y_center = np.clip(y_center, 0, self.granularity)
                ocr_ids.extend(['l'+str(x_center), 't'+str(y_center)])

            elif self.coord_mode == 'ltrb':
                x_left = x_min
                y_top = y_min
                x_right = x_max
                y_bottom = y_max
                x_left = x_left // (512 // self.granularity)
                y_top = y_top // (512 // self.granularity)
                x_right = x_right // (512 // self.granularity)
                y_bottom = y_bottom // (512 // self.granularity)
                x_left = np.clip(x_left, 0, self.granularity)
                y_top = np.clip(y_top, 0, self.granularity)
                x_right = np.clip(x_right, 0, self.granularity)
                y_bottom = np.clip(y_bottom, 0, self.granularity)
                ocr_ids.extend([
                    'l'+str(x_left), 't'+str(y_top),
                    'r'+str(x_right), 'b'+str(y_bottom)
                    ])

            char_list = list(pred)
            char_list = [f'[{i}]' for i in char_list]
            ocr_ids.extend(char_list)
            ocr_ids.append(self.tokenizer.eos_token_id)
        ocr_ids.append(self.tokenizer.eos_token_id)

        ocr_ids = self.tokenizer.encode(ocr_ids)

        caption_ids = self.tokenizer(
            caption, truncation=True, return_tensors="pt"
        ).input_ids[0].tolist()

        prompt = caption_ids + ocr_ids
        prompt = prompt[:self.max_length]
        while len(prompt) < self.max_length:
            prompt.append(self.tokenizer.pad_token_id)

        prompts_cond.append(prompt)
        prompts_nocond.append([self.tokenizer.pad_token_id]*self.max_length)

        if random.random() < 0.1:
            prompts_train.append([self.tokenizer.pad_token_id]*self.max_length)
        else:
            prompts_train.append(prompt)

        examples = {}
        examples["images"] = [
            self.image_transforms(image).sub_(0.5).div_(0.5)
            for image in images]
        examples["prompts_train"] = prompts_train
        examples["prompts_cond"] = prompts_cond
        examples["prompts_nocond"] = prompts_nocond

        return examples


def main():
    cache_dir = 'model_cache'
    local_files_only = False
    args = parse_args()
    logging_dir = Path(args.output_dir, args.logging_dir)

    accelerator_project_config = ProjectConfiguration(
        project_dir=args.output_dir, logging_dir=logging_dir)

    accelerator = Accelerator(
        gradient_accumulation_steps=args.gradient_accumulation_steps,
        mixed_precision=args.mixed_precision,
        log_with=args.report_to,
        project_config=accelerator_project_config,
    )
    if args.report_to == "wandb":
        if not is_wandb_available():
            raise ImportError("Make sure to install wandb")
        import wandb

    logging.basicConfig(
        format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
        datefmt="%m/%d/%Y %H:%M:%S",
        level=logging.INFO,
    )
    logger.info(accelerator.state, main_process_only=False)
    if accelerator.is_local_main_process:
        datasets.utils.logging.set_verbosity_warning()
        transformers.utils.logging.set_verbosity_warning()
        diffusers.utils.logging.set_verbosity_info()
    else:
        datasets.utils.logging.set_verbosity_error()
        transformers.utils.logging.set_verbosity_error()
        diffusers.utils.logging.set_verbosity_error()

    if args.seed is not None:
        set_seed(args.seed)

    if accelerator.is_main_process:
        if args.output_dir is not None:
            os.makedirs(args.output_dir, exist_ok=True)

        if args.push_to_hub:
            repo_id = create_repo(
                repo_id=args.hub_model_id or Path(args.output_dir).name,
                exist_ok=True, token=args.hub_token
            ).repo_id
    noise_scheduler = DDPMScheduler.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="scheduler",
        cache_dir=cache_dir,
        local_files_only=local_files_only,
    )

    tokenizer = CLIPTokenizer.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="tokenizer",
        revision=args.revision,
        cache_dir=cache_dir,
        local_files_only=local_files_only,
    )

    print('[Size of the original tokenizer] ', len(tokenizer))
    for i in range(520):
        tokenizer.add_tokens(['l' + str(i)])
        tokenizer.add_tokens(['t' + str(i)])
        tokenizer.add_tokens(['r' + str(i)])
        tokenizer.add_tokens(['b' + str(i)])
    for c in alphabet:
        tokenizer.add_tokens([f'[{c}]'])
    print('[Size of the modified tokenizer] ', len(tokenizer))

    if args.max_length == 77:
        text_encoder = CLIPTextModel.from_pretrained(
            args.pretrained_model_name_or_path,
            subfolder="text_encoder",
            revision=args.revision,
            cache_dir=cache_dir,
            local_files_only=local_files_only,
        )
    else:
        text_encoder = CLIPTextModel.from_pretrained(
            args.pretrained_model_name_or_path,
            subfolder="text_encoder",
            revision=args.revision,
            max_position_embeddings=args.max_length,
            ignore_mismatched_sizes=True,
            cache_dir=cache_dir,
            local_files_only=local_files_only,
        )
    text_encoder.resize_token_embeddings(len(tokenizer))

    vae = AutoencoderKL.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="vae",
        revision=args.revision,
        cache_dir=cache_dir,
        local_files_only=local_files_only,
    )

    unet = UNet2DConditionModel.from_pretrained(
        args.pretrained_model_name_or_path,
        subfolder="unet",
        revision=args.revision,
        cache_dir=cache_dir,
        local_files_only=local_files_only,
    )

    unet.requires_grad_(False)
    vae.requires_grad_(False)

    text_encoder.requires_grad_(True)

    weight_dtype = torch.float32
    if accelerator.mixed_precision == "fp16":
        weight_dtype = torch.float16
    elif accelerator.mixed_precision == "bf16":
        weight_dtype = torch.bfloat16

    print(accelerator.device, weight_dtype)
    unet.to(accelerator.device, dtype=weight_dtype)
    vae.to(accelerator.device, dtype=weight_dtype)

    lora_attn_procs = {}
    for name in unet.attn_processors.keys():
        cross_attention_dim = None if name.endswith("attn1.processor") else unet.config.cross_attention_dim
        if name.startswith("mid_block"):
            hidden_size = unet.config.block_out_channels[-1]
        elif name.startswith("up_blocks"):
            block_id = int(name[len("up_blocks.")])
            hidden_size = list(
                reversed(unet.config.block_out_channels))[block_id]
        elif name.startswith("down_blocks"):
            block_id = int(name[len("down_blocks.")])
            hidden_size = unet.config.block_out_channels[block_id]

        lora_attn_procs[name] = LoRAAttnProcessor(
            hidden_size=hidden_size,
            cross_attention_dim=cross_attention_dim,
            rank=args.rank,
        )

    unet.set_attn_processor(lora_attn_procs)

    if args.enable_xformers_memory_efficient_attention:
        if is_xformers_available():
            import xformers

            xformers_version = version.parse(xformers.__version__)
            if xformers_version == version.parse("0.0.16"):
                logger.warn(
                    "xFormers 0.0.16 cannot be used for training in some GPUs.\
                    If you observe problems during training, please update xFormers to at least 0.0.17."
                )
            unet.enable_xformers_memory_efficient_attention()
        else:
            raise ValueError("xformers is not available.")

    def compute_snr(timesteps):
        alphas_cumprod = noise_scheduler.alphas_cumprod
        sqrt_alphas_cumprod = alphas_cumprod**0.5
        sqrt_one_minus_alphas_cumprod = (1.0 - alphas_cumprod) ** 0.5

        sqrt_alphas_cumprod = sqrt_alphas_cumprod.to(device=timesteps.device)[
            timesteps].float()
        while len(sqrt_alphas_cumprod.shape) < len(timesteps.shape):
            sqrt_alphas_cumprod = sqrt_alphas_cumprod[..., None]
        alpha = sqrt_alphas_cumprod.expand(timesteps.shape)

        sqrt_one_minus_alphas_cumprod = sqrt_one_minus_alphas_cumprod.to(
            device=timesteps.device)[timesteps].float()
        while len(sqrt_one_minus_alphas_cumprod.shape) < len(timesteps.shape):
            sqrt_one_minus_alphas_cumprod = sqrt_one_minus_alphas_cumprod[
                ..., None]
        sigma = sqrt_one_minus_alphas_cumprod.expand(timesteps.shape)

        snr = (alpha / sigma) ** 2
        return snr

    lora_layers = AttnProcsLayers(unet.attn_processors)

    if args.allow_tf32:
        torch.backends.cuda.matmul.allow_tf32 = True

    if args.scale_lr:
        args.learning_rate = (
            args.learning_rate * args.gradient_accumulation_steps
            * args.train_batch_size * accelerator.num_processes
        )

    if args.use_8bit_adam:
        try:
            import bitsandbytes as bnb
        except ImportError:
            raise ImportError(
                "Please install bitsandbytes to use 8-bit Adam."
            )

        optimizer_cls = bnb.optim.AdamW8bit
    else:
        optimizer_cls = torch.optim.AdamW

    optimizer = optimizer_cls(
        [
            {
                'params': text_encoder.parameters(),
                'lr': args.text_encoder_learning_rate},
            {
                'params': lora_layers.parameters(),
                'lr': args.learning_rate},
        ],
        lr=args.learning_rate,
        betas=(args.adam_beta1, args.adam_beta2),
        weight_decay=args.adam_weight_decay,
        eps=args.adam_epsilon
    )

    with accelerator.main_process_first():
        root_folder = '../../dataset/final'
        train_dataset = DreamBoothDataset(
            dataset_path=args.dataset_path,
            root_folder=root_folder,
            coord_mode=args.coord_mode,
            granularity=args.granularity,
            max_length=args.max_length,
            tokenizer=tokenizer
        )

    def collate_fn(examples):
        images = torch.stack([example["images"] for example in examples])
        images = images.to(memory_format=torch.contiguous_format).float()

        prompts_train = torch.Tensor(
            [example["prompts_train"] for example in examples]).long()
        prompts_cond = torch.Tensor(
            [example["prompts_cond"] for example in examples]).long()
        prompts_nocond = torch.Tensor(
            [example["prompts_nocond"] for example in examples]).long()
        return {"images": images, "prompts_train": prompts_train,
                "prompts_cond": prompts_cond, "prompts_nocond": prompts_nocond}

    train_dataloader = torch.utils.data.DataLoader(
        train_dataset,
        shuffle=True,
        collate_fn=collate_fn,
        batch_size=args.train_batch_size,
        num_workers=args.dataloader_num_workers,
    )

    overrode_max_train_steps = False
    num_update_steps_per_epoch = math.ceil(
        len(train_dataloader) / args.gradient_accumulation_steps)
    if args.max_train_steps is None:
        args.max_train_steps = args.num_train_epochs * num_update_steps_per_epoch
        overrode_max_train_steps = True

    lr_scheduler = get_scheduler(
        args.lr_scheduler,
        optimizer=optimizer,
        num_warmup_steps=args.lr_warmup_steps * args.gradient_accumulation_steps,
        num_training_steps=args.max_train_steps * args.gradient_accumulation_steps,
    )

    lora_layers, text_encoder, optimizer, train_dataloader, lr_scheduler = accelerator.prepare(
        lora_layers, text_encoder, optimizer, train_dataloader, lr_scheduler
    )

    num_update_steps_per_epoch = math.ceil(
        len(train_dataloader) / args.gradient_accumulation_steps)
    if overrode_max_train_steps:
        args.max_train_steps = args.num_train_epochs * num_update_steps_per_epoch
    args.num_train_epochs = math.ceil(
        args.max_train_steps / num_update_steps_per_epoch)

    if accelerator.is_main_process:
        accelerator.init_trackers("text2image-fine-tune", config=vars(args))

    total_batch_size = args.train_batch_size * accelerator.num_processes * args.gradient_accumulation_steps

    logger.info("***** Running training *****")
    logger.info(f"  Num examples = {len(train_dataset)}")
    logger.info(f"  Num Epochs = {args.num_train_epochs}")
    logger.info(f"  Instantaneous batch size per device = {args.train_batch_size}")
    logger.info(f"  Total train batch size (w. parallel, distributed & accumulation) = {total_batch_size}")
    logger.info(f"  Gradient Accumulation steps = {args.gradient_accumulation_steps}")
    logger.info(f"  Total optimization steps = {args.max_train_steps}")
    global_step = 0
    first_epoch = 0

    if args.resume_from_checkpoint:
        if args.resume_from_checkpoint != "latest":
            path = os.path.basename(args.resume_from_checkpoint)
        else:
            dirs = os.listdir(args.output_dir)
            dirs = [d for d in dirs if d.startswith("checkpoint")]
            dirs = sorted(dirs, key=lambda x: int(x.split("-")[1]))
            path = dirs[-1] if len(dirs) > 0 else None

        if path is None:
            accelerator.print(
                f"Checkpoint '{args.resume_from_checkpoint}' does not exist. \
                Starting a new training run."
            )
            args.resume_from_checkpoint = None
        else:
            accelerator.print(f"Resuming from checkpoint {path}")
            accelerator.load_state(args.resume_from_checkpoint)

            global_step = int(path.split("-")[1])
            first_epoch = global_step // num_update_steps_per_epoch

    progress_bar = tqdm(range(global_step, args.max_train_steps), disable=not accelerator.is_local_main_process)
    progress_bar.set_description("Steps")

    for epoch in range(first_epoch, args.num_train_epochs):
        unet.train()
        text_encoder.train()
        train_loss = 0.0
        for _, batch in enumerate(train_dataloader):
            with accelerator.accumulate(unet):
                latents = vae.encode(
                    batch["images"].to(dtype=weight_dtype)).latent_dist.sample()
                latents = latents * vae.config.scaling_factor
                noise = torch.randn_like(latents)
                if args.noise_offset:
                    noise += args.noise_offset * torch.randn(
                        (latents.shape[0], latents.shape[1], 1, 1),
                        device=latents.device
                    )

                bsz = latents.shape[0]
                timesteps = torch.randint(
                    0, noise_scheduler.config.num_train_timesteps,
                    (bsz,), device=latents.device)
                timesteps = timesteps.long()
                noisy_latents = noise_scheduler.add_noise(
                    latents, noise, timesteps)

                encoder_hidden_states = text_encoder(batch["prompts_train"])[0]

                if args.prediction_type is not None:
                    noise_scheduler.register_to_config(
                        prediction_type=args.prediction_type)

                if noise_scheduler.config.prediction_type == "epsilon":
                    target = noise
                elif noise_scheduler.config.prediction_type == "v_prediction":
                    target = noise_scheduler.get_velocity(
                        latents, noise, timesteps)
                else:
                    raise ValueError(
                        f"Unknown prediction type {noise_scheduler.config.prediction_type}")

                model_pred = unet(
                    noisy_latents,
                    timesteps,
                    encoder_hidden_states,
                ).sample

                if args.snr_gamma is None:
                    loss = F.mse_loss(
                        model_pred.float(), target.float(), reduction="mean")
                else:
                    snr = compute_snr(timesteps)
                    mse_loss_weights = (
                        torch.stack([snr, args.snr_gamma * torch.ones_like(timesteps)], dim=1).min(dim=1)[0] / snr
                    )
                    loss = F.mse_loss(model_pred.float(), target.float(), reduction="none")
                    loss = loss.mean(dim=list(range(1, len(loss.shape)))) * mse_loss_weights
                    loss = loss.mean()

                avg_loss = accelerator.gather(
                    loss.repeat(args.train_batch_size)).mean()
                train_loss += avg_loss.item() / args.gradient_accumulation_steps

                accelerator.backward(loss)
                if accelerator.sync_gradients:
                    params_to_clip = lora_layers.parameters()
                    accelerator.clip_grad_norm_(
                        params_to_clip, args.max_grad_norm)
                optimizer.step()
                lr_scheduler.step()
                optimizer.zero_grad()

            if accelerator.sync_gradients:
                progress_bar.update(1)
                global_step += 1
                accelerator.log({"train_loss": train_loss}, step=global_step)
                train_loss = 0.0

                if global_step % args.checkpointing_steps == 0:
                    if accelerator.is_main_process:
                        if args.checkpoints_total_limit is not None:
                            checkpoints = os.listdir(args.output_dir)
                            checkpoints = [d for d in checkpoints if d.startswith("checkpoint")]
                            checkpoints = sorted(checkpoints, key=lambda x: int(x.split("-")[1]))

                            if len(checkpoints) >= args.checkpoints_total_limit:
                                num_to_remove = len(checkpoints) - args.checkpoints_total_limit + 1
                                removing_checkpoints = checkpoints[0:num_to_remove]

                                logger.info(
                                    f"{len(checkpoints)} checkpoints already exist, removing {len(removing_checkpoints)} checkpoints"
                                )
                                logger.info(f"removing checkpoints: {', '.join(removing_checkpoints)}")

                                for removing_checkpoint in removing_checkpoints:
                                    removing_checkpoint = os.path.join(args.output_dir, removing_checkpoint)
                                    shutil.rmtree(removing_checkpoint)

                        save_path = os.path.join(args.output_dir, f"checkpoint-{global_step}")
                        accelerator.save_state(save_path) 
                        logger.info(f"Saved state to {save_path}")

            logs = {"step_loss": loss.detach().item(),
                    "lr": lr_scheduler.get_last_lr()[0]}
            progress_bar.set_postfix(**logs)

            if global_step >= args.max_train_steps:
                break

    # Save the lora layers
    accelerator.wait_for_everyone()
    if accelerator.is_main_process:
        unet = unet.to(torch.float32)
        unet.save_attn_procs(args.output_dir)

        if args.push_to_hub:
            save_model_card(
                repo_id,
                images=images,
                base_model=args.pretrained_model_name_or_path,
                dataset_name=args.dataset_name,
                repo_folder=args.output_dir,
            )
            upload_folder(
                repo_id=repo_id,
                folder_path=args.output_dir,
                commit_message="End of training",
                ignore_patterns=["step_*", "epoch_*"],
            )

    pipeline = DiffusionPipeline.from_pretrained(
        args.pretrained_model_name_or_path,
        revision=args.revision,
        torch_dtype=weight_dtype,
        cache_dir=cache_dir,
        local_files_only=local_files_only,
    )
    pipeline = pipeline.to(accelerator.device)

    pipeline.unet.load_attn_procs(args.output_dir)
    accelerator.end_training()


if __name__ == "__main__":
    main()

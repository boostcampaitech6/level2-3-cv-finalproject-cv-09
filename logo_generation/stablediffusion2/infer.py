from natsort import natsorted
from glob import glob 
import os 

import torch
from torch import autocast
from diffusers import StableDiffusionPipeline, DDIMScheduler

import argparse
from omegaconf import OmegaConf

def main(configs):

    weight_dir = configs['weight_dir']
    model_path = natsorted(glob(weight_dir + os.sep + "*"))[-1]

    scheduler = DDIMScheduler(beta_start=0.00085, beta_end=0.012, beta_schedule="scaled_linear", clip_sample=False, set_alpha_to_one=False)
    pipe = StableDiffusionPipeline.from_pretrained(model_path, scheduler=scheduler, safety_checker=None, torch_dtype=torch.float16).to("cuda")
    
    g_cuda = torch.Generator(device='cuda')
    seed = configs['seed']
    g_cuda.manual_seed(seed)

    prompt = configs['prompt']
    negative_prompt = configs['negative_prompt']
    num_samples = configs['num_samples']
    size = configs['size']
    save_dir = configs['save_dir']

    with autocast("cuda"), torch.inference_mode():
        images = pipe(
            prompt,
            height=size,
            width=size,
            negative_prompt=negative_prompt,
            num_images_per_prompt=num_samples,
            num_inference_steps=100,
            guidance_scale=7.5,
            generator=g_cuda
        ).images

    for i, img in enumerate(images):
        img.save(save_dir+f"{prompt}_{i+1}.jpg","JPEG")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--config", type=str, default="./configs/infer.yaml"
    )
    args = parser.parse_args()
    with open(args.config, 'r') as f:
        configs = OmegaConf.load(f)
        main(configs)

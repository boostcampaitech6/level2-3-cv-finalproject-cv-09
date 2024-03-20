import torch 
from torch.utils.data import Dataset
from torchvision import transforms

from glob import glob
from PIL import Image


class DreamBoothDataset(Dataset):
    """
    A dataset to prepare the instance and class images with the prompts for fine-tuning the model.
    It pre-processes the images and the tokenizes prompts.
    """

    def __init__(
        self,
        instance_list,
        class_list,
        tokenizer,
        with_prior_preservation=True,
        size=512,
        center_crop=False,
        num_class_images=None,
        pad_tokens=False,
        hflip=False
    ):
        self.size = size
        self.center_crop = center_crop
        self.tokenizer = tokenizer
        self.with_prior_preservation = with_prior_preservation
        self.pad_tokens = pad_tokens
        
        self.instance_images_path = sorted(glob(instance_list+'*.png'))
        img_txt_path = sorted(glob(instance_list+'*.txt'))
        self.instance_prompt = []
        for i in img_txt_path:
            with open(i,'r') as f:
                y = f.read()
                text = 'a logo about ' + y[10:]
                
                self.instance_prompt.append(text)
        self.class_images_path = sorted(glob(class_list+'*.png'))

        self.num_instance_images = len(self.instance_images_path)
        self.num_class_images = len(self.class_images_path)
        self._length = max(self.num_class_images, self.num_instance_images)

        self.image_transforms = transforms.Compose(
            [
                transforms.RandomHorizontalFlip(0.5 * hflip),
                transforms.Resize(size, interpolation=transforms.InterpolationMode.BILINEAR),
                transforms.CenterCrop(size) if center_crop else transforms.RandomCrop(size),
                transforms.ToTensor(),
                transforms.Normalize([0.5], [0.5]),
            ]
        )

    def __len__(self):
        return self._length

    def __getitem__(self, index):
        example = {}
        instance_path, instance_prompt = self.instance_images_path[index % self.num_instance_images], self.instance_prompt[index % self.num_instance_images]
        instance_image = Image.open(instance_path)
        if not instance_image.mode == "RGB":
            instance_image = instance_image.convert("RGB")
        example["instance_images"] = self.image_transforms(instance_image)
        example["instance_prompt_ids"] = self.tokenizer(
            instance_prompt,
            padding="max_length" if self.pad_tokens else "do_not_pad",
            truncation=True,
            max_length=self.tokenizer.model_max_length,
        ).input_ids

        if self.with_prior_preservation:
            class_path= self.class_images_path[index % self.num_class_images]
            class_prompt = 'a logo'
            class_image = Image.open(class_path)
            if not class_image.mode == "RGB":
                class_image = class_image.convert("RGB")
            example["class_images"] = self.image_transforms(class_image)
            example["class_prompt_ids"] = self.tokenizer(
                class_prompt,
                padding="max_length" if self.pad_tokens else "do_not_pad",
                truncation=True,
                max_length=self.tokenizer.model_max_length,
            ).input_ids

        return example

class LatentsDataset(Dataset):
    def __init__(self, latents_cache, text_encoder_cache):
        self.latents_cache = latents_cache
        self.text_encoder_cache = text_encoder_cache

    def __len__(self):
        return len(self.latents_cache)

    def __getitem__(self, index):
        return self.latents_cache[index], self.text_encoder_cache[index]
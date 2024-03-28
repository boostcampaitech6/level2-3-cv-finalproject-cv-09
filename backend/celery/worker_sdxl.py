import json
import random

import torch
from diffusers import StableDiffusionXLPipeline

from googletrans import Translator

from celery import Celery
from GCS import upload_gcs

with open('./redis.json', 'r') as f:
    data = json.load(f)

REDIS_URL = data['REDIS_URL']
REDIS_PASSWORD = data['REDIS_PASSWORD']
connection_url = f"redis://:{REDIS_PASSWORD}@{REDIS_URL}"

backend = connection_url+"/0"
broker = connection_url+"/0"

celery_app = Celery(
    "tasks", backend=backend, broker=broker, worker_heartbeat=280)
celery_app.conf.worker_pool = "solo"

cache_dir = 'model_cache'
local_files_only = False


@celery_app.task(name="SDXL")
def generate(user_dir, name, prompt, n_sample=4):
    lora_path = "./model_cache/pytorch_lora_weights.safetensors"
    pipeline = StableDiffusionXLPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0",
        torch_dtype=torch.float16,
        variant="fp16",
        use_safetensors=True,
        cache_dir=cache_dir,
        local_files_only=local_files_only
    ).to("cuda")
    pipeline.load_lora_weights(lora_path)
    negative_prompt = "low quality, bad composition, duplicated, \
    extra digit, text, inscription, watermark, label"

    translator = Translator()
    translation = translator.translate(prompt)
    prompt = translation.text

    seed = random.randrange(-100000000, 100000000)
    images = pipeline(
        prompt=prompt,
        negative_prompt=negative_prompt,
        num_inference_steps=25,
        generator=torch.manual_seed(seed)
    ).images[0].resize((256, 256))
    image_name = "sample/0.png"
    images.save(image_name)
    gcsdir = f"{user_dir}/SDXL.png"
    url = upload_gcs(image_name, gcsdir)
    return url

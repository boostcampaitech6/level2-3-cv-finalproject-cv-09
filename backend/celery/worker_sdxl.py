from diffusers import StableDiffusionXLPipeline
import torch 
from googletrans import Translator
import argparse
from datetime import datetime, timedelta
import os

from celery import Celery
from GCS import upload_gcs
import random

from parseq.strhub.data.module import SceneTextDataModule
from parseq.sim import cal_sim

REDIS_URL= "redis.klogogen.studio:7090"
REDIS_PASSWORD= "bc0709!"

connection_url = f"redis://:{REDIS_PASSWORD}@{REDIS_URL}"

backend = connection_url+"/0"
broker = connection_url+"/0"

celery_app = Celery("tasks", backend=backend, broker=broker, worker_heartbeat=280)
celery_app.conf.worker_pool = "solo"

parseq = torch.hub.load('baudm/parseq', 'parseq', pretrained=True).eval()
img_transform = SceneTextDataModule.get_transform(parseq.hparams.img_size)

@celery_app.task(name="SDXL")
def generate(user_dir, name, prompt, n_sample=4):
    pipeline = StableDiffusionXLPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True
    ).to("cuda")
    lora_path = "./model_cache/pytorch_lora_weights.safetensors"
    pipeline.load_lora_weights(lora_path)
    negative_prompt = "low quality, bad composition, duplicated, extra digit, text, inscription, watermark, label"
    translator = Translator()
    # 번역
    translation = translator.translate(prompt)
    seed = random.randrange(-100000000, 100000000)
    prompt = translation.text
    # results, ans = 0, -1
    image_name = ""
    for i in range(n_sample):
        images = pipeline(
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=25,
            generator=torch.manual_seed(seed)
        ).images[0].resize((256, 256))
        image_name = "sample/"+f"{i}.png"
        images.save(image_name)
        # images = img_transform(images).unsqueeze(0)
        # ocr_res = parseq(images)
        # ocr_pred = ocr_res.softmax(-1)
        # if ans < cal_sim(name, ocr_pred):
        #     ans = cal_sim(name, ocr_pred)
        #     results = [images, image_name]
    # image, image_name = results
    gcsdir = f"{user_dir}/SDXL.png"
    url = upload_gcs(image_name, gcsdir)
    return url

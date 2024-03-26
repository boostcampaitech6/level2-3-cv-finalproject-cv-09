from diffusers import DiffusionPipeline
import torch 
from googletrans import Translator
import argparse
from datetime import datetime, timedelta
import os

from celery import Celery
from GCS import upload_gcs

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

    # 모형
    pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
    # Device
    pipe.to("cuda")
    
    translator = Translator()
    # 번역
    translation = translator.translate(prompt)
    
    prompt = translation.text
    results, ans = 0, -1
    for i in range(n_sample):
        images = pipe(prompt=prompt).images[0].resize((256,256))
        image_name = 'sample/'+f'{i}.png'
        images.save(image_name)
        images = img_transform(images).unsqueeze(0)
        ocr_res = parseq(images)
        ocr_pred = ocr_res.softmax(-1)
        if ans < cal_sim(name, ocr_pred):
            ans = cal_sim(name, ocr_pred)
            results = [images, image_name]
        
    image, image_name = results
    gcsdir = f'{user_dir}/SDXL.png'
    url = upload_gcs(image_name, gcsdir)
    
    return url
    
    return url
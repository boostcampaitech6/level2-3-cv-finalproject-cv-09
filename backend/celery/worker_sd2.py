from diffusers import DiffusionPipeline
import torch 
from googletrans import Translator
import argparse
from datetime import datetime, timedelta
import os
from GCS import upload_gcs
from celery import Celery

REDIS_URL= "www.klogogen.studio:7090"
REDIS_PASSWORD= "bc0709!"

connection_url = f"redis://:{REDIS_PASSWORD}@{REDIS_URL}"

backend = connection_url+"/0"
broker = connection_url+"/0"

celery_app = Celery("tasks", backend=backend, broker=broker, worker_heartbeat=280)
celery_app.conf.worker_pool = "solo"

@celery_app.task(name="SD2")

def generate(user_dir, name, prompt, n_sample=1):

    # 모형
    pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-2", torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
    # Device
    pipe.to("cuda")
    
    translator = Translator()
    # 번역
    translation = translator.translate(prompt)
    
    prompt = translation.text
    images = pipe(prompt=prompt).images[0].resize((256,256))
    
    image_name = 'sample/'+f'{prompt}_3.png'
    gcsdir = f'{user_dir}/{prompt}_3.png'
    images.save(image_name)
    url = upload_gcs(image_name, gcsdir)
    #os.remove(image_name)
    
    return url
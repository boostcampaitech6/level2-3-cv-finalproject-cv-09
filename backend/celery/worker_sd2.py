import json
import random

import torch
from diffusers import DiffusionPipeline

from googletrans import Translator

from GCS import upload_gcs
from celery import Celery

from parseq.strhub.data.module import SceneTextDataModule
from parseq.utils import cal_sim


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

parseq = torch.hub.load('baudm/parseq', 'parseq', pretrained=True).eval()
img_transform = SceneTextDataModule.get_transform(parseq.hparams.img_size)

cache_dir = 'model_cache'
local_files_only = False


@celery_app.task(name="SD2")
def generate(user_dir, name, prompt, n_sample=4):
    pipe = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-2",
        torch_dtype=torch.float16,
        use_safetensors=True,
        variant="fp16",
        cache_dir=cache_dir,
        local_files_only=local_files_only
    )
    pipe.to("cuda")

    translator = Translator()
    translation = translator.translate(prompt)
    prompt = translation.text

    results, ans = '', -1
    for i in range(n_sample):
        seed = random.randrange(-100000000, 100000000)
        images = pipe(
            prompt=prompt, generator=torch.manual_seed(seed)
        ).images[0].resize((256, 256))
        image_name = 'sample/'+f'{i}.png'
        images.save(image_name)
        images = img_transform(images).unsqueeze(0)
        ocr_res = parseq(images)
        ocr_pred = ocr_res.softmax(-1)
        if ans < cal_sim(name, ocr_pred):
            ans = cal_sim(name, ocr_pred)
            results = image_name

    gcsdir = f'{user_dir}/SD2.png'
    url = upload_gcs(results, gcsdir)
    return url

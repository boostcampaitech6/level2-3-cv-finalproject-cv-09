import json

import torch
from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
from accelerate.utils import ProjectConfiguration
from accelerate import Accelerator

from googletrans import Translator

from GCS import upload_gcs
from celery import Celery

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


@celery_app.task(name="DeepFloyd")
def generate(user_dir, name, prompt, n_sample=1):
    prompt = name+', '+prompt
    pipeline = DiffusionPipeline.from_pretrained(
        "DeepFloyd/IF-I-XL-v1.0",
        torch_dtype=torch.float16,
        cache_dir=cache_dir,
        local_files_only=local_files_only
    )

    scheduler_args = {}
    variance_type = pipeline.scheduler.config.variance_type

    if variance_type in ["learned", "learned_range"]:
        variance_type = "fixed_small"

    scheduler_args["variance_type"] = variance_type
    project_dir = './model_cache'
    accelerator_project_config = ProjectConfiguration(
        project_dir=project_dir, logging_dir='logs')

    accelerator = Accelerator(
        gradient_accumulation_steps=1,
        mixed_precision='fp16',
        project_config=accelerator_project_config,
    )

    pipeline.scheduler = DPMSolverMultistepScheduler.from_config(
        pipeline.scheduler.config, **scheduler_args)
    pipeline = pipeline.to(accelerator.device)

    if project_dir:
        pipeline.load_lora_weights(
            project_dir, weight_name="pytorch_lora_weights.safetensors")
    generator = torch.Generator(device=accelerator.device)

    translator = Translator()
    translation = translator.translate(prompt)
    prompt = translation.text

    safety_modules = {
        "feature_extractor": pipeline.feature_extractor,
        "safety_checker": pipeline.safety_checker}
    sr = DiffusionPipeline.from_pretrained(
        "stabilityai/stable-diffusion-x4-upscaler",
        **safety_modules,
        torch_dtype=torch.float16,
        cache_dir=cache_dir,
        local_files_only=local_files_only
    )
    sr.enable_model_cpu_offload()
    prompt_embeds, negative_embeds = pipeline.encode_prompt(prompt)

    image = pipeline(
        prompt_embeds=prompt_embeds,
        negative_prompt_embeds=negative_embeds,
        generator=generator,
        output_type="pt"
    ).images
    image = sr(prompt=prompt, image=image, generator=generator).images

    image_name = 'sample/1.png'
    gcsdir = f'{user_dir}/DeepFloyd1.png'
    image[0].save(image_name)
    url = upload_gcs(image_name, gcsdir)
    return url

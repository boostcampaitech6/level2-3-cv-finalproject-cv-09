from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
import torch 
from accelerate.utils import ProjectConfiguration, set_seed
from accelerate import Accelerator
from tqdm import tqdm
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

@celery_app.task(name="DeepFloyd")
def generate(user_dir, name, prompt, n_sample=1):
    #parser = argparse.ArgumentParser()
    #parser.add_argument('--prompt', metavar='TEXT', type=str, nargs='+',help='a long sentence or paragraph')
    #args = parser.parse_args()
    prompt = name+', '+prompt
    # 모형
    pipeline = DiffusionPipeline.from_pretrained("DeepFloyd/IF-I-XL-v1.0", torch_dtype=torch.float16)

    scheduler_args = {}
    variance_type = pipeline.scheduler.config.variance_type

    if variance_type in ["learned", "learned_range"]:
        variance_type = "fixed_small"

    scheduler_args["variance_type"] = variance_type
    project_dir = './output'
    accelerator_project_config = ProjectConfiguration(project_dir=project_dir, logging_dir='logs')

    accelerator = Accelerator(
        gradient_accumulation_steps=1,
        mixed_precision='fp16',
        project_config=accelerator_project_config,
    )

    pipeline.scheduler = DPMSolverMultistepScheduler.from_config(pipeline.scheduler.config, **scheduler_args)

    pipeline = pipeline.to(accelerator.device)

    if project_dir:
        pipeline.load_lora_weights(project_dir, weight_name="pytorch_lora_weights.safetensors")
    
    generator = torch.Generator(device=accelerator.device)

    num_inference_steps = 50
    # prompt = input()
    translator = Translator()
    # 번역
    translation = translator.translate(prompt)
    
    #prompt = translation.text
    safety_modules = {"feature_extractor": pipeline.feature_extractor, "safety_checker": pipeline.safety_checker}
    sr = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-x4-upscaler", **safety_modules, torch_dtype=torch.float16)
    sr.enable_model_cpu_offload()
    prompt_embeds, negative_embeds = pipeline.encode_prompt(prompt)
  
    image = pipeline(prompt_embeds=prompt_embeds, negative_prompt_embeds=negative_embeds, generator=generator, output_type="pt").images
    # SR
    image = sr(prompt=prompt, image=image, generator=generator).images
    
    image_name = '/sample/1.png'
    gcsdir = f'{user_dir}/1.png'
    image[0].save(image_name)
    url = upload_gcs(image_name, gcsdir)
    #os.remove(image_name)
    
    return url


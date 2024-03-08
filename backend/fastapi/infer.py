from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
import torch 
from accelerate.utils import ProjectConfiguration, set_seed
from accelerate import Accelerator
from tqdm import tqdm
from transformers import T5Tokenizer
import datetime
import os

def generate(prompt,n_sample=4):

    # 모형
    pipeline = pipeline = DiffusionPipeline.from_pretrained("DeepFloyd/IF-I-XL-v1.0", torch_dtype=torch.float16)

    scheduler_args = {}
    variance_type = pipeline.scheduler.config.variance_type

    if variance_type in ["learned", "learned_range"]:
        variance_type = "fixed_small"

    scheduler_args["variance_type"] = variance_type

    project_dir = '/data/ephemeral/home/fastapi/output/checkpoint-15000'
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
    
    safety_modules = {"feature_extractor": pipeline.feature_extractor, "safety_checker": pipeline.safety_checker}
    sr = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-x4-upscaler", **safety_modules, torch_dtype=torch.float16)
    sr.enable_model_cpu_offload()
    prompt_embeds, negative_embeds = pipeline.encode_prompt(prompt)

    save_files = []
    suffix = datetime.datetime.now().strftime('%y%m%d%H%M%S')
    os.mkdir('/data/ephemeral/home/fastapi/images/'+ suffix)
    
    for i in range(n_sample):
        image = pipeline(prompt_embeds=prompt_embeds, negative_prompt_embeds=negative_embeds, generator=generator, output_type="pt").images
        # SR
        image = sr(prompt=prompt, image=image, generator=generator, noise_level=100).images
        image[0].save('/data/ephemeral/home/fastapi/images/'+ suffix+ '/' +f'{prompt}_{i+1}.png')
        save_files.append('/data/ephemeral/home/fastapi/images/'+ suffix+ '/' +f'{prompt}_{i+1}.png')
    
    return save_files
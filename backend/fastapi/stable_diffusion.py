# Module
from diffusers import DiffusionPipeline
from googletrans import Translator
import torch
import datetime

def ImageCreate(prompt):
    # Stable diffusion model
    pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
    # Device
    pipe.to("cuda")

    # Input text
    #prompt = input()

    # 번역기fld
    translator = Translator()
    # 번역
    translation = translator.translate(prompt)

    # 사진 생성
    images = pipe(prompt=translation.text).images[0]

    # 사진 저장
    suffix = datetime.datetime.now().strftime('%y%m%d%H%M%S')
    fileName = 'images/' + suffix + '.png'
    images.save(fileName)

    return fileName

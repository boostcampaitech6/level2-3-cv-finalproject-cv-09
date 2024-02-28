# Module
from diffusers import DiffusionPipeline
from googletrans import Translator
import torch

# Stable diffusion model
pipe = DiffusionPipeline.from_pretrained("stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, use_safetensors=True, variant="fp16")
# Device
pipe.to("cpu")

# Input text
#prompt = input()
prompt="logo, blue"

# 번역기
translator = Translator()
# 번역
translation = translator.translate(prompt)

# 사진 생성
images = pipe(prompt=translation.text).images[0]

# 사진 저장
images.save('result.png')
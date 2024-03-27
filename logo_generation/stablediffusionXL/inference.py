from diffusers import StableDiffusionXLPipeline
import torch


def main(prompt, negative_prompt=None, lora_path=None, image_count=1, seed=0):
    pipeline = StableDiffusionXLPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", torch_dtype=torch.float16, variant="fp16", use_safetensors=True
    ).to("cuda")
    
    if lora_path:
        pipeline.load_lora_weights(lora_path)
    
    for i in range(image_count):
        image = pipeline(
            prompt=prompt, 
            negative_prompt=negative_prompt, 
            num_inference_steps=30, 
            generator = torch.manual_seed(seed), 
        ).images[0]
        image.save(f'./{i}.png')


if __name__ == "__main__":
    lora_path = '/data/ephemeral/home/level2-3-cv-finalproject-cv-09/logo_generation/stablediffusionXL/lora/pytorch_lora_weights.safetensors'
    image_count = 1
    prompt = 'a logo of coffee shop, background white, modern, minimalism, vector art, 2d'
    negative_prompt = 'low quality, bad composition, extra digit, text, inscription, watermark, label'
    seed = 0
    
    main(
        prompt=prompt, 
        negative_prompt=negative_prompt, 
        lora_path=lora_path, 
        image_count=image_count
    )
    
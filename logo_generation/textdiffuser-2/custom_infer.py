import string
import time
from tqdm import tqdm
from PIL import Image, ImageDraw, ImageFont

import torch
from transformers import CLIPTextModel, CLIPTokenizer
from transformers import AutoTokenizer, AutoModelForCausalLM
from diffusers import AutoencoderKL, UNet2DConditionModel, DDPMScheduler
from fastchat.model import get_conversation_template


alphabet = string.digits + string.ascii_lowercase + \
    string.ascii_uppercase + string.punctuation + ' '
font_layout = ImageFont.truetype("./arial.ttf", 32)
cache_dir = 'model_cache'
local_files_only = False

m1_model_path = 'JingyeChen22/textdiffuser2_layout_planner'

m1_tokenizer = AutoTokenizer.from_pretrained(
    m1_model_path,
    use_fast=False,
    cache_dir=cache_dir,
    local_files_only=local_files_only
)

m1_model = AutoModelForCausalLM.from_pretrained(
    m1_model_path,
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True,
    cache_dir=cache_dir,
    local_files_only=local_files_only
).cuda()

clip_path = 'JingyeChen22/textdiffuser2-full-ft'

text_encoder = CLIPTextModel.from_pretrained(
    clip_path,
    subfolder="text_encoder",
    ignore_mismatched_sizes=True,
    cache_dir=cache_dir,
    local_files_only=local_files_only,
).cuda().half()


stable_diffusion_path = 'runwayml/stable-diffusion-v1-5'

tokenizer = CLIPTokenizer.from_pretrained(
    stable_diffusion_path,
    subfolder="tokenizer",
    cache_dir=cache_dir,
    local_files_only=local_files_only,
)


print('***************')
print(len(tokenizer))
for i in range(520):
    tokenizer.add_tokens(['l' + str(i)])
    tokenizer.add_tokens(['t' + str(i)])
    tokenizer.add_tokens(['r' + str(i)])
    tokenizer.add_tokens(['b' + str(i)])
for c in alphabet:
    tokenizer.add_tokens([f'[{c}]'])
print(len(tokenizer))
print('***************')

vae = AutoencoderKL.from_pretrained(
    stable_diffusion_path,
    subfolder="vae",
    cache_dir=cache_dir,
    local_files_only=local_files_only,
).half().cuda()

unet = UNet2DConditionModel.from_pretrained(
    'JingyeChen22/textdiffuser2-full-ft',
    subfolder="unet",
    cache_dir=cache_dir,
    local_files_only=local_files_only,
).half().cuda()

text_encoder.resize_token_embeddings(len(tokenizer))


def get_layout_image(ocrs):
    blank = Image.new('RGB', (256, 256), (0, 0, 0))
    draw = ImageDraw.ImageDraw(blank)
    for line in ocrs.split('\n'):
        line = line.strip()
        if len(line) == 0:
            break
        pred = ' '.join(line.split()[:-1])
        box = line.split()[-1]
        l, t, r, b = [int(i)*2 for i in box.split(',')]
        draw.rectangle([(l, t), (r, b)], outline="red")
        draw.text((l, t), pred, font=font_layout)
    return blank


def text_to_image(
    prompt, keywords, positive_prompt, radio, sampling_step,
    guidance, batch, temperature, natural
):
    time1 = time.time()
    print(
        f'[info] Prompt: {prompt} | Keywords: {keywords} | Radio: {radio} | \
        Steps: {sampling_step} | Guidance: {guidance} | Natural: {natural}')

    if len(positive_prompt.strip()) != 0:
        prompt += positive_prompt

    with torch.no_grad():
        user_prompt = prompt
        keywords = keywords.split('/')
        keywords = [i.strip() for i in keywords]
        template = f'Given a prompt that will be used to generate an image, \
        plan the layout of visual text for the image. The size of the image \
        is 128x128. Therefore, all properties of the positions should not \
        exceed 128, including the coordinates of top, left, right, and bottom.\
        In addition, we also provide all keywords at random order for \
        reference. You dont need to specify the details of font styles.\
        At each line, the format should be keyword left, top, right, bottom.\
        So let us begin. Prompt: {prompt}. Keywords: {str(keywords)}'

        msg = template
        conv = get_conversation_template(m1_model_path)
        conv.append_message(conv.roles[0], msg)
        conv.append_message(conv.roles[1], None)
        prompt = conv.get_prompt()
        inputs = m1_tokenizer([prompt], return_token_type_ids=False)
        inputs = {k: torch.tensor(v).to('cuda') for k, v in inputs.items()}
        output_ids = m1_model.generate(
            **inputs,
            do_sample=True,
            temperature=temperature,
            repetition_penalty=1.0,
            max_new_tokens=512,
        )

        if m1_model.config.is_encoder_decoder:
            output_ids = output_ids[0]
        else:
            output_ids = output_ids[0][len(inputs["input_ids"][0]):]
        outputs = m1_tokenizer.decode(
            output_ids, skip_special_tokens=True,
            spaces_between_special_tokens=False
        )
        print(f"[{conv.roles[0]}]\n{msg}")
        print(f"[{conv.roles[1]}]\n{outputs}")
        layout_image = get_layout_image(outputs)

        ocrs = outputs.split('\n')
        time2 = time.time()
        print(time2-time1)

        current_ocr = ocrs

        ocr_ids = []
        print('user_prompt', user_prompt)
        print('current_ocr', current_ocr)

        for ocr in current_ocr:
            ocr = ocr.strip()

            if len(ocr) == 0 or '###' in ocr or '.com' in ocr:
                continue

            items = ocr.split()
            pred = ' '.join(items[:-1])
            box = items[-1]

            l, t, r, b = box.split(',')
            l, t, r, b = int(l), int(t), int(r), int(b)
            ocr_ids.extend(['l'+str(l), 't'+str(t), 'r'+str(r), 'b'+str(b)])

            char_list = list(pred)
            char_list = [f'[{i}]' for i in char_list]
            ocr_ids.extend(char_list)
            ocr_ids.append(tokenizer.eos_token_id)

        caption_ids = tokenizer(
            user_prompt, truncation=True, return_tensors="pt"
        ).input_ids[0].tolist()

        try:
            ocr_ids = tokenizer.encode(ocr_ids)
            prompt = caption_ids + ocr_ids
        except:
            prompt = caption_ids

        user_prompt = tokenizer.decode(prompt)
        composed_prompt = tokenizer.decode(prompt)

        prompt = prompt[:77]
        while len(prompt) < 77:
            prompt.append(tokenizer.pad_token_id)

        prompts_cond = prompt
        prompts_nocond = [tokenizer.pad_token_id]*77

        prompts_cond = [prompts_cond] * batch
        prompts_nocond = [prompts_nocond] * batch

        prompts_cond = torch.Tensor(prompts_cond).long().cuda()
        prompts_nocond = torch.Tensor(prompts_nocond).long().cuda()

        scheduler = DDPMScheduler.from_pretrained(
            'runwayml/stable-diffusion-v1-5',
            subfolder="scheduler",
            cache_dir=cache_dir,
            local_files_only=local_files_only,
        )
        scheduler.set_timesteps(sampling_step)
        noise = torch.randn((batch, 4, 64, 64)).to("cuda").half()
        input = noise

        encoder_hidden_states_cond = text_encoder(prompts_cond)[0].half()
        encoder_hidden_states_nocond = text_encoder(prompts_nocond)[0].half()

        for t in tqdm(scheduler.timesteps):
            with torch.no_grad():
                noise_pred_cond = unet(
                    sample=input, timestep=t,
                    encoder_hidden_states=encoder_hidden_states_cond[:batch]
                ).sample
                noise_pred_uncond = unet(
                    sample=input, timestep=t,
                    encoder_hidden_states=encoder_hidden_states_nocond[:batch]
                ).sample
                noisy_residual = noise_pred_uncond + guidance * (
                    noise_pred_cond - noise_pred_uncond)
                input = scheduler.step(noisy_residual, t, input).prev_sample
                del noise_pred_cond
                del noise_pred_uncond

                torch.cuda.empty_cache()

        # decode
        input = 1 / vae.config.scaling_factor * input
        images = vae.decode(input, return_dict=False)[0]
        width, height = 512, 512
        results = []
        new_image = Image.new('RGB', (2*width, 2*height))
        for index, image in enumerate(images.cpu().float()):
            image = (image / 2 + 0.5).clamp(0, 1).unsqueeze(0)
            image = image.cpu().permute(0, 2, 3, 1).numpy()[0]
            image = Image.fromarray(
                (image * 255).round().astype("uint8")).convert('RGB')
            results.append(image)
            row = index // 2
            col = index % 2
            new_image.paste(image, (col*width, row*height))
        torch.cuda.empty_cache()

        output_paths = []
        for i, sample in enumerate(results):
            output_path = f"./results/out-{i}.png"
            sample.save(output_path)
            output_paths.append(output_path)
        return tuple(results), composed_prompt, layout_image


text_to_image(
    prompt='',
    keywords='',
    positive_prompt=', logo vectorize, digital art, very detailed, \
        high definition, cinematic light, trending on artstation',
    sampling_step=20,
    guidance=7.5,
    batch=4,
    natural=False,
    temperature=1.4,
    radio='TextDiffuser-2'
)

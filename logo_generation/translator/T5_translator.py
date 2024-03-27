from transformers import MT5ForConditionalGeneration, T5Tokenizer
import torch

# Tokenizer
tokenizer = T5Tokenizer.from_pretrained('google/mt5-base')

# 모형
model = MT5ForConditionalGeneration.from_pretrained('MrBananaHuman/ko_en_translator')

# 장치
device = torch.device('cuda')
model.to(device)

# Add <sep> token
tokenizer.add_special_tokens({'additional_special_tokens':['<sep>']})

def ko_en_translator(sents):
    
    input_sents = [sents]
    
    encoding = tokenizer.encode_plus('translate Korean to English: ' + "<sep>".join(input_sents), return_tensors="pt")
    input_ids, attention_masks = encoding["input_ids"], encoding["attention_mask"]
    
    output = model.generate(input_ids=input_ids.to(device),
                                       attention_mask=attention_masks.to(device),
                                       do_sample=True,
                                       max_length=128,
                                       early_stopping=True,
                                       num_beams=20,
                                       num_return_sequences=1,
                                       min_length=1,
                                       temperature=1,
                                       repetition_penalty=1.2,
                                       )
    
    korean =  tokenizer.decode(output[0], skip_special_tokens=True,clean_up_tokenization_spaces=True)
    
    return korean.strip()

if __name__ == '__main__':
    sents = input('Input : ')
    print(ko_en_translator(sents))
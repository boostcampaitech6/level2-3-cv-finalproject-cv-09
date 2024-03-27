# pip install googletrans==4.0.0rc1

import os
from tqdm import tqdm
import time
from googletrans import Translator

# 기존 txt 파일이 있는 폴더의 주소
label_path = '/workspace/logo_gen_project/selected_data/labels_v2'
# 새롭게 생성한 txt 파일을 저장할 폴더의 주소
output_label_path = '/workspace/logo_gen_project/selected_data/labels_en_ver'

translator = Translator()

i = 1
for label in tqdm(os.listdir(label_path)):
    if os.path.exists(os.path.join(output_label_path, label)):
        continue
    if not i%130:
        time.sleep(1)
        print('다시 모델 할당')
        translator = Translator()
        i = 0

    with open(os.path.join(label_path, label), 'r') as f:
        txt = f.read().strip()
        res = translator.translate(txt, src='ko', dest='en')    
        
    with open(os.path.join(output_label_path, label), 'w') as f:
        f.write(res.text.replace('The background',' The background',1))
    i += 1
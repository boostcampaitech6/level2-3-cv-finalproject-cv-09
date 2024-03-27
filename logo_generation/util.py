import os
from googletrans import Translator
from tqdm import tqdm
from detoxify import Detoxify
    
def label_ko2en():
    label_path = '/data/ephemeral/home/dataset/label/'
    en_label_path = '/data/ephemeral/home/dataset/en_label/'
    if not os.path.exists(en_label_path): os.makedirs(en_label_path)
    
    label_list = os.listdir(label_path)
    i = 0
    for label in tqdm(label_list):
        if not i%40:
            translator = Translator()
        with open(label_path + label, 'r') as f:
            txt = f.read().strip()
        res = translator.translate(txt, src='ko', dest='en')
        with open(en_label_path + label, 'w') as f:
            f.write(res.text)
        i += 1
    
    
def check_toxic(text):
  i = 0
  result1 = Detoxify('original').predict(text)
  result2 = Detoxify('unbiased').predict(text)
  result3 = Detoxify('multilingual').predict(text)
  
  for r1 in result1.values():
    if r1 > 0.5:
      i += 1
      break
  for r2 in result2.values():
    if r2 > 0.5:
      i += 1
      break
  for r3 in result3.values():
    if r3 > 0.5:
      i += 1
      break
  
  if i >= 2:
    return True
  
  else:
    return False

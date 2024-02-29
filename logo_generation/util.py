import os
import gdown
from googletrans import Translator
from tqdm import tqdm

    
def label_ko2en():
    label_path = '/data/ephemeral/home/dataset/label/'
    en_label_path = '/data/ephemeral/home/dataset/en_label/'
    if not os.path.exists(en_label_path): os.makedirs(en_label_path)
    
    label_list = os.listdir(label_path)
    # translator = Translator()
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
    
if __name__ == "__main__":
    label_ko2en()
    
    
import numpy as np
import torch
from PIL import Image
from parseq.strhub.data.module import SceneTextDataModule

parseq = torch.hub.load('baudm/parseq', 'parseq', pretrained=True).eval()
img_transform = SceneTextDataModule.get_transform(parseq.hparams.img_size)

img = Image.open('./output/out-0.png').convert('RGB')
img = img_transform(img).unsqueeze(0)

logits = parseq(img)

def cal_sim(str1, str2):
    """
    Normalized Edit Distance metric (1-N.E.D specifically)
    """
    m = len(str1) + 1
    n = len(str2) + 1
    matrix = np.zeros((m, n))
    for i in range(m):
        matrix[i][0] = i
        
    for j in range(n):
        matrix[0][j] = j

    for i in range(1, m):
        for j in range(1, n):
            if str1[i - 1] == str2[j - 1]:
                matrix[i][j] = matrix[i - 1][j - 1]
            else:
                matrix[i][j] = min(matrix[i - 1][j - 1], min(matrix[i][j - 1], matrix[i - 1][j])) + 1
    
    lev = matrix[m-1][n-1]
    if (max(m-1,n-1)) == 0:
        sim = 1.0
    else:
        sim = 1.0-lev/(max(m-1,n-1))
    return sim

# Greedy decoding
pred = logits.softmax(-1)
label, confidence = parseq.tokenizer.decode(pred)
print('Decoded label = {}'.format(label[0]))
print(cal_sim(label[0], 'hello1'))

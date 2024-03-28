import os
from tqdm import tqdm

import cv2
import numpy as np
from PIL import Image, ImageDraw

import torch
from torchvision import transforms

from CRAFT.model import CRAFT
from config import cfg


def plot_boxes(img, boxes):
    if boxes is None:
        return img
    draw = ImageDraw.Draw(img)
    for box in boxes:
        draw.polygon(
            [
                box[0], box[1], box[2], box[3],
                box[4], box[5], box[6], box[7]
            ], outline=(0, 255, 0))
    return img


def resize_img(img, long_side):
    w, h = img.size
    if long_side is not None:
        if w > h:
            resize_w = long_side
            ratio = long_side / w
            resize_h = h * ratio
        else:
            resize_h = long_side
            ratio = long_side / h
            resize_w = w * ratio
    else:
        resize_h, resize_w = h, w

    final_h = int(resize_h) if resize_h % 32 == 0 else (int(resize_h / 32) + 1) * 32
    final_w = int(resize_w) if resize_w % 32 == 0 else (int(resize_w / 32) + 1) * 32
    img = img.resize((final_w, final_h), Image.BILINEAR)
    ratio_h = final_h / h
    ratio_w = final_w / w
    return img, ratio_h, ratio_w


def load_pil(img):
    t = transforms.Compose(
        [
            transforms.ToTensor(),
            transforms.Normalize(cfg.train.mean, cfg.train.std)])
    return t(img).unsqueeze(0)


def get_score(img, model, device):
    with torch.no_grad():
        region, affinity = model(load_pil(img).to(device))
    return list(map(lambda x: x[0][0].cpu().numpy(), [region, affinity]))


def restore_boxes(region, affinity, region_thresh, affinity_thresh, remove_thresh, ratio):
    boxes = []
    M = (region > region_thresh) + (affinity > affinity_thresh)
    ret, markers = cv2.connectedComponents(np.uint8(M * 255))
    for i in range(ret):
        if i == 0:
            continue
        y, x = np.where(markers == i)
        if len(y) < region.size * remove_thresh:
            continue
        cords = 2 * np.concatenate((x.reshape(-1, 1)/ratio[1], y.reshape(-1, 1) / ratio[0]), axis=1)
        a = np.array([cords[:, 0].min(), cords[:, 1].min(), cords[:, 0].max(), cords[:, 1].min(), cords[:, 0].max(), cords[:, 1].max(), cords[:, 0].min(), cords[:, 1].max()])
        boxes.append(a)
    return boxes, M


def detect_single_image(img, model, device, cfg):
    img, ratio_h, ratio_w = resize_img(img, cfg.long_side)
    region, affinity = get_score(img, model, device)
    boxes, M = restore_boxes(
        region, affinity, cfg.region_thresh, cfg.affinity_thresh,
        cfg.remove_thresh, (ratio_h, ratio_w))
    return boxes, region, affinity, M


def detect_dataset(model, device, submit_path, cfg, th1=None, th2=None, th3=None):
    img_files = os.listdir(cfg.dataset_test_path)
    img_files = sorted([
        os.path.join(cfg.dataset_test_path, img_file) for img_file in img_files
        ])

    for i, img_file in enumerate(img_files):
        print('evaluating {} image'.format(i), end='\r')
        boxes = detect_single_image(Image.open(img_file), model, device, cfg)
        seq = []
        for box in boxes:
            x_min = min(box[0], box[2], box[4], box[6])
            x_max = max(box[0], box[2], box[4], box[6])
            y_min = min(box[1], box[3], box[5], box[7])
            y_max = max(box[1], box[3], box[5], box[7])
            seq.append(','.join([str(int(v)) for v in [x_min, y_min, x_max - x_min, y_max - y_min]]) + '\n')
        with open(os.path.join(submit_path, 'res_' + os.path.basename(img_file).replace('.jpg','.txt')), 'w') as f:
            f.writelines(seq)


if __name__ == '__main__':
    img_files = [img for img in sorted(os.listdir('../aihub_images'))]
    model_path = './pths/pretrain/model_iter_50000.pth'
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model = CRAFT().to(device)
    model.load_state_dict(torch.load(model_path, map_location='cuda:0'))
    model.eval()
    for img_path in tqdm(img_files):
        img = Image.open(os.path.join('../../dataset/aihub_images', img_path))
        img_npy = img_path.replace('jpg', 'npy')
        img_txt = img_path.replace('jpg', 'txt')
        boxes, region, affinity, M = detect_single_image(
            img, model, device, cfg.test)
        seq = []
        for box in boxes:
            x_min = min(box[0], box[2], box[4], box[6])
            x_max = max(box[0], box[2], box[4], box[6])
            y_min = min(box[1], box[3], box[5], box[7])
            y_max = max(box[1], box[3], box[5], box[7])
            seq.append(','.join(
                [str(int(v)) for v in [x_min, y_min, x_max - x_min, y_max - y_min]]
            ) + '\n')
        with open(f'../../dataset/detect/{img_txt}', 'w') as f:
            f.writelines(seq)
        M = M.astype(int)
        img = img.resize(M.shape)
        img.save(f'../../dataset/img_data/{img_path}')
        np.save(f'../../dataset/charseg_npy/{img_npy}', M)

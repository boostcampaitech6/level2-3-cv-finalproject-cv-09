from easydict import EasyDict as edict

cfg = edict()

cfg.train = edict()
cfg.train.synthtext_img_path = '../data/SynthText'
cfg.train.synthtext_gt_path = '../data/SynthText'
cfg.train.scale = 0.5
cfg.train.crop_length = 640
cfg.train.mean = [0.5, 0.5, 0.5]
cfg.train.std = [0.25, 0.25, 0.25]
cfg.train.batch_size = 16
cfg.train.num_workers = 4
cfg.train.drop_last = True
cfg.train.shuffle = True
cfg.train.lr = 0.001
cfg.train.epoch_iter = 2
cfg.train.milestones = [0.5, 1.5]
cfg.train.gamma = 0.1
cfg.train.pths_path = './pths/pretrain'
cfg.train.save_interval = 1000

cfg.test = edict()
cfg.test.model_pth = './pths/ft/model_iter_31600.pth'
cfg.test.dataset_test_path = '../../dataset/aihub_images'
cfg.test.submit_path = '../../dataset/final'
cfg.test.save_dataset_res = True
cfg.test.region_thresh = 0.09
cfg.test.affinity_thresh = 0.07
cfg.test.remove_thresh = 6 * 1e-4
cfg.test.long_side = 960

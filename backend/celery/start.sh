nohup poetry run celery -A worker_deepfloyd worker -Q DeepFloyd_queue --loglevel=info --pool=solo &
nohup poetry run celery -A worker_td worker -Q TD_queue --loglevel=info --pool=solo &
nohup poetry run celery -A worker_sd2 worker -Q SD2_queue --loglevel=info --pool=solo &
nohup poetry run celery -A worker_sdxl worker -Q SDXL_queue --loglevel=info --pool=solo &
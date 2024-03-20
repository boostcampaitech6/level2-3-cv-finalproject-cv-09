from datetime import datetime, timedelta
import os

from google.cloud import storage
from google.oauth2 import service_account

def upload_gcs(image_dir, file_name):
    KEY_PATH = "/data/ephemeral/home/celery/gcskey.json"
    credentials = service_account.Credentials.from_service_account_file(KEY_PATH)
    bucket_name = "klogogenimgserver"
    client = storage.Client(credentials=credentials)
    
    bucket = client.bucket(bucket_name)
    
    blob = bucket.blob(file_name)
    blob.upload_from_filename(image_dir)
    extime = datetime.now() + timedelta(days=30)
    url = blob.generate_signed_url(expiration=extime, response_disposition="attachment")
    return url
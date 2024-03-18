from typing import Union, Optional

import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import base64

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Fastapi 모듈
from fastapi import FastAPI

#Celery 요청 및 결과 수신을 위한 모듈
from celery import Celery
from celery.result import AsyncResult

REDIS_URL= "www.klogogen.studio:7090"
REDIS_PASSWORD= "bc0709!"

connection_url = f"redis://:{REDIS_PASSWORD}@{REDIS_URL}"

backend = connection_url+"/0"
broker = connection_url+"/0"

celery_app = Celery("tasks", backend=backend, broker=broker)


class Item(BaseModel):
    name: str
    price: float
    is_offer: Union[bool, None] = None
    
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}

#이미지를 base64로 인코딩하여 전송
def encode_image(image_path):
    with open(image_path, "rb") as img_file:
        encoded_string = base64.b64encode(img_file.read()).decode('utf-8')
    return encoded_string

class Prompt(BaseModel):
    user_id: str
    name: str
    prompt: Optional[str] = None

@app.post("/prompt") #이미지 prompt를 받아 생성후 전송
def gen_image(prompt: Prompt):
    user_dir = prompt.user_id +'/'+ datetime.now().strftime('%y%m%d%H%M')
    #task_name = [ "DeepFloyd", "SDXL", "SD2" ]
    task_name = [ "SD2" ]
    task_id = []
    for i in task_name:
        task = celery_app.send_task(i, args=[user_dir, prompt.name, prompt.prompt])
        task_id.append(task.id)
    return {"task_id":task_id}

@app.get("/get_image/{task_id}") #이미지 prompt를 받아 생성후 전송
def get_image(task_id: str):
    task_result=AsyncResult(task_id, app=celery_app)
    result = task_result.get()
    return {"status":str(task_result.status), "result":result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
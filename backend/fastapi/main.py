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
    
@app.get("/api")
def read_root():
    return {"Hello": "World"}

class Prompt(BaseModel):
    user_id: str
    name: str
    prompt: Optional[str] = None

@app.post("/api/prompt") #이미지 prompt를 받아 생성후 전송
def gen_image(prompt: Prompt):
    user_dir = prompt.user_id +'/'+ datetime.now().strftime('%y%m%d%H%M')
    
    #task_name = ["SDs"]
    task_id = []
    task = celery_app.send_task("DeepFloyd", args=[user_dir, prompt.name, prompt.prompt], queue="DeepFloyd_queue")
    task_id.append(task.id)
    task = celery_app.send_task("TD", args=[user_dir, prompt.name, prompt.prompt], queue="TD_queue")
    task_id.append(task.id)
    task = celery_app.send_task("SDs", args=[user_dir, prompt.name, prompt.prompt], queue="SDs_queue")
    task_id.append(task.id)
    return {"task_id":task_id}

class TaskID(BaseModel):
    dp_id: str
    td_id:str
    sd_id: str

@app.post("/api/get_image/") #이미지 prompt를 받아 생성후 전송
def get_image(task_id: TaskID):
    DP_result=AsyncResult(task_id.dp_id, app=celery_app)
    TD_result=AsyncResult(task_id.td_id, app=celery_app)
    SD_result=AsyncResult(task_id.sd_id, app=celery_app)
    if (not DP_result.ready()) or (not TD_result.ready()) or (not SD_result.ready()):
        return {"status": str(SD_result.status)}
    result = []
    result.append(DP_result.get())
    result.append(TD_result.get())
    print(SD_result.get())
    result.append(SD_result.get()[0])
    result.append(SD_result.get()[1])
    return {"status": str(SD_result.status), "result": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
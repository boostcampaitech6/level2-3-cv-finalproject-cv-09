from typing import Union, Optional

import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import base64
from googleapiclient import discovery
import json
import requests

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

REDIS_URL= "localhost:7090"
REDIS_PASSWORD= "bc0709!"

connection_url = f"redis://:{REDIS_PASSWORD}@{REDIS_URL}"

backend = connection_url+"/0"
broker = connection_url+"/0"

celery_app = Celery("tasks", backend=backend, broker=broker)


    
@app.get("/api")
def read_root():
    return {"Hello": "World"}

@app.get("/api/perspectiveapi/{prompt}")
def PerspectiveAPI(prompt: str):
    API_KEY = 'AIzaSyAYnTflzIHVmWuKci4ypGdzuHkC9-Ds-Q0'
    API_URL = "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze"
    
    # 분석하고자 하는 속성 목록
    # 여러 LANGUAGES 지원 영어 : en , 언어별 지원 attributes 다름. 확인해야함
    # 공식문서 https://developers.perspectiveapi.com/s/about-the-api-attributes-and-languages?language=en_US
    attributes = ["TOXICITY", "INSULT", "THREAT", "PROFANITY"]
    data = {
        "comment": {"text": prompt},
        "languages": ["ko"],
        "requestedAttributes": {attr: {} for attr in attributes}
    }
    
    params = {
        "key": API_KEY
    }
    
    # Google Perspective API 호출
    response = requests.post(API_URL, params=params, json=data)
    result = response.json()
    
    # 점수가 0.5를 넘는 속성의 개수 계산
    over_threshold_count = sum(
        1 for attr, details in result["attributeScores"].items()
        if details["summaryScore"]["value"] > 0.5
    )
    
    # 한개 이상의 점수가 0.5를 넘으면 False, 그렇지 않으면 True 반환
    return over_threshold_count < 1
    
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
    task = celery_app.send_task("SD2", args=[user_dir, prompt.name, prompt.prompt], queue="SD2_queue")
    task_id.append(task.id)
    task = celery_app.send_task("SDXL", args=[user_dir, prompt.name, prompt.prompt], queue="SDXL_queue")
    task_id.append(task.id)
    return {"task_id":task_id}

class TaskID(BaseModel):
    dp_id: str
    td_id:str
    sd2_id: str
    sdxl_id: str

@app.post("/api/get_image/") #이미지 prompt를 받아 생성후 전송
def get_image(task_id: TaskID):
    DP_result=AsyncResult(task_id.dp_id, app=celery_app)
    TD_result=AsyncResult(task_id.td_id, app=celery_app)
    SD2_result=AsyncResult(task_id.sd2_id, app=celery_app)
    SDXL_result=AsyncResult(task_id.sdxl_id, app=celery_app)
    if (not DP_result.ready()) or (not TD_result.ready()) or (not SD2_result.ready()) or (not SDXL_result.ready()):
        return {"status": str(SDXL_result.status)}
    result = []
    result.append(DP_result.get())
    result.append(TD_result.get())
    result.append(SD2_result.get())
    result.append(SDXL_result.get())
    return {"status": str(SDXL_result.status), "result": result}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
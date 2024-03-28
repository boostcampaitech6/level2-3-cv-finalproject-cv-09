from typing import Optional
from datetime import datetime

import uvicorn
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

from celery import Celery
from celery.result import AsyncResult

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

REDIS_URL = "localhost:7090"
REDIS_PASSWORD = "bc0709!"

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
        1 for _, details in result["attributeScores"].items()
        if details["summaryScore"]["value"] > 0.5
    )
    return over_threshold_count < 1


class Prompt(BaseModel):
    user_id: str
    name: str
    prompt: Optional[str] = None


@app.post("/api/prompt")
def gen_image(prompt: Prompt):

    user_dir = prompt.user_id + '/' + datetime.now().strftime('%y%m%d%H%M')

    task_id = []
    task = celery_app.send_task(
        "DeepFloyd", args=[user_dir, prompt.name, prompt.prompt],
        queue="DeepFloyd_queue")
    task_id.append(task.id)
    task = celery_app.send_task(
        "TD", args=[user_dir, prompt.name, prompt.prompt],
        queue="TD_queue")
    task_id.append(task.id)
    task = celery_app.send_task(
        "SD2", args=[user_dir, prompt.name, prompt.prompt],
        queue="SD2_queue")
    task_id.append(task.id)
    task = celery_app.send_task(
        "SDXL", args=[user_dir, prompt.name, prompt.prompt],
        queue="SDXL_queue")
    task_id.append(task.id)
    return {"task_id": task_id}


class TaskID(BaseModel):
    dp_id: str
    td_id: str
    sd2_id: str
    sdxl_id: str


@app.post("/api/get_image/")
def get_image(task_id: TaskID):
    DP_result = AsyncResult(task_id.dp_id, app=celery_app)
    TD_result = AsyncResult(task_id.td_id, app=celery_app)
    SD2_result = AsyncResult(task_id.sd2_id, app=celery_app)
    SDXL_result = AsyncResult(task_id.sdxl_id, app=celery_app)
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

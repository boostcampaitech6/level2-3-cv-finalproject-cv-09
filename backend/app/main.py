from typing import Union, Optional

import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
from stable_diffusion import ImageCreate
from fastapi.middleware.cors import CORSMiddleware
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
    name: str
    prompt: Optional[str] = None

@app.post("/prompt") #이미지 prompt를 받아 생성후 전송
def get_image(prompt: Prompt):
    filename = ImageCreate(prompt.name+prompt.prompt)
    encoded_image = encode_image(filename)
    return {"image": encoded_image}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
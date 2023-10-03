from io import BytesIO

import torch
from fastapi import FastAPI, File, UploadFile
from PIL import Image

app = FastAPI()

model = torch.hub.load("ultralytics/yolov5", "custom", path="best.onnx")


@app.post("/")
async def process(file: UploadFile = File(...)):
    results = model(Image.open(BytesIO(await file.read())))
    return results.pandas().xyxy[0].to_dict(orient="records")

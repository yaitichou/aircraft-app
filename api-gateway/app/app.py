# app/main.py
from fastapi import FastAPI, File, UploadFile
import requests
import aiofiles
import json
import os
from PIL import Image

app = FastAPI(title="Api Gateway")


@app.post("/detection")
async def request_detection(file: UploadFile = File(...)):

    # Save the file temporarily 
    out_file_path = file.filename
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk

    # Resize to get a square image
    img = Image.open(out_file_path)
    max_dim = max(img.size)
    img = img.resize((max_dim, max_dim))
    img.save(out_file_path)

    # Request for plane model detection
    r = requests.post('http://nginx:80/ms-detection',files={'file': open(out_file_path,'rb')})

    list_detections = json.loads(r.content)

    # Save result in database
    r_save = requests.post('http://nginx:80/ms-storage/store_result',files={
        'detection': (None, json.dumps({'result':list_detections}), 'application/json'),
        'file': open(out_file_path,'rb')
        })

    # Delete file
    os.remove(out_file_path)

    await request_search_all()
    
    return r.content

@app.get("/search_all")
async def request_search_all():

    # Get all stored detections
    r = requests.get('http://nginx:80/ms-storage/search_all')

    return r.content



# app/main.py
from fastapi import FastAPI, File, UploadFile
import requests
import aiofiles
import json
import os

app = FastAPI(title="Api Gateway")


@app.post("/detection")
async def request_detection(file: UploadFile = File(...)):

    out_file_path = file.filename
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk
            
    r = requests.post('http://nginx:80/ms-detection',files={'file': open(out_file_path,'rb')})

    list_detections = json.loads(r.content)

    for detection in list_detections:
        detection['_class'] = detection.pop('class')
    

    r_save = requests.post('http://nginx:80/ms-storage/store_result',files={
        'detection': (None, json.dumps({'result':list_detections}), 'application/json'),
        'file': open(out_file_path,'rb')
        })

    os.remove(out_file_path)

    await request_search_all()
    
    return r.content

@app.get("/search_all")
async def request_search_all():
    r = requests.get('http://nginx:80/ms-storage/search_all')

    return r.content



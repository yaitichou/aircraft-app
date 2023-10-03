# app/main.py
from fastapi import FastAPI, File, UploadFile, Body 
from typing import List
from pydantic import BaseModel
import requests
import aiofiles
import os
import json


app = FastAPI(title="StorageAPI")

@app.post("/store-result")
async def request_detection(detection: str = Body(...), file: UploadFile = File(...)):
    
    # Read received data as json
    json_data = json.loads(detection)

    # Store the file on server
    out_file_path = "/ms-storage-data/upload/"+file.filename
    async with aiofiles.open(out_file_path, 'wb') as out_file:
        while content := await file.read(1024):  # async read chunk
            await out_file.write(content)  # async write chunk

    data_to_save = {
        "result":json_data['result'],
        "path":out_file_path
        }
    
    # Save the detection result and the path to the file on elasticsearch
    r = requests.post('http://elasticsearch:9200/detection/_doc/',json=data_to_save)
    
    return r.content



@app.get("/search_all")
async def request_search_all():

    # Get all detection elements
    r_saved = requests.get('http://elasticsearch:9200/detection/_doc/_search')

    json_raw_result_list = json.loads(r_saved.content)["hits"]["hits"]

    
    result_list = [raw_result["_source"]["result"] for raw_result in json_raw_result_list]

    return {"results":result_list}


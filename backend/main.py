import shutil
import json
import uuid
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from analyser import food_details, menu_segregation
from pathlib import Path
import uvicorn
import requests

app = FastAPI()

# Configure CORS Middleware to allow all origins, credentials, methods, and headers
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {'status': 200, "message": "App running successfully"}

@app.post("/analyse")
def analyse_image(
                image: UploadFile = File(...),
            ): 
    file_path = f"storage/{uuid.uuid1()}.jpg"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    print(file_path)

    analysis = food_details(file_path)

    if analysis == None:
        return {"status": 400, "message": "Could not find a food item in the image."}

    if analysis.get("message") and analysis["message"] == "json loading failed":
        return {"status": 500, "message": "GPT did not provide proper response, please retry"}

    # Returning the analysis
    print(analysis)
    return {"analysis": analysis, "status": 200, "message": "food item details fetched"}

@app.post("/scan-menu")
def menu_analysis(image: UploadFile = File(...)):
    file_path = f"storage/{uuid.uuid1()}.jpg"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    analysis = menu_segregation(file_path)
    
    if analysis.get("status"):
        return analysis

    return {"analysis": analysis, "status": 200, "message": "menu details fetched"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
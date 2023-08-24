import shutil
import json
import uuid
from fastapi import FastAPI, File, UploadFile
from analyser import food_details
from pathlib import Path

app = FastAPI()

@app.post("/analyse/")
def analyse_image(image: UploadFile = File(...)): 
    image_path = save_image(image)

    analysis = food_details(image_path)  # Assuming analyse_image take the file path as argument and returns analysis

    # You might want to remove image after analysis
    Path(image_path).unlink()

    # Returning the analysis
    return {"analysis": analysis }


def save_image(file):
    try:
        file_path = f"storage/{uuid.uuid1()}.jpg"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return file_path

    finally:
        file.file.close()

# @app.post("/menu_analysis")
# async def menu_analysis(menu: UploadFile = File(...)):
#     result = await menu_segregation(menu.filename)
#     return {'Result': result}
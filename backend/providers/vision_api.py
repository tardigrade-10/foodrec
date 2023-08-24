from google.cloud import vision
from providers.openai_api import detect_food_dish, analyze_menu
import io

from dotenv import load_dotenv
load_dotenv()

client = vision.ImageAnnotatorClient()


def food_recognition(image_path: str):
    image_path = f"test_images/dish1.jpg"

    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    

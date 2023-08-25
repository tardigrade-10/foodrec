import os
import io
import json
import requests

from google.cloud import vision
from providers.openai_api import detect_food_dish, analyze_menu, recipe_generator, history_and_origin

from dotenv import load_dotenv
load_dotenv()

client = vision.ImageAnnotatorClient()

def _get_nutrients(query):

    api_url = 'https://api.api-ninjas.com/v1/nutrition?query={}'.format(query)
    response = requests.get(api_url, headers={'X-Api-Key': os.environ.get("NINJAS_API_KEY")})
    if response.status_code == requests.codes.ok:
        return response.text
    else:
        print("Error:", response.status_code, response.text)


def food_details(image_path: str) -> dict:
    image_path = f"{image_path}"

    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    web_response = client.web_detection(image=image)
    # print(web_response)
    # label_response = client.label_detection(image=image)

    dish_name = detect_food_dish(web_response)
    # print(dish_name)

    recipe = recipe_generator(dish_name)
    nutrients = _get_nutrients("1lb " + dish_name)
    h_and_o = history_and_origin(dish_name)

    return {"nutrients": json.loads(nutrients), "recipe": json.loads(recipe), "history": json.loads(h_and_o)}


def menu_segregation(image_path: str):
    image_path = f"{image_path}"

    with io.open(image_path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    menu_text = client.text_detection(image=image)

    text = menu_text.text_annotations[0].description

    segregated_dishes = analyze_menu(text)

    return json.dumps(segregated_dishes)








    

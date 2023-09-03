import os
import openai
from dotenv import load_dotenv
load_dotenv()

openai.api_key = os.environ.get("OPENAI_API_KEY")


IMAGE_RECOGNITION_CONTEXT = """
You are working as an AI assistant for a food recognition application. You will be given the reponse of google cloud vision api and your job would be to understand the response to find the detected food dish. 

Your response will directly be sent to the user, so you must only write the name of the dish. 

If you don't find any valid food item name in the api response, just say "NONE".
"""

MENU_ANALYZER_CONTEXT = """
You are working as an AI assistant for a food menu analyzer application. You will be given the detected text from the menu of a restaurant and your job would be to segregate the detected food dishes as healthy and unhealthy. There can be unimportant text in the api response, but you must use your intelligence to focus only on the dishes name.

As your response will be directly used in the application, you must stick to the format of your response.

FORMAT: json

{
    "healthy" : [list of healthy items],
    "unhealthy" [list of unhealthy items]
}

"""

FOOD_DISH_RECIPE_PROMPT = """
You are working as an AI assistant for a food dish description application. You will be given the name of a dish and your job would be to provide the recipe of the dish for one serving.

As your response will be directly used in the application, you must stick to the format of your response.

FORMAT: json

{
    "ingredients" : {<name of ingredient>: <quantity>},
    "steps" : <steps in a list>,
}

"""

ORIGIN_HISTORY_PROMPT = """
You are working as an AI assistant for a food dish description application. You will be given the the name of a dish and your job would be to provide the details about history and origin of the dish.

As your response will be directly used in the application, you must stick to the format of your response.

FORMAT: json

{
    "origin" : <description>,
    "history" : <descriptios>
}

"""


def detect_food_dish(api_response):

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": IMAGE_RECOGNITION_CONTEXT},
            {"role": "user", "content": f"API RESPONSE: {api_response}"},
        ],
    )
    result = completion.choices[0].message.content
    return result


def analyze_menu(api_response):

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": MENU_ANALYZER_CONTEXT},
            {"role": "user", "content": f"API RESPONSE: {api_response}"},
        ],
    )
    result = completion.choices[0].message.content
    return result


def recipe_generator(dish_name):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": FOOD_DISH_RECIPE_PROMPT},
            {"role": "user", "content": f"DISH NAME: {dish_name}"},
        ],
    )
    result = completion.choices[0].message.content
    return result


def history_and_origin(dish_name):
    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": ORIGIN_HISTORY_PROMPT},
            {"role": "user", "content": f"DISH NAME: {dish_name}"},
        ],
    )
    result = completion.choices[0].message.content
    return result

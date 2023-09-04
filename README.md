## Setting up - 

#### Backend -
##### Services used- 
1. OpenAI Api for text generation and formatting
2. Google Cloud Platform - VisionAI Api for image and text detection
3. API Ninjas for nutritional information
4. Create .env or rename .env_template file to .env in the backend folder and don't forget to put .env in .gitignore

##### Setting up OpenAI API: https://platform.openai.com/docs/api-reference/introduction
1. Create an account on openai.com
2. Setup up billing info
3. Set API key
4. Put API key in .env file like this - 
```
OPENAI_API_KEY=<your-api-key>
```

##### Setting up GCP VisionAI Api:
1. Create account on GCP
2. Setup billing info
3. Create a project
4. Search for VisionAI api in "APIs & Services" > "Library" and click enable
5. After enabling the VisionAI api, go to credentials and click "Create Credentials"
6. Select "Service Account" and setup by providing name and description
7. Download the service account credentials as json and put the json file in backend folder
8. Add the path of credentials file to .env as - 
```
GOOGLE_APPLICATION_CREDENTIALS=<path-to-credentials-file>
```
9. Do not forget to put the file's name in .gitignore

##### Setting up API Ninjas api:
1. Go to https://api-ninjas.com/ and sign up
2. Go to yur profile and get api key
3. Add the api key in .env file as - 
```
NINJAS_API_KEY=<your-api-key>
```

### Setting up backend project -
```
# open a new terminal 
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

``` 

### Setting up frontend project -
1. Installation
```
# open a new terminal 
cd frontend
npm install
```
2. Get your network ip address by running this command in your terminal
```
ipconfig getifaddr en0
```
3. Copy the ip address and replace the ip address in api.js file
4. Run the following command to start the app
```
npx expo start
```
5. This will run the app in the computer and provide you steps to run the app in the phone.







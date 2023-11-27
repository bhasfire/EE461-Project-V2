# EE461-Project-V2

## Overview
In this project, we focus on developing a Proof of Concept for a web application designed to function as a Hardware as a Service (HaaS) system. Our HaaS system develops a fully functional system that allows users to create and manage encrypted, secure accounts, join Team Projects, and check in and check out hardware for their projects! It abstracts out the organizational requirements for distributing Hardware Resources with a clean, easy-to-use, extensible interface.

<img src="login.png" width="350"> <img src="checkout.png" width="650">

## Testing
For modularity purposes, we made sure to separate the frontend site from our backend server, allowing us to make test suites for both with ease. Using the Python unittest library, we mocked up API responses from our database, and tested the functionality of the backend routes for each interactable component on the site. These can be run from backend/routes/backend_test.py. For our frontend, we used Jest.js to mock individual states of our sites and ensure that fetch operations were going to the correct places. These tests can be found in frontend/components/frontend_test.js.

## Prerequisites
Make sure you have these to run our site from your local machine!
* [Python](https://www.python.org/downloads/)
* [node.js](https://nodejs.org/en)

## Starting the Backend
These commands will install all necessary dependencies to host and run our backend from your local machine.
```
cd backend
python -m venv venv 
source venv/Scripts/activate
pip install -r requirements.txt --user
python app.py
```

## Starting the Frontend
These commands will install all necessary dependencies to host and run our frontend from your local machine.
```
cd frontend
npm install 
npm start
```

## The Stack!
- Python Flask for the Backend
- React.js for the Frontend
- PostgreSQL for Databasing, with Supabase as our Host

Future plans to Dockerize our Backend server and host it on AWS Fargate.

## Important Docs!
These Docs contain our planning and meeting notes, which give more detail about how we developed our site.
- Checkpoint 1: https://docs.google.com/document/d/1PMT1Vr-sBwPxBNQr3a11KwbHHSTwIitDcQHt-GpFzdQ/edit
- Final Checkpoint (Future Planning and Overall Project Description): https://docs.google.com/document/d/1fVa5UXATIv_jzksZVNa_0GOszCPbEVtZajTOPBpnOUY/edit
- Create React App Docs: https://create-react-app.dev/docs/getting-started/
- Python Flask Docs: https://flask.palletsprojects.com/en/3.0.x/

## The Authors
- Boris He
- Siddharth Iyer
- Andrew Nguyen
- Noam Bella
- Eddie Liao

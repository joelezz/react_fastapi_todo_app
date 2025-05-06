# React FastAPI Todo App

A simple todo application with a React frontend and FastAPI backend.

## Features
- Add, delete, and view tasks
- Responsive design
- Backend data persistence

## Setup Instructions
### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Backend
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv env`
3. Activate the environment: `env\Scripts\activate` (Windows) or `source env/bin/activate` (Unix)
4. Install dependencies: `pip install -r requirements.txt`
5. Start the FastAPI server: `uvicorn main:app --reload`

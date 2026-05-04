# Backend

This is the backend service for the Ethara AI project. It is built using FastAPI and handles authentication, project management, and database interactions.

## Tech Stack

- FastAPI  
- PostgreSQL (via SQLAlchemy)  
- Pydantic  
- JWT-based authentication  
- CORS middleware for frontend integration  

## Features

- User authentication (login/signup)
- Project management APIs
- Protected routes using dependency injection
- Database integration with ORM
- CORS configured for frontend deployment

## Setup

### 1. Clone the repo

and get into the /backend dir 
cd backend

### 2. Create virtual environment

python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

### 3. Install dependencies

pip install -r requirements.txt

### 4. Configure environment

Set your database URL and any secrets (JWT, etc.) in environment variables or a `.env` file.

Example:

DATABASE_URL=postgresql://user:password@host:port/dbname

### 5. Run the server

uvicorn main:app --reload

Server runs on:

http://localhost:8000

## API Endpoints

### Root

GET /

Returns a simple message.

### Auth Routes

/auth/*

Handles user authentication (login/signup).

### Project Routes

/project/*

Handles project-related operations.

### Users (Protected)

GET /users

Returns all users (requires authentication).

## CORS Configuration

Allowed origins:

- https://task-manager-jazz.vercel.app  
- https://*.vercel.app  
- http://localhost:3000  

## Notes

- Database tables are auto-created on startup using SQLAlchemy metadata.
- Authentication is handled via dependency injection (`get_current_user`).
- Keep your environment variables secure in production.
- for more data on each endpoint u should go to [Docs](https://teamtaskmanagerassignment-production.up.railway.app/docs) .

# Ethara AI – Backend

Backend service for the Ethara AI project built with FastAPI. It powers authentication, project collaboration, task management, and database operations.

---

## Tech Stack

- FastAPI
- PostgreSQL (SQLAlchemy ORM)
- Pydantic
- JWT Authentication
- CORS Middleware

---

## Core Features

- User signup and login with JWT
- Project creation and management
- Role-based access (Admin / Member)
- Task management (Kanban-ready: todo, in_progress, done)
- Dashboard analytics (task stats)
- Secure protected routes using dependencies

---

## Project Structure

```
backend/
├── main.py
├── app/
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   ├── utils/
│   └── db.py
```

---

## Setup

### 1. Navigate to backend

```
cd backend
```

### 2. Create virtual environment

```
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
```

### 3. Install dependencies

```
pip install -r requirements.txt
```

### 4. Configure environment variables

Set your database and JWT configs:

```
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
```

---

## Run Server

```
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

## Authentication Flow

1. User logs in → receives JWT
2. Token stored on frontend
3. Sent with requests:

```
Authorization: Bearer <token>
```

4. Backend validates user via dependency

---

## API Overview

### Root

```
GET /
```

---

### Auth

```
POST /auth/signup
POST /auth/login
```

---

### Projects

```
GET    /project/
POST   /project/
GET    /project/{project_id}
```

---

### Members

```
GET    /project/{project_id}/members
POST   /project/{project_id}/members
DELETE /project/{project_id}/members/{user_id}
```

---

### Tasks

```
POST   /project/{project_id}/tasks
PATCH  /project/{project_id}/tasks/{task_id}
GET    /project/{project_id}/tasks
```

Response is grouped for Kanban UI:

```
{
  "todo": [...],
  "in_progress": [...],
  "done": [...]
}
```

---

### Dashboard

```
GET /project/{project_id}/dashboard
```

Returns:

```
{
  "total_tasks": number,
  "by_status": {
    "todo": number,
    "in_progress": number,
    "done": number
  }
}
```

---

### Users (Protected)

```
GET /users
```

---

## CORS

Allowed origins:

- https://task-manager-jazz.vercel.app
- https://*.vercel.app
- http://localhost:3000

---

## Notes

- Tables are auto-created using SQLAlchemy metadata
- JWT handles authentication (no API keys used)
- Backend is fully RESTful and frontend-ready
- Task responses include user info for direct UI rendering

---

## API Docs

Interactive docs available at:

https://teamtaskmanagerassignment-production.up.railway.app/docs

---

## Status

Backend is complete, deployed, and ready for frontend integration.
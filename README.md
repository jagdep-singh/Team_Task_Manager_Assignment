# Team Task Manager – Ethara AI Assignment

A full-stack collaborative task management web application built as part of the Ethara AI Full-Stack Coding Assignment. Think simplified Trello — users can create projects, invite members, assign tasks, and track progress on a Kanban board.

**Live App →** [https://task-manager-jazz.vercel.app](https://task-manager-jazz.vercel.app)  
**Backend API Docs →** [https://teamtaskmanagerassignment-production.up.railway.app/docs](https://teamtaskmanagerassignment-production.up.railway.app/docs)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript, Custom CSS |
| Backend | FastAPI, Python |
| Database | PostgreSQL (via SQLAlchemy ORM) |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel (frontend), Railway (backend + DB) |

---

## Features

### Authentication
- Signup with name, email, and password
- JWT-based login; token stored in localStorage
- Protected routes — unauthenticated users redirected to login

### Project Management
- Create projects; creator is automatically assigned Admin role
- Admin can add and remove members
- Members can view all projects they belong to

### Task Management
- Create tasks with title, description, due date, and priority
- Assign tasks to project members
- Update task status: **Todo → In Progress → Done**
- Priority is clickable and changes directly from the Kanban card

### Kanban Board
- Tasks grouped by status in three columns
- Visual, drag-free card layout; clean and fast

### Dashboard
- Total task count
- Task breakdown by status (todo / in progress / done)

### Role-Based Access
- **Admin** — full control: manage tasks, members, and project settings
- **Member** — can view and update status of assigned tasks only

---

## Project Structure

```
root/
├── frontend/                  # Next.js app
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── project/[id]/  # Kanban board per project
│   ├── components/
│   │   ├── Button.tsx / Button.css
│   │   ├── Navbar.tsx / Navbar.css
│   │   ├── Column.tsx / Column.css
│   │   ├── TaskCard.tsx / TaskCard.css
│   │   ├── ProjectCard.tsx / ProjectCard.css
│   │   ├── CreateTask.tsx / CreateTask.css
│   │   └── Stats.tsx / Stats.css
│   └── lib/
│       └── services/          # API base URL + fetch helpers
│
└── backend/                   # FastAPI app
    ├── main.py
    └── app/
        ├── routes/
        ├── models/
        ├── schemas/
        ├── utils/
        └── db.py
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL instance (local or cloud)

---

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate       # macOS/Linux
# venv\Scripts\activate        # Windows

pip install -r requirements.txt
```

Create a `.env` file in `/backend`:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
SECRET_KEY=your_secret_key
ALGORITHM=HS256
```

Run the server:

```bash
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`. Tables are auto-created on startup via SQLAlchemy metadata.

---

### Frontend

```bash
cd frontend
npm install
```

Update the API base URL in `/lib/services/`:

```ts
const BASE_URL = "http://localhost:8000";
```

Run the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## API Overview

### Auth
```
POST /auth/signup
POST /auth/login
```

### Projects
```
GET    /project/
POST   /project/
GET    /project/{project_id}
```

### Members
```
GET    /project/{project_id}/members
POST   /project/{project_id}/members
DELETE /project/{project_id}/members/{user_id}
```

### Tasks
```
POST   /project/{project_id}/tasks
PATCH  /project/{project_id}/tasks/{task_id}
GET    /project/{project_id}/tasks
```

Task list response is pre-grouped for the Kanban UI:

```json
{
  "todo": [...],
  "in_progress": [...],
  "done": [...]
}
```

### Dashboard
```
GET /project/{project_id}/dashboard
```

```json
{
  "total_tasks": 12,
  "by_status": {
    "todo": 4,
    "in_progress": 5,
    "done": 3
  }
}
```

### Users (Protected)
```
GET /users
```

Full interactive docs: [https://teamtaskmanagerassignment-production.up.railway.app/docs](https://teamtaskmanagerassignment-production.up.railway.app/docs)

---

## Authentication Flow

1. User signs up / logs in → receives JWT
2. Token stored in `localStorage`
3. Subsequent requests include header:
   ```
   Authorization: Bearer <token>
   ```
4. Backend validates token via FastAPI dependency injection

---

## Deployment

### Frontend — Vercel

- Push frontend to GitHub
- Import project on [vercel.com](https://vercel.com)
- Set environment variables (API base URL)
- Deploy

### Backend — Railway

- Push backend to GitHub
- Create a new Railway project, connect the repo
- Add a PostgreSQL plugin
- Set environment variables:
  ```
  DATABASE_URL=<from Railway PostgreSQL>
  SECRET_KEY=your_secret_key
  ALGORITHM=HS256
  ```
- Railway auto-deploys on push

CORS is configured for:
- `https://task-manager-jazz.vercel.app`
- `https://*.vercel.app`
- `http://localhost:3000`

---

## Notes

- Avatar is generated using [DiceBear](https://dicebear.com) based on the username
- Navbar reads username from `localStorage`
- Modals used for project and task creation (no inline forms)
- Database tables are auto-created on server startup — no manual migrations needed

---

## Status

- Backend — complete and deployed on Railway  
- Frontend — complete and deployed on Vercel  
- Both connected and functional end-to-end
- Database — PostgreSQL and deployed on Railway as well 
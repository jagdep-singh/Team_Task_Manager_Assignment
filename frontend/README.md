# Frontend

This is the frontend for the Ethara AI Team Task Manager, built with Next.js. It connects to a FastAPI backend and provides a clean, minimal interface for managing projects and tasks.

---

## Overview

The app is designed as a collaborative task management system where users can:

- Sign up and log in
- Create and manage projects
- Add and assign tasks within projects
- Track task progress using a Kanban board
- View basic dashboard stats

The UI focuses on simplicity, clarity, and smooth interactions.

---

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Custom CSS (modular component-based styling)
- REST API integration with backend

---

## Features

### Authentication
- Login and Signup
- JWT-based authentication
- User data stored in localStorage (token, username)

### Dashboard
- View all projects
- Create new projects using a modal
- Project cards with creator info

### Project Page
- Kanban board (Todo / In Progress / Done)
- Create tasks via modal
- Assign tasks to users
- Task details:
  - Title
  - Description
  - Priority (clickable to change directly from the UI)
  - Assigned user
  - Created by
  - Due date

### UI System
- Reusable Button component (primary, ghost, logout)
- Floating navbar with avatar + username
- Modal system (used for project/task creation)
- Clean card-based layout

---

## Project Structure

```
app/
  dashboard/
    project/[id]/
components/
  Button.tsx / Button.css
  Navbar.tsx / Navbar.css
  Column.tsx / Column.css
  TaskCard.tsx / TaskCard.css
  ProjectCard.tsx / ProjectCard.css
  CreateTask.tsx / CreateTask.css
  Stats.tsx / Stats.css
lib/
  services/
```

---

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## Environment Setup

Make sure your frontend is connected to the backend API.

Update your API base URL inside:

```
/lib/services/
```

Example:

```ts
const BASE_URL = "http://localhost:8000";
```

---

## Notes

- Navbar reads username from localStorage
- Avatar is generated using Dicebear based on username
- Modals are used instead of inline forms for cleaner UI
- Components are structured for scalability

---

## Deployment

The frontend can be deployed on platforms like:

- Vercel
- Netlify
- Railway (if using custom setup)

Make sure environment variables and API URLs are configured correctly.

---

## Status

Frontend is functional and connected to backend.  
Currently focused on UI refinement, interaction improvements, and polishing user experience.

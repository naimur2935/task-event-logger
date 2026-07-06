# Task Event Logger

A single-page task tracking widget built with the MERN stack + TypeScript. The app now supports full task CRUD, a shared create/edit modal, status filters including "To Do", and live activity logging alongside the task list.

## Live Demo

- Frontend: https://synerasoft-task.nextdevgen.com
- Backend API: https://synera-tech-assesment-backend.vercel.app

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB (Atlas) via Mongoose

## Project Structure

```
task-event-logger/
├── backend/     # Express API + MongoDB models
└── frontend/    # React single-page app
```

## Prerequisites

- Node.js 18+
- A MongoDB connection string (Atlas or local)

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and set `MONGO_URI` to your MongoDB connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-address>/task_event_logger?retryWrites=true&w=majority
```

Seed a few sample tasks (optional but recommended so the UI isn't empty on first load):

```bash
npm run seed
```

Start the API in dev mode:

```bash
npm run dev
```

The server runs at `http://localhost:5000`. Health check: `GET /health`.

## Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` and talks to the backend at the URL set in `frontend/.env` (`VITE_API_URL`, defaults to `http://localhost:5000/api`).

## API Reference

| Method | Endpoint                 | Description                                      |
| ------ | ------------------------ | ------------------------------------------------- |
| GET    | `/api/tasks`             | List all tasks                                    |
| POST   | `/api/tasks`             | Create a task (`title`, `description`)            |
| PATCH  | `/api/tasks/:id/toggle`  | Advance a task's status and auto-create a log     |
| GET    | `/api/logs`              | List activity logs, newest first                  |

## Status Flow

`To Do` → `In Progress` → `Done`. Once a task is `Done`, its toggle button disables — the lifecycle is one-directional by design for this exercise.

## Notes

- `backend/.env` is git-ignored. Never commit real database credentials — use `.env.example` as the template for anyone cloning this repo.
- See `AI_COLLABORATION.md` for how AI tools were used while building this.

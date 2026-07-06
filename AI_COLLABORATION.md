# AI Collaboration Notes

This project was built with the help of Claude (Anthropic) as an AI pair-programmer, used to scaffold boilerplate, wire up the database layer, and speed up the Tailwind UI pass. Below are examples of prompts used during development.

### 1. Scaffolding the backend

> "Set up an Express + TypeScript backend with two Mongoose schemas — Task (title, description, status) and ActivityLog (task reference, activity message, timestamp). I need a route that toggles a task's status AND creates an activity log in the same request."

Used to generate the initial models, controller logic, and route structure, which I then reviewed and adjusted (e.g. tightening the status-flow logic so `Done` tasks can't be toggled further).

### 2. Building the frontend layout

> "Create a two-column single-page React + TypeScript + Tailwind layout: a task list on the left showing title/description/status/toggle button, and a live activity feed on the right sorted newest-first."

Used to quickly get a clean component structure (`TaskList`, `TaskCard`, `ActivityFeed`) instead of hand-writing repetitive JSX/Tailwind classes from scratch.

### 3. Debugging CORS / env wiring

> "My frontend on Vite (port 5173) can't reach my Express API on port 5000 — getting a CORS error. What's the correct `cors()` config and env variable setup for local dev?"

Used to fix a local CORS misconfiguration quickly rather than trawling Stack Overflow.

---

*Note: personalize this file with the actual prompts you used if you iterate on this further — this reflects the real build process for this submission.*

## Current Status

- Project is functionally complete for task CRUD, status filtering, modal add/edit flows, and activity log tracking.
- Frontend deployed at: https://synerasoft-task.nextdevgen.com
- Backend API deployed at: https://synera-tech-assesment-backend.vercel.app

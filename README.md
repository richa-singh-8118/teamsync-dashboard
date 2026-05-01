# TeamSync - Team Task Manager

## 🌐 **[LIVE DEMO: Click Here to View Application](https://teamsync-dashboard-production-03ef.up.railway.app)**

---

## 🧪 **DEMO CREDENTIALS (VERY IMPORTANT)**

> ### **Admin Login**
> - **Email:** `admin@test.com`
> - **Password:** `123456`
>
> ### **Member Login**
> - **Email:** `member@test.com`
> - **Password:** `123456`

---

## 📌 Project Context

This project was developed as part of a technical assessment for Ethara AI, a company focused on building high-quality data systems for AI and LLM workflows.

The goal was to design and implement a full-stack application that demonstrates structured thinking, task management workflows, and real-world system design.

---

A production-ready full-stack application designed to streamline team workflows.


## 🚀 Features

- **Role-Based Access Control**: Secure JWT-based authentication for `admin` and `member` roles.
- **Project Management**: Admins can create projects and assign members.
- **Task Lifecycle Workflows**: Tasks progress through `todo` → `in-progress` → `completed` → `submitted`.
- **Dynamic Dashboard**: Real-time server-side calculation of total tasks, completed tasks, in-progress tasks, and overdue tasks.
- **Updates & Logs System**: Members can add daily progress updates with automatic timestamps.
- **Submission Workflow**: Members can submit completed work along with external links and notes for Admin review.
- **Modern Clean UI**: A beautiful, responsive, "Apple-style" light mode interface built with React.

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), CSS3 (Custom Variables), Lucide React (Icons), Axios, React Router Dom
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs

---

## 💻 Local Development Setup

### 1. Clone the repository and install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
ADMIN_SECRET_KEY=admin123
```

### 3. Run the application
Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend application:
```bash
cd frontend
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 📦 Deployment Guide (Railway - Unified)

The application is configured for a **unified deployment**, meaning a single Railway service builds both the frontend and backend and serves them from the same domain.

### Deployment Steps
1.  **Push to GitHub**: The changes are already optimized and pushed to your repository.
2.  **Create Railway Project**: Go to [Railway.app](https://railway.app/) and select **Deploy from GitHub repo**.
3.  **Provision MongoDB**: Add a MongoDB service to your Railway project.
4.  **Configure Variables**: In your application service settings, add:
    - `MONGO_URI`: (Automatically linked from MongoDB service)
    - `JWT_SECRET`: (A secure random string)
    - `ADMIN_SECRET_KEY`: `admin123`
    - `NODE_ENV`: `production`
5.  **Build & Go Live**: Railway will automatically use the `Dockerfile` in the root to build and deploy.

Your app will be live at the public domain provided by Railway!

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & get JWT
- `GET /api/auth/users` - Get list of users (Admin only)

### Dashboard
- `GET /api/dashboard` - Get dynamic metrics (Total Projects, Tasks, In Progress, Overdue)

### Projects
- `GET /api/projects` - Get projects assigned to user / created by admin
- `POST /api/projects` - Create a new project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/tasks` - Get all tasks associated with user
- `POST /api/tasks` - Create and assign a task
- `PUT /api/tasks/:id` - Update status and progress slider
- `POST /api/tasks/:id/update` - Add a text log/comment
- `POST /api/tasks/:id/submit` - Mark as submitted with link/notes

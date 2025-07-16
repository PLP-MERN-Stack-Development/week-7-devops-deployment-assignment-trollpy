# Dev-Workflow-Dash

## 🚀 Developer Workflow Dashboard

A full-featured productivity dashboard for developers to track GitHub activity, CI/CD pipeline status, live logs, and task progress — all in one real-time interface.

![Dashboard Preview](/client/public/image/image.png)

---

## 📦 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Query, Socket.IO, Clerk Auth  
- **Backend:** Node.js, Express, MongoDB, Axios, Clerk Webhooks  
- **Auth:** Clerk (email/password & social login)  
- **Realtime:** WebSockets (Socket.IO)  
- **Dev Tools:** ESLint, Prettier, Hot Reloading

---

## 🔐 Features

- ✅ GitHub activity feed (commits, PRs, issues)
- ✅ CI/CD pipeline status tracking
- ✅ Live log streaming from backend/services
- ✅ Task board with state management
- ✅ Clerk-based authentication
- ✅ Responsive UI with light/dark mode
- ✅ Modular codebase with clean separation
- ✅ Production-ready structure

---

## 🌍 Live Demo

_Coming soon..._

---

## 🛠️ Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/developer-workflow-dashboard.git
cd developer-workflow-dashboard
```

### 2. Environment Setup

Create two `.env` files: one in `client/` and one in `server/`.

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
```

**server/.env**
```
PORT=5000
MONGO_URI=your_mongo_atlas_connection_string
CLERK_SECRET_KEY=sk_test_your_clerk_secret
GITHUB_CLIENT_ID=your_github_oauth_id
GITHUB_CLIENT_SECRET=your_github_oauth_secret
```

### 3. Install Dependencies

```bash
# In the root
cd client && npm install
cd ../server && npm install
```

### 4. Run the App Locally

```bash
# Backend
cd server
npm run dev

# Frontend (in another terminal)
cd client
npm run dev
```

---

## 🚀 Deploying

- Deploy the frontend on Vercel or Netlify, and backend on Render, Railway, or VPS.
- Use Clerk production keys and whitelist your production URLs in the Clerk Dashboard.
- Update `VITE_API_URL` in the client’s `.env` to your hosted backend URL.
- Secure your backend environment variables.

---

## 🗂️ Folder Structure (Simplified)

```
developer-workflow-dashboard
├── client
│   ├── public
│   └── src
│       ├── components
│       ├── context
│       ├── features
│       ├── layouts
│       ├── pages
│       └── services
└── server
    └── src
        ├── controllers
        ├── models
        ├── routes
        ├── jobs
        ├── services
        └── middleware
```

---

## 📸 Screenshots

_Add dashboard screenshots here_

---

## 📅 Upcoming Features

- GitHub OAuth Sign-in
- Kanban-style drag-and-drop tasks
- Custom GitHub repo linking
- Notification system (toast + bell icon)
- Analytics dashboard for user activity

---

## 👨‍💻 Author

Built by [@trollpy](https://github.com/trollpy)

---

## 📝 License

MIT License. Feel free to fork, contribute, and share!
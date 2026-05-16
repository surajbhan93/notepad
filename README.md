# 📝 Notes App — Full Stack

A full-stack Notes application with **Express + MongoDB** backend and **Next.js + Tailwind CSS** frontend.

## 🏗️ Project Structure

```
notes-app/
├── backend/          # Express.js REST API
│   ├── src/
│   │   ├── config/db.js
│   │   ├── middleware/auth.js
│   │   ├── models/User.js & Note.js
│   │   ├── routes/auth.js, notes.js, misc.js
│   │   └── app.js
│   ├── .env.example
│   └── Dockerfile
├── frontend/         # Next.js 14 App Router
│   ├── app/
│   │   ├── auth/login & register
│   │   ├── dashboard/
│   │   └── layout.jsx
│   ├── components/NoteCard.jsx & NoteModal.jsx
│   ├── lib/api.js
│   └── Dockerfile
└── docker-compose.yml
```

## 🚀 Setup & Run

### Option 1: Manual (Recommended for Development)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI & JWT secret
npm run dev        # runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
# Create .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev        # runs on http://localhost:3000
```

### Option 2: Docker Compose

```bash
# From root directory
docker-compose up --build
```

## 🌍 Environment Variables

**Backend `.env`:**
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/notesapp
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

**Frontend `.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🌐 Deployment

### Backend → Render.com
1. New → Web Service → Connect GitHub repo
2. Root Directory: `backend`
3. Build: `npm install`, Start: `npm start`
4. Add environment variables

### Frontend → Vercel
1. Import GitHub repo
2. Root Directory: `frontend`
3. Add `NEXT_PUBLIC_API_URL` pointing to Render URL

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /register | ❌ | Register user |
| POST | /login | ❌ | Login → JWT |
| GET | /notes | ✅ | Get all notes (paginated) |
| GET | /notes/search?q= | ✅ | Full-text search |
| GET | /notes/:id | ✅ | Get specific note |
| POST | /notes | ✅ | Create note |
| PUT | /notes/:id | ✅ | Update note |
| DELETE | /notes/:id | ✅ | Delete note |
| POST | /notes/:id/share | ✅ | Share note |
| DELETE | /notes/:id/share | ✅ | Unshare note |
| GET | /openapi.json | ❌ | API docs |
| GET | /about | ❌ | About |

## ✨ Extra Features Implemented

- **Note Pinning** — Pin important notes to the top
- **Note Colors** — 7 color themes per note
- **Tags** — Add multiple tags, filter by tag
- **Full-text Search** — MongoDB text index search
- **Pagination** — 12 notes per page
- **Note Unsharing** — Revoke shared access

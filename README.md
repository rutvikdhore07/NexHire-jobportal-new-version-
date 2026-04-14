# NexHire Pro — AI-Powered Job Portal

A production-ready job portal with AI resume analysis, career chatbot, smart job recommendations, market skills tracker, course recommendations, and real-time job news.

---

## ✨ Features

- 🔐 JWT auth with access + refresh tokens
- 🤖 AI Resume Analyzer (Google Gemini)
- 💬 AI Career Chatbot
- 🎯 Smart Job Recommendations
- 📰 Job Market News feed
- 📈 Trending Skills tracker
- 🎓 Curated Learning Courses
- 🌑 Dark / Light theme
- 📱 Fully responsive
- 🗄️ PostgreSQL (Supabase) ready

---

## 🚀 Quick Start (Local)

### Prerequisites
- Java 17+ → https://adoptium.net
- Maven 3.9+ → https://maven.apache.org
- Node.js 20+ → https://nodejs.org
- PostgreSQL or Docker Desktop

### 1. Start Database
```bash
docker compose up -d        # starts PostgreSQL on localhost:5432
```
Or use Supabase (see below).

### 2. Configure Backend
Edit `backend/start.bat` (Windows) or `backend/.env` (Mac/Linux):
```
DB_URL=jdbc:postgresql://localhost:5432/nexhire?sslmode=disable
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=any-random-string-minimum-32-characters
GEMINI_API_KEY=your-gemini-key    ← optional, get from aistudio.google.com
```

### 3. Start Backend
```bash
# Mac/Linux
cd backend && ./start.sh

# Windows
cd backend && start.bat
```
Wait for: `Started PortalApplication in X.X seconds`

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open: **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend
| Variable | Description | Required |
|---|---|---|
| `DB_URL` | PostgreSQL JDBC URL | ✅ |
| `DB_USER` | DB username | ✅ |
| `DB_PASSWORD` | DB password | ✅ |
| `JWT_SECRET` | 32+ char secret | ✅ |
| `ALLOWED_ORIGINS` | Frontend URL | ✅ |
| `GEMINI_API_KEY` | Google Gemini key | ⚡ Optional |
| `PORT` | Server port (default 8080) | ❌ |

### Frontend
| Variable | Value |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_GEMINI_API_KEY` | Gemini key (client-side, optional) |

---

## 🤖 Get Free Gemini API Key

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with Google
3. Click **Create API key**
4. Copy and add to `backend/.env` as `GEMINI_API_KEY=your-key`

The AI features work with fallback responses even without the key.

---

## ☁️ Free Deployment

### Database — Supabase (Free Forever)
1. https://supabase.com → New project
2. Settings → Database → Connection string → copy URI
3. Format: `jdbc:postgresql://db.xxxx.supabase.co:5432/postgres?sslmode=require`

### Backend — Render (Free)
1. https://render.com → New Web Service → connect GitHub
2. Root: `backend` | Build: `mvn clean package -DskipTests` | Start: `java -jar target/portal-1.0.0.jar`
3. Add all environment variables from the table above

### Frontend — Vercel (Free Forever)
1. https://vercel.com → New Project → import repo
2. Root: `frontend` | Framework: Vite
3. Add env: `VITE_API_URL=https://your-render-backend.onrender.com/api`

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/jobs` | Public | Search jobs |
| GET | `/api/jobs/my-postings` | Recruiter | My job listings |
| GET | `/api/jobs/recommended` | Optional | AI recommendations |
| POST | `/api/jobs` | Recruiter | Create job |
| GET | `/api/news` | Public | Job market news |
| GET | `/api/skills` | Public | Trending skills |
| GET | `/api/courses` | Public | Learning courses |
| POST | `/api/ai/chat` | Auth | AI career chatbot |
| POST | `/api/ai/resume-analyze` | Auth | Analyze resume |
| POST | `/api/ai/job-match` | Auth | Job match score |
| GET | `/api/users/me` | Auth | Get profile |
| PUT | `/api/users/me` | Auth | Update profile |

---

## 🏗️ Architecture

```
React (Vite)  →  Spring Boot API  →  PostgreSQL (Supabase)
                        ↓
                Google Gemini AI (free)
```

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.3, Spring Security, JWT, JPA/Hibernate
- **Database:** PostgreSQL (Supabase)
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Three.js
- **AI:** Google Gemini 1.5 Flash (free tier)

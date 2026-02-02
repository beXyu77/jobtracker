# JobTracker

A full-stack Job Application Tracker designed for international job seekers, students, and digital nomads.  
Track job applications, manage resume versions, automate follow-ups, and analyze your job search progress.

---

## ✨ Features

- 📌 Track job applications across companies and platforms  
- 🔄 Application pipeline with status transitions (Kanban-style)  
- ⏰ Automated follow-up reminders  
- 📄 Resume version management  
- 📊 Job search analytics dashboard  
- 🔐 Authentication with JWT  

---


## 📁 Project Structure

```text
jobtracker/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   └── main.py
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── src/
│   └── package.json
├── docker-compose.yml
├── .env
└── README.md
```

## 🚀 How to Use

### 1️⃣ Prerequisites

Make sure you have installed:

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Git

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/jobtracker.git
cd jobtracker
```
---

### 3️⃣ Environment Variables
Create a .env file in the project root:
```bash
DATABASE_URL=postgresql+psycopg://jobtracker:jobtracker@localhost:5432/jobtracker
REDIS_URL=redis://localhost:6379/0
JWT_SECRET=change_me_to_a_long_random_string
ENV=dev
```
---

### 4️⃣ Start Database & Redis
```bash
docker compose up -d
docker ps #check running containers
```
---

### 5️⃣ Backend Setup
```bash
cd backend
python -m venv .venv
```
Activate virtual environment:
```bash
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```
Install dependencies:
```bash
pip install -r requirements.txt
```
Run the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```
---

### 6️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
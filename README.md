# 🎥 Sample Walkthrough Tutorial:
[Watch the Demo Video →](https://drive.google.com/file/d/1cc13oOCifNjO7JcjfdhQeYNxk7A_H6xl/view?usp=drive_link)

The following includes:

* Detailed setup instructions for both backend and frontend
* Clear explanations of how to run everything (local and Docker)
* Firebase and `.env` setup
* Test instructions
* Direct reference to your GitHub repo

---


# 🧠 Fallyx Simple Incident Logger

[Live GitHub Repo →](https://github.com/manyuvraj-sandhu/fallyx-simple-incident-logger)

This full-stack project is a lightweight incident logging and summarization tool. Users can log "fall", "medication", or "behaviour" incidents, generate summaries with AI (OpenAI API), and view visual analytics per user. Auth is powered by Firebase and all actions are secured with ID tokens.

---


# 📁 Project Structure

```
fallyx-simple-incident-logger/
│
├── backend/               → Node.js + Express + PostgreSQL + Firebase Auth + OpenAI
│   ├── src/               → Routes, Middleware, Controllers
│   ├── tests/             → Unit tests with Jest
│   ├── Dockerfile         → Docker support
│   └── ...
│
├── frontend/              → Next.js 14 + TailwindCSS + Firebase Web Auth + Recharts
│   ├── src/               → App's page.tsx, UI components (charts, forms, etc.)
│   └── ...
│
├── docker-compose.yaml    → For local dev with Docker
└── README.md              → You're here!

````

---

## 🧪 Questions Breakdown

### ✅ Question 1: Authentication and Logging
Users authenticate with Google via Firebase. Upon login, an ID token is obtained and passed to the backend for secured logging and querying of incidents.

- Firebase Admin SDK verifies the token
- Each user only accesses their own data via decoded UID

### ✅ Question 2: Summarization
OpenAI's API is used to generate summaries from incident descriptions.

- A `POST /incidents/:id/summarize` endpoint triggers summarization
- The backend sends `incident.description` to OpenAI and stores the result

### ✅ Question 3: Visualization
Each user sees a bar chart showing:
- Number of **fall** incidents
- Number of **behaviour** incidents
- Number of **medication** incidents

Recharts is used to render this chart, updating dynamically for each logged-in user.

---

## 🚀 How to Run the Project

### 1. Clone the Repo

```bash
git clone https://github.com/manyuvraj-sandhu/fallyx-simple-incident-logger.git
cd fallyx-simple-incident-logger
````

---

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use `incident-logger-fallyx`)
3. Enable **Authentication > Google Sign-In**
4. Go to Project Settings → Copy values for `.env` files below

---

### 3. Create Required `.env` Files

#### 🔐 `backend/.env`

```env
PORT=4000
DB_NAME=fallyx_db
DB_USER=postgres
DB_PASS=postgres
DB_HOST=localhost

FIREBASE_PROJECT_ID=incident-logger-fallyx
OPENAI_API_KEY=your_openai_api_key
```

#### 🐳 `backend/.env.docker`

```env
DATABASE_URL=postgres://postgres:postgres@postgres:5432/fallyx
OPENAI_API_KEY=your_openai_api_key
FIREBASE_PROJECT_ID=incident-logger-fallyx
```

#### ⚙️ `frontend/.env.local`

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=incident-logger-fallyx
```

---

### 4. Run with Docker

```bash
docker compose up --build
```

* Server will run at `http://localhost:4000`
* Frontend (optional) can be served separately or inside another Docker container

---

### 5. Run Without Docker

#### In one terminal (PostgreSQL must be running):
```bash
cd backend
npm install
```

#### Option 1: With npm script
```bash
npm run dev
```

#### Option 2: Directly
```bash
npx ts-node-dev src/app.ts
```

#### In another terminal:

```bash
cd frontend
npm install
npm run dev
```

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend: [http://localhost:4000](http://localhost:4000)

---

## ✅ How to Run Tests

Tests are located in `backend/tests`.

To run them:

```bash
cd backend
npm test
```

* `auth.test.ts` covers Firebase token verification
* `incident.test.ts` covers all CRUD and summarization logic

---

## 📊 Features

* 🔐 Google Authentication via Firebase
* 📝 Incident logging + editing + deletion
* 💬 Summary generation via OpenAI
* 📈 User-specific analytics with Recharts
* 🧪 Unit-tested backend logic
* 🐳 Docker support for full local dev

---

## 🙌 Author

**Manyuvraj Singh Sandhu**
[GitHub](https://github.com/manyuvraj-sandhu)

---

## 📎 Submission

**GitHub Link**:
[https://github.com/manyuvraj-sandhu/fallyx-simple-incident-logger](https://github.com/manyuvraj-sandhu/fallyx-simple-incident-logger)

---

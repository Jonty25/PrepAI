# PrepAI — AI-Powered Resume Analyzer & Mock Interview Generator

PrepAI is a full stack web application that helps job seekers improve their resumes and practice interviews using Google Gemini AI.

## Live Demo
> Coming soon after deployment

## Features

- **Resume ATS Analyzer** — Upload your resume and get an instant ATS compatibility score with strengths, weaknesses, keywords, and actionable suggestions
- **AI Mock Interview** — Get 10 personalized interview questions based on your resume content
- **Voice Answers** — Answer interview questions by speaking using browser Speech Recognition
- **AI Answer Review** — Get instant AI feedback on your answers with a score out of 10
- **Job Description Matcher** — Paste any job description and see how well your resume matches it
- **Bullet Point Rewriter** — Rewrite weak resume bullet points with strong action verbs and metrics
- **Progress Dashboard** — Track all your resumes, ATS scores, and interview sessions

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js + Express.js
- MongoDB Atlas + Mongoose
- JWT Authentication
- Multer (PDF upload)
- PDF-Parse (text extraction)

### AI
- Google Gemini API

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/prepai.git
cd prepai
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables
```bash
cd ../server
cp .env.example .env
```

Fill in your `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

5. Run the development servers

In one terminal:
```bash
cd server
npm run dev
```

In another terminal:
```bash
cd client
npm run dev
```

6. Open your browser at `http://localhost:5173`

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login

### Resume
- `GET /api/resume` — Get all resumes
- `POST /api/resume/upload` — Upload a PDF resume
- `GET /api/resume/:id` — Get a single resume
- `POST /api/resume/:id/analyze` — Analyze resume with AI
- `POST /api/resume/:id/match` — Match resume with job description
- `DELETE /api/resume/:id` — Delete a resume

### Interview
- `GET /api/interview/:resumeId` — Get interview questions
- `POST /api/interview/:resumeId/generate` — Generate questions with AI
- `POST /api/interview/review/answer` — Review answer with AI

### Dashboard
- `GET /api/dashboard` — Get dashboard stats

### Bullet Rewriter
- `POST /api/bullet/rewrite` — Rewrite a bullet point with AI

## Project Structure
PrepAI/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios instance and API calls
│       ├── components/     # Reusable components
│       ├── context/        # Auth context
│       ├── hooks/          # Custom hooks
│       ├── pages/          # Page components
│       └── utils/          # Helper functions
│
└── server/                 # Node.js backend
├── config/             # Database connection
├── controllers/        # Business logic
├── middleware/         # Auth and upload middleware
├── models/             # Mongoose schemas
├── routes/             # API routes
└── utils/              # Gemini AI utility
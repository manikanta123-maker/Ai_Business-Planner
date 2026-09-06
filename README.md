# AI Business Architect & Planner 🚀

An AI-powered startup business planning and market validation platform. It automatically transforms any startup concept or business idea into a comprehensive, investor-grade business blueprint with live market intelligence, competitor analysis, financial projections, and an interactive AI strategy assistant.

---

## 🌟 Key Features

- **Automated Blueprint Generation**: Generates 8 core strategic pillars in seconds:
  1. Executive Summary & Business Overview
  2. Live Competitor Analysis (Direct/Indirect rivals, SWOT, competitive moats)
  3. Market Research & Trends (TAM / SAM / SOM estimations)
  4. Target Customer Personas & ICP Pain Points
  5. 3-Year Financial Model & Revenue Projections
  6. Funding & Capital Raising Roadmap
  7. Risk Assessment & Mitigation Strategies
  8. Phased Execution Roadmap & Milestones
- **Real-Time Web Intelligence**: Integrates with Tavily Search API to discover live competitor data, industry trends, and market statistics.
- **Multi-Model AI Resilience**: Powered by Google Gemini (`gemini-2.5-flash`, `gemini-3.6-flash`) and OpenAI with intelligent offline context-aware fallback templates.
- **AI Strategy Advisor Chatbot**: Context-aware AI co-pilot trained on your specific business blueprint to answer strategy questions, analyze risks, and advise on growth steps.
- **Secure Authentication**: JWT-based session security, email verification workflow, and protected user workspaces.
- **Modern Responsive UI**: Built with Next.js 16 (Turbopack), React 19, TypeScript, and Lucide icons featuring a curated dark mode aesthetic.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router & Turbopack)
- **Library**: React 19 & TypeScript
- **Styling**: Vanilla CSS & Modern Design System (Glassmorphism, dark palette)
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Server**: Uvicorn
- **ORM & Database**: SQLAlchemy with SQLite (swappable with PostgreSQL)
- **Authentication**: Python-JOSE, Passlib, Bcrypt
- **AI & Search**: Google Gemini API, OpenAI API, Tavily Search API

---

## 🚀 Quick Start

### 1. One-Click Start (Windows)

Simply double-click or run:
```cmd
start.bat
```
This automatically verifies dependencies, starts the FastAPI backend on port `8000`, launches the Next.js frontend on port `3000`, and opens your browser.

---

### 2. Manual Setup

#### Backend Setup:
```bash
cd backend
python -m venv .venv

# Activate virtual environment:
# On Windows:
.\.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies:
pip install -r requirements.txt

# Configure environment:
cp .env.example .env
# Edit .env and insert your GEMINI_API_KEY / TAVILY_API_KEY

# Start backend server:
uvicorn app.main:app --reload --port 8000
```
Backend will be live at: [http://localhost:8000](http://localhost:8000)  
Interactive API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)

#### Frontend Setup:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

Create a `backend/.env` file with the following keys (see `backend/.env.example`):

```env
# Database
DATABASE_URL=sqlite:///./dev.db

# JWT Security
SECRET_KEY=your_secure_random_key_here

# AI Model Keys (Set at least one)
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Search Key (For real-time market data)
TAVILY_API_KEY=your_tavily_api_key
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/             # API routes (auth, projects, blueprint, chat)
│   │   ├── core/            # Config, database, security
│   │   ├── models/          # SQLAlchemy database models
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   └── main.py          # FastAPI application entrypoint
│   ├── .env.example         # Template configuration
│   ├── requirements.txt     # Python dependencies
│   └── test_auth.py         # Integration test suite
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   └── app/             # Next.js App Router (pages & components)
│   ├── package.json         # Node dependencies
│   └── tsconfig.json        # TypeScript configuration
├── .gitignore               # Comprehensive Git ignore rules
├── start.bat                # Automated launcher script
├── setup.bat                # Automated environment setup script
└── README.md                # Project documentation
```

---

## 🧪 Testing

Run backend tests to verify core functionality:
```bash
cd backend
.\.venv\Scripts\python.exe test_auth.py
.\.venv\Scripts\python.exe test_blueprint_generation.py
```

Run frontend production build verification:
```bash
cd frontend
npm run build
```

---

## 📄 License
This project is open-source and available under the MIT License.

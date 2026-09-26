# B2B SaaS Resume Screener Backend

A high-performance, modular Python backend built with **FastAPI** for automated candidate resume screening and ranking.

Designed with clean **Object-Oriented Programming (OOP)** and clean architecture principles to ensure extensibility, maintainability, and enterprise-grade scalability.

---

## 🏛 Architecture Overview

The backend uses a layered architecture separating concerns into domain models, services, dependencies, and presentation routers:

```
├── app/
│   ├── api/                     # Controller / Route Layer
│   │   ├── deps.py              # Dependency Injection providers
│   │   └── v1/
│   │       ├── router.py        # Master API v1 router
│   │       └── endpoints/
│   │           └── resumes.py   # Resume ranking endpoints (POST /api/rank-resumes)
│   ├── core/                    # Application Configuration
│   │   └── config.py            # Pydantic Settings & CORS configuration
│   ├── schemas/                 # Data Transfer Objects (DTOs / Pydantic models)
│   │   └── resume.py            # Resume, JobDescription, Ranking request/response schemas
│   ├── services/                # Business Logic Layer (Clean OOP Interfaces)
│   │   ├── base.py              # BaseRankingEngine (Abstract Base Class)
│   │   └── resume_service.py    # Concrete ResumeRankingService implementation
│   └── main.py                  # FastAPI Application Factory & Middleware
├── tests/                       # Unit and Integration Tests
│   └── test_api.py              # CORS and endpoint tests
├── main.py                      # Root entrypoint for uvicorn runner
├── requirements.txt             # Project dependencies
└── .env.example                 # Environment configuration template
```

### Clean OOP Principles Applied:
- **Dependency Inversion Principle (DIP)**: `BaseRankingEngine` defines the abstract contract. Controllers depend on the interface rather than the concrete implementation.
- **Single Responsibility Principle (SRP)**: Data validation (`schemas/`), business logic (`services/`), configuration (`core/`), and HTTP orchestration (`api/`) are completely decoupled.
- **Open/Closed Principle (OCP)**: Future ranking algorithms (e.g. LLM/NLP embeddings, vector search via Pinecone/Qdrant, custom weights) can extend `BaseRankingEngine` without altering existing endpoint logic.
- **Inversion of Control (IoC)**: FastAPI's dependency injection system (`app/api/deps.py`) injects ranking services into endpoints, facilitating effortless testing and mock injection.

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+ (tested with Python 3.14+)
- Git

### 2. Environment Setup

```bash
# Clone the repository (if not already local)
git clone <repository_url>
cd "Resume Screener"

# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
copy .env.example .env   # Windows
cp .env.example .env     # Linux / macOS
```

---

## 🏃 Running the Application

### Development Mode (with hot-reload):
```bash
uvicorn main:app --reload --port 8000
```
Or directly:
```bash
python main.py
```

The server will start at `http://localhost:8000`.

- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🔌 API Endpoints

## 🔌 API Endpoints

### 1. Rank Resumes from Uploaded PDFs
- **Endpoint**: `POST /api/rank-resumes` (also mounted as `POST /api/v1/rank-resumes`)
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `job_requirements` (`string`): Freeform or structured text describing the role, required experience, and mandatory skills.
  - `resumes` (`list[file]`): One or more PDF resume files.

#### cURL Example:
```bash
curl -X POST "http://localhost:8000/api/rank-resumes" \
  -F "job_requirements=Senior Python Backend Engineer with FastAPI, Docker, and PostgreSQL expertise" \
  -F "resumes=@/path/to/candidate_a.pdf" \
  -F "resumes=@/path/to/candidate_b.pdf"
```

#### Example Output (Sorted by `fit_score` Descending):
```json
[
  {
    "candidate_name": "Bob Senior Architect",
    "fit_score": 94.0,
    "key_strengths": [
      "8+ years of production Python and FastAPI microservices architecture",
      "Extensive Docker container orchestration and PostgreSQL database tuning"
    ],
    "missing_requirements": [],
    "verdict": "Strong Match - Recommended for Interview"
  },
  {
    "candidate_name": "Alice Junior",
    "fit_score": 52.0,
    "key_strengths": [
      "Proficient in Python scripting and basic web development"
    ],
    "missing_requirements": [
      "Lacks hands-on experience with FastAPI in production",
      "Limited knowledge of PostgreSQL query optimization"
    ],
    "verdict": "Potential Match - Consider for Junior / Secondary Review"
  }
]
```

---

## 🤖 LLM Configuration

The application supports **Google Gemini API** (`gemini-2.5-flash` / `gemini-2.0-flash`) and **OpenAI API** (`gpt-4o-mini` / `gpt-4o`).

Configure your credentials in `.env`:

```env
# For Google Gemini (Recommended):
LLM_PROVIDER="gemini"
GEMINI_API_KEY="AIzaSy..."
GEMINI_MODEL="gemini-2.5-flash"

# Or for OpenAI:
LLM_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-4o-mini"
```

*Note: If no API keys are provided, the backend falls back to an intelligent heuristic screener for seamless offline testing and local development.*

---

## 🌐 CORS Configuration

The application includes `CORSMiddleware` preconfigured to allow connections from local frontend dev servers (`http://localhost:3000`, `http://localhost:5173`, etc.), enabling seamless integration with Next.js, Vite, React, Vue, and Svelte applications. Custom origins can be set in `.env` via `BACKEND_CORS_ORIGINS`.

---

## 🧪 Running Tests

```bash
pytest
```

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

### 1. Rank Resumes
- **Endpoint**: `POST /api/rank-resumes` (also available as `POST /api/v1/rank-resumes`)
- **Description**: Ranks candidates against job requirements. Supports empty POST requests or full candidate payloads.

#### Example Request:
```json
{
  "job_description": {
    "title": "Senior Python Backend Engineer",
    "required_skills": ["Python", "FastAPI", "Docker", "PostgreSQL"]
  },
  "resumes": [
    {
      "id": "cand-001",
      "candidate_name": "Alice Developer",
      "skills": ["Python", "FastAPI"]
    },
    {
      "id": "cand-002",
      "candidate_name": "Bob Senior Architect",
      "skills": ["Python", "FastAPI", "Docker", "PostgreSQL", "Kubernetes"]
    }
  ],
  "threshold_score": 0.0,
  "top_n": 5
}
```

#### Example Response:
```json
{
  "status": "success",
  "message": "Successfully ranked 2 candidate(s).",
  "total_candidates": 2,
  "results": [
    {
      "rank": 1,
      "candidate_id": "cand-002",
      "candidate_name": "Bob Senior Architect",
      "score": 100.0,
      "match_percentage": 100.0,
      "matched_skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
      "missing_skills": [],
      "summary": "Matched 4 of 4 required skills."
    },
    {
      "rank": 2,
      "candidate_id": "cand-001",
      "candidate_name": "Alice Developer",
      "score": 50.0,
      "match_percentage": 50.0,
      "matched_skills": ["Python", "FastAPI"],
      "missing_skills": ["Docker", "PostgreSQL"],
      "summary": "Matched 2 of 4 required skills."
    }
  ],
  "processed_at": "2026-09-27T05:00:00Z"
}
```

---

## 🌐 CORS Configuration

The application includes `CORSMiddleware` preconfigured to allow connections from local frontend dev servers (`http://localhost:3000`, `http://localhost:5173`, etc.), enabling seamless integration with Next.js, Vite, React, Vue, and Svelte applications. Custom origins can be set in `.env` via `BACKEND_CORS_ORIGINS`.

---

## 🧪 Running Tests

```bash
pytest
```

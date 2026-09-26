"""
Unit and integration tests for API endpoints and CORS middleware.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Verify health check endpoint returns 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_cors_localhost_header():
    """Verify CORS middleware correctly returns Access-Control-Allow-Origin for localhost."""
    headers = {"Origin": "http://localhost:3000"}
    response = client.get("/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_empty_post_rank_resumes():
    """Verify POST /api/rank-resumes succeeds when called with an empty body."""
    response = client.post("/api/rank-resumes", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_candidates"] == 0
    assert data["results"] == []


def test_empty_post_rank_resumes_no_body():
    """Verify POST /api/rank-resumes succeeds with no request body provided."""
    response = client.post("/api/rank-resumes")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_candidates"] == 0


def test_populated_post_rank_resumes():
    """Verify POST /api/rank-resumes ranks candidates according to criteria."""
    payload = {
        "job_description": {
            "title": "Senior Python Backend Engineer",
            "required_skills": ["Python", "FastAPI", "Docker", "PostgreSQL"],
        },
        "resumes": [
            {
                "id": "cand-001",
                "candidate_name": "Alice Developer",
                "skills": ["Python", "FastAPI"],
            },
            {
                "id": "cand-002",
                "candidate_name": "Bob Senior Architect",
                "skills": ["Python", "FastAPI", "Docker", "PostgreSQL", "Kubernetes"],
            },
        ],
    }

    response = client.post("/api/rank-resumes", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_candidates"] == 2

    results = data["results"]
    assert len(results) == 2
    # Bob should be ranked #1 with 100% score (all 4 skills matched)
    assert results[0]["candidate_name"] == "Bob Senior Architect"
    assert results[0]["rank"] == 1
    assert results[0]["score"] == 100.0
    # Alice should be ranked #2 with 50% score (2 of 4 skills matched)
    assert results[1]["candidate_name"] == "Alice Developer"
    assert results[1]["rank"] == 2
    assert results[1]["score"] == 50.0

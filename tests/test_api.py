"""
Unit and integration tests for API endpoints, PDF extraction, and resume ranking.
"""

import io
import pymupdf
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.services.llm_screener import HeuristicMockScreeningService
from app.services.pdf_extractor import PyMuPDFExtractor

client = TestClient(app)


def create_in_memory_pdf(text: str) -> io.BytesIO:
    """Helper to generate a real PDF in memory using PyMuPDF."""
    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((50, 50), text)
    pdf_bytes = doc.write()
    doc.close()
    return io.BytesIO(pdf_bytes)


def test_health_check():
    """Verify health check endpoint returns 200 OK."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_cors_localhost_header():
    """Verify CORS middleware allows localhost connections."""
    headers = {"Origin": "http://localhost:3000"}
    response = client.get("/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_pymupdf_extractor_unit():
    """Unit test PyMuPDF text extractor with in-memory PDF."""
    content = "Jane Doe\nSenior Backend Engineer\nExtensive Python and FastAPI experience."
    pdf_buf = create_in_memory_pdf(content)
    extractor = PyMuPDFExtractor()
    extracted = extractor.extract_text(pdf_buf.getvalue(), filename="jane_doe.pdf")
    assert "Jane Doe" in extracted
    assert "Python" in extracted
    assert "FastAPI" in extracted


@pytest.mark.asyncio
async def test_heuristic_mock_screener_unit():
    """Unit test the heuristic fallback HR screener."""
    screener = HeuristicMockScreeningService()
    job_req = "Senior Python Engineer with FastAPI and Docker experience."
    resume_text = "Alice Smith\nPython Developer with 5 years experience in FastAPI and Docker."

    result = await screener.screen_candidate(
        job_requirements=job_req,
        resume_text=resume_text,
        filename="alice_smith.pdf",
    )
    assert result.candidate_name == "Alice Smith"
    assert result.fit_score >= 50.0
    assert len(result.key_strengths) > 0
    assert isinstance(result.verdict, str)


def test_rank_resumes_multipart_endpoint():
    """Verify POST /api/rank-resumes handles multipart/form-data and returns descending sorted candidates."""
    resume_1_text = """
John Doe
Senior Software Engineer
Skills: Python, FastAPI, Docker, PostgreSQL, Redis, Kubernetes
10 years of experience building high-scale distributed backend systems.
"""
    resume_2_text = """
Bob Junior
Junior Web Designer
Skills: HTML, CSS, Graphic Design, WordPress
1 year experience designing marketing landing pages.
"""

    pdf_1 = create_in_memory_pdf(resume_1_text)
    pdf_2 = create_in_memory_pdf(resume_2_text)

    job_requirements = (
        "Seeking Senior Python Backend Engineer with strong expertise in "
        "FastAPI, Docker, PostgreSQL, and distributed cloud microservices."
    )

    files = [
        ("resumes", ("john_doe.pdf", pdf_1, "application/pdf")),
        ("resumes", ("bob_junior.pdf", pdf_2, "application/pdf")),
    ]
    data = {
        "job_requirements": job_requirements,
    }

    response = client.post("/api/rank-resumes", data=data, files=files)
    assert response.status_code == 200

    results = response.json()
    assert isinstance(results, list)
    assert len(results) == 2

    # Verify required schema fields on each item
    for candidate in results:
        assert "candidate_name" in candidate
        assert "fit_score" in candidate
        assert "key_strengths" in candidate
        assert "missing_requirements" in candidate
        assert "verdict" in candidate
        assert isinstance(candidate["key_strengths"], list)
        assert isinstance(candidate["missing_requirements"], list)
        assert 0.0 <= candidate["fit_score"] <= 100.0

    # Verify descending sort order by fit_score
    assert results[0]["fit_score"] >= results[1]["fit_score"]
    # John Doe should outrank Bob Junior for a Python backend role
    assert results[0]["candidate_name"] == "John Doe"


def test_rank_resumes_missing_job_requirements():
    """Verify endpoint rejects empty job_requirements with 422 or 400."""
    pdf = create_in_memory_pdf("Sample Candidate Resume Content")
    files = [("resumes", ("sample.pdf", pdf, "application/pdf"))]
    response = client.post("/api/rank-resumes", data={"job_requirements": ""}, files=files)
    assert response.status_code in (400, 422)


def test_rank_resumes_non_pdf_file():
    """Verify endpoint handles non-PDF uploads gracefully."""
    fake_txt = io.BytesIO(b"This is a plain text file, not a PDF")
    files = [("resumes", ("invalid.txt", fake_txt, "text/plain"))]
    data = {"job_requirements": "Looking for any engineer"}

    response = client.post("/api/rank-resumes", data=data, files=files)
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["fit_score"] == 0.0
    assert "Rejected" in results[0]["verdict"]


@pytest.mark.asyncio
async def test_gemini_screening_service_success(monkeypatch):
    """Verify GeminiScreeningService correctly parses structured LLM output."""
    from unittest.mock import AsyncMock, MagicMock
    from app.services.llm_screener import GeminiScreeningService

    mock_response = MagicMock()
    mock_response.text = '{"candidate_name": "Carol Danvers", "fit_score": 92.5, "key_strengths": ["FastAPI", "Python"], "missing_requirements": [], "verdict": "Strong Match"}'

    service = GeminiScreeningService(api_key="fake-gemini-key")
    service.client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    result = await service.screen_candidate(
        job_requirements="Python FastAPI",
        resume_text="Carol Danvers Python FastAPI",
        filename="carol.pdf",
    )

    assert result.candidate_name == "Carol Danvers"
    assert result.fit_score == 92.5
    assert result.key_strengths == ["FastAPI", "Python"]
    assert result.verdict == "Strong Match"


@pytest.mark.asyncio
async def test_openai_screening_service_success(monkeypatch):
    """Verify OpenAIScreeningService correctly parses structured LLM output."""
    from unittest.mock import AsyncMock, MagicMock
    from app.services.llm_screener import OpenAIScreeningService

    mock_choice = MagicMock()
    mock_choice.message.content = '{"candidate_name": "Bruce Banner", "fit_score": 88.0, "key_strengths": ["Distributed Systems"], "missing_requirements": ["Python 3.14"], "verdict": "Strong Candidate"}'
    mock_response = MagicMock()
    mock_response.choices = [mock_choice]

    service = OpenAIScreeningService(api_key="fake-openai-key")
    service.client.chat.completions.create = AsyncMock(return_value=mock_response)

    result = await service.screen_candidate(
        job_requirements="Senior Distributed Systems Architect",
        resume_text="Bruce Banner Distributed Systems",
        filename="bruce.pdf",
    )

    assert result.candidate_name == "Bruce Banner"
    assert result.fit_score == 88.0
    assert result.key_strengths == ["Distributed Systems"]
    assert result.missing_requirements == ["Python 3.14"]
    assert result.verdict == "Strong Candidate"


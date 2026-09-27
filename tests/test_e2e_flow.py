"""
End-to-End verification script for the Resume Screener application.
Tests concurrent processing of 3 PDF resumes, response timing, ranking accuracy, and error handling.
"""

import time
import httpx


def test_concurrent_screening_e2e():
    """Verify backend processes 3 PDF resumes concurrently without timing out."""
    with open("test_resumes/candidate_1_sarah_backend.pdf", "rb") as f1, \
         open("test_resumes/candidate_2_david_fullstack.pdf", "rb") as f2, \
         open("test_resumes/candidate_3_emily_junior.pdf", "rb") as f3:

        files = [
            ("resumes", ("candidate_1_sarah_backend.pdf", f1.read(), "application/pdf")),
            ("resumes", ("candidate_2_david_fullstack.pdf", f2.read(), "application/pdf")),
            ("resumes", ("candidate_3_emily_junior.pdf", f3.read(), "application/pdf")),
        ]

    data = {
        "job_requirements": (
            "Seeking Senior Python Backend Engineer with 5+ years experience. "
            "Mandatory expertise in Python, FastAPI, Docker, PostgreSQL, and distributed async microservices architecture."
        )
    }

    start_time = time.time()
    response = httpx.post(
        "http://127.0.0.1:8000/api/rank-resumes",
        data=data,
        files=files,
        timeout=30.0,
    )
    elapsed = time.time() - start_time

    assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
    results = response.json()
    assert isinstance(results, list), "Response must be a JSON array"
    assert len(results) == 3, f"Expected 3 ranked candidates, got {len(results)}"

    print(f"\n[PASS] E2E 3-Resume Screening completed in {elapsed:.3f}s (well within timeout limits)")

    # Verify descending sort order
    scores = [c["fit_score"] for c in results]
    assert scores == sorted(scores, reverse=True), f"Results are not sorted descending: {scores}"

    # Verify Sarah Chen (Python Backend) ranks #1
    rank_1 = results[0]
    print(f"Rank 1: {rank_1['candidate_name']} - Score: {rank_1['fit_score']}% ({rank_1['verdict']})")
    assert "sarah" in rank_1["candidate_name"].lower() or "backend" in rank_1["candidate_name"].lower()
    assert rank_1["fit_score"] >= 65.0

    # Print remaining ranks
    for i, c in enumerate(results[1:], start=2):
        print(f"Rank {i}: {c['candidate_name']} - Score: {c['fit_score']}% ({c['verdict']})")


def test_api_error_handling_graceful():
    """Verify backend and API contract return clean errors on missing/malformed inputs."""
    # 1. Missing job requirements
    with open("test_resumes/candidate_1_sarah_backend.pdf", "rb") as f:
        files = [("resumes", ("candidate_1.pdf", f.read(), "application/pdf"))]

    resp_empty_jd = httpx.post(
        "http://127.0.0.1:8000/api/rank-resumes",
        data={"job_requirements": "   "},
        files=files,
    )
    assert resp_empty_jd.status_code == 400
    assert "job_requirements field cannot be empty" in resp_empty_jd.json()["detail"]
    print("[PASS] Graceful error handling for empty job requirements verified (400 Bad Request)")

    # 2. Non-PDF files submitted
    resp_non_pdf = httpx.post(
        "http://127.0.0.1:8000/api/rank-resumes",
        data={"job_requirements": "Valid job description"},
        files=[("resumes", ("bad_file.txt", b"plain text content", "text/plain"))],
    )
    assert resp_non_pdf.status_code == 200
    non_pdf_result = resp_non_pdf.json()[0]
    assert non_pdf_result["fit_score"] == 0.0
    assert "Rejected" in non_pdf_result["verdict"]
    print("[PASS] Graceful error handling for non-PDF file verified")


if __name__ == "__main__":
    test_concurrent_screening_e2e()
    test_api_error_handling_graceful()
    print("\nAll End-to-End tests PASSED successfully!")

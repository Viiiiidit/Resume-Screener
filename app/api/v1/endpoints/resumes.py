"""
Resume ranking API endpoints.
Provides endpoints for evaluating and ranking uploaded PDF resumes against job requirements.
"""

from typing import List
from fastapi import APIRouter, Depends, File, Form, UploadFile, status

from app.api.deps import get_hr_screening_service
from app.schemas.screening import CandidateScreeningResult
from app.services.screening_service import HRResumeScreeningService

router = APIRouter(tags=["Resumes"])


@router.post(
    "/rank-resumes",
    response_model=List[CandidateScreeningResult],
    status_code=status.HTTP_200_OK,
    summary="Rank Resumes from Uploaded PDFs",
    description="Accepts job requirements and candidate resume PDFs via multipart/form-data, extracts raw text via PyMuPDF, evaluates candidates with an LLM senior HR screener, and returns candidate evaluations sorted by fit_score in descending order.",
)
async def rank_resumes(
    job_requirements: str = Form(
        ...,
        description="Job requirements, mandatory skills, and qualification criteria.",
    ),
    resumes: List[UploadFile] = File(
        ...,
        description="One or more candidate resume files in PDF format.",
    ),
    service: HRResumeScreeningService = Depends(get_hr_screening_service),
) -> List[CandidateScreeningResult]:
    """Multipart endpoint to screen and rank candidate resume PDFs."""
    return await service.rank_resumes(
        job_requirements=job_requirements,
        files=resumes,
    )

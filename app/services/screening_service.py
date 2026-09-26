"""
Orchestrator service for HR Resume Screening and Ranking.
Coordinates PDF extraction, LLM evaluation, and rank ordering.
"""

import asyncio
import logging
from typing import List
from fastapi import HTTPException, UploadFile, status

from app.schemas.screening import CandidateScreeningResult
from app.services.llm_screener import BaseLLMScreener
from app.services.pdf_extractor import BasePDFExtractor, PDFExtractionError

logger = logging.getLogger(__name__)


class HRResumeScreeningService:
    """Coordinates parsing of uploaded resume files and LLM-driven candidate ranking."""

    def __init__(self, pdf_extractor: BasePDFExtractor, llm_screener: BaseLLMScreener):
        self.pdf_extractor = pdf_extractor
        self.llm_screener = llm_screener

    async def _process_single_resume(
        self, job_requirements: str, file: UploadFile
    ) -> CandidateScreeningResult:
        """Process an individual PDF file and evaluate it against job requirements."""
        filename = file.filename or "unknown.pdf"

        # Check file extension
        if not filename.lower().endswith(".pdf"):
            logger.warning("Uploaded file %s is not a PDF.", filename)
            return CandidateScreeningResult(
                candidate_name=filename,
                fit_score=0.0,
                key_strengths=[],
                missing_requirements=["File must be in valid PDF format."],
                verdict="Rejected - Non-PDF file submitted",
            )

        try:
            file_bytes = await file.read()
            raw_text = self.pdf_extractor.extract_text(file_bytes, filename=filename)
        except PDFExtractionError as exc:
            logger.error("Text extraction failed for %s: %s", filename, exc)
            return CandidateScreeningResult(
                candidate_name=filename,
                fit_score=0.0,
                key_strengths=[],
                missing_requirements=["Failed to extract text from document."],
                verdict=f"Rejected - Document Parsing Error: {str(exc)}",
            )

        if not raw_text.strip():
            logger.warning("Empty or image-only PDF: %s", filename)
            return CandidateScreeningResult(
                candidate_name=filename,
                fit_score=0.0,
                key_strengths=[],
                missing_requirements=["Document contains no machine-readable text."],
                verdict="Rejected - Empty or unreadable resume text",
            )

        # Delegate evaluation to LLM screener
        return await self.llm_screener.screen_candidate(
            job_requirements=job_requirements,
            resume_text=raw_text,
            filename=filename,
        )

    async def rank_resumes(
        self, job_requirements: str, files: List[UploadFile]
    ) -> List[CandidateScreeningResult]:
        """Process multiple uploaded PDF resumes, rank them by fit score, and return sorted results."""
        if not job_requirements or not job_requirements.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="job_requirements field cannot be empty.",
            )

        if not files:
            return []

        # Process all resumes concurrently
        tasks = [
            self._process_single_resume(job_requirements=job_requirements, file=file)
            for file in files
        ]
        results = await asyncio.gather(*tasks, return_exceptions=False)

        # Sort candidates by fit_score in descending order
        sorted_results = sorted(results, key=lambda c: c.fit_score, reverse=True)
        return sorted_results

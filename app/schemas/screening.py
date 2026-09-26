"""
Pydantic schema definitions for LLM-based HR resume screening.
"""

from typing import List
from pydantic import BaseModel, Field


class CandidateScreeningResult(BaseModel):
    """Structured evaluation output produced by the HR screener LLM."""

    candidate_name: str = Field(
        ...,
        description="Full name of the candidate extracted from the resume",
    )
    fit_score: float = Field(
        ...,
        ge=0.0,
        le=100.0,
        description="Fit score from 0 to 100 assessing alignment with the job requirements",
    )
    key_strengths: List[str] = Field(
        default_factory=list,
        description="List of key strengths and matching qualifications",
    )
    missing_requirements: List[str] = Field(
        default_factory=list,
        description="List of required skills or qualifications the candidate lacks",
    )
    verdict: str = Field(
        ...,
        description="Final screening assessment verdict (e.g., Highly Recommended, Consider, Not Recommended)",
    )

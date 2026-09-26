"""
Pydantic schemas for resume screening and ranking.
Defines Data Transfer Objects (DTOs) for request/response serialization and validation.
"""

from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field


class JobDescription(BaseModel):
    """Schema representing job role requirements for screening."""

    title: Optional[str] = Field(default=None, description="Title of the job position")
    department: Optional[str] = Field(default=None, description="Department or team")
    required_skills: List[str] = Field(
        default_factory=list, description="Mandatory and preferred skills"
    )
    experience_level: Optional[str] = Field(
        default=None, description="E.g., Junior, Mid, Senior, Lead"
    )
    raw_text: Optional[str] = Field(
        default=None, description="Full job description text"
    )


class ResumeData(BaseModel):
    """Schema representing an individual candidate resume."""

    id: Optional[str] = Field(default=None, description="Unique resume or candidate identifier")
    candidate_name: Optional[str] = Field(default=None, description="Name of the applicant")
    email: Optional[str] = Field(default=None, description="Contact email")
    raw_text: Optional[str] = Field(default=None, description="Extracted resume text content")
    skills: List[str] = Field(default_factory=list, description="Extracted skills")
    years_of_experience: Optional[float] = Field(
        default=None, description="Calculated or declared years of experience"
    )


class RankResumesRequest(BaseModel):
    """Request payload for ranking candidate resumes against a job description.

    Designed with optional defaults so an empty POST request succeeds.
    """

    job_description: Optional[JobDescription] = Field(
        default=None, description="Target job profile to match against"
    )
    resumes: List[ResumeData] = Field(
        default_factory=list, description="List of resumes to evaluate and rank"
    )
    threshold_score: Optional[float] = Field(
        default=0.0, ge=0.0, le=100.0, description="Minimum qualifying match score"
    )
    top_n: Optional[int] = Field(
        default=None, ge=1, description="Limit output to top N candidates"
    )


class RankedCandidate(BaseModel):
    """Schema representing a ranked candidate with match analytics."""

    rank: int = Field(..., description="Position in the ranked list (1-indexed)")
    candidate_id: Optional[str] = Field(default=None, description="Candidate ID")
    candidate_name: Optional[str] = Field(default=None, description="Applicant name")
    score: float = Field(..., ge=0.0, le=100.0, description="Match score from 0 to 100")
    match_percentage: float = Field(..., ge=0.0, le=100.0, description="Relative match percentage")
    matched_skills: List[str] = Field(default_factory=list, description="Identified matching skills")
    missing_skills: List[str] = Field(default_factory=list, description="Identified missing skills")
    summary: Optional[str] = Field(default=None, description="Evaluation summary or reasoning")


class RankResumesResponse(BaseModel):
    """Response payload returned by the resume ranking engine."""

    status: str = Field(default="success", description="Status of the ranking execution")
    message: str = Field(
        default="Resume ranking completed successfully.",
        description="User-facing status message",
    )
    total_candidates: int = Field(
        default=0, description="Total number of candidates analyzed"
    )
    results: List[RankedCandidate] = Field(
        default_factory=list, description="Ranked list of evaluated candidates"
    )
    processed_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="UTC timestamp of when the request was processed",
    )

"""
Abstract base classes defining interfaces for ranking engines.
Adheres to the Dependency Inversion Principle (DIP) and Open-Closed Principle (OCP).
"""

from abc import ABC, abstractmethod
from typing import Optional
from app.schemas.resume import (
    JobDescription,
    RankedCandidate,
    RankResumesRequest,
    RankResumesResponse,
    ResumeData,
)


class BaseRankingEngine(ABC):
    """Abstract interface for all resume ranking engines."""

    @abstractmethod
    async def rank_resumes(self, request: RankResumesRequest) -> RankResumesResponse:
        """Evaluate candidate resumes and return sorted rankings."""
        pass

    @abstractmethod
    def evaluate_candidate(
        self,
        resume: ResumeData,
        job_description: Optional[JobDescription],
        rank: int,
    ) -> RankedCandidate:
        """Evaluate an individual candidate resume against job requirements."""
        pass

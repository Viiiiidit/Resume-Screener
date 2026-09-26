"""
API dependencies and dependency injection providers.
Enables clean test mocking, loose coupling, and inversion of control.
"""

from functools import lru_cache
from app.services.base import BaseRankingEngine
from app.services.resume_service import ResumeRankingService


@lru_cache()
def get_resume_service() -> BaseRankingEngine:
    """Dependency provider returning an instance of the resume ranking engine."""
    return ResumeRankingService()

"""
API dependencies and dependency injection providers.
Enables clean test mocking, loose coupling, and inversion of control.
"""

from functools import lru_cache
import logging
from fastapi import Depends
from app.core.config import Settings, get_settings
from app.services.base import BaseRankingEngine
from app.services.llm_screener import (
    BaseLLMScreener,
    GeminiScreeningService,
    HeuristicMockScreeningService,
    OpenAIScreeningService,
)
from app.services.pdf_extractor import BasePDFExtractor, PyMuPDFExtractor
from app.services.resume_service import ResumeRankingService
from app.services.screening_service import HRResumeScreeningService

logger = logging.getLogger(__name__)


@lru_cache()
def get_resume_service() -> BaseRankingEngine:
    """Dependency provider returning an instance of the baseline resume ranking engine."""
    return ResumeRankingService()


@lru_cache()
def get_pdf_extractor() -> BasePDFExtractor:
    """Dependency provider returning a PyMuPDF text extractor instance."""
    return PyMuPDFExtractor()


@lru_cache()
def get_llm_screener() -> BaseLLMScreener:
    """Dependency provider returning the configured LLM screening engine."""
    settings: Settings = get_settings()
    provider = settings.LLM_PROVIDER.lower().strip()

    if provider == "gemini" and settings.GEMINI_API_KEY:
        logger.info("Initializing GeminiScreeningService with model %s", settings.GEMINI_MODEL)
        return GeminiScreeningService(
            api_key=settings.GEMINI_API_KEY,
            model_name=settings.GEMINI_MODEL,
        )

    if provider == "openai" and settings.OPENAI_API_KEY:
        logger.info("Initializing OpenAIScreeningService with model %s", settings.OPENAI_MODEL)
        return OpenAIScreeningService(
            api_key=settings.OPENAI_API_KEY,
            model_name=settings.OPENAI_MODEL,
        )

    # Fallback to intelligent heuristic screener if API keys are not provided
    logger.warning(
        "No LLM API keys detected for provider '%s'. Using HeuristicMockScreeningService.",
        provider,
    )
    return HeuristicMockScreeningService()


def get_hr_screening_service(
    pdf_extractor: BasePDFExtractor = Depends(get_pdf_extractor),
    llm_screener: BaseLLMScreener = Depends(get_llm_screener),
) -> HRResumeScreeningService:
    """Dependency provider returning the orchestrated HR resume screening service."""
    return HRResumeScreeningService(
        pdf_extractor=pdf_extractor,
        llm_screener=llm_screener,
    )

"""
Resume ranking API endpoints.
Provides endpoints for evaluating and ranking resumes against job descriptions.
"""

from typing import Optional
from fastapi import APIRouter, Depends, status
from app.api.deps import get_resume_service
from app.schemas.resume import RankResumesRequest, RankResumesResponse
from app.services.base import BaseRankingEngine

router = APIRouter(tags=["Resumes"])


@router.post(
    "/rank-resumes",
    response_model=RankResumesResponse,
    status_code=status.HTTP_200_OK,
    summary="Rank Resumes",
    description="Evaluates candidate resumes against a specified job description and returns an ordered list ranked by relevance.",
)
async def rank_resumes(
    payload: Optional[RankResumesRequest] = None,
    service: BaseRankingEngine = Depends(get_resume_service),
) -> RankResumesResponse:
    """Endpoint to rank candidate resumes.

    Can be invoked with an empty POST request or a populated request body.
    """
    request_data = payload or RankResumesRequest()
    return await service.rank_resumes(request_data)

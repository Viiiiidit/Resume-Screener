"""
API Router configuration module.
Consolidates endpoints into modular routers.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import resumes

api_router = APIRouter()

# Mount resumes endpoints
api_router.include_router(resumes.router)

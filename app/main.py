"""
FastAPI Application Entry Point.
Initializes middleware, routing, CORS policy, and application lifecycle.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.router import api_router
from app.core.config import Settings, get_settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown events."""
    # Startup tasks (e.g. database connection pools, AI models pre-warming)
    yield
    # Shutdown tasks (e.g. closing connection pools)


def create_application() -> FastAPI:
    """Factory function to instantiate and configure the FastAPI application."""
    settings: Settings = get_settings()

    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Modular B2B SaaS Backend for Automated Candidate Resume Screening and Ranking.",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # Configure CORS middleware for local frontend development and configured origins
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register API Routers
    # Mounted at /api to support POST /api/rank-resumes directly
    app.include_router(api_router, prefix=settings.API_V1_STR)
    # Also mount under /api/v1 for versioned client compatibility
    app.include_router(api_router, prefix="/api/v1")

    @app.get(
        "/health",
        tags=["System"],
        status_code=status.HTTP_200_OK,
        summary="Health Check",
    )
    async def health_check():
        """Health check endpoint to verify service availability."""
        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "version": settings.VERSION,
        }

    @app.get(
        "/",
        tags=["System"],
        status_code=status.HTTP_200_OK,
        summary="Root Welcome",
    )
    async def root():
        """Root endpoint returning basic API metadata."""
        return {
            "message": f"Welcome to {settings.PROJECT_NAME}",
            "docs": "/docs",
            "health": "/health",
            "version": settings.VERSION,
        }

    return app


# Application instance
app = create_application()

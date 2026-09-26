"""
Root entrypoint for running the FastAPI application.
Can be executed directly via `python main.py` or through uvicorn: `uvicorn main:app --reload`.
"""

import uvicorn
from app.core.config import get_settings
from app.main import app

if __name__ == "__main__":
    settings = get_settings()
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )

"""
LLM Resume Screening Services.
Provides structured LLM assessment using Gemini or OpenAI APIs with Senior HR Screener persona.
"""

from abc import ABC, abstractmethod
import json
import logging
import re
from typing import Optional
from app.schemas.screening import CandidateScreeningResult

logger = logging.getLogger(__name__)

HR_SYSTEM_PROMPT = """You are an expert Senior HR Screener and Executive Talent Acquisition Director with 20+ years of technical recruiting experience.
Your job is to thoroughly evaluate candidate resumes against specific job requirements.

You must evaluate:
1. Alignment with mandatory technical and domain requirements.
2. Transferable skills and relevant experience depth.
3. Obvious gaps or missing prerequisites.

You must respond with a STRICT JSON object conforming to the following structure:
{
  "candidate_name": "Full name of the candidate extracted from the resume (or filename fallback if undetectable)",
  "fit_score": 85.0, // Floating-point score between 0.0 and 100.0 reflecting requirement fit
  "key_strengths": ["List of 2-5 specific strengths matching the requirements"],
  "missing_requirements": ["List of key requirements or technologies the candidate lacks"],
  "verdict": "Clear concise verdict (e.g., 'Strong Match - Recommended for Interview', 'Potential Match - Consider for Secondary Review', 'Not a Fit - Missing Core Prerequisites')"
}

CRITICAL: Do not output markdown code blocks (e.g. ```json). Return ONLY the raw JSON object.
"""


class BaseLLMScreener(ABC):
    """Abstract interface for LLM-powered candidate resume screeners."""

    @abstractmethod
    async def screen_candidate(
        self, job_requirements: str, resume_text: str, filename: str
    ) -> CandidateScreeningResult:
        """Evaluate a candidate's resume text against job requirements."""
        pass


class GeminiScreeningService(BaseLLMScreener):
    """Gemini API implementation using the official google-genai SDK."""

    def __init__(self, api_key: str, model_name: str = "gemini-2.5-flash"):
        from google import genai
        self.client = genai.Client(api_key=api_key)
        self.model_name = model_name

    async def screen_candidate(
        self, job_requirements: str, resume_text: str, filename: str
    ) -> CandidateScreeningResult:
        from google.genai import types

        user_prompt = f"""
Candidate File: {filename}

JOB REQUIREMENTS:
{job_requirements}

CANDIDATE RESUME TEXT:
{resume_text}
"""
        try:
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=user_prompt,
                config=types.GenerateContentConfig(
                    system_instruction=HR_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    response_schema=CandidateScreeningResult,
                    temperature=0.2,
                ),
            )

            raw_text = response.text or "{}"
            return CandidateScreeningResult.model_validate_json(raw_text)
        except Exception as exc:
            logger.error("Gemini API screening failed for %s: %s", filename, exc)
            raise RuntimeError(f"Gemini API screening failure on {filename}: {str(exc)}") from exc


class OpenAIScreeningService(BaseLLMScreener):
    """OpenAI API implementation for resume screening."""

    def __init__(self, api_key: str, model_name: str = "gpt-4o-mini"):
        from openai import AsyncOpenAI
        self.client = AsyncOpenAI(api_key=api_key)
        self.model_name = model_name

    async def screen_candidate(
        self, job_requirements: str, resume_text: str, filename: str
    ) -> CandidateScreeningResult:
        user_prompt = f"""
Candidate File: {filename}

JOB REQUIREMENTS:
{job_requirements}

CANDIDATE RESUME TEXT:
{resume_text}
"""
        try:
            response = await self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": HR_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            raw_content = response.choices[0].message.content or "{}"
            return CandidateScreeningResult.model_validate_json(raw_content)
        except Exception as exc:
            logger.error("OpenAI screening failed for %s: %s", filename, exc)
            raise RuntimeError(f"OpenAI screening failure on {filename}: {str(exc)}") from exc


class HeuristicMockScreeningService(BaseLLMScreener):
    """Heuristic fallback screener used in offline development or test environments."""

    def _extract_name(self, resume_text: str, filename: str) -> str:
        lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
        stop_words = {"resume", "curriculum", "vitae", "summary", "profile", "contact", "experience", "skills"}
        for line in lines[:5]:
            # Match 2-3 word name in Title Case or UPPERCASE, without numbers/special chars
            if re.match(r"^[A-Za-z]+(\s+[A-Za-z]+){1,2}$", line):
                lower_line = line.lower()
                if not any(sw in lower_line for sw in stop_words):
                    return line.title()
        # Fallback to cleaned filename
        clean_name = re.sub(r"[-_]", " ", filename.replace(".pdf", "")).title()
        return clean_name or "Anonymous Applicant"

    async def screen_candidate(
        self, job_requirements: str, resume_text: str, filename: str
    ) -> CandidateScreeningResult:
        candidate_name = self._extract_name(resume_text, filename)

        req_words = {w.lower() for w in re.findall(r"\b[A-Za-z]{3,}\b", job_requirements)}
        resume_words = {w.lower() for w in re.findall(r"\b[A-Za-z]{3,}\b", resume_text)}

        # Stopwords to exclude from overlap
        common_words = {"the", "and", "for", "with", "from", "that", "this", "have", "will", "been", "must", "plus", "year", "years"}
        key_reqs = req_words - common_words

        matched = list(key_reqs.intersection(resume_words))
        missing = list(key_reqs - resume_words)

        if key_reqs:
            fit_ratio = len(matched) / len(key_reqs)
            score = round(min(100.0, max(15.0, fit_ratio * 100.0)), 1)
        else:
            score = 75.0

        if score >= 75.0:
            verdict = "Strong Match - Recommended for Interview"
        elif score >= 50.0:
            verdict = "Potential Match - Consider for Secondary Review"
        else:
            verdict = "Not a Fit - Missing Core Prerequisites"

        return CandidateScreeningResult(
            candidate_name=candidate_name,
            fit_score=score,
            key_strengths=[f"Demonstrated background in {w.capitalize()}" for w in matched[:4]] or ["General background"],
            missing_requirements=[f"Requires qualification in {w.capitalize()}" for w in missing[:4]],
            verdict=verdict,
        )

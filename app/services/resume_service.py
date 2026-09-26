"""
Concrete Resume Ranking Service implementation.
Encapsulates candidate scoring, skill matching, and ranking logic.
"""

from typing import List, Optional, Set
from app.schemas.resume import (
    JobDescription,
    RankedCandidate,
    RankResumesRequest,
    RankResumesResponse,
    ResumeData,
)
from app.services.base import BaseRankingEngine


class ResumeRankingService(BaseRankingEngine):
    """Modular, extensible service for evaluating and ranking candidate resumes."""

    def __init__(self, default_weight_skills: float = 0.7, default_weight_experience: float = 0.3):
        self.default_weight_skills = default_weight_skills
        self.default_weight_experience = default_weight_experience

    def _normalize_tokens(self, tokens: List[str]) -> Set[str]:
        """Normalize token list to lowercase unique set."""
        return {t.strip().lower() for t in tokens if t and t.strip()}

    def _match_skills(
        self, candidate_skills: List[str], required_skills: List[str]
    ) -> tuple[List[str], List[str]]:
        """Identify matched and missing skills between candidate and job profile."""
        norm_candidate = self._normalize_tokens(candidate_skills)
        norm_required = self._normalize_tokens(required_skills)

        matched = [skill for skill in required_skills if skill.strip().lower() in norm_candidate]
        missing = [skill for skill in required_skills if skill.strip().lower() not in norm_candidate]
        return matched, missing

    def evaluate_candidate(
        self,
        resume: ResumeData,
        job_description: Optional[JobDescription],
        rank: int = 1,
    ) -> RankedCandidate:
        """Evaluate an individual candidate resume against job requirements."""
        if not job_description or not job_description.required_skills:
            # Baseline scoring if no explicit job criteria are provided
            score = 100.0 if resume.skills else 50.0
            return RankedCandidate(
                rank=rank,
                candidate_id=resume.id,
                candidate_name=resume.candidate_name or "Anonymous Candidate",
                score=score,
                match_percentage=score,
                matched_skills=resume.skills,
                missing_skills=[],
                summary="Evaluated with baseline criteria (no specific job profile provided).",
            )

        matched_skills, missing_skills = self._match_skills(
            candidate_skills=resume.skills,
            required_skills=job_description.required_skills,
        )

        total_required = len(job_description.required_skills)
        skill_score = (len(matched_skills) / total_required) * 100.0 if total_required > 0 else 100.0

        # Optional experience heuristic
        score = round(skill_score, 2)

        return RankedCandidate(
            rank=rank,
            candidate_id=resume.id,
            candidate_name=resume.candidate_name or "Anonymous Candidate",
            score=score,
            match_percentage=score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            summary=f"Matched {len(matched_skills)} of {total_required} required skills.",
        )

    async def rank_resumes(self, request: RankResumesRequest) -> RankResumesResponse:
        """Evaluate candidate resumes and return sorted rankings."""
        if not request.resumes:
            return RankResumesResponse(
                status="success",
                message="No resumes provided to rank. Empty ranking generated.",
                total_candidates=0,
                results=[],
            )

        # Evaluate each candidate
        evaluations: List[RankedCandidate] = []
        for idx, resume in enumerate(request.resumes):
            evaluated = self.evaluate_candidate(
                resume=resume,
                job_description=request.job_description,
                rank=idx + 1,
            )
            # Filter by threshold score if set
            if evaluated.score >= (request.threshold_score or 0.0):
                evaluations.append(evaluated)

        # Sort descending by score
        evaluations.sort(key=lambda c: c.score, reverse=True)

        # Re-assign 1-based ranks after sorting
        for idx, candidate in enumerate(evaluations):
            candidate.rank = idx + 1

        # Apply top_n slice if requested
        if request.top_n and request.top_n > 0:
            evaluations = evaluations[: request.top_n]

        return RankResumesResponse(
            status="success",
            message=f"Successfully ranked {len(evaluations)} candidate(s).",
            total_candidates=len(evaluations),
            results=evaluations,
        )

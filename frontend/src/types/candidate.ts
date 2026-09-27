/**
 * Candidate Screening Evaluation Result.
 * Matches backend Pydantic CandidateScreeningResult schema.
 */
export interface CandidateScreeningResult {
  candidate_name: string;
  fit_score: number;
  key_strengths: string[];
  missing_requirements: string[];
  verdict: string;
}

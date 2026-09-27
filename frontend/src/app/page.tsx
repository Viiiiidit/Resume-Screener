"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import JobRequirementsStep from "@/components/JobRequirementsStep";
import ResumeUploadStep from "@/components/ResumeUploadStep";
import AnalyzeButton from "@/components/AnalyzeButton";
import DashboardPreview from "@/components/DashboardPreview";
import LoadingScreeningState from "@/components/LoadingScreeningState";
import CandidateLeaderboard from "@/components/CandidateLeaderboard";
import { CandidateScreeningResult } from "@/types/candidate";
import { Sparkles, SlidersHorizontal, Layers, AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  // Two-step input local state
  const [jobRequirements, setJobRequirements] = useState<string>("");
  const [resumes, setResumes] = useState<File[]>([]);

  // API execution state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateScreeningResult[]>([]);

  // Add files preventing duplicates
  const handleAddFiles = (newFiles: File[]) => {
    setResumes((prev) => [...prev, ...newFiles]);
  };

  // Remove individual file by index
  const handleRemoveFile = (indexToRemove: number) => {
    setResumes((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Clear all uploaded files
  const handleClearFiles = () => {
    setResumes([]);
  };

  // Reset results to screen again
  const handleReset = () => {
    setCandidates([]);
    setApiError(null);
  };

  // Wire up Analyze & Rank Candidates to backend API
  const handleAnalyze = async () => {
    if (!jobRequirements.trim() || resumes.length === 0) {
      return;
    }

    setIsLoading(true);
    setApiError(null);

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    try {
      const formData = new FormData();
      formData.append("job_requirements", jobRequirements.trim());

      // Append each resume file under the 'resumes' multipart key
      resumes.forEach((file) => {
        formData.append("resumes", file, file.name);
      });

      const response = await fetch(`${backendUrl}/api/rank-resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`;
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }
        } catch {
          const text = await response.text();
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
      }

      const data: CandidateScreeningResult[] = await response.json();
      setCandidates(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect to ranking API.";
      setApiError(
        message.includes("Failed to fetch") || message.includes("NetworkError")
          ? "Could not connect to FastAPI backend at http://localhost:8000. Please ensure the backend server is running."
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Navigation Bar */}
      <Header />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Hero Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Talent Acquisition Suite</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Candidate Screening &amp; Ranking Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Evaluate applicant resumes with a Senior HR Screener and rank candidates by fit score.
              </p>
            </div>

            {/* Quick status pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 self-start sm:self-center">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Two-Step Screening Workflow</span>
            </div>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Two-Step Input Component (5 cols) */}
          <section className="lg:col-span-5 space-y-5" aria-label="Screening Inputs">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                <span>Input Criteria</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Step 1 &amp; 2
              </span>
            </div>

            {/* Step 1: Job Requirements */}
            <JobRequirementsStep
              value={jobRequirements}
              onChange={setJobRequirements}
            />

            {/* Step 2: Resume PDF Upload Zone */}
            <ResumeUploadStep
              files={resumes}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClearFiles={handleClearFiles}
            />

            {/* Primary Action Button: Analyze & Rank Candidates */}
            <div className="pt-2">
              <AnalyzeButton
                jobRequirements={jobRequirements}
                resumeCount={resumes.length}
                isLoading={isLoading}
                onAnalyze={handleAnalyze}
              />
            </div>
          </section>

          {/* Right Column: Dynamic Stage - Leaderboard, Loading, or Preview (7 cols) */}
          <section className="lg:col-span-7" aria-label="Results & Analytics">
            {/* Error Banner */}
            {apiError && (
              <div
                id="api-error-banner"
                className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-3 shadow-lg shadow-rose-500/5 animate-fadeIn"
              >
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-200">
                    Screening Request Failed
                  </p>
                  <p className="mt-1 leading-relaxed text-rose-300/90">
                    {apiError}
                  </p>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-[11px] font-semibold text-rose-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Request</span>
                  </button>
                </div>
              </div>
            )}

            {/* Render Candidate Leaderboard when results are ready */}
            {isLoading ? (
              <LoadingScreeningState fileCount={resumes.length} />
            ) : candidates.length > 0 ? (
              <CandidateLeaderboard
                candidates={candidates}
                onReset={handleReset}
              />
            ) : (
              <DashboardPreview
                jobRequirements={jobRequirements}
                files={resumes}
              />
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 TalentRank B2B SaaS. All rights reserved.</p>
          <p className="flex items-center space-x-2">
            <span>Powered by FastAPI &amp; Next.js</span>
            <span>•</span>
            <span>PyMuPDF &amp; LLM HR Engine</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

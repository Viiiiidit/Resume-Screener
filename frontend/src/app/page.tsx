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
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      {/* Clean Top Navigation */}
      <Header />

      {/* Main Dashboard Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Page Hero Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-gray-600" />
                <span>Candidate Screening Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Resume Screening &amp; Ranking
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Evaluate applicant resumes with automated AI screening and rank candidates by fit score.
              </p>
            </div>

            {/* Quick status pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-2xs text-xs font-medium text-gray-600 self-start sm:self-center">
              <Layers className="w-3.5 h-3.5 text-gray-500" />
              <span>Two-Step Workflow</span>
            </div>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Section (5 cols) */}
          <section className="lg:col-span-5 space-y-6" aria-label="Input Section">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center space-x-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-600" />
                <span>Input Section</span>
              </h2>
              <span className="text-xs text-gray-400 font-mono">
                Step 1 &amp; 2
              </span>
            </div>

            {/* Step 1: Job Requirements Card */}
            <JobRequirementsStep
              value={jobRequirements}
              onChange={setJobRequirements}
            />

            {/* Step 2: Resume PDF Upload Zone Card */}
            <ResumeUploadStep
              files={resumes}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClearFiles={handleClearFiles}
            />

            {/* Primary Action Button: Analyze & Rank Candidates */}
            <div className="pt-1">
              <AnalyzeButton
                jobRequirements={jobRequirements}
                resumeCount={resumes.length}
                isLoading={isLoading}
                onAnalyze={handleAnalyze}
              />
            </div>
          </section>

          {/* Right Column: Results Leaderboard Card Area (7 cols) */}
          <section className="lg:col-span-7" aria-label="Results Leaderboard">
            {/* Error Banner */}
            {apiError && (
              <div
                id="api-error-banner"
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-3 shadow-xs animate-fadeIn"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800">
                    Screening Request Failed
                  </p>
                  <p className="mt-1 leading-relaxed text-red-700">
                    {apiError}
                  </p>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 border border-red-300 text-xs font-semibold text-red-800 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Request</span>
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Stage: Loading, Leaderboard, or Initial Preview */}
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

      {/* Clean White Footer */}
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 TalentRank. Modern Candidate Screening System.</p>
          <p className="flex items-center space-x-2 text-gray-400">
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>Next.js Dashboard</span>
            <span>•</span>
            <span>PyMuPDF Text Extraction</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

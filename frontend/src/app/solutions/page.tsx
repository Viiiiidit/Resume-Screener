"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import JobRequirementsStep from "@/components/JobRequirementsStep";
import ResumeUploadStep from "@/components/ResumeUploadStep";
import AnalyzeButton from "@/components/AnalyzeButton";
import DashboardPreview from "@/components/DashboardPreview";
import LoadingScreeningState from "@/components/LoadingScreeningState";
import CandidateLeaderboard from "@/components/CandidateLeaderboard";
import Footer from "@/components/Footer";
import { CandidateScreeningResult } from "@/types/candidate";
import { AlertCircle, RefreshCw, SlidersHorizontal } from "lucide-react";

export default function SolutionsScreenerPage() {
  // Input local state
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

  // Wire up Analyze & Rank Candidates to FastAPI backend
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

      resumes.forEach((file) => {
        formData.append("resumes", file, file.name);
      });

      const response = await fetch(`${backendUrl}/api/rank-resumes`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `SERVER PROTOCOL ERROR (${response.status})`;
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
        err instanceof Error ? err.message : "FAILED TO CONNECT TO RANKING SERVICE.";
      setApiError(
        message.includes("Failed to fetch") || message.includes("NetworkError")
          ? "COULD NOT CONNECT TO FASTAPI SERVICE ON PORT 8000. PLEASE VERIFY RUNTIME ENGINE."
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#FF5050] selection:text-white">
      {/* 1. Sticky Navbar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* Solutions Screener Hero Banner with Starry Background */}
        <section className="starry-hero-bg py-16 sm:py-24 border-b border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-widest text-[#FF5050] mb-4 bg-black/60 px-3 py-1 border border-[#FF5050]/40">
                <span className="w-2 h-2 bg-[#FF5050] rotate-45" />
                <span>// VISTA.IO • AI RESUME INTELLIGENCE</span>
              </div>

              {/* Monospace Staggered Style Heading */}
              <h1 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92]">
                AI Resume Screener
              </h1>

              {/* Subheadline in Monospace */}
              <p className="mt-6 font-mono text-xs sm:text-sm text-gray-300 uppercase tracking-widest leading-relaxed max-w-3xl">
                Use Data to Get a 360-Degree View of Applicant Talent. Extract multi-page PDF dossiers, score against job criteria, and rank candidates automatically.
              </p>
            </div>
          </div>
        </section>

        {/* Main Screener Stage */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 2-Step Input Components (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center justify-between px-1">
                  <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-gray-300 flex items-center space-x-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF5050]" />
                    <span>Input Specification Matrix</span>
                  </h2>
                  <span className="font-mono text-[10px] text-gray-500 uppercase">
                    [ STAGE 1 &amp; 2 ]
                  </span>
                </div>

                {/* Step 1: Job Description Card */}
                <JobRequirementsStep
                  value={jobRequirements}
                  onChange={setJobRequirements}
                />

                {/* Step 2: PDF Upload Dropzone Card */}
                <ResumeUploadStep
                  files={resumes}
                  onAddFiles={handleAddFiles}
                  onRemoveFile={handleRemoveFile}
                  onClearFiles={handleClearFiles}
                />

                {/* Primary Action Button */}
                <div className="pt-2">
                  <AnalyzeButton
                    jobRequirements={jobRequirements}
                    resumeCount={resumes.length}
                    isLoading={isLoading}
                    onAnalyze={handleAnalyze}
                  />
                </div>
              </div>

              {/* Right Column: Leaderboard / Preview / Loading (7 cols) */}
              <div className="lg:col-span-7">
                {/* Error Banner */}
                {apiError && (
                  <div
                    id="api-error-banner"
                    className="mb-6 p-5 bg-black border border-[#FF5050] text-[#FF8585] font-mono text-xs flex items-start space-x-3 shadow-2xl animate-fadeIn"
                  >
                    <AlertCircle className="w-5 h-5 text-[#FF5050] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-[#FF5050] uppercase tracking-wider">
                        // PROTOCOL EXECUTION HALTED
                      </p>
                      <p className="mt-1 font-sans text-xs leading-relaxed text-gray-300">
                        {apiError}
                      </p>
                      <button
                        type="button"
                        onClick={handleAnalyze}
                        className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FF5050] text-white font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#e64040] transition-colors rounded-none cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>RETRY PROTOCOL</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Dynamic Stage: Loading, Leaderboard, or Initial Stage */}
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
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

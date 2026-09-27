"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import JobRequirementsStep from "@/components/JobRequirementsStep";
import ResumeUploadStep from "@/components/ResumeUploadStep";
import AnalyzeButton from "@/components/AnalyzeButton";
import DashboardPreview from "@/components/DashboardPreview";
import LoadingScreeningState from "@/components/LoadingScreeningState";
import CandidateLeaderboard from "@/components/CandidateLeaderboard";
import Footer from "@/components/Footer";
import { CandidateScreeningResult } from "@/types/candidate";
import { AlertCircle, RefreshCw, Terminal, SlidersHorizontal } from "lucide-react";

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
          ? "COULD NOT CONNECT TO FASTAPI SERVICE ON PORT 8000. VERIFY RUNTIME ENGINE."
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#FF3333] selection:text-white">
      {/* Black Navbar */}
      <Header />

      {/* Main Dashboard Hero with Starry Background */}
      <div className="starry-bg border-b border-neutral-900 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* System Tag */}
            <div className="inline-flex items-center space-x-2 font-mono text-[11px] uppercase tracking-widest text-[#FF3333] mb-4 bg-black/60 px-3 py-1 border border-[#FF3333]/30">
              <span className="w-1.5 h-1.5 bg-[#FF3333] animate-pulse" />
              <span>// SYSTEM PROTOCOL: NEURAL_CANDIDATE_SCREENER_v2.4</span>
            </div>

            {/* VISTA.IO Style Typography: "THE STANDARD IN NEW DATA ANALYSIS" */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-sans leading-[1.05]">
              THE STANDARD IN NEW DATA ANALYSIS
            </h1>

            <p className="mt-4 font-mono text-xs sm:text-sm text-neutral-400 uppercase tracking-widest leading-relaxed">
              Autonomous neural candidate evaluation. Multi-page dossier parsing and multi-vector rank ordering.
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Cards with dark olive/greenish background (5 cols) */}
          <section className="lg:col-span-5 space-y-6" aria-label="Input Vectors">
            <div className="flex items-center justify-between px-1">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center space-x-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF3333]" />
                <span>INPUT SPECIFICATION MATRIX</span>
              </h2>
              <span className="font-mono text-[10px] text-neutral-500 uppercase">
                [ STAGE 1 &amp; 2 ]
              </span>
            </div>

            {/* Step 1: Job Description Card (Dark Olive) */}
            <JobRequirementsStep
              value={jobRequirements}
              onChange={setJobRequirements}
            />

            {/* Step 2: PDF Upload Area (Dark Olive) */}
            <ResumeUploadStep
              files={resumes}
              onAddFiles={handleAddFiles}
              onRemoveFile={handleRemoveFile}
              onClearFiles={handleClearFiles}
            />

            {/* Primary Action Button: Rectangular Coral/Red */}
            <div className="pt-2">
              <AnalyzeButton
                jobRequirements={jobRequirements}
                resumeCount={resumes.length}
                isLoading={isLoading}
                onAnalyze={handleAnalyze}
              />
            </div>
          </section>

          {/* Right Column: Leaderboard with Large Coral/Red Numbers (7 cols) */}
          <section className="lg:col-span-7" aria-label="Candidate Matrix Output">
            {/* Error Banner */}
            {apiError && (
              <div
                id="api-error-banner"
                className="mb-6 p-4 bg-[#241010] border border-[#FF3333] text-[#FF9B9B] font-mono text-xs flex items-start space-x-3 rounded-none shadow-lg animate-fadeIn"
              >
                <AlertCircle className="w-5 h-5 text-[#FF3333] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-[#FF3333] uppercase tracking-wider">
                    // PROTOCOL EXECUTION HALTED
                  </p>
                  <p className="mt-1 leading-relaxed">
                    {apiError}
                  </p>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FF3333] text-white font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-[#E02929] transition-colors rounded-none cursor-pointer"
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
          </section>
        </div>
      </main>

      {/* Solid Black Footer with Newsletter Input on Right */}
      <Footer />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import JobRequirementsStep from "@/components/JobRequirementsStep";
import ResumeUploadStep from "@/components/ResumeUploadStep";
import AnalyzeButton from "@/components/AnalyzeButton";
import DashboardPreview from "@/components/DashboardPreview";
import { Sparkles, SlidersHorizontal, Layers } from "lucide-react";

export default function DashboardPage() {
  // Local state for the two-step input component as requested
  const [jobRequirements, setJobRequirements] = useState<string>("");
  const [resumes, setResumes] = useState<File[]>([]);

  // Add newly uploaded files without duplicates
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

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
      {/* Top Navigation */}
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
                Candidate Screening & Ranking Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Evaluate applicant resumes with an LLM senior HR screener and rank candidates by fit score.
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
              />
            </div>
          </section>

          {/* Right Column: Dashboard Preview & Results Board (7 cols) */}
          <section className="lg:col-span-7" aria-label="Results & Analytics">
            <DashboardPreview
              jobRequirements={jobRequirements}
              files={resumes}
            />
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

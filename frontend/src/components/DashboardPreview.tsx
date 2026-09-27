"use client";

import React, { useState } from "react";
import {
  Users,
  Award,
  Sparkles,
  CheckCircle,
  XCircle,
  FileCheck2,
  TrendingUp,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Briefcase,
  Layers,
} from "lucide-react";

interface DashboardPreviewProps {
  jobRequirements: string;
  files: File[];
}

export default function DashboardPreview({
  jobRequirements,
  files,
}: DashboardPreviewProps) {
  const [showSamplePreview, setShowSamplePreview] = useState(false);

  // Extract a concise role title snippet from requirements
  const detectedRole = jobRequirements.trim()
    ? jobRequirements.split("\n")[0].slice(0, 36) + (jobRequirements.length > 36 ? "..." : "")
    : "Awaiting Role Input";

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Staged Resumes</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono">
            {files.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                files.length > 0 ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            <span>{files.length > 0 ? "Ready for LLM" : "None uploaded"}</span>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Job Profile</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-semibold text-slate-200 truncate" title={detectedRole}>
            {jobRequirements.trim() ? "Profile Defined" : "Pending"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {detectedRole}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">HR Screener Engine</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm font-semibold text-slate-200 flex items-center space-x-1.5">
            <span>Gemini 2.5 Flash</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Strict JSON Output</span>
          </div>
        </div>
      </div>

      {/* Main Results Board Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-semibold text-slate-100">
                Candidate Ranking Board
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Sorted Descending
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated scoring from 0 to 100 based on job requirements match
            </p>
          </div>

          {/* Interactive Demo Toggle */}
          <button
            type="button"
            id="toggle-sample-preview-btn"
            onClick={() => setShowSamplePreview(!showSamplePreview)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
          >
            {showSamplePreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Hide Demo Card</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Preview Output Format</span>
              </>
            )}
          </button>
        </div>

        {/* Demo Candidate Card (Sample Preview) */}
        {showSamplePreview && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 shadow-lg shadow-blue-500/5 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                Interactive Preview Sample
              </span>
              <span className="text-xs text-slate-400">Rank #1</span>
            </div>

            {/* Candidate Sample Header */}
            <div className="flex items-start justify-between mt-2">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Alex Morgan, Lead Architect
                </h3>
                <p className="text-xs text-slate-400">alex_morgan_resume.pdf</p>
              </div>

              {/* Fit score badge */}
              <div className="flex flex-col items-end">
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    94.0
                  </span>
                  <span className="text-xs text-slate-400 font-mono">/100</span>
                </div>
                <span className="text-[10px] text-emerald-400/90 font-medium">
                  Fit Score
                </span>
              </div>
            </div>

            {/* Verdict */}
            <div className="mt-3.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verdict: Strong Match - Recommended for Interview</span>
            </div>

            {/* Key Strengths */}
            <div className="mt-4 space-y-1.5">
              <span className="text-xs font-medium text-slate-300 flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Key Strengths:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "8+ years of production Python & FastAPI microservices",
                  "Expert in Docker containerization and PostgreSQL optimization",
                  "Demonstrated leadership in distributed cloud architectures",
                ].map((strength, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-200"
                  >
                    • {strength}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Requirements */}
            <div className="mt-3 space-y-1.5">
              <span className="text-xs font-medium text-slate-300 flex items-center space-x-1">
                <XCircle className="w-3 h-3 text-amber-400" />
                <span>Missing Requirements:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "No explicit mention of Kubernetes cluster administration (nice-to-have)",
                ].map((missing, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-amber-500/5 border border-amber-500/20 text-amber-300/90"
                  >
                    • {missing}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State / Workflow Walkthrough */}
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 border border-slate-800 flex items-center justify-center text-blue-400 mb-4 shadow-inner">
            <Award className="w-8 h-8 opacity-80" />
          </div>

          <h3 className="text-base font-semibold text-slate-200">
            Awaiting Candidate Analysis
          </h3>
          <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
            Provide your job description and upload applicant resumes on the left. The senior HR screener engine will parse each document, evaluate qualifications, and rank candidates from highest to lowest fit.
          </p>

          {/* Workflow Steps Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-6 text-left">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-2 text-blue-400 font-semibold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Job Criteria</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Define the requirements, skills, and expectations.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Upload PDFs</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Drag and drop applicant resumes in PDF format.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>LLM Ranking</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Get strict JSON scores, strengths, and verdicts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  ArrowRight,
} from "lucide-react";
import ScoreRing from "@/components/ScoreRing";

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
    : "Awaiting Role Criteria";

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Staged Resumes</span>
            <Users className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 font-mono">
            {files.length}
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center space-x-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                files.length > 0 ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
            <span>{files.length > 0 ? "Ready for screening" : "No files uploaded"}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">Job Profile</span>
            <Briefcase className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-sm font-semibold text-gray-900 truncate" title={detectedRole}>
            {jobRequirements.trim() ? "Profile Defined" : "Pending"}
          </div>
          <div className="text-xs text-gray-500 mt-1 truncate">
            {detectedRole}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-medium">HR Screener Engine</span>
            <Sparkles className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-sm font-semibold text-gray-900 flex items-center space-x-1.5">
            <span>FastAPI &amp; LLM</span>
          </div>
          <div className="text-xs text-emerald-700 mt-1 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Strict JSON Output</span>
          </div>
        </div>
      </div>

      {/* Main Results Board Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-gray-100 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-gray-900">
                Candidate Ranking Board
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 rounded-full">
                Rank 1 to N
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Automated AI candidate scoring ordered by fit score
            </p>
          </div>

          {/* Interactive Demo Toggle */}
          <button
            type="button"
            id="toggle-sample-preview-btn"
            onClick={() => setShowSamplePreview(!showSamplePreview)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer self-start sm:self-center"
          >
            {showSamplePreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-gray-500" />
                <span>Hide Demo Card</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-gray-600" />
                <span>Preview Output Card</span>
              </>
            )}
          </button>
        </div>

        {/* Demo Candidate Card (Sample Preview) with Smooth Slide */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            showSamplePreview ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-700 bg-white px-2.5 py-0.5 rounded-md border border-gray-200">
                  Sample Preview Card
                </span>
                <span className="text-xs font-semibold text-gray-500">Rank #1</span>
              </div>

              {/* Candidate Sample Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Alex Morgan, Lead Architect
                  </h3>
                  <p className="text-xs text-gray-500">alex_morgan_resume.pdf</p>
                </div>

                <ScoreRing score={94} size={50} />
              </div>

              {/* Verdict */}
              <div className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verdict: Strong Match - Recommended for Interview</span>
              </div>

              {/* Key Strengths (Pros) */}
              <div className="mt-4 space-y-1.5">
                <span className="text-xs font-semibold text-emerald-800 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Key Strengths (Pros):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "8+ years of production Python & FastAPI microservices",
                    "Expert in Docker containerization and PostgreSQL optimization",
                    "Demonstrated leadership in distributed cloud architectures",
                  ].map((strength, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-white border border-gray-200 text-gray-800"
                    >
                      • {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Requirements (Cons) */}
              <div className="mt-3.5 space-y-1.5">
                <span className="text-xs font-semibold text-amber-800 flex items-center space-x-1">
                  <XCircle className="w-3 h-3 text-amber-600" />
                  <span>Missing Requirements (Cons):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "No explicit mention of Kubernetes cluster administration (nice-to-have)",
                  ].map((missing, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-800"
                    >
                      • {missing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Walkthrough */}
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 mb-4 shadow-2xs">
            <Award className="w-7 h-7" />
          </div>

          <h3 className="text-base font-semibold text-gray-900">
            Awaiting Candidate Analysis
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mt-1.5 leading-relaxed">
            Fill in the job requirements and upload PDF resumes on the left. The AI engine will parse each document, evaluate qualifications, and rank candidates from highest to lowest fit.
          </p>

          {/* Workflow Steps Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-8 text-left">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center space-x-2 text-gray-900 font-semibold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                <span>Job Criteria</span>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                Define the requirements, skills, and expectations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center space-x-2 text-gray-900 font-semibold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <span>Upload PDFs</span>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                Drag and drop applicant resumes in PDF format.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center space-x-2 text-gray-900 font-semibold text-xs mb-1">
                <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-800 flex items-center justify-center text-[10px] font-bold">
                  3
                </span>
                <span>AI Ranking</span>
              </div>
              <p className="text-xs text-gray-500 leading-normal">
                Review fit scores, strengths, and verdicts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

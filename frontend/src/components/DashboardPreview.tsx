"use client";

import React, { useState } from "react";
import {
  Users,
  Briefcase,
  Zap,
  Eye,
  EyeOff,
  CheckCircle2,
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

  const detectedRole = jobRequirements.trim()
    ? jobRequirements.split("\n")[0].slice(0, 32).toUpperCase() +
      (jobRequirements.length > 32 ? "..." : "")
    : "NOT SPECIFIED";

  return (
    <div className="space-y-6">
      {/* Top Stat Cards (VISTA.IO Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#3B403D] border border-white/10 p-5 rounded-none shadow-xl">
          <div className="flex items-center justify-between text-gray-300 font-mono text-[10px] uppercase tracking-widest mb-2">
            <span>RESUMES STAGED</span>
            <Users className="w-3.5 h-3.5 text-[#FF5050]" />
          </div>
          <div className="text-3xl sm:text-4xl font-bold text-white font-mono tracking-tighter">
            {files.length.toString().padStart(2, "0")}
          </div>
          <div className="text-[10px] font-mono text-[#FF5050] mt-1 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-[#FF5050]" />
            <span>{files.length > 0 ? "FILES READY" : "AWAITING FILES"}</span>
          </div>
        </div>

        <div className="bg-[#3B403D] border border-white/10 p-5 rounded-none shadow-xl">
          <div className="flex items-center justify-between text-gray-300 font-mono text-[10px] uppercase tracking-widest mb-2">
            <span>TARGET ROLE</span>
            <Briefcase className="w-3.5 h-3.5 text-[#FF5050]" />
          </div>
          <div className="text-sm font-bold text-white font-mono uppercase tracking-wider truncate" title={detectedRole}>
            {jobRequirements.trim() ? "SPECIFIED" : "UNSET"}
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1 truncate uppercase">
            {detectedRole}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[#3B403D] border border-white/10 p-5 rounded-none shadow-xl">
          <div className="flex items-center justify-between text-gray-300 font-mono text-[10px] uppercase tracking-widest mb-2">
            <span>AI ENGINE</span>
            <Zap className="w-3.5 h-3.5 text-[#FF5050]" />
          </div>
          <div className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            FASTAPI + LLM
          </div>
          <div className="text-[10px] font-mono text-gray-400 mt-1 uppercase">
            ASYNC CONCURRENT
          </div>
        </div>
      </div>

      {/* Main Guide / Leaderboard Placeholder Card */}
      <div className="bg-[#3B403D] border border-white/10 p-8 sm:p-10 rounded-none shadow-2xl text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 bg-black/60 border border-white/15 mx-auto flex items-center justify-center">
            <Zap className="w-7 h-7 text-[#FF5050]" />
          </div>

          <div>
            <h3 className="font-mono text-base sm:text-lg font-bold uppercase tracking-wider text-white">
              Candidate Leaderboard Awaiting Data
            </h3>
            <p className="font-sans text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
              Define your job requirements on the left, stage applicant resumes in PDF format, and click <strong className="text-white">Analyze &amp; Rank Candidates</strong>.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              id="toggle-sample-preview-btn"
              onClick={() => setShowSamplePreview(!showSamplePreview)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-black/60 hover:bg-black/80 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {showSamplePreview ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#FF5050]" />
                  <span>Hide Sample Preview</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#FF5050]" />
                  <span>View Sample Output Preview</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sample Output Simulation */}
        {showSamplePreview && (
          <div className="mt-8 pt-8 border-t border-white/10 text-left space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">
              <span className="flex items-center space-x-1.5 text-white">
                <span className="w-2 h-2 bg-[#FF5050]" />
                <span>Simulated Candidate Rank View:</span>
              </span>
              <span className="text-[#FF5050]">PREVIEW MODE</span>
            </div>

            <div className="p-4 bg-black/70 border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 bg-[#FF5050] text-white font-mono text-xs font-bold flex items-center justify-center">
                  #1
                </span>
                <div>
                  <p className="font-mono text-xs font-bold text-white uppercase">
                    Sample Candidate (e.g. John Doe)
                  </p>
                  <p className="font-sans text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                    Strong match across all primary skills with extensive production architecture experience.
                  </p>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-[#FF5050]">
                94% FIT
              </div>
            </div>

            <div className="p-4 bg-black/70 border border-white/10 flex items-center justify-between opacity-75">
              <div className="flex items-center space-x-3">
                <span className="w-7 h-7 bg-white/20 text-white font-mono text-xs font-bold flex items-center justify-center">
                  #2
                </span>
                <div>
                  <p className="font-mono text-xs font-bold text-white uppercase">
                    Sample Candidate (e.g. Jane Smith)
                  </p>
                  <p className="font-sans text-[11px] text-gray-300 line-clamp-1 mt-0.5">
                    Solid technical background, missing some high-concurrency distributed caching benchmarks.
                  </p>
                </div>
              </div>
              <div className="font-mono text-xs font-bold text-amber-400">
                78% FIT
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[#3B403D] border border-white/10 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5050]" />
            <span className="font-mono text-xs uppercase font-bold text-white">Concurrent Parsing</span>
          </div>
          <p className="font-sans text-xs text-gray-300 mt-1">
            Async batch ingestion with PyMuPDF token extraction.
          </p>
        </div>

        <div className="bg-[#3B403D] border border-white/10 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5050]" />
            <span className="font-mono text-xs uppercase font-bold text-white">Neural Evaluation</span>
          </div>
          <p className="font-sans text-xs text-gray-300 mt-1">
            LLM HR screening with structured candidate JSON output.
          </p>
        </div>

        <div className="bg-[#3B403D] border border-white/10 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5050]" />
            <span className="font-mono text-xs uppercase font-bold text-white">Descending Rank</span>
          </div>
          <p className="font-sans text-xs text-gray-300 mt-1">
            Normalized fit scores from 0 to 100 with gap analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

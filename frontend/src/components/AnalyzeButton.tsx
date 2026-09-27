"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, Info } from "lucide-react";

interface AnalyzeButtonProps {
  jobRequirements: string;
  resumeCount: number;
  onAnalyzeMock?: () => void;
}

export default function AnalyzeButton({
  jobRequirements,
  resumeCount,
  onAnalyzeMock,
}: AnalyzeButtonProps) {
  const [clickedFeedback, setClickedFeedback] = useState(false);

  const hasRequirements = jobRequirements.trim().length > 0;
  const hasResumes = resumeCount > 0;
  const isReady = hasRequirements && hasResumes;

  const handleClick = () => {
    if (!isReady) return;
    setClickedFeedback(true);
    if (onAnalyzeMock) {
      onAnalyzeMock();
    }
    setTimeout(() => {
      setClickedFeedback(false);
    }, 4000);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        id="analyze-rank-btn"
        disabled={!isReady}
        onClick={handleClick}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center space-x-2.5 transition-all duration-300 shadow-xl cursor-pointer ${
          isReady
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
        }`}
      >
        <Sparkles
          className={`w-5 h-5 ${
            isReady ? "text-blue-200 animate-spin-slow" : "text-slate-600"
          }`}
        />
        <span>Analyze & Rank Candidates</span>
        <ArrowRight
          className={`w-4 h-4 transition-transform ${
            isReady ? "group-hover:translate-x-1" : ""
          }`}
        />
      </button>

      {/* Helper state text */}
      {!isReady && (
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {!hasRequirements && !hasResumes
              ? "Fill steps 1 & 2 above to enable candidate analysis"
              : !hasRequirements
              ? "Provide job requirements in step 1 to proceed"
              : "Upload at least one PDF resume in step 2 to proceed"}
          </span>
        </div>
      )}

      {/* Confirmation banner when clicked in current un-wired phase */}
      {clickedFeedback && (
        <div
          id="mock-analyze-banner"
          className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-start space-x-2.5 animate-fadeIn"
        >
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-200">
              Input State Verified & Ready!
            </p>
            <p className="text-blue-300/90 mt-0.5">
              Captured {resumeCount} PDF resume(s) and {jobRequirements.length} characters of job requirements. (API integration ready to connect in the next phase).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

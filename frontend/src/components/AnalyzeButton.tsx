"use client";

import React from "react";
import { Sparkles, ArrowRight, Loader2, Info } from "lucide-react";

interface AnalyzeButtonProps {
  jobRequirements: string;
  resumeCount: number;
  isLoading: boolean;
  onAnalyze: () => void;
}

export default function AnalyzeButton({
  jobRequirements,
  resumeCount,
  isLoading,
  onAnalyze,
}: AnalyzeButtonProps) {
  const hasRequirements = jobRequirements.trim().length > 0;
  const hasResumes = resumeCount > 0;
  const isReady = hasRequirements && hasResumes && !isLoading;

  return (
    <div className="space-y-3">
      <button
        type="button"
        id="analyze-rank-btn"
        disabled={!isReady}
        onClick={onAnalyze}
        className={`w-full py-4 px-6 rounded-2xl font-semibold text-sm sm:text-base flex items-center justify-center space-x-2.5 transition-all duration-300 shadow-xl cursor-pointer ${
          isLoading
            ? "bg-blue-600/70 text-white cursor-wait shadow-blue-500/20 border border-blue-400/30"
            : isReady
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
            : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 text-white animate-spin shrink-0" />
            <span className="animate-pulse">Screening &amp; Ranking Candidates...</span>
          </>
        ) : (
          <>
            <Sparkles
              className={`w-5 h-5 ${
                isReady ? "text-blue-200" : "text-slate-600"
              }`}
            />
            <span>Analyze &amp; Rank Candidates</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform ${
                isReady ? "group-hover:translate-x-1" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Helper guidance text */}
      {!isReady && !isLoading && (
        <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-400">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {!hasRequirements && !hasResumes
              ? "Complete steps 1 & 2 above to activate candidate ranking"
              : !hasRequirements
              ? "Enter job requirements in step 1 to proceed"
              : "Upload at least one PDF resume in step 2 to proceed"}
          </span>
        </div>
      )}
    </div>
  );
}

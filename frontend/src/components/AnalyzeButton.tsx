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
        className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center space-x-2.5 transition-all duration-200 cursor-pointer ${
          isLoading
            ? "bg-gray-900 text-white cursor-wait opacity-90 shadow-sm"
            : isReady
            ? "bg-gray-950 hover:bg-black text-white shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
            : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
            <span className="font-medium">Screening &amp; Ranking Candidates...</span>
          </>
        ) : (
          <>
            <Sparkles className={`w-4 h-4 ${isReady ? "text-gray-300" : "text-gray-400"}`} />
            <span>Analyze &amp; Rank Candidates</span>
            <ArrowRight
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isReady ? "group-hover:translate-x-1" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Helper guidance text */}
      {!isReady && !isLoading && (
        <div className="flex items-center justify-center space-x-1.5 text-xs text-gray-500">
          <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
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

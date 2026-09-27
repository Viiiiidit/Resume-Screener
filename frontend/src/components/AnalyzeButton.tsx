"use client";

import React from "react";
import { ArrowRight, Loader2, Info, Zap } from "lucide-react";

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
        className={`w-full rounded-none bg-[#FF5050] hover:bg-[#e64040] text-white px-8 py-4 font-mono text-xs sm:text-sm uppercase font-bold tracking-widest transition-colors flex items-center justify-center space-x-3 cursor-pointer ${
          isLoading
            ? "opacity-85 cursor-wait"
            : !isReady
            ? "opacity-60 cursor-not-allowed hover:bg-[#FF5050]"
            : "hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
            <span>Extracting and Scoring...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 text-white fill-white shrink-0" />
            <span>Analyze &amp; Rank Candidates</span>
            <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      {/* Helper guidance text */}
      {!isReady && !isLoading && (
        <div className="flex items-center justify-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-gray-400">
          <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>
            {!hasRequirements && !hasResumes
              ? "[ PENDING: ENTER JOB REQUIREMENTS & UPLOAD RESUMES ]"
              : !hasRequirements
              ? "[ PENDING: ENTER JOB REQUIREMENTS ]"
              : "[ PENDING: UPLOAD AT LEAST ONE RESUME ]"}
          </span>
        </div>
      )}
    </div>
  );
}

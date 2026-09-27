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
        className={`w-full py-4 px-6 rounded-none font-mono uppercase tracking-widest font-bold text-xs sm:text-sm flex items-center justify-center space-x-3 transition-all duration-200 cursor-pointer ${
          isLoading
            ? "bg-[#FF5050]/80 text-white cursor-wait"
            : isReady
            ? "bg-[#FF5050] hover:bg-[#e64040] text-white shadow-xl hover:-translate-y-0.5"
            : "bg-[#3B403D] text-gray-400 border border-white/10 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
            <span className="tracking-widest">PROCESSING CANDIDATE DOSSIERS...</span>
          </>
        ) : (
          <>
            <Zap className={`w-4 h-4 ${isReady ? "text-white fill-white" : "text-gray-400"}`} />
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

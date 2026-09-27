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
            ? "bg-[#cc2626] text-white cursor-wait opacity-90"
            : isReady
            ? "bg-[#FF3333] hover:bg-[#E02929] text-white shadow-[0_0_25px_rgba(255,51,51,0.35)] hover:shadow-[0_0_35px_rgba(255,51,51,0.6)] hover:scale-[1.005] active:scale-[0.995]"
            : "bg-[#181818] text-neutral-600 border border-neutral-800 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
            <span className="tracking-widest">EXECUTING NEURAL RANKING PROTOCOL...</span>
          </>
        ) : (
          <>
            <Zap className={`w-4 h-4 ${isReady ? "text-white fill-white" : "text-neutral-600"}`} />
            <span>ANALYZE &amp; RANK CANDIDATES</span>
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
        <div className="flex items-center justify-center space-x-1.5 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
          <Info className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
          <span>
            {!hasRequirements && !hasResumes
              ? "[ PROTOCOL PENDING: PROVIDE JD AND DOSSIERS ]"
              : !hasRequirements
              ? "[ PROTOCOL PENDING: ENTER JOB CRITERIA ]"
              : "[ PROTOCOL PENDING: UPLOAD AT LEAST ONE DOSSIER ]"}
          </span>
        </div>
      )}
    </div>
  );
}

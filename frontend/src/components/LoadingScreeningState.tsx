"use client";

import React, { useEffect, useState } from "react";
import { BrainCircuit, FileSearch, Award, Loader2, Zap } from "lucide-react";

interface LoadingScreeningStateProps {
  fileCount: number;
}

const PROCESSING_STEPS = [
  {
    icon: FileSearch,
    title: "PYMUPDF PARSING STAGE",
    description: "Extracting multi-page token sequences from applicant PDF dossiers...",
  },
  {
    icon: BrainCircuit,
    title: "NEURAL VECTOR SCORING",
    description: "Synthesizing qualifications against job requirements matrix...",
  },
  {
    icon: Zap,
    title: "DISCREPANCY & ADVANTAGE ANALYSIS",
    description: "Detecting requisite shortfalls and qualification advantages...",
  },
  {
    icon: Award,
    title: "LEADER MATRIX COMPUTATION",
    description: "Sorting candidate pool descending by neural match score...",
  },
];

export default function LoadingScreeningState({
  fileCount,
}: LoadingScreeningStateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, 2400);

    const timerInterval = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <div
      id="ai-processing-state"
      className="bg-[#0e1610] border border-[#233828] p-8 sm:p-10 rounded-none shadow-2xl text-center font-mono"
    >
      {/* Animated Center Orb with red accent */}
      <div className="relative mx-auto w-16 h-16 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#FF3333]/20 animate-ping" />
        <div className="relative w-14 h-14 bg-[#142117] border border-[#FF3333] flex items-center justify-center shadow-[0_0_20px_rgba(255,51,51,0.4)]">
          <Loader2 className="w-6 h-6 text-[#FF3333] animate-spin" />
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-widest">
        // NEURAL CANDIDATE EVALUATION IN PROGRESS
      </h3>
      <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider max-w-md mx-auto">
        PROCESSING {fileCount} DOSSIER{fileCount === 1 ? "" : "S"} AGAINST REQUIREMENTS MATRIX.
      </p>

      {/* Timer badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#142117] border border-[#27402d] text-xs text-[#FF3333] mt-4">
        <span className="w-1.5 h-1.5 bg-[#FF3333] animate-pulse" />
        <span>ELAPSED_CYCLES: {secondsElapsed}S</span>
      </div>

      {/* Processing Pipeline Steps */}
      <div className="mt-8 space-y-3 max-w-md mx-auto text-left">
        {PROCESSING_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={step.title}
              className={`flex items-start space-x-3 p-3.5 border transition-all duration-300 rounded-none ${
                isCurrent
                  ? "bg-[#182a1d] border-[#FF3333] shadow-[0_0_15px_rgba(255,51,51,0.15)]"
                  : isDone
                  ? "bg-[#101b13] border-[#203625] opacity-80"
                  : "bg-[#090f0b] border-[#18291c] opacity-35"
              }`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 text-xs font-bold transition-colors rounded-none ${
                  isCurrent
                    ? "bg-[#FF3333] text-white"
                    : isDone
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                    : "bg-[#121c15] text-neutral-600"
                }`}
              >
                {isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <StepIcon className="w-3.5 h-3.5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isCurrent
                      ? "text-white"
                      : isDone
                      ? "text-emerald-300"
                      : "text-neutral-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

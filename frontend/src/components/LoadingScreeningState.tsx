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
    }, 2200);

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
      className="bg-[#3B403D] border border-white/10 p-8 sm:p-10 rounded-none shadow-2xl text-center font-mono"
    >
      {/* Animated Center Orb with red accent */}
      <div className="relative mx-auto w-16 h-16 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#FF5050] opacity-20 blur-xl animate-pulse" />
        <div className="relative w-14 h-14 bg-black/80 border border-[#FF5050] flex items-center justify-center">
          <Loader2 className="w-7 h-7 text-[#FF5050] animate-spin" />
        </div>
      </div>

      <div className="inline-block px-3 py-1 bg-black/60 border border-[#FF5050]/40 text-[#FF5050] text-xs font-bold uppercase tracking-widest mb-3">
        // EXTRACTING AND SCORING: {fileCount} DOSSIERS
      </div>

      <h3 className="font-mono text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
        Extracting and Scoring...
      </h3>

      <p className="font-sans text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-8 leading-relaxed">
        FastAPI async worker pool is parsing PDFs and extracting technical competencies concurrently with LLM screening.
      </p>

      {/* Progress Steps */}
      <div className="max-w-lg mx-auto space-y-3 text-left">
        {PROCESSING_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < activeStep;
          const isCurrent = index === activeStep;

          return (
            <div
              key={step.title}
              className={`p-3.5 border transition-all flex items-start space-x-3 ${
                isCurrent
                  ? "bg-black/80 border-[#FF5050]"
                  : isDone
                  ? "bg-black/50 border-white/10 opacity-75"
                  : "bg-black/30 border-white/5 opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 mt-0.5 ${
                  isCurrent
                    ? "bg-[#FF5050] text-white"
                    : isDone
                    ? "bg-white/20 text-white"
                    : "bg-black/40 text-gray-500"
                }`}
              >
                {isCurrent ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs uppercase font-bold tracking-wider ${
                      isCurrent ? "text-[#FF5050]" : "text-white"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="font-mono text-[10px] text-gray-400">
                    {isDone ? "[ COMPLETE ]" : isCurrent ? "[ PROCESSING ]" : "[ QUEUED ]"}
                  </span>
                </div>
                <p className="font-sans text-xs text-gray-300 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-gray-400 flex items-center justify-between">
        <span>RUNTIME ENGINE: FASTAPI V2.4</span>
        <span className="text-white">ELAPSED: {secondsElapsed}s</span>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, BrainCircuit, FileSearch, Award, Loader2 } from "lucide-react";

interface LoadingScreeningStateProps {
  fileCount: number;
}

const PROCESSING_STEPS = [
  {
    icon: FileSearch,
    title: "Extracting Text with PyMuPDF",
    description: "Parsing multi-page candidate resumes into clean readable tokens...",
  },
  {
    icon: BrainCircuit,
    title: "Consulting Senior HR Screener AI",
    description: "Analyzing candidate experience and evaluating against role requirements...",
  },
  {
    icon: Sparkles,
    title: "Identifying Strengths & Skill Gaps",
    description: "Synthesizing key qualifications and missing prerequisites...",
  },
  {
    icon: Award,
    title: "Computing Fit Scores & Ranking",
    description: "Ordering candidate pool by descending match relevance...",
  },
];

export default function LoadingScreeningState({
  fileCount,
}: LoadingScreeningStateProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Rotate through simulated pipeline steps for engaging visual feedback
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
      className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-blue-500/10 text-center animate-fadeIn"
    >
      {/* Animated Center Orb */}
      <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
        {/* Pulsing glow rings */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping opacity-75" />
        <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 opacity-30 blur-md animate-pulse" />

        {/* Center icon */}
        <div className="relative w-16 h-16 rounded-full bg-slate-950 border border-blue-400/40 flex items-center justify-center shadow-xl">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-lg sm:text-xl font-bold text-slate-100">
        AI Talent Screener in Progress
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
        Evaluating {fileCount} resume{fileCount === 1 ? "" : "s"} against your job description.
      </p>

      {/* Timer badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs text-blue-300 font-mono mt-3">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
        <span>Processing Time: {secondsElapsed}s</span>
      </div>

      {/* Processing Pipeline Steps */}
      <div className="mt-8 space-y-2.5 max-w-md mx-auto text-left">
        {PROCESSING_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={step.title}
              className={`flex items-start space-x-3 p-3 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? "bg-blue-500/10 border-blue-500/40 shadow-sm shadow-blue-500/10"
                  : isDone
                  ? "bg-slate-950/40 border-emerald-500/20 opacity-80"
                  : "bg-slate-950/20 border-slate-800/40 opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                  isCurrent
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/40"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <StepIcon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? "text-blue-200"
                      : isDone
                      ? "text-emerald-300"
                      : "text-slate-400"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
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

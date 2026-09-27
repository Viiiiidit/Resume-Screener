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
      className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-10 shadow-sm text-center animate-fadeIn"
    >
      {/* Animated Center Orb with light styling */}
      <div className="relative mx-auto w-16 h-16 mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-60" />
        <div className="relative w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shadow-xs">
          <Loader2 className="w-6 h-6 text-gray-900 animate-spin" />
        </div>
      </div>

      {/* Main Title */}
      <h3 className="text-lg font-bold text-gray-900 tracking-tight">
        AI Talent Screener in Progress
      </h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md mx-auto">
        Evaluating {fileCount} resume{fileCount === 1 ? "" : "s"} against your job description criteria.
      </p>

      {/* Timer badge */}
      <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs text-gray-600 font-mono mt-3">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
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
              className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all duration-300 ${
                isCurrent
                  ? "bg-blue-50/60 border-blue-200 shadow-2xs"
                  : isDone
                  ? "bg-gray-50/60 border-gray-200 opacity-80"
                  : "bg-gray-50/20 border-gray-100 opacity-40"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                  isCurrent
                    ? "bg-gray-900 text-white"
                    : isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-200 text-gray-400"
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
                  className={`text-xs font-semibold ${
                    isCurrent
                      ? "text-gray-900"
                      : isDone
                      ? "text-emerald-800"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 leading-tight mt-0.5 truncate">
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

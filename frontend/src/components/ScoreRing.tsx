"use client";

import React from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showPercent?: boolean;
}

export default function ScoreRing({
  score,
  size = 54,
  strokeWidth = 4.5,
  showPercent = true,
}: ScoreRingProps) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  // SVG calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine color scheme based on fit_score
  const getColorScheme = () => {
    if (normalizedScore >= 75) {
      return {
        stroke: "#10b981", // emerald-500
        text: "text-emerald-400",
        bgBadge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        glow: "shadow-emerald-500/20",
      };
    } else if (normalizedScore >= 50) {
      return {
        stroke: "#f59e0b", // amber-500
        text: "text-amber-400",
        bgBadge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        glow: "shadow-amber-500/20",
      };
    } else {
      return {
        stroke: "#f43f5e", // rose-500
        text: "text-rose-400",
        bgBadge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        glow: "shadow-rose-500/20",
      };
    }
  };

  const scheme = getColorScheme();

  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
      title={`Fit Score: ${normalizedScore}/100`}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform overflow-visible"
        aria-hidden="true"
      >
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress indicator circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={scheme.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Centered score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className={`font-mono font-bold leading-none ${scheme.text} ${
            size >= 60 ? "text-base" : "text-xs"
          }`}
        >
          {normalizedScore}
        </span>
        {showPercent && (
          <span className="text-[9px] text-slate-400 font-mono scale-90 leading-none mt-0.5">
            %
          </span>
        )}
      </div>
    </div>
  );
}

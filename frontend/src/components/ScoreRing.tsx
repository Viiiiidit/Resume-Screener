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
  size = 52,
  strokeWidth = 4,
  showPercent = true,
}: ScoreRingProps) {
  // Normalize score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  // SVG calculations
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Determine color scheme based on fit_score for light dashboard
  const getColorScheme = () => {
    if (normalizedScore >= 75) {
      return {
        stroke: "#059669", // emerald-600
        text: "text-emerald-700",
      };
    } else if (normalizedScore >= 50) {
      return {
        stroke: "#d97706", // amber-600
        text: "text-amber-700",
      };
    } else {
      return {
        stroke: "#e11d48", // rose-600
        text: "text-rose-700",
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
        {/* Background track circle (subtle light gray) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#f1f5f9"
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
          className={`font-semibold font-mono leading-none ${scheme.text} ${
            size >= 60 ? "text-base" : "text-xs"
          }`}
        >
          {normalizedScore}
        </span>
        {showPercent && (
          <span className="text-[9px] text-gray-400 font-mono leading-none mt-0.5">
            %
          </span>
        )}
      </div>
    </div>
  );
}

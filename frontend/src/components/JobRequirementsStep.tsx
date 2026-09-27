"use client";

import React from "react";
import { Briefcase, Eraser, Sparkles, CheckCircle2 } from "lucide-react";

interface JobRequirementsStepProps {
  value: string;
  onChange: (value: string) => void;
}

const PRESET_TEMPLATES = [
  {
    title: "Python Backend Lead",
    content:
      "Seeking a Senior Python Backend Engineer with 5+ years of experience. Mandatory expertise in Python, FastAPI, Docker, PostgreSQL, and distributed async microservices architecture. Strong background in system design, CI/CD pipelines, and high-concurrency RESTful APIs.",
  },
  {
    title: "Full-Stack Engineer",
    content:
      "Looking for a Full-Stack Engineer skilled in TypeScript, Next.js, React, Node.js, and Tailwind CSS. Experience with PostgreSQL, Prisma ORM, state management, and modern cloud deployment architectures.",
  },
  {
    title: "AI / ML Engineer",
    content:
      "Seeking an applied AI / ML Engineer with hands-on experience in LLM integration, prompt engineering, vector databases (Pinecone/Qdrant), Python, PyTorch, and deploying production RAG pipelines.",
  },
];

export default function JobRequirementsStep({
  value,
  onChange,
}: JobRequirementsStepProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm transition-all hover:border-gray-300">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-gray-800 font-bold text-xs border border-gray-200">
            1
          </div>
          <div>
            <label
              htmlFor="job-requirements-input"
              className="text-sm font-semibold text-gray-900 flex items-center space-x-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-gray-600" />
              <span>1. Enter Job Requirements</span>
            </label>
            <p className="text-xs text-gray-500 mt-0.5">
              Specify required skills, experience level, and responsibilities
            </p>
          </div>
        </div>

        {value && (
          <button
            type="button"
            id="clear-job-requirements-btn"
            onClick={() => onChange("")}
            className="flex items-center space-x-1 text-xs text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
            title="Clear text"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Quick Templates Presets */}
      <div className="mb-4">
        <div className="flex items-center space-x-1.5 mb-2 text-xs font-medium text-gray-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.title}
              type="button"
              id={`preset-${preset.title.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onChange(preset.content)}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 hover:text-gray-900 transition-all font-medium cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Large Textarea */}
      <div className="relative">
        <textarea
          id="job-requirements-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder="Paste complete job description, technical requirements, must-have skills, and qualifications..."
          className="w-full bg-gray-50/60 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 rounded-xl p-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all resize-y min-h-[140px] leading-relaxed"
        />

        {value.trim().length > 30 && (
          <div className="absolute top-3 right-3 text-emerald-700 flex items-center space-x-1 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span className="text-[10px] font-medium">Ready</span>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-400 font-mono">
        <span>
          {charCount} character{charCount === 1 ? "" : "s"} • {wordCount} word{wordCount === 1 ? "" : "s"}
        </span>
        <span className="text-gray-400 font-sans text-[11px]">Recommended: 50+ words</span>
      </div>
    </div>
  );
}

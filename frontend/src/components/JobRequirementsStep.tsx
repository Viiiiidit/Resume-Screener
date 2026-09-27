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
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-black/40 backdrop-blur-sm transition-all hover:border-slate-700/80">
      {/* Step Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold text-xs">
            1
          </div>
          <div>
            <label
              htmlFor="job-requirements-input"
              className="text-sm font-semibold text-slate-100 flex items-center space-x-1.5 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>1. Enter Job Requirements</span>
            </label>
          </div>
        </div>

        {value && (
          <button
            type="button"
            id="clear-job-requirements-btn"
            onClick={() => onChange("")}
            className="flex items-center space-x-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
            title="Clear text"
          >
            <Eraser className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Quick Templates */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Quick Presets:</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.title}
              type="button"
              id={`preset-${preset.title.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onChange(preset.content)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-blue-600/20 hover:text-blue-300 hover:border-blue-500/30 border border-slate-700/60 text-slate-300 transition-all cursor-pointer"
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
          rows={7}
          placeholder="Paste complete job description, required technical proficiencies, minimum years of experience, and preferred qualifications here..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition-all resize-y min-h-[140px] leading-relaxed"
        />

        {value.trim().length > 30 && (
          <div className="absolute top-3 right-3 text-emerald-400 flex items-center space-x-1 text-xs bg-slate-900/90 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">Ready</span>
          </div>
        )}
      </div>

      {/* Character and Word Count Footer */}
      <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-slate-500 font-mono">
        <span>
          {charCount} character{charCount === 1 ? "" : "s"} • {wordCount} word{wordCount === 1 ? "" : "s"}
        </span>
        <span>Recommended: 50+ words</span>
      </div>
    </div>
  );
}

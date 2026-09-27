"use client";

import React from "react";
import { Eraser, Sparkles, Terminal, Check } from "lucide-react";

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
    <div className="bg-[#131d16] border border-[#233828] p-6 sm:p-7 shadow-lg relative rounded-none transition-all">
      {/* Top accent badge */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#233828]">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-[#FF3333] rounded-none" />
          <span className="font-mono text-xs uppercase font-bold text-white tracking-widest">
            // 01. TARGET REQUIREMENTS VECTOR
          </span>
        </div>

        {value && (
          <button
            type="button"
            id="clear-job-requirements-btn"
            onClick={() => onChange("")}
            className="flex items-center space-x-1 font-mono text-[11px] uppercase tracking-wider text-neutral-400 hover:text-[#FF3333] transition-colors"
          >
            <Eraser className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Quick Presets */}
      <div className="mb-4">
        <div className="flex items-center space-x-1.5 mb-2 font-mono text-[11px] uppercase tracking-wider text-emerald-300/80">
          <Terminal className="w-3 h-3 text-[#FF3333]" />
          <span>Preset Profiles:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.title}
              type="button"
              id={`preset-${preset.title.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onChange(preset.content)}
              className="font-mono text-xs px-3 py-1.5 rounded-none bg-[#19291e] hover:bg-[#233a2a] hover:border-[#FF3333]/50 border border-[#294230] text-emerald-100 uppercase tracking-wider transition-all cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="job-requirements-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder="ENTER OR PASTE TARGET JOB PROFILE, REQUIRED TECH MATRIX, MUST-HAVE DOMAIN SKILLS, AND QUALIFICATIONS..."
          className="w-full bg-[#0b120d] border border-[#233828] focus:border-[#FF3333] focus:ring-1 focus:ring-[#FF3333] p-4 font-mono text-xs text-white placeholder-neutral-600 focus:outline-none transition-all resize-y min-h-[140px] leading-relaxed rounded-none"
        />

        {value.trim().length > 30 && (
          <div className="absolute top-3 right-3 text-emerald-400 font-mono text-[10px] tracking-widest uppercase flex items-center space-x-1 bg-[#131d16] px-2 py-0.5 border border-emerald-500/40">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>SYNTAX OK</span>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
        <span>
          {charCount} CHARS // {wordCount} TOKENS
        </span>
        <span className="text-[#FF3333]">CRITERIA_ACTIVE</span>
      </div>
    </div>
  );
}

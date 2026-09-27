"use client";

import React from "react";
import { Eraser, Terminal, Check } from "lucide-react";

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
    <div className="bg-[#3B403D] border border-white/10 p-8 shadow-2xl relative rounded-none transition-all">
      {/* Top accent header with exact label */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <label
          htmlFor="job-requirements-input"
          className="flex items-center space-x-3 cursor-pointer"
        >
          <div className="w-3.5 h-3.5 bg-[#FF5050] rotate-45 shrink-0" />
          <span className="font-mono text-base uppercase font-bold text-white tracking-widest">
            1. Enter Job Requirements
          </span>
        </label>

        {value && (
          <button
            type="button"
            id="clear-job-requirements-btn"
            onClick={() => onChange("")}
            className="flex items-center space-x-1.5 font-mono text-xs uppercase tracking-wider text-gray-300 hover:text-[#FF5050] transition-colors cursor-pointer"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Quick Presets */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2 font-mono text-xs uppercase tracking-wider text-gray-300">
          <Terminal className="w-3.5 h-3.5 text-[#FF5050]" />
          <span>Preset Profiles:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TEMPLATES.map((preset) => (
            <button
              key={preset.title}
              type="button"
              id={`preset-${preset.title.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => onChange(preset.content)}
              className="font-mono text-xs px-3 py-1.5 rounded-none bg-black/50 hover:bg-black/80 hover:border-[#FF5050] border border-white/15 text-white uppercase tracking-wider transition-all cursor-pointer"
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
          placeholder="ENTER OR PASTE TARGET JOB CRITERIA, REQUIRED SKILL MATRIX, EXPERIENCE LEVEL, AND DOMAIN QUALIFICATIONS..."
          className="w-full bg-black/70 border border-white/15 focus:border-[#FF5050] focus:ring-1 focus:ring-[#FF5050] p-4 font-mono text-xs text-white placeholder:text-gray-500 focus:outline-none transition-all resize-y min-h-[140px] leading-relaxed rounded-none"
        />

        {value.trim().length > 30 && (
          <div className="absolute top-3 right-3 text-[#FF5050] font-mono text-[10px] tracking-widest uppercase flex items-center space-x-1 bg-black/90 px-2 py-0.5 border border-[#FF5050]/40">
            <Check className="w-3 h-3 text-[#FF5050]" />
            <span>CRITERIA READY</span>
          </div>
        )}
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between mt-3 text-xs font-mono text-gray-300 uppercase tracking-wider">
        <span>
          {charCount} CHARS • {wordCount} WORDS
        </span>
        <span className="text-[#FF5050] font-bold">CRITERIA_ACTIVE</span>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Users,
  Award,
  Sparkles,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Briefcase,
  Terminal,
  Zap,
} from "lucide-react";

interface DashboardPreviewProps {
  jobRequirements: string;
  files: File[];
}

export default function DashboardPreview({
  jobRequirements,
  files,
}: DashboardPreviewProps) {
  const [showSamplePreview, setShowSamplePreview] = useState(false);

  const detectedRole = jobRequirements.trim()
    ? jobRequirements.split("\n")[0].slice(0, 32).toUpperCase() + (jobRequirements.length > 32 ? "..." : "")
    : "PENDING_VECTOR";

  return (
    <div className="space-y-6">
      {/* Top Stat Cards (VISTA.IO Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#131d16] border border-[#233828] p-5 rounded-none shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px] uppercase tracking-widest mb-2">
            <span>INGESTION_NODES</span>
            <Users className="w-3.5 h-3.5 text-[#FF3333]" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tighter">
            {files.length.toString().padStart(2, "0")}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-emerald-400" />
            <span>{files.length > 0 ? "STREAM_ACTIVE" : "AWAITING_INPUT"}</span>
          </div>
        </div>

        <div className="bg-[#131d16] border border-[#233828] p-5 rounded-none shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px] uppercase tracking-widest mb-2">
            <span>TARGET_VECTOR</span>
            <Briefcase className="w-3.5 h-3.5 text-[#FF3333]" />
          </div>
          <div className="text-sm font-bold text-white font-mono uppercase tracking-wider truncate" title={detectedRole}>
            {jobRequirements.trim() ? "SPECIFIED" : "UNSET"}
          </div>
          <div className="text-[10px] font-mono text-neutral-400 mt-1 truncate uppercase">
            {detectedRole}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-[#131d16] border border-[#233828] p-5 rounded-none shadow-lg">
          <div className="flex items-center justify-between text-neutral-400 font-mono text-[10px] uppercase tracking-widest mb-2">
            <span>AI_KERNEL</span>
            <Zap className="w-3.5 h-3.5 text-[#FF3333]" />
          </div>
          <div className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            FASTAPI // LLM
          </div>
          <div className="text-[10px] font-mono text-[#FF3333] mt-1 flex items-center space-x-1 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-[#FF3333]" />
            <span>JSON PROTOCOL</span>
          </div>
        </div>
      </div>

      {/* Main Results Board Card */}
      <div className="bg-[#0e1610] border border-[#233828] p-6 sm:p-8 rounded-none shadow-2xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-6 border-b border-[#233828] gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-[#FF3333]" />
              <h2 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-widest">
                // 03. CANDIDATE MATRIX STAGE
              </h2>
            </div>
            <p className="font-mono text-xs text-neutral-400 mt-1 uppercase tracking-wider">
              Autonomous neural scoring from 0 to 100
            </p>
          </div>

          {/* Interactive Demo Toggle */}
          <button
            type="button"
            id="toggle-sample-preview-btn"
            onClick={() => setShowSamplePreview(!showSamplePreview)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-none bg-[#142117] hover:bg-[#1c3021] border border-[#27402d] hover:border-[#FF3333]/50 font-mono text-xs uppercase font-semibold text-neutral-300 transition-colors cursor-pointer self-start sm:self-center"
          >
            {showSamplePreview ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                <span>HIDE DEMO</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-[#FF3333]" />
                <span>PREVIEW METRIC CARD</span>
              </>
            )}
          </button>
        </div>

        {/* Demo Candidate Card with VISTA.IO typography */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
            showSamplePreview ? "grid-rows-[1fr] opacity-100 mb-6" : "grid-rows-[0fr] opacity-0 pointer-events-none"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-6 bg-[#0b120d] border border-[#FF3333] shadow-[0_0_20px_rgba(255,51,51,0.15)] rounded-none">
              <div className="flex items-center justify-between mb-3 font-mono text-[10px] uppercase tracking-widest">
                <span className="text-[#FF3333] font-bold">
                  #01 // SAMPLE DOSSIER
                </span>
                <span className="bg-[#FF3333] text-white px-2 py-0.5 font-bold">
                  TOP MATCH
                </span>
              </div>

              {/* Large Bold Red Score with Candidate Name in Crisp White Below */}
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <span className="text-5xl sm:text-6xl font-mono font-black text-[#FF3333] tracking-tighter leading-none">
                    94
                  </span>
                  <span className="font-mono text-lg text-[#FF3333]/70 font-bold">
                    /100
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white uppercase tracking-wider mt-2">
                  Alex Morgan, Lead Architect
                </h3>
              </div>

              {/* Verdict */}
              <div className="mt-3.5 inline-block font-mono text-xs uppercase tracking-wider px-2.5 py-1 bg-[#19281e] border border-[#284231] text-emerald-300">
                VERDICT: STRONG MATCH // INTERVIEW RECOMMENDED
              </div>

              {/* Key Strengths (Pros) */}
              <div className="mt-4 space-y-1.5 font-mono text-xs">
                <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                  <span>// QUALIFICATION ADVANTAGES (PROS):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "8+ YEARS PRODUCTION FASTAPI & PYTHON MICROSERVICES",
                    "DOCKER CONTAINERIZATION & POSTGRESQL TUNING",
                    "SYSTEM DESIGN IN DISTRIBUTED CLOUD ENVIRONMENTS",
                  ].map((strength, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 bg-[#122116] border border-[#203c28] text-emerald-100"
                    >
                      • {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Requirements (Cons) */}
              <div className="mt-3.5 space-y-1.5 font-mono text-xs">
                <span className="text-[#FF6B6B] font-bold uppercase tracking-wider flex items-center space-x-1">
                  <span>// REQUISITE SHORTFALLS (CONS):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "KUBERNETES OPERATOR ADMINISTRATION (PREFERRED)",
                  ].map((missing, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 bg-[#201212] border border-[#3f2121] text-[#FF9B9B]"
                    >
                      • {missing}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State Walkthrough */}
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center font-mono">
          <div className="w-14 h-14 rounded-none bg-[#131d16] border border-[#233828] flex items-center justify-center text-[#FF3333] mb-4 shadow-lg">
            <Award className="w-7 h-7" />
          </div>

          <h3 className="text-base font-bold text-white uppercase tracking-widest">
            AWAITING CANDIDATE INGESTION
          </h3>
          <p className="text-xs text-neutral-400 max-w-md mt-2 uppercase tracking-wider leading-relaxed">
            Provide the target vector specifications and upload applicant PDF dossiers on the left. The neural screener will evaluate qualifications and output the ranked leader matrix.
          </p>

          {/* Workflow Steps Guide */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-8 text-left">
            <div className="p-4 bg-[#131d16] border border-[#233828] rounded-none">
              <div className="flex items-center space-x-2 text-[#FF3333] font-bold text-xs mb-1">
                <span>// 01</span>
                <span className="text-white">CRITERIA</span>
              </div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Define mandatory skills and qualifications.
              </p>
            </div>

            <div className="p-4 bg-[#131d16] border border-[#233828] rounded-none">
              <div className="flex items-center space-x-2 text-[#FF3333] font-bold text-xs mb-1">
                <span>// 02</span>
                <span className="text-white">PDF INGEST</span>
              </div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Batch upload applicant resume dossiers.
              </p>
            </div>

            <div className="p-4 bg-[#131d16] border border-[#233828] rounded-none">
              <div className="flex items-center space-x-2 text-[#FF3333] font-bold text-xs mb-1">
                <span>// 03</span>
                <span className="text-white">RANKING</span>
              </div>
              <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Inspect scores, advantages, and verdicts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

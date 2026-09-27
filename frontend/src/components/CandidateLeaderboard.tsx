"use client";

import React, { useState } from "react";
import { CandidateScreeningResult } from "@/types/candidate";
import {
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  RotateCcw,
  Terminal,
  Search,
  Zap,
} from "lucide-react";

interface CandidateLeaderboardProps {
  candidates: CandidateScreeningResult[];
  onReset: () => void;
}

export default function CandidateLeaderboard({
  candidates,
  onReset,
}: CandidateLeaderboardProps) {
  // Expand first candidate by default
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(
    new Set([0])
  );
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIndices(new Set(candidates.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedIndices(new Set());
  };

  const exportResultsJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(candidates, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "ranked_candidates.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredCandidates = candidates.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.candidate_name.toLowerCase().includes(q) ||
      c.verdict.toLowerCase().includes(q) ||
      c.key_strengths.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div
      id="candidate-leaderboard"
      className="bg-[#0e1610] border border-[#233828] p-6 sm:p-8 rounded-none shadow-2xl space-y-6"
    >
      {/* Leaderboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#233828] gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-[#FF3333] rounded-none" />
            <h2 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <span>// 03. RANKED CANDIDATE MATRIX</span>
            </h2>
            <span className="px-2 py-0.5 font-mono text-[10px] uppercase font-bold bg-[#FF3333]/15 text-[#FF3333] border border-[#FF3333]/40">
              {candidates.length} PROCESSED
            </span>
          </div>
          <p className="font-mono text-xs text-neutral-400 mt-1 uppercase tracking-wider">
            Autonomous multi-vector ranking • Click row to inspect neural breakdown
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            type="button"
            id="export-results-btn"
            onClick={exportResultsJSON}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-none bg-[#142117] hover:bg-[#1b2e20] border border-[#27402d] hover:border-[#FF3333]/50 font-mono text-xs uppercase font-semibold text-neutral-200 transition-colors cursor-pointer"
            title="Export candidate ranking data to JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#FF3333]" />
            <span>EXPORT JSON</span>
          </button>

          <button
            type="button"
            id="reset-screening-btn"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-none bg-[#142117] hover:bg-[#1b2e20] border border-[#27402d] hover:border-[#FF3333]/50 font-mono text-xs uppercase font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Start new screening evaluation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Filter and Accordion controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 font-mono text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            id="candidate-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER DOSSIERS BY CANDIDATE NAME, STRENGTHS, KEYWORDS..."
            className="w-full bg-[#080d09] border border-[#233828] focus:border-[#FF3333] focus:ring-1 focus:ring-[#FF3333] pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-600 uppercase tracking-wider focus:outline-none transition-all rounded-none"
          />
        </div>

        {/* Expand / Collapse All */}
        <div className="flex items-center space-x-2 shrink-0 justify-end font-mono text-[11px] uppercase tracking-wider">
          <button
            type="button"
            onClick={expandAll}
            className="text-neutral-400 hover:text-[#FF3333] px-2 py-1 transition-colors"
          >
            EXPAND ALL
          </button>
          <span className="text-neutral-600">//</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-neutral-400 hover:text-[#FF3333] px-2 py-1 transition-colors"
          >
            COLLAPSE ALL
          </button>
        </div>
      </div>

      {/* Candidate List (Rank 1 to N) */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate, index) => {
          const rank = index + 1;
          const isExpanded = expandedIndices.has(index);

          return (
            <div
              key={`${candidate.candidate_name}-${index}`}
              id={`candidate-card-${rank}`}
              className={`border transition-all duration-200 rounded-none overflow-hidden ${
                isExpanded
                  ? "bg-[#111a13] border-[#FF3333] shadow-[0_0_20px_rgba(255,51,51,0.15)]"
                  : "bg-[#0b120e] border-[#233828] hover:border-[#2f4b36]"
              }`}
            >
              {/* Clickable Card Header / Row */}
              <div
                id={`candidate-row-${rank}`}
                role="button"
                tabIndex={0}
                onClick={() => toggleExpand(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(index);
                  }
                }}
                className="p-5 sm:p-6 cursor-pointer select-none"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Rank Badge & Candidate Identity with Huge Coral/Red Score */}
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 mb-2 font-mono text-[11px] uppercase tracking-widest text-neutral-400">
                      <span className="text-[#FF3333] font-bold">
                        #{rank.toString().padStart(2, "0")}
                      </span>
                      <span>// CANDIDATE PROFILE</span>
                      {rank === 1 && (
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-[#FF3333] text-white tracking-widest">
                          TOP MATCH
                        </span>
                      )}
                    </div>

                    {/* VISTA.IO STATISTIC PRESENTATION:
                        Large, bold, coral/red typography for the score,
                        with candidate's name in crisp white text below their red score */}
                    <div className="flex flex-col">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl sm:text-5xl font-mono font-black text-[#FF3333] tracking-tighter leading-none">
                          {Math.round(candidate.fit_score)}
                        </span>
                        <span className="font-mono text-base text-[#FF3333]/70 font-bold">
                          /100
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider mt-1.5 truncate">
                        {candidate.candidate_name || `Applicant Dossier #${rank}`}
                      </h3>
                    </div>

                    <div className="mt-3">
                      <span className="inline-block font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 bg-[#19281e] border border-[#284231] text-emerald-300">
                        {candidate.verdict}
                      </span>
                    </div>
                  </div>

                  {/* Right: Expand Chevron with rotation */}
                  <div className="shrink-0 pt-1">
                    <div
                      className={`w-8 h-8 rounded-none border border-[#233828] bg-[#142117] flex items-center justify-center text-neutral-300 transition-transform duration-300 ${
                        isExpanded ? "rotate-180 border-[#FF3333] text-[#FF3333]" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fluid Sliding Transition Drawer for Pros, Cons & Verdict */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    id={`candidate-details-${rank}`}
                    className="p-5 sm:p-6 border-t border-[#233828] bg-[#090f0b] space-y-4 font-mono text-xs"
                  >
                    {/* Verdict Callout */}
                    <div className="p-3.5 bg-[#121c15] border border-[#243929] flex items-start space-x-3">
                      <Terminal className="w-4 h-4 text-[#FF3333] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white uppercase tracking-widest">
                          HR EVALUATION SUMMARY:
                        </span>
                        <p className="text-neutral-300 mt-1 leading-relaxed">
                          {candidate.verdict}
                        </p>
                      </div>
                    </div>

                    {/* Key Strengths (Pros) */}
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-emerald-400 uppercase tracking-widest mb-2">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>QUALIFICATION ADVANTAGES (PROS):</span>
                      </div>
                      {candidate.key_strengths && candidate.key_strengths.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {candidate.key_strengths.map((strength, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-2.5 bg-[#122116] border border-[#203c28] text-emerald-100 text-[11px] leading-snug flex items-start space-x-2"
                            >
                              <span className="text-emerald-400 font-bold shrink-0">//</span>
                              <span>{strength}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 italic text-[11px]">
                          NO SPECIFIC ADVANTAGES RECORDED.
                        </p>
                      )}
                    </div>

                    {/* Missing Requirements (Cons) */}
                    <div>
                      <div className="flex items-center space-x-2 font-bold text-[#FF6B6B] uppercase tracking-widest mb-2">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>REQUISITE SHORTFALLS (CONS):</span>
                      </div>
                      {candidate.missing_requirements &&
                      candidate.missing_requirements.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {candidate.missing_requirements.map((missing, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-2.5 bg-[#201212] border border-[#3f2121] text-[#FF9B9B] text-[11px] leading-snug flex items-start space-x-2"
                            >
                              <span className="text-[#FF3333] font-bold shrink-0">//</span>
                              <span>{missing}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 bg-[#122116] border border-[#203c28] text-emerald-300 text-[11px]">
                          ✓ FULL CRITERIA SATISFACTION VERIFIED.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { CandidateScreeningResult } from "@/types/candidate";
import ScoreRing from "@/components/ScoreRing";
import {
  Trophy,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";

interface CandidateLeaderboardProps {
  candidates: CandidateScreeningResult[];
  onReset: () => void;
}

export default function CandidateLeaderboard({
  candidates,
  onReset,
}: CandidateLeaderboardProps) {
  // Expand first candidate by default for immediate visual feedback
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10">
          <Trophy className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-300/10 text-slate-300 border border-slate-300/30">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-700/10 text-amber-600 border border-amber-700/30">
          <Award className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-slate-400 border border-slate-700/60 font-mono text-xs font-semibold">
        #{rank}
      </div>
    );
  };

  const getVerdictStyle = (fitScore: number) => {
    if (fitScore >= 75) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
    if (fitScore >= 50) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div
      id="candidate-leaderboard"
      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm shadow-xl shadow-black/40 space-y-5 animate-fadeIn"
    >
      {/* Leaderboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Candidate Leaderboard</span>
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
              {candidates.length} Ranked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Candidates ordered by fit score (Rank 1 to {candidates.length}). Click any row to expand analysis details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            type="button"
            id="export-results-btn"
            onClick={exportResultsJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
            title="Export candidate ranking data to JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            id="reset-screening-btn"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Start new screening evaluation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>New Screen</span>
          </button>
        </div>
      </div>

      {/* Filter and Accordion controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            id="candidate-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, strength, or verdict..."
            className="w-full bg-slate-950/70 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        {/* Expand / Collapse All */}
        <div className="flex items-center space-x-2 shrink-0 justify-end">
          <button
            type="button"
            onClick={expandAll}
            className="text-[11px] text-slate-400 hover:text-blue-400 px-2 py-1 rounded hover:bg-slate-800/80 transition-colors"
          >
            Expand All
          </button>
          <span className="text-slate-700">•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-[11px] text-slate-400 hover:text-blue-400 px-2 py-1 rounded hover:bg-slate-800/80 transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Candidate List (Rank 1 to N) */}
      <div className="space-y-3">
        {filteredCandidates.map((candidate, index) => {
          const rank = index + 1;
          const isExpanded = expandedIndices.has(index);

          return (
            <div
              key={`${candidate.candidate_name}-${index}`}
              id={`candidate-card-${rank}`}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? "bg-slate-950/90 border-blue-500/40 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20"
                  : "bg-slate-950/60 border-slate-800/90 hover:border-slate-700/90 hover:bg-slate-950/80"
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
                className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer select-none gap-3"
              >
                {/* Left: Rank Badge & Candidate Identity */}
                <div className="flex items-center space-x-3 min-w-0">
                  {getRankBadge(rank)}

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-100 truncate">
                        {candidate.candidate_name || `Applicant #${rank}`}
                      </h3>
                      {rank === 1 && (
                        <span className="hidden sm:inline-flex text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Top Match
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border truncate max-w-[260px] sm:max-w-md ${getVerdictStyle(
                          candidate.fit_score
                        )}`}
                      >
                        {candidate.verdict}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Circular Progress Ring & Expand Chevron */}
                <div className="flex items-center space-x-3 shrink-0">
                  <ScoreRing score={candidate.fit_score} size={48} strokeWidth={4} />

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 transition-colors ${
                      isExpanded ? "bg-slate-800 text-blue-400" : "hover:bg-slate-800"
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Details Drawer */}
              {isExpanded && (
                <div
                  id={`candidate-details-${rank}`}
                  className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-900/40 space-y-3.5 text-xs animate-fadeIn"
                >
                  {/* Verdict Callout */}
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start space-x-2.5">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200">
                        Senior HR Screener Assessment:
                      </span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">
                        {candidate.verdict}
                      </p>
                    </div>
                  </div>

                  {/* Key Strengths */}
                  <div>
                    <div className="flex items-center space-x-1.5 font-semibold text-emerald-400 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Key Strengths &amp; Matching Criteria:</span>
                    </div>
                    {candidate.key_strengths && candidate.key_strengths.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {candidate.key_strengths.map((strength, sIdx) => (
                          <div
                            key={sIdx}
                            className="p-2 rounded-md bg-emerald-500/5 border border-emerald-500/15 text-slate-200 text-[11px] leading-snug flex items-start space-x-1.5"
                          >
                            <span className="text-emerald-400 font-bold shrink-0">•</span>
                            <span>{strength}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic text-[11px]">
                        No specific matching strengths reported.
                      </p>
                    )}
                  </div>

                  {/* Missing Requirements */}
                  <div>
                    <div className="flex items-center space-x-1.5 font-semibold text-amber-400 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Missing Requirements &amp; Skill Gaps:</span>
                    </div>
                    {candidate.missing_requirements &&
                    candidate.missing_requirements.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {candidate.missing_requirements.map((missing, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-2 rounded-md bg-amber-500/5 border border-amber-500/15 text-slate-200 text-[11px] leading-snug flex items-start space-x-1.5"
                          >
                            <span className="text-amber-400 font-bold shrink-0">•</span>
                            <span>{missing}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 rounded-md bg-emerald-500/5 border border-emerald-500/15 text-emerald-300 text-[11px]">
                        ✓ All mandatory job requirements appear fulfilled.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

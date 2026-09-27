"use client";

import React, { useState } from "react";
import { CandidateScreeningResult } from "@/types/candidate";
import ScoreRing from "@/components/ScoreRing";
import {
  Trophy,
  Medal,
  Award,
  ChevronDown,
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
          <Trophy className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
          <Medal className="w-4 h-4" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100/60 text-amber-700 border border-amber-200">
          <Award className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 border border-gray-200 font-mono text-xs font-semibold">
        #{rank}
      </div>
    );
  };

  const getVerdictStyle = (fitScore: number) => {
    if (fitScore >= 75) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (fitScore >= 50) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div
      id="candidate-leaderboard"
      className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      {/* Leaderboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-gray-100 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-gray-600" />
              <span>Candidate Leaderboard</span>
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 rounded-full">
              {candidates.length} Evaluated
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ranked descending by AI fit score. Click any candidate row to review strengths and gaps.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            type="button"
            id="export-results-btn"
            onClick={exportResultsJSON}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 transition-colors shadow-2xs cursor-pointer"
            title="Export candidate ranking data to JSON"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            id="reset-screening-btn"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
            title="Start new screening evaluation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
            <span>New Screen</span>
          </button>
        </div>
      </div>

      {/* Filter and Accordion controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            id="candidate-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, strength, or verdict..."
            className="w-full bg-gray-50/70 hover:bg-gray-50 focus:bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Expand / Collapse All */}
        <div className="flex items-center space-x-2 shrink-0 justify-end">
          <button
            type="button"
            onClick={expandAll}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            Expand All
          </button>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors"
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
                  ? "bg-white border-gray-300 shadow-sm ring-1 ring-black/5"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-2xs"
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
                className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none gap-4"
              >
                {/* Left: Rank Badge & Candidate Identity */}
                <div className="flex items-center space-x-3.5 min-w-0">
                  {getRankBadge(rank)}

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2.5">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {candidate.candidate_name || `Applicant #${rank}`}
                      </h3>
                      {rank === 1 && (
                        <span className="hidden sm:inline-flex text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          Top Match
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border truncate max-w-[260px] sm:max-w-md ${getVerdictStyle(
                          candidate.fit_score
                        )}`}
                      >
                        {candidate.verdict}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Circular Progress Ring & Smooth Rotate Chevron */}
                <div className="flex items-center space-x-4 shrink-0">
                  <ScoreRing score={candidate.fit_score} size={48} strokeWidth={4} />

                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-transform duration-300 ${
                      isExpanded ? "rotate-180 text-gray-700" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Fluid Sliding Transition Drawer for Pros, Cons & Verdict */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                  isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    id={`candidate-details-${rank}`}
                    className="px-5 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50 space-y-4 text-xs"
                  >
                    {/* Verdict Callout */}
                    <div className="p-3.5 rounded-xl bg-white border border-gray-200 flex items-start space-x-2.5 shadow-2xs">
                      <FileText className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-gray-900">
                          Senior HR Screener Assessment:
                        </span>
                        <p className="text-gray-600 mt-0.5 leading-relaxed">
                          {candidate.verdict}
                        </p>
                      </div>
                    </div>

                    {/* Key Strengths (Pros) */}
                    <div>
                      <div className="flex items-center space-x-1.5 font-semibold text-emerald-800 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Key Strengths &amp; Matching Criteria (Pros):</span>
                      </div>
                      {candidate.key_strengths && candidate.key_strengths.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {candidate.key_strengths.map((strength, sIdx) => (
                            <div
                              key={sIdx}
                              className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 text-xs leading-snug flex items-start space-x-2"
                            >
                              <span className="text-emerald-600 font-bold shrink-0">•</span>
                              <span>{strength}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 italic text-xs">
                          No specific matching strengths reported.
                        </p>
                      )}
                    </div>

                    {/* Missing Requirements (Cons) */}
                    <div>
                      <div className="flex items-center space-x-1.5 font-semibold text-amber-800 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Missing Requirements &amp; Skill Gaps (Cons):</span>
                      </div>
                      {candidate.missing_requirements &&
                      candidate.missing_requirements.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {candidate.missing_requirements.map((missing, mIdx) => (
                            <div
                              key={mIdx}
                              className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-snug flex items-start space-x-2"
                            >
                              <span className="text-amber-600 font-bold shrink-0">•</span>
                              <span>{missing}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                          ✓ All mandatory job requirements appear fulfilled.
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

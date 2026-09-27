"use client";

import React, { useState } from "react";
import { CandidateScreeningResult } from "@/types/candidate";
import {
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Download,
  RotateCcw,
  Search,
} from "lucide-react";
import ScoreRing from "./ScoreRing";

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
      className="bg-[#3B403D] border border-white/10 p-6 sm:p-8 rounded-none shadow-2xl space-y-6"
    >
      {/* Leaderboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-[#FF5050] rotate-45 shrink-0" />
            <h2 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <span>Candidate Leaderboard</span>
            </h2>
            <span className="px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold bg-[#FF5050] text-white">
              {candidates.length} Ranked
            </span>
          </div>
          <p className="font-mono text-xs text-gray-300 mt-1 uppercase tracking-wider">
            Rank-ordered by AI Fit Score • Click row to expand breakdown
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            type="button"
            id="export-results-btn"
            onClick={exportResultsJSON}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/90 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            title="Download JSON Analysis"
          >
            <Download className="w-3.5 h-3.5 text-[#FF5050]" />
            <span>Export</span>
          </button>

          <button
            type="button"
            id="reset-screener-btn"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#FF5050] hover:bg-[#e64040] text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer"
            title="Reset and screen new batch"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Screen</span>
          </button>
        </div>
      </div>

      {/* Filter & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-candidates-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter candidates or strengths..."
            className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-white/15 text-white font-mono text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#FF5050] rounded-none"
          />
        </div>

        {/* Expand / Collapse All */}
        <div className="flex items-center space-x-3 text-xs font-mono uppercase tracking-wider text-gray-300">
          <button
            type="button"
            onClick={expandAll}
            className="hover:text-[#FF5050] transition-colors cursor-pointer"
          >
            [ Expand All ]
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={collapseAll}
            className="hover:text-[#FF5050] transition-colors cursor-pointer"
          >
            [ Collapse All ]
          </button>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {filteredCandidates.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs uppercase tracking-widest text-gray-400 bg-black/40 border border-white/10 p-6">
            [ No candidates match search query &quot;{searchQuery}&quot; ]
          </div>
        ) : (
          filteredCandidates.map((candidate, idx) => {
            const isExpanded = expandedIndices.has(idx);
            const rank = idx + 1;

            return (
              <div
                key={`${candidate.candidate_name}-${idx}`}
                id={`candidate-card-${idx}`}
                className="bg-black/60 border border-white/10 hover:border-[#FF5050]/60 transition-all rounded-none overflow-hidden"
              >
                {/* Clickable Row Header */}
                <div
                  id={`candidate-row-${idx}`}
                  onClick={() => toggleExpand(idx)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none group"
                >
                  <div className="flex items-center space-x-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        rank === 1
                          ? "bg-[#FF5050] text-white"
                          : rank === 2
                          ? "bg-white/20 text-white"
                          : "bg-black border border-white/15 text-gray-300"
                      }`}
                    >
                      #{rank}
                    </div>

                    {/* Candidate Name & Verdict preview */}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-mono text-sm sm:text-base font-bold text-white group-hover:text-[#FF5050] transition-colors">
                          {candidate.candidate_name}
                        </h3>
                        {rank === 1 && (
                          <span className="px-2 py-0.5 bg-[#FF5050]/20 text-[#FF5050] border border-[#FF5050]/40 font-mono text-[10px] uppercase font-bold">
                            TOP FIT
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-gray-300 line-clamp-1 mt-0.5">
                        {candidate.verdict}
                      </p>
                    </div>
                  </div>

                  {/* Right Score Ring & Expand indicator */}
                  <div className="flex items-center space-x-4">
                    <ScoreRing score={candidate.fit_score} size={50} strokeWidth={4} />
                    <div className="w-6 h-6 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? "rotate-180 text-[#FF5050]" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Breakdown */}
                {isExpanded && (
                  <div
                    id={`candidate-details-${idx}`}
                    className="p-5 pt-0 border-t border-white/10 bg-black/40 space-y-4"
                  >
                    {/* Verdict Box */}
                    <div className="p-4 bg-black/80 border border-white/10 mt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-[#FF5050] rotate-45 shrink-0" />
                        <span className="font-mono text-xs uppercase font-bold text-white tracking-wider">
                          Executive Evaluation Verdict
                        </span>
                      </div>
                      <p className="font-sans text-sm text-gray-200 leading-relaxed">
                        {candidate.verdict}
                      </p>
                    </div>

                    {/* Strengths & Missing Requirements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Key Strengths */}
                      <div className="p-4 bg-black/60 border border-white/10">
                        <div className="flex items-center space-x-2 mb-3">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5050]" />
                          <span className="font-mono text-xs uppercase font-bold text-white tracking-wider">
                            Key Strengths ({candidate.key_strengths.length})
                          </span>
                        </div>
                        <ul className="space-y-1.5 font-sans text-xs text-gray-300">
                          {candidate.key_strengths.length > 0 ? (
                            candidate.key_strengths.map((str, sIdx) => (
                              <li key={sIdx} className="flex items-start space-x-2">
                                <span className="text-[#FF5050] font-mono select-none">›</span>
                                <span>{str}</span>
                              </li>
                            ))
                          ) : (
                            <li className="font-mono text-gray-500">[ No explicit strengths highlighted ]</li>
                          )}
                        </ul>
                      </div>

                      {/* Missing Requirements */}
                      <div className="p-4 bg-black/60 border border-white/10">
                        <div className="flex items-center space-x-2 mb-3">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-mono text-xs uppercase font-bold text-white tracking-wider">
                            Missing Requirements ({candidate.missing_requirements.length})
                          </span>
                        </div>
                        <ul className="space-y-1.5 font-sans text-xs text-gray-300">
                          {candidate.missing_requirements.length > 0 ? (
                            candidate.missing_requirements.map((miss, mIdx) => (
                              <li key={mIdx} className="flex items-start space-x-2">
                                <span className="text-amber-400 font-mono select-none">›</span>
                                <span>{miss}</span>
                              </li>
                            ))
                          ) : (
                            <li className="font-mono text-gray-300 flex items-center space-x-1.5">
                              <span className="text-[#FF5050] font-bold">✓</span>
                              <span>All target criteria satisfied</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { CandidateScreeningResult } from "@/types/candidate";
import {
  ChevronDown,
  Download,
  RotateCcw,
  Search,
  Sparkles,
  AlertCircle,
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
      c.key_strengths.some((s) => s.toLowerCase().includes(q)) ||
      c.missing_requirements.some((m) => m.toLowerCase().includes(q))
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
            <div className="w-3.5 h-3.5 bg-[#FF5050] rotate-45 shrink-0" />
            <h2 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-widest flex items-center space-x-2">
              <span>Candidate Leaderboard</span>
            </h2>
            <span className="px-2.5 py-0.5 font-mono text-xs uppercase font-bold bg-[#FF5050] text-white">
              {candidates.length} Ranked
            </span>
          </div>
          <p className="font-mono text-xs text-gray-300 mt-1 uppercase tracking-wider">
            Ranked descending by Fit Score • Click card to reveal strengths &amp; gaps
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            type="button"
            id="export-results-btn"
            onClick={exportResultsJSON}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-black/60 hover:bg-black/90 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            title="Download JSON Analysis"
          >
            <Download className="w-3.5 h-3.5 text-[#FF5050]" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            id="reset-screener-btn"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-[#FF5050] hover:bg-[#e64040] text-white font-mono text-xs uppercase font-bold tracking-widest transition-colors cursor-pointer"
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
            placeholder="Search candidate name, skills, requirements..."
            className="w-full pl-9 pr-3 py-2 bg-black/60 border border-white/15 text-white font-mono text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#FF5050] rounded-none"
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

      {/* Ranked Candidate Cards */}
      <div className="space-y-4">
        {filteredCandidates.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs uppercase tracking-widest text-gray-400 bg-black/40 border border-white/10 p-6">
            [ No candidates match &quot;{searchQuery}&quot; ]
          </div>
        ) : (
          filteredCandidates.map((candidate, idx) => {
            const isExpanded = expandedIndices.has(idx);
            const rank = idx + 1;
            const scoreValue = Math.round(candidate.fit_score);

            return (
              <div
                key={`${candidate.candidate_name}-${idx}`}
                id={`candidate-card-${idx}`}
                className="bg-black/75 border border-white/10 hover:border-[#FF5050]/60 transition-all duration-300 rounded-none overflow-hidden shadow-xl"
              >
                {/* Click-to-Expand Header */}
                <div
                  id={`candidate-row-${idx}`}
                  onClick={() => toggleExpand(idx)}
                  className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer select-none gap-5 group"
                >
                  {/* Left: Rank & Candidate Name in crisp white text */}
                  <div className="flex items-start sm:items-center space-x-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-10 h-10 flex items-center justify-center font-mono font-bold text-sm shrink-0 ${
                        rank === 1
                          ? "bg-[#FF5050] text-white"
                          : rank === 2
                          ? "bg-white/20 text-white"
                          : "bg-black border border-white/15 text-gray-300"
                      }`}
                    >
                      #{rank}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Candidate Name in crisp white text */}
                        <h3 className="font-mono text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-[#FF5050] transition-colors">
                          {candidate.candidate_name}
                        </h3>

                        {rank === 1 && (
                          <span className="px-2 py-0.5 bg-[#FF5050]/20 text-[#FF5050] border border-[#FF5050]/40 font-mono text-[10px] uppercase font-bold tracking-wider">
                            TOP CANDIDATE
                          </span>
                        )}
                      </div>

                      {/* Brief verdict line */}
                      <p className="font-sans text-xs sm:text-sm text-gray-300 mt-1 line-clamp-1 max-w-xl">
                        {candidate.verdict}
                      </p>
                    </div>
                  </div>

                  {/* Right: Massive, bold coral/red Fit Score (mimicking large numbers from design system) */}
                  <div className="flex items-center justify-between sm:justify-end space-x-6 shrink-0 self-stretch sm:self-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-white/10">
                    <div className="text-right">
                      {/* Massive bold coral/red number */}
                      <div className="text-4xl sm:text-5xl md:text-6xl font-mono font-bold text-[#FF5050] tracking-tighter leading-none">
                        {scoreValue}
                        <span className="text-2xl sm:text-3xl text-[#FF5050]/80 ml-0.5">%</span>
                      </div>
                      <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                        FIT SCORE
                      </p>
                    </div>

                    {/* Smooth Chevron Indicator */}
                    <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                          isExpanded ? "rotate-180 text-[#FF5050]" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Smoothly Revealed Details (Key Strengths & Missing Requirements in bullet points) */}
                {isExpanded && (
                  <div
                    id={`candidate-details-${idx}`}
                    className="p-6 sm:p-7 pt-0 border-t border-white/10 bg-black/50 space-y-6 animate-fadeIn transition-all duration-300"
                  >
                    {/* Executive Verdict Box */}
                    <div className="p-4 bg-black/80 border border-white/10 mt-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2.5 h-2.5 bg-[#FF5050] rotate-45 shrink-0" />
                        <span className="font-mono text-xs uppercase font-bold text-white tracking-widest">
                          HR Screener Executive Verdict
                        </span>
                      </div>
                      <p className="font-sans text-sm text-gray-200 leading-relaxed">
                        {candidate.verdict}
                      </p>
                    </div>

                    {/* Strengths & Missing Requirements Side-by-Side Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Key Strengths (Bullet Points) */}
                      <div className="p-5 bg-black/70 border border-white/10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-white/10">
                            <Sparkles className="w-4 h-4 text-[#FF5050]" />
                            <h4 className="font-mono text-xs uppercase font-bold text-white tracking-widest">
                              Key Strengths ({candidate.key_strengths.length})
                            </h4>
                          </div>

                          {candidate.key_strengths.length > 0 ? (
                            <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-gray-200 list-disc list-inside marker:text-[#FF5050]">
                              {candidate.key_strengths.map((strength, sIdx) => (
                                <li key={sIdx} className="leading-relaxed">
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="font-mono text-xs text-gray-500 italic">
                              [ No explicit strengths noted ]
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Missing Requirements (Bullet Points) */}
                      <div className="p-5 bg-black/70 border border-white/10 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-white/10">
                            <AlertCircle className="w-4 h-4 text-[#FF5050]" />
                            <h4 className="font-mono text-xs uppercase font-bold text-white tracking-widest">
                              Missing Requirements ({candidate.missing_requirements.length})
                            </h4>
                          </div>

                          {candidate.missing_requirements.length > 0 ? (
                            <ul className="space-y-2.5 font-sans text-xs sm:text-sm text-gray-200 list-disc list-inside marker:text-[#FF5050]">
                              {candidate.missing_requirements.map((missing, mIdx) => (
                                <li key={mIdx} className="leading-relaxed">
                                  <span>{missing}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="font-mono text-xs text-gray-300 flex items-center space-x-2 py-1">
                              <span className="text-[#FF5050] font-bold text-sm">✓</span>
                              <span>All mandatory requirements satisfied</span>
                            </div>
                          )}
                        </div>
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

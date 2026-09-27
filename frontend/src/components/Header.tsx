"use client";

import React from "react";
import { Sparkles, Terminal, FileCheck2, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight">
                TalentRank<span className="text-blue-500">.ai</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                B2B SaaS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Automated Resume Screening & Ranking Engine
            </p>
          </div>
        </div>

        {/* Right Info: Status & Links */}
        <div className="flex items-center space-x-4">
          {/* API Backend status badge */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300">FastAPI Backend</span>
            <span className="text-slate-500 font-mono text-[11px]">:8000</span>
          </div>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            id="api-docs-link"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>API Docs</span>
          </a>

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white shadow-inner">
              HR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

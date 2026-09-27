"use client";

import React from "react";
import { Terminal } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-neutral-900 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo on the left with small red icon */}
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-[#FF3333] rounded-none rotate-45 shadow-[0_0_12px_rgba(255,51,51,0.6)]" />
          <span className="font-mono font-bold text-base sm:text-lg text-white tracking-widest uppercase">
            VISTA.IO<span className="text-[#FF3333]">//</span>TALENT
          </span>
        </div>

        {/* Centered navigation links */}
        <nav className="hidden md:flex items-center space-x-8 font-mono text-xs uppercase tracking-widest text-neutral-400">
          <a
            href="#pipeline"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>// 01</span>
            <span className="text-white">Pipeline</span>
          </a>
          <a
            href="#engine"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>// 02</span>
            <span>Data Engine</span>
          </a>
          <a
            href="#leaderboard"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <span>// 03</span>
            <span>Leaderboard</span>
          </a>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#FF3333] transition-colors flex items-center space-x-1"
          >
            <span>// 04</span>
            <span>Documentation</span>
          </a>
        </nav>

        {/* Rectangular red button on the right */}
        <div className="flex items-center space-x-4">
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            id="nav-api-btn"
            className="rounded-none bg-[#FF3333] hover:bg-[#E02929] text-white px-5 py-2.5 font-mono text-xs uppercase font-bold tracking-widest transition-all duration-200 shadow-[0_0_20px_rgba(255,51,51,0.25)] hover:shadow-[0_0_25px_rgba(255,51,51,0.45)] inline-flex items-center space-x-2"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>API Docs</span>
          </a>
        </div>
      </div>
    </header>
  );
}

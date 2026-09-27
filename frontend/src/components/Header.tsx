"use client";

import React from "react";
import { Sparkles, Terminal, ChevronRight, Layers, Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-lg bg-gray-950 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-base text-gray-900 tracking-tight">
                TalentRank
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-gray-100 text-gray-700 border border-gray-200 rounded-md">
                Workspace
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-gray-400 pl-2 border-l border-gray-200">
            <span>Recruiting</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className="text-gray-600 font-medium">Candidate Screener</span>
          </div>
        </div>

        {/* Right Info: Status & Links */}
        <div className="flex items-center space-x-3">
          {/* Backend API status badge */}
          <div className="hidden md:flex items-center space-x-2 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-600 text-xs">FastAPI Engine</span>
            <span className="text-gray-400 font-mono text-[11px]">:8000</span>
          </div>

          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            id="api-docs-link"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 hover:text-gray-900 transition-colors shadow-2xs"
          >
            <Terminal className="w-3.5 h-3.5 text-gray-500" />
            <span>API Docs</span>
          </a>

          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <button
              type="button"
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-xs font-semibold text-white">
              HR
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-neutral-900 bg-black py-12 sm:py-16 text-white font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start justify-between">
          {/* Left Column: Brand & Terminal Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-3.5 h-3.5 bg-[#FF3333] rotate-45" />
              <span className="font-bold text-base tracking-widest uppercase">
                VISTA.IO<span className="text-[#FF3333]">//</span>TALENT
              </span>
            </div>

            <p className="text-xs text-neutral-400 uppercase tracking-widest max-w-md leading-relaxed">
              THE STANDARD IN NEW DATA ANALYSIS. AUTONOMOUS CANDIDATE SCREENING AND MULTI-VECTOR TALENT METRICS.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500 uppercase tracking-wider pt-2">
              <span>© 2026 VISTA.IO SYSTEMS</span>
              <span>//</span>
              <span className="text-emerald-400">ENGINE STATUS: OPERATIONAL</span>
              <span>//</span>
              <span>NEURAL PIPELINE v2.4</span>
            </div>
          </div>

          {/* Right Column: Newsletter Area with Red Accent Button */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest">
              // DATA DISPATCH BENCHMARKS
            </h4>
            <p className="text-[11px] text-neutral-400 uppercase tracking-wider">
              Receive algorithmic candidate ranking benchmarks and model release notes.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER SYSTEM OPERATOR EMAIL..."
                className="bg-[#0b120e] border border-[#233828] focus:border-[#FF3333] text-white font-mono text-xs uppercase px-4 py-3 placeholder-neutral-600 focus:outline-none rounded-none flex-1 transition-colors"
              />
              <button
                type="submit"
                id="newsletter-subscribe-btn"
                className="rounded-none bg-[#FF3333] hover:bg-[#E02929] text-white px-6 py-3 font-mono text-xs uppercase font-bold tracking-widest transition-all duration-200 shadow-[0_0_15px_rgba(255,51,51,0.25)] hover:shadow-[0_0_20px_rgba(255,51,51,0.45)] cursor-pointer flex items-center justify-center space-x-2 shrink-0"
              >
                {subscribed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>SUBSCRIBED</span>
                  </>
                ) : (
                  <>
                    <span>SUBSCRIBE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

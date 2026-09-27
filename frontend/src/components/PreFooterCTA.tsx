"use client";

import React from "react";

export default function PreFooterCTA() {
  return (
    <section id="cta" className="bg-black py-24 sm:py-32 lg:py-40 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Massive Text */}
          <div className="lg:col-span-8">
            <h2 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92]">
              Are You Ready to Accelerate Your Business?
            </h2>
          </div>

          {/* Right Column: Paragraph and red Get Started button */}
          <div className="lg:col-span-4 lg:pt-3">
            <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed mb-8">
              Take the first step toward unified predictive intelligence. Deploy VISTA.IO models across your infrastructure and unlock real-time business visibility.
            </p>

            <div>
              <a
                href="#get-started"
                className="inline-block rounded-none bg-[#FF5050] hover:bg-[#e64040] text-white px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

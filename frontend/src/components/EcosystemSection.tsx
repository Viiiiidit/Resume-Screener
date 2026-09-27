"use client";

import React from "react";

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="bg-black py-24 sm:py-32 lg:py-40 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left column: Massive text */}
          <div className="lg:col-span-8">
            <h2 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92]">
              We Integrate With Your Ecosystem
            </h2>
          </div>

          {/* Right column: filler text */}
          <div className="lg:col-span-4 lg:pt-3">
            <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
              Seamlessly connect with your existing cloud platforms, distributed databases, warehouse pipelines, and business intelligence suites. VISTA.IO natively bridges disparate architectures without requiring costly rewrites or infrastructure overhaul.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

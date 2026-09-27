"use client";

import React from "react";

export default function TypographySections() {
  return (
    <div className="bg-black text-white divide-y divide-gray-900 border-b border-gray-900">
      {/* Section 1: "Your Business to Higher Grounds" */}
      <section className="py-24 sm:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-8">
              <h2 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92]">
                Your Business to Higher Grounds
              </h2>
            </div>
            <div className="lg:col-span-4 lg:pt-3">
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                Elevate your enterprise operations with autonomous data intelligence. We bridge the gap between raw data streams and executive decision-making with unmatched precision and clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: "Unprecedented Velocity. Impeccable Reliability." */}
      <section id="learn-more" className="py-24 sm:py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-8">
              <h2 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92]">
                Unprecedented Velocity. Impeccable Reliability.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:pt-3">
              <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed mb-8">
                Harness high-frequency query pipelines engineered for mission-critical reliability. Continuous uptime and distributed cloud acceleration guarantee your business never skips a beat.
              </p>
              <div>
                <a
                  href="#cta"
                  className="inline-block rounded-none bg-[#FF5050] hover:bg-[#e64040] text-white px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

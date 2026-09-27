"use client";

import React from "react";

export default function Hero() {
  return (
    <section className="relative starry-hero-bg pt-12 sm:pt-16 pb-40 sm:pb-48 lg:pb-52 overflow-hidden border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CRITICAL STAGGERED HEADING */}
        <div className="select-none flex flex-col space-y-0 w-full">
          {/* Line 1: "THE" */}
          <div className="text-left font-mono font-bold text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[11rem] tracking-tighter leading-[0.88] text-white">
            THE
          </div>

          {/* Line 2: "STANDARD" (Left) / "NEW" (Far right) */}
          <div className="flex justify-between items-baseline font-mono font-bold text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[11rem] tracking-tighter leading-[0.88] text-white w-full">
            <span>STANDARD</span>
            <span className="text-right">NEW</span>
          </div>

          {/* Line 3: "IN" */}
          <div className="text-left font-mono font-bold text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[11rem] tracking-tighter leading-[0.88] text-white">
            IN
          </div>

          {/* Line 4: "ANALYSIS" (Left) / "DATA" (Right) */}
          <div className="flex justify-between items-baseline font-mono font-bold text-6xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[11rem] tracking-tighter leading-[0.88] text-white w-full">
            <span>ANALYSIS</span>
            <span className="text-right">DATA</span>
          </div>
        </div>

        {/* Subheadline and Button */}
        <div className="mt-14 sm:mt-18 max-w-xl">
          <p className="font-mono text-sm sm:text-base text-white tracking-wider leading-relaxed">
            Use Data to Get a 360-Degree View of your Business
          </p>

          <div className="mt-6">
            <a
              href="#learn-more"
              className="inline-block rounded-none bg-[#FF5050] hover:bg-[#e64040] text-white px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

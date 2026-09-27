"use client";

import React from "react";

const STATS_DATA = [
  {
    number: "15",
    label: "Years of Experience",
  },
  {
    number: "10k",
    label: "Business Partners",
  },
  {
    number: "22",
    label: "Countries World Wide",
  },
  {
    number: "26M",
    label: "Products Installed",
  },
  {
    number: "5",
    label: "Industry Awards",
  },
];

export default function StatsBar() {
  return (
    <section className="bg-black py-24 sm:py-32 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Center aligned heading */}
        <h2 className="font-mono text-center text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-widest text-white mb-16 sm:mb-24">
          We Take Pride in Our Numbers
        </h2>

        {/* 5 columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-6 text-center">
          {STATS_DATA.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center justify-start ${
                index === STATS_DATA.length - 1 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-mono font-bold text-[#FF5050] tracking-tighter leading-none">
                {stat.number}
              </div>
              <p className="font-mono text-xs sm:text-sm text-white uppercase tracking-wider mt-4 leading-snug max-w-[150px]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

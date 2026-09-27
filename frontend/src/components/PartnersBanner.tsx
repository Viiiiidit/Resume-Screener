"use client";

import React from "react";

const PARTNERS = [
  { name: "/// Image", style: "font-mono font-bold tracking-widest text-lg" },
  { name: "Datox.Ai", style: "font-sans font-black tracking-tight text-xl italic" },
  { name: "energator", style: "font-mono font-bold lowercase tracking-wider text-xl" },
  { name: "Drivilux", style: "font-sans font-extrabold tracking-widest text-xl uppercase" },
  { name: "/// WHEELBU", style: "font-mono font-bold tracking-widest text-lg" },
];

export default function PartnersBanner() {
  return (
    <section className="bg-black py-20 sm:py-28 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Center aligned heading */}
        <h2 className="font-mono text-center text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-12 sm:mb-16">
          Our Partners
        </h2>

        {/* Row of vector logos */}
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 md:gap-20 text-white opacity-85">
          {PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className={`select-none hover:opacity-100 hover:text-[#FF5050] transition-colors cursor-default ${partner.style}`}
            >
              {partner.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

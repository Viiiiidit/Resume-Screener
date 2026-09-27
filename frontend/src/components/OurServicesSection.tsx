"use client";

import React from "react";
import ServiceCards from "./ServiceCards";

export default function OurServicesSection() {
  return (
    <section id="services" className="bg-black py-24 sm:py-32 lg:py-40 border-b border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Exact Heading */}
        <div className="mb-16 sm:mb-20">
          <h2 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92] max-w-5xl">
            Dive Into the New Age of Accelerated Analytics
          </h2>
        </div>

        {/* 4 Cards Repeated Cleanly Below Heading */}
        <ServiceCards isOverlapping={false} />
      </div>
    </section>
  );
}

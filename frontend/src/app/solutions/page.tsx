"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import OurServicesSection from "@/components/OurServicesSection";
import EcosystemSection from "@/components/EcosystemSection";
import PreFooterCTA from "@/components/PreFooterCTA";
import Footer from "@/components/Footer";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#FF5050] selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* Solutions Hero Banner */}
        <section className="starry-hero-bg py-20 sm:py-28 border-b border-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <span className="font-mono text-xs uppercase tracking-widest text-[#FF5050] font-bold">
                [ SOLUTIONS &amp; ARCHITECTURE ]
              </span>
              <h1 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92] mt-4">
                Enterprise Solutions
              </h1>
              <p className="mt-6 font-mono text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
                High-throughput cloud data modernization, predictive intelligence, and seamless telemetry integration across enterprise ecosystems.
              </p>
            </div>
          </div>
        </section>

        {/* Our Services: "Dive Into the New Age of Accelerated Analytics" + 4 cards */}
        <OurServicesSection />

        {/* Ecosystem: "We Integrate With Your Ecosystem" */}
        <EcosystemSection />

        {/* Pre-Footer CTA */}
        <PreFooterCTA />

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}

"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServiceCards from "@/components/ServiceCards";
import TypographySections from "@/components/TypographySections";
import PreFooterCTA from "@/components/PreFooterCTA";
import Footer from "@/components/Footer";

export default function VistaIoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#FF5050] selection:text-white">
      {/* 1. Sticky Navbar */}
      <Navbar />

      <main className="flex-1 w-full">
        {/* 2. Hero Section (Starry Background & Staggered Heading) */}
        <Hero />

        {/* 3. Overlapping Service Cards (-mt-32 overlap) */}
        <ServiceCards isOverlapping={true} />

        {/* 4. Typography Scroll Sections */}
        <TypographySections />

        {/* 5. Pre-Footer CTA */}
        <PreFooterCTA />

        {/* 6. Footer */}
        <Footer />
      </main>
    </div>
  );
}

"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServiceCards from "@/components/ServiceCards";
import TypographySections from "@/components/TypographySections";
import PreFooterCTA from "@/components/PreFooterCTA";
import Footer from "@/components/Footer";
import OurServicesSection from "@/components/OurServicesSection";
import EcosystemSection from "@/components/EcosystemSection";
import MissionStorySection from "@/components/MissionStorySection";

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

        {/* 7. Additional Pages/Sections to append below */}
        {/* Our Services: "Dive Into the New Age of Accelerated Analytics" + 4 cards repeated */}
        <OurServicesSection />

        {/* Ecosystem: "We Integrate With Your Ecosystem" */}
        <EcosystemSection />

        {/* Mission & Story: "Our Mission", "Our Story" */}
        <MissionStorySection />
      </main>
    </div>
  );
}

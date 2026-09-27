"use client";

import React from "react";

export default function MissionStorySection() {
  const sections = [
    {
      id: "our-mission",
      heading: "Our Mission",
      content:
        "To democratize ultra-high-velocity analytics for enterprises worldwide. We empower leadership and operational teams to transform raw multi-stream signals into decisive competitive advantages through automated intelligence.",
    },
    {
      id: "our-story",
      heading: "Our Story",
      content:
        "Founded by distributed computing researchers and enterprise data architects, VISTA.IO was born out of frustration with brittle legacy reporting pipelines. We engineered a ground-up reactive compute engine that powers real-time enterprise observability.",
    },
    {
      id: "experienced-leadership",
      heading: "Experienced Leadership",
      content:
        "Our executive team brings decades of combined experience across hyperscale infrastructure, algorithmic machine learning, and security governance from leading technology pioneers and research institutions.",
    },
  ];

  return (
    <div id="mission" className="bg-black text-white divide-y divide-gray-900 border-b border-gray-900">
      {sections.map((item) => (
        <section key={item.id} id={item.id} className="py-24 sm:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Heading on left */}
              <div className="lg:col-span-8">
                <h2 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92]">
                  {item.heading}
                </h2>
              </div>

              {/* Text on right */}
              <div className="lg:col-span-4 lg:pt-3">
                <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

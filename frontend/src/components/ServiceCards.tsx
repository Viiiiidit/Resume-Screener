"use client";

import React from "react";
import { Plus, Asterisk, Brain } from "lucide-react";

export const SERVICE_CARD_ITEMS = [
  {
    id: "cloud-analytics",
    icon: "spade",
    title: "Cloud Analytics Modernization",
    description:
      "Modernize data warehouses and analytics infrastructure for enterprise cloud environments with high-throughput stream processing.",
  },
  {
    id: "versatility",
    icon: "plus",
    title: "Versatility in Application",
    description:
      "Adaptable data models and flexible APIs built to integrate seamlessly across cross-functional enterprise workflows and third-party tools.",
  },
  {
    id: "customer-experience",
    icon: "asterisk",
    title: "Full Customer Experience Service",
    description:
      "Deliver 360-degree behavioral insights and unified customer touchpoint telemetry with low latency and real-time synchronization.",
  },
  {
    id: "data-science",
    icon: "brain",
    title: "Data Science Acceleration",
    description:
      "Accelerate machine learning pipelines, predictive algorithmic modeling, and automated feature extraction at enterprise scale.",
  },
];

function CardIcon({ type }: { type: string }) {
  if (type === "spade") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 text-white"
        aria-hidden="true"
      >
        <path d="M12 2C9.5 6 4 9.5 4 14.5c0 3 2.5 5.5 5.5 5.5 1.5 0 2.5-.5 2.5-1.5v-1c0-.3.2-.5.5-.5s.5.2.5.5v1c0 1 1 1.5 2.5 1.5 3 0 5.5-2.5 5.5-5.5C20 9.5 14.5 6 12 2zM10.5 19l-1.5 3h6l-1.5-3h-3z" />
      </svg>
    );
  }
  if (type === "plus") {
    return <Plus className="w-8 h-8 text-white stroke-[2.5]" />;
  }
  if (type === "asterisk") {
    return <Asterisk className="w-8 h-8 text-white stroke-[2.5]" />;
  }
  return <Brain className="w-8 h-8 text-white stroke-[2]" />;
}

export default function ServiceCards({ isOverlapping = true }: { isOverlapping?: boolean }) {
  return (
    <div className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isOverlapping ? "-mt-28 sm:-mt-32 lg:-mt-36" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {SERVICE_CARD_ITEMS.map((card) => (
          <div
            key={card.id}
            className="bg-[#3B403D] text-white p-8 border border-white/10 flex flex-col justify-between min-h-[310px] shadow-2xl transition-transform hover:-translate-y-1"
          >
            <div>
              <div className="mb-6">
                <CardIcon type={card.icon} />
              </div>

              <h3 className="font-mono text-lg sm:text-xl font-bold tracking-tight text-white mb-4 leading-snug">
                {card.title}
              </h3>
            </div>

            <p className="text-sm text-gray-200/90 leading-relaxed font-sans font-normal">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

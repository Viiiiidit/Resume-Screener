"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";

interface BlogPost {
  id: string;
  category: "Content Creation" | "Marketing" | "Technology";
  title: string;
  date: string;
  readTime: string;
  snippet: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    category: "Technology",
    title: "8 Technology Trends That Will Dominate This Year",
    date: "May 14, 2035",
    readTime: "4 min read",
    snippet:
      "Explore the key developments in distributed compute architectures, automated vector pipelines, and neural telemetry models revolutionizing modern analytical infrastructure.",
  },
  {
    id: "post-2",
    category: "Content Creation",
    title: "Introduction to Data Query Engines",
    date: "Apr 28, 2035",
    readTime: "6 min read",
    snippet:
      "A deep dive into vectorized query execution, cost-based query optimization, and columnar in-memory processing frameworks that accelerate enterprise analytical querying.",
  },
  {
    id: "post-3",
    category: "Marketing",
    title: "The Online Database Migration Guide",
    date: "Mar 19, 2035",
    readTime: "8 min read",
    snippet:
      "Zero-downtime database replication strategies, dual-write consistency patterns, and schema validation benchmarks for migrating mission-critical data stores to cloud-native platforms.",
  },
];

export default function BlogSection() {
  const [activeTab, setActiveTab] = useState<string>("All Posts");

  const categories = ["All Posts", "Content Creation", "Marketing"];

  const filteredPosts =
    activeTab === "All Posts"
      ? BLOG_POSTS
      : BLOG_POSTS.filter((post) => post.category === activeTab);

  return (
    <section id="blog" className="bg-[#4A534B] text-white py-24 sm:py-32 lg:py-40 border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-white/20 gap-8">
          <div>
            <h2 className="font-mono font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter text-white uppercase leading-[0.92]">
              Our Blog
            </h2>
          </div>

          {/* Horizontal Navigation: "All Posts | Content Creation | Marketing" */}
          <nav className="flex items-center space-x-3 sm:space-x-5 font-mono text-xs sm:text-sm uppercase tracking-wider text-gray-200">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                <button
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`transition-colors cursor-pointer py-1 ${
                    activeTab === cat
                      ? "text-white font-bold border-b-2 border-[#FF5050]"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
                {idx < categories.length - 1 && (
                  <span className="text-white/40 select-none">|</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* 3 Blog Post Cards Stacked Vertically */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#3B403D] border border-white/10 p-8 sm:p-10 transition-all duration-200 hover:border-white/30 hover:-translate-y-0.5 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  {/* Meta info */}
                  <div className="flex items-center space-x-4 font-mono text-xs text-gray-300 uppercase tracking-widest">
                    <span className="text-[#FF5050] font-bold">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-mono text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight group-hover:text-[#FF5050] transition-colors">
                    {post.title}
                  </h3>

                  {/* Snippet */}
                  <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed">
                    {post.snippet}
                  </p>
                </div>

                {/* Read Link */}
                <div className="shrink-0 flex items-center">
                  <a
                    href={`#blog`}
                    className="inline-flex items-center space-x-2 font-mono text-xs uppercase font-bold tracking-widest text-white group-hover:text-[#FF5050] transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

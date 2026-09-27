import React from "react";
import Link from "next/link";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="bg-black sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo with small red abstract icon */}
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-3.5 h-3.5 bg-[#FF5050] rotate-45 shrink-0" />
          <span className="font-mono text-xl font-bold tracking-wider text-white">
            VISTA.IO
          </span>
        </Link>


        {/* Right: Red Get Started button and Log In link with user icon */}
        <div className="flex items-center space-x-6">
          <Link
            href="/get-started"
            className="rounded-none bg-[#FF5050] hover:bg-[#e64040] text-white px-5 py-2.5 font-mono text-xs uppercase font-bold tracking-wider transition-colors inline-block text-center"
          >
            Get Started
          </Link>

          <a
            href="#"
            className="flex items-center space-x-2 text-white hover:text-[#FF5050] font-mono text-xs uppercase tracking-wider transition-colors"
          >
            <div className="w-6 h-6 rounded-full border border-gray-700 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="hidden sm:inline">Log In</span>
          </a>
        </div>
      </div>
    </header>
  );
}

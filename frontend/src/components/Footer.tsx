"use client";

import React, { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-black text-white pt-20 sm:pt-28 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-gray-900">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
            <div>
              {/* Logo */}
              <div className="flex items-center space-x-2.5 mb-8">
                <div className="w-3.5 h-3.5 bg-[#FF5050] rotate-45 shrink-0" />
                <span className="font-mono text-2xl font-bold tracking-wider text-white">
                  VISTA.IO
                </span>
              </div>

              {/* Vertical Links */}
              <nav className="flex flex-col space-y-3 font-mono text-sm text-gray-300">
                <a href="/solutions" className="hover:text-[#FF5050] transition-colors">
                  Solutions
                </a>
                <a href="#mission" className="hover:text-[#FF5050] transition-colors">
                  Vision
                </a>
                <a href="#blog" className="hover:text-[#FF5050] transition-colors">
                  Blog
                </a>
                <a href="#" className="hover:text-[#FF5050] transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-[#FF5050] transition-colors">
                  Accessibility Statement
                </a>
              </nav>

              {/* Red Get Started button */}
              <div className="mt-8">
                <a
                  href="#cta"
                  className="inline-block rounded-none bg-[#FF5050] hover:bg-[#e64040] text-white px-7 py-3 font-mono text-xs uppercase font-bold tracking-widest transition-colors"
                >
                  Get Started
                </a>
              </div>
            </div>

            {/* Contact info */}
            <div className="font-mono text-xs text-gray-400 space-y-1 pt-4">
              <p>T: 123-456-7890</p>
              <p>E: info@mysite.com</p>
              <p className="pt-1">500 Terry Francine Street, San Francisco, CA 94158</p>
            </div>
          </div>

          {/* Right Column: Join Our Mailing List */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              <h2 className="font-mono font-bold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tighter leading-none mb-10">
                Join Our Mailing List
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
                <div>
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email here *"
                    className="w-full bg-transparent border-b border-white text-white font-mono text-sm sm:text-base py-3 px-0 placeholder:text-gray-500 focus:outline-none focus:border-[#FF5050] transition-colors rounded-none"
                  />
                </div>

                {/* Checkbox for marketing emails */}
                <div className="flex items-start space-x-3 pt-2">
                  <input
                    id="marketing-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded-none border-gray-600 bg-transparent text-[#FF5050] focus:ring-0 accent-[#FF5050] cursor-pointer"
                  />
                  <label
                    htmlFor="marketing-consent"
                    className="font-mono text-xs text-gray-400 leading-normal cursor-pointer"
                  >
                    Yes, subscribe me to your newsletter.
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    id="footer-join-btn"
                    className="rounded-none bg-[#FF5050] hover:bg-[#e64040] text-white px-8 py-3.5 font-mono text-xs uppercase font-bold tracking-widest transition-colors cursor-pointer"
                  >
                    {submitted ? "Joined!" : "Join Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright text */}
        <div className="pt-8 text-center sm:text-left font-mono text-xs text-gray-500">
          <p>© 2035 by VISTA.IO. Powered and secured by Wix</p>
        </div>
      </div>
    </footer>
  );
}

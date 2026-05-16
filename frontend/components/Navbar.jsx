"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <svg
              className="w-5 h-5 text-[#0a0a0f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>

          <span className="text-xl font-extrabold text-white tracking-tight">
            Notes<span className="text-amber-400">.</span>
          </span>

          <span className="hidden sm:inline text-[10px] font-mono tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
            v2.0
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">

          <a
            href="#features"
            className="hover:text-amber-400 transition-colors duration-200"
          >
            Features
          </a>

          <a
            href="http://localhost:5000/docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-amber-400 transition-colors duration-200 flex items-center gap-1"
          >
            API Docs

            <svg
              className="w-3 h-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <Link
            href="/auth/login"
            className="hover:text-white transition-colors duration-200"
          >
            Login
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          <Link
            href="/auth/register"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0a0a0f] text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_24px_rgba(245,158,11,0.3)] hover:shadow-[0_4px_32px_rgba(245,158,11,0.45)]"
          >
            Get Started

            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14M12 5l7 7-7 7"
              />
            </svg>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white/70"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/8 bg-[#0a0a0f]/95 backdrop-blur-md px-6 py-4 flex flex-col gap-3">

          <a
            href="#features"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-white/60 hover:text-amber-400 transition-colors py-2 border-b border-white/6"
          >
            Features
          </a>

          <a
            href="http://localhost:5000/docs"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-white/60 hover:text-amber-400 transition-colors py-2 border-b border-white/6 flex items-center gap-1"
          >
            API Docs

            <svg
              className="w-3 h-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <Link
            href="/auth/login"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-white/60 hover:text-white transition-colors py-2 border-b border-white/6"
          >
            Login
          </Link>

          <Link
            href="/auth/register"
            onClick={() => setMenuOpen(false)}
            className="mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0a0a0f] text-sm font-bold transition-all duration-200 shadow-[0_0_24px_rgba(245,158,11,0.3)]"
          >
            Get Started →
          </Link>
        </div>
      )}
    </nav>
  );
}
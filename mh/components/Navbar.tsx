"use client";

import { useState, useEffect } from "react";
import { Menu, X, Brain } from "lucide-react";

const LINKS = [
  { href: "#home",       label: "Home" },
  { href: "#assessment", label: "Assessment" },
  { href: "#about",      label: "About" },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-void/95 backdrop-blur-md shadow-[0_1px_0_#1E2A3D]"
          : "border-b border-transparent bg-void/80 backdrop-blur-sm"
      }`}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <a
          href="#home"
          className="group flex items-center gap-2.5 font-display text-[1.05rem] font-bold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-violet shadow-glow-sm transition-transform duration-200 group-hover:scale-105">
            <Brain aria-hidden className="h-4 w-4 text-void" />
          </span>
          <span className="text-gradient">Mental Health AI</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative rounded-lg px-4 py-2 text-sm font-medium text-prose-soft transition-colors hover:text-prose-bright"
              >
                {l.label}
                <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 rounded-full bg-accent transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
          <li>
            <a
              href="#assessment"
              className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/30 px-4 text-sm font-semibold text-accent transition-all duration-200 hover:bg-accent/20 hover:border-accent/60 hover:shadow-glow-sm"
            >
              Start Assessment
            </a>
          </li>
        </ul>

        {/* Mobile burger */}
        <button
          type="button"
          id="mobile-menu-btn"
          className="grid h-10 w-10 place-items-center rounded-lg text-prose-soft transition-colors hover:bg-surface hover:text-prose sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open
            ? <X aria-hidden className="h-5 w-5" />
            : <Menu aria-hidden className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          id="mobile-menu"
          className="animate-slide-down border-t border-border bg-surface/95 px-4 pb-4 pt-2 sm:hidden"
        >
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-prose-soft transition-colors hover:bg-surface-hi hover:text-prose-bright"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#assessment"
                onClick={() => setOpen(false)}
                className="mt-2 flex h-11 items-center justify-center rounded-lg bg-accent/10 border border-accent/30 text-sm font-semibold text-accent"
              >
                Start Assessment
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

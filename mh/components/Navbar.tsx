"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#home", label: "Home" },
  { href: "#assessment", label: "Assessment" },
  { href: "#about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur-sm">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a href="#home" className="font-display text-lg font-bold tracking-tight text-tide-dark">
          Mental Health Prediction
        </a>
        <ul className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-lg px-3.5 py-2 text-[0.95rem] font-medium text-ink-soft transition-colors hover:bg-mist hover:text-ink">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg text-ink hover:bg-mist sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden className="h-6 w-6" /> : <Menu aria-hidden className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <ul id="mobile-menu" className="border-t border-line bg-white px-4 pb-3 sm:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-mist">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}

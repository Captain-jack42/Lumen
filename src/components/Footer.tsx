"use client";

import { motion } from "framer-motion";

const FOOTER_LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-secondary/40 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <a
            href="#"
            className="font-display text-2xl font-bold tracking-tight text-highlight transition-colors hover:text-accent"
          >
            LUMEN
          </a>
          <nav>
            <ul className="flex flex-wrap gap-8">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-neutral transition-colors hover:text-highlight"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-16 flex flex-col gap-6 border-t border-white/5 pt-10 md:flex-row md:items-center md:justify-between">
          <p className="font-body text-sm text-neutral">
            © {new Date().getFullYear()} LUMEN. All rights reserved.
          </p>
          <div className="flex gap-8 font-body text-sm text-neutral">
            <a href="#" className="transition-colors hover:text-highlight">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-highlight">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

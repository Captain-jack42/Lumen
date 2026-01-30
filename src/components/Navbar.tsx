"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Features", href: "#features" },
  { label: "Story", href: "#story" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
        <a
          href="#"
          className="font-display text-xl font-bold tracking-tight text-highlight transition-colors hover:text-accent md:text-2xl"
        >
          LUMEN
        </a>

        <ul className="hidden items-center gap-10 md:flex">
          {LINKS.map((link, i) => (
            <li key={link.href} className="group">
              <motion.a
                href={link.href}
                className="relative inline-block font-body text-sm font-medium tracking-wide text-neutral transition-colors hover:text-highlight"
                whileHover={{ color: "var(--highlight)" }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + i * 0.05 }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </motion.a>
            </li>
          ))}
        </ul>

        <motion.a
          href="#contact"
          className="hidden rounded-full border border-accent px-5 py-2.5 font-body text-sm font-medium text-accent transition-all hover:bg-accent hover:text-primary md:block"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Get in touch
        </motion.a>

        <button
          type="button"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="h-0.5 w-6 bg-highlight"
            animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="h-0.5 w-6 bg-highlight"
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="h-0.5 w-6 bg-highlight"
            animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
          />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="glass absolute left-0 right-0 top-full mt-2 flex flex-col gap-6 px-6 py-8 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-lg text-highlight"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="rounded-full border border-accent px-5 py-2.5 text-center font-body text-sm font-medium text-accent"
              onClick={() => setMobileOpen(false)}
            >
              Get in touch
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

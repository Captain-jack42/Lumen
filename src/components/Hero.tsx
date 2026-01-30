"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section
      id="about"
      aria-label="Hero"
      className="relative flex min-h-screen flex-col justify-end pb-24 pt-32 md:justify-center md:pb-32 md:pt-0"
    >
      {/* Background gradient / atmosphere */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-mesh from-primary via-secondary/30 to-primary opacity-60" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-primary to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.p
          className="font-body text-sm uppercase tracking-[0.3em] text-accent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          Premium digital experiences
        </motion.p>
        <motion.h1
          className="mt-4 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-hero-tight text-highlight md:text-7xl lg:text-8xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          Where clarity
          <br />
          <span className="text-accent">meets possibility</span>
        </motion.h1>
        <motion.p
          className="mt-8 max-w-xl font-body text-lg text-neutral md:text-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          We build next-gen interfaces for ambitious brands. Not average
          websites — experiences that move.
        </motion.p>
        <motion.div
          className="mt-12 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          <motion.a
            href="#features"
            className="rounded-full bg-accent px-8 py-4 font-body text-sm font-semibold text-primary transition-colors hover:bg-accent/90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore
          </motion.a>
          <motion.a
            href="#contact"
            className="rounded-full border border-highlight/30 px-8 py-4 font-body text-sm font-medium text-highlight transition-colors hover:border-highlight/60"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a project
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-neutral"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.8 }}
      >
        <span className="font-body text-xs tracking-widest">SCROLL</span>
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-accent to-transparent"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}

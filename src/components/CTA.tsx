"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function CTA() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="cta"
      ref={ref}
      className="relative border-t border-white/5 bg-secondary/60 py-24 md:py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-transparent to-primary/50" />
      <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
        <motion.h2
          className="font-display text-4xl font-bold tracking-h2-tight text-highlight md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Ready to build
          <br />
          <span className="text-accent">something bold?</span>
        </motion.h2>
        <motion.p
          className="mt-6 font-body text-lg text-neutral md:text-xl"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          Let’s turn your vision into a premium digital experience.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <motion.a
            href="#contact"
            className="rounded-full bg-accent px-10 py-4 font-body text-sm font-semibold text-primary transition-colors hover:bg-accent/90"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a project
          </motion.a>
          <motion.a
            href="#features"
            className="rounded-full border border-highlight/30 px-10 py-4 font-body text-sm font-medium text-highlight transition-colors hover:border-highlight/60"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore our work
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

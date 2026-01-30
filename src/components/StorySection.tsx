"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const STEPS = [
  {
    step: "01",
    title: "Discover",
    text: "We align on vision, audience, and the experience you want to own in the market.",
  },
  {
    step: "02",
    title: "Design",
    text: "Visual systems, motion language, and layouts that feel inevitable — not templated.",
  },
  {
    step: "03",
    title: "Build",
    text: "Clean, performant code. Animations and interactions that scale with your product.",
  },
  {
    step: "04",
    title: "Launch",
    text: "We ship with you. Handoff, documentation, and support so you own the outcome.",
  },
];

export function StorySection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="story"
      ref={ref}
      className="relative overflow-hidden border-t border-white/5 bg-primary py-24 md:py-40"
    >
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-20 md:mb-28"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-body text-sm uppercase tracking-[0.3em] text-accent">
            How we work
          </span>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-h2-tight text-highlight md:text-5xl lg:text-6xl">
            Visual storytelling
            <br />
            <span className="text-accent">that converts</span>
          </h2>
        </motion.div>

        <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.article
              key={s.step}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.15 * i,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="font-display text-6xl font-bold text-accent/20 md:text-7xl">
                {s.step}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-highlight">
                {s.title}
              </h3>
              <p className="mt-3 font-body text-neutral leading-relaxed">
                {s.text}
              </p>
              {i < STEPS.length - 1 && (
                <span className="absolute -right-8 top-12 hidden h-px w-16 bg-gradient-to-r from-accent/30 to-transparent lg:block" />
              )}
            </motion.article>
          ))}
        </div>

        <motion.div
          className="mt-24 flex justify-center md:mt-32"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="glass flex flex-wrap items-center justify-center gap-8 rounded-2xl px-8 py-6 md:gap-12">
            <span className="font-body text-sm uppercase tracking-widest text-neutral">
              Trusted by teams at
            </span>
            <div className="flex gap-10 font-display text-lg font-semibold text-highlight/80 md:gap-14">
              <span>Studio X</span>
              <span>Atelier</span>
              <span>Nexus Labs</span>
              <span>Vault</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ITEMS = [
  {
    title: "Refined interfaces",
    description:
      "Every pixel considered. We design systems that feel effortless and intentional, so your product speaks before the copy does.",
    icon: "01",
  },
  {
    title: "Intentional motion",
    description:
      "Animation that guides, not distracts. Scroll-driven storytelling and micro-interactions that reinforce hierarchy and delight.",
    icon: "02",
  },
  {
    title: "Forward-thinking",
    description:
      "Built for tomorrow. Performance, accessibility, and scalability are baked in so your experience stays premium at scale.",
    icon: "03",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={ref}
      className="relative border-t border-white/5 bg-secondary/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          className="mb-16 md:mb-24"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="font-body text-sm uppercase tracking-[0.3em] text-accent">
            What we deliver
          </span>
          <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold tracking-h2-tight text-highlight md:text-5xl lg:text-6xl">
            Value that
            <br />
            <span className="text-accent">shows</span>
          </h2>
        </motion.div>

        <motion.ul
          className="grid gap-12 md:grid-cols-3 md:gap-8"
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {ITEMS.map((feature) => (
            <motion.li
              key={feature.icon}
              variants={item}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="group glass rounded-2xl p-8 transition-colors hover:border-accent/20"
            >
              <span className="font-display text-5xl font-bold text-accent/30 transition-colors group-hover:text-accent/50">
                {feature.icon}
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold text-highlight md:text-2xl">
                {feature.title}
              </h3>
              <p className="mt-4 font-body text-neutral leading-relaxed">
                {feature.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

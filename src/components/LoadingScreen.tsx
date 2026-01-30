"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = { onComplete?: () => void };

export function LoadingScreen({ onComplete }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => onComplete?.()}
      >
        <motion.span
          className="font-display text-4xl font-bold tracking-hero-tight text-highlight md:text-6xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          LUMEN
        </motion.span>
        <motion.div
          className="mt-6 h-px w-24 overflow-hidden rounded-full bg-secondary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
        />
        <motion.div
          className="mt-4 font-body text-sm tracking-widest text-neutral"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          LOADING
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

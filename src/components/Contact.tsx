"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative border-t border-white/5 bg-primary py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="font-body text-sm uppercase tracking-[0.3em] text-accent">
              Get in touch
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-h2-tight text-highlight md:text-5xl">
              Let’s create
              <br />
              <span className="text-accent">together</span>
            </h2>
            <p className="mt-6 max-w-md font-body text-neutral leading-relaxed">
              Tell us about your project. We’ll respond within 24 hours with
              next steps.
            </p>
            <div className="mt-10 space-y-4 font-body text-highlight">
              <a
                href="mailto:hello@lumen.design"
                className="block transition-colors hover:text-accent"
              >
                hello@lumen.design
              </a>
              <a
                href="tel:+15551234567"
                className="block transition-colors hover:text-accent"
              >
                +1 555 123 4567
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {submitted ? (
              <motion.div
                className="glass rounded-2xl p-10 text-center"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-display text-2xl font-semibold text-accent">
                  Thank you.
                </p>
                <p className="mt-2 font-body text-neutral">
                  We’ll get back to you shortly.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass flex flex-col gap-6 rounded-2xl p-8 md:p-10"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-body text-sm font-medium text-neutral"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-lg border border-white/10 bg-secondary/50 px-4 py-3 font-body text-highlight placeholder-neutral/60 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-body text-sm font-medium text-neutral"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-white/10 bg-secondary/50 px-4 py-3 font-body text-highlight placeholder-neutral/60 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-body text-sm font-medium text-neutral"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full resize-none rounded-lg border border-white/10 bg-secondary/50 px-4 py-3 font-body text-highlight placeholder-neutral/60 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/30"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <motion.button
                  type="submit"
                  className="mt-2 rounded-full bg-accent py-4 font-body text-sm font-semibold text-primary transition-colors hover:bg-accent/90"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send message
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StorySection } from "@/components/StorySection";
import { CTA } from "@/components/CTA";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { CustomCursor } from "@/components/CustomCursor";
import { InteractiveBackground } from "@/components/InteractiveBackground";
import { useState, useEffect } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, [mounted]);

  return (
    <>
      <InteractiveBackground />
      <CustomCursor />
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <main className="relative z-10 overflow-x-hidden">
        <Navbar />
        <Hero />
        <Features />
        <StorySection />
        <CTA />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

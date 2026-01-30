# LUMEN — Premium Single-Page Site

A high-end, visually stunning single-page website for the fictional premium brand **LUMEN**. Built for the Nexerve assignment to demonstrate design sense, frontend engineering, and premium UI/UX with motion and interactivity.

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** (custom luxury palette, typography, glassmorphism)
- **Framer Motion** (loading screen, scroll-triggered animations, micro-interactions)
- **TypeScript**

## Design

- **Theme:** Luxury tech / premium digital product
- **Palette:** Primary `#0D0D12`, Secondary `#1A1A24`, Accent `#C9A962`, Neutral `#8B8B9A`, Highlight `#F0EBE3`
- **Typography:** Syne (display) + DM Sans (body) via Google Fonts
- **Sections:** Navbar, Hero (About), Features, Visual storytelling, CTA, Contact, Footer
- **Details:** Glass navbar on scroll, loading screen, smooth scroll, hover states, responsive layout

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
# Production build
npm run build

# Start production server
npm start
```

### Deploy to Vercel (recommended)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel will detect Next.js and set build command to `next build` and output to `.next`.
4. Deploy. Your site will be live with a `*.vercel.app` URL.

### Deploy to Netlify

1. Push to GitHub and connect the repo in Netlify.
2. Build command: `npm run build`
3. Publish directory: `.next` (for Next.js static export you’d use `out`; for a standard Next app, use the default and add a Next.js plugin if needed, or use “Next.js on Netlify”).
4. For a standard Next.js app, use **Netlify’s Next.js runtime** so it runs `next build` and `next start` correctly.

## Project Structure

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    Navbar.tsx
    Hero.tsx
    Features.tsx
    StorySection.tsx
    CTA.tsx
    Contact.tsx
    Footer.tsx
    LoadingScreen.tsx
```

## Requirements Checklist

- [x] Next.js
- [x] Tailwind CSS
- [x] Framer Motion
- [x] Navbar / Footer
- [x] Hero section
- [x] Feature / Value proposition section
- [x] Visual storytelling section
- [x] CTA section
- [x] Contact section
- [x] Smooth animations
- [x] Responsive (desktop + mobile)
- [x] Clean, structured code

Design inspired by premium references (Sleep Well Creatives, Euphorixz, Jesko Jets, Vizcom); layout and content are original.

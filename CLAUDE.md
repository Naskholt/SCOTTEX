# Scottex website

Astro 7 + Tailwind 4 + GSAP/ScrollTrigger + Lenis + PhotoSwipe. Static site, deploy on Vercel.

- Always follow DESIGN.md. Look at /reference (if present) before designing anything new.
- One section per component in src/components. Page order is in src/pages/index.astro.
- All motion is in src/scripts/motion.ts. Respect prefers-reduced-motion: no pinning, no smooth scroll.
- Editable facts live in src/data/site.ts (address, price, Cal.com links). Gallery entries in src/data/pants.ts.
- Never invent facts about Benjamin or Scottex. Only show client names in the gallery when `showCredit: true`.
- Photos go in public/images as .webp or .jpg (iPhone .heic must be converted first).
- After any visual change: `npm run build && npm run preview`, then screenshot with playwright-cli at 390 and 1440.

# DESIGN.md — SCOTTEX

## 1. Visual theme & atmosphere
A dark workshop at night. Black space, one lit object, the sound of a sewing machine.
Dark Scandinavian / Norse mythology meets American heritage workwear and craftsmanship.
Mood words: raw, slow, handmade, quiet confidence, ritual.
Density: very low. One idea per screen. Photography leads; interface whispers.
References: Tomas Than (black intro, tiny corner nav), Rick Owens (full-bleed portrait, split nav),
Maison Margiela (film grain, mono labels), Yohji Yamamoto (film loop behind grain),
Ann Demeulemeester (low-key split panels), dustinbrett.com (one playful window-style interaction).

## 2. Colour palette & roles
- Void        #0B0B0A  the ONE background: every section, the footer and the booking test are Void
- Coal        #161614  only for small raised surfaces (e.g. the booking test's pop-up), never a section
- Selvedge    #1C171A  near-black waistband denim; subtle fills only, never a section background
- Raw indigo  #3E4A63  rare secondary surface, never text (from the raw denim of PANT #14)
- Bone        #E8E3D8  primary text and lines on dark
- Ash         #8C877D  secondary text, captions, counters
- Rivet       #B4733A  the ONE accent: active states, booking CTA (copper topstitching / leather patch)
- Thread      #F2F0EA  white embroidery line, used only for the drawn-line motif
Rules: Rivet at most once per screen. No gradients except photo scrims. Dark only, no light mode.

## 3. Typography
- Display: "Archivo" variable at width 125 (expanded), weight 500, uppercase, letter-spacing 0.08em.
- Editorial: "EB Garamond", italic for pull quotes and Benjamin's own words.
- Labels / UI: "IBM Plex Mono", 12px, uppercase, letter-spacing 0.12em. Counters like PANT [ 14 ].
- Body: "EB Garamond" 18px / 1.6 desktop, 17px phones. Max ~62 characters a line.
Fonts are self-hosted via @fontsource (see src/styles/global.css).

## 4. Components
- Nav: fixed, transparent. MENU left, logo centre (fades in after the front fold), BOOK [ → ] right, all Bone. Always visible, always transparent (no background).
- Front fold copy is Benjamin's own ("Stitched to your shape."), never the other group's wording.
- Book: an invitation, centred. Small heading, one Garamond italic line ("Fittings are by appointment, in my studio on Nørrebrogade."), ONE booking button, a mono label (30 min · 250 kr deposit). No step grid on the page; the booking panel walks through find a time → questions (what matters, budget, name, email) → 250 kr refundable deposit.
- Front fold: B/W sewing machine photo (public/images/hero.webp) fading to black, stitched logo centred at ~24% height. Split base: Garamond italic line bottom-left (no label above it) with .btn-rivet 'Start your pair [ → ]' and the address under it; newsletter sign-up (underlined email field) bottom-right, dashed thread running down the centre as scroll cue. Not centred-form style.
- Logo (src/components/Logo.astro): public/images/scottex-logo-white.svg, white line mark. Never redraw it.
- Buttons (.btn): 1px Bone outline, no radius, Plex Mono uppercase, 48px tall. .btn-rivet for booking.
- Chapter marker: "01 — STORY" in Plex Mono, Ash, top-left of each section.
- Plate (src/components/Plate.astro): honest stand-in for a photo not shot yet. Replace, never fake.
- Stitch (src/components/Stitch.astro): the embroidery-line motif, draws itself on scroll.
- Seam (src/components/Seam.astro): a short dashed thread between every section, centred, continuing the front fold's scroll cue. Sections share one Void background and tight spacing so the page reads as one continuous seam.
- Grain: fixed full-screen noise at ~7% opacity.

## 5. Layout
12-column grid, 24px gutters, 6vw outer margin (min 16px). Spacing: 4, 8, 16, 24, 40, 64, 104, 168.
Each chapter at least one viewport tall. Asymmetry welcome.

## 6. Depth
Flat. No shadows. Depth from photography, grain and slow parallax (max ~8%).

## 7. Do's and don'ts
Do: real photos of Benjamin, the machines, fabric, hands, embroidery. Short sentences.
Do: one motion idea per section, slow easing (expo.out / power2), 0.8–1.4s.
Don't: stock photos, icons in circles, emoji, rounded cards, glassmorphism, carousels with dots.
Don't: invent facts about Benjamin. Don't show the price of the jeans (Benjamin's choice); the 250 kr refundable booking deposit is shown in Book. Never hide the booking path.

## 8. Responsive
Breakpoints 390 / 768 / 1024 / 1440. No pinning on phones (Process stacks). Touch targets ≥ 44px.
Reduced motion: no Lenis, no pinning, no parallax, content visible immediately.

## 9. Agent prompt guide
bg #0B0B0A, text #E8E3D8, muted #8C877D, accent #B4733A (once per screen).
Archivo Expanded (display), EB Garamond (body), IBM Plex Mono (labels). When unsure, remove something.


## 10. Photos
Only Benjamin's own photos. Never use images from scottex.netlify.app (another student group's prototype), except process-studio.webp (the Kansai machine), which is cleared.

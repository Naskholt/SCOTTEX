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
- Void        #0B0B0A  page background, intro, most sections
- Coal        #161614  raised surfaces, cards, booking panel
- Selvedge    #1C171A  near-black waistband denim; alternate section background (Process)
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
- Nav: fixed, transparent. MENU left, logo centre (fades in after the front fold), BOOK [ → ] right. Always visible; solid Void background after the first scroll.
- Front fold: from Benjamin's current site. B/W thread photo fading to black, stitched logo at ~22% height, one serif line, a Bone 'Book a fitting' button.
- Logo (src/components/Logo.astro): public/images/scottex-logo-white.svg, white line mark. Never redraw it.
- Buttons (.btn): 1px Bone outline, no radius, Plex Mono uppercase, 48px tall. .btn-rivet for booking.
- Chapter marker: "01 — STORY" in Plex Mono, Ash, top-left of each section.
- Plate (src/components/Plate.astro): honest stand-in for a photo not shot yet. Replace, never fake.
- Stitch (src/components/Stitch.astro): the embroidery-line motif, draws itself on scroll.
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
Don't: invent facts about Benjamin. Don't show prices on the site (Benjamin's choice). Never hide the booking path.

## 8. Responsive
Breakpoints 390 / 768 / 1024 / 1440. No pinning on phones (Process stacks). Touch targets ≥ 44px.
Reduced motion: no Lenis, no pinning, no parallax, content visible immediately.

## 9. Agent prompt guide
bg #0B0B0A, text #E8E3D8, muted #8C877D, accent #B4733A (once per screen).
Archivo Expanded (display), EB Garamond (body), IBM Plex Mono (labels). When unsure, remove something.

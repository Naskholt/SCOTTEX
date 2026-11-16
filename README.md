# SCOTTEX

Website for Scottex, Benjamin's custom jeans label in Nørrebro.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # production build into dist/
```

## Where to change things

| What | File |
| --- | --- |
| Address, hours, price, Instagram, email | `src/data/site.ts` |
| Cal.com booking link (one event) | `src/data/site.ts` → `booking.calLink` |
| Gallery pairs and photos | `src/data/pants.ts` + images in `public/images/` |
| Story text | `src/components/Story.astro` |
| Process steps | `src/components/Process.astro` |
| Colours and fonts | `src/styles/global.css` (tokens from `DESIGN.md`) |
| Animation | `src/scripts/motion.ts` |

## Still to do

- [ ] Real photos: Benjamin at the machine, measuring, CLO 3D screen, fabric rolls, needle and thread (replace the "Photo to come" plates)
- [ ] Photos for the other pairs from the Drive folder (convert HEIC → JPG/WebP)
- [ ] Cal.com: one event "Fitting at the studio" with booking questions (what matters, budget) and a 250 DKK Stripe deposit, then paste the link into `booking.calLink` in `src/data/site.ts`
- [ ] TikTok / email in `src/data/site.ts` (Instagram done)
- [ ] Logo file: save it as `public/images/logo.svg` or `logo.png` (picked up automatically)
- [ ] Ask Benjamin which client names may be shown (`showCredit: true`)
- [ ] Benjamin reads and corrects the Story and Process text
- [ ] Deploy on Vercel

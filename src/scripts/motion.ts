// All motion lives here. Rules (DESIGN.md): slow easing, one idea per section,
// nothing pinned on phones, and everything off when the visitor prefers reduced motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  // Weighted smooth scroll, synced with ScrollTrigger
  const lenis = new Lenis({ lerp: 0.09, anchors: { offset: 0 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.addEventListener('scottex:lock', () => lenis.stop());
  window.addEventListener('scottex:unlock', () => lenis.start());

  // Reveals
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  // Stitch lines draw themselves (dash-offset on the solid mask copy)
  document.querySelectorAll<SVGSVGElement>('[data-stitch]').forEach((svg) => {
    const masks = svg.querySelectorAll<SVGPathElement>('[data-stitch-mask]');
    masks.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    gsap.to(masks, {
      strokeDashoffset: 0, ease: 'none', stagger: 0.15,
      scrollTrigger: { trigger: svg, start: 'top 85%', end: 'bottom 40%', scrub: 1 },
    });
  });

  // Gentle parallax
  gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
    gsap.fromTo(el, { yPercent: 4 }, {
      yPercent: -4, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  const mm = gsap.matchMedia();

  // Intro: wordmark on black, then the curtain lifts onto the hero photo
  mm.add('(min-width: 0px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '.intro', start: 'top top', end: '+=120%', scrub: 0.8, pin: '.intro-pin' },
    });
    tl.to('.intro-hint', { opacity: 0, duration: 0.2 }, 0)
      .to('.intro-mark', { scale: 0.35, opacity: 0, duration: 1, ease: 'power2.in' }, 0)
      .to('.intro-curtain', { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power2.inOut' }, 0.25)
      .fromTo('.intro-media img', { scale: 1.15 }, { scale: 1, duration: 1.25, ease: 'power2.out' }, 0.25)
      .fromTo('.intro-copy', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 }, 0.9);
    gsap.set('.intro-curtain', { clipPath: 'inset(0 0 0% 0)' });
    gsap.set('.nav-mark', { opacity: 0 });
    gsap.to('.nav-mark', { opacity: 1, scrollTrigger: { trigger: '.intro', start: 'top top', end: '+=40%', scrub: true } });
    // Entrance on load
    gsap.from('.intro-mark', { opacity: 0, letterSpacing: '0.3em', duration: 1.8, ease: 'expo.out' });
  });

  // Process: pinned, scrubbed through the steps (desktop only)
  mm.add('(min-width: 768px)', () => {
    const steps = gsap.utils.toArray<HTMLElement>('.process-step');
    const now = document.querySelector('[data-step-now]');
    gsap.set(steps, { autoAlpha: 0 });
    gsap.set(steps[0], { autoAlpha: 1 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.process-pin', start: 'top top', end: `+=${steps.length * 90}%`, scrub: 0.6, pin: true,
        onUpdate: (self) => {
          const i = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
          if (now) now.textContent = String(i + 1);
        },
      },
    });
    tl.to('.process-progress', { scaleX: 1, ease: 'none', duration: steps.length }, 0);
    steps.forEach((s, i) => {
      if (i === 0) return;
      const prev = steps[i - 1];
      tl.to(prev, { autoAlpha: 0, duration: 0.3 }, i - 0.3)
        .fromTo(s, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, i - 0.15)
        .fromTo(s.querySelector('.process-media'), { yPercent: 8, clipPath: 'inset(15% 0 15% 0)' }, { yPercent: 0, clipPath: 'inset(0% 0 0% 0)', duration: 0.6, ease: 'power2.out' }, i - 0.15)
        .fromTo(s.querySelector('.process-text'), { y: 40 }, { y: 0, duration: 0.6, ease: 'power2.out' }, i - 0.1);
    });
    return () => gsap.set(steps, { clearProps: 'all' });
  });
} else {
  document.querySelectorAll<HTMLElement>('[data-step-now]').forEach((n) => n.closest('p')?.remove());
}

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

  // Intro: logo, then the text, fade in on load. The nav logo appears once the big one has scrolled away.
  gsap.to('.intro-logo', { opacity: 1, duration: 1.8, ease: 'expo.out', delay: 0.2 });
  gsap.fromTo('.intro-body > *', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.6 });
  gsap.set('.nav-mark', { opacity: 0 });
  gsap.to('.nav-mark', { opacity: 1, ease: 'none', scrollTrigger: { trigger: '.intro', start: '30% top', end: '60% top', scrub: true } });
}

// Process stepper: picking a step swaps the photo. With motion on, steps advance by themselves
// while the section is in view (a thin bar fills under the active step); a click hands control to the visitor.
{
  const root = document.querySelector<HTMLElement>('[data-process]');
  if (root) {
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-step]'));
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('[data-img]'));
    const now = root.querySelector('[data-proc-now]');
    let active = 0;
    let bar: gsap.core.Tween | null = null;
    let auto = !reduce;
    let inView = false;

    const show = (i: number) => {
      active = i;
      buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
      imgs.forEach((im, j) => im.classList.toggle('is-on', j === i));
      if (now) now.textContent = String(i + 1).padStart(2, '0');
      imgs[(i + 1) % imgs.length].loading = 'eager'; // warm up the next photo
      run();
    };
    const run = () => {
      bar?.kill();
      root.querySelectorAll<HTMLElement>('.proc-bar').forEach((b) => gsap.set(b, { scaleX: 0 }));
      if (!auto || !inView) return;
      bar = gsap.to(buttons[active].querySelector('.proc-bar'), {
        scaleX: 1, duration: 5, ease: 'none', onComplete: () => show((active + 1) % buttons.length),
      });
    };

    buttons.forEach((b, i) => b.addEventListener('click', () => { auto = false; show(i); }));
    if (!reduce) {
      ScrollTrigger.create({ trigger: root, start: 'top 60%', end: 'bottom 40%', onToggle: (self) => { inView = self.isActive; run(); } });
      root.addEventListener('mouseenter', () => bar?.pause());
      root.addEventListener('mouseleave', () => bar?.resume());
    }
  }
}

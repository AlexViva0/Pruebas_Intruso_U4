import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Paso 1: aparece la autorización y el sello pasa de DELITO a PENTEST.
function mode(s, on, { gsap, instant }) {
  const del = s.querySelector('.s-del'), pen = s.querySelector('.s-pen'), nodoc = s.querySelector('.nodoc'), q = instant ? 0 : 0.35;
  gsap.killTweensOf([del, pen, nodoc]);
  if (instant) {
    gsap.set(del, { autoAlpha: on ? 0 : 1, rotationX: 0 }); gsap.set(pen, { autoAlpha: on ? 1 : 0, rotationX: 0 }); gsap.set(nodoc, { autoAlpha: on ? 0 : 1 });
    return;
  }
  if (on) {
    gsap.timeline().to(del, { rotationX: 90, autoAlpha: 0, duration: q, ease: 'power2.in' })
      .fromTo(pen, { rotationX: -90, autoAlpha: 0 }, { rotationX: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.7)' }).to(nodoc, { autoAlpha: 0, duration: 0.2 }, 0);
  } else {
    gsap.timeline().to(pen, { rotationX: -90, autoAlpha: 0, duration: q, ease: 'power2.in' })
      .fromTo(del, { rotationX: 90, autoAlpha: 0 }, { rotationX: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.7)' }).to(nodoc, { autoAlpha: 1, duration: 0.3 }, '>-.2');
  }
}

defineSlide('b1-legal', {
  enter(s, api) { maskTitle(s, api, 0.1); mode(s, api.step >= 1, { gsap: api.gsap, instant: true }); },
  step(s, n, from, api) {
    if (n >= 1 && from < 1) mode(s, true, { gsap: api.gsap, instant: api.instant === true });
    else if (n < 1 && from >= 1) mode(s, false, { gsap: api.gsap, instant: false });
  }
});

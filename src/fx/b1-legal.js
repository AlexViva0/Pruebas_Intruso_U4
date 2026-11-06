import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Paso 1: aparece la autorización y el sello PENTEST cae «de golpe» sobre el de DELITO.
function mode(s, on, { gsap, instant }) {
  const del = s.querySelector('.s-del'), pen = s.querySelector('.s-pen'), nodoc = s.querySelector('.nodoc'), scene = s.querySelector('.scene');
  gsap.killTweensOf([del, pen, nodoc]);
  if (instant) {
    gsap.set(del, { autoAlpha: on ? 0 : 1, scale: 1, rotation: -6 }); gsap.set(pen, { autoAlpha: on ? 1 : 0, scale: 1, rotation: -6 }); gsap.set(nodoc, { autoAlpha: on ? 0 : 1 });
    return;
  }
  if (on) {
    gsap.timeline()
      .to(nodoc, { autoAlpha: 0, duration: 0.2 }, 0)
      .fromTo(pen, { autoAlpha: 0, scale: 2.4, rotation: -22 }, { autoAlpha: 1, scale: 1, rotation: -6, duration: 0.32, ease: 'power4.in' }, 0.35)
      .set(del, { autoAlpha: 0 })
      .fromTo(scene, { x: 0, y: 0 }, { keyframes: [{ x: -7, y: 5, duration: 0.05 }, { x: 6, y: -3, duration: 0.05 }, { x: -3, y: 2, duration: 0.05 }, { x: 0, y: 0, duration: 0.08 }], clearProps: 'transform' })
      .fromTo(pen, { scale: 1 }, { scale: 1.06, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.out' }, '<');
  } else {
    gsap.timeline()
      .to(pen, { autoAlpha: 0, scale: 1.3, rotation: 4, duration: 0.25, ease: 'power2.in' })
      .fromTo(del, { autoAlpha: 0, scale: 0.8, rotation: -6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' })
      .to(nodoc, { autoAlpha: 1, duration: 0.3 }, '>-.2');
  }
}

// Los sombreros se mecen suavemente, cada uno a su ritmo.
function hats(s, { gsap, fx, own }) {
  if (!fx) return;
  s.querySelectorAll('.hat svg').forEach((h, i) => {
    own(gsap.to(h, { rotation: i % 2 ? 6 : -6, y: -4, transformOrigin: '50% 80%', duration: 1.6 + i * 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.3 }));
  });
}

defineSlide('b1-legal', {
  enter(s, api) { maskTitle(s, api, 0.1); mode(s, api.step >= 1, { gsap: api.gsap, instant: true }); hats(s, api); },
  step(s, n, from, api) {
    if (n >= 1 && from < 1) mode(s, true, { gsap: api.gsap, instant: api.instant === true });
    else if (n < 1 && from >= 1) mode(s, false, { gsap: api.gsap, instant: false });
  }
});

import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Herramientas que orbitan el núcleo; las 3 con nombre aparecen en el paso 1.
function orbit(s, { gsap, fx, own }) {
  const els = [...s.querySelectorAll('.kbubbles [data-r]')];
  const place = t => els.forEach(e => {
    const a = ((+e.dataset.a + +e.dataset.v * t) * Math.PI) / 180, r = +e.dataset.r;
    const x = (r * Math.cos(a)).toFixed(1), y = (r * Math.sin(a)).toFixed(1);
    if (e.tagName === 'circle') { e.setAttribute('cx', x); e.setAttribute('cy', y); } else e.setAttribute('transform', `translate(${x} ${y})`);
  });
  place(0);
  if (!fx) return;
  const o = { t: 0 }; own(gsap.to(o, { t: 600, duration: 600, ease: 'none', onUpdate: () => place(o.t) }));
  own(gsap.to(s.querySelector('.kcore'), { scale: 1.04, svgOrigin: '424 314', duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
}

function named(s, on, { gsap, fx, instant }) {
  const els = s.querySelectorAll('.kn');
  gsap.killTweensOf(els);
  if (instant || !fx) { gsap.set(els, { autoAlpha: on ? 1 : 0 }); return; }
  if (on) gsap.fromTo(els, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, stagger: 0.18, ease: 'power2.out' });
  else gsap.to(els, { autoAlpha: 0, duration: 0.25 });
}

defineSlide('b2-kali', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    orbit(s, api);
    named(s, api.step >= 1, { gsap: api.gsap, fx: api.fx, instant: true });
  },
  step(s, n, from, api) {
    if (n >= 1 && from < 1) named(s, true, { gsap: api.gsap, fx: api.fx, instant: api.instant === true });
    else if (n < 1 && from >= 1) named(s, false, { gsap: api.gsap, fx: api.fx, instant: false });
  }
});

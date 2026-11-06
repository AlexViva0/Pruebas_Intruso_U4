import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Herramientas que orbitan el núcleo; las 3 con nombre «salen disparadas» del núcleo en el paso 1.
// e._k (0…1) escala el radio de órbita: así las con nombre nacen en el centro y se abren hasta su anillo.
function orbit(s, { gsap, fx, animate, own }) {
  const els = [...s.querySelectorAll('.kbubbles [data-r]')];
  els.forEach(e => { e._k = 1; });
  const place = t => els.forEach(e => {
    const a = ((+e.dataset.a + +e.dataset.v * t) * Math.PI) / 180, r = +e.dataset.r * (e._k ?? 1);
    const x = (r * Math.cos(a)).toFixed(1), y = (r * Math.sin(a)).toFixed(1);
    if (e.tagName === 'circle') { e.setAttribute('cx', x); e.setAttribute('cy', y); } else e.setAttribute('transform', `translate(${x} ${y})`);
  });
  s._kPlace = () => place(s._kT || 0);
  place(0);
  if (!fx) return;
  // las burbujas pequeñas entran desde el núcleo, una tras otra
  if (animate) {
    const small = els.filter(e => e.tagName === 'circle');
    small.forEach(e => { e._k = 0; });
    own(gsap.to(small, { _k: 1, duration: 1.1, ease: 'expo.out', stagger: { each: 0.025, from: 'random' }, delay: 0.5 }));
  }
  const o = { t: 0 }; own(gsap.to(o, { t: 600, duration: 600, ease: 'none', onUpdate: () => { s._kT = o.t; place(o.t); } }));
  own(gsap.to(s.querySelector('.kcore'), { scale: 1.04, svgOrigin: '424 314', duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
}

function named(s, on, { gsap, fx, instant }) {
  const els = [...s.querySelectorAll('.kn')], inner = s.querySelectorAll('.kni'), shock = s.querySelector('.kshock');
  gsap.killTweensOf([...els, ...inner, shock]);
  if (instant || !fx) { els.forEach(e => { e._k = 1; }); gsap.set(els, { autoAlpha: on ? 1 : 0 }); gsap.set(inner, { scale: 1, svgOrigin: '0 0' }); s._kPlace && s._kPlace(); return; }
  if (on) {
    gsap.set(els, { autoAlpha: 1 });
    els.forEach(e => { e._k = 0; });
    gsap.to(els, { _k: 1, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.16 });
    gsap.fromTo(inner, { scale: 0.2, svgOrigin: '0 0' }, { scale: 1, duration: 0.9, ease: 'elastic.out(1,.55)', stagger: 0.16 });
    gsap.fromTo(shock, { scale: 1, autoAlpha: 1, svgOrigin: '424 314' }, { scale: 2.1, autoAlpha: 0, duration: 0.8, ease: 'power2.out' });
  } else gsap.to(els, { autoAlpha: 0, duration: 0.25 });
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

import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// La petición viaja navegador → servidor. Paso 0: pasa de largo · 1: se detiene en Burp (interceptada) ·
// 2: ahí mismo se modifica un campo · 3: igual, y el mapa de la aplicación enseña un nodo oculto.
const X0 = 400, XB = 660, X1 = 1296, Y = 165;

function loop(s, n, { gsap, fx, own }) {
  const env = s.querySelector('.env'), fld = s.querySelector('.fld'), ti = s.querySelector('.tag-int'), tm = s.querySelector('.tag-mod'), burp = s.querySelector('.bz-p rect');
  gsap.killTweensOf([env, fld, ti, tm, burp]);
  gsap.set([ti, tm], { autoAlpha: 0 }); gsap.set(fld, { fill: '#4a6ce7' }); gsap.set(burp, { stroke: '#1a2352' });
  if (!fx) { gsap.set(env, { x: n ? XB : X0, y: Y }); if (n >= 1) gsap.set(n >= 2 ? tm : ti, { autoAlpha: 1 }); if (n >= 2) gsap.set(fld, { fill: '#ffd54a' }); return; }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
  tl.set(env, { x: X0, y: Y, autoAlpha: 1 });
  if (n === 0) tl.to(env, { x: X1, duration: 3.2, ease: 'none' }).to(env, { autoAlpha: 0, duration: 0.2 });
  else {
    tl.to(env, { x: XB, duration: 1.3, ease: 'power2.out' })
      .to(burp, { stroke: '#ffd54a', duration: 0.2 }, '<1.0')
      .to(ti, { autoAlpha: 1, duration: 0.3 }, '<');
    if (n >= 2) tl.to(ti, { autoAlpha: 0, duration: 0.15 }, '+=.5').to(tm, { autoAlpha: 1, duration: 0.2 }, '<').to(fld, { fill: '#ffd54a', duration: 0.3 }, '<').to(env, { y: Y - 10, duration: 0.15, yoyo: true, repeat: 3 }, '<');
    tl.to({}, { duration: 1.1 }).to([ti, tm], { autoAlpha: 0, duration: 0.2 }).to(burp, { stroke: '#1a2352', duration: 0.2 }, '<').to(env, { x: X1, duration: 1.3, ease: 'power2.in' }).to(env, { autoAlpha: 0, duration: 0.2 });
  }
  own(tl);
}

function smap(s, on, { gsap, fx, instant }) {
  const hid = s.querySelector('.sm3');
  if (!hid) return;
  gsap.killTweensOf(hid);
  if (instant || !fx) { hid.classList.toggle('found', on); return; }
  hid.classList.toggle('found', on);
  if (on) gsap.fromTo(hid, { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', delay: 0.4 });
}

defineSlide('b2-burp', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    loop(s, api.step, api);
    smap(s, api.step >= 3, { gsap: api.gsap, fx: api.fx, instant: true });
  },
  step(s, n, from, api) {
    loop(s, n, api);
    smap(s, n >= 3, { gsap: api.gsap, fx: api.fx, instant: api.instant === true });
  }
});

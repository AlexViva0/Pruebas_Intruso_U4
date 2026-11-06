import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// n=0 sin captura · 1 los paquetes van llegando · 2 filtro «http» · 3 sin filtro y con las tres señales marcadas.
function paint(s, n, { gsap, fx, instant, from = 0 }) {
  const rows = [...s.querySelectorAll('.wr')], quick = instant || !fx, ft = s.querySelector('.ws-ft');
  // la entrada escalonada vive en una línea de tiempo propia: se cancela entera si se avanza antes de que termine
  if (s._wsTl) { s._wsTl.kill(); s._wsTl = null; }
  gsap.killTweensOf(rows);
  const tl = gsap.timeline(); s._wsTl = tl;
  rows.forEach((r, i) => {
    const on = n >= 1, dim = n === 2 && r.dataset.p !== 'HTTP';
    r.classList.toggle('show-flag', n >= 3 && r.classList.contains('flag'));
    if (quick) { gsap.set(r, { autoAlpha: on ? (dim ? 0.25 : 1) : 0, y: 0 }); return; }
    if (on && from < 1) tl.fromTo(r, { autoAlpha: 0, y: 18 }, { autoAlpha: dim ? 0.25 : 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0.2 + i * 0.2);
    else gsap.to(r, { autoAlpha: on ? (dim ? 0.25 : 1) : 0, y: 0, duration: 0.3 });
  });
  const text = n === 2 ? 'http' : '';
  gsap.killTweensOf(ft);
  if (quick || !text) { ft.textContent = text; return; }
  const o = { n: 0 }; gsap.to(o, { n: text.length, duration: 0.5, ease: 'none', onUpdate: () => { ft.textContent = text.slice(0, Math.round(o.n)); } });
}

defineSlide('b2-wireshark', {
  enter(s, api) { maskTitle(s, api, 0.1); paint(s, api.step, { gsap: api.gsap, fx: api.fx, instant: true }); },
  step(s, n, from, api) { paint(s, n, { gsap: api.gsap, fx: api.fx, instant: api.instant === true, from }); }
});

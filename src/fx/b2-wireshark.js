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
  // paquetes que llegan: un destello amarillo que se apaga
  if (!quick && n >= 1 && from < 1) rows.forEach((r, i) => tl.fromTo(r, { backgroundColor: '#ffe680' }, { backgroundColor: 'rgba(255,230,128,0)', duration: 0.9, ease: 'power2.out', clearProps: 'backgroundColor' }, 0.2 + i * 0.2));
  // señales: las etiquetas caen como sellos y la fila parpadea
  const flags = rows.filter(r => r.classList.contains('flag')), badges = flags.map(r => r.querySelector('em'));
  gsap.killTweensOf(badges);
  if (!quick && n >= 3 && from < 3) {
    gsap.fromTo(badges, { scale: 2.2, rotation: -12 }, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.3, delay: 0.15 });
    flags.forEach((r, i) => gsap.fromTo(r, { x: 0 }, { keyframes: [{ x: -6, duration: 0.05 }, { x: 6, duration: 0.05 }, { x: -3, duration: 0.05 }, { x: 0, duration: 0.06 }], delay: 0.3 + i * 0.3 }));
  } else gsap.set(badges, { scale: 1, rotation: 0 });
  const text = n === 2 ? 'http' : '';
  gsap.killTweensOf(ft);
  if (s._ftT) { s._ftT.kill(); s._ftT = null; }
  if (quick || !text) { ft.textContent = text; return; }
  const o = { n: 0 }; s._ftT = gsap.to(o, { n: text.length, duration: 0.5, ease: 'none', onUpdate: () => { ft.textContent = text.slice(0, Math.round(o.n)); } });
}

defineSlide('b2-wireshark', {
  enter(s, api) { maskTitle(s, api, 0.1); paint(s, api.step, { gsap: api.gsap, fx: api.fx, instant: true }); },
  step(s, n, from, api) { paint(s, n, { gsap: api.gsap, fx: api.fx, instant: api.instant === true, from }); }
});

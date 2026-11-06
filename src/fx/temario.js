import { defineSlide } from '../engine.js';
import { playScan } from '../art.js';
import { maskTitle } from './util.js';

// Paso 0: ruta completa · pasos 1–3: se enfoca una clase y se atenúan las demás.
const INFO = [
  ['3 clases · 2 h', '~35 min de exposición por clase'],
  ['CLASE 1', 'Bloques 1 y 2 · fundamentos y herramientas'],
  ['CLASE 2', 'Bloques 3 y 4 · SET y escáneres'],
  ['CLASE 3', 'Bloque 5 · síntesis y quiz final']
];

defineSlide('temario', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    playScan(s.querySelector('.art svg'), { ...api, delay: api.delay + 0.3 });
    paint(s, 0, { ...api, instant: true });
  },
  step(s, n, from, api) { paint(s, n, api); }
});

function paint(s, n, { gsap, instant, animate }) {
  const rows = s.querySelectorAll('.row'), big = s.querySelector('.ci-big'), small = s.querySelector('.ci-small');
  const quick = instant || animate === false;
  rows.forEach(r => {
    const on = n === 0 || +r.dataset.clase === n, dim = n !== 0 && !on;
    const vars = { opacity: dim ? 0.5 : 1, x: on && n !== 0 ? -22 : 0, '--sh': (dim ? 3 : on && n !== 0 ? 16 : 10) + 'px', duration: quick ? 0 : 0.45, ease: 'power3.out', overwrite: 'auto' };
    gsap.to(r, vars);
  });
  if (big) {
    const [a, b] = INFO[n];
    if (quick) { big.textContent = a; small.textContent = b; }
    else gsap.timeline().to([big, small], { y: -14, autoAlpha: 0, duration: 0.15 }).add(() => { big.textContent = a; small.textContent = b; }).fromTo([big, small], { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out' });
  }
}

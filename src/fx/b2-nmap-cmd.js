import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Pinta el comando con los parámetros resaltados: «-p», «-sV», «--script»…
const paint = full => '<i>$</i> ' + full.replace(/(\s)(--?[\w-]+)/g, '$1<b>$2</b>');

function show(row, { gsap, fx, instant }) {
  const box = row.querySelector('.cmd'), full = row.dataset.full;
  gsap.killTweensOf(box);
  if (instant || !fx) { box.innerHTML = paint(full); return; }
  const o = { n: 0 };
  gsap.to(o, { n: full.length, duration: Math.min(1.3, 0.35 + full.length * 0.03), ease: 'none', delay: 0.15, onUpdate: () => { box.textContent = '$ ' + full.slice(0, Math.round(o.n)); }, onComplete: () => { box.innerHTML = paint(full); } });
}

defineSlide('b2-nmap-cmd', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    s.querySelectorAll('.cmdrow').forEach(r => { if (+r.dataset.step <= api.step) show(r, { gsap: api.gsap, fx: api.fx, instant: true }); else r.querySelector('.cmd').textContent = ''; });
  },
  step(s, n, from, api) {
    const row = s.querySelector(`.cmdrow[data-step="${n}"]`);
    if (n > from && row) show(row, { gsap: api.gsap, fx: api.fx, instant: api.instant === true });
    else if (n < from) { const old = s.querySelector(`.cmdrow[data-step="${from}"]`); if (old) old.querySelector('.cmd').textContent = ''; }
    if (api.instant === true) s.querySelectorAll('.cmdrow').forEach(r => { if (+r.dataset.step <= n) show(r, { gsap: api.gsap, fx: false, instant: true }); });
  }
});

import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Ejemplo ilustrativo: los puertos reales dependen de cada equipo.
const BLOCKS = {
  2: { cmd: 'nmap 127.0.0.1', out: ['<span class="n">PORT      STATE  SERVICE</span>', '<span class="o">…/tcp    open   …</span>', '<span class="n">(los puertos abiertos dependen de tu equipo)</span>'] },
  3: { cmd: 'nmap -sV 127.0.0.1', out: ['<span class="n">PORT      STATE  SERVICE  VERSION</span>', '<span class="o">…/tcp    open   …        …</span>', '<span class="n">(la columna VERSION es lo nuevo)</span>'] }
};
const hl = full => '<span class="c">$</span> ' + full.replace(/(\s)(-[\w]+)/g, '$1<b class="y">$2</b>');

function show(s, n, { gsap, fx, instant }) {
  const b = BLOCKS[n], box = s.querySelector(`.tb${n}`); if (!b || !box) return;
  const c1 = box.querySelector('.c1'), o1 = box.querySelector('.o1');
  gsap.killTweensOf([c1, o1]);
  const done = () => { c1.innerHTML = hl(b.cmd); o1.innerHTML = b.out.join('<br>'); };
  if (instant || !fx) { done(); return; }
  o1.innerHTML = '';
  const o = { n: 0 };
  gsap.to(o, { n: b.cmd.length, duration: 0.2 + b.cmd.length * 0.04, ease: 'none', delay: 0.2, onUpdate: () => { c1.textContent = '$ ' + b.cmd.slice(0, Math.round(o.n)); }, onComplete: () => { c1.innerHTML = hl(b.cmd); o1.innerHTML = b.out.join('<br>'); gsap.fromTo(o1, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }); } });
}
function clear(s, n) { const box = s.querySelector(`.tb${n}`); if (box) { box.querySelector('.c1').textContent = ''; box.querySelector('.o1').textContent = ''; } }

defineSlide('a3', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    [2, 3].forEach(n => { clear(s, n); if (api.step >= n) show(s, n, { gsap: api.gsap, fx: api.fx, instant: true }); });
    if (api.fx) api.own(api.gsap.to(s.querySelector('.ws-c2'), { autoAlpha: 0, duration: 0.5, ease: 'steps(1)', repeat: -1, yoyo: true }));
  },
  step(s, n, from, api) {
    if (api.instant === true) { [2, 3].forEach(k => { clear(s, k); if (n >= k) show(s, k, { gsap: api.gsap, fx: false, instant: true }); }); return; }
    if (n > from && BLOCKS[n]) show(s, n, { gsap: api.gsap, fx: api.fx, instant: false });
    else if (n < from) clear(s, from);
  }
});

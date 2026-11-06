import gsap from 'gsap';
import { defineSlide, PI } from '../engine.js';
import { maskTitle, flipMove } from './util.js';
import { PHASES } from './phases.js';

const SHUFFLED = [3, 5, 1, 4, 2]; // orden inicial desordenado (números de fase)
const S = 'fill="none" stroke="#1a2352" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"';
const ICON = {
  1: `<svg class="ph-ico" viewBox="0 0 80 80" ${S}><circle cx="34" cy="34" r="20" fill="#dfe4fb"/><line x1="49" y1="49" x2="68" y2="68" stroke-width="9"/></svg>`,
  2: `<svg class="ph-ico" viewBox="0 0 80 80" ${S}><circle cx="40" cy="40" r="30" fill="#dfe4fb"/><circle cx="40" cy="40" r="16"/><path d="M40 40 L58 22" stroke="#4a6ce7" stroke-width="7"/><circle cx="58" cy="54" r="4" fill="#ffd54a"/></svg>`,
  3: `<svg class="ph-ico" viewBox="0 0 80 80" ${S}><circle cx="22" cy="40" r="12" fill="#ffd54a"/><path d="M34 40 H70 M58 40 V52 M66 40 V48"/></svg>`,
  4: `<svg class="ph-ico" viewBox="0 0 80 80" ${S}><path d="M12 64 H28 V48 H44 V32 H60 V16"/><path d="M52 22 L60 14 L68 22"/></svg>`,
  5: `<svg class="ph-ico" viewBox="0 0 80 80" ${S}><rect x="20" y="10" width="42" height="58" fill="#dfe4fb"/><path d="M30 28 H52 M30 40 H52 M30 52 H44"/></svg>`
};

function build(s) {
  const row = s.querySelector('.row5');
  row.innerHTML = SHUFFLED.map(n => {
    const p = PHASES[n - 1];
    return `<div class="card ph" data-n="${n}" data-anim="pop"><div class="ph-num mono">?</div><div class="ph-name">${p.name}</div>${ICON[n]}<div class="ph-e"><span class="mono">OBJETIVO</span>${p.e}</div></div>`;
  }).join('');
  const cards = () => [...row.querySelectorAll('.ph')];
  let sel = null, locked = false, calls = [];
  row.addEventListener('click', e => {
    const c = e.target.closest('.ph'); if (!c || locked) return;
    if (!sel) { sel = c; c.classList.add('sel'); return; }
    if (sel === c) { c.classList.remove('sel'); sel = null; return; }
    const a = sel, b = c; a.classList.remove('sel'); sel = null;
    flipMove(cards(), () => { const na = a.nextSibling === b ? a : a.nextSibling; row.insertBefore(a, b); row.insertBefore(b, na); });
  });
  const mark = (c, i) => { c.classList.remove('ok', 'bad'); c.classList.add(+c.dataset.n === i + 1 ? 'ok' : 'bad'); c.querySelector('.ph-num').textContent = i + 1; };
  const status = (t) => { s.querySelector('.hint-t').textContent = t; };
  return {
    reveal(instant) {
      if (locked) return; locked = true; sel && sel.classList.remove('sel'); sel = null;
      const right = cards().filter((c, i) => +c.dataset.n === i + 1).length;
      cards().forEach((c, i) => { c.querySelector('.ph-num').textContent = i + 1; });
      s.classList.add('revealed');
      if (instant || !PI.fx) {
        flipMove(cards(), () => { cards().sort((x, y) => x.dataset.n - y.dataset.n).forEach(c => row.appendChild(c)); }, { animate: false });
        cards().forEach((c, i) => { mark(c, i); }); status('Orden correcto de un pentest: de la información al informe.'); return;
      }
      cards().forEach(mark);
      status(right === 5 ? '¡Orden perfecto!' : `Acertaron ${right} de 5 posiciones. Observen cómo se acomodan…`);
      calls.push(gsap.delayedCall(1.6, () => {
        flipMove(cards(), () => { cards().sort((x, y) => x.dataset.n - y.dataset.n).forEach(c => row.appendChild(c)); }, { duration: 0.8 });
        cards().forEach((c, i) => { c.classList.remove('bad'); c.classList.add('ok'); c.querySelector('.ph-num').textContent = c.dataset.n; });
        status('Orden correcto de un pentest: de la información al informe.');
      }));
    },
    unreveal() {
      if (!locked) return; calls.forEach(c => c.kill()); calls = []; locked = false; s.classList.remove('revealed');
      cards().forEach((c, i) => { c.classList.remove('ok', 'bad'); c.querySelector('.ph-num').textContent = '?'; });
      status('Aún no lo has verificado. Cuando el grupo termine, pulsa → para ver el orden correcto y el objetivo de cada fase.');
    }
  };
}

defineSlide('a2', {
  enter(s, api) { maskTitle(s, api, 0.1); if (!s._a2) { s._a2 = build(s); } },
  step(s, n, from, api) {
    if (!s._a2) s._a2 = build(s);
    if (n >= 1 && from < 1) s._a2.reveal(api.instant === true); else if (n < 1 && from >= 1) s._a2.unreveal();
  }
});

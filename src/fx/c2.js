import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';
import { makeSorter } from './dnd.js';

// Bucles decorativos: [data-bob="amp,dur"] sube y baja · [data-swing="grados,dur"] péndulo · [data-spin="dur"] gira ·
// [data-pulse="escala,dur"] late · [data-dash="n"] desplaza el trazo discontinuo · [data-needle] aguja de CVSS.
function loops(s, { gsap, fx, own }) {
  if (!fx) return;
  const num = (e, k) => (e.getAttribute(k) || '').split(',').map(Number);
  s.querySelectorAll('[data-bob]').forEach((e, i) => { const [a, d] = num(e, 'data-bob'); own(gsap.to(e, { y: -a, duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.15 })); });
  s.querySelectorAll('[data-swing]').forEach(e => { const [a, d] = num(e, 'data-swing'); gsap.set(e, { rotation: -a }); own(gsap.to(e, { rotation: a, duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1 })); });
  s.querySelectorAll('[data-spin]').forEach(e => { const [d] = num(e, 'data-spin'); own(gsap.to(e, { rotation: 360, duration: d, ease: 'none', repeat: -1 })); });
  s.querySelectorAll('[data-pulse]').forEach(e => { const [k, d] = num(e, 'data-pulse'); own(gsap.to(e, { scale: k, duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1 })); });
  s.querySelectorAll('[data-dash]').forEach(e => { const [n] = num(e, 'data-dash'); own(gsap.to(e, { strokeDashoffset: -n, duration: 1.2, ease: 'none', repeat: -1 })); });
  s.querySelectorAll('[data-needle]').forEach(e => { gsap.set(e, { rotation: -80, svgOrigin: '324 285' }); own(gsap.to(e, { rotation: 80, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, svgOrigin: '324 285' })); });
}
const info = api => s => { maskTitle(s, api, 0.1); loops(s, api); };
['set1', 'set2', 'set3', 'set4', 'esc1', 'esc2', 'esc3', 'esc4', 'esc5', 'esc6', 'esc7'].forEach(id => defineSlide(id, { enter(s, api) { info(api)(s); } }));

// --- sorters (A5, A8)
const sorter = (id, order) => defineSlide(id, {
  enter(s, api) { maskTitle(s, api, 0.1); if (!s._sorter) s._sorter = makeSorter(s, { order }); },
  step(s, n, from, api) {
    if (!s._sorter) s._sorter = makeSorter(s, { order });
    if (n >= 1 && from < 1) s._sorter.reveal({ instant: api.instant === true });
    else if (n < 1 && from >= 1) s._sorter.unreveal();
  }
});
sorter('a5', ['tray', 'phish', 'legit']);
sorter('a8', ['tray', 'nessus', 'openvas', 'zap', 'nikto']);

// --- A6 detective del correo
defineSlide('a6', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    if (s._a6) return;
    const found = new Set(), hp = s.querySelector('.hp');
    const mark = (n, quiet) => {
      found.add(n); hp.textContent = found.size;
      s.querySelectorAll(`.flag[data-n="${n}"],.sg[data-n="${n}"]`).forEach(e => e.classList.add('on'));
      const sg = s.querySelector(`.sg[data-n="${n}"]`);
      if (!quiet && api.fx) api.gsap.fromTo(sg, { x: -14 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,.5)' });
    };
    s.querySelectorAll('.flag').forEach(f => f.addEventListener('click', e => { e.stopPropagation(); mark(+f.dataset.n); }));
    s._a6 = { found, mark, hp };
  },
  step(s, n, from, api) {
    const m = s._a6; if (!m) return;
    if (n >= 1 && from < 1) {
      m.saved = new Set(m.found);
      [1, 2, 3, 4, 5].forEach((k, i) => { if (!m.found.has(k)) { s.querySelectorAll(`.flag[data-n="${k}"],.sg[data-n="${k}"]`).forEach(e => e.classList.add('miss')); api.gsap.delayedCall(api.instant === true ? 0 : i * 0.25, () => m.mark(k, true)); } });
    } else if (n < 1 && from >= 1) {
      s.querySelectorAll('.flag,.sg').forEach(e => e.classList.remove('on', 'miss'));
      m.found.clear(); (m.saved || []).forEach(k => m.mark(k, true)); if (!m.saved || !m.saved.size) m.hp.textContent = 0;
    }
  }
});

// --- A7 pasos previos: marcar los correctos
defineSlide('a7', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    if (s._a7) return; s._a7 = true;
    s.querySelectorAll('.opt').forEach(o => o.addEventListener('click', e => { e.stopPropagation(); if (s.classList.contains('revd')) return; o.classList.toggle('sel'); if (api.fx) api.gsap.fromTo(o, { scale: 0.97 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }); }));
  },
  step(s, n, from, api) {
    const opts = [...s.querySelectorAll('.opt')];
    if (n >= 1 && from < 1) {
      s.classList.add('revd');
      opts.forEach(o => { const ok = o.dataset.ok === '1', sel = o.classList.contains('sel'); o.classList.add(ok ? 'ok' : 'no'); o.querySelector('.ov').textContent = ok ? (sel ? '✓ Correcto' : '✓ Faltó marcarlo') : (sel ? '✗ No es un paso previo' : '✗ Práctica indebida'); });
      if (api.fx && api.instant !== true) api.gsap.fromTo(opts, { y: 0 }, { keyframes: [{ y: -10, duration: 0.16 }, { y: 0, duration: 0.4, ease: 'bounce.out' }], stagger: 0.07 });
    } else if (n < 1 && from >= 1) { s.classList.remove('revd'); opts.forEach(o => { o.classList.remove('ok', 'no'); o.querySelector('.ov').textContent = ''; }); }
  }
});

// --- A9 ¿Quién lo encontró?
const TOOLS = ['Nmap', 'Wireshark', 'Burp Suite', 'OWASP ZAP', 'Nikto', 'SET'];
defineSlide('a9', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    if (s._a9) return; s._a9 = true;
    s.querySelectorAll('.fb').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation(); if (s.classList.contains('revd')) return;
      const v = (+b.dataset.v + 1) % TOOLS.length; b.dataset.v = v; b.querySelector('span').textContent = TOOLS[v]; b.classList.add('has');
      if (api.fx) api.gsap.fromTo(b, { scale: 0.94 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
    }));
  },
  step(s, n, from, api) {
    const rows = [...s.querySelectorAll('.fr')];
    if (n >= 1 && from < 1) {
      s.classList.add('revd');
      rows.forEach(r => { const b = r.querySelector('.fb'), pick = TOOLS[+b.dataset.v], ok = r.dataset.ok === pick; r.classList.add(ok ? 'ok' : 'no'); r.querySelector('.fv').textContent = ok ? '✓ ' + r.dataset.ok : '✗ Era: ' + r.dataset.ok; });
    } else if (n < 1 && from >= 1) { s.classList.remove('revd'); rows.forEach(r => { r.classList.remove('ok', 'no'); r.querySelector('.fv').textContent = ''; }); }
  }
});

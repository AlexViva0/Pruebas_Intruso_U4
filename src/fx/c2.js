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
['set1', 'set2', 'set3', 'set4', 'esc1', 'esc2', 'esc3', 'esc4', 'esc5', 'esc6', 'esc7', 'c3'].forEach(id => defineSlide(id, { enter(s, api) { info(api)(s); } }));

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
sorter('a11', ['tray', 'z1', 'z2', 'z3', 'z4', 'z5']);
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

['t1', 't2', 'ref', 'cierre'].forEach(id => defineSlide(id, { enter(s, api) { maskTitle(s, api, 0.1); } }));

// --- A12 ruleta de preguntas de validación
defineSlide('a12', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    if (s._a12) return;
    const { gsap } = api, wheel = s.querySelector('.wheel'), qs = [...s.querySelectorAll('.rq')], btn = s.querySelector('.rbtn'), rn = s.querySelector('.rn'), ans = s.querySelector('.ra p');
    const N = 7, seg = 360 / N, st = { used: new Set(), rot: 0, cur: -1, busy: false };
    const show = i => { qs.forEach(q => q.classList.toggle('on', i === -1 ? q.classList.contains('rq0') : +q.dataset.i === i && !q.classList.contains('rq0'))); rn.textContent = i < 0 ? '–' : i + 1; ans.textContent = ''; s.querySelector('.ra').classList.remove('open'); };
    const showAns = on => { s.querySelector('.ra').classList.toggle('open', on); ans.textContent = on && st.cur >= 0 ? qs[st.cur].dataset.a : ''; };
    const dim = () => s.querySelectorAll('.sg7').forEach(g => g.style.opacity = st.used.has(+g.dataset.i) ? 0.3 : 1);
    btn.addEventListener('click', e => {
      e.stopPropagation(); if (st.busy) return;
      if (st.used.size === N) { st.used.clear(); st.cur = -1; show(-1); dim(); btn.textContent = 'GIRAR'; return; }
      const free = [...Array(N).keys()].filter(i => !st.used.has(i)), i = free[Math.floor(Math.random() * free.length)];
      st.busy = true; show(-1); st.cur = -1;
      const target = st.rot + 360 * 4 + ((360 - (i + 0.5) * seg - (st.rot % 360)) % 360 + 360) % 360;
      const done = () => { st.rot = target; st.used.add(i); st.cur = i; st.busy = false; show(i); dim(); btn.textContent = st.used.size === N ? 'REINICIAR' : 'GIRAR OTRA'; };
      if (api.fx) gsap.to(wheel, { rotation: target, duration: 4, ease: 'power4.out', transformOrigin: '330px 330px', onComplete: done }); else { gsap.set(wheel, { rotation: target }); done(); }
    });
    s._a12 = { showAns, st };
  },
  step(s, n) { const m = s._a12; if (m) m.showAns(n >= 1); }
});

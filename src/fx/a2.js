import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Memorama: 10 cartas, 5 pares herramienta ↔ categoría (tabla 5.2).
function setup(s, { gsap, fx }) {
  if (s._mm) return s._mm;
  const cards = [...s.querySelectorAll('.mc')], hp = s.querySelector('.hp'), hi = s.querySelector('.hi');
  const st = { open: [], pairs: 0, tries: 0, lock: false, calls: [] };
  const flip = (c, up, d = 0.5) => gsap.to(c.querySelector('.mi'), { rotationY: up ? 180 : 0, duration: (fx ? d : 0), ease: 'power3.inOut' });
  const hud = () => { hp.textContent = st.pairs; hi.textContent = st.tries; };
  const reset = () => {
    st.calls.forEach(x => x.kill()); st.calls = []; st.open = []; st.pairs = 0; st.tries = 0; st.lock = false;
    cards.forEach(c => { c.classList.remove('done'); gsap.killTweensOf(c.querySelector('.mi')); gsap.set(c.querySelector('.mi'), { rotationY: 0 }); gsap.set(c, { scale: 1 }); });
    hud();
  };
  cards.forEach(c => c.addEventListener('click', e => {
    e.stopPropagation();
    if (st.lock || st.revealed || c.classList.contains('done') || st.open.includes(c)) return;
    flip(c, true); st.open.push(c);
    if (st.open.length < 2) return;
    st.tries++; const [a, b] = st.open; st.lock = true;
    if (a.dataset.p === b.dataset.p) {
      st.calls.push(gsap.delayedCall(fx ? 0.6 : 0, () => {
        a.classList.add('done'); b.classList.add('done'); st.pairs++; st.open = []; st.lock = false; hud();
        if (fx) gsap.fromTo([a, b], { scale: 1 }, { scale: 1.07, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' });
      }));
    } else {
      st.calls.push(gsap.delayedCall(fx ? 1.1 : 0.2, () => { flip(a, false); flip(b, false); st.open = []; st.lock = false; }));
    }
    hud();
  }));
  s._mm = { st, cards, flip, reset, hud };
  return s._mm;
}

defineSlide('a2', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    const m = setup(s, api); m.reset(); m.st.revealed = false;
    if (api.animate && api.fx) api.own(api.gsap.from(m.cards, { y: 40, autoAlpha: 0, scale: 0.8, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.05, delay: api.delay + 0.3 }));
    if (api.step >= 1) { m.st.revealed = true; m.cards.forEach(c => m.flip(c, true, 0)); }
  },
  step(s, n, from, api) {
    const m = setup(s, api);
    if (n >= 1 && from < 1) { m.st.revealed = true; m.st.calls.forEach(x => x.kill()); m.st.calls = []; m.cards.forEach((c, i) => api.gsap.delayedCall(api.instant === true ? 0 : i * 0.06, () => m.flip(c, true, api.instant === true ? 0 : 0.5))); }
    else if (n < 1 && from >= 1) { m.st.revealed = false; m.reset(); }
  }
});

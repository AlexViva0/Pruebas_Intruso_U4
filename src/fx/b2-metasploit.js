import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

const KEYS = ['', 'db', 'console', 'aux'];
const VERBS = ['buscar', 'seleccionar', 'configurar'];

function play(card, { gsap, fx, own }) {
  const k = card.dataset.k;
  if (k === 'db') {
    const stack = card.querySelector('.stack'), ex = [...card.querySelectorAll('.ex circle')];
    if (!fx) return;
    own(gsap.to(stack, { y: -6, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    // los exploits «caen» a la base de datos, uno tras otro
    ex.forEach((c, i) => own(gsap.timeline({ repeat: -1, repeatDelay: 1.2, delay: i * 0.35 }).fromTo(c, { y: -80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'bounce.out' })));
  }
  if (k === 'console') {
    const t = card.querySelector('.con-t'), chips = [...card.querySelectorAll('.ms-chips .chip')];
    if (!fx) { t.textContent = VERBS[0]; return; }
    const tl = gsap.timeline({ repeat: -1 });
    VERBS.forEach((v, i) => {
      const o = { n: 0 };
      tl.set(t, { textContent: '' }).to(o, { n: v.length, duration: 0.6, ease: 'none', onUpdate: () => { t.textContent = v.slice(0, Math.round(o.n)); } })
        .to(chips[i], { scale: 1.15, duration: 0.2, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, '<.4').to({}, { duration: 0.6 });
    });
    own(tl);
    own(gsap.to(card.querySelector('.con-c'), { autoAlpha: 0, duration: 0.5, ease: 'steps(1)', repeat: -1, yoyo: true }));
  }
  if (k === 'aux') {
    const lens = card.querySelector('.aux-lens'), dots = [...card.querySelectorAll('.aux-dots circle')];
    gsap.set(dots, { fill: '#93a4ec', stroke: '#1a2352', strokeWidth: 4 });
    if (!fx) return;
    own(gsap.to(lens, { keyframes: [{ x: -40, y: -24, duration: 1 }, { x: 36, y: -10, duration: 1 }, { x: -8, y: 40, duration: 1 }, { x: 0, y: 0, duration: 1 }], ease: 'sine.inOut', repeat: -1 }));
    dots.forEach((d, i) => own(gsap.timeline({ repeat: -1 }).to(d, { fill: '#ffd54a', duration: 0.2 }, 0.7 + i).to(d, { fill: '#93a4ec', duration: 0.6 }, 1.5 + i).to({}, { duration: 4 }, 0)));
  }
}

defineSlide('b2-metasploit', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    for (let i = 1; i <= api.step; i++) play(s.querySelector(`[data-k="${KEYS[i]}"]`), api);
  },
  step(s, n, from, api) { if (n > from && api.instant !== true) play(s.querySelector(`[data-k="${KEYS[n]}"]`), api); }
});

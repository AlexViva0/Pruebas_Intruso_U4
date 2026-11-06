import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

const KEYS = ['', 'negra', 'gris', 'blanca'];

function play(card, { gsap, fx, own, animate }) {
  const cube = card.querySelector('.cube'), shadow = card.querySelector('.shadow');
  if (!fx) return;
  // el cubo «flota» y su sombra respira
  own(gsap.to(cube, { y: -9, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  own(gsap.to(shadow, { scaleX: 0.86, opacity: 0.1, svgOrigin: '150 226', duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  const k = card.dataset.k;
  if (k === 'negra') own(gsap.timeline({ repeat: -1, repeatDelay: 1.2 }).to(card.querySelector('.q'), { scale: 1.35, svgOrigin: '30 40', duration: 0.25, ease: 'back.out(3)' }).to(card.querySelector('.q'), { scale: 1, duration: 0.3 }));
  if (k === 'gris') {
    const key = card.querySelector('.ck');
    own(gsap.timeline({ repeat: -1, repeatDelay: 0.8 }).fromTo(key, { x: -46, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }).to(key, { x: 6, duration: 0.15, yoyo: true, repeat: 3 }));
  }
  if (k === 'blanca') {
    const lines = card.querySelectorAll('.cl');
    gsap.set(lines, { transformOrigin: '0% 50%' });
    own(gsap.timeline({ repeat: -1, repeatDelay: 1.6 }).fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out', stagger: 0.22 }).to(lines, { scaleX: 0, duration: 0.3, stagger: 0.05 }, '+=1.4'));
  }
}

defineSlide('b1-cajas', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    for (let i = 1; i <= api.step; i++) play(s.querySelector(`[data-k="${KEYS[i]}"]`), api);
    // la barra «nada → total» respira de negro a blanco
    if (api.fx) api.own(api.gsap.fromTo(s.querySelector('.sc-line'), { '--p': 0 }, { '--p': 1, duration: 2.2, ease: 'power1.inOut', yoyo: true, repeat: -1 }));
  },
  step(s, n, from, api) { if (n > from && api.instant !== true) play(s.querySelector(`[data-k="${KEYS[n]}"]`), api); }
});

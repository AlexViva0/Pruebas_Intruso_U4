import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';
import { ORB_NODES, ORB_EDGES } from '../art.js';

const KEYS = ['', 'negra', 'gris', 'blanca'];
// opacidad de la sonda cuando pasa «detrás» de la esfera: negra no se ve, gris se adivina, blanca se ve
const BEHIND = { negra: 0, gris: 0.35, blanca: 1 };

function play(card, { gsap, fx, own }) {
  const k = card.dataset.k, q = c => card.querySelector(c);
  const orb = q('.orb'), shadow = q('.shadow'), probe = q('.probe'), pulse = q('.pulse');
  const nodes = [...card.querySelectorAll('.on')], edges = [...card.querySelectorAll('.oe')];
  // estado base (también sin efectos): nodos según cuánto deja ver la esfera
  const base = { gris: [0.28, 0.4, 0.22, 0.5, 1, 0.3], blanca: [1, 1, 1, 1, 1, 1] }[k];
  if (base) nodes.forEach((n, i) => { n.style.opacity = base[i]; });
  if (k === 'gris') edges.forEach(e => { e.style.opacity = 0.25; });
  const place = t => {
    const a = (-18 * Math.PI) / 180, rx = 128, ry = 36, x = rx * Math.cos(t), y = ry * Math.sin(t);
    probe.setAttribute('cx', 150 + x * Math.cos(a) - y * Math.sin(a)); probe.setAttribute('cy', 118 + x * Math.sin(a) + y * Math.cos(a));
    probe.style.opacity = Math.sin(t) < 0 ? BEHIND[k] : 1;
  };
  place(0.6);
  if (!fx) return;
  // la esfera flota; la sonda orbita
  own(gsap.to(orb, { y: -9, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  own(gsap.to(shadow, { scaleX: 0.86, opacity: 0.1, svgOrigin: '150 232', duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
  const o = { t: 0 }; own(gsap.to(o, { t: Math.PI * 2, duration: 7, ease: 'none', repeat: -1, onUpdate: () => place(o.t) }));
  gsap.set(pulse, { svgOrigin: '150 118' });
  if (k === 'negra') {
    // sellada: el pulso rebota en la superficie
    own(gsap.timeline({ repeat: -1, repeatDelay: 1.4 }).fromTo(pulse, { scale: 1, opacity: 0.9 }, { scale: 1.18, opacity: 0, duration: 0.9, ease: 'power2.out' }));
  }
  if (k === 'gris') {
    // translúcida: unas piezas se adivinan, una se ve bien
    nodes.forEach((n, i) => { if (i !== 4) own(gsap.to(n, { opacity: base[i] + 0.25, duration: 1.2 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' })); });
    gsap.set(nodes[4], { svgOrigin: '150 160' });
    own(gsap.to(nodes[4], { scale: 1.45, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
  }
  if (k === 'blanca') {
    // transparente: toda la red interna se ve y circula un destello
    edges.forEach(e => { const L = e.getTotalLength ? e.getTotalLength() : 60; e.style.strokeDasharray = L; });
    own(gsap.timeline({ repeat: -1, repeatDelay: 1.2 }).fromTo(edges, { strokeDashoffset: (i, el) => el.getTotalLength() }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', stagger: 0.12 }));
    nodes.forEach((n, i) => { gsap.set(n, { svgOrigin: `${ORB_NODES[i][0]} ${ORB_NODES[i][1]}` }); own(gsap.to(n, { scale: 1.35, duration: 0.5, yoyo: true, repeat: -1, repeatDelay: 1.4, delay: i * 0.18, ease: 'sine.inOut' })); });
  }
}

defineSlide('r2', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    for (let i = 1; i <= api.step; i++) play(s.querySelector(`[data-k="${KEYS[i]}"]`), api);
    if (api.fx) api.own(api.gsap.fromTo(s.querySelector('.sc-line'), { '--p': 0 }, { '--p': 1, duration: 2.2, ease: 'power1.inOut', yoyo: true, repeat: -1 }));
  },
  step(s, n, from, api) { if (n > from && api.instant !== true) play(s.querySelector(`[data-k="${KEYS[n]}"]`), api); }
});

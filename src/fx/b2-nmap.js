import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Grupos del dibujo: g1 dispositivos y sondas · g2 puertos · g3 servicios activos · g4 superficie de ataque.
function paint(s, n, { gsap, fx, instant }) {
  const quick = instant || !fx;
  [1, 2, 3, 4].forEach(k => {
    const els = s.querySelectorAll(`.g${k}`), on = n >= k;
    gsap.killTweensOf(els);
    if (quick) { gsap.set(els, { autoAlpha: on ? 1 : 0 }); return; }
    if (on && els[0] && els[0].style.visibility !== 'inherit' && getComputedStyle(els[0]).opacity < 0.5) gsap.fromTo(els, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.12, ease: 'power2.out' });
    else gsap.to(els, { autoAlpha: on ? 1 : 0, duration: 0.3 });
  });
  s.classList.toggle('nm-svc', n >= 3);
}

defineSlide('b2-nmap', {
  enter(s, api) {
    const { gsap, fx, own } = api;
    maskTitle(s, api, 0.1);
    s.querySelectorAll('.g1,.g2,.g3,.g4').forEach(e => { e.style.opacity = 0; e.style.visibility = 'hidden'; });
    paint(s, api.step, { gsap, fx, instant: true });
    if (fx) {
      // el escáner «late»: dos ondas salen de él
      const rings = s.querySelectorAll('.ping circle');
      gsap.set(rings, { svgOrigin: '110 306' });
      rings.forEach((r, i) => own(gsap.fromTo(r, { scale: 1, opacity: 0.8 }, { scale: 2.4, opacity: 0, duration: 2.4, ease: 'power1.out', repeat: -1, delay: i * 1.2 })));
      s.querySelectorAll('.probe').forEach(p => own(gsap.to(p, { strokeDashoffset: -36, duration: 1.2, ease: 'none', repeat: -1 })));
      // los puertos activos «parpadean» cuando ya se muestran los servicios
      s.querySelectorAll('.pt.op rect').forEach((r, i) => { gsap.set(r, { svgOrigin: `${+r.getAttribute('x') + 26} ${+r.getAttribute('y') + 26}` }); own(gsap.to(r, { scale: 1.12, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.15 })); });
    }
  },
  step(s, n, from, api) { paint(s, n, { gsap: api.gsap, fx: api.fx, instant: api.instant === true }); }
});

import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

// Grupos del dibujo: g1 dispositivos y sondas · g2 puertos · g3 servicios activos · g4 superficie de ataque.
// Al avanzar (con efectos) cada grupo tiene su propia entrada:
// 1 un paquete viaja por cada sonda y el dispositivo «aparece» al llegar · 2 los puertos saltan uno a uno ·
// 3 los puertos abiertos se encienden en cascada · 4 la superficie de ataque se traza alrededor.
const G = k => `.g${k}`;

function enterGroup(s, k, gsap) {
  const svg = s.querySelector('.nmap-svg');
  if (k === 1) {
    const probes = [...svg.querySelectorAll('.probe')], devs = [...svg.querySelectorAll('.dev')], pks = [...svg.querySelectorAll('.pk')];
    gsap.set(probes, { autoAlpha: 1 });
    gsap.set(devs, { autoAlpha: 0 });
    probes.forEach((p, i) => {
      const L = p.getTotalLength(), pk = pks[i], d = devs[i], o = { t: 0 };
      const at = t => { const pt = p.getPointAtLength(t * L); pk.setAttribute('cx', pt.x); pk.setAttribute('cy', pt.y); };
      gsap.fromTo(p, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.inOut', delay: i * 0.18 });
      gsap.timeline({ delay: 0.25 + i * 0.18 })
        .set(pk, { opacity: 1 })
        .to(o, { t: 1, duration: 0.7, ease: 'power1.in', onUpdate: () => at(o.t) })
        .set(pk, { opacity: 0 })
        .fromTo(d, { autoAlpha: 0, scale: 0.6, svgOrigin: `695 ${d.dataset.cy}` }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' });
    });
  } else if (k === 2) {
    const g2 = svg.querySelectorAll(G(2)), pts = [...svg.querySelectorAll('.pt')];
    gsap.set(g2, { autoAlpha: 1 });
    pts.forEach(p => gsap.set(p, { svgOrigin: p.dataset.o }));
    gsap.fromTo(pts, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2.6)', stagger: 0.07 });
  } else if (k === 3) {
    const leg = svg.querySelectorAll(G(3)), op = [...svg.querySelectorAll('.pt.op')];
    gsap.fromTo(leg, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    op.forEach(p => gsap.set(p, { svgOrigin: p.dataset.o }));
    gsap.fromTo(op, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1,.45)', stagger: 0.12 });
  } else if (k === 4) {
    const g4 = svg.querySelector(G(4)), surf = svg.querySelector('.surf'), lab = svg.querySelector('.surf-l');
    gsap.set(g4, { autoAlpha: 1 });
    gsap.fromTo(surf, { scale: 0.92, autoAlpha: 0, svgOrigin: '695 310' }, { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(1.8)' });
    gsap.fromTo(surf, { strokeDashoffset: 0 }, { strokeDashoffset: -104, duration: 1.4, ease: 'power2.out' });
    gsap.fromTo(lab, { y: -40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'bounce.out', delay: 0.25 });
  }
}

function paint(s, n, { gsap, fx, instant, from = n }) {
  const quick = instant || !fx;
  // (las sondas no se detienen: su trazo punteado corre en un bucle propio)
  gsap.killTweensOf(s.querySelectorAll('.dev,.g2,.g3,.g4,.pt,.pk,.surf,.surf-l'));
  gsap.killTweensOf(s.querySelectorAll('.probe'), 'clipPath');
  // estado final de cada grupo (sin transiciones); luego se anima solo el grupo que acaba de entrar
  [1, 2, 3, 4].forEach(k => gsap.set(s.querySelectorAll(G(k)), { autoAlpha: n >= k ? 1 : 0, clearProps: 'clipPath' }));
  gsap.set(s.querySelectorAll('.pt,.surf-l,.surf'), { scale: 1, y: 0, autoAlpha: 1 });
  gsap.set(s.querySelectorAll('.pk'), { opacity: 0 });
  s.classList.toggle('nm-svc', n >= 3);
  if (!quick && n === from + 1) enterGroup(s, n, gsap);
}

defineSlide('b2-nmap', {
  enter(s, api) {
    const { gsap, fx, own } = api;
    maskTitle(s, api, 0.1);
    paint(s, api.step, { gsap, fx, instant: true });
    if (fx) {
      // el escáner «late»: dos ondas salen de él
      const rings = s.querySelectorAll('.ping circle');
      gsap.set(rings, { svgOrigin: '110 306' });
      rings.forEach((r, i) => own(gsap.fromTo(r, { scale: 1, opacity: 0.8 }, { scale: 2.4, opacity: 0, duration: 2.4, ease: 'power1.out', repeat: -1, delay: i * 1.2 })));
      s.querySelectorAll('.probe').forEach(p => own(gsap.to(p, { strokeDashoffset: -36, duration: 1.2, ease: 'none', repeat: -1 })));
      // los puertos activos «laten» cuando ya se muestran los servicios
      s.querySelectorAll('.pt.op rect').forEach((r, i) => { gsap.set(r, { svgOrigin: `${+r.getAttribute('x') + 26} ${+r.getAttribute('y') + 26}` }); own(gsap.to(r, { scale: 1.12, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.15 })); });
    }
  },
  step(s, n, from, api) { paint(s, n, { gsap: api.gsap, fx: api.fx, instant: api.instant === true, from }); }
});

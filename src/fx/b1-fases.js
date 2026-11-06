import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';
import { PHASES } from './phases.js';

const X = [200, 580, 960, 1340, 1720], Y = 323;

function paint(s, n, { gsap, fx, instant, from = n }) {
  const quick = instant || !fx, pk = s.querySelector('.pkt'), ring = s.querySelector('.nd-ring');
  s.querySelectorAll('.nd').forEach(nd => {
    const i = +nd.dataset.i, st = i < n ? 'done' : i === n ? 'on' : 'idle';
    nd.dataset.st = st;
    gsap.to(nd, { scale: st === 'on' ? 1.18 : 1, duration: quick ? 0 : 0.35, ease: 'back.out(2)', overwrite: 'auto', delay: quick || st !== 'on' ? 0 : 0.55 });
  });
  const px = n ? X[n - 1] : 128;
  const dist = Math.abs(n - from);
  gsap.to(pk, { left: px - 20, top: Y - 20, duration: quick ? 0 : 0.8, ease: 'power3.inOut', overwrite: 'auto' });
  gsap.to(s.querySelector('.prog'), { width: n ? px - 200 : 0, duration: quick ? 0 : 0.8, ease: 'power3.inOut', overwrite: 'auto' });
  // el paquete se «estira» al viajar y rebota al llegar
  if (!quick && dist) {
    gsap.timeline({ overwrite: false })
      .fromTo(pk, { scaleX: 1, scaleY: 1 }, { scaleX: 1.6, scaleY: 0.7, duration: 0.25, ease: 'power2.out' })
      .to(pk, { scaleX: 0.75, scaleY: 1.3, duration: 0.18, ease: 'power2.in' }, 0.62)
      .to(pk, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1.2,.35)' });
  }
  // onda en el nodo activo
  if (ring) {
    gsap.killTweensOf(ring);
    gsap.set(ring, { left: px - 60, top: Y - 60, autoAlpha: 0 });
    if (!quick && n) gsap.fromTo(ring, { scale: 0.5, autoAlpha: 0.9 }, { scale: 1.3, autoAlpha: 0, duration: 0.9, ease: 'power2.out', delay: 0.6 });
  }
  const p = n ? PHASES[n - 1] : null, nn = s.querySelector('.fz-nn'), t = s.querySelector('.fz-t'), d = s.querySelector('.fz-d'), tools = s.querySelector('.fz-tools'), e = s.querySelector('.fz-ed');
  const set = () => {
    nn.textContent = n || '0'; t.textContent = p ? p.name : 'Un pentest, cinco fases';
    d.textContent = p ? p.d : 'Del reconocimiento al informe.';
    tools.innerHTML = (p ? p.tools : ['Nmap', 'Nessus', 'Metasploit', 'Burp', 'Wireshark', 'SET']).map(x => `<span class="chip">${x}</span>`).join('');
    e.textContent = p ? p.e : 'Pulsa → para recorrer las fases.';
  };
  const els = [t, d, e], dir = n >= from ? 1 : -1;
  if (quick) { set(); return; }
  gsap.timeline()
    .to(nn, { yPercent: -60 * dir, autoAlpha: 0, duration: 0.16, ease: 'power2.in' }, 0)
    .to([...els, tools], { y: -14, autoAlpha: 0, duration: 0.14 }, 0)
    .add(set)
    .fromTo(nn, { yPercent: 60 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' })
    .fromTo(els, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.32, stagger: 0.05, ease: 'power3.out' }, '<')
    .set(tools, { autoAlpha: 1, y: 0 }, '<')
    .add(() => gsap.fromTo(tools.children, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: 'back.out(2.5)' }), '<.12');
}

defineSlide('b1-fases', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    if (api.step === 0) { paint(s, 0, { gsap: api.gsap, fx: api.fx, instant: true }); if (api.animate) api.own(api.gsap.from(s.querySelectorAll('.nd,.nl'), { y: 30, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.07, delay: api.delay + 0.3 })); }
  },
  step(s, n, from, api) { paint(s, n, { gsap: api.gsap, fx: api.fx, instant: api.instant === true, from }); }
});

import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';
import { PHASES } from './phases.js';

const X = [200, 580, 960, 1340, 1720], Y = 323;

function paint(s, n, { gsap, fx, instant }) {
  const quick = instant || !fx, pk = s.querySelector('.pkt');
  s.querySelectorAll('.nd').forEach(nd => {
    const i = +nd.dataset.i, st = i < n ? 'done' : i === n ? 'on' : 'idle';
    nd.dataset.st = st;
    gsap.to(nd, { scale: st === 'on' ? 1.18 : 1, duration: quick ? 0 : 0.35, ease: 'back.out(2)', overwrite: 'auto' });
  });
  const px = n ? X[n - 1] : 128;
  gsap.to(pk, { left: px - 20, top: Y - 20 - (n ? 0 : 0), duration: quick ? 0 : 0.8, ease: 'power3.inOut', overwrite: 'auto' });
  gsap.to(s.querySelector('.prog'), { width: n ? px - 200 : 0, duration: quick ? 0 : 0.8, ease: 'power3.inOut', overwrite: 'auto' });
  const p = n ? PHASES[n - 1] : null, nn = s.querySelector('.fz-nn'), t = s.querySelector('.fz-t'), d = s.querySelector('.fz-d'), tools = s.querySelector('.fz-tools'), e = s.querySelector('.fz-ed');
  const set = () => {
    nn.textContent = n || '0'; t.textContent = p ? p.name : 'Un pentest, cinco fases';
    d.textContent = p ? p.d : 'Cada fase produce algo que alimenta a la siguiente.';
    tools.innerHTML = (p ? p.tools : ['Nmap', 'Nessus', 'Metasploit', 'Burp', 'Wireshark', 'SET']).map(x => `<span class="chip">${x}</span>`).join('');
    e.textContent = p ? p.e : 'Pulsa → para recorrer las fases, de la información al informe.';
  };
  const els = [nn, t, d, tools, e];
  if (quick) set();
  else gsap.timeline().to(els, { y: -14, autoAlpha: 0, duration: 0.14 }).add(set).fromTo(els, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.32, stagger: 0.05, ease: 'power3.out' });
}

defineSlide('b1-fases', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    if (api.step === 0) { paint(s, 0, { gsap: api.gsap, fx: api.fx, instant: true }); if (api.animate) api.own(api.gsap.from(s.querySelectorAll('.nd,.nl'), { y: 30, autoAlpha: 0, duration: 0.5, ease: 'back.out(1.6)', stagger: 0.07, delay: api.delay + 0.3 })); }
  },
  step(s, n, from, api) { paint(s, n, { gsap: api.gsap, fx: api.fx, instant: api.instant === true }); }
});

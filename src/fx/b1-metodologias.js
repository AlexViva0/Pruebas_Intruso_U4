import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

const INFO = [
  ['ELIGE UNA', 'Seguir un estándar da <b>consistencia y trazabilidad</b>', 'Pulsa → para ver qué define cada metodología.'],
  ['OWASP WSTG', 'Evalúa <b>autenticación, control de acceso</b> y el OWASP Top 10', 'Guía de OWASP para evaluar <b>aplicaciones web y APIs</b>.'],
  ['PTES', 'Define las <b>fases formales</b> de una prueba', 'Pre-evaluación · recolección de información · modelado de amenazas · explotación · post-explotación · reporte. Da <b>consistencia y trazabilidad</b> a la prueba.'],
  ['OSSTMM', 'Una <b>línea base</b> de pruebas, sin importar el entorno', 'Open Source Security Testing Methodology Manual: una metodología <b>abierta</b>.'],
  ['NIST SP 800-115', 'Guía técnica para <b>planear y ejecutar</b> las pruebas', 'Guía técnica del NIST (EE. UU.) para la planeación y ejecución de pruebas de seguridad de la información.']
];

function paint(s, n, { gsap, fx, instant }) {
  s.querySelectorAll('.mt').forEach(c => {
    const on = n === 0 || +c.dataset.m === n, dim = n !== 0 && !on;
    gsap.to(c, { opacity: dim ? 0.5 : 1, y: on && n ? -14 : 0, '--sh': (dim ? 3 : on && n ? 16 : 10) + 'px', duration: instant || !fx ? 0 : 0.4, ease: 'power3.out', overwrite: 'auto' });
  });
  const [k, t, d] = INFO[n], K = s.querySelector('#mtd-k'), T = s.querySelector('.mtd-t'), D = s.querySelector('.mtd-d');
  const set = () => { K.textContent = k; T.innerHTML = t; D.innerHTML = d; };
  if (instant || !fx) set();
  else gsap.timeline().to([K, T, D], { y: -12, autoAlpha: 0, duration: 0.14 }).add(set).fromTo([K, T, D], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.05, ease: 'power3.out' });
}

defineSlide('b1-metodologias', {
  enter(s, api) { maskTitle(s, api, 0.1); },
  step(s, n, from, api) { paint(s, n, { gsap: api.gsap, fx: api.fx, instant: api.instant === true }); }
});

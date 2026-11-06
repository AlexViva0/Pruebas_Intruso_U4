// Título con máscara por líneas y resaltado amarillo que se «pinta».
export function maskTitle(s, api, at = 0.1) {
  const { gsap, animate, delay = 0, own } = api;
  const lines = s.querySelectorAll('.title .ln > span'), em = s.querySelector('.title em');
  if (!lines.length) return;
  if (!animate) { gsap.set(lines, { clearProps: 'transform' }); if (em) em.style.setProperty('--hl', 1); return; }
  gsap.set(lines, { yPercent: 115 }); if (em) em.style.setProperty('--hl', 0);
  const tl = gsap.timeline({ delay: delay + at });
  tl.to(lines, { yPercent: 0, duration: 0.85, ease: 'power4.out', stagger: 0.14 });
  if (em) tl.to(em, { '--hl': 1, duration: 0.55, ease: 'power3.out' }, 0.7);
  own(tl);
}

// Flota suavemente las formas decorativas de fondo.
export function floatDecor(s, api) {
  const { gsap, fx, own } = api;
  if (!fx) return;
  s.querySelectorAll('.decor .d').forEach((el, i) => {
    own(gsap.to(el, { y: (i % 2 ? -1 : 1) * (10 + i * 2), rotation: (i % 2 ? 1 : -1) * 8, duration: 3 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, svgOrigin: el.dataset.o || '0 0' }));
  });
}

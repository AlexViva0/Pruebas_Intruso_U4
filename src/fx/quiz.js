import { defineSlide } from '../engine.js';

// Quiz tipo Kahoot: al revelar, las opciones incorrectas se apagan y la correcta se marca con ✓.
function reveal(s, on, { gsap, fx, instant }) {
  const tiles = [...s.querySelectorAll('.qt')];
  const quick = instant || !fx;
  tiles.forEach(t => {
    const ok = t.dataset.ok === '1', chk = t.querySelector('.qc');
    gsap.killTweensOf([t, chk]);
    if (on) {
      gsap.to(t, { opacity: ok ? 1 : 0.28, scale: ok ? 1.03 : 0.97, duration: quick ? 0 : 0.4, ease: 'back.out(1.7)' });
      if (ok) gsap.fromTo(chk, { scale: 0, rotate: -40, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: quick ? 0 : 0.55, ease: 'elastic.out(1,.5)', delay: quick ? 0 : 0.15 });
    } else {
      gsap.to(t, { opacity: 1, scale: 1, duration: quick ? 0 : 0.25 });
      gsap.set(chk, { autoAlpha: 0, scale: 0 });
    }
  });
}
for (const id of [1, 2, 3, 4, 5].flatMap(i => ['quiz1-' + i, 'quiz2-' + i])) {
  defineSlide(id, {
    enter(s, api) {
      s.querySelectorAll('.qc').forEach(c => api.gsap.set(c, { autoAlpha: 0, scale: 0 }));
      if (api.step >= 1) reveal(s, true, { gsap: api.gsap, fx: api.fx, instant: true });
      else s.querySelectorAll('.qt').forEach(t => api.gsap.set(t, { opacity: 1, scale: 1, clearProps: 'opacity' }));
    },
    step(s, n, from, api) { reveal(s, n >= 1, { gsap: api.gsap, fx: api.fx, instant: api.instant === true }); }
  });
}

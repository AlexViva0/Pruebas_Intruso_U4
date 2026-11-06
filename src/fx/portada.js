import { defineSlide } from '../engine.js';
import { playScan } from '../art.js';
import { maskTitle, floatDecor } from './util.js';

defineSlide('portada', {
  enter(s, api) {
    const { gsap, animate, delay, own } = api;
    maskTitle(s, api, 0.12);
    const rows = s.querySelectorAll('.team .nm');
    if (animate) own(gsap.from(rows, { x: -26, autoAlpha: 0, duration: 0.5, ease: 'power3.out', stagger: 0.07, delay: delay + 1.0 }));
    playScan(s.querySelector('.art svg'), { ...api, delay: delay + 0.55 });
    floatDecor(s, api);
  }
});

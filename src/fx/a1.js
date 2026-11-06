import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';
import { makeSorter } from './dnd.js';

defineSlide('a1', {
  enter(s, api) {
    maskTitle(s, api, 0.1);
    if (!s._sorter) s._sorter = makeSorter(s);
  },
  step(s, n, from, api) {
    if (!s._sorter) s._sorter = makeSorter(s);
    if (n >= 1 && from < 1) s._sorter.reveal({ instant: api.instant === true });
    else if (n < 1 && from >= 1) s._sorter.unreveal();
  }
});

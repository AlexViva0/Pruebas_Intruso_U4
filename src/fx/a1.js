import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';

defineSlide('a1', { enter(s, api) { maskTitle(s, api, 0.1); } });

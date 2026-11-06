import { defineSlide } from '../engine.js';
import { maskTitle } from './util.js';
import { makeSorter } from './dnd.js';

const ORDER = ['tray', 'nmap', 'metasploit', 'burp', 'wireshark'];
defineSlide('a3', {
  enter(s, api) { maskTitle(s, api, 0.1); if (!s._sorter) s._sorter = makeSorter(s, { order: ORDER }); },
  step(s, n, from, api) {
    if (!s._sorter) s._sorter = makeSorter(s, { order: ORDER });
    if (n >= 1 && from < 1) s._sorter.reveal({ instant: api.instant === true });
    else if (n < 1 && from >= 1) s._sorter.unreveal();
  }
});

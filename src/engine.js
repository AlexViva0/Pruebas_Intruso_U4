// Motor del deck: escala 1920×1080, navegación, pasos [data-step], entradas [data-anim],
// transición con barrido, notas del orador y ganchos por lámina (defineSlide).
import gsap from 'gsap';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const rmq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
const pad = n => String(n).padStart(2, '0');
const CLEAR = 'transform,opacity,visibility';

export const PI = { fx: store.get('pi-fx') !== 'off' && !rmq.matches, hooks: {} };
export const defineSlide = (id, hook) => { PI.hooks[id] = hook; };

let stage, slides = [], idx = -1, step = 0, trans = null, own = [], toastT = 0;

const maxStep = s => Math.max(+s.dataset.steps || 0, 0, ...$$('[data-step]', s).map(e => +e.dataset.step));
const shadowOf = el => { const v = parseFloat(getComputedStyle(el).getPropertyValue('--sh')); return Number.isFinite(v) ? v : 0; };

/* ---------- entradas ---------- */
const FROM = {
  up: { y: 44, autoAlpha: 0 }, fade: { autoAlpha: 0 }, left: { x: -90, autoAlpha: 0 }, right: { x: 130, autoAlpha: 0 },
  pop: { scale: 0.92, y: 30, autoAlpha: 0 }, stamp: { scale: 1.6, rotation: -9, autoAlpha: 0 }
};
const EASE = { pop: 'back.out(1.5)', stamp: 'back.out(2.4)' };

function reveal(els, { delay = 0, stagger = 0.08, from } = {}) {
  const tl = gsap.timeline({ delay });
  els.forEach((el, i) => {
    const kind = el.dataset.fx || from || el.dataset.anim || 'up';
    const f = { ...(FROM[kind] || FROM.up) };
    const t = { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 0.6, ease: EASE[kind] || 'power3.out', clearProps: 'transform' };
    const sh = shadowOf(el);
    if (sh > 0 && el.matches('.card,.stamp,.art')) { f['--sh'] = '0px'; t['--sh'] = sh + 'px'; }
    tl.fromTo(el, f, t, i * stagger + (+el.dataset.delay || 0));
  });
  return tl;
}

/* ---------- ciclo de vida de una lámina ---------- */
function activate(i, { instant, delay }) {
  const s = slides[i];
  slides.forEach((x, k) => x.classList.toggle('active', k === i));
  stage.dataset.chrome = s.dataset.chrome || 'on';
  stage.dataset.kind = s.dataset.kind || 'teoria';
  timerReset(s);
  $('#tag').textContent = s.dataset.tag || '';
  $('#bandtxt').textContent = s.dataset.band || '';
  $('#count').textContent = pad(i + 1) + ' / ' + pad(slides.length);
  gsap.to('#deckbar', { scaleX: (i + 1) / slides.length, duration: instant || !PI.fx ? 0 : 0.8, ease: 'power3.inOut', delay: instant ? 0 : delay, overwrite: 'auto' });
  const anims = $$('[data-anim]', s), steps = $$('[data-step]', s);
  gsap.set(steps, { autoAlpha: 0 });
  const api = { slide: s, gsap, fx: PI.fx, animate: !instant && PI.fx, delay, step, own: t => { own.push(t); return t; } };
  if (api.animate) own.push(reveal(anims, { delay }));
  else gsap.set(anims, { clearProps: CLEAR });
  if (step > 0) steps.filter(e => +e.dataset.step <= step).forEach(e => gsap.set(e, { clearProps: CLEAR }));
  const hook = PI.hooks[s.dataset.id];
  if (hook && hook.enter) hook.enter(s, api);
  if (hook && hook.step && step > 0) hook.step(s, step, 0, { ...api, instant: true });
  store.set('pi-u4-slide', i);
  renderNotes();
}

function leave(i) {
  if (i < 0) return;
  const s = slides[i], hook = PI.hooks[s.dataset.id];
  if (hook && hook.leave) hook.leave(s);
  own.forEach(t => t && t.kill && t.kill()); own = [];
  const all = $$('*', s);
  gsap.killTweensOf(all);
  gsap.set(all, { clearProps: CLEAR });
}

export function go(i, { wipe = true, animate = true, showAll = false } = {}) {
  if (i < 0 || i >= slides.length) return;
  if (trans) { trans.progress(1, false); trans = null; }
  const dir = i > idx ? 1 : -1, withWipe = wipe && idx >= 0 && PI.fx && animate && !showAll;
  const swap = () => {
    leave(idx);
    idx = i; step = showAll ? maxStep(slides[i]) : 0;
    activate(i, { instant: !animate || !PI.fx || showAll, delay: withWipe ? 0.22 : 0.05 });
  };
  if (!withWipe) { swap(); return; }
  const bars = $$('#wipe i');
  trans = gsap.timeline({ onComplete: () => { trans = null; } });
  trans.set(bars, { xPercent: -101 * dir })
    .to(bars, { xPercent: 0, duration: 0.36, ease: 'power3.inOut', stagger: 0.07 })
    .add(swap)
    .to(bars, { xPercent: 101 * dir, duration: 0.36, ease: 'power3.inOut', stagger: 0.07 }, '+=.03');
}

function showStep(s, n, dir) {
  const hook = PI.hooks[s.dataset.id], els = $$(`[data-step="${dir > 0 ? n : n + 1}"]`, s);
  const api = { slide: s, gsap, fx: PI.fx, animate: PI.fx, instant: !PI.fx, step: n, own: t => { own.push(t); return t; } };
  if (dir > 0) {
    if (PI.fx) own.push(reveal(els, { stagger: 0.1 })); else gsap.set(els, { clearProps: CLEAR });
    if (hook && hook.step) hook.step(s, n, n - 1, api);
  } else {
    if (PI.fx) gsap.to(els, { autoAlpha: 0, y: 16, duration: 0.22, ease: 'power2.in' }); else gsap.set(els, { autoAlpha: 0 });
    if (hook && hook.step) hook.step(s, n, n + 1, api);
  }
  renderNotes();
}

export function next() {
  if (trans) { trans.progress(1, false); trans = null; }
  const s = slides[idx];
  if (step < maxStep(s)) { step++; showStep(s, step, 1); } else go(idx + 1);
}
export function prev() {
  if (trans) { trans.progress(1, false); trans = null; }
  if (step > 0) { step--; showStep(slides[idx], step, -1); } else go(idx - 1, { showAll: true });
}

/* ---------- interfaz ---------- */
function fit() { stage.style.setProperty('--s', Math.min(innerWidth / 1920, innerHeight / 1080)); }

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1600);
}

function renderNotes() {
  const p = $('#notes'); if (p.hidden || idx < 0) return;
  const s = slides[idx];
  $('#nt').textContent = pad(idx + 1) + ' · ' + (s.dataset.title || '');
  $('#ns').textContent = maxStep(s) ? 'paso ' + step + ' / ' + maxStep(s) : '';
  const nl = $('#nl'); nl.innerHTML = '';
  (s.dataset.notes || 'Sin notas.').split('|').filter(Boolean).forEach(x => { const li = document.createElement('li'); li.textContent = x.trim(); nl.appendChild(li); });
}

/* ---------- temporizador (tecla T) en las láminas con data-time ---------- */
const tm = { left: 0, run: false, last: 0, raf: 0, started: false };
function timerRender() {
  const el = $('#timer'), t = idx >= 0 ? +slides[idx].dataset.time || 0 : 0;
  el.hidden = !t; if (!t) return;
  const l = Math.max(0, Math.ceil(tm.left));
  el.textContent = pad(Math.floor(l / 60)) + ':' + pad(l % 60);
  el.classList.toggle('run', tm.run); el.classList.toggle('low', tm.run && tm.left <= 30 && tm.left > 0);
  el.classList.toggle('end', tm.started && tm.left <= 0);
}
function timerReset(s) { tm.run = false; cancelAnimationFrame(tm.raf); tm.left = +s.dataset.time || 0; tm.started = false; timerRender(); }
function timerTick() {
  if (!tm.run) return;
  const n = performance.now(); tm.left -= (n - tm.last) / 1000; tm.last = n;
  if (tm.left <= 0) { tm.left = 0; tm.run = false; }
  timerRender(); if (tm.run) tm.raf = requestAnimationFrame(timerTick);
}
function timerToggle() {
  const t = +slides[idx].dataset.time; if (!t) return;
  if (tm.left <= 0) tm.left = t;
  tm.run = !tm.run; tm.started = true;
  if (tm.run) { tm.last = performance.now(); timerTick(); } else timerRender();
}

function refresh() { const st = step; leave(idx); activate(idx, { instant: true, delay: 0 }); step = st; }

function toggleFx() {
  PI.fx = !PI.fx; store.set('pi-fx', PI.fx ? 'on' : 'off');
  toast('Efectos: ' + (PI.fx ? 'activados' : 'desactivados'));
  refresh();
}

function onKey(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key;
  if (['ArrowRight', ' ', 'PageDown', 'Enter'].includes(k)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev(); }
  else if (k === 'Home') go(0, { showAll: false });
  else if (k === 'End') go(slides.length - 1, { showAll: true });
  else if (k === 'n' || k === 'N') { const p = $('#notes'); p.hidden = !p.hidden; renderNotes(); }
  else if (k === 'x' || k === 'X') toggleFx();
  else if (k === 't' || k === 'T') timerToggle();
  else if (k === 'f' || k === 'F') { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(() => {}); }
  else if (k === 'Escape') $('#notes').hidden = true;
}

export function init() {
  stage = $('#stage'); slides = $$('.slide', stage);
  fit(); addEventListener('resize', fit);
  addEventListener('keydown', onKey);
  const vp = $('#viewport');
  vp.addEventListener('click', e => {
    if (e.target.closest('[data-nocl],#notes')) return;
    (e.clientX / innerWidth < 0.25) ? prev() : next();
  });
  let tx = 0;
  vp.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
  vp.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) (dx < 0 ? next() : prev()); }, { passive: true });
  if (rmq.addEventListener) rmq.addEventListener('change', () => { if (rmq.matches && PI.fx) toggleFx(); });
  gsap.set($$('#wipe i'), { xPercent: -101 });
  const hash = parseInt(location.hash.slice(1), 10), saved = parseInt(store.get('pi-u4-slide'), 10);
  const start = hash >= 1 && hash <= slides.length ? hash - 1 : (saved >= 0 && saved < slides.length ? saved : 0);
  go(start, { wipe: false, animate: start === 0 });
  Object.assign(PI, { go, next, prev, gsap, scale: () => parseFloat(stage.style.getPropertyValue('--s')) || 1, state: () => ({ idx, step, max: maxStep(slides[idx]), total: slides.length }) });
  window.PI = PI;
}

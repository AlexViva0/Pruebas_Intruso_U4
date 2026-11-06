// Arrastrar y soltar «casos» entre zonas (tray + zonas) con respaldo de clic para cambiar de columna.
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { PI } from '../engine.js';
import { flipMove } from './util.js';

gsap.registerPlugin(Draggable);

export function makeSorter(s, { cardSel = '.case', order = ['tray', 'negra', 'gris', 'blanca'] } = {}) {
  const cards = [...s.querySelectorAll(cardSel)];
  const zone = n => s.querySelector(`[data-zone="${n}"]`), body = z => z.querySelector('.zb') || z;
  const st = { locked: false, saved: null, calls: [] };

  function place(card, name, animate = true) {
    flipMove(cards, () => {
      body(zone(name)).appendChild(card); gsap.set(card, { x: 0, y: 0, scale: 1 });
      card.dataset.z = name; card.classList.toggle('placed', name !== 'tray');
    }, { animate });
  }
  const cur = c => c.dataset.z || 'tray';

  cards.forEach(card => {
    Draggable.create(card, {
      type: 'x,y', zIndexBoost: true,
      onPress() { if (!st.locked) gsap.to(card, { scale: 1.04, duration: 0.15 }); },
      onRelease() {
        if (st.locked) return;
        gsap.to(card, { scale: 1, duration: 0.15 });
        if (this.pointerEvent) {
          const pe = this.pointerEvent.changedTouches ? this.pointerEvent.changedTouches[0] : this.pointerEvent;
          // se ignora la propia tarjeta arrastrada (vive dentro de la bandeja y taparía la zona de destino)
          const z = document.elementsFromPoint(pe.clientX, pe.clientY).filter(e => !card.contains(e)).map(e => e.closest && e.closest('[data-zone]')).find(Boolean);
          if (z && Math.abs(this.x) + Math.abs(this.y) > 12) { place(card, z.dataset.zone); return; }
        }
        gsap.to(card, { x: 0, y: 0, duration: 0.3, ease: 'power3.out' });
      },
      onClick() { if (!st.locked) place(card, order[(order.indexOf(cur(card)) + 1) % order.length]); }
    });
  });

  // Revelar: primero ✓/✗ de lo votado; luego los casos mal puestos se deslizan a su columna.
  function reveal({ instant = false } = {}) {
    if (st.locked) return;
    st.locked = true; st.saved = cards.map(cur);
    const mark = c => { c.classList.remove('ok', 'bad'); c.classList.add(cur(c) === c.dataset.ok ? 'ok' : 'bad'); };
    const why = c => { c.querySelector('.cw').textContent = '✓ ' + c.dataset.why; };
    if (instant || !PI.fx) {
      cards.forEach(c => { if (cur(c) !== c.dataset.ok) place(c, c.dataset.ok, false); c.classList.add('ok'); why(c); });
      return;
    }
    cards.forEach(mark);
    const wrong = cards.filter(c => cur(c) !== c.dataset.ok);
    const showWhy = c => { why(c); gsap.fromTo(c.querySelector('.cw'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }); };
    wrong.forEach((c, i) => st.calls.push(gsap.delayedCall(1.5 + i * 0.7, () => { place(c, c.dataset.ok); c.classList.remove('bad'); c.classList.add('ok'); st.calls.push(gsap.delayedCall(0.7, () => showWhy(c))); })));
    cards.filter(c => !wrong.includes(c)).forEach((c, i) => st.calls.push(gsap.delayedCall(1.2 + i * 0.1, () => showWhy(c))));
  }
  function unreveal() {
    if (!st.locked) return;
    st.calls.forEach(c => c.kill()); st.calls = []; gsap.killTweensOf(cards);
    st.locked = false;
    cards.forEach((c, i) => { c.classList.remove('ok', 'bad'); c.querySelector('.cw').textContent = ''; if (st.saved && cur(c) !== st.saved[i]) place(c, st.saved[i], false); });
    st.saved = null;
  }
  return { cards, reveal, unreveal, place, get locked() { return st.locked; } };
}

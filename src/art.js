// Ilustración «lupa»: redibujada en SVG a partir del estilo 4 para poder animarla.
const NAVY = '#1a2352', CREAM = '#fff6f1', BLUE = '#4a6ce7', PERI = '#93a4ec';

export function scanArt(id) {
  return `<svg class="scan" viewBox="0 0 720 526" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="gl${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8ea2f2"/><stop offset="1" stop-color="#6f88ee"/></linearGradient>
    <radialGradient id="gw${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e4e8ff" stop-opacity=".95"/><stop offset="1" stop-color="#e4e8ff" stop-opacity="0"/></radialGradient>
    <clipPath id="cw${id}"><rect x="70" y="60" width="280" height="220" rx="14"/></clipPath>
  </defs>
  <g class="a-glass"><rect x="500" y="130" width="260" height="270" rx="30" fill="url(#gl${id})"/><ellipse cx="615" cy="300" rx="120" ry="78" fill="url(#gw${id})"/></g>
  <path class="a-wave" d="M -10 175 C 40 150, 90 215, 150 215 S 250 120, 330 190 S 420 330, 480 300 S 560 190, 610 250 S 640 330, 700 290" fill="none" stroke="${NAVY}" stroke-width="3.5" stroke-linecap="round"/>
  <g class="a-browser">
    <rect x="70" y="60" width="280" height="220" rx="14" fill="${CREAM}"/>
    <g clip-path="url(#cw${id})"><rect x="70" y="60" width="280" height="38" fill="#e1e4fa"/></g>
    <circle cx="92" cy="79" r="5" fill="${NAVY}"/><circle cx="107" cy="79" r="5" fill="${NAVY}"/><circle cx="122" cy="79" r="5" fill="${NAVY}"/>
    <rect x="150" y="66" width="92" height="16" rx="6" fill="#f4f2ff"/>
    <circle cx="125" cy="165" r="30" fill="${BLUE}"/>
    <rect x="175" y="145" width="140" height="14" rx="7" fill="${BLUE}"/><rect x="175" y="168" width="60" height="12" rx="6" fill="${BLUE}"/><rect x="243" y="168" width="72" height="12" rx="6" fill="#d9dcf6"/><rect x="175" y="190" width="130" height="12" rx="6" fill="${BLUE}"/>
  </g>
  <g class="a-doc">
    <rect x="200" y="320" width="190" height="190" rx="14" fill="${CREAM}"/>
    <g fill="${NAVY}" opacity=".6"><rect x="224" y="352" width="62" height="3" rx="1.5"/><rect x="296" y="352" width="30" height="3" rx="1.5"/><rect x="224" y="378" width="96" height="3" rx="1.5"/><rect x="224" y="404" width="52" height="3" rx="1.5"/><rect x="286" y="404" width="44" height="3" rx="1.5"/><rect x="224" y="430" width="108" height="3" rx="1.5"/><rect x="224" y="456" width="70" height="3" rx="1.5"/></g>
    <rect x="224" y="378" width="40" height="3" rx="1.5" fill="${BLUE}"/><rect x="292" y="456" width="28" height="3" rx="1.5" fill="${BLUE}"/>
  </g>
  <g class="a-lens">
    <circle cx="410" cy="330" r="86" fill="#c9d3ff" fill-opacity=".72" stroke="${NAVY}" stroke-width="16"/>
    <path d="M356 300 A62 62 0 0 1 396 262" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="6" stroke-linecap="round"/>
    <line x1="474" y1="394" x2="548" y2="468" stroke="${NAVY}" stroke-width="22" stroke-linecap="round"/>
    <line x1="526" y1="446" x2="556" y2="476" stroke="${NAVY}" stroke-width="32" stroke-linecap="round"/>
  </g>
  <g class="a-cursor"><path d="M0 0 L0 38 L10 29 L18 47 L26 43 L18 26 L32 26 Z" fill="${NAVY}" stroke="${CREAM}" stroke-width="3" stroke-linejoin="round"/></g>
</svg>`;
}

export function mountArt() {
  document.querySelectorAll('[data-art="scan"]').forEach((n, i) => { n.innerHTML = scanArt('x' + i); });
}

// Entrada de la ilustración y bucle ambiental (lupa que barre + cursor que dibuja la línea).
export function playScan(svg, { gsap, animate, fx, delay = 0, own }) {
  const q = c => svg.querySelector(c);
  const browser = q('.a-browser'), doc = q('.a-doc'), glass = q('.a-glass'), lens = q('.a-lens'), wave = q('.a-wave'), cur = q('.a-cursor');
  const len = wave.getTotalLength();
  wave.style.strokeDasharray = len;
  const place = p => {
    const pt = wave.getPointAtLength(Math.max(0, Math.min(1, p)) * len);
    cur.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    wave.style.strokeDashoffset = len * (1 - p);
  };
  const loops = () => {
    const prog = { p: 0 };
    own(gsap.to(lens, { x: -190, y: -85, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9 });
    tl.set(cur, { opacity: 1 }, 0).set(wave, { opacity: 1 }, 0)
      .fromTo(prog, { p: 0 }, { p: 1, duration: 5, ease: 'power1.inOut', onUpdate: () => place(prog.p) }, 0)
      .to([cur, wave], { opacity: 0, duration: 0.35 }, '+=.4');
    own(tl);
  };
  gsap.set([browser, doc, glass, lens], { clearProps: 'transform,opacity,visibility' });
  gsap.set([wave, cur], { clearProps: 'opacity,visibility' });
  if (!animate) { place(1); if (fx) loops(); return; }
  place(0);
  gsap.set(browser, { y: -40, autoAlpha: 0 }); gsap.set(doc, { y: 50, autoAlpha: 0 });
  gsap.set(glass, { x: 70, autoAlpha: 0 }); gsap.set(lens, { svgOrigin: '410 330', scale: 0, autoAlpha: 0 });
  const tl = gsap.timeline({ delay: delay + 0.15 });
  tl.to(browser, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' })
    .to(doc, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, '<.1')
    .to(glass, { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, '<.1')
    .to(lens, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.8)' }, '<.15')
    .add(() => { gsap.set(lens, { clearProps: 'transform' }); loops(); });
  own(tl);
}

// Cubos isométricos (caja negra / gris / blanca) en el estilo Plano.
export function cubeArt(kind) {
  const N = '#1a2352';
  const C = { negra: ['#3a4690', '#1a2352', '#10163a'], gris: ['#e2e7fa', '#aab4de', '#8f9bd0'], blanca: ['#ffffff', '#f2ecf0', '#fff6f1'] }[kind];
  const op = kind === 'gris' ? ' fill-opacity=".88"' : '';
  const faces = `<polygon points="150,60 210,95 150,130 90,95" fill="${C[0]}"${op}/><polygon points="90,95 150,130 150,200 90,165" fill="${C[1]}"${op}/><polygon points="150,130 210,95 210,165 150,200" fill="${C[2]}"${op}/>`;
  const edges = `<g fill="none" stroke="${N}" stroke-width="5" stroke-linejoin="round"><polygon points="150,60 210,95 210,165 150,200 90,165 90,95"/><polyline points="90,95 150,130 210,95"/><line x1="150" y1="130" x2="150" y2="200"/></g>`;
  let mark = '';
  if (kind === 'negra') mark = `<g transform="translate(150,130) skewY(-30)"><text class="q" x="30" y="54" text-anchor="middle" font-size="58" font-weight="700" fill="#ffd54a" font-family="Space Grotesk">?</text></g>`;
  if (kind === 'gris') mark = `<g transform="translate(90,95) skewY(30)"><g class="ck"><circle cx="18" cy="38" r="9" fill="#ffd54a" stroke="${N}" stroke-width="3.5"/><line x1="27" y1="38" x2="50" y2="38" stroke="${N}" stroke-width="5" stroke-linecap="round"/><line x1="42" y1="38" x2="42" y2="46" stroke="${N}" stroke-width="4" stroke-linecap="round"/><line x1="49" y1="38" x2="49" y2="44" stroke="${N}" stroke-width="4" stroke-linecap="round"/></g></g>`;
  if (kind === 'blanca') mark = `<g transform="translate(150,130) skewY(-30)"><rect class="cl" x="8" y="16" width="34" height="6" rx="3" fill="#4a6ce7"/><rect class="cl" x="14" y="30" width="38" height="6" rx="3" fill="${N}"/><rect class="cl" x="14" y="44" width="24" height="6" rx="3" fill="#ffd54a"/><rect class="cl" x="8" y="58" width="42" height="6" rx="3" fill="#4a6ce7"/></g>`;
  return `<svg class="cube-svg" viewBox="55 50 190 190" aria-hidden="true"><ellipse class="shadow" cx="150" cy="226" rx="70" ry="12" fill="${N}" opacity=".18"/><g class="cube">${faces}${mark}${edges}</g></svg>`;
}
export function mountCubes() {
  document.querySelectorAll('[data-art^="cube-"]').forEach(n => { n.innerHTML = cubeArt(n.dataset.art.slice(5)); });
}

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

// Esferas «cuánto se ve del interior» (caja negra / gris / blanca): redondas, con red interna y una sonda que orbita.
export const ORB_NODES = [[110, 92], [172, 86], [130, 132], [190, 128], [150, 160], [98, 142]];
export const ORB_EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4], [2, 5], [5, 4]];
export function orbArt(kind) {
  const N = '#1a2352', B = '#4a6ce7', Y = '#ffd54a';
  const body = { negra: `fill="${N}"`, gris: 'fill="#aab4de" fill-opacity=".62"', blanca: 'fill="#ffffff"' }[kind];
  const edges = ORB_EDGES.map(([a, b]) => `<line class="oe" x1="${ORB_NODES[a][0]}" y1="${ORB_NODES[a][1]}" x2="${ORB_NODES[b][0]}" y2="${ORB_NODES[b][1]}"/>`).join('');
  const nodes = ORB_NODES.map(([x, y], i) => `<circle class="on" data-i="${i}" cx="${x}" cy="${y}" r="9"/>`).join('');
  const inner = kind === 'negra' ? '' : `<g class="inner inner-${kind}"><g class="edges" stroke="${N}" stroke-width="3.5" stroke-linecap="round">${edges}</g><g class="nodes" stroke="${N}" stroke-width="3.5">${nodes}</g></g>`;
  const shine = kind === 'negra' ? `<ellipse cx="116" cy="74" rx="30" ry="15" transform="rotate(-32 116 74)" fill="#fff" opacity=".2"/>`
    : `<ellipse cx="116" cy="72" rx="30" ry="14" transform="rotate(-32 116 72)" fill="#fff" opacity="${kind === 'gris' ? '.55' : '.9'}"/>`;
  return `<svg class="orb-svg" viewBox="0 0 300 250" aria-hidden="true">
    <ellipse class="shadow" cx="150" cy="232" rx="64" ry="11" fill="${N}" opacity=".18"/>
    <ellipse class="orbit" cx="150" cy="118" rx="128" ry="36" transform="rotate(-18 150 118)" fill="none" stroke="${N}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="4 9" stroke-linecap="round"/>
    <g class="orb">
      <circle class="sph" cx="150" cy="118" r="88" ${body} stroke="${N}" stroke-width="6"/>
      ${inner}${shine}
      <circle class="pulse" cx="150" cy="118" r="88" fill="none" stroke="${Y}" stroke-width="5" opacity="0"/>
    </g>
    <circle class="probe" cx="150" cy="118" r="10" fill="${Y}" stroke="${N}" stroke-width="4"/>
  </svg>`;
}
export function mountOrbs() {
  document.querySelectorAll('[data-art^="orb-"]').forEach(n => { n.innerHTML = orbArt(n.dataset.art.slice(4)); });
}

/* ======== Bloque 2 ======== */
// Kali: un núcleo redondo con herramientas que orbitan (las nombradas en la investigación y «cientos» más).
export const KALI_NAMED = [['Nmap', 20], ['Wireshark', 140], ['Metasploit', 260]];
export function kaliArt() {
  const N = '#1a2352';
  const small = [];
  for (let i = 0; i < 12; i++) small.push(`<circle class="ks" data-r="215" data-a="${i * 30 + 8}" data-v="-4" r="${i % 3 ? 13 : 18}" fill="${i % 2 ? '#93a4ec' : '#dfe4fb'}" stroke="${N}" stroke-width="4"/>`);
  for (let i = 0; i < 16; i++) small.push(`<circle class="ks" data-r="275" data-a="${i * 22.5 + 4}" data-v="3" r="${i % 3 ? 11 : 15}" fill="${i % 2 ? '#dfe4fb' : '#93a4ec'}" stroke="${N}" stroke-width="4"/>`);
  const named = KALI_NAMED.map(([t, a]) => `<g class="kn" data-r="150" data-a="${a}" data-v="6"><g class="kni"><circle r="54" fill="#ffd54a" stroke="${N}" stroke-width="6"/><text y="6" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="${t.length > 8 ? 18 : 22}" fill="${N}">${t}</text></g></g>`).join('');
  return `<svg class="kali-svg" viewBox="0 0 848 628" aria-hidden="true">
    <g fill="none" stroke="${N}" stroke-opacity=".28" stroke-width="3" stroke-dasharray="3 10" stroke-linecap="round"><circle cx="424" cy="314" r="150"/><circle cx="424" cy="314" r="215"/><circle cx="424" cy="314" r="275"/></g>
    <g class="kcore"><circle cx="424" cy="314" r="84" fill="${N}"/><circle cx="424" cy="314" r="100" fill="none" stroke="#4a6ce7" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>
      <text x="424" y="308" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="38" fill="#fff6f1">Kali</text><text x="424" y="344" text-anchor="middle" font-family="Space Grotesk" font-weight="500" font-size="26" fill="#93a4ec">Linux</text></g>
    <circle class="kshock" cx="424" cy="314" r="92" fill="none" stroke="#ffd54a" stroke-width="6" opacity="0"/>
    <g class="kbubbles" transform="translate(424 314)">${small.join('')}${named}</g>
  </svg>`;
}

// Nmap: un escáner redondo que sondea tres dispositivos y sus puertos (22, 80 y 443 salen de los ejemplos del documento).
export function nmapArt() {
  const N = '#1a2352', ys = [130, 306, 482], open = [[1, 0, 1], [0, 1, 0], [0, 1, 1]];
  const dev = ys.map((y, d) => {
    const ports = [22, 80, 443].map((p, i) => `<g class="pt ${open[d][i] ? 'op' : 'cl'}" data-o="${610 + i * 70} ${y + 20}"><rect x="${584 + i * 70}" y="${y - 6}" width="52" height="52" rx="16"/><text x="${610 + i * 70}" y="${y + 80}" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="17">${p}</text></g>`).join('');
    const icon = [`<rect x="580" y="${y - 46}" width="44" height="32" rx="8"/><path d="M594 ${y - 10} H610"/>`, `<rect x="580" y="${y - 46}" width="44" height="12" rx="5"/><rect x="580" y="${y - 30}" width="44" height="12" rx="5"/>`, `<rect x="580" y="${y - 36}" width="44" height="20" rx="8"/><path d="M590 ${y - 36} L584 ${y - 48} M614 ${y - 36} L620 ${y - 48}"/>`][d];
    return `<g class="g1 dev" data-cy="${y + 18}"><rect x="560" y="${y - 70}" width="270" height="${176}" rx="26" fill="#fff6f1" stroke="${N}" stroke-width="5"/><g fill="#dfe4fb" stroke="${N}" stroke-width="4" stroke-linecap="round">${icon}</g><text x="640" y="${y - 24}" font-family="JetBrains Mono" font-weight="700" font-size="15" fill="#4a6ce7" letter-spacing="2">DISPOSITIVO ${d + 1}</text><g class="g2">${ports}</g></g>`;
  }).join('');
  const lines = ys.map((y, i) => `<path class="g1 probe" d="M176 306 C 320 306, 400 ${y}, 556 ${y + 18}" fill="none" stroke="${N}" stroke-width="4" stroke-dasharray="8 10" stroke-linecap="round"/>`).join('');
  return `<svg class="nmap-svg" viewBox="0 0 878 612" aria-hidden="true">
    <g class="g4"><rect class="surf" x="540" y="40" width="310" height="540" rx="40" fill="none" stroke="#4a6ce7" stroke-width="5" stroke-dasharray="14 12"/><g class="surf-l"><rect x="560" y="14" width="270" height="40" rx="20" fill="#ffd54a" stroke="${N}" stroke-width="4"/><text x="695" y="41" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="18" fill="${N}" letter-spacing="1.5">SUPERFICIE DE ATAQUE</text></g></g>
    ${lines}
    <g class="ping"><circle cx="110" cy="306" r="64" fill="none" stroke="#4a6ce7" stroke-width="4"/><circle cx="110" cy="306" r="64" fill="none" stroke="#4a6ce7" stroke-width="4"/></g>
    <g class="scanner"><circle cx="110" cy="306" r="66" fill="${N}"/><text x="110" y="316" text-anchor="middle" font-family="Space Grotesk" font-weight="700" font-size="30" fill="#fff6f1">Nmap</text></g>
    ${dev}
    ${ys.map(() => `<circle class="pk" r="10" fill="#ffd54a" stroke="${N}" stroke-width="4" opacity="0"/>`).join('')}
    <g class="g3 legend"><rect x="40" y="540" width="30" height="30" rx="10" fill="#ffd54a" stroke="${N}" stroke-width="4"/><text x="82" y="562" font-family="Space Grotesk" font-weight="700" font-size="20" fill="${N}">servicio activo</text><rect x="260" y="540" width="30" height="30" rx="10" fill="#fff6f1" stroke="#93a4ec" stroke-width="4"/><text x="302" y="562" font-family="Space Grotesk" font-weight="500" font-size="20" fill="#4a6ce7">cerrado</text></g>
  </svg>`;
}
export function mountB2() {
  document.querySelectorAll('[data-art="kali"]').forEach(n => { n.innerHTML = kaliArt(); });
  document.querySelectorAll('[data-art="nmap"]').forEach(n => { n.innerHTML = nmapArt(); });
}

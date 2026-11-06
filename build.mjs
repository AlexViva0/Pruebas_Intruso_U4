// Construye Pruebas_Intruso_U4.html: un solo archivo, sin internet (JS, CSS, fuentes y recursos embebidos).
import fs from 'fs';
import path from 'path';
import { build } from 'esbuild';

const OUT = 'Pruebas_Intruso_U4.html';
const read = p => fs.readFileSync(p, 'utf8');
const b64 = p => fs.readFileSync(p).toString('base64');

// 1) JS (GSAP + motor + efectos por lámina)
const res = await build({ entryPoints: ['src/main.js'], bundle: true, minify: true, format: 'iife', write: false, target: 'es2020', legalComments: 'none' });
const js = res.outputFiles[0].text.replace(/<\/(script)/gi, '<\\/$1');

// 2) CSS + fuentes embebidas (subconjunto latino: cubre todos los acentos del español)
const FONTS = [
  ['Space Grotesk', 400, '@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2'],
  ['Space Grotesk', 500, '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff2'],
  ['Space Grotesk', 700, '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2'],
  ['JetBrains Mono', 500, '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2'],
  ['JetBrains Mono', 700, '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2']
];
const fontCss = FONTS.map(([fam, w, f]) =>
  `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;font-display:block;src:url(data:font/woff2;base64,${b64(path.join('node_modules', f))}) format('woff2')}`).join('\n');
const css = fontCss + '\n' + read('src/styles.css');

// 3) Láminas en orden (src/slides/NN-nombre.html)
const files = fs.readdirSync('src/slides').filter(f => f.endsWith('.html')).sort();
let slides = files.map(f => read(path.join('src/slides', f))).join('\n');

// 4) Recursos locales: src="assets/x.png" → data URI
const MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', webp: 'image/webp' };
slides = slides.replace(/src="(assets\/[^"]+)"/g, (_, p) => `src="data:${MIME[path.extname(p).slice(1)] || 'application/octet-stream'};base64,${b64(p)}"`);

const html = read('src/template.html')
  .replace('/*CSS*/', () => css)
  .replace('<!--SLIDES-->', () => slides)
  .replace('/*JS*/', () => js);
fs.writeFileSync(OUT, html);
console.log('OK', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB', '|', files.length, 'láminas');

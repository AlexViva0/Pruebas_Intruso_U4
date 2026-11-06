# Pruebas de intruso · Unidad 4 (Ciberseguridad)

Presentación en un solo HTML (sin internet) con estilo «Plano» y animaciones GSAP + SVG.

- `src/slides/NN-nombre.html` → una lámina por archivo, en orden.
- `src/fx/*.js` → animaciones propias de cada lámina (`defineSlide('id', { enter, step, leave })`).
- `src/engine.js` → motor: escala 1920×1080, navegación, pasos, transición con barrido, notas.
- `src/art.js` → ilustración «lupa» en SVG (animada). `src/styles.css` → estilo.
- `mockups/` → los 4 estilos que se compararon (se eligió el 4, «Plano»). `assets/` → imágenes de referencia.
- `build.mjs` → genera `Pruebas_Intruso_U4.html` (JS, CSS, fuentes y recursos embebidos).

```bash
npm install
npm run build     # genera Pruebas_Intruso_U4.html
```

## Teclas
→ / Espacio / Enter / clic (derecha) avanzan · ← / Retroceso / clic (25 % izquierdo) retroceden ·
Inicio / Fin · **N** notas del orador · **F** pantalla completa · **X** efectos on/off (también respeta `prefers-reduced-motion`).

## Cómo añadir una lámina
1. Crea `src/slides/NN-nombre.html` con `<section class="slide" data-id="…" data-title="…" data-tag="…" data-band="…" data-notes="nota 1|nota 2">`.
2. `data-anim="up|left|right|pop|stamp|fade"` en los elementos que entran solos; `data-step="1..n"` en los que salen con cada flecha (o `data-steps="n"` si los pasos los maneja un gancho).
3. Si necesita animación propia: `src/fx/<id>.js` con `defineSlide` e impórtalo en `src/main.js`.
4. `npm run build` y recorre el deck con las flechas.

### Láminas de tarjetas («una a la vez»)
Para N tarjetas que se explican por turnos: `data-steps="N"` y un `<div class="abs fdeck" data-layout="split|band|col">` con tarjetas
`<div class="card fc"><div class="fc-n">1</div><div class="fc-tx"><div class="fc-h">Título</div><div class="fc-p">Texto con <b>clave</b></div></div><div class="fc-art" data-scene="id-1"></div></div>`.
Paso 0 = tarjeta 1 a todo el ancho con su escena; cada → cambia de tarjeta; el último → junta las N en tamaño reducido.
Regístrala con `defineFocus('id')` (`src/fx/focus.js`). Las escenas viven en `src/scenes.js` y se animan con atributos
`data-bob`, `data-flow`, `data-seq`, `data-ripple`, `data-draw`… (lista completa en `src/fx/svgfx.js`).
Las láminas sin tarjetas por turnos (tablas, comandos de Nmap) se animan solas hasta su estado final al entrar.

## Estado
- [x] Motor, estilo y transiciones · 01 Portada · 02 Temario (con pasos por clase)
- [x] **Clase 1 · Repaso exprés** · 03 Pentest y marco legal · 04 Cajas negra/gris/blanca · 05 Metodologías y fases · **A1** Repaso relámpago (V/F)
- [x] **Clase 1 · Herramientas de software** · 07 Kali · 08 Nmap esencial · 09 Metasploit · 10 Burp Suite · 11 Wireshark · **A2** Memorama · **A3** ¿Qué hace cada herramienta? (arrastrar) · **A4** Quiz (14–18)
- [x] **Clase 2 · SET** · 19–22 teoría · **A5** ¿Es phishing? · **A6** Detective del correo · **A7** Antes de lanzar la campaña
- [x] **Clase 2 · Escáneres** · 26 intro · 27 Nessus · 28 OpenVAS · 29 ZAP · 30 Nikto · 31 CVE/CVSS (repaso) · 32 comparativa · **A8** Elige tu escáner · **A9** ¿Quién lo encontró? · **A10** Quiz (35–39)
- [x] **Clase 3 · Síntesis y cierre** · 40 flujo por fase · 41–42 tablas 5.1 y 5.2 · 43 conclusiones · **A11** Armen el pentest · **A12** Ruleta de preguntas · **A13** Quiz final (46–53) · 54 referencias · 55 cierre

Animaciones: formas **redondas** y propias (esferas para caja negra/gris/blanca, órbita de Kali, pared y sonda para el pentest); no se reutilizan las del deck de otro equipo.

Actividades: la etiqueta amarilla muestra el código (A1…); **T** inicia/pausa el cronómetro (`data-time`); **→** revela la respuesta.
**Regla del proyecto:** todo el contenido sale de la investigación (`Unidad 4 - Pruebas de Intruso - Investigacion Ampliada`); nada de fuera.

## Afinado de animaciones · noviembre de 2026

- Repaso de pentest: se activan las tres escenas; el radar sincroniza barrido, detección y ondas de respuesta.
- Kali: órbitas elípticas, profundidad de las burbujas, halo giratorio y señales hacia las herramientas.
- Escáneres: radar con estela y catálogo sincronizado; servidores ajustados al tamaño de cada dibujo.
- Conexiones SVG: paquetes con estela direccional y halo de recepción; geometría precalculada.
- CVSS: aguja y marcador comparten un único valor animado, con pausas para facilitar la lectura.
- Ruleta (`src/fx/ruleta.js`): luces, aceleración/desaceleración, resultado central, contador y selección sin repeticiones. Un giro interrumpido queda resuelto al regresar; Enter/Espacio funcionan sobre el botón enfocado.
- Las tarjetas cancelan sus entradas y bucles al cambiar de estado. `X` también desactiva transiciones CSS; se respeta la preferencia del sistema de reducir movimiento.

Validación en Chromium: recorrido de las 55 láminas y todos sus pasos, navegación rápida de las tarjetas, sincronía CVSS, giro interrumpido, siete preguntas y reinicio, efectos desactivados y movimiento reducido. Sin errores ni advertencias de consola. El HTML sigue siendo autónomo y funciona sin conexión.

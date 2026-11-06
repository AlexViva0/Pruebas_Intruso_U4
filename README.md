# Pruebas de intruso · Unidad 4 (Lenguajes de Interfaz)

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

## Estado
- [x] Motor, estilo y transiciones · 01 Portada · 02 Temario (con pasos por clase)
- [x] **Bloque 1** · 03 ¿Qué es una prueba de intrusión? · 04 Marco legal y ético · 05 Caja negra, gris y blanca · 06 Metodologías · 07 Las 5 fases · **A1** ¿Qué tipo de pentest? (arrastrar) · **A2** Ordena las fases (clic para intercambiar)
- [ ] Bloques 2–5 (teoría y actividades A3–A10), según `Unidad 4 - Pruebas de Intruso - Investigación Ampliada`.

Actividades: la etiqueta amarilla muestra el código (A1…); **T** inicia/pausa el cronómetro (`data-time`); **→** revela la respuesta.
**Regla del proyecto:** todo el contenido sale de la investigación (`Unidad 4 - Pruebas de Intruso - Investigacion Ampliada`); nada de fuera.

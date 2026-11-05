# FigurasSVG

Figuras del libro de 2º ESO hechas con HTML + CSS + JavaScript (SVG en línea).
De cada `.html` se obtiene un `.pdf` vectorial (el que se incluye en LaTeX) y un `.svg`,
de modo que las figuras no pierden calidad al ampliarlas (antes se exportaban a PNG).

## Estructura

```
FigurasSVG/
├── exportar.mjs          # HTML -> PDF (Chrome/Edge headless) -> recorte -> SVG (pdftocairo)
├── recortar.py           # recorta el margen blanco del PDF (PyMuPDF); sigue siendo vectorial
├── aplicar_tex.mjs       # sustituye en los .tex las imágenes PNG (Unit_x/nombre) por los PDF
├── cambiar_ancho.mjs     # cambia el ancho de una figura ya insertada
├── comun/
│   └── pagina.js         # lo incluye cada figura: imprime fondos y ajusta la página al tamaño de la figura
└── Unit_x_Nombre/
    ├── fuentes/          # UN .html por figura (código fuente, editable) + style.css y .js de la unidad
    ├── pdf/              # PDF generado (lo que usa LaTeX)
    └── svg/              # SVG generado
```

Los nombres de las figuras son los mismos que tenían los PNG (`images/Unit_x/nombre.png`).

| Unidad | Figuras |
|---|---|
| Unit 0 Math Tools (`MathTools.tex`) | 8 |
| Unit 1 Matter and measurement | 32 |
| Unit 2 States of matter | 23 |
| Unit 3 Diversity of matter | 16 |
| Unit 4 Nomenclature (`Unit_4_nomenclature_EN_ES.tex`) | 27 (ver nota) |
| Unit 5 Change of matter | 17 |
| Unit 6 Chemical reactions | 8 |
| Unit 7 Motion | 11 |
| Unit 8 Forces | 6 |
| Unit 9 Energy | 15 |

**Unit 4 Nomenclature** no sigue este sistema: sus figuras salen de un único HTML,
`Unit_4_Nomenclature/html/figuras_inorganica.html` (copiado de `src/Formulacion/inorganica/images/html/`; las versiones
en inglés llevan el sufijo `-en`), y se exportan con `python html/exportar_figuras.py <id> …` (Playwright + PyMuPDF),
que escribe en `Unit_4_Nomenclature/pdf/` y `svg/`. Como no tiene carpeta `fuentes/`, `exportar.mjs` la ignora.

Las unidades se renumeraron en octubre de 2026: la antigua 4 (Change of Matter) se dividió en 5 y 6,
la antigua 5 (Forces and Motion) en 7 (Motion) y 8 (Forces), y Energy pasó de 6 a 9.
Las carpetas `images/Unit_x/` (PNG originales) y las etiquetas `fig:ux_…` siguen la numeración nueva.

(Algunas no están en el libro porque su `\includegraphics` está comentado; se exportan igualmente.)

## Flujo de trabajo

1. Editar `Unit_x_.../fuentes/*.html` (se puede abrir en el navegador para ver la figura).
   Cada HTML debe llevar en el `<head>`: `<script src="../../comun/pagina.js"></script>`.
2. Exportar desde esta carpeta:
   ```
   node exportar.mjs                                  # todo (≈ 4-5 min)
   node exportar.mjs Unit_2_State_of_Matter           # una unidad
   node exportar.mjs Unit_2_State_of_Matter boyle     # figuras que empiezan por "boyle"
   ```
3. En los `.tex` la imagen original queda **comentada** y debajo va la nueva:
   ```latex
   % [FIGURA ORIGINAL] \includegraphics[width=\textwidth]{Unit_2/boyle_law}
   \includegraphics[width=\textwidth]{FigurasSVG/Unit_2_State_of_Matter/pdf/boyle_law.pdf}
   ```
   Para una figura nueva: crear su HTML, exportarla, poner en el `.tex`
   `\includegraphics[...]{Unit_x/nombre}` y ejecutar `node aplicar_tex.mjs`
   (es idempotente; con `--prueba` solo muestra lo que haría).
   Para ajustar el tamaño: `node cambiar_ancho.mjs boyle_law 0.8`.

Requisitos: Chrome o Edge, Node, Python con PyMuPDF (`pip install pymupdf`) y `pdftocairo`
(viene con MiKTeX). Se incluye el PDF y no el SVG porque `\includesvg` necesita Inkscape y `--shell-escape`.

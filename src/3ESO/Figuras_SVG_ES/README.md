# Figuras SVG – Libro 3º ESO (versión española)

Figuras vectoriales que sustituyen a las imágenes raster del libro en español (`Libro_3_ESO_ES.tex`).
Son la traducción de `../Figuras_SVG_ENG/`: mismo dibujo, rótulos en español
(y coma decimal en la factura de la luz). Un cambio en el dibujo hay que hacerlo en las dos carpetas.

```
Figuras_SVG_ES/
├── fuentes/   HTML + CSS + JS que dibujan cada figura (una por archivo)
├── lib/       comun.js (utilidades) y smiles-drawer.min.js (SMILES → geometría 2D)
├── svg/       SVG generados (editables, p. ej. con Inkscape)
├── pdf/       PDF vectoriales que se incluyen en LaTeX con \includegraphics
└── exportar.js
```

| Archivo | Unidad | Etiqueta LaTeX | Imagen original |
|---|---|---|---|
| U3_dinamometro | 3 | fig:dinamometro | Images/dinamica/dinanometro.jpg |
| U4_trabajo_desplazamiento | 4 | fig:trabajo | Images/energia/trabajo_imagen.png |
| U4_factura_luz | 4 | fig:factura_luz | Images/energia/factura_luz.jpg |
| U6_numero_masico_atomico | 6 | fig:massatomic | Images/SP_atomo/z_a_atomica_figura.pdf |
| U8_reaccion_carbono_oxigeno | 8 | fig:reaccion_quimica | Images/reacciones_quimicas/reaccion_quimica_gemini.png |
| U8_reaccion_proceso_H2_Cl2 | 8 | fig:reaccion_quimica_proceso | Images/reacciones_quimicas/reaccion_quimica_proceso_gemini.png |
| U8_conservacion_masa | 8 | fig:conservacion_masa | Images/reacciones_quimicas/conservacion_masa_EN.png |

## Regenerar las figuras

Tras editar un archivo de `fuentes/`:

```bash
node exportar.js                  # todas
node exportar.js U8_conservacion  # solo las que contienen ese texto
```

Hace falta Node.js y Google Chrome (o Edge); no se instala ningún paquete npm.
Para previsualizar, basta con abrir el HTML en el navegador.

## Por qué se incluye el PDF y no el SVG

pdflatex no admite SVG directamente: el paquete `svg` (`\includesvg`) necesita
Inkscape instalado y `--shell-escape`. El script convierte cada SVG en un PDF
vectorial (sin pérdida de calidad), que se incluye con `\includegraphics`.

## Fórmulas desarrolladas desde SMILES

`estructuraSMILES(padre, 'O=C=O', cx, cy)` usa SmilesDrawer para interpretar
el SMILES y calcular la geometría; los enlaces y símbolos se dibujan con SVG
simple para que se vean igual en el navegador, en el SVG y en el PDF.
Los hidrógenos deben escribirse explícitos: `[H]O[H]`, `[H]C([H])([H])[H]`.

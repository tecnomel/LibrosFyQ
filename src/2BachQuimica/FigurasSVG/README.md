# FigurasSVG

Figuras del libro rehechas con HTML + CSS + JavaScript (y SMILES para la química orgánica).
Cada figura es un `.html` que construye un `<svg>`; de él se obtiene un `.svg` y un `.pdf`
vectorial que es el que se incluye en LaTeX.

## Estructura

```
FigurasSVG/
├── exportar.mjs          # HTML -> SVG + PDF (Chrome/Edge headless, sin dependencias)
├── aplicar_tex.mjs       # sustituye en los .tex las imágenes originales por las nuevas
├── mapa_figuras.json     # imagen original -> figura nueva (y su anchura en LaTeX)
├── cambiar_ancho.mjs     # cambia el ancho de una figura ya insertada
├── crear_figuras.mjs     # crea varios HTML a partir de un archivo de "lote"
├── prueba_unidad.tex     # compila una unidad suelta para revisar sus figuras
├── comun/
│   ├── figura.css        # estilo común (Century Gothic ≈ Avant Garde de los títulos)
│   ├── svg.js            # el(), texto(), flecha(), tabla(), quim() (fórmulas), colores, tabla periódica
│   ├── tendencias.js     # "variación de una propiedad periódica" (UD2)
│   ├── 3d.js             # motor 3D: proyección, sombreado, orden de pintado, isosuperficies
│   ├── orbitales.js      # orbitales atómicos, híbridos, CLOA (σ, π, OM)
│   ├── moleculas.js      # bolas y varillas, geometrías TRPECV, esquemas A/B/X
│   ├── lewis.js          # estructuras de Lewis (pares, cargas formales, dativos, corchetes)
│   ├── cajas.js          # diagramas de cajas, configuraciones electrónicas
│   ├── graficas.js       # ejes, curvas, bisección, perfiles de energía
│   ├── valoraciones.js   # curvas de valoración ácido-base CALCULADAS (balance de cargas)
│   ├── pilas.js          # pila Daniell / puente salino
│   ├── organica.js       # moléculas desde SMILES (SmilesDrawer) y esquemas de reacción
│   ├── particulas.js     # bolas/moléculas planas, repartos aleatorios reproducibles (conocimientos básicos)
│   └── lib/smiles-drawer.min.js   # SmilesDrawer 2.4.1 (licencia MIT), copia local
└── UDx_Nombre/
    ├── fuentes/          # UN .html por figura (código fuente, editable)
    ├── svg/              # SVG generado
    └── pdf/              # PDF generado (lo que usa LaTeX)
```

Nombres: `UDx_NN_descripcion.html` (NN = orden de aparición en la unidad) y
`UDx_ENN_descripcion.html` para las figuras de los ejercicios.

| Unidad | Figuras |
|---|---|
| UD0 Conocimientos básicos (`Quimica2Bach_Conocimientos_Basicos*.tex` y ejercicios) | 9 + 3 de ejercicios (figuras nuevas) |
| UD1 Estructura atómica | 15 |
| UD2 Tabla periódica | 7 + 1 de ejercicios |
| UD3 Enlace químico | 59 + 2 de ejercicios |
| UD4 Termodinámica | 6 + 5 de ejercicios |
| UD5 Cinética | 8 |
| UD7 Ácido-base | 7 |
| UD8 Redox | 2 |
| UD9 Química orgánica | 43 + 7 de ejercicios |
| UD10 Polímeros (`Quimica2Bach_UD_10_Polimeros_Libro.tex`) | 7 (esquemas nuevos donde había `\marcador{poner esquema}`) |

## Flujo de trabajo

1. Editar `UDx_.../fuentes/*.html` (se puede abrir en el navegador para ver la figura).
2. Exportar desde esta carpeta:
   ```
   node exportar.mjs                               # todo
   node exportar.mjs UD3_Enlace_Quimico            # una unidad
   node exportar.mjs UD3_Enlace_Quimico UD3_20     # una figura
   ```
   Si el JavaScript de una figura falla, `exportar.mjs` muestra el error (`!`).
3. En los `.tex` la imagen original queda **comentada** y debajo va la nueva:
   ```latex
   % [FIGURA ORIGINAL] \includegraphics[scale=0.5]{images/imagesUD3EnlaceQuimico/UD3_Teoria/tetraedrica_CCl4}
   \includegraphics[width=0.6\linewidth]{FigurasSVG/UD3_Enlace_Quimico/pdf/UD3_20_geometria_tetraedrica_CCl4.pdf}
   ```
   Para una figura nueva: añadir la entrada en `mapa_figuras.json` y ejecutar `node aplicar_tex.mjs`
   (es idempotente: no duplica las que ya están). Para ajustar el tamaño:
   `node cambiar_ancho.mjs UD5_02_orden_cero 0.45`.
4. Probar una unidad (desde `LibroQuimica2Bach`):
   ```
   pdflatex "\def\unidad{Quimica2Bach_UD3_Enlace_Quimico_Libro_claude}\input{FigurasSVG/prueba_unidad.tex}"
   ```

Se incluye el PDF y no el SVG porque `\includesvg` necesita Inkscape y `--shell-escape`.

## Técnicas usadas

- **Cálculo real** en lugar de copiar a ojo: longitudes de onda de las series espectrales
  (Rydberg), curvas de valoración (balance de cargas), cinética H₂ + I₂ ⇌ 2 HI (integración
  numérica), parte angular de los orbitales (armónicos esféricos), redes cristalinas.
- **Motor 3D propio** (`3d.js`): superficies sombreadas y ordenadas en profundidad; las
  isosuperficies de enlaces σ/π y orbitales moleculares salen de combinaciones de orbitales (CLOA).
- **SMILES** (SmilesDrawer) para las moléculas orgánicas; los grupos genéricos (R, X, Nu, E,
  NO₂, SO₃H…) se escriben con átomos "comodín" (`[Xe]`, `[Kr]`…) que luego se sustituyen.

## Correcciones respecto a las imágenes originales

- UD2 tabla de Pauling: el elemento 81 es **Tl** (ponía Ti).
- UD3 polaridad: el BF₃ es **apolar** (ponía "polar, μ = 0").
- UD3 H₂S: el ángulo real es ≈ 92° (la imagen ponía 104,5°, que es el del agua).
- UD5: las figuras "exotérmica" y "endotérmica" estaban intercambiadas.
- UD9 alcohol terciario: grupo –OH (la imagen tenía –NH₂).
- UD9 eliminación de HX: se hace con base (KOH en etanol), no con H⁺.
- UD9 ejercicio 03_b: la estructura tenía un carbono con 5 enlaces; se dibuja el aldehído
  insaturado que describe la solución (2-metilenbutanal).
- UD7 indicadores: intervalos y colores ajustados a valores bibliográficos.

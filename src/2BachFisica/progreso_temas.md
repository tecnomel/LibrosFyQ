# Física 2.º Bachillerato — progreso de las unidades

Principal: `Fisica2BachLibroES.tex` (clase `LegrandOrangeBookES` y `estilocrispropioLibro` del texmf; color morado).
Cada unidad: `Fisica2Bach_UDn_<tema>_Libro.tex` (teoría + actividades resueltas + prácticas) y
`Fisica2Bach_UDn_<tema>_Ejercicios.tex` (ejercicios finales con solución). Soluciones en `out/soluciones2BachFis.tex`.

Fuentes en `Fuentes/` (PDF escaneados: no tienen texto, hay que leer las páginas como imagen).
Figuras: `images/UDn/html/*.js` (con `fig.js`) → `sh images/UDn/html/render.sh` → `images/UDn/*.pdf` y `svg/`.
Gráficas de funciones con pgfplots (estilo `fisica`, definido en el principal).
Portada y cabeceras: `images/portada_cabeceras/` (`sh images/portada_cabeceras/html/render.sh`; para una
unidad nueva, añadir una escena en `ESCENAS` de `dibujos.js` y una línea en la `LISTA` de `render.sh`).

| UD | Tema | Estado | Notas |
|---|---|---|---|
| 1 | Movimiento armónico simple | Hecha | Fuente `Tema1_Movimiento_Armonico_Simple.pdf`. 15 actividades resueltas en la teoría, 27 ejercicios, 2 prácticas, 7 figuras. Parte «Vibraciones y ondas». |
| 2 | Movimiento ondulatorio | Hecha | Fuente `Tema_2.pdf`. `Fisica2Bach_UD2_Ondas_Libro.tex` + `_Ejercicios.tex`. 22 actividades resueltas en la teoría, 34 ejercicios, 2 prácticas (Melde y tubo de resonancia), 15 figuras en `images/UD2/` + 4 gráficas pgfplots. Cabecera `cabecera_UD2` (escena `ondulatorio`). |
| 3 | Óptica geométrica | Hecha | Fuente `Tema_3.pdf`. `Fisica2Bach_UD3_Optica_Libro.tex` + `_Ejercicios.tex`. 25 actividades resueltas en la teoría, 28 ejercicios, 2 prácticas (ley de Snell y distancia focal de una lente), 22 figuras en `images/UD3/` (trazado de rayos con `optica.js`: `sistema({...})` dibuja espejos/lentes con los rayos principales). Convenio DIN. Cabecera `cabecera_UD3` (escena `optica`). |
| 4 | Interacción gravitatoria | Hecha | Fuente `Tema_4.pdf`. `Fisica2Bach_UD4_Gravitacion_Libro.tex` + `_Ejercicios.tex`. 16 actividades resueltas en la teoría, 31 ejercicios, 2 prácticas (3.ª ley de Kepler con las lunas de Júpiter; medida de g y masa de la Tierra), 10 figuras en `images/UD4/` (líneas de campo calculadas numéricamente). Abre la parte «Interacción gravitatoria». Vectores unitarios con `\vec{i}`, `\vec{j}` (mathptmx no tiene `\jmath`). Cabecera `cabecera_UD4` (escena `gravitacion`). |
| 5 | Campo eléctrico | Hecha | Fuente `Tema_5.pdf`. `Fisica2Bach_UD5_Electrico_Libro.tex` + `_Ejercicios.tex`. 14 actividades resueltas en la teoría, 26 ejercicios, 2 prácticas (equipotenciales en una cubeta; péndulo eléctrico), 12 figuras en `images/UD5/` (líneas de campo y equipotenciales calculadas con `lineasCampo()` de `fig.js`). Abre la parte «Interacción electromagnética». Tabla comparativa campo gravitatorio/eléctrico. Cabecera `cabecera_UD5` (escena `electrico`). |
| 6 | Campo magnético e inducción | Hecha | Fuente `Tema_6.pdf`. `Fisica2Bach_UD6_Magnetismo_Libro.tex` + `_Ejercicios.tex`. 18 actividades resueltas en la teoría, 34 ejercicios, 2 prácticas (experiencias de Faraday y Lenz; campo terrestre con brújula de tangentes), 17 figuras en `images/UD6/` (líneas de B calculadas como curvas de nivel de Σ I·ln r con `lineasB()` de `fig.js`). Misma parte «Interacción electromagnética». Cabecera `cabecera_UD6` (escena `magnetico`). |
| 7 | Física cuántica | Hecha | Fuente `Tema_7.pdf`. `Fisica2Bach_UD7_Cuantica_Libro.tex` + `_Ejercicios.tex`. 13 actividades resueltas en la teoría, 21 ejercicios, 2 prácticas (constante de Planck con LED; difracción de un láser en una red), 6 figuras en `images/UD7/` + 3 gráficas pgfplots (ley de Planck calculada, corriente fotoeléctrica, E_c frente a ν). Incluye los postulados de la relatividad y los espectros atómicos (como la fuente). Abre la parte «Física moderna». Cabecera `cabecera_UD7` (escena `cuantica`). |
| 8 | Física nuclear | Hecha | Fuente `Tema_8.pdf`. `Fisica2Bach_UD8_Nuclear_Libro.tex` + `_Ejercicios.tex`. 8 actividades resueltas en la teoría, 22 ejercicios, 2 prácticas (simulación de la desintegración con dados; radiactividad ambiental con contador Geiger), 7 figuras en `images/UD8/` + 3 gráficas pgfplots (E_e/A con la fórmula semiempírica, banda de estabilidad, ley de desintegración). El principal carga `\usepgfplotslibrary{fillbetween}`. Misma parte «Física moderna». Cabecera `cabecera_UD8` (escena `nuclear`). |

Antes de empezar cada tema nuevo, preguntar al usuario (orden, numeración, alcance).

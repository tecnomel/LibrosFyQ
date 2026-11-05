# LibrosFyQ

Libros de texto y apuntes de **Física y Química** en LaTeX para el alumnado del IES José Conde García (Almansa).
Autor: Cristóbal Melero.

Reúne en un único proyecto (PyCharm + TeXiFy, y Claude Code) los libros que antes estaban en proyectos separados.
Está pensado para ir creciendo con más cursos.

## Contenido

| Curso / material | Carpeta | PDF que se genera | Idioma |
|---|---|---|---|
| Física y Química 2.º ESO | `src/2ESO/` | `Libro_2_ESO_ESP.pdf`, `Libro_2_ESO_ENG.pdf` | ES / EN |
| Física y Química 3.º ESO | `src/3ESO/` | `Libro_3_ESO_ES.pdf`, `Libro_3_ESO_ENG.pdf` (+ pruebas escritas y situaciones de aprendizaje) | ES / EN |
| Física y Química 4.º ESO | `src/4ESO/` | `Libro_4_ESO_ES.pdf` | ES |
| Química 2.º Bachillerato | `src/2BachQuimica/` | `Qumica2BAchLibroES.pdf` | ES |
| Formulación inorgánica y orgánica | `src/Formulacion/` | apuntes y hojas de ejercicios (`inorganica_nuevo_2ESO.pdf`…) | ES / EN |
| Física 2.º Bachillerato | `src/2BachFisica/` | `Fisica2BachLibroES.pdf` (en curso: UD1) | ES |
| Física y Química 1.º Bachillerato | `src/BachFyQ1/` | `FyQ1BachLibroES.pdf` (completo: UD1-UD13) | ES |

## Estructura

```
LibrosFyQ/
├── CLAUDE.md        # instrucciones para Claude Code (estructura, compilación, convenciones)
├── README.md        # este fichero
├── cambios.md       # peticiones sobre el proyecto en general
├── src/             # fuentes: una carpeta por libro
│   ├── 2ESO/ 3ESO/ 4ESO/ 2BachQuimica/ Formulacion/ …
│   └── images/      # imágenes comunes (de momento vacía)
├── out/             # PDF y ficheros generados al compilar (no editar)
└── auxil/           # ficheros auxiliares de compilación del IDE (no editar)
```

Dentro de cada libro:
- un `.tex` principal (preámbulo, portada, partes y `\input` de las unidades) y un `.tex` por unidad;
- las figuras (`Images/`, `images/` o `FigurasSVG/`), hechas en HTML/SVG/JS y exportadas a PDF vectorial;
- ficheros `.md` con las peticiones y el progreso de ese libro (`cambios.md`, `progreso_temas.md`…).

## Requisitos

- **MiKTeX** (`pdflatex`, `pdftocairo`).
- texmf local en `Z:/Mi unidad/mytexmf/tex/latex/` con la clase `LegrandOrangeBookES` y los estilos
  `estilocrispropioLibro` y `estilocrispropio`. Algunos libros (2.º ESO, 3.º ESO, Química 2.º Bach) llevan
  además su propia copia del `.sty` dentro de la carpeta, que tiene prioridad sobre la del texmf.
- Para regenerar figuras: Node.js, Chrome o Edge (modo headless) y Python con PyMuPDF.

## Compilar

Desde PyCharm: abrir el `.tex` principal del libro y ejecutarlo (configuración LaTeX de TeXiFy: dos compilaciones y visor PDF).

Desde la terminal, en la carpeta del libro:

```sh
cd src/4ESO
pdflatex -interaction=nonstopmode -synctex=1 -output-directory=../../out Libro_4_ESO_ES.tex
```

Compilar dos veces para que salgan bien el índice, las referencias y las soluciones.
Todos los libros escriben sus soluciones en `out/soluciones.tex`: al cambiar de libro, la primera compilación
puede mostrar las soluciones del libro anterior; la segunda ya sale bien.

## Añadir un libro

1. Crear la carpeta en `src/` con el `.tex` principal, las unidades y las figuras.
2. Usar la clase `LegrandOrangeBookES` y el estilo `estilocrispropioLibro` del texmf.
3. Añadirlo a la tabla de este `README.md` y a la de `CLAUDE.md`.

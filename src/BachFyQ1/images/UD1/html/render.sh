#!/bin/sh
# Exporta las figuras de la Unidad 1 (Física y Química 1.º Bach) de HTML a PDF vectorial y SVG.
#   PDF -> images/UD1/<nombre>.pdf      (es el que incluye LaTeX con \includegraphics)
#   SVG -> images/UD1/svg/<nombre>.svg  (misma figura en SVG, sin pérdida de calidad)
# Uso (Git Bash):  sh render.sh             -> todas las figuras
#                  sh render.sh nombre ...  -> solo las indicadas
# Requiere Google Chrome y pdftocairo (incluido en MiKTeX).
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
HERE="$(pwd -W 2>/dev/null || pwd)"
mkdir -p ../svg

for f in *.html; do
    name="${f%.html}"
    if [ $# -gt 0 ]; then
        case " $* " in *" $name "*) ;; *) continue ;; esac
    fi
    "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf-no-header \
        --virtual-time-budget=3000 --print-to-pdf="$HERE/../$name.pdf" "file:///$HERE/$f" 2>/dev/null
    pdftocairo -svg "../$name.pdf" "../svg/$name.svg"
    echo "$name"
done

#!/bin/sh
# Exporta los mapas conceptuales de HTML a PDF vectorial y SVG.
#   PDF -> images/mapas_conceptuales/mapa_<tema>.pdf      (lo que incluye LaTeX)
#   SVG -> images/mapas_conceptuales/svg/mapa_<tema>.svg
# Uso (Git Bash):  sh render.sh            -> todos los temas de temas.js
#                  sh render.sh UD1 UD3    -> solo los indicados
# Requiere Google Chrome (o Edge) y pdftocairo (MiKTeX).
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
HERE="$(pwd -W 2>/dev/null || pwd)"
mkdir -p ../svg

if [ $# -gt 0 ]; then LISTA="$*"; else LISTA=$(grep -o '^TEMAS\.[A-Za-z0-9_]*' temas.js | cut -d. -f2); fi

for tema in $LISTA; do
    "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf-no-header \
        --virtual-time-budget=3000 --print-to-pdf="$HERE/../mapa_$tema.pdf" "file:///$HERE/mapa.html?tema=$tema" 2>/dev/null
    pdftocairo -svg "../mapa_$tema.pdf" "../svg/mapa_$tema.svg"
    echo "mapa_$tema"
done

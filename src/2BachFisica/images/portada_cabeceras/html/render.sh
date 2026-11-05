#!/bin/sh
# Exporta la portada y las cabeceras de capítulo de HTML a PDF vectorial y SVG.
#   PDF -> images/portada_cabeceras/<nombre>.pdf      (lo que incluye LaTeX)
#   SVG -> images/portada_cabeceras/svg/<nombre>.svg
# Uso (Git Bash):  sh render.sh               -> todas
#                  sh render.sh nombre ...    -> solo las indicadas (p. ej. cabecera_UD1 portada_2BachFisica)
# Requiere Google Chrome (o Edge) y pdftocairo (MiKTeX).
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
HERE="$(pwd -W 2>/dev/null || pwd)"
mkdir -p ../svg

# nombre del PDF : página HTML?parámetros
LISTA="
portada_2BachFisica:portada.html
cabecera_general:cabecera.html?escena=fisica
cabecera_UD1:cabecera.html?escena=mas
cabecera_UD2:cabecera.html?escena=ondulatorio
cabecera_UD3:cabecera.html?escena=optica
cabecera_UD4:cabecera.html?escena=gravitacion
cabecera_UD5:cabecera.html?escena=electrico
cabecera_UD6:cabecera.html?escena=magnetico
cabecera_UD7:cabecera.html?escena=cuantica
cabecera_UD8:cabecera.html?escena=nuclear
"

for item in $LISTA; do
    name="${item%%:*}"; page="${item#*:}"
    if [ $# -gt 0 ]; then
        case " $* " in *" $name "*) ;; *) continue ;; esac
    fi
    "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf-no-header \
        --virtual-time-budget=3000 --print-to-pdf="$HERE/../$name.pdf" "file:///$HERE/$page" 2>/dev/null
    pdftocairo -svg "../$name.pdf" "../svg/$name.svg"
    echo "$name"
done

#!/bin/sh
# Exporta la portada y las cabeceras de capítulo de HTML a PDF vectorial y SVG.
#   PDF -> images/portada_cabeceras/<nombre>.pdf      (lo que incluye LaTeX)
#   SVG -> images/portada_cabeceras/svg/<nombre>.svg
# Uso (Git Bash):  sh render.sh               -> todas
#                  sh render.sh nombre ...    -> solo las indicadas (p. ej. cabecera_Unit3 portada_2ESO_ES)
# Requiere Google Chrome (o Edge) y pdftocairo (MiKTeX).
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
HERE="$(pwd -W 2>/dev/null || pwd)"
mkdir -p ../svg

# nombre del PDF : página HTML?parámetros
LISTA="
portada_2ESO_ES:portada.html
portada_2ESO_ENG:portada.html?lang=en
cabecera_general:cabecera.html?escena=general
cabecera_Math:cabecera.html?escena=matematicas
cabecera_Unit1:cabecera.html?escena=medida
cabecera_Unit2:cabecera.html?escena=estados
cabecera_Unit3:cabecera.html?escena=mezclas
cabecera_Unit4:cabecera.html?escena=formulacion
cabecera_Unit5:cabecera.html?escena=materia
cabecera_Unit6:cabecera.html?escena=reacciones
cabecera_Unit7:cabecera.html?escena=cinematica
cabecera_Unit8:cabecera.html?escena=fuerzas
cabecera_Unit9:cabecera.html?escena=energias
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

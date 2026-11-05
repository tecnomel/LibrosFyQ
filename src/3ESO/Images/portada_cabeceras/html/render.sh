#!/bin/sh
# Exporta la portada y las cabeceras de capítulo de HTML a PDF vectorial y SVG.
#   PDF -> Images/portada_cabeceras/<nombre>.pdf      (lo que incluye LaTeX)
#   SVG -> Images/portada_cabeceras/svg/<nombre>.svg
# Uso (Git Bash):  sh render.sh               -> todas
#                  sh render.sh nombre ...    -> solo las indicadas (p. ej. cabecera_U3_dinamica portada_3ESO_ES)
# Requiere Google Chrome (o Edge) y pdftocairo (MiKTeX).
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
HERE="$(pwd -W 2>/dev/null || pwd)"
mkdir -p ../svg

# nombre del PDF : página HTML?parámetros
LISTA="
portada_3ESO_ES:portada.html
portada_3ESO_ENG:portada.html?lang=en
cabecera_general:cabecera.html?escena=general
cabecera_U1_metodo_cientifico:cabecera.html?escena=cientifico
cabecera_U2_cinematica:cabecera.html?escena=cinematica
cabecera_U3_dinamica:cabecera.html?escena=fuerzas
cabecera_U4_energia:cabecera.html?escena=energia
cabecera_U5_sistemas_materiales:cabecera.html?escena=materia
cabecera_U6_atomo_tp:cabecera.html?escena=atomo
cabecera_formulacion:cabecera.html?escena=formulacion
cabecera_U7_elementos_compuestos:cabecera.html?escena=enlace
cabecera_U8_reacciones:cabecera.html?escena=reacciones
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

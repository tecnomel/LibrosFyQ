"""Exporta las figuras de figuras_inorganica.html a PDF y SVG vectoriales.

Cada <section class="fig" id="..."> del HTML se guarda como:
    ../pdf/<id>.pdf   -> lo que inserta inorganica_nuevo.tex
    ../svg/<id>.svg   -> versión SVG (web, presentaciones...)

Requisitos (una sola vez):
    pip install playwright pymupdf
Usa el Google Chrome instalado en el equipo (no descarga navegadores).

Uso:
    python exportar_figuras.py                    # todas las figuras
    python exportar_figuras.py fig-mapa esq-oxosal   # solo algunas
    python exportar_figuras.py --edge             # usar Microsoft Edge
    python exportar_figuras.py --lista            # ver los id disponibles
"""
import argparse
import sys
from pathlib import Path

import pymupdf
from playwright.sync_api import sync_playwright

CARPETA = Path(__file__).resolve().parent
HTML = CARPETA / "figuras_inorganica.html"
SALIDA_PDF = CARPETA.parent / "pdf"
SALIDA_SVG = CARPETA.parent / "svg"
# Altura extra de la página al imprimir: luego se recorta al contenido real
# (al imprimir, el texto puede ocupar algo más que en pantalla).
MARGEN_IMPRESION = 400


def recortar_al_contenido(pdf_bytes):
    """Devuelve un PDF de una página recortado a lo que está dibujado (sigue siendo vectorial)."""
    origen = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    pagina = origen[0]
    alto = pagina.rect.height
    caja = pymupdf.Rect()
    for _, rect in pagina.get_bboxlog():
        r = pymupdf.Rect(rect)
        # Se ignora el fondo blanco que cubre toda la página
        if not r.is_empty and r.height < 0.95 * alto:
            caja |= r
    caja = pymupdf.Rect(0, max(caja.y0 - 1, 0), pagina.rect.width, min(caja.y1 + 1, alto))
    destino = pymupdf.open()
    nueva = destino.new_page(width=caja.width, height=caja.height)
    nueva.show_pdf_page(nueva.rect, origen, 0, clip=caja)
    return destino


def exportar(ids_pedidos, canal):
    SALIDA_PDF.mkdir(exist_ok=True)
    SALIDA_SVG.mkdir(exist_ok=True)
    url = HTML.as_uri()
    with sync_playwright() as p:
        navegador = p.chromium.launch(channel=canal)
        pagina = navegador.new_page(viewport={"width": 1100, "height": 900})
        pagina.emulate_media(media="print")
        pagina.goto(url)
        todos = pagina.eval_on_selector_all("section.fig", "s => s.map(x => x.id)")
        if ids_pedidos is None:
            ids = todos
        else:
            desconocidos = [i for i in ids_pedidos if i not in todos]
            if desconocidos:
                sys.exit("No existen en el HTML: " + ", ".join(desconocidos))
            ids = ids_pedidos

        for id_fig in ids:
            pagina.goto(f"{url}?solo={id_fig}")
            # El HTML añade un @page para imprimir desde el navegador; aquí se fija el tamaño a mano
            pagina.evaluate("() => document.querySelectorAll('style').forEach("
                            "s => { if (s.textContent.startsWith('@page')) s.remove(); })")
            caja = pagina.locator(f"#{id_fig}").bounding_box()
            pdf_bytes = pagina.pdf(
                width=f"{int(caja['width']) + 1}px",
                height=f"{int(caja['height']) + MARGEN_IMPRESION}px",
                print_background=True,
                page_ranges="1",
                margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
            )
            doc = recortar_al_contenido(pdf_bytes)
            doc.save(SALIDA_PDF / f"{id_fig}.pdf", garbage=4, deflate=True)
            (SALIDA_SVG / f"{id_fig}.svg").write_text(
                doc[0].get_svg_image(text_as_path=True), encoding="utf-8")
            print(f"  {id_fig:<24} {doc[0].rect.width:.0f} x {doc[0].rect.height:.0f} pt")
            doc.close()
        navegador.close()
    print(f"{len(ids)} figuras exportadas a {SALIDA_PDF} y {SALIDA_SVG}")


def main():
    ap = argparse.ArgumentParser(description="Exporta las figuras del HTML a PDF y SVG.")
    ap.add_argument("ids", nargs="*", help="id de las figuras (por defecto, todas)")
    ap.add_argument("--edge", action="store_true", help="usar Microsoft Edge en lugar de Chrome")
    ap.add_argument("--lista", action="store_true", help="mostrar los id disponibles y salir")
    args = ap.parse_args()
    canal = "msedge" if args.edge else "chrome"

    if args.lista:
        with sync_playwright() as p:
            navegador = p.chromium.launch(channel=canal)
            pagina = navegador.new_page()
            pagina.goto(HTML.as_uri())
            for i in pagina.eval_on_selector_all("section.fig", "s => s.map(x => x.id)"):
                print(i)
            navegador.close()
        return

    exportar(args.ids or None, canal)


if __name__ == "__main__":
    main()

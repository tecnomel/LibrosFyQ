"""Recorta el margen blanco de los PDF exportados por Chrome (lo usa exportar.mjs).

Uso: python recortar.py fig1.pdf fig2.pdf ...
Necesita PyMuPDF (pip install pymupdf). Solo cambia la caja de la página: el contenido sigue siendo vectorial.
"""
import os
import sys

import pymupdf

MARGEN = 15  # pt de borde blanco que se conserva alrededor de la figura

for ruta in sys.argv[1:]:
    doc = pymupdf.open(ruta)
    pag = doc[0]
    esc = 2
    pix = pag.get_pixmap(matrix=pymupdf.Matrix(esc, esc), alpha=False, colorspace=pymupdf.csGRAY)
    w, h, s = pix.width, pix.height, pix.samples
    filas = [y for y in range(h) if min(s[y * w:(y + 1) * w]) < 250]
    if not filas:
        doc.close()
        continue
    cols = [x for x in range(w) if min(s[x::w]) < 250]
    r = pag.rect
    caja = pymupdf.Rect(max(cols[0] / esc - MARGEN, 0), max(filas[0] / esc - MARGEN, 0),
                        min((cols[-1] + 1) / esc + MARGEN, r.x1), min((filas[-1] + 1) / esc + MARGEN, r.y1))
    # set_mediabox usa coordenadas PDF (origen abajo): se invierte el eje y
    alto = pag.mediabox.height
    pag.set_mediabox(pymupdf.Rect(caja.x0, alto - caja.y1, caja.x1, alto - caja.y0))
    doc.save(ruta + ".tmp", garbage=3, deflate=True)
    doc.close()
    os.replace(ruta + ".tmp", ruta)

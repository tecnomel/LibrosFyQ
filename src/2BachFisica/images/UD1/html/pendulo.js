// Péndulo simple separado un ángulo φ: tensión, peso y sus componentes radial y tangencial.
lienzo(520, 500);
const px = 190, py = 36, L = 310, fi = 26, r = fi * Math.PI / 180;
rayado(90, 20, 200, 16);
linea(90, 36, 290, 36, { w: 2.5 });
linea(px, py, px, py + L + 40, { c: C.gris, w: 1.2, dash: '5 5' });
arco(px, py, L, -90 - 32, -90 + 32, { c: C.gris, w: 1.2, dash: '4 5' });

const bx = px + L * Math.sin(r), by = py + L * Math.cos(r);
linea(px, py, bx, by, { w: 2 });
texto((px + bx) / 2 + 14, (py + by) / 2, 'l', { italic: true, anchor: 'start' });
arco(px, py, 70, -90, -90 + fi, { c: C.morado, w: 1.8 });
texto(px + 14, py + 92, 'φ', { italic: true, c: C.morado });

// arco recorrido x desde la posición de equilibrio
arco(px, py, L + 22, -90, -90 + fi, { c: C.azul, w: 2 });
texto(px + (L + 40) * Math.sin(r / 3), py + (L + 40) * Math.cos(r / 3) + 10, 'x', { italic: true, c: C.azul });
bola(px, py + L, 13, { fill: '#fff', c: C.gris, dash: '4 3' });

// fuerzas
const u = [Math.sin(r), Math.cos(r)], t = [-Math.cos(r), Math.sin(r)]; // radial (hacia fuera) y tangencial (hacia O)
const P = 130;
flecha(bx, by, bx - u[0] * 105, by - u[1] * 105, { c: C.azul, w: 3, head: 13 });
vecTexto(bx - u[0] * 100 + 14, by - u[1] * 100 + 2, 'T', { anchor: 'start', c: C.azul, size: 22 });
flecha(bx, by, bx, by + P, { c: C.rojo, w: 3, head: 13 });
texto(bx + 10, by + P - 4, 'm g', { anchor: 'start', c: C.rojo, size: 21, italic: true });
const cr = P * Math.cos(r), ct = P * Math.sin(r);
flecha(bx, by, bx + u[0] * cr, by + u[1] * cr, { c: C.gris, w: 2, head: 11, dash: '6 4' });
linea(bx + u[0] * cr, by + u[1] * cr, bx, by + P, { c: C.gris, w: 1, dash: '3 4' });
linea(bx + t[0] * ct, by + t[1] * ct, bx, by + P, { c: C.gris, w: 1, dash: '3 4' });
texto(bx + u[0] * cr + 12, by + u[1] * cr + 18, 'm g cos φ', { anchor: 'start', size: 18, italic: true, c: C.gris });
flecha(bx, by, bx + t[0] * ct, by + t[1] * ct, { c: C.verde, w: 3, head: 13 });
texto(bx + t[0] * ct - 6, by + t[1] * ct - 14, 'm g sen φ', { anchor: 'end', size: 19, italic: true, c: C.verde });
arco(bx, by, 40, -90, -90 + fi, { c: C.morado, w: 1.6 });
texto(bx + 13, by + 58, 'φ', { italic: true, c: C.morado, size: 18 });
bola(bx, by, 13);
texto(bx + 18, by - 12, 'm', { italic: true, anchor: 'start' });
texto(px, py + L + 64, 'O', { italic: true });

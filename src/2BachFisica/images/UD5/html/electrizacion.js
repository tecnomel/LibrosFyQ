// Formas de electrización: frotamiento, contacto e inducción (con conexión a tierra).
lienzo(800, 290);
function signos(x, y, w, h, s, n, c) {
    for (let k = 0; k < n; k++) {
        const px = x + w * ((k * 0.37 + 0.13) % 1), py = y + h * ((k * 0.61 + 0.27) % 1);
        texto(px, py + 6, s, { size: 18, c, italic: false, bold: true });
    }
}
// (a) frotamiento
E(S, 'rect', { x: 30, y: 70, width: 200, height: 26, rx: 13, fill: '#e0e0e0', stroke: C.tinta, 'stroke-width': 1.5 });
signos(40, 70, 180, 26, '−', 7, C.azul);
E(S, 'rect', { x: 70, y: 130, width: 130, height: 70, rx: 8, fill: '#ffe0b2', stroke: C.tinta, 'stroke-width': 1.5 });
signos(80, 135, 110, 60, '+', 8, C.rojo);
flecha(150, 128, 150, 100, { c: C.tinta, w: 1.8, head: 9 }); texto(158, 120, 'e⁻', { size: 15, anchor: 'start' });
texto(130, 60, 'plástico', { size: 14 }); texto(135, 220, 'lana', { size: 14 });
texto(130, 280, '(a) Frotamiento', { size: 16 });
// (b) contacto
const bx = 400;
E(S, 'circle', { cx: bx - 40, cy: 130, r: 34, fill: '#eceff1', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: bx - 6, y: 116, width: 90, height: 28, rx: 6, fill: '#e0e0e0', stroke: C.tinta, 'stroke-width': 1.5 });
signos(bx - 66, 104, 52, 52, '+', 4, C.rojo); signos(bx, 116, 80, 28, '+', 5, C.rojo);
texto(bx, 196, 'la carga se reparte', { size: 14 }); texto(bx, 214, 'entre los dos cuerpos', { size: 14 });
texto(bx, 280, '(b) Contacto', { size: 16 });
// (c) inducción
const cx = 660;
E(S, 'rect', { x: cx - 130, y: 92, width: 60, height: 28, rx: 6, fill: '#e0e0e0', stroke: C.tinta, 'stroke-width': 1.5 });
signos(cx - 126, 92, 52, 28, '+', 4, C.rojo);
E(S, 'circle', { cx: cx + 10, cy: 106, r: 42, fill: '#eceff1', stroke: C.tinta, 'stroke-width': 1.5 });
[[-36, -12], [-36, 12], [-28, -28], [-28, 28]].forEach(([dx, dy]) => texto(cx + 10 + dx, 106 + dy + 6, '−', { size: 18, c: C.azul, bold: true }));
linea(cx + 10, 148, cx + 10, 196, { w: 2 });
[0, 1, 2].forEach(k => linea(cx + 10 - 16 + k * 5, 196 + k * 6, cx + 10 + 16 - k * 5, 196 + k * 6, { w: 2 }));
flecha(cx + 30, 210, cx + 30, 160, { c: C.azul, w: 1.6, head: 8 }); texto(cx + 38, 192, 'e⁻ desde tierra', { size: 13, anchor: 'start', c: C.azul });
texto(cx, 280, '(c) Inducción', { size: 16 });

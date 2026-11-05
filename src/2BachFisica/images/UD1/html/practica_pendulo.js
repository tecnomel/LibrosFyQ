// Montaje de la práctica del péndulo simple: soporte, nuez, hilo con bola y ángulo pequeño (menor de 10°).
lienzo(360, 460);
E(S, 'rect', { x: 20, y: 420, width: 200, height: 18, rx: 4, fill: '#cfd3dc', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: 50, y: 30, width: 14, height: 390, fill: '#e0e3ea', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: 38, y: 40, width: 38, height: 26, rx: 4, fill: '#9aa3b5', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: 64, y: 47, width: 180, height: 10, fill: '#e0e3ea', stroke: C.tinta, 'stroke-width': 1.5 });
const px = 220, py = 57, L = 300, a = 9 * Math.PI / 180;
linea(px, py, px, py + L + 30, { c: C.gris, w: 1.2, dash: '5 5' });
arco(px, py, L, -90 - 12, -90 + 12, { c: C.gris, w: 1.2, dash: '4 5' });
const bx = px + L * Math.sin(a), by = py + L * Math.cos(a);
linea(px, py, bx, by, { w: 1.8 });
bola(bx, by, 16);
bola(px - L * Math.sin(a), by, 16, { op: .3, dash: '4 3' });
arco(px, py, 90, -90, -90 + 9, { c: C.morado, w: 1.6 });
texto(px + 30, py + 110, '< 10°', { size: 18, anchor: 'start', c: C.morado, italic: false });
flecha(300, py + 4, 300, by - 2, { c: C.azul, w: 1.8, head: 9, doble: true });
texto(312, (py + by) / 2, 'l', { italic: true, anchor: 'start', c: C.azul });

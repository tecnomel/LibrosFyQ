// Aplicaciones del teorema de Gauss: hilo cargado (superficie cilíndrica) y plano cargado (cilindro que lo atraviesa).
lienzo(760, 320);
// (a) hilo
const hx = 180;
linea(hx, 20, hx, 280, { c: C.tinta, w: 3.5 });
texto(hx + 8, 32, 'λ', { italic: true, anchor: 'start', size: 20 });
E(S, 'ellipse', { cx: hx, cy: 80, rx: 70, ry: 18, fill: C.moradoClaro, stroke: C.morado, 'stroke-width': 1.6 });
linea(hx - 70, 80, hx - 70, 220, { c: C.morado, w: 1.6 }); linea(hx + 70, 80, hx + 70, 220, { c: C.morado, w: 1.6 });
E(S, 'path', { d: `M${hx - 70},220 A70,18 0 0,0 ${hx + 70},220`, fill: 'none', stroke: C.morado, 'stroke-width': 1.6 });
E(S, 'path', { d: `M${hx - 70},220 A70,18 0 0,1 ${hx + 70},220`, fill: 'none', stroke: C.morado, 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
[110, 150, 190].forEach(y => { flecha(hx + 70, y, hx + 130, y, { c: C.rojo, w: 2, head: 9 }); flecha(hx - 70, y, hx - 130, y, { c: C.rojo, w: 2, head: 9 }); });
texto(hx + 140, 115, 'E', { italic: true, c: C.rojo, anchor: 'start', size: 19 });
cota(hx - 100, 80, hx - 100, 220, '', {}); texto(hx - 108, 156, 'h', { italic: true, anchor: 'end', size: 19 });
linea(hx, 150, hx + 70, 150, { w: 1.2 }); texto(hx + 36, 144, 'r', { italic: true, size: 17 });
flecha(hx, 80, hx, 50, { c: C.azul, w: 1.8, head: 8 }); texto(hx + 6, 60, 'dS', { italic: true, c: C.azul, anchor: 'start', size: 15 });
texto(hx, 310, '(a) Hilo indefinido: E = λ/(2πε_0 r)', { size: 15 });
// (b) plano
const px = 560;
E(S, 'polygon', { points: `${px - 160},200 ${px + 80},200 ${px + 160},120 ${px - 80},120`, fill: '#ffebee', stroke: C.rojo, 'stroke-width': 1.6 });
for (let k = 0; k < 9; k++) texto(px - 120 + k * 28 + (k % 2) * 12, 168 - (k % 3) * 12, '+', { size: 14, c: C.rojo, bold: true });
E(S, 'rect', { x: px - 30, y: 70, width: 60, height: 160, fill: C.moradoClaro, 'fill-opacity': .7, stroke: C.morado, 'stroke-width': 1.6 });
E(S, 'ellipse', { cx: px, cy: 70, rx: 30, ry: 9, fill: C.moradoClaro, stroke: C.morado, 'stroke-width': 1.6 });
E(S, 'ellipse', { cx: px, cy: 230, rx: 30, ry: 9, fill: C.moradoClaro, stroke: C.morado, 'stroke-width': 1.6 });
flecha(px, 70, px, 22, { c: C.rojo, w: 2.4, head: 10 }); flecha(px, 230, px, 280, { c: C.rojo, w: 2.4, head: 10 });
texto(px + 10, 34, 'E', { italic: true, c: C.rojo, anchor: 'start', size: 19 }); texto(px + 10, 276, 'E', { italic: true, c: C.rojo, anchor: 'start', size: 19 });
texto(px + 40, 70, 'S', { italic: true, anchor: 'start', size: 17 }); texto(px + 140, 210, 'σ', { italic: true, size: 20, c: C.rojo });
texto(px, 310, '(b) Plano indefinido: E = σ/(2ε_0)', { size: 15 });

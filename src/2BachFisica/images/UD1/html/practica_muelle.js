// Montaje de la práctica del oscilador: soporte, muelle, portapesas con pesas y regla.
lienzo(380, 460);
E(S, 'rect', { x: 30, y: 420, width: 220, height: 18, rx: 4, fill: '#cfd3dc', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: 72, y: 40, width: 14, height: 380, fill: '#e0e3ea', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: 60, y: 52, width: 38, height: 26, rx: 4, fill: '#9aa3b5', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: 86, y: 59, width: 160, height: 10, fill: '#e0e3ea', stroke: C.tinta, 'stroke-width': 1.5 });
const x = 230;
muelle(x, 69, 230, { ancho: 12, n: 16 });
linea(x, 230, x, 246, { w: 2 });
E(S, 'rect', { x: x - 30, y: 246, width: 60, height: 8, fill: C.gris, stroke: C.tinta, 'stroke-width': 1.2 });
[0, 1, 2].forEach(i => E(S, 'rect', { x: x - 26, y: 254 + i * 15, width: 52, height: 13, rx: 2, fill: C.masa, stroke: C.tinta, 'stroke-width': 1.2 }));
texto(x - 44, 285, 'm', { italic: true, anchor: 'end' });
// oscilación
flecha(x + 50, 220, x + 50, 330, { c: C.morado, w: 2, head: 10, doble: true });
// regla
E(S, 'rect', { x: 300, y: 90, width: 34, height: 320, fill: '#fff6d6', stroke: C.tinta, 'stroke-width': 1.5 });
for (let i = 0; i <= 30; i++) linea(300, 100 + i * 10, 300 + (i % 5 ? 8 : 16), 100 + i * 10, { w: 1.2 });
// cronómetro
E(S, 'circle', { cx: 150, cy: 360, r: 30, fill: '#fff', stroke: C.tinta, 'stroke-width': 2 });
E(S, 'rect', { x: 144, y: 322, width: 12, height: 9, fill: C.tinta });
linea(150, 360, 150, 338, { w: 2 }); linea(150, 360, 166, 368, { c: C.rojo, w: 2 });

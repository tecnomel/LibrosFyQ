// Práctica: medida del campo magnético terrestre con una bobina plana y una brújula en su centro (brújula de tangentes).
lienzo(420, 330);
E(S, 'ellipse', { cx: 210, cy: 150, rx: 40, ry: 120, fill: 'none', stroke: C.naranja, 'stroke-width': 5 });
E(S, 'rect', { x: 120, y: 268, width: 180, height: 14, fill: '#d7ccc8', stroke: C.tinta, 'stroke-width': 1.2 });
E(S, 'ellipse', { cx: 210, cy: 210, rx: 70, ry: 22, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.4 });
const a = 0.7;
E(S, 'polygon', { points: `${210 + 56 * Math.sin(a)},${210 - 18 * Math.cos(a)} ${206},${214} ${214},${206}`, fill: '#e53935' });
E(S, 'polygon', { points: `${210 - 56 * Math.sin(a)},${210 + 18 * Math.cos(a)} ${206},${214} ${214},${206}`, fill: '#90a4ae' });
flecha(70, 210, 70, 180, { c: C.verde, w: 2, head: 9 }); texto(60, 196, 'B_T', { italic: true, c: C.verde, size: 15, anchor: 'end' });
flecha(330, 210, 375, 210, { c: C.azul, w: 2, head: 9 }); texto(352, 200, 'B_b', { italic: true, c: C.azul, size: 15 });
texto(300, 160, 'φ', { italic: true, c: C.rojo, size: 17 });
camino('M210,270 L210,300 L120,300', { w: 1.6 }); E(S, 'circle', { cx: 105, cy: 300, r: 14, fill: '#fff', stroke: C.tinta }); texto(105, 305, 'A', { size: 13, bold: true });
texto(210, 24, 'N espiras de radio R', { size: 14 });

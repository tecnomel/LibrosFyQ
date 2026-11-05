// Transformador: dos bobinas sobre un mismo núcleo de hierro; el flujo variable del primario atraviesa el secundario.
lienzo(560, 290);
E(S, 'path', { d: 'M150,40 L410,40 L410,250 L150,250 Z M190,80 L370,80 L370,210 L190,210 Z', fill: '#cfd8dc', stroke: C.tinta, 'stroke-width': 1.6, 'fill-rule': 'evenodd' });
function bobina(x, n, h, c) { for (let k = 0; k < n; k++) { const y = 70 + k * (h / n); E(S, 'ellipse', { cx: x, cy: y + 10, rx: 30, ry: 6, fill: 'none', stroke: c, 'stroke-width': 2.2 }); } }
bobina(170, 10, 150, C.rojo); bobina(390, 5, 150, C.azul);
camino('M140,80 L60,80', { c: C.rojo, w: 1.8 }); camino('M140,220 L60,220', { c: C.rojo, w: 1.8 });
camino('M420,80 L500,80', { c: C.azul, w: 1.8 }); camino('M420,220 L500,220', { c: C.azul, w: 1.8 });
E(S, 'circle', { cx: 60, cy: 150, r: 20, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 }); texto(60, 157, '~', { size: 20 });
linea(60, 80, 60, 130, { c: C.rojo, w: 1.8 }); linea(60, 170, 60, 220, { c: C.rojo, w: 1.8 });
E(S, 'rect', { x: 490, y: 125, width: 20, height: 50, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 });
linea(500, 80, 500, 125, { c: C.azul, w: 1.8 }); linea(500, 175, 500, 220, { c: C.azul, w: 1.8 });
camino('M280,60 L388,60 L388,230 L172,230 L172,60 Z', { c: C.morado, w: 1.4, dash: '6 4' });
flecha(270, 60, 300, 60, { c: C.morado, w: 1.4, head: 9 }); texto(280, 30, 'Φ', { italic: true, c: C.morado, size: 18 });
texto(170, 274, 'primario N_1, V_1', { italic: true, c: C.rojo, size: 15 }); texto(390, 274, 'secundario N_2, V_2', { italic: true, c: C.azul, size: 15 });

// Alternador: una espira gira con velocidad angular ω entre los polos de un imán; anillos colectores y escobillas.
lienzo(560, 280);
E(S, 'path', { d: 'M40,60 L130,60 L150,90 L150,190 L130,220 L40,220 Z', fill: '#e53935', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'path', { d: 'M420,60 L510,60 L510,220 L420,220 L400,190 L400,90 Z', fill: '#1e88e5', stroke: C.tinta, 'stroke-width': 1.5 });
texto(85, 148, 'N', { c: '#fff', size: 30, bold: true }); texto(465, 148, 'S', { c: '#fff', size: 30, bold: true });
for (let y = 100; y <= 180; y += 26) flecha(156, y, 394, y, { c: C.claro, w: 1.3, head: 8 });
texto(390, 96, 'B', { italic: true, c: C.azul, size: 17 });
// espira inclinada (perspectiva)
camino('M230,80 L320,110 L320,200 L230,170 Z', { c: C.naranja, w: 3 });
linea(275, 60, 275, 250, { c: C.gris, w: 1, dash: '5 4' });
arco(275, 52, 22, 200, 340, { c: C.morado, w: 1.6 }); flecha(294, 62, 297, 58, { c: C.morado, w: 1, head: 9 });
texto(306, 40, 'ω', { italic: true, c: C.morado, size: 18 });
// anillos y escobillas
linea(275, 185, 275, 236, { w: 2 });
E(S, 'ellipse', { cx: 275, cy: 236, rx: 18, ry: 6, fill: 'none', stroke: C.tinta, 'stroke-width': 2 });
E(S, 'ellipse', { cx: 275, cy: 250, rx: 18, ry: 6, fill: 'none', stroke: C.tinta, 'stroke-width': 2 });
E(S, 'rect', { x: 296, y: 232, width: 14, height: 8, fill: '#757575' }); E(S, 'rect', { x: 296, y: 246, width: 14, height: 8, fill: '#757575' });
camino('M310,236 L360,236 L360,226', { w: 1.6 }); camino('M310,250 L380,250 L380,226', { w: 1.6 });
E(S, 'circle', { cx: 370, cy: 214, r: 14, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 }); texto(370, 220, '~', { size: 18 });
texto(200, 270, 'anillos colectores y escobillas', { size: 13 });

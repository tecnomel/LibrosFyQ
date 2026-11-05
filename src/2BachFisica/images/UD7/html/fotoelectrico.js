// Montaje del efecto fotoeléctrico: tubo de vacío con cátodo iluminado, ánodo, fuente regulable, amperímetro y voltímetro.
lienzo(520, 330);
E(S, 'ellipse', { cx: 200, cy: 120, rx: 130, ry: 72, fill: '#e3f2fd', stroke: C.azul, 'stroke-width': 2 });
E(S, 'path', { d: 'M112,80 Q90,120 112,160 L124,160 Q104,120 124,80 Z', fill: '#78909c', stroke: C.tinta, 'stroke-width': 1.4 });
E(S, 'rect', { x: 282, y: 90, width: 10, height: 60, fill: '#78909c', stroke: C.tinta, 'stroke-width': 1.4 });
texto(116, 186, 'cátodo', { size: 13 }); texto(290, 172, 'ánodo', { size: 13 });
// luz y electrones
for (let k = 0; k < 3; k++) { const y = 30 + k * 14; camino(seno(10, 100, y + 30, 5, 18).replace(/^M/, 'M'), { c: '#7b1fa2', w: 1.6 }); }
flecha(96, 74, 112, 90, { c: '#7b1fa2', w: 1.6, head: 8 }); texto(40, 30, 'luz (h·ν)', { size: 14, c: '#7b1fa2' });
[[150, 100], [190, 125], [230, 112], [250, 138]].forEach(([x, y]) => { bola(x, y, 5, { fill: '#42a5f5' }); flecha(x + 6, y, x + 26, y, { c: '#42a5f5', w: 1.4, head: 7 }); });
texto(200, 82, 'e⁻', { size: 14, c: C.azul });
// circuito
camino('M112,120 L60,120 L60,280 L170,280', { w: 2 }); camino('M292,120 L440,120 L440,280 L250,280', { w: 2 });
E(S, 'rect', { x: 196, y: 266, width: 4, height: 28, fill: C.tinta }); E(S, 'rect', { x: 210, y: 272, width: 4, height: 16, fill: C.tinta });
camino('M170,280 L196,280', { w: 2 }); camino('M214,280 L250,280', { w: 2 });
flecha(180, 300, 236, 262, { c: C.gris, w: 1.2, head: 8 }); texto(230, 316, 'fuente regulable', { size: 13 });
E(S, 'circle', { cx: 440, cy: 200, r: 18, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 }); texto(440, 206, 'A', { size: 15, bold: true });
camino('M60,200 L20,200 L20,230', { w: 1.4 }); E(S, 'circle', { cx: 20, cy: 248, r: 16, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 }); texto(20, 254, 'V', { size: 14, bold: true });
camino('M20,264 L20,300 L120,300', { w: 1.4 }); linea(120, 300, 120, 280, { w: 1.4 });

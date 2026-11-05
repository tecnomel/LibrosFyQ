// Práctica: cubeta con agua y dos electrodos conectados a una fuente; con un voltímetro se buscan los puntos de igual potencial.
lienzo(460, 330);
E(S, 'rect', { x: 40, y: 60, width: 380, height: 230, rx: 10, fill: '#e3f2fd', stroke: C.azul, 'stroke-width': 2 });
for (let x = 60; x < 420; x += 30) linea(x, 64, x, 286, { c: '#bbdefb', w: 1 });
for (let y = 80; y < 290; y += 30) linea(44, y, 416, y, { c: '#bbdefb', w: 1 });
E(S, 'rect', { x: 70, y: 90, width: 12, height: 170, fill: C.rojo }); E(S, 'rect', { x: 378, y: 90, width: 12, height: 170, fill: C.azul });
[150, 230, 310].forEach(x => camino(curva(y => x + 0, 92, 258, 4).replace(/(-?[\d.]+),(-?[\d.]+)/g, '$2,$1'), { c: C.verde, w: 1.6, dash: '5 4' }));
// fuente
caja(190, 8, 80, 34, { txt: '', fill: '#fff9c4', c: C.tinta }); texto(230, 32, '12 V', { size: 15, italic: false });
camino('M190,25 L76,25 L76,90', { w: 1.6, c: C.rojo }); camino('M270,25 L384,25 L384,90', { w: 1.6, c: C.azul });
// voltímetro con sonda
camino('M76,260 L76,300 L180,300', { w: 1.4 }); E(S, 'circle', { cx: 196, cy: 300, r: 16, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 });
texto(196, 306, 'V', { size: 16, bold: true }); camino('M212,300 L240,300 L262,190', { w: 1.4 }); bola(262, 186, 4, { fill: C.tinta });
texto(272, 182, 'sonda', { size: 13, anchor: 'start' });
texto(230, 280, 'equipotenciales', { size: 13, c: C.verde, halo: true });

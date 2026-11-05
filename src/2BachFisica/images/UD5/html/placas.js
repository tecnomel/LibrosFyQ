// Campo uniforme entre dos placas planas y paralelas con cargas opuestas; equipotenciales paralelas a las placas.
lienzo(460, 300);
const x1 = 90, x2 = 370, y1 = 40, y2 = 250;
E(S, 'rect', { x: x1 - 14, y: y1, width: 14, height: y2 - y1, fill: '#ffcdd2', stroke: C.rojo, 'stroke-width': 1.6 });
E(S, 'rect', { x: x2, y: y1, width: 14, height: y2 - y1, fill: '#bbdefb', stroke: C.azul, 'stroke-width': 1.6 });
for (let y = y1 + 15; y < y2; y += 30) { texto(x1 - 7, y + 6, '+', { size: 15, c: C.rojo, bold: true }); texto(x2 + 7, y + 6, '−', { size: 15, c: C.azul, bold: true }); }
[150, 220, 290].forEach(x => linea(x, y1 + 4, x, y2 - 4, { c: C.verde, w: 1.3, dash: '5 4' }));
for (let y = y1 + 20; y < y2; y += 34) flecha(x1 + 8, y, x2 - 8, y, { c: C.morado, w: 1.8, head: 10 });
texto(220, 28, 'E', { italic: true, c: C.morado, size: 20 }); linea(214, 10, 226, 10, { c: C.morado, w: 1.3 });
texto(x1 - 7, 274, 'V_A', { italic: true, c: C.rojo }); texto(x2 + 7, 274, 'V_B', { italic: true, c: C.azul });
cota(x1, 288, x2, 288, 'd', { dy: -6 });
texto(310, y2 - 8, 'equipotenciales', { size: 13, c: C.verde, anchor: 'end', halo: true });

// Reacción en cadena: cada fisión libera neutrones que provocan nuevas fisiones.
lienzo(700, 420);
const U = (x, y) => { bola(x, y, 16, { fill: '#ffb74d', c: C.tinta, w: 1.2 }); texto(x, y + 5, 'U', { size: 13, bold: true }); };
const n = (x1, y1, x2, y2) => { neutron(x1, y1, 5); flecha(x1 + 6 * Math.sign(x2 - x1), y1, x2 - 18, y2, { c: C.gris, w: 1.4, head: 8 }); };
neutron(30, 200, 6); flecha(38, 200, 94, 200, { c: C.gris, w: 1.6, head: 8 });
U(112, 200);
const g1 = [[260, 70], [260, 200], [260, 330]];
g1.forEach(([x, y]) => n(140, 200 + (y - 200) * 0.2, x, y));
g1.forEach(([x, y]) => U(x, y));
const g2 = [];
g1.forEach(([x, y], i) => [-40, 0, 40].forEach(dy => g2.push([430, y + dy])));
g2.forEach(([x, y], i) => n(285, g1[Math.floor(i / 3)][1] + (y - g1[Math.floor(i / 3)][1]) * 0.3, x, y));
g2.forEach(([x, y]) => U(x, y));
g2.forEach(([x, y]) => [-12, 12].forEach(dy => flecha(452, y, 520, y + dy * 1.4, { c: C.gris, w: 1.2, head: 7 })));
texto(600, 205, '…', { size: 34 });
texto(112, 245, '1 fisión', { size: 13 }); texto(260, 412, '3 fisiones', { size: 13 }); texto(430, 412, '9 fisiones', { size: 13 });

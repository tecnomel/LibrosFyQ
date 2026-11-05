// Péndulo eléctrico: esfera cargada colgada de un hilo dentro de un campo horizontal; equilibrio entre peso, tensión y fuerza eléctrica.
lienzo(420, 320);
const O = [170, 30], L = 190, a = 30 * Math.PI / 180, B = [O[0] + L * Math.sin(a), O[1] + L * Math.cos(a)];
rayado(O[0] - 60, 14, 120, 16); linea(O[0] - 60, 30, O[0] + 60, 30, { w: 2.4 });
linea(O[0], O[1], O[0], O[1] + 210, { c: C.gris, w: 1.2, dash: '5 4' });
linea(O[0], O[1], B[0], B[1], { w: 2 });
arco(O[0], O[1], 50, -90, -90 + 30, { c: C.verde, w: 1.6 }); texto(O[0] + 12, O[1] + 68, 'α', { italic: true, c: C.verde, size: 18 });
for (let y = 60; y < 300; y += 50) flecha(20, y, 70, y, { c: C.claro, w: 1.6, head: 8 });
texto(30, 300, 'E', { italic: true, c: C.gris, size: 19 });
bola(B[0], B[1], 13, { fill: '#ef5350' }); texto(B[0], B[1] + 5, '+', { c: '#fff', size: 16, bold: true });
flecha(B[0], B[1], B[0], B[1] + 90, { c: C.azul, w: 2.6 }); texto(B[0] + 8, B[1] + 86, 'P = mg', { italic: true, c: C.azul, anchor: 'start', size: 17 });
flecha(B[0], B[1], B[0] + 90 * Math.tan(a), B[1], { c: C.rojo, w: 2.6 }); texto(B[0] + 58, B[1] - 10, 'F_e = qE', { italic: true, c: C.rojo, anchor: 'start', size: 17 });
const T = 90 / Math.cos(a);
flecha(B[0], B[1], B[0] - T * Math.sin(a), B[1] - T * Math.cos(a), { c: C.verde, w: 2.6 }); texto(B[0] - T * Math.sin(a) + 26, B[1] - T * Math.cos(a) + 20, 'T', { italic: true, c: C.verde, size: 18 });

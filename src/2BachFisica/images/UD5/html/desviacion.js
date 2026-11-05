// Electrón lanzado horizontalmente entre dos placas con el campo hacia arriba: la fuerza (opuesta a E) lo curva hacia abajo en una parábola.
lienzo(600, 280);
const x0 = 80, x1 = 400, yA = 50, yB = 230, y0 = 140;
E(S, 'rect', { x: x0, y: yA - 12, width: x1 - x0, height: 12, fill: '#bbdefb', stroke: C.azul, 'stroke-width': 1.4 });
E(S, 'rect', { x: x0, y: yB, width: x1 - x0, height: 12, fill: '#ffcdd2', stroke: C.rojo, 'stroke-width': 1.4 });
for (let x = x0 + 20; x < x1; x += 40) { texto(x, yA - 1, '−', { size: 13, c: C.azul, bold: true }); texto(x, yB + 11, '+', { size: 13, c: C.rojo, bold: true }); }
for (let x = x0 + 30; x < x1; x += 60) flecha(x, yB - 6, x, yA + 6, { c: C.claro, w: 1.6, head: 9 });
texto(x0 + 12, yA + 26, 'E', { italic: true, c: C.gris, size: 18 });
// trayectoria: y = y0 + k (x - x0)^2 hacia abajo en el lienzo (la fuerza sobre el electrón es hacia abajo)
const k = 70 / (x1 - x0) ** 2;
camino(curva(x => y0 + k * (x - x0) ** 2, x0, x1), { c: C.morado, w: 2.6 });
const yS = y0 + 70, m = 2 * k * (x1 - x0);
linea(x1, yS, x1 + 170, yS + m * 170, { c: C.morado, w: 2.2, dash: '6 4' });
linea(20, y0, x0, y0, { c: C.morado, w: 2.6 });
bola(40, y0, 7, { fill: '#42a5f5' }); texto(40, y0 - 14, 'e⁻', { size: 15 });
flecha(46, y0 - 26, 96, y0 - 26, { c: C.verde, w: 2.2, head: 9 }); texto(72, y0 - 34, 'v_0', { italic: true, c: C.verde, size: 17 });
const xm = 260, ym = y0 + k * (xm - x0) ** 2;
flecha(xm, ym, xm, ym + 50, { c: C.rojo, w: 2.4, head: 10 }); texto(xm + 8, ym + 46, 'F = −eE', { italic: true, c: C.rojo, anchor: 'start', size: 16 });
linea(x0, y0, x1 + 40, y0, { c: C.gris, w: 1, dash: '3 4' });
cota(x0, 262, x1, 262, 'L', { dy: -6 });

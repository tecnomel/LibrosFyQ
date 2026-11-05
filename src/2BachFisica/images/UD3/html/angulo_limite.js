// Ángulo límite y reflexión total: rayos que salen de un foco sumergido en agua con ángulos crecientes.
lienzo(640, 320);
const Y = 120, P = [140, 285], n1 = 1.33, n2 = 1;
E(S, 'rect', { x: 20, y: Y, width: 600, height: 190, fill: '#e3f2fd' });
linea(20, Y, 620, Y, { w: 2 });
texto(30, 40, 'aire (n_2 = 1,00)', { size: 15, anchor: 'start' });
texto(610, 300, 'agua (n_1 = 1,33)', { size: 15, anchor: 'end' });
const iL = Math.asin(n2 / n1);
[[25 * Math.PI / 180, C.verde, '1'], [iL, C.naranja, '2'], [62 * Math.PI / 180, C.rojo, '3']].forEach(([a, c, k]) => {
    const M = [P[0] + (P[1] - Y) * Math.tan(a), Y];
    linea(P[0], P[1], M[0], M[1], { c, w: 2.2 }); flecha(P[0], P[1], (P[0] + M[0]) / 2, (P[1] + M[1]) / 2, { c, w: 2.2 });
    linea(M[0], Y - 70, M[0], Y + 70, { c: C.gris, w: 1, dash: '5 4' });
    const t = refractar([Math.sin(a), -Math.cos(a)], [0, 1], n1, n2);
    if (t && Math.abs(t[1]) > 0.02) flecha(M[0], M[1], M[0] + 110 * t[0], M[1] + 110 * t[1], { c, w: 2.2 });
    else if (t) flecha(M[0], M[1], M[0] + 120, M[1] - 2, { c, w: 2.2 });
    else flecha(M[0], M[1], M[0] + 120 * Math.sin(a), M[1] + 120 * Math.cos(a), { c, w: 2.2 });
});
const ML = [P[0] + (P[1] - Y) * Math.tan(iL), Y];
arco(ML[0], Y, 40, -90, -90 - iL * 180 / Math.PI, { c: C.naranja, w: 1.6 });
texto(ML[0] - 26, Y + 56, 'î_L', { italic: true, c: C.naranja });
texto(ML[0] + 66, Y - 8, '90°', { size: 15, c: C.naranja });
bola(P[0], P[1], 6, { fill: '#ffd54f', c: C.naranja });
texto(P[0] - 14, P[1] + 4, 'P', { italic: true, anchor: 'end' });
texto(470, 230, 'reflexión total', { size: 15, c: C.rojo });

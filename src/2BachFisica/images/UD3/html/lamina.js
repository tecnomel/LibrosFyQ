// Lámina de caras planas y paralelas: el rayo emergente es paralelo al incidente pero está desplazado una distancia δ.
lienzo(440, 340);
const y1 = 110, y2 = 230, n = 1.5, i = 50 * Math.PI / 180, r = Math.asin(Math.sin(i) / n);
E(S, 'rect', { x: 30, y: y1, width: 380, height: y2 - y1, fill: '#e3f2fd', stroke: C.azul, 'stroke-width': 1.5 });
const A = [140, y1], B = [140 + (y2 - y1) * Math.tan(r), y2];
const I0 = [A[0] - 100 * Math.tan(i), y1 - 100];
linea(I0[0], I0[1], A[0], A[1], { c: C.rojo, w: 2.4 }); flecha(I0[0], I0[1], (I0[0] + A[0]) / 2, (I0[1] + A[1]) / 2, { c: C.rojo, w: 2.4 });
linea(A[0], A[1], B[0], B[1], { c: C.rojo, w: 2.4 });
const E2 = [B[0] + 90 * Math.tan(i), y2 + 90];
flecha(B[0], B[1], E2[0], E2[1], { c: C.rojo, w: 2.4 });
// prolongación del rayo incidente y desplazamiento lateral
const Pr = [A[0] + 200 * Math.tan(i), y1 + 200];
linea(A[0], A[1], Pr[0], Pr[1], { c: C.gris, w: 1.3, dash: '5 4' });
const u = [Math.sin(i), Math.cos(i)], w = V.res(B, A), t = V.dot(w, u), H = V.sum(A, V.mul(u, t));
linea(B[0], B[1], H[0], H[1], { c: C.verde, w: 2 });
texto((B[0] + H[0]) / 2 + 12, (B[1] + H[1]) / 2 + 4, 'δ', { italic: true, c: C.verde, anchor: 'start' });
[A, B].forEach(p => linea(p[0], p[1] - 55, p[0], p[1] + 55, { c: C.gris, w: 1, dash: '4 4' }));
arco(A[0], A[1], 42, 90, 90 + i * 180 / Math.PI, { c: C.rojo, w: 1.5 }); texto(A[0] - 22, A[1] - 48, 'î_1', { italic: true, c: C.rojo, size: 17 });
arco(A[0], A[1], 46, -90, -90 + r * 180 / Math.PI, { c: C.azul, w: 1.5 }); texto(A[0] + 2, A[1] + 64, 'r̂_1', { italic: true, c: C.azul, size: 17 });
arco(B[0], B[1], 40, -90, -90 + i * 180 / Math.PI, { c: C.rojo, w: 1.5 }); texto(B[0] + 14, B[1] + 58, 'î_2', { italic: true, c: C.rojo, size: 17 });
texto(A[0] - 8, A[1] - 6, 'A', { italic: true, anchor: 'end', size: 17 }); texto(B[0] - 8, B[1] + 18, 'B', { italic: true, anchor: 'end', size: 17 });
cota(400, y1, 400, y2, '', {}); texto(392, (y1 + y2) / 2 + 6, 'e', { italic: true, anchor: 'end' });
texto(36, y1 + 24, 'n', { italic: true, anchor: 'start', size: 17 }); texto(400, 40, 'aire', { anchor: 'end', size: 15 });

// Marcha de un rayo a través de un prisma óptico de ángulo φ y ángulo de desviación δ (trazado exacto con la ley de Snell).
lienzo(560, 360);
const A = [250, 40], L = [250 - 280 * Math.tan(Math.PI / 6), 320], R = [250 + 280 * Math.tan(Math.PI / 6), 320], n = 1.5;
E(S, 'polygon', { points: [A, L, R].map(q => q.join(',')).join(' '), fill: '#e3f2fd', stroke: C.azul, 'stroke-width': 2 });
const P1 = V.sum(A, V.mul(V.res(L, A), 0.5));
const nIzq = V.uni([-(L[1] - A[1]), L[0] - A[0]]);            // normal a la cara izquierda (hacia fuera)
const ang = 20 * Math.PI / 180, d0 = [Math.cos(ang), -Math.sin(ang)];
const I0 = V.res(P1, V.mul(d0, 170));
const d1 = refractar(d0, nIzq, 1, n);
const P2 = cortaSegmento(P1, d1, A, R);
const nDer = V.uni([R[1] - A[1], -(R[0] - A[0])]);
const d2 = refractar(d1, nDer, n, 1);
const E2 = V.sum(P2, V.mul(d2, 170));
linea(I0[0], I0[1], P1[0], P1[1], { c: C.rojo, w: 2.4 }); flecha(I0[0], I0[1], (I0[0] + P1[0]) / 2, (I0[1] + P1[1]) / 2, { c: C.rojo, w: 2.4 });
linea(P1[0], P1[1], P2[0], P2[1], { c: C.rojo, w: 2.4 });
flecha(P2[0], P2[1], E2[0], E2[1], { c: C.rojo, w: 2.4 });
// normales
[[P1, nIzq], [P2, nDer]].forEach(([p, m]) => linea(p[0] + 60 * m[0], p[1] + 60 * m[1], p[0] - 60 * m[0], p[1] - 60 * m[1], { c: C.gris, w: 1.2, dash: '5 4' }));
// desviación: prolongaciones del incidente y del emergente
const Pr = V.sum(P1, V.mul(d0, 260));
linea(P1[0], P1[1], Pr[0], Pr[1], { c: C.gris, w: 1.2, dash: '5 4' });
const t = ((P2[0] - P1[0]) * d2[1] - (P2[1] - P1[1]) * d2[0]) / (d0[0] * d2[1] - d0[1] * d2[0]);
const D = V.sum(P1, V.mul(d0, t));
linea(D[0], D[1], P2[0], P2[1], { c: C.gris, w: 1.2, dash: '5 4' });
const a0 = -ang * 180 / Math.PI, a1 = Math.atan2(-d2[1], d2[0]) * 180 / Math.PI;
arco(D[0], D[1], 95, a1, -a0, { c: C.verde, w: 1.8 });
texto(D[0] + 104, D[1] + 6, 'δ', { italic: true, c: C.verde, anchor: 'start' });
arco(A[0], A[1], 34, -120, -60, { c: C.morado, w: 1.6 });
texto(A[0], A[1] + 52, 'φ', { italic: true, c: C.morado });
texto(P1[0] - 22, P1[1] + 30, 'î_1', { italic: true, size: 17, c: C.rojo });
texto(P2[0] + 30, P2[1] + 34, 'r̂_2', { italic: true, size: 17, c: C.rojo });
texto(250, 300, 'n', { italic: true, size: 18 });

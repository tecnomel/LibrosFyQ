// Dispersión de la luz blanca en un prisma: cada color tiene un índice de refracción distinto (exagerado en el dibujo).
lienzo(660, 330);
const A = [250, 30], L = [250 - 270 * Math.tan(Math.PI / 6), 300], R = [250 + 270 * Math.tan(Math.PI / 6), 300];
E(S, 'polygon', { points: [A, L, R].map(q => q.join(',')).join(' '), fill: '#eceff1', stroke: C.tinta, 'stroke-width': 2 });
const P1 = V.sum(A, V.mul(V.res(L, A), 0.45));
const nIzq = V.uni([-(L[1] - A[1]), L[0] - A[0]]), nDer = V.uni([R[1] - A[1], -(R[0] - A[0])]);
const ang = 18 * Math.PI / 180, d0 = [Math.cos(ang), -Math.sin(ang)];
const I0 = V.res(P1, V.mul(d0, 180));
linea(I0[0], I0[1], P1[0], P1[1], { c: C.tinta, w: 4 });
texto(I0[0] + 4, I0[1] - 14, 'luz blanca', { size: 15, anchor: 'start' });
const colores = [['#d32f2f', 1.50, 'rojo'], ['#f57c00', 1.513], ['#fbc02d', 1.526], ['#388e3c', 1.54], ['#1976d2', 1.555], ['#3949ab', 1.568], ['#8e24aa', 1.58, 'violeta']];
colores.forEach(([c, n, nom]) => {
    const d1 = refractar(d0, nIzq, 1, n), P2 = cortaSegmento(P1, d1, A, R), d2 = refractar(d1, nDer, n, 1);
    E(S, 'line', { x1: P1[0], y1: P1[1], x2: P2[0], y2: P2[1], stroke: c, 'stroke-width': 1.6, 'stroke-opacity': .8 });
    const E2 = V.sum(P2, V.mul(d2, 230));
    linea(P2[0], P2[1], E2[0], E2[1], { c, w: 3 });
    if (nom) texto(E2[0] + 8, E2[1] + 5, nom, { size: 15, anchor: 'start', c });
});

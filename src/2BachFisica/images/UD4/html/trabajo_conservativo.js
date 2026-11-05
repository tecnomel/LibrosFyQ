// La fuerza gravitatoria es conservativa: el trabajo de A a B es el mismo por el camino APB que por el AP'B.
lienzo(560, 330);
const M = [60, 260], rA = 150, rB = 400, a1 = -0.12, a2 = -0.58;
const pt = (r, a) => [M[0] + r * Math.cos(a), M[1] + r * Math.sin(a)];
const A = pt(rA, a1), P = pt(rB, a1), Pp = pt(rA, a2), B = pt(rB, a2);
bola(M[0], M[1], 18, { fill: '#90a4ae' }); texto(M[0], M[1] + 6, 'M', { italic: true, size: 17 });
// camino 1: radial A→P y arco P→B
linea(A[0], A[1], P[0], P[1], { c: C.rojo, w: 2.6 }); flecha(A[0], A[1], (A[0] + P[0]) / 2, (A[1] + P[1]) / 2, { c: C.rojo, w: 2.6 });
arco(M[0], M[1], rB, -a1 * 180 / Math.PI, -a2 * 180 / Math.PI, { c: C.rojo, w: 2.6 });
// camino 2: arco A→P' y radial P'→B
arco(M[0], M[1], rA, -a1 * 180 / Math.PI, -a2 * 180 / Math.PI, { c: C.azul, w: 2.6 });
linea(Pp[0], Pp[1], B[0], B[1], { c: C.azul, w: 2.6 }); flecha(Pp[0], Pp[1], (Pp[0] + B[0]) / 2, (Pp[1] + B[1]) / 2, { c: C.azul, w: 2.6 });
[[A, 'A', 16, 14], [B, 'B', 8, -10], [P, 'P', 14, 18], [Pp, "P'", -14, -8]].forEach(([p, t, dx, dy]) => { bola(p[0], p[1], 6, { fill: C.tinta }); texto(p[0] + dx, p[1] + dy, t, { italic: true, size: 18 }); });
// fuerza sobre m en A, dirigida hacia M
const dA = [M[0] - A[0], M[1] - A[1]], l = Math.hypot(...dA);
flecha(A[0], A[1], A[0] + dA[0] / l * 55, A[1] + dA[1] / l * 55, { c: C.verde, w: 2.2, head: 10 });
texto(A[0] - 40, A[1] + 26, 'F', { italic: true, c: C.verde, size: 18 });
texto(300, 296, 'camino 1: A → P → B', { size: 15, c: C.rojo, anchor: 'start' });
texto(300, 320, "camino 2: A → P' → B", { size: 15, c: C.azul, anchor: 'start' });

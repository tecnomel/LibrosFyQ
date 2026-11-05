// Dioptrio esférico convexo: un rayo que sale de A se refracta en P y corta al eje en A'. Magnitudes del convenio DIN.
lienzo(640, 320);
const Y = 190, O = 240, R = 60, Cx = O + R, n1 = 1, n2 = 1.6, s = -200, sp = n2 / ((n2 - n1) / R + n1 / s);
const arcoX = dy => Cx - Math.sqrt(R * R - dy * dy);
let d = '';
for (let dy = -55; dy <= 55; dy += 1) d += (d ? ' L' : 'M') + arcoX(dy).toFixed(1) + ',' + (Y + dy);
E(S, 'path', { d: d + ` L630,${Y + 55} L630,${Y - 55} Z`, fill: '#e3f2fd' });
camino(d, { c: C.azul, w: 3 });
linea(20, Y, 630, Y, { c: C.gris, w: 1.2 });
const h = 42, P = [arcoX(-h), Y - h], A = [O + s, Y], Ap = [O + sp, Y];
linea(A[0], A[1], P[0], P[1], { c: C.rojo, w: 2.2 }); flecha(A[0], A[1], (A[0] + P[0]) / 2, (A[1] + P[1]) / 2, { c: C.rojo, w: 2.2 });
linea(P[0], P[1], Ap[0], Ap[1], { c: C.rojo, w: 2.2 }); flecha(P[0], P[1], (P[0] + Ap[0]) / 2, (P[1] + Ap[1]) / 2, { c: C.rojo, w: 2.2 });
// normal en P (pasa por C)
const u = V.uni(V.res(P, [Cx, Y]));
linea(Cx, Y, P[0] + 70 * u[0], P[1] + 70 * u[1], { c: C.gris, w: 1.2, dash: '5 4' });
linea(P[0], P[1], P[0], Y, { c: C.verde, w: 1.4, dash: '3 3' }); texto(P[0] - 6, Y - h / 2 + 5, 'h', { italic: true, c: C.verde, anchor: 'end', size: 17 });
[[A, 'A'], [Ap, "A'"], [[O, Y], 'O'], [[Cx, Y], 'C']].forEach(([p, t]) => { punto(p[0], p[1], 4); texto(p[0] + 4, Y + 22, t, { italic: true, size: 17, halo: true }); });
texto(P[0] - 4, P[1] - 10, 'P', { italic: true, size: 17 });
texto(P[0] - 48, P[1] - 26, 'i', { italic: true, size: 17, c: C.rojo });
texto(P[0] + 34, P[1] + 22, "i'", { italic: true, size: 17, c: C.rojo });
texto(120, 70, 'n', { italic: true, size: 20 }); texto(520, 70, "n'", { italic: true, size: 20 });
cota(A[0], Y + 50, O, Y + 50, 's', { dy: 22 });
cota(O, Y + 90, Ap[0], Y + 90, "s'", { dy: 22 });
cota(O, Y - 75, Cx, Y - 75, 'R', { dy: -6 });

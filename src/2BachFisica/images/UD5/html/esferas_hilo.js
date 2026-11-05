// Dos esferas conductoras unidas por un hilo: la carga pasa hasta que sus potenciales se igualan (la mayor se queda más carga).
lienzo(560, 220);
const A = [140, 110], rA = 40, B = [400, 110], rB = 80;
camino(`M${A[0] + rA},${A[1]} Q${(A[0] + B[0]) / 2},${A[1] + 60} ${B[0] - rB},${B[1]}`, { c: C.naranja, w: 2.4 });
E(S, 'circle', { cx: A[0], cy: A[1], r: rA, fill: '#eceff1', stroke: C.tinta, 'stroke-width': 1.8 });
E(S, 'circle', { cx: B[0], cy: B[1], r: rB, fill: '#eceff1', stroke: C.tinta, 'stroke-width': 1.8 });
for (let k = 0; k < 6; k++) { const t = k * Math.PI / 3; texto(A[0] + (rA - 9) * Math.cos(t), A[1] + (rA - 9) * Math.sin(t) + 5, '+', { size: 14, c: C.rojo, bold: true }); }
for (let k = 0; k < 12; k++) { const t = k * Math.PI / 6; texto(B[0] + (rB - 10) * Math.cos(t), B[1] + (rB - 10) * Math.sin(t) + 5, '+', { size: 14, c: C.rojo, bold: true }); }
texto(A[0], A[1] + 6, "q'_1, r_1", { italic: true, size: 15 }); texto(B[0], B[1] + 6, "q'_2, r_2", { italic: true, size: 17 });
texto(280, 210, "V'_1 = V'_2   ⇒   q'_1 / r_1 = q'_2 / r_2", { italic: true, size: 17 });

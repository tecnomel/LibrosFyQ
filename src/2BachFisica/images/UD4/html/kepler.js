// Leyes de Kepler: (a) órbita elíptica con el Sol en un foco; (b) áreas iguales en tiempos iguales (cálculo con la ecuación de Kepler).
lienzo(780, 334);
const a = 150, e = 0.6, b = a * Math.sqrt(1 - e * e);
function elipse(cx, cy) { E(S, 'ellipse', { cx, cy, rx: a, ry: b, fill: 'none', stroke: C.morado, 'stroke-width': 2.2 }); }
// posición del planeta en función de la anomalía media M (resolviendo E - e·sen E = M)
function pos(cx, cy, M) {
    let Ee = M; for (let k = 0; k < 30; k++) Ee = M + e * Math.sin(Ee);
    return [cx + a * Math.cos(Ee), cy - b * Math.sin(Ee)];
}
// (a)
const c1 = [200, 150], F1 = [c1[0] + a * e, c1[1]], F2 = [c1[0] - a * e, c1[1]];
elipse(...c1);
linea(c1[0] - a - 10, c1[1], c1[0] + a + 10, c1[1], { c: C.gris, w: 1, dash: '5 4' });
bola(F1[0], F1[1], 12, { fill: '#ffd54f', c: C.naranja }); punto(F2[0], F2[1], 4, C.gris);
texto(F1[0], F1[1] + 30, 'Sol (foco)', { size: 14, halo: true }); texto(F2[0], F2[1] + 22, 'foco', { size: 13, c: C.gris });
const P = pos(...c1, 1.9); bola(P[0], P[1], 7, { fill: '#64b5f6' });
linea(F1[0], F1[1], P[0], P[1], { c: C.azul, w: 1.6 });
texto(P[0] + 8, P[1] - 12, 'planeta', { size: 14, anchor: 'start' });
texto(c1[0] + a + 6, c1[1] - 10, 'perihelio', { size: 13, anchor: 'start' }); texto(c1[0] - a - 6, c1[1] - 10, 'afelio', { size: 13, anchor: 'end' });
cota(c1[0], c1[1] + b + 14, c1[0] + a, c1[1] + b + 14, 'a', { dy: 20, dx: 40 });
texto(200, 328, '(a) Primera ley: órbitas elípticas', { size: 15 });
// (b) dos sectores barridos en el mismo intervalo de tiempo
const c2 = [570, 150], S2 = [c2[0] + a * e, c2[1]];
function sector(M0, M1, color) {
    let d = `M${S2[0]},${S2[1]}`;
    for (let k = 0; k <= 30; k++) { const p = pos(...c2, M0 + (M1 - M0) * k / 30); d += ` L${p[0].toFixed(1)},${p[1].toFixed(1)}`; }
    E(S, 'path', { d: d + ' Z', fill: color, 'fill-opacity': .35, stroke: color, 'stroke-width': 1.2 });
}
const dM = 0.55;
sector(-dM / 2, dM / 2, C.rojo);                 // cerca del perihelio
sector(Math.PI - dM / 2, Math.PI + dM / 2, C.azul); // cerca del afelio
elipse(...c2);
bola(S2[0], S2[1], 11, { fill: '#ffd54f', c: C.naranja });
texto(S2[0] + 70, c2[1] - 6, 'A_1', { italic: true, c: C.rojo, size: 17, halo: true });
texto(c2[0] - a + 40, c2[1] + 6, 'A_2', { italic: true, c: C.azul, size: 17, halo: true });
const pp = pos(...c2, dM / 2), pa = pos(...c2, Math.PI + dM / 2);
flecha(pp[0], pp[1], pp[0] - 10, pp[1] - 46, { c: C.rojo, w: 2.2, head: 10 }); texto(pp[0] + 6, pp[1] - 36, 'v_p', { italic: true, c: C.rojo, anchor: 'start', size: 17 });
flecha(pa[0], pa[1], pa[0] + 26, pa[1] + 8, { c: C.azul, w: 2.2, head: 10 }); texto(pa[0] + 4, pa[1] + 30, 'v_a', { italic: true, c: C.azul, size: 17 });
texto(570, 328, '(b) Segunda ley: A_1 = A_2 en tiempos iguales', { size: 15 });

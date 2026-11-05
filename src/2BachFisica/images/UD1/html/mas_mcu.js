// El m.a.s. como proyección de un movimiento circular uniforme sobre un diámetro vertical.
lienzo(640, 380);
const cx = 220, cy = 190, R = 140, f0 = 22, f = 58; // fase inicial y fase en el instante t (grados)
const pt = a => [cx + R * Math.cos(a * Math.PI / 180), cy - R * Math.sin(a * Math.PI / 180)];

E(S, 'circle', { cx, cy, r: R, fill: C.moradoClaro, stroke: C.morado, 'stroke-width': 2.2 });
linea(cx - R - 30, cy, cx + R + 40, cy, { c: C.gris, w: 1.2, dash: '5 5' });
linea(cx, cy + R + 25, cx, cy - R - 25, { c: C.gris, w: 1.2, dash: '5 5' });
texto(cx + R + 52, cy + 6, 'X', { italic: true, size: 18 });
texto(cx, cy - R - 32, 'Y', { italic: true, size: 18 });

const [x0, y0] = pt(f0), [x1, y1] = pt(f);
linea(cx, cy, x0, y0, { c: C.gris, w: 1.8, dash: '6 4' });
linea(cx, cy, x1, y1, { c: C.tinta, w: 2.2 });
arco(cx, cy, 42, 0, f0, { c: C.azul, w: 1.8 });
arco(cx, cy, 66, f0, f, { c: C.rojo, w: 1.8 });
texto(cx + 56, cy - 6, 'φ_0', { italic: true, c: C.azul, size: 18 });
texto(cx + 70, cy - 46, 'ωt', { italic: true, c: C.rojo, size: 18 });
bola(x0, y0, 7, { fill: '#fff', c: C.gris });
bola(x1, y1, 9, { fill: C.morado });
texto(x0 + 18, y0 + 6, 'P_0', { italic: true, size: 18, anchor: 'start', c: C.gris });
texto(x1 + 14, y1 - 8, 'P', { italic: true, size: 20, anchor: 'start' });
// sentido de giro
arco(cx, cy, R + 18, 100, 140, { c: C.morado, w: 1.6 });
const [ax, ay] = [cx + (R + 18) * Math.cos(140 * Math.PI / 180), cy - (R + 18) * Math.sin(140 * Math.PI / 180)];
flecha(ax + 8, ay - 7, ax, ay + 1, { c: C.morado, head: 10 });
texto(cx - 70, cy - R - 10, 'ω', { italic: true, c: C.morado });

// proyección sobre el diámetro vertical y sobre un eje aparte
linea(x1, y1, cx, y1, { c: C.gris, w: 1.2, dash: '4 4' });
punto(cx, y1, 5, C.verde);
const ex = 520;
linea(cx, y1, ex, y1, { c: C.gris, w: 1, dash: '2 5' });
linea(ex, cy - R - 15, ex, cy + R + 15, { w: 2 });
[[cy - R, '+A'], [cy, '0'], [cy + R, '−A']].forEach(([y, s]) => { linea(ex - 7, y, ex + 7, y, { w: 2 }); texto(ex + 16, y + 6, s, { italic: true, anchor: 'start', size: 18 }); });
bola(ex, y1, 9, { fill: C.verde });
flecha(ex - 34, cy, ex - 34, y1 + 2, { c: C.verde, w: 2, head: 10 });
texto(ex - 46, (cy + y1) / 2 + 6, 'y', { italic: true, c: C.verde, anchor: 'end' });
texto(ex, 368, 'y = A · sen(ωt + φ_0)', { italic: true, size: 18 });

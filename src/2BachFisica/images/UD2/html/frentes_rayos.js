// Frentes de onda y rayos: ondas esféricas (circulares en un plano) y ondas planas.
lienzo(720, 310);
// (a) foco puntual
const fx = 170, fy = 140;
[40, 80, 120].forEach(r => E(S, 'circle', { cx: fx, cy: fy, r, fill: 'none', stroke: C.morado, 'stroke-width': 2.4 }));
for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4 + Math.PI / 8;
    flecha(fx + 14 * Math.cos(a), fy - 14 * Math.sin(a), fx + 140 * Math.cos(a), fy - 140 * Math.sin(a), { c: C.rojo, w: 1.6, head: 9 });
}
bola(fx, fy, 6, { fill: C.tinta });
texto(fx + 8, fy + 30, 'foco', { size: 15, halo: true });
texto(fx + 125, 24, 'frente de onda', { size: 15, c: C.morado, anchor: 'start' });
linea(fx + 122, 30, fx + 88, 52, { c: C.morado, w: 1 });
texto(fx + 118, fy + 70, 'rayo', { size: 15, c: C.rojo, anchor: 'start', halo: true });
texto(fx, 300, '(a) Ondas esféricas', { size: 17 });
// (b) ondas planas
[440, 500, 560, 620].forEach(x => linea(x, 30, x, 250, { c: C.morado, w: 2.4 }));
[70, 140, 210].forEach(y => flecha(400, y, 700, y, { c: C.rojo, w: 1.6, head: 9 }));
texto(560, 272, 'frentes de onda', { size: 15, c: C.morado });
texto(705, 60, 'rayo', { size: 15, c: C.rojo, anchor: 'end' });
texto(550, 300, '(b) Ondas planas', { size: 17 });

// Reflexión de un pulso en una cuerda: en un extremo fijo se invierte; en un extremo libre, no.
lienzo(760, 300);
const pulso = (c, s) => x => s * 40 * Math.exp(-(((x - c) / 20) ** 2));
function cuerda(x0, x1, y, c, s) { camino(curva(x => y - pulso(c, s)(x), x0, x1), { c: C.morado, w: 2.6 }); }
// (a) extremo fijo
const xp = 330;
rayado(xp, 40, 14, 220); linea(xp, 40, xp, 260, { w: 2.5 });
cuerda(30, xp, 95, 170, 1);  flecha(150, 40, 200, 40, { c: C.verde, w: 2, head: 9 });
cuerda(30, xp, 200, 200, -1); flecha(220, 255, 170, 255, { c: C.verde, w: 2, head: 9 });
texto(40, 60, 'incidente', { size: 15, anchor: 'start' });
texto(40, 175, 'reflejado', { size: 15, anchor: 'start' });
texto(180, 292, '(a) Extremo fijo: el pulso se invierte', { size: 16 });
// (b) extremo libre: anilla que desliza por una varilla
const xv = 720;
[95, 200].forEach(y => {
    linea(xv, y - 55, xv, y + 55, { c: C.gris, w: 4 });
    E(S, 'ellipse', { cx: xv, cy: y, rx: 6, ry: 4, fill: 'none', stroke: C.tinta, 'stroke-width': 2 });
});
cuerda(420, xv - 6, 95, 560, 1);  flecha(540, 40, 590, 40, { c: C.verde, w: 2, head: 9 });
cuerda(420, xv - 6, 200, 590, 1); flecha(610, 145, 560, 145, { c: C.verde, w: 2, head: 9 });
texto(430, 60, 'incidente', { size: 15, anchor: 'start' });
texto(430, 175, 'reflejado', { size: 15, anchor: 'start' });
texto(570, 292, '(b) Extremo libre: el pulso no se invierte', { size: 16 });

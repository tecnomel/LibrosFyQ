// Práctica: ondas estacionarias en una cuerda (experiencia de Melde). Vibrador, cuerda, polea y pesas.
lienzo(400, 330);
const yc = 120, x0 = 70, xp = 330, rp = 14;
E(S, 'rect', { x: 0, y: 172, width: 340, height: 14, fill: '#d7ccc8', stroke: C.tinta, 'stroke-width': 1.2 });
caja(14, yc - 30, 56, 82, { fill: C.claro, c: C.tinta });
texto(42, yc + 82, 'vibrador', { size: 14 });
linea(x0, yc, xp, yc, { c: C.claro, w: 1 });
const n = 3, L = xp - x0;
camino(curva(x => yc - 24 * Math.sin(n * Math.PI * (x - x0) / L), x0, xp, 1.5), { c: C.morado, w: 2.4 });
camino(curva(x => yc + 24 * Math.sin(n * Math.PI * (x - x0) / L), x0, xp, 1.5), { c: C.morado, w: 1.4, dash: '5 4' });
// polea en el borde de la mesa y pesas
linea(xp, yc + rp, xp + 6, 172, { w: 3 });
E(S, 'circle', { cx: xp, cy: yc + rp - 14, r: rp, fill: '#eee', stroke: C.tinta, 'stroke-width': 2 });
linea(xp + rp, yc, xp + rp, 250, { c: C.morado, w: 2 });
caja(xp + rp - 22, 250, 44, 40, { txt: 'm' });
texto(xp + 4, 72, 'polea', { size: 14 });
cota(x0, 215, xp, 215, 'L', { dy: -8 });
[0, 1, 2, 3].forEach(k => texto(x0 + k * L / 3, yc - 30, 'N', { size: 13, c: C.azul }));

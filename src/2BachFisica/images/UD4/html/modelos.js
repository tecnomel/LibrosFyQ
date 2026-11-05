// Modelo geocéntrico de Ptolomeo (epiciclo y deferente) y modelo heliocéntrico de Copérnico.
lienzo(760, 330);
function orbita(cx, cy, r, o = {}) { E(S, 'circle', { cx, cy, r, fill: 'none', stroke: o.c ?? C.gris, 'stroke-width': o.w ?? 1.4, 'stroke-dasharray': o.dash }); }
// (a) geocéntrico
const ax = 190, ay = 160;
[48, 78].forEach(r => orbita(ax, ay, r));
orbita(ax, ay, 122, { c: C.morado, w: 1.8 });                       // deferente de Marte
const ex = ax + 122 * Math.cos(-0.6), ey = ay + 122 * Math.sin(-0.6);
orbita(ex, ey, 26, { c: C.rojo, w: 1.8 });                         // epiciclo
bola(ex + 26 * Math.cos(2.2), ey + 26 * Math.sin(2.2), 6, { fill: C.rojo });
punto(ex, ey, 3, C.morado);
bola(ax, ay, 13, { fill: '#64b5f6' });
bola(ax + 48 * Math.cos(2.5), ay + 48 * Math.sin(2.5), 5, { fill: '#bdbdbd' });
bola(ax + 78 * Math.cos(0.9), ay + 78 * Math.sin(0.9), 10, { fill: '#ffd54f', c: C.naranja });
texto(ax, ay + 34, 'Tierra', { size: 14 });
texto(ax - 40, ay - 52, 'Luna', { size: 13 });
texto(ax + 80, ay + 92, 'Sol', { size: 13, anchor: 'start' });
texto(ex + 34, ey - 22, 'epiciclo', { size: 13, c: C.rojo, anchor: 'start' });
texto(ax - 88, ay - 108, 'deferente', { size: 13, c: C.morado });
texto(ax, 318, '(a) Geocéntrico (Ptolomeo)', { size: 16 });
// (b) heliocéntrico
const bx = 570, by = 160, pl = [[34, 4, '#9e9e9e', 'Mercurio'], [56, 6, '#ffcc80', 'Venus'], [80, 7, '#64b5f6', 'Tierra'], [106, 6, '#e57373', 'Marte'], [134, 11, '#ffb74d', 'Júpiter']];
pl.forEach(([r, rp, c, n], k) => {
    orbita(bx, by, r);
    const a = 0.7 + k * 1.15, px = bx + r * Math.cos(a), py = by - r * Math.sin(a);
    bola(px, py, rp, { fill: c });
});
bola(bx, by, 16, { fill: '#ffd54f', c: C.naranja });
texto(bx, by + 5, 'Sol', { size: 12 });
texto(bx, 318, '(b) Heliocéntrico (Copérnico)', { size: 16 });

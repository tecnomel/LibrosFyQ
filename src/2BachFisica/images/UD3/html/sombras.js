// Propagación rectilínea: sombra y penumbra de un cuerpo opaco iluminado por un foco extenso, y eclipse de Sol.
lienzo(800, 300);
function cono(sx, sy, R, ox, oy, r, xEnd) {
    const top = [sx, sy - R], bot = [sx, sy + R];
    const lin = (a, b) => enX(a, b, xEnd);
    const tt = lin(top, [ox, oy - r]), bb = lin(bot, [ox, oy + r]);
    const tb = lin(bot, [ox, oy - r]), bt = lin(top, [ox, oy + r]);
    // penumbra: entre los rayos cruzados
    E(S, 'polygon', { points: [[ox, oy - r], tb, bt, [ox, oy + r]].map(q => q.join(',')).join(' '), fill: '#cfcfd8' });
    // sombra: entre los rayos que pasan por el mismo lado (puede cerrarse en un vértice)
    const d1 = V.res([ox, oy - r], top), d2 = V.res([ox, oy + r], bot);
    let pts;
    if (tt[1] < bb[1]) pts = [[ox, oy - r], tt, bb, [ox, oy + r]];
    else { const t = (2 * r) / (d1[1] - d2[1]) ; const ap = V.sum([ox, oy - r], V.mul(d1, t)); pts = [[ox, oy - r], ap, [ox, oy + r]]; }
    E(S, 'polygon', { points: pts.map(q => q.join(',')).join(' '), fill: '#6d6d7a' });
    [[top, [ox, oy - r]], [bot, [ox, oy + r]], [bot, [ox, oy - r]], [top, [ox, oy + r]]].forEach(([a, b]) => {
        const e = lin(a, b); linea(a[0], a[1], e[0], e[1], { c: C.naranja, w: 1.1 });
    });
}
// (a) foco extenso y cuerpo opaco
cono(70, 140, 42, 220, 140, 24, 400);
E(S, 'circle', { cx: 70, cy: 140, r: 42, fill: '#ffe082', stroke: C.naranja, 'stroke-width': 2 });
bola(220, 140, 24, { fill: '#5d4037' });
linea(400, 30, 400, 255, { w: 3 });
texto(70, 210, 'foco extenso', { size: 15 });
texto(330, 145, 'sombra', { size: 15, c: '#fff' });
texto(330, 82, 'penumbra', { size: 15 });
texto(330, 210, 'penumbra', { size: 15 });
texto(210, 290, '(a) Sombra y penumbra', { size: 16 });
// (b) eclipse de Sol: la Luna proyecta su sombra sobre la Tierra
cono(520, 140, 58, 690, 140, 10, 770);
E(S, 'circle', { cx: 520, cy: 140, r: 58, fill: '#ffd54f', stroke: C.naranja, 'stroke-width': 2 });
bola(690, 140, 10, { fill: '#9e9e9e' });
E(S, 'circle', { cx: 778, cy: 140, r: 22, fill: '#64b5f6', stroke: C.azul, 'stroke-width': 2 });
texto(520, 146, 'Sol', { size: 16 }); texto(690, 116, 'Luna', { size: 14 }); texto(790, 190, 'Tierra', { size: 14, anchor: 'end' });
texto(650, 290, '(b) Eclipse de Sol (sin escala)', { size: 16 });

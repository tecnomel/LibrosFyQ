// Dioptrio plano: un objeto sumergido se ve más cerca de la superficie (profundidad aparente s' menor que la real s).
lienzo(480, 320);
const Y = 110, X = 300, s = 170, sp = s / 1.33;
E(S, 'rect', { x: 20, y: Y, width: 440, height: 200, fill: '#e3f2fd' });
linea(20, Y, 460, Y, { w: 2 });
texto(30, 40, 'aire', { size: 15, anchor: 'start' }); texto(30, 300, 'agua', { size: 15, anchor: 'start' });
const Ob = [X, Y + s], Im = [X, Y + sp];
[[-60, C.rojo], [-95, C.naranja]].forEach(([dx, c]) => {
    const M = [X + dx, Y], dir = V.uni(V.res(M, Im));
    linea(Ob[0], Ob[1], M[0], M[1], { c, w: 2 }); flecha(Ob[0], Ob[1], (Ob[0] + M[0]) / 2, (Ob[1] + M[1]) / 2, { c, w: 2 });
    flecha(M[0], M[1], M[0] + 150 * dir[0], M[1] + 150 * dir[1], { c, w: 2 });
    linea(M[0], M[1], Im[0], Im[1], { c, w: 1.2, dash: '5 4' });
});
linea(X, Y - 20, X, Y + s + 10, { c: C.gris, w: 1, dash: '4 4' });
bola(Ob[0], Ob[1], 9, { fill: '#ffb300' }); bola(Im[0], Im[1], 9, { fill: '#ffe082', dash: '3 2', c: C.gris });
texto(X + 16, Ob[1] + 6, 'objeto', { size: 14, anchor: 'start' }); texto(X + 16, Im[1] + 6, 'imagen', { size: 14, anchor: 'start' });
cota(X + 110, Y, X + 110, Ob[1], '', {}); texto(X + 120, Y + s / 2 + 22, 's', { italic: true, anchor: 'start' });
cota(X + 80, Y, X + 80, Im[1], '', {}); texto(X + 88, Y + sp / 2 - 4, "s'", { italic: true, anchor: 'start' });
// ojo

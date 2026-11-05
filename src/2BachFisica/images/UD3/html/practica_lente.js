// Práctica: banco óptico para medir la distancia focal de una lente convergente (objeto iluminado, lente y pantalla).
lienzo(780, 250);
const Y = 120, Xo = 110, Xl = 330, f = 120, s = Xo - Xl, sp = 1 / (1 / f + 1 / s), Xp = Xl + sp, y = 40, yp = sp / s * y;
// banco
E(S, 'rect', { x: 20, y: 200, width: 740, height: 12, fill: '#d7ccc8', stroke: C.tinta, 'stroke-width': 1.2 });
for (let x = 30; x <= 750; x += 20) linea(x, 200, x, x % 100 === 30 ? 190 : 195, { w: 1 });
// foco luminoso y objeto
E(S, 'rect', { x: 30, y: Y - 40, width: 50, height: 80, rx: 6, fill: '#ffe082', stroke: C.tinta, 'stroke-width': 1.5 });
linea(55, Y + 40, 55, 200, { w: 3 });
linea(Xo, Y - 60, Xo, Y + 60, { c: C.gris, w: 4 }); linea(Xo, Y + 60, Xo, 200, { w: 3 });
flechaObj(Xo + 4, Y, Y - y);
// lente y pantalla
lente(Xl, Y, 65, true); linea(Xl, Y + 65, Xl, 200, { w: 3 });
E(S, 'rect', { x: Xp, y: Y - 75, width: 8, height: 150, fill: '#eceff1', stroke: C.tinta, 'stroke-width': 1.5 });
linea(Xp + 4, Y + 75, Xp + 4, 200, { w: 3 });
flechaObj(Xp - 3, Y, Y - yp, { c: C.naranja });
linea(Xo, Y - y, Xl, Y - y, { c: C.rojo, w: 1.4 }); linea(Xl, Y - y, Xp, Y - yp, { c: C.rojo, w: 1.4 });
linea(Xo, Y - y, Xp, Y - yp, { c: C.rojo, w: 1.4 });
linea(20, Y, 760, Y, { c: C.gris, w: 1, dash: '4 4' });
cota(Xo, 230, Xl, 230, 's', { dy: -6 }); cota(Xl, 230, Xp, 230, "s'", { dy: -6 });
texto(55, 66, 'lámpara', { size: 14 }); texto(Xo, 50, 'objeto', { size: 14 }); texto(Xl, 46, 'lente', { size: 14 }); texto(Xp + 4, 36, 'pantalla', { size: 14 });

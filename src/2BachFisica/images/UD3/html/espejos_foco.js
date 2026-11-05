// Foco de un espejo esférico: en el cóncavo los rayos paralelos reflejados pasan por F; en el convexo, sus prolongaciones.
lienzo(780, 290);
const Y = 120;
// (a) cóncavo
const X1 = 330, f1 = -130;
linea(10, Y, 370, Y, { c: C.gris, w: 1.2 });
[-60, -30, 30, 60].forEach(dy => {
    const x = X1 - 0.0022 * dy * dy;
    linea(15, Y + dy, x, Y + dy, { c: C.rojo, w: 1.8 });
    const dir = V.uni(V.res([X1 + f1, Y], [x, Y + dy]));
    linea(x, Y + dy, x + 280 * dir[0], Y + dy + 280 * dir[1], { c: C.rojo, w: 1.8 });
});
espejo(X1, Y, 85, 0.0022);
marcaEje(X1 + f1, Y, 'F'); marcaEje(X1 + 2 * f1, Y, 'C');
cota(X1 + f1, Y + 100, X1, Y + 100, 'f', { dy: -8 });
texto(190, 282, '(a) Espejo cóncavo (f < 0)', { size: 16 });
// (b) convexo
const X2 = 560, f2 = 110;
linea(400, Y, 770, Y, { c: C.gris, w: 1.2 });
[-60, -30, 30, 60].forEach(dy => {
    const x = X2 + 0.0022 * dy * dy;
    linea(405, Y + dy, x, Y + dy, { c: C.rojo, w: 1.8 });
    const dir = V.uni(V.res([x, Y + dy], [X2 + f2, Y]));
    linea(x, Y + dy, x + 160 * dir[0], Y + dy + 160 * dir[1], { c: C.rojo, w: 1.8 });
    linea(x, Y + dy, X2 + f2, Y, { c: C.rojo, w: 1.1, dash: '5 4' });
});
espejo(X2, Y, 85, -0.0022);
marcaEje(X2 + f2, Y, 'F'); marcaEje(X2 + 2 * f2 > 770 ? 760 : X2 + 2 * f2, Y, 'C');
cota(X2, Y + 100, X2 + f2, Y + 100, 'f', { dy: -8 });
texto(585, 282, '(b) Espejo convexo (f > 0)', { size: 16 });

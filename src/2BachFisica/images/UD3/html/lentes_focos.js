// Foco imagen de una lente delgada: en la convergente los rayos paralelos se cortan en F'; en la divergente, sus prolongaciones.
lienzo(780, 290);
const Y = 120;
// (a) convergente
const X1 = 170, f1 = 120;
linea(10, Y, 380, Y, { c: C.gris, w: 1.2 });
[-60, -30, 30, 60].forEach(dy => {
    linea(15, Y + dy, X1, Y + dy, { c: C.rojo, w: 1.8 });
    const dir = V.uni(V.res([X1 + f1, Y], [X1, Y + dy]));
    linea(X1, Y + dy, X1 + 200 * dir[0], Y + dy + 200 * dir[1], { c: C.rojo, w: 1.8 });
});
lente(X1, Y, 85, true);
marcaEje(X1 - f1, Y, 'F'); marcaEje(X1 + f1, Y, "F'");
cota(X1, Y + 100, X1 + f1, Y + 100, "f' > 0", { dy: -8 });
texto(190, 282, '(a) Lente convergente', { size: 16 });
// (b) divergente
const X2 = 590, f2 = -120;
linea(400, Y, 770, Y, { c: C.gris, w: 1.2 });
[-60, -30, 30, 60].forEach(dy => {
    linea(405, Y + dy, X2, Y + dy, { c: C.rojo, w: 1.8 });
    const dir = V.uni(V.res([X2, Y + dy], [X2 + f2, Y]));
    linea(X2, Y + dy, X2 + 180 * dir[0], Y + dy + 180 * dir[1], { c: C.rojo, w: 1.8 });
    linea(X2, Y + dy, X2 + f2, Y, { c: C.rojo, w: 1.1, dash: '5 4' });
});
lente(X2, Y, 85, false);
marcaEje(X2 + f2, Y, "F'"); marcaEje(X2 - f2, Y, 'F');
cota(X2 + f2, Y + 100, X2, Y + 100, "f' < 0", { dy: -8 });
texto(585, 282, '(b) Lente divergente', { size: 16 });

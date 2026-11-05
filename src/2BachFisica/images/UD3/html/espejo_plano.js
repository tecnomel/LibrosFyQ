// Espejo plano: la imagen es virtual, derecha, del mismo tamaño y está a la misma distancia detrás del espejo.
lienzo(560, 300);
const X = 280, Y = 220, s = 150, y = 90;
linea(20, Y, 540, Y, { c: C.gris, w: 1.2 });
linea(X, 30, X, 260, { c: C.azul, w: 3.5 });
for (let yy = 36; yy < 260; yy += 11) linea(X + 2, yy, X + 9, yy - 7, { c: C.gris, w: 1.2 });
const B = [X - s, Y - y], Bp = [X + s, Y - y];
flechaObj(B[0], Y, B[1]); flechaObj(Bp[0], Y, Bp[1], { c: C.naranja, dash: '6 4', w: 2.6 });
// dos rayos que salen de B y, tras reflejarse, llegan al ojo; sus prolongaciones se cortan en B'
const ojo = [55, 52];
[[ojo[0], ojo[1] - 8], [ojo[0], ojo[1] + 8]].forEach(Q => {
    const M = enX(Bp, Q, X);
    linea(B[0], B[1], M[0], M[1], { c: C.rojo, w: 2 }); flecha(B[0], B[1], (B[0] + M[0]) / 2, (B[1] + M[1]) / 2, { c: C.rojo, w: 2 });
    flecha(M[0], M[1], Q[0] + 18, Q[1] + (M[1] - Q[1]) * 18 / (M[0] - Q[0]), { c: C.rojo, w: 2 });
    linea(M[0], M[1], Bp[0], Bp[1], { c: C.rojo, w: 1.2, dash: '5 4' });
});
E(S, 'ellipse', { cx: ojo[0], cy: ojo[1], rx: 16, ry: 10, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 });
bola(ojo[0] + 6, ojo[1], 4, { fill: C.tinta });
texto(B[0], Y + 22, 'objeto', { size: 15 }); texto(Bp[0], Y + 22, 'imagen virtual', { size: 15 });
cota(B[0], Y + 50, X, Y + 50, 's', { dy: 22 }); cota(X, Y + 50, Bp[0], Y + 50, "s'", { dy: 22 });

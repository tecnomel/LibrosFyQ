// Masa unida a un muelle horizontal sin rozamiento: la fuerza del muelle siempre apunta hacia x = 0.
lienzo(640, 440);
const x0 = 330, bw = 70, bh = 50; // x0: posición del bloque en el equilibrio (borde izquierdo)
linea(x0 + bw / 2, 22, x0 + bw / 2, 430, { c: C.gris, w: 1.2, dash: '5 5' });
texto(x0 + bw / 2 + 8, 18, 'x = 0', { italic: true, size: 18, anchor: 'start' });

const filas = [
    { y: 70, dx: 80, txt: 'x > 0', F: -1 },
    { y: 205, dx: 0, txt: 'x = 0', F: 0 },
    { y: 340, dx: -80, txt: 'x < 0', F: 1 },
];
filas.forEach(({ y, dx, txt, F }) => {
    rayado(30, y - 10, 24, bh + 28);
    linea(54, y - 10, 54, y + bh + 18, { w: 2.5 });
    rayado(54, y + bh, 560, 12);
    linea(54, y + bh, 614, y + bh, { w: 2.5 });
    const bx = x0 + dx;
    muelleH(54, bx, y + bh / 2, { ancho: 11, n: 16 });
    caja(bx, y, bw, bh, { txt: 'm' });
    texto(600, y + bh / 2 + 7, txt, { italic: true, anchor: 'end', size: 20 });
    if (F) {
        const xc = bx + bw / 2, yf = y - 16;
        flecha(xc, yf, xc + F * 95, yf, { c: C.rojo, w: 3, head: 13 });
        vecTexto(xc + F * 60, yf - 10, 'F', { c: C.rojo, size: 22 });
        flecha(x0 + bw / 2, y + bh + 30, bx + bw / 2, y + bh + 30, { c: C.azul, w: 1.8, head: 9 });
        texto((x0 + bx) / 2 + bw / 2, y + bh + 52, 'x', { italic: true, c: C.azul });
    } else {
        texto(x0 + bw / 2 + 60, y - 6, 'F = 0', { italic: true, c: C.rojo, size: 20 });
    }
});

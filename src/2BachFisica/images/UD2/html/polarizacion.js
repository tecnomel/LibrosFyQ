// Polarización en una cuerda: la onda que vibra en vertical atraviesa una rendija vertical, pero no una horizontal.
lienzo(780, 290);
const y = 135, lam = 92, A = 42;
function tabla(x, vertical) {
    E(S, 'polygon', { points: `${x - 16},${y - 80} ${x + 16},${y - 104} ${x + 16},${y + 86} ${x - 16},${y + 110}`, fill: '#d7ccc8', stroke: C.tinta, 'stroke-width': 1.5 });
    if (vertical) linea(x, y - 78, x, y + 84, { c: '#fff', w: 7 });
    else linea(x - 13, y + 10, x + 13, y - 10, { c: '#fff', w: 7 });
}
camino(seno(30, 290, y, A, lam), { c: C.morado, w: 2.8 });
tabla(290, true);
camino(seno(290, 530, y, A, lam, 2 * Math.PI * 260 / lam), { c: C.morado, w: 2.8 });
// la cuerda llega a la rendija horizontal y ya no pasa la vibración
tabla(530, false);
linea(530, y, 750, y, { c: C.morado, w: 2.8 });
caja(10, y - 18, 20, 36, { fill: C.claro, c: C.tinta });
flecha(70, y - 28, 70, y + 28, { c: C.rojo, w: 2, head: 9, doble: true });
texto(290, 276, 'rendija vertical: pasa', { size: 16 });
texto(560, 276, 'rendija horizontal: no pasa', { size: 16 });

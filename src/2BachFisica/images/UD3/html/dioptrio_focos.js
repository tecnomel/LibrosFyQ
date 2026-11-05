// Focos de un dioptrio esférico convexo (n < n'): (a) los rayos paralelos convergen en F'; (b) los que salen de F salen paralelos.
lienzo(780, 260);
const R = 60, n1 = 1, n2 = 1.6, fp = R * n2 / (n2 - n1), f = -R * n1 / (n2 - n1), Y = 120;
function dioptrio(O) {
    const Cx = O + R, ax = dy => Cx - Math.sqrt(R * R - dy * dy);
    let d = '';
    for (let dy = -55; dy <= 55; dy += 1) d += (d ? ' L' : 'M') + ax(dy).toFixed(1) + ',' + (Y + dy);
    E(S, 'path', { d: d + ` L${O + 150},${Y + 55} L${O + 150},${Y - 55} Z`, fill: '#e3f2fd' });
    camino(d, { c: C.azul, w: 3 });
    return ax;
}
// (a)
const O1 = 130, ax1 = dioptrio(O1);
linea(10, Y, 380, Y, { c: C.gris, w: 1.2 });
[-40, -20, 20, 40].forEach(dy => { const x = ax1(dy); linea(15, Y + dy, x, Y + dy, { c: C.rojo, w: 1.8 }); linea(x, Y + dy, O1 + fp + (O1 + fp - x) * 0.4, Y - dy * 0.4, { c: C.rojo, w: 1.8 }); });
marcaEje(O1 + fp, Y, "F'"); marcaEje(O1, Y, 'O', { dx: -10 });
cota(O1, Y + 80, O1 + fp, Y + 80, "f'", { dy: 22 });
texto(195, 250, "(a) Foco imagen F'", { size: 16 });
// (b)
const O2 = 560, ax2 = dioptrio(O2);
linea(400, Y, 770, Y, { c: C.gris, w: 1.2 });
[-40, -20, 20, 40].forEach(dy => { const x = ax2(dy); linea(O2 + f, Y, x, Y + dy, { c: C.rojo, w: 1.8 }); linea(x, Y + dy, 770, Y + dy, { c: C.rojo, w: 1.8 }); });
marcaEje(O2 + f, Y, 'F'); marcaEje(O2, Y, 'O', { dx: -10 });
cota(O2 + f, Y + 80, O2, Y + 80, 'f', { dy: 22 });
texto(585, 250, '(b) Foco objeto F', { size: 16 });
texto(30, 30, 'n', { italic: true }); texto(330, 30, "n'", { italic: true });
texto(420, 30, 'n', { italic: true }); texto(740, 30, "n'", { italic: true });

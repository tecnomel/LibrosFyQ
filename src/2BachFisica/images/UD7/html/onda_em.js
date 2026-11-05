// Onda electromagnética: campo eléctrico (vertical) y magnético (horizontal, en perspectiva) perpendiculares entre sí y a la propagación.
lienzo(640, 300);
const x0 = 50, x1 = 590, y0 = 160, A = 90, lam = 270, kx = 0.16, ky = 0.26;   // eje z en perspectiva: (kx, ky) por unidad
flecha(x0 - 20, y0, x1 + 30, y0, { c: C.gris, w: 1.4, head: 9 }); texto(x1 + 30, y0 + 22, 'x', { italic: true, c: C.gris });
let dE = '', dB = '';
for (let x = x0; x <= x1; x += 3) {
    const s = Math.sin(2 * Math.PI * (x - x0) / lam);
    dE += (dE ? ' L' : 'M') + x.toFixed(1) + ',' + (y0 - A * s).toFixed(1);
    dB += (dB ? ' L' : 'M') + (x - A * kx * s * 1.5).toFixed(1) + ',' + (y0 + A * ky * s * 1.5).toFixed(1);
}
for (let x = x0 + 15; x <= x1; x += 22) {
    const s = Math.sin(2 * Math.PI * (x - x0) / lam);
    linea(x, y0, x, y0 - A * s, { c: C.rojo, w: 1, p: S });
    linea(x, y0, x - A * kx * s * 1.5, y0 + A * ky * s * 1.5, { c: C.azul, w: 1 });
}
camino(dE, { c: C.rojo, w: 2.6 }); camino(dB, { c: C.azul, w: 2.6 });
texto(x0 + lam / 4 + 10, y0 - A - 10, 'E', { italic: true, c: C.rojo, size: 20 });
texto(x0 + lam / 4 - 70, y0 + 52, 'B', { italic: true, c: C.azul, size: 20 });
flecha(x1 - 60, 60, x1 + 10, 60, { c: C.verde, w: 2.6 }); texto(x1 - 25, 50, 'c', { italic: true, c: C.verde, size: 19 });
cota(x0 + lam / 4, 280, x0 + 5 * lam / 4, 280, 'λ', { dy: -6 });

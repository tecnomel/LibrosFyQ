// Corte de un solenoide: dentro el campo es casi uniforme; fuera, como el de un imán de barra. Camino de Ampère ACDE.
lienzo(640, 320);
const cx = 320, cy = 160, L = 340, h = 70, marco = [10, 10, 630, 310];
const cor = corteSolenoide(cx - L / 2, cx + L / 2, cy - h / 2, cy + h / 2, 16);
const g = recorteCaja(marco);
lineasB(cor, marco, nivelesPor(cor, cx, cy - h / 2 + 6, cx, cy + h / 2 - 6, 8), { p: g });
[[cx - 230, cy], [cx + 230, cy], [cx, cy - 110], [cx, cy + 110]].forEach(([x, y]) => sentidoB(cor, x, y, { p: g, h: 11 }));
cor.forEach(([x, y, I]) => corriente(x, y, 7, I > 0, { c: C.rojo }));
// camino rectangular de Ampère (lado AC dentro, DE fuera)
const x1 = cx - 60, x2 = cx + 60;
camino(`M${x1},${cy + 10} L${x2},${cy + 10} L${x2},${cy - 130} L${x1},${cy - 130} Z`, { c: C.verde, w: 1.8, dash: '6 4' });
[['A', x1 - 10, cy + 28], ['C', x2 + 10, cy + 28], ['D', x2 + 10, cy - 136], ['E', x1 - 10, cy - 136]].forEach(([t, x, y]) => texto(x, y, t, { italic: true, c: C.verde, size: 16, halo: true }));
texto(cx, cy + 6, 'B', { italic: true, c: C.azul, size: 18, halo: true });
cota(cx - L / 2, 300, cx + L / 2, 300, 'L', { dy: -6 });

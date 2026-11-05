// Espectro electromagnético: escala logarítmica de frecuencia con las regiones y ampliación del visible.
lienzo(800, 250);
const x0 = 40, x1 = 760, f0 = 4, f1 = 22, X = lf => x0 + (x1 - x0) * (lf - f0) / (f1 - f0), y = 90, h = 40;
const zonas = [[4, 9, 'Radio', '#c5cae9'], [9, 11, 'Microondas', '#b3e5fc'], [11, 14.6, 'Infrarrojo', '#ffccbc'],
    [14.6, 14.9, '', '#fff'], [14.9, 17, 'Ultravioleta', '#e1bee7'], [17, 19, 'Rayos X', '#b2dfdb'], [19, 22, 'Rayos γ', '#c8e6c9']];
zonas.forEach(([a, b, t, c]) => {
    E(S, 'rect', { x: X(a), y, width: X(b) - X(a), height: h, fill: c, stroke: C.tinta, 'stroke-width': 1 });
    if (t) texto((X(a) + X(b)) / 2, y + h / 2 + 6, t, { size: 14 });
});
// franja visible con gradiente
const id = 'vis'; const lg = E(DEFS, 'linearGradient', { id, x1: 0, x2: 1, y1: 0, y2: 0 });
['#d32f2f', '#f57c00', '#fbc02d', '#388e3c', '#1976d2', '#7b1fa2'].forEach((c, k) => E(lg, 'stop', { offset: k / 5, 'stop-color': c }));
E(S, 'rect', { x: X(14.6), y, width: X(14.9) - X(14.6), height: h, fill: `url(#${id})`, stroke: C.tinta, 'stroke-width': 1 });
for (let lf = 4; lf <= 22; lf += 2) { linea(X(lf), y + h, X(lf), y + h + 8, { w: 1.2 }); texto(X(lf), y + h + 26, '10^{' + lf + '}', { size: 13 }); }
texto(760, y + h + 46, 'ν (Hz)', { size: 14, italic: true, anchor: 'end' });
for (let lf = 4; lf <= 22; lf += 4) { const l = Math.round(8.477 - lf); texto(X(lf), y - 14, '10^{' + l + '}', { size: 13, c: C.gris }); }
texto(760, y - 32, 'λ (m)', { size: 14, italic: true, anchor: 'end', c: C.gris });
// ampliación del visible
const ax0 = 260, ax1 = 540, ay = 205;
linea(X(14.6), y + h, ax0, ay - 12, { c: C.gris, w: 1, dash: '3 3' }); linea(X(14.9), y + h, ax1, ay - 12, { c: C.gris, w: 1, dash: '3 3' });
E(S, 'rect', { x: ax0, y: ay - 12, width: ax1 - ax0, height: 22, fill: `url(#${id})` });
texto(ax0 - 6, ay + 4, '700 nm', { size: 13, anchor: 'end' }); texto(ax1 + 6, ay + 4, '400 nm', { size: 13, anchor: 'start' });
texto((ax0 + ax1) / 2, ay + 34, 'Luz visible', { size: 14 });

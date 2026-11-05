// Campo de una espira circular, en un corte que pasa por su eje (líneas calculadas con la ley de Biot y Savart en 2D).
lienzo(420, 340);
const cx = 210, cy = 170, R = 60, marco = [10, 10, 410, 330];
const cor = [[cx, cy - R, 1], [cx, cy + R, -1]];
const g = recorteCaja(marco);
lineasB(cor, marco, nivelesPor(cor, cx, cy - R * 0.75, cx, cy + R * 0.75, 9), { p: g });
[[cx + 120, cy], [cx - 120, cy], [cx, cy - 120], [cx, cy + 120]].forEach(([x, y]) => sentidoB(cor, x, y, { p: g, h: 11 }));
E(S, 'ellipse', { cx, cy, rx: 14, ry: R, fill: 'none', stroke: C.naranja, 'stroke-width': 2, 'stroke-dasharray': '5 4' });
corriente(cx, cy - R, 10, true, { c: C.rojo }); corriente(cx, cy + R, 10, false, { c: C.rojo });
flecha(cx, cy, cx + 50, cy, { c: C.azul, w: 2.6 }); texto(cx + 54, cy - 8, 'B', { italic: true, c: C.azul, anchor: 'start', size: 18, halo: true });

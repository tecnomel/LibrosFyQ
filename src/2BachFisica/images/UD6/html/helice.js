// Si la velocidad no es perpendicular a B, la componente paralela se mantiene y la trayectoria es una hélice.
lienzo(620, 250);
for (let y = 50; y <= 200; y += 50) flecha(20, y, 600, y, { c: C.claro, w: 1.4, head: 9 });
texto(596, 36, 'B', { italic: true, c: C.azul, size: 19 });
let delante = '', detras = '';
for (let t = 0; t < 5 * 2 * Math.PI; t += 0.05) {
    const x1 = 60 + t * 16, y1 = 125 - 55 * Math.cos(t), x2 = 60 + (t + 0.05) * 16, y2 = 125 - 55 * Math.cos(t + 0.05);
    const seg = `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} `;
    if (Math.sin(t) >= 0) delante += seg; else detras += seg;
}
E(S, 'path', { d: detras, stroke: C.morado, 'stroke-width': 1.4, 'stroke-dasharray': '3 3', fill: 'none' });
E(S, 'path', { d: delante, stroke: C.morado, 'stroke-width': 2.6, fill: 'none' });
bola(60, 70, 8, { fill: '#ef5350' });
flecha(60, 70, 140, 70, { c: C.verde, w: 2.2, head: 9 }); texto(112, 60, 'v_x', { italic: true, c: C.verde, size: 16 });
flecha(60, 70, 60, 22, { c: C.verde, w: 2.2, head: 9 }); texto(50, 32, 'v_y', { italic: true, c: C.verde, size: 16, anchor: 'end' });
cota(60, 230, 60 + 2 * Math.PI * 16, 230, 'paso', { dy: -6, size: 14 });

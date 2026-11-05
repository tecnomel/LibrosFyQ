// Líneas del campo de un imán de barra (calculado como el de un solenoide equivalente) y brújulas que se orientan según ellas.
lienzo(640, 380);
const cx = 320, cy = 190, w = 200, h = 50, marco = [10, 10, 630, 370];
const cor = corteSolenoide(cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2, 30);
const g = recorteCaja(marco);
lineasB(cor, marco, nivelesPor(cor, cx, cy - h / 2 + 2, cx, cy + h / 2 - 2, 10), { p: g });
imanBarra(cx - w / 2, cy - h / 2, w, h, true);
[[cx - 160, cy - 110], [cx + 160, cy - 110], [cx, cy - 120], [cx, cy + 120], [cx - 230, cy + 20], [cx + 230, cy + 20]].forEach(([x, y]) => sentidoB(cor, x, y, { p: g, h: 11 }));
// brújulas
function brujula(x, y) {
    const [bx, by] = campoB(cor, x, y), l = Math.hypot(bx, by), u = [bx / l, by / l];
    E(S, 'circle', { cx: x, cy: y, r: 17, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.3 });
    E(S, 'polygon', { points: `${x + u[0] * 14},${y + u[1] * 14} ${x - u[1] * 4},${y + u[0] * 4} ${x + u[1] * 4},${y - u[0] * 4}`, fill: '#e53935' });
    E(S, 'polygon', { points: `${x - u[0] * 14},${y - u[1] * 14} ${x - u[1] * 4},${y + u[0] * 4} ${x + u[1] * 4},${y - u[0] * 4}`, fill: '#90a4ae' });
}
[[cx - 90, cy - 80], [cx + 90, cy - 80], [cx + 170, cy + 70], [cx - 170, cy + 70]].forEach(([x, y]) => brujula(x, y));

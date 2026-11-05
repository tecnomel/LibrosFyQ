// La energía del foco se reparte en superficies esféricas cada vez mayores (I ∝ 1/r²).
lienzo(400, 330);
const cx = 200, cy = 160;
[[140, .10], [72, .22]].forEach(([r, op]) => {
    E(S, 'circle', { cx, cy, r, fill: C.morado, 'fill-opacity': op, stroke: C.morado, 'stroke-width': 2 });
    E(S, 'ellipse', { cx, cy, rx: r, ry: r * .28, fill: 'none', stroke: C.morado, 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
});
bola(cx, cy, 6, { fill: C.tinta });
texto(cx - 14, cy + 22, 'F', { italic: true, size: 18, halo: true });
const a1 = 50 * Math.PI / 180, a2 = -28 * Math.PI / 180;
flecha(cx, cy, cx + 72 * Math.cos(a1), cy - 72 * Math.sin(a1), { c: C.rojo, w: 2, head: 10 });
flecha(cx, cy, cx + 140 * Math.cos(a2), cy - 140 * Math.sin(a2), { c: C.azul, w: 2, head: 10 });
texto(cx + 8, cy - 44, 'r_1', { italic: true, c: C.rojo, halo: true, anchor: 'end' });
texto(cx + 92, cy + 20, 'r_2', { italic: true, c: C.azul, halo: true });
texto(cx, 322, 'S = 4πr²', { italic: true, size: 18 });

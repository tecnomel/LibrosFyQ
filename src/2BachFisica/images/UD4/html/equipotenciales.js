// Superficies equipotenciales (circunferencias) y líneas de campo (radiales) de una masa puntual.
lienzo(360, 340);
const cx = 180, cy = 170;
[[40, '−4'], [62, '−3'], [90, '−2'], [140, '−1']].forEach(([r, v], k) => {
    E(S, 'circle', { cx, cy, r, fill: 'none', stroke: C.azul, 'stroke-width': 1.6, 'stroke-dasharray': '6 4' });
    texto(cx + r - 3, cy + 5, v, { size: 13, c: C.azul, anchor: 'end', halo: true });
});
for (let k = 0; k < 12; k++) {
    const a = k * Math.PI / 6 + 0.26;
    flecha(cx + 158 * Math.cos(a), cy + 158 * Math.sin(a), cx + 26 * Math.cos(a), cy + 26 * Math.sin(a), { c: C.morado, w: 1.4, head: 9 });
}
bola(cx, cy, 18, { fill: '#90a4ae' }); texto(cx, cy + 6, 'M', { italic: true, size: 17 });
texto(cx, 334, 'Valores de V en unidades de GM/r_0', { size: 13, c: C.gris });

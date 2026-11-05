// Difracción en una abertura de anchura d: cuanto más se parece d a λ, más se abre la onda tras la rendija.
lienzo(790, 320);
const lam = 26, yw = 128;
function panel(x0, d, titulo) {
    const cx = x0 + 120, xl = cx - d / 2, xr = cx + d / 2;
    for (let y = yw - 12; y > 20; y -= lam) linea(x0 + 10, y, x0 + 230, y, { c: C.morado, w: 2 });
    E(S, 'rect', { x: x0 + 4, y: yw - 6, width: xl - x0 - 4, height: 12, fill: C.gris });
    E(S, 'rect', { x: xr, y: yw - 6, width: x0 + 236 - xr, height: 12, fill: C.gris });
    for (let s = lam - 8; s < 140; s += lam) {
        if (d > lam * 1.5) {
            linea(xl, yw + 6 + s, xr, yw + 6 + s, { c: C.morado, w: 2 });
            const ab = Math.min(70, 2200 / d);
            arco(xl, yw + 6, s, -90, -90 - ab, { c: C.morado, w: 2 });
            arco(xr, yw + 6, s, -90, -90 + ab, { c: C.morado, w: 2 });
        } else if (s < 112) arco(cx, yw + 6, s, -178, -2, { c: C.morado, w: 2 });
    }
    cota(xl, yw - 22, xr, yw - 22, 'd', { size: 16 });
    texto(cx, 312, titulo, { size: 16 });
}
panel(10, 150, 'd ≫ λ: casi no se difracta');
panel(275, 66, 'd algo mayor que λ');
panel(540, 22, 'd ≈ λ: difracción intensa');

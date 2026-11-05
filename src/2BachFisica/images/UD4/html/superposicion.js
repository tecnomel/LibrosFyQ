// Principio de superposición: el campo en P es la suma vectorial de los campos que crea cada masa.
lienzo(500, 320);
const P = [250, 170], M = [[60, 170, 'M_1', 24], [400, 40, 'M_2', 40], [390, 290, 'M_3', 18]];
const gs = M.map(([x, y, n, k]) => { const u = [x - P[0], y - P[1]], l = Math.hypot(...u); return [u[0] / l * k * 3, u[1] / l * k * 3]; });
M.forEach(([x, y, n, k], i) => {
    linea(P[0], P[1], x, y, { c: C.claro, w: 1.2, dash: '4 4' });
    bola(x, y, 10 + k / 4, { fill: '#90a4ae' });
    texto(x + (i ? 0 : 0), y - 20, n, { italic: true, size: 18 });
    flecha(P[0], P[1], P[0] + gs[i][0], P[1] + gs[i][1], { c: C.azul, w: 2.2, head: 10 });
    texto(P[0] + gs[i][0] * 1.12 + 6, P[1] + gs[i][1] * 1.12 + 6, `g_${i + 1}`, { italic: true, c: C.azul, size: 17, halo: true, anchor: 'start' });
});
const g = gs.reduce((s, v) => [s[0] + v[0], s[1] + v[1]], [0, 0]);
flecha(P[0], P[1], P[0] + g[0], P[1] + g[1], { c: C.rojo, w: 3 });
texto(P[0] + g[0] + 10, P[1] + g[1] - 4, 'g', { italic: true, c: C.rojo, size: 20, anchor: 'start', halo: true });
punto(P[0], P[1], 5); texto(P[0] + 4, P[1] + 24, 'P', { italic: true });

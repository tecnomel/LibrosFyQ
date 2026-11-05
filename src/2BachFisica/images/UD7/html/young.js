// Experimento de la doble rendija de Young: dos rendijas coherentes producen franjas de interferencia en la pantalla.
lienzo(680, 320);
const S0 = [130, 160], S1 = [290, 120], S2 = [290, 200], Xp = 600, lam = 26;
// barreras
[[110, [S0[1]]], [290, [S1[1], S2[1]]]].forEach(([x, ys]) => {
    let y = 30; ys.forEach(r => { E(S, 'rect', { x: x - 5, y, width: 10, height: r - 6 - y, fill: C.tinta }); y = r + 6; });
    E(S, 'rect', { x: x - 5, y, width: 10, height: 290 - y, fill: C.tinta });
});
// frentes desde la fuente hasta las rendijas
for (let r = lam; r < 160; r += lam) arco(110, S0[1], r, -60, 60, { c: '#7b1fa2', w: 1.2 });
const clip = recorteCaja([296, 20, Xp, 300]);
[S1, S2].forEach(Sx => { for (let r = lam; r < 360; r += lam) E(clip, 'circle', { cx: Sx[0], cy: Sx[1], r, fill: 'none', stroke: '#7b1fa2', 'stroke-width': 1, 'stroke-opacity': .55 }); });
// pantalla con intensidad calculada (cos² de la diferencia de caminos)
E(S, 'rect', { x: Xp, y: 30, width: 14, height: 260, fill: '#000' });
for (let y = 30; y < 290; y += 2) {
    const d = Math.hypot(Xp - S1[0], y - S1[1]) - Math.hypot(Xp - S2[0], y - S2[1]), I = Math.cos(Math.PI * d / lam) ** 2;
    E(S, 'rect', { x: Xp, y, width: 14, height: 2, fill: `rgba(255,213,79,${I.toFixed(2)})` });
}
// curva de intensidad junto a la pantalla
let d = ''; for (let y = 30; y <= 290; y += 2) { const dd = Math.hypot(Xp - S1[0], y - S1[1]) - Math.hypot(Xp - S2[0], y - S2[1]); d += (d ? ' L' : 'M') + (Xp + 22 + 40 * Math.cos(Math.PI * dd / lam) ** 2).toFixed(1) + ',' + y; }
camino(d, { c: C.naranja, w: 1.8 });
texto(S0[0] - 34, S0[1] - 30, 'S_0', { italic: true, anchor: 'end' }); texto(S1[0] - 14, S1[1] - 8, 'S_1', { italic: true, anchor: 'end' }); texto(S2[0] - 14, S2[1] + 20, 'S_2', { italic: true, anchor: 'end' });
texto(Xp + 7, 312, 'pantalla', { size: 14 });
camino(seno(10, 100, 160, 6, 20), { c: '#7b1fa2', w: 1.8 });

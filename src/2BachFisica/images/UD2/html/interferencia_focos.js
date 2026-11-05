// Dos focos coherentes F1 y F2: crestas (línea continua) y valles (discontinua). En P llegan recorridos x1 y x2.
lienzo(580, 340);
const clip = E(DEFS, 'clipPath', { id: 'marco' });
E(clip, 'rect', { x: 0, y: 0, width: 580, height: 300 });
const g = G(S, { 'clip-path': 'url(#marco)' });
const F1 = [70, 105], F2 = [70, 195], lam = 44;
[[F1, C.azul], [F2, C.rojo]].forEach(([F, c]) => {
    for (let r = lam; r < 620; r += lam) {
        E(g, 'circle', { cx: F[0], cy: F[1], r, fill: 'none', stroke: c, 'stroke-width': 1.6, 'stroke-opacity': .55 });
        E(g, 'circle', { cx: F[0], cy: F[1], r: r - lam / 2, fill: 'none', stroke: c, 'stroke-width': 1.1, 'stroke-opacity': .4, 'stroke-dasharray': '4 4' });
    }
});
const P = [470, 70];
linea(F1[0], F1[1], P[0], P[1], { c: C.azul, w: 2.4 });
linea(F2[0], F2[1], P[0], P[1], { c: C.rojo, w: 2.4 });
bola(F1[0], F1[1], 8, { fill: C.azul }); bola(F2[0], F2[1], 8, { fill: C.rojo });
bola(P[0], P[1], 7, { fill: C.tinta });
texto(F1[0] - 16, F1[1] + 6, 'F_1', { italic: true, anchor: 'end', halo: true });
texto(F2[0] - 16, F2[1] + 6, 'F_2', { italic: true, anchor: 'end', halo: true });
texto(P[0] + 12, P[1] - 6, 'P', { italic: true, anchor: 'start', halo: true });
E(S, 'rect', { x: 0, y: 300, width: 580, height: 40, fill: '#fff' });
texto(290, 326, 'Δx = x_2 − x_1 :  máximo si Δx = nλ,  mínimo si Δx = (2n − 1)λ/2', { size: 16 });
texto(270, 80, 'x_1', { italic: true, c: C.azul, size: 20, halo: true });
texto(300, 150, 'x_2', { italic: true, c: C.rojo, size: 20, halo: true });

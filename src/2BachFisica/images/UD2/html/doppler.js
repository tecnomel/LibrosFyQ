// Efecto Doppler: frentes emitidos por un foco que se mueve hacia la derecha. Delante se juntan (λ' menor), detrás se separan.
lienzo(700, 330);
const clip = E(DEFS, 'clipPath', { id: 'm' }); E(clip, 'rect', { x: 0, y: 0, width: 700, height: 290 });
const g = G(S, { 'clip-path': 'url(#m)' });
const xs = 380, ys = 145, vT = 34, vfT = 14;
for (let n = 1; n <= 5; n++) {
    E(g, 'circle', { cx: xs - vfT * n, cy: ys, r: vT * n, fill: 'none', stroke: C.morado, 'stroke-width': 2 });
    punto(xs - vfT * n, ys, 2.5, C.gris);
}
bola(xs, ys, 9, { fill: C.naranja });
flecha(xs + 2, ys - 22, xs + 52, ys - 22, { c: C.naranja, w: 2.2, head: 10 });
texto(xs + 28, ys - 30, 'v_F', { halo: true, italic: true, c: C.naranja, size: 18 });
// separación de los frentes delante y detrás del foco
const der = n => xs - vfT * n + vT * n, izq = n => xs - vfT * n - vT * n;
cota(der(3), ys + 40, der(4), ys + 40, "λ'", { size: 16, dy: 26 });
cota(izq(3), ys + 40, izq(2), ys + 40, "λ'", { size: 16, dy: 26 });
// observadores
[[640, 'A'], [50, 'B']].forEach(([x, s]) => {
    bola(x, ys - 18, 9, { fill: C.verde });
    linea(x, ys - 9, x, ys + 22, { c: C.verde, w: 3 });
    texto(x, ys + 46, s, { italic: true, size: 18 });
});
texto(640, 312, 'A: frecuencia mayor (más agudo)', { size: 15, anchor: 'end' });
texto(60, 312, 'B: frecuencia menor (más grave)', { size: 15, anchor: 'start' });

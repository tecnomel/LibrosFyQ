// Tres ejemplos de oscilador: masa colgada de un muelle, lámina vibrante y péndulo.
// En los tres el cuerpo va de A a B pasando por la posición de equilibrio O.
lienzo(780, 330);

// (a) muelle vertical: el mismo muelle en tres instantes (B arriba, O, A abajo)
rayado(40, 20, 210, 16);
linea(40, 36, 250, 36, { w: 2.5 });
const niveles = { B: 140, O: 190, A: 240 };
[['B', 80], ['O', 145], ['A', 210]].forEach(([k, x]) => {
    muelle(x, 36, niveles[k], { ancho: 11, n: 12 });
    caja(x - 22, niveles[k], 44, 34);
});
Object.entries(niveles).forEach(([k, y]) => {
    linea(50, y + 17, 262, y + 17, { c: C.gris, w: 1.2, dash: '5 5' });
    texto(272, y + 23, k, { italic: true });
});
texto(150, 312, '(a) Muelle', { size: 18, italic: false });

// (b) lámina sujeta por un extremo
rayado(300, 115, 34, 70);
linea(334, 112, 334, 188, { w: 2.5 });
camino('M334,150 L500,150', { w: 3.5, c: C.morado });
camino('M334,150 Q420,148 492,98', { w: 2, c: C.gris, dash: '6 5' });
camino('M334,150 Q420,152 492,202', { w: 2, c: C.gris, dash: '6 5' });
punto(500, 150, 4); punto(492, 98, 4); punto(492, 202, 4);
texto(516, 156, 'O', { italic: true }); texto(506, 94, 'B', { italic: true }); texto(506, 214, 'A', { italic: true });
camino('M520,108 Q536,150 520,192', { c: C.rojo, w: 1.8 });
texto(420, 312, '(b) Lámina vibrante', { size: 18 });

// (c) péndulo
const px = 670, py = 36, L = 210;
rayado(590, 20, 160, 16);
linea(590, 36, 750, 36, { w: 2.5 });
linea(px, py, px, py + L + 30, { c: C.gris, w: 1.2, dash: '5 5' });
const pos = a => [px + L * Math.sin(a * Math.PI / 180), py + L * Math.cos(a * Math.PI / 180)];
arco(px, py, L, -90 - 24, -90 + 24, { c: C.gris, w: 1.2, dash: '4 5' });
[[-24, 'B', .45], [24, 'A', .45], [0, 'O', 1]].forEach(([a, k, op]) => {
    const [x, y] = pos(a);
    linea(px, py, x, y, { c: op < 1 ? C.gris : C.tinta, w: 1.6, dash: op < 1 ? '5 4' : undefined });
    bola(x, y, 12, { op });
    texto(x + (a < 0 ? -22 : a > 0 ? 22 : 0), y + (a === 0 ? 36 : 6), k, { italic: true });
});
texto(670, 312, '(c) Péndulo', { size: 18 });

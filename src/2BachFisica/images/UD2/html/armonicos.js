// Modos de vibración de una cuerda: con los dos extremos fijos (n = 1…4) y con un extremo fijo y otro libre (n = 1, 3, 5).
lienzo(800, 380);
const h = 26;
function modo(x0, L, y, f, libre) {
    linea(x0 - 10, y, x0 + L + 10, y, { c: C.claro, w: 1 });
    camino(curva(x => y - h * f((x - x0) / L), x0, x0 + L, 1.5), { c: C.morado, w: 2.6 });
    camino(curva(x => y + h * f((x - x0) / L), x0, x0 + L, 1.5), { c: C.morado, w: 1.6, dash: '5 4' });
    rayado(x0 - 14, y - 22, 10, 44); linea(x0 - 4, y - 22, x0 - 4, y + 22, { w: 2 });
    if (libre) {
        linea(x0 + L + 2, y - 34, x0 + L + 2, y + 34, { c: C.gris, w: 3 });
        E(S, 'ellipse', { cx: x0 + L + 2, cy: y - h * f(1), rx: 6, ry: 4, fill: 'none', stroke: C.tinta, 'stroke-width': 2 });
    } else { rayado(x0 + L + 4, y - 22, 10, 44); linea(x0 + L + 4, y - 22, x0 + L + 4, y + 22, { w: 2 }); }
}
texto(200, 26, 'Dos extremos fijos', { size: 17, bold: true });
['L = λ_1/2  (fundamental)', 'L = 2 λ_2/2', 'L = 3 λ_3/2', 'L = 4 λ_4/2'].forEach((s, i) => {
    const n = i + 1, y = 75 + i * 85;
    modo(40, 240, y, u => Math.sin(n * Math.PI * u), false);
    texto(160, y + 44, s, { italic: true, size: 15 });
});
texto(610, 26, 'Un extremo fijo y otro libre', { size: 17, bold: true });
['L = λ_1/4  (fundamental)', 'L = 3 λ_3/4', 'L = 5 λ_5/4'].forEach((s, i) => {
    const n = 2 * i + 1, y = 75 + i * 85;
    modo(490, 240, y, u => Math.sin(n * Math.PI * u / 2), true);
    texto(610, y + 44, s, { italic: true, size: 15 });
});

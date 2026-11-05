// Tipos de lentes: convergentes (más gruesas en el centro) y divergentes (más gruesas en los bordes), y sus símbolos.
lienzo(800, 250);
const Y = 105, H = 62;
// cada lente: [borde izquierdo arriba, control izquierdo, borde derecho arriba, control derecho] (desplazamientos desde cx)
const tipos = [
    ['Biconvexa', [-4, -42, 4, 42]], ['Planoconvexa', [-14, -14, 4, 44]], ['Menisco\nconvergente', [-10, 8, 6, 46]],
    ['Bicóncava', [-30, 14, 30, -14]], ['Planocóncava', [-22, -22, 26, -10]], ['Menisco\ndivergente', [-24, -4, 24, -30]],
];
tipos.forEach(([nom, [lt, lc, rt, rc]], k) => {
    const cx = 70 + k * 112 + (k > 2 ? 40 : 0);
    const d = `M${cx + lt},${Y - H} Q${cx + lc},${Y} ${cx + lt},${Y + H} L${cx + rt},${Y + H} Q${cx + rc},${Y} ${cx + rt},${Y - H} Z`;
    E(S, 'path', { d, fill: '#bbdefb', stroke: C.azul, 'stroke-width': 2 });
    nom.split('\n').forEach((t, j) => texto(cx, Y + H + 26 + j * 18, t, { size: 15 }));
});
texto(182, 22, 'Convergentes', { size: 17, bold: true }); texto(558, 22, 'Divergentes', { size: 17, bold: true });
linea(400, 30, 400, 220, { c: C.claro, w: 1.2 });

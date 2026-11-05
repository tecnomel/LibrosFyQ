// Superposición de dos pulsos: interferencia constructiva (arriba) y destructiva (abajo).
lienzo(780, 330);
const w = 20, h = 42;
const pulso = (c, s) => x => s * h * Math.exp(-(((x - c) / w) ** 2));
function fila(y0, s2, titulo) {
    texto(10, y0 - 70, titulo, { size: 16, anchor: 'start', bold: true });
    // antes
    linea(20, y0, 250, y0, { c: C.gris, w: 1, dash: '4 4' });
    camino(curva(x => y0 - pulso(80, 1)(x) - pulso(190, s2)(x), 20, 250), { c: C.morado, w: 2.6 });
    flecha(60, y0 - (s2 > 0 ? 62 : 62), 100, y0 - 62, { c: C.verde, w: 1.8, head: 9 });
    flecha(210, y0 + (s2 > 0 ? -62 : 62), 170, y0 + (s2 > 0 ? -62 : 62), { c: C.verde, w: 1.8, head: 9 });
    // superposición
    linea(280, y0, 500, y0, { c: C.gris, w: 1, dash: '4 4' });
    camino(curva(x => y0 - pulso(390, 1)(x), 280, 500), { c: C.azul, w: 1.4, dash: '5 4' });
    camino(curva(x => y0 - pulso(390, s2)(x), 280, 500), { c: C.rojo, w: 1.4, dash: '5 4' });
    camino(curva(x => y0 - pulso(390, 1)(x) - pulso(390, s2)(x), 280, 500), { c: C.morado, w: 2.6 });
    // después
    linea(530, y0, 760, y0, { c: C.gris, w: 1, dash: '4 4' });
    camino(curva(x => y0 - pulso(700, 1)(x) - pulso(590, s2)(x), 530, 760), { c: C.morado, w: 2.6 });
    flecha(680, y0 - 62, 720, y0 - 62, { c: C.verde, w: 1.8, head: 9 });
    flecha(610, y0 + (s2 > 0 ? -62 : 62), 570, y0 + (s2 > 0 ? -62 : 62), { c: C.verde, w: 1.8, head: 9 });
}
texto(135, 20, 'antes', { size: 16 }); texto(390, 20, 'superposición', { size: 16 }); texto(645, 20, 'después', { size: 16 });
fila(120, 1, '');
texto(390, 136, 'amplitud mayor: interferencia constructiva', { size: 15, c: C.morado });
fila(250, -1, '');
texto(390, 318, 'se anulan: interferencia destructiva', { size: 15, c: C.morado });

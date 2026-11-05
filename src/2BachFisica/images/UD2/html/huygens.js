// Principio de Huygens: cada punto de un frente es foco de ondas secundarias; su envolvente es el nuevo frente.
lienzo(740, 320);
// (a) frente plano
const xa = 90, r = 56;
linea(xa, 30, xa, 270, { c: C.morado, w: 3 });
for (let y = 42; y <= 258; y += 27) {
    arco(xa, y, r, -90, 90, { c: C.azul, w: 1.3 });
    punto(xa, y, 3.8, C.azul);
}
linea(xa + r, 30, xa + r, 270, { c: C.rojo, w: 3 });
[60, 150, 240].forEach(y => flecha(xa + r + 8, y, xa + r + 80, y, { c: C.gris, w: 1.6, head: 9 }));
texto(xa, 22, 'F_1', { italic: true, c: C.morado }); texto(xa + r, 22, 'F_2', { italic: true, c: C.rojo });
texto(200, 306, '(a) Onda plana', { size: 17 });
// (b) frente esférico
const ox = 400, oy = 150, R1 = 110, r2 = 50;
bola(ox, oy, 5, { fill: C.tinta }); texto(ox - 6, oy + 24, 'O', { italic: true, size: 17 });
arco(ox, oy, R1, -62, 62, { c: C.morado, w: 3 });
arco(ox, oy, R1 + r2, -62, 62, { c: C.rojo, w: 3 });
for (let a = -54; a <= 54; a += 18) {
    const t = a * Math.PI / 180, px = ox + R1 * Math.cos(t), py = oy - R1 * Math.sin(t);
    arco(px, py, r2, a - 90, a + 90, { c: C.azul, w: 1.3 });
    punto(px, py, 3.8, C.azul);
}
[-40, 0, 40].forEach(a => {
    const t = a * Math.PI / 180;
    flecha(ox + (R1 + r2 + 8) * Math.cos(t), oy - (R1 + r2 + 8) * Math.sin(t), ox + (R1 + r2 + 70) * Math.cos(t), oy - (R1 + r2 + 70) * Math.sin(t), { c: C.gris, w: 1.6, head: 9 });
});
texto(ox + R1 * Math.cos(1.08) - 6, oy - R1 * Math.sin(1.08) - 10, 'F_1', { italic: true, c: C.morado });
texto(ox + (R1 + r2) * Math.cos(0.25) + 14, oy - (R1 + r2) * Math.sin(0.25) - 8, 'F_2', { italic: true, c: C.rojo });
texto(500, 306, '(b) Onda esférica', { size: 17 });
texto(600, 30, 'ondas secundarias', { size: 15, c: C.azul, anchor: 'start' });

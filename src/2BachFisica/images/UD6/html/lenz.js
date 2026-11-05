// Ley de Lenz: la corriente inducida crea un campo que se opone a la variación del flujo (espira vista desde el imán).
lienzo(760, 270);
function panel(ox, acerca, titulo) {
    const ex = ox + 90, ey = 120, R = 50;
    E(S, 'ellipse', { cx: ex, cy: ey, rx: 22, ry: R, fill: 'none', stroke: C.naranja, 'stroke-width': 3 });
    // imán a la derecha con el N mirando a la espira
    imanBarra(ox + 170, ey - 18, 150, 36, false, { size: 17 });
    flecha(ox + 245, ey - 34, ox + 245 + (acerca ? -60 : 60), ey - 34, { c: C.verde, w: 2.4 });
    texto(ox + 245 + (acerca ? -30 : 30), ey - 44, 'v', { italic: true, c: C.verde });
    // campo del imán (hacia la izquierda en la espira) y campo inducido
    flecha(ox + 160, ey + 10, ox + 120, ey + 10, { c: C.morado, w: 2 }); texto(ox + 140, ey + 30, 'B', { italic: true, c: C.morado, size: 16 });
    flecha(ex, ey, ex + (acerca ? 40 : -40), ey, { c: C.azul, w: 2.4 }); texto(ex + (acerca ? 30 : -50), ey - 8, "B_{ind}", { italic: true, c: C.azul, size: 14 });
    // sentido de la corriente (visto desde el imán): antihorario si acerca, horario si aleja
    corriente(ex, ey - R, 9, acerca, { c: C.rojo }); corriente(ex, ey + R, 9, !acerca, { c: C.rojo });
    texto(ex, ey + R + 26, 'I_{ind}', { italic: true, c: C.rojo, size: 15 });
    texto(ox + 190, 250, titulo, { size: 14 });
}
panel(0, true, '(a) Se acerca el polo N: la cara de la espira es un N');
panel(390, false, '(b) Se aleja el polo N: la cara es un S');

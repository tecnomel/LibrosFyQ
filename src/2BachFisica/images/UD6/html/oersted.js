// Experiencia de Oersted: sin corriente la brújula señala al norte; con corriente se orienta perpendicular al hilo.
lienzo(700, 250);
function montaje(ox, I, titulo) {
    camino(`M${ox + 30},60 L${ox + 300},60 L${ox + 300},170 L${ox + 30},170 Z`, { w: 2.2 });
    E(S, 'rect', { x: ox + 140, y: 52, width: 4, height: 16, fill: C.tinta }); E(S, 'rect', { x: ox + 150, y: 46, width: 4, height: 28, fill: C.tinta });
    texto(ox + 147, 36, 'pila', { size: 13 });
    texto(ox + 170, 194, I ? 'I' : '', { italic: true, c: C.rojo });
    // brújula bajo el hilo inferior (vista desde arriba): el hilo va hacia la izquierda
    const x = ox + 165, y = 170, a = I ? Math.PI : Math.PI / 2;
    E(S, 'circle', { cx: x, cy: y, r: 26, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.4 });
    const u = [Math.sin(a), -Math.cos(a)];
    E(S, 'polygon', { points: `${x + u[0] * 22},${y + u[1] * 22} ${x - u[1] * 6},${y + u[0] * 6} ${x + u[1] * 6},${y - u[0] * 6}`, fill: '#e53935' });
    E(S, 'polygon', { points: `${x - u[0] * 22},${y - u[1] * 22} ${x - u[1] * 6},${y + u[0] * 6} ${x + u[1] * 6},${y - u[0] * 6}`, fill: '#90a4ae' });
    linea(ox + 30, 170, ox + 300, 170, { w: 2.2 });
    if (I) flecha(ox + 260, 170, ox + 220, 170, { c: C.rojo, w: 2.4, head: 10 });
    texto(ox + 165, 236, titulo, { size: 15 });
}
montaje(0, false, '(a) Sin corriente: la aguja es paralela al hilo');
montaje(360, true, '(b) Con corriente: gira hasta ser perpendicular al hilo');
texto(40, 120, 'norte →', { size: 14, c: C.gris, anchor: 'start' }); texto(400, 120, 'norte →', { size: 14, c: C.gris, anchor: 'start' });

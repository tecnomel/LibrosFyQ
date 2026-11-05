// Reflexión de una onda plana: rayo incidente, normal y rayo reflejado; los ángulos de incidencia y de reflexión son iguales.
lienzo(560, 320);
const ox = 280, oy = 250, L = 210, i = 40 * Math.PI / 180;
rayado(40, oy, 480, 22); linea(40, oy, 520, oy, { w: 2.5 });
linea(ox, 50, ox, oy, { c: C.gris, w: 1.5, dash: '6 5' });
texto(ox, 40, 'normal', { size: 15, c: C.gris });
const I = [ox - L * Math.sin(i), oy - L * Math.cos(i)], R = [ox + L * Math.sin(i), oy - L * Math.cos(i)];
linea(I[0], I[1], ox, oy, { c: C.rojo, w: 2.4 });
flecha(I[0], I[1], (I[0] + ox) / 2, (I[1] + oy) / 2, { c: C.rojo, w: 2.4 });
linea(ox, oy, R[0], R[1], { c: C.azul, w: 2.4 });
flecha(ox, oy, (R[0] + ox) / 2, (R[1] + oy) / 2, { c: C.azul, w: 2.4 });
// frentes de onda (perpendiculares a los rayos)
[.2, .62, .8].forEach(t => {
    const ux = Math.cos(i), uy = Math.sin(i);
    const px = I[0] + (ox - I[0]) * t, py = I[1] + (oy - I[1]) * t;
    linea(px - 26 * ux, py + 26 * uy, px + 26 * ux, py - 26 * uy, { c: C.rojo, w: 1.4 });
    const qx = R[0] + (ox - R[0]) * t, qy = R[1] + (oy - R[1]) * t;
    linea(qx - 26 * ux, qy - 26 * uy, qx + 26 * ux, qy + 26 * uy, { c: C.azul, w: 1.4 });
});
arco(ox, oy, 62, 90, 130, { c: C.rojo, w: 1.8 });
arco(ox, oy, 74, 50, 90, { c: C.azul, w: 1.8 });
texto(ox - 24, oy - 72, 'î', { italic: true, c: C.rojo });
texto(ox + 26, oy - 84, 'r̂', { italic: true, c: C.azul });
texto(I[0] - 8, I[1] - 12, 'rayo incidente', { size: 15, c: C.rojo });
texto(R[0] + 8, R[1] - 12, 'rayo reflejado', { size: 15, c: C.azul });

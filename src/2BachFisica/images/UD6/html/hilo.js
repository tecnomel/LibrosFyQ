// Campo de una corriente rectilínea: (a) en perspectiva, circunferencias concéntricas; (b) visto desde arriba (corriente saliente).
lienzo(720, 300);
// (a) perspectiva
const cx = 180, cy = 160;
E(S, 'polygon', { points: '40,200 260,200 330,120 110,120', fill: C.moradoClaro, stroke: C.claro });
[30, 55, 80].forEach(r => E(S, 'ellipse', { cx, cy, rx: r * 1.3, ry: r * 0.42, fill: 'none', stroke: C.morado, 'stroke-width': 1.6 }));
[30, 55, 80].forEach(r => flecha(cx - 6, cy + r * 0.42, cx + 4, cy + r * 0.42, { c: C.morado, w: 1.6, head: 9 }));
linea(cx, 290, cx, cy + 4, { c: C.naranja, w: 4 }); linea(cx, cy - 4, cx, 30, { c: C.naranja, w: 4 });
flecha(cx, 90, cx, 40, { c: C.rojo, w: 2.4 }); texto(cx + 10, 56, 'I', { italic: true, c: C.rojo, anchor: 'start' });
texto(cx + 120, cy + 50, 'B', { italic: true, c: C.morado, size: 18 });
// (b) vista superior
const ox = 520, oy = 150, cor = [[ox, oy, 1]];
[40, 75, 110].forEach(r => { E(S, 'circle', { cx: ox, cy: oy, r, fill: 'none', stroke: C.morado, 'stroke-width': 1.6 }); sentidoB(cor, ox, oy - r, { h: 10 }); sentidoB(cor, ox, oy + r, { h: 10 }); });
corriente(ox, oy, 11, true, { c: C.rojo });
const a = -0.6, Q = [ox + 75 * Math.cos(a), oy + 75 * Math.sin(a)];
punto(Q[0], Q[1], 4);
flecha(Q[0], Q[1], Q[0] + 50 * Math.sin(a), Q[1] - 50 * Math.cos(a), { c: C.azul, w: 2.4 });
texto(Q[0] + 50 * Math.sin(a) - 4, Q[1] - 50 * Math.cos(a) - 10, 'B', { italic: true, c: C.azul, size: 18 });
linea(ox, oy, Q[0], Q[1], { w: 1.2 }); texto(ox + 30, oy - 8, 'r', { italic: true, size: 17 });
texto(520, 292, '(b) Vista desde arriba (I saliente)', { size: 15 });
texto(180, 292, '(a) Las líneas rodean al hilo', { size: 15 });

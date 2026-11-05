// Campo en el interior de la Tierra: a una profundidad h solo atrae la esfera de radio r = R_T − h.
lienzo(360, 330);
const cx = 170, cy = 170, R = 140, r = 90;
E(S, 'circle', { cx, cy, r: R, fill: '#c5e1a5', stroke: C.verde, 'stroke-width': 2 });
E(S, 'circle', { cx, cy, r, fill: '#ffcc80', stroke: C.naranja, 'stroke-width': 2, 'stroke-dasharray': '6 4' });
punto(cx, cy, 4);
const a = -0.85, P = [cx + r * Math.cos(a), cy + r * Math.sin(a)], Q = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
flecha(cx, cy, P[0], P[1], { c: C.naranja, w: 2.2, head: 10 }); texto((cx + P[0]) / 2 - 12, (cy + P[1]) / 2 - 2, 'r', { italic: true, c: C.naranja, anchor: 'end', size: 20 });
cota(P[0], P[1], Q[0], Q[1], '', { c: C.azul }); texto((P[0] + Q[0]) / 2 + 12, (P[1] + Q[1]) / 2 + 6, 'h', { italic: true, c: C.azul, anchor: 'start', size: 20 });
const b = 2.6; flecha(cx, cy, cx + R * Math.cos(b), cy + R * Math.sin(b), { c: C.verde, w: 2, head: 10 });
texto(cx + 0.55 * R * Math.cos(b), cy + 0.55 * R * Math.sin(b) - 10, 'R_T', { italic: true, c: C.verde, size: 18 });
bola(P[0], P[1], 6, { fill: C.masa });
texto(cx, cy + 50, 'm', { italic: true, size: 20 });

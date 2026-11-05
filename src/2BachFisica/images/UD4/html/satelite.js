// Satélite en órbita circular: la fuerza gravitatoria es la fuerza centrípeta; r = R_T + h.
lienzo(420, 360);
const cx = 200, cy = 185, R = 70, r = 150, a = -0.75;
E(S, 'circle', { cx, cy, r, fill: 'none', stroke: C.morado, 'stroke-width': 1.6, 'stroke-dasharray': '7 5' });
E(S, 'circle', { cx, cy, r: R, fill: '#64b5f6', stroke: C.azul, 'stroke-width': 2 });
texto(cx + 8, cy + 36, 'M_T', { italic: true, size: 18, c: '#fff' });
const s = [cx + r * Math.cos(a), cy + r * Math.sin(a)], u = [Math.cos(a), Math.sin(a)];
linea(cx, cy, s[0], s[1], { c: C.gris, w: 1.2 });
const e = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
cota(e[0] + u[1] * 34, e[1] - u[0] * 34, s[0] + u[1] * 34 - u[0] * 12, s[1] - u[0] * 34 - u[1] * 12, '', { c: C.verde });
texto((e[0] + s[0]) / 2 + u[1] * 50, (e[1] + s[1]) / 2 - u[0] * 50 + 6, 'h', { italic: true, c: C.verde, anchor: 'start', size: 19 });
const b = 2.5; flecha(cx, cy, cx + R * Math.cos(b), cy + R * Math.sin(b), { c: '#fff', w: 1.6, head: 8 });
texto(cx + 0.5 * R * Math.cos(b) - 4, cy + 0.5 * R * Math.sin(b) - 10, 'R_T', { italic: true, size: 15, c: '#fff' });
const c = 3.6; texto(cx + r * Math.cos(c) - 10, cy + r * Math.sin(c) + 34, 'r = R_T + h', { italic: true, size: 17, c: C.morado });
flecha(s[0], s[1], s[0] - u[0] * 60, s[1] - u[1] * 60, { c: C.rojo, w: 2.6 }); texto(s[0] - u[0] * 40 - u[1] * 18, s[1] - u[1] * 40 + u[0] * 18 + 6, 'F', { italic: true, c: C.rojo, size: 19 });
flecha(s[0], s[1], s[0] - u[1] * 80, s[1] + u[0] * 80, { c: C.verde, w: 2.6 }); texto(s[0] - u[1] * 90 + 10, s[1] + u[0] * 90 + 6, 'v', { italic: true, c: C.verde, size: 19, anchor: 'start' });
E(S, 'rect', { x: s[0] - 9, y: s[1] - 9, width: 18, height: 18, fill: '#bdbdbd', stroke: C.tinta, 'stroke-width': 1.4, transform: `rotate(40 ${s[0]} ${s[1]})` });
linea(s[0] - 20, s[1] - 20, s[0] + 20, s[1] + 20, { c: C.azul, w: 4 });
texto(s[0] + 18, s[1] - 16, 'm', { italic: true, size: 18, anchor: 'start' });

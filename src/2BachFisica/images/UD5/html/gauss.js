// Teorema de Gauss: (a) superficie esférica alrededor de una carga; (b) el flujo solo depende de la carga encerrada.
lienzo(760, 320);
// (a)
const cx = 180, cy = 155, R = 105;
E(S, 'circle', { cx, cy, r: R, fill: C.moradoClaro, 'fill-opacity': .5, stroke: C.morado, 'stroke-width': 1.8, 'stroke-dasharray': '6 4' });
E(S, 'ellipse', { cx, cy, rx: R, ry: 26, fill: 'none', stroke: C.morado, 'stroke-width': 1, 'stroke-dasharray': '4 4' });
for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6 + 0.2; flecha(cx + 18 * Math.cos(a), cy + 18 * Math.sin(a), cx + 150 * Math.cos(a), cy + 150 * Math.sin(a), { c: C.rojo, w: 1.3, head: 8 }); }
carga(cx, cy, 14, 1);
const a = -0.95, P = [cx + R * Math.cos(a), cy + R * Math.sin(a)];
flecha(P[0], P[1], P[0] + 52 * Math.cos(a), P[1] + 52 * Math.sin(a), { c: C.azul, w: 2.6 }); texto(P[0] + 60 * Math.cos(a) + 8, P[1] + 60 * Math.sin(a), 'dS', { italic: true, c: C.azul, anchor: 'start', size: 18 });
texto(cx - 54, cy + 50, 'r', { italic: true, size: 19 }); linea(cx, cy, cx - R * 0.71, cy + R * 0.71, { c: C.tinta, w: 1.2 });
texto(cx, 310, '(a) Superficie gaussiana esférica', { size: 15 });
// (b) tres superficies cerradas
const ox = 400;
E(S, 'path', { d: `M${ox + 30},120 C${ox + 20},40 ${ox + 150},30 ${ox + 150},100 C${ox + 160},170 ${ox + 40},190 ${ox + 30},120 Z`, fill: '#e3f2fd', stroke: C.azul, 'stroke-width': 1.6 });
E(S, 'path', { d: `M${ox + 190},70 C${ox + 260},20 ${ox + 360},60 ${ox + 340},140 C${ox + 330},220 ${ox + 220},230 ${ox + 200},170 C${ox + 180},130 ${ox + 160},100 ${ox + 190},70 Z`, fill: '#e8f5e9', stroke: C.verde, 'stroke-width': 1.6 });
E(S, 'path', { d: `M${ox + 60},230 C${ox + 70},190 ${ox + 170},200 ${ox + 160},250 C${ox + 150},290 ${ox + 50},280 ${ox + 60},230 Z`, fill: '#fff3e0', stroke: C.naranja, 'stroke-width': 1.6 });
carga(ox + 90, 105, 10, 1); texto(ox + 110, 110, 'q_1', { italic: true, size: 16, anchor: 'start' });
carga(ox + 240, 110, 10, 1); texto(ox + 258, 115, 'q_2', { italic: true, size: 16, anchor: 'start' });
carga(ox + 280, 170, 10, -1); texto(ox + 298, 175, 'q_3', { italic: true, size: 16, anchor: 'start' });
texto(ox + 40, 70, 'S_1', { italic: true, c: C.azul, size: 17 }); texto(ox + 330, 50, 'S_2', { italic: true, c: C.verde, size: 17 });
texto(ox + 180, 260, 'S_3', { italic: true, c: C.naranja, size: 17, anchor: 'start' });
texto(ox + 180, 310, '(b) Φ_1 = q_1/ε_0;  Φ_2 = (q_2 + q_3)/ε_0;  Φ_3 = 0', { size: 15 });

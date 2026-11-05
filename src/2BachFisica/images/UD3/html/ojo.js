// Esquema del ojo humano: la córnea y el cristalino forman una imagen real e invertida sobre la retina.
lienzo(660, 330);
const cx = 340, cy = 165, R = 125;
E(S, 'circle', { cx, cy, r: R, fill: '#fafafa', stroke: C.tinta, 'stroke-width': 2.4 });
// humor vítreo y retina
arco(cx, cy, R - 4, -62, 62, { c: '#e57373', w: 7 });
// córnea (casquete delante del globo)
const xc = cx - R;
camino(`M${xc + 18},${cy - 62} Q${xc - 46},${cy} ${xc + 18},${cy + 62}`, { c: C.azul, w: 2.6, fill: '#e3f2fd' });
// iris y cristalino
E(S, 'rect', { x: xc + 30, y: cy - 66, width: 7, height: 44, fill: '#6d4c41' });
E(S, 'rect', { x: xc + 30, y: cy + 22, width: 7, height: 44, fill: '#6d4c41' });
E(S, 'ellipse', { cx: xc + 56, cy, rx: 16, ry: 40, fill: '#bbdefb', stroke: C.azul, 'stroke-width': 2 });
// músculos ciliares
[-1, 1].forEach(s => linea(xc + 56, cy + s * 40, xc + 60, cy + s * 70, { c: '#8d6e63', w: 4 }));
// nervio óptico
E(S, 'path', { d: `M${cx + R - 6},${cy + 14} L${cx + R + 70},${cy + 30} L${cx + R + 70},${cy + 54} L${cx + R - 12},${cy + 38} Z`, fill: '#ffcc80', stroke: C.tinta, 'stroke-width': 1.5 });
// rayos de un objeto lejano que convergen en la retina
const Fx = cx + R - 6;
[-30, 0, 30].forEach(dy => {
    linea(20, cy + dy, xc + 56, cy + dy, { c: C.naranja, w: 1.8 });
    linea(xc + 56, cy + dy, Fx, cy, { c: C.naranja, w: 1.8 });
});
const et = [[xc - 14, cy - 92, 'córnea', 'end'], [xc + 34, cy - 104, 'iris y pupila', 'middle'], [xc + 82, cy + 108, 'cristalino', 'start'],
    [xc + 60, cy + 150, 'músculos ciliares', 'middle'], [cx + 30, cy - 30, 'humor vítreo', 'middle'], [cx + R + 4, cy - 100, 'retina', 'start'],
    [cx + R + 50, cy + 80, 'nervio óptico', 'middle'], [xc - 20, cy + 96, 'humor acuoso', 'end']];
et.forEach(([x, y, t, a]) => texto(x, y, t, { size: 15, anchor: a, halo: true }));
linea(xc + 56, cy + 44, xc + 82, cy + 96, { c: C.gris, w: 1 });
linea(xc + 33, cy - 68, xc + 34, cy - 96, { c: C.gris, w: 1 });

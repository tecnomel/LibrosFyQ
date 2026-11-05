// Práctica: comprobación de la ley de Snell con un bloque semicircular sobre un disco graduado.
lienzo(420, 380);
const cx = 210, cy = 190, R = 160, n = 1.5, i = 40 * Math.PI / 180, r = Math.asin(Math.sin(i) / n);
E(S, 'circle', { cx, cy, r: R, fill: '#fafafa', stroke: C.tinta, 'stroke-width': 2 });
for (let a = 0; a < 360; a += 10) {
    const t = a * Math.PI / 180, l = a % 30 === 0 ? 12 : 6;
    linea(cx + R * Math.sin(t), cy - R * Math.cos(t), cx + (R - l) * Math.sin(t), cy - (R - l) * Math.cos(t), { w: 1.2 });
}
[0, 30, 60, 90].forEach(a => { const t = a * Math.PI / 180; texto(cx - (R - 26) * Math.sin(t), cy - (R - 26) * Math.cos(t) + 5, a + '°', { size: 12, c: C.gris }); });
// bloque semicircular (cara plana en el diámetro horizontal)
E(S, 'path', { d: `M${cx - 110},${cy} A110,110 0 0,0 ${cx + 110},${cy} Z`, fill: '#bbdefb', 'fill-opacity': .8, stroke: C.azul, 'stroke-width': 2 });
linea(cx, cy - R, cx, cy + R, { c: C.gris, w: 1.2, dash: '5 4' });
linea(cx - R, cy, cx + R, cy, { c: C.gris, w: 1 });
// láser y rayos
const I = [cx - 175 * Math.sin(i), cy - 175 * Math.cos(i)];
E(S, 'rect', { x: I[0] - 24, y: I[1] - 9, width: 34, height: 18, rx: 3, fill: C.tinta, transform: `rotate(${50} ${I[0]} ${I[1]})` });
linea(I[0], I[1], cx, cy, { c: C.rojo, w: 2.4 }); flecha(I[0], I[1], (I[0] + cx) / 2, (I[1] + cy) / 2, { c: C.rojo, w: 2.4 });
flecha(cx, cy, cx + 150 * Math.sin(r), cy + 150 * Math.cos(r), { c: C.rojo, w: 2.4 });
linea(cx, cy, cx + 140 * Math.sin(i), cy - 140 * Math.cos(i), { c: C.rojo, w: 1.1, dash: '4 4' });
arco(cx, cy, 52, 90, 130, { c: C.rojo, w: 1.6 }); texto(cx - 18, cy - 60, 'î', { italic: true, c: C.rojo });
arco(cx, cy, 58, -90, -90 + r * 180 / Math.PI, { c: C.azul, w: 1.6 }); texto(cx + 14, cy + 76, 'r̂', { italic: true, c: C.azul });
texto(cx + 70, cy + 128, 'metacrilato', { size: 14, c: C.azul, halo: true });
texto(I[0] - 6, I[1] - 22, 'láser', { size: 14, halo: true });

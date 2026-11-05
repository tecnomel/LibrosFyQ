// Experiencia de Faraday: al acercar un imán a una bobina conectada a un galvanómetro, la aguja se desvía.
lienzo(620, 260);
// bobina (vista lateral)
const x0 = 280, x1 = 420, yc = 110, r = 46;
for (let x = x0; x <= x1; x += 12) E(S, 'ellipse', { cx: x, cy: yc, rx: 7, ry: r, fill: 'none', stroke: C.naranja, 'stroke-width': 2.2 });
camino(`M${x0},${yc + r} L${x0},${yc + 120} L${350 - 30},${yc + 120}`, { w: 1.8 });
camino(`M${x1},${yc + r} L${x1},${yc + 120} L${350 + 30},${yc + 120}`, { w: 1.8 });
E(S, 'circle', { cx: 350, cy: yc + 120, r: 28, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.8 });
arco(350, yc + 120, 20, 30, 150, { w: 1.2 });
linea(350, yc + 132, 362, yc + 102, { c: C.rojo, w: 2 }); texto(350, yc + 136, 'G', { size: 13, bold: true });
// imán acercándose
imanBarra(60, yc - 22, 150, 44, true);
flecha(150, yc - 50, 230, yc - 50, { c: C.verde, w: 2.6 }); texto(190, yc - 60, 'v', { italic: true, c: C.verde });
// líneas del imán que atraviesan la bobina
[-30, -12, 12, 30].forEach(dy => camino(`M210,${yc + dy * 0.6} Q260,${yc + dy} ${x1 + 40},${yc + dy * 1.5}`, { c: C.morado, w: 1.2 }));
texto(500, 60, 'Mientras el imán se mueve,', { size: 14 }); texto(500, 80, 'circula corriente inducida', { size: 14 });

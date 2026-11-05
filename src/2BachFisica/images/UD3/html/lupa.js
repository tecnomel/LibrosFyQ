// La lupa: con el objeto entre el foco y la lente se obtiene una imagen virtual, derecha y mayor.
lienzo(620, 300);
sistema({ tipo: 'convergente', X0: 360, Y0: 190, f: 110, s: -75, y: 30, h: 80, caja: [10, 10, 610, 296] });
// ojo detrás de la lente
E(S, 'ellipse', { cx: 410, cy: 160, rx: 16, ry: 10, fill: '#fff', stroke: C.tinta, 'stroke-width': 1.6 });
bola(404, 160, 4, { fill: C.tinta });
texto(150, 40, 'imagen virtual', { size: 15, c: C.naranja, halo: true });
texto(285, 284, 'objeto', { size: 15, c: C.verde, halo: true });

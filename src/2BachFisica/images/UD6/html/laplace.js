// Ley de Laplace: fuerza sobre un conductor rectilíneo por el que circula I dentro de un campo entrante.
lienzo(460, 230);
aspas(30, 30, 430, 200, 32, false);
E(S, 'rect', { x: 40, y: 104, width: 380, height: 22, rx: 11, fill: '#ffe0b2', stroke: C.naranja, 'stroke-width': 1.6 });
flecha(80, 115, 380, 115, { c: C.rojo, w: 2.6 }); texto(392, 120, 'I', { italic: true, c: C.rojo, anchor: 'start' });
flecha(230, 104, 230, 30, { c: C.verde, w: 3 }); texto(240, 44, 'F = I L B', { italic: true, c: C.verde, anchor: 'start', size: 18, halo: true });
cota(80, 158, 380, 158, 'L', { dy: 24 });
texto(430, 224, 'B entrante', { size: 14, c: C.gris, anchor: 'end' });

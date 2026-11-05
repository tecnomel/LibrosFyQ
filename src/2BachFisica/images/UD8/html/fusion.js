// Fusión de deuterio y tritio: se forma un núcleo de helio-4 y se libera un neutrón y 17,6 MeV.
lienzo(640, 230);
nucleoDibujo(70, 80, 1, 1, 12, { semilla: 2 }); texto(70, 128, '²H', { size: 16 });
nucleoDibujo(70, 170, 1, 2, 12, { semilla: 4 }); texto(70, 220, '³H', { size: 16 });
flecha(105, 85, 220, 118, { c: C.gris, w: 2 }); flecha(105, 165, 220, 132, { c: C.gris, w: 2 });
E(S, 'circle', { cx: 270, cy: 125, r: 40, fill: '#fff3e0', stroke: C.naranja, 'stroke-width': 2, 'stroke-dasharray': '4 3' });
texto(270, 131, 'fusión', { size: 14, c: C.naranja });
flecha(312, 110, 410, 75, { c: C.gris, w: 2 }); flecha(312, 140, 410, 175, { c: C.gris, w: 2 });
nucleoDibujo(450, 70, 2, 2, 12, { semilla: 6 }); texto(500, 76, '⁴He', { size: 16, anchor: 'start' });
neutron(440, 180, 12); texto(470, 186, 'n', { size: 16, anchor: 'start', italic: true });
texto(560, 130, '+ 17,6 MeV', { size: 16, c: C.rojo });

// Fisión del uranio-235: un neutrón lento es absorbido, el núcleo se deforma y se rompe en dos fragmentos y 2-3 neutrones.
lienzo(760, 260);
neutron(30, 130, 8); flecha(42, 130, 90, 130, { c: C.gris, w: 2, head: 9 });
nucleoDibujo(150, 130, 20, 26, 8, { semilla: 3 }); texto(150, 210, '²³⁵U', { size: 17 });
flecha(225, 130, 275, 130, { c: C.tinta, w: 2.4 });
// núcleo excitado y deformado
E(S, 'ellipse', { cx: 350, cy: 130, rx: 66, ry: 42, fill: '#ffccbc', stroke: C.naranja, 'stroke-width': 2 });
texto(350, 136, '²³⁶U*', { size: 17 }); texto(350, 210, 'inestable', { size: 14 });
flecha(425, 130, 475, 130, { c: C.tinta, w: 2.4 });
nucleoDibujo(560, 70, 10, 14, 7, { semilla: 5 }); texto(640, 60, '¹⁴⁴Ba', { size: 16, anchor: 'start' });
nucleoDibujo(560, 195, 8, 10, 7, { semilla: 9 }); texto(640, 205, '⁸⁹Kr', { size: 16, anchor: 'start' });
[[690, 120], [720, 145], [700, 100]].forEach(([x, y]) => { neutron(x, y, 7); flecha(x + 8, y, x + 36, y + (y - 125) * 0.4, { c: C.gris, w: 1.6, head: 8 }); });
texto(560, 252, '+ energía (≈ 200 MeV)', { size: 15, c: C.rojo });

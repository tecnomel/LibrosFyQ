// Varilla que se desliza sobre unos raíles en U dentro de un campo entrante: fem inducida ε = B·l·v.
lienzo(520, 260);
aspas(40, 40, 480, 220, 30, false, { c: '#b0bec5' });
camino('M440,50 L60,50 L60,210 L440,210', { c: C.tinta, w: 3 });
const xv = 300;
E(S, 'rect', { x: xv - 6, y: 38, width: 12, height: 184, fill: '#ffcc80', stroke: C.naranja, 'stroke-width': 1.6 });
flecha(xv + 10, 130, xv + 80, 130, { c: C.verde, w: 2.6 }); texto(xv + 86, 136, 'v', { italic: true, c: C.verde, anchor: 'start', size: 19 });
// corriente inducida: sentido antihorario visto así (el flujo entrante aumenta → B inducido saliente)
flecha(xv, 196, xv, 64, { c: C.rojo, w: 2.2, head: 10 }); texto(xv - 14, 190, 'I', { italic: true, c: C.rojo, anchor: 'end', size: 18 });
flecha(xv - 40, 50, 160, 50, { c: C.rojo, w: 2.2, head: 10 });
// fuerza magnética sobre la varilla: se opone al movimiento
flecha(xv - 10, 98, xv - 70, 98, { c: C.morado, w: 2.4 }); texto(xv - 74, 92, 'F_m', { italic: true, c: C.morado, anchor: 'end', size: 16, halo: true });
cota(xv + 30, 50, xv + 30, 210, '', {}); texto(xv + 36, 186, 'l', { italic: true, anchor: 'start', size: 19 });
texto(470, 250, 'B entrante', { size: 14, c: C.gris, anchor: 'end' });

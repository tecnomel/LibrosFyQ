// Poder de penetración: las partículas alfa las detiene una hoja de papel; las beta, unos milímetros de aluminio; las gamma
// solo se atenúan con gruesas capas de plomo u hormigón.
lienzo(620, 240);
const ys = { a: 60, b: 120, g: 180 }, X0 = 40;
E(S, 'rect', { x: 180, y: 30, width: 6, height: 180, fill: '#fff8e1', stroke: C.tinta, 'stroke-width': 1 });
E(S, 'rect', { x: 290, y: 30, width: 22, height: 180, fill: '#cfd8dc', stroke: C.tinta, 'stroke-width': 1 });
E(S, 'rect', { x: 420, y: 30, width: 70, height: 180, fill: '#78909c', stroke: C.tinta, 'stroke-width': 1 });
texto(183, 228, 'papel', { size: 13 }); texto(301, 228, 'aluminio', { size: 13 }); texto(455, 228, 'plomo', { size: 13 });
flecha(X0, ys.a, 178, ys.a, { c: C.rojo, w: 2.6 }); texto(X0 - 6, ys.a + 6, 'α', { italic: true, c: C.rojo, size: 20, anchor: 'end' });
flecha(X0, ys.b, 288, ys.b, { c: C.azul, w: 2.6 }); texto(X0 - 6, ys.b + 6, 'β', { italic: true, c: C.azul, size: 20, anchor: 'end' });
camino(seno(X0, 600, ys.g, 6, 20), { c: C.verde, w: 2 }); texto(X0 - 6, ys.g + 6, 'γ', { italic: true, c: C.verde, size: 20, anchor: 'end' });
E(S, 'rect', { x: 492, y: ys.g - 10, width: 110, height: 20, fill: '#fff', 'fill-opacity': .55 });

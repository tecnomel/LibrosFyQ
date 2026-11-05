// Flujo eléctrico a través de una superficie plana: Φ = E·S·cos α (α, ángulo entre E y el vector superficie).
lienzo(420, 280);
E(S, 'polygon', { points: '120,220 260,220 320,120 180,120', fill: C.moradoClaro, stroke: C.morado, 'stroke-width': 1.8 });
const c = [220, 170];
flecha(c[0], c[1], c[0], 50, { c: C.azul, w: 2.6 }); texto(c[0] - 10, 60, 'S', { italic: true, c: C.azul, anchor: 'end', size: 20 });
for (let k = -2; k <= 2; k++) flecha(70 + k * 26 + 60, 240 + k * 6 - 20, 70 + k * 26 + 260, 240 + k * 6 - 190, { c: C.rojo, w: 1.6, head: 9 });
texto(360, 40, 'E', { italic: true, c: C.rojo, size: 20 });
arco(c[0], c[1], 50, 90, 90 - 49.6, { c: C.verde, w: 1.8 }); texto(c[0] + 26, c[1] - 58, 'α', { italic: true, c: C.verde, size: 18 });

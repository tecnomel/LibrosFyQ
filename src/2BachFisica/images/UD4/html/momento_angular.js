// Momento angular L = r × p: perpendicular al plano que forman r y v (perspectiva caballera).
lienzo(480, 340);
const O = [170, 210];
// plano de la trayectoria (paralelogramo en perspectiva)
E(S, 'polygon', { points: '40,250 300,250 440,150 180,150', fill: C.moradoClaro, stroke: C.claro, 'stroke-width': 1.2 });
// ejes
flecha(O[0], O[1], O[0], 40, { c: C.gris, w: 1.4, head: 9 }); texto(O[0] + 10, 46, 'z', { italic: true, c: C.gris, anchor: 'start' });
flecha(O[0], O[1], 460, O[1], { c: C.gris, w: 1.4, head: 9 }); texto(452, O[1] + 22, 'y', { italic: true, c: C.gris });
flecha(O[0], O[1], 90, 290, { c: C.gris, w: 1.4, head: 9 }); texto(80, 300, 'x', { italic: true, c: C.gris });
// trayectoria, partícula y vectores
camino('M70,236 Q240,250 400,170', { c: C.morado, w: 2, dash: '6 4' });
const Pm = [330, 214];
flecha(O[0], O[1], Pm[0], Pm[1], { c: C.azul, w: 2.6 }); texto(250, 228, 'r', { italic: true, c: C.azul, size: 20 });
flecha(Pm[0], Pm[1], 410, 176, { c: C.verde, w: 2.6 }); texto(400, 168, 'p = mv', { italic: true, c: C.verde, size: 18, anchor: 'start' });
bola(Pm[0], Pm[1], 8, { fill: C.masa });
flecha(O[0], O[1], O[0], 70, { c: C.rojo, w: 3 }); texto(O[0] - 12, 92, 'L', { italic: true, c: C.rojo, size: 22, anchor: 'end' });
arco(Pm[0], Pm[1], 26, 160, 205, { c: C.naranja, w: 1.6 }); texto(Pm[0] - 36, Pm[1] - 14, 'φ', { italic: true, c: C.naranja, size: 17 });
texto(O[0] - 10, O[1] + 22, 'O', { italic: true, anchor: 'end' });

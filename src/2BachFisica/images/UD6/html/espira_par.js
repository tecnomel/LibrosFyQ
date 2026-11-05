// Espira rectangular en un campo uniforme horizontal: (a) en perspectiva, par de fuerzas sobre los lados AB y CD;
// (b) vista desde arriba: brazo b·sen α y momento M = I S B sen α.
lienzo(760, 300);
// (a) perspectiva caballera: espira en un plano vertical inclinado
const A = [80, 230], Bp = [80, 90], Cp = [260, 60], D = [260, 200];
for (let y = 40; y <= 260; y += 44) flecha(20, y, 330, y, { c: C.claro, w: 1.3, head: 8 });
texto(326, 30, 'B', { italic: true, c: C.azul, size: 18 });
camino(`M${A} L${Bp} L${Cp} L${D} Z`, { c: C.naranja, w: 2.6 });
flecha(A[0], A[1] - 30, A[0], A[1] - 100, { c: C.rojo, w: 2, head: 9 }); texto(A[0] - 8, A[1] - 70, 'I', { italic: true, c: C.rojo, anchor: 'end' });
flecha(D[0], D[1] - 100, D[0], D[1] - 30, { c: C.rojo, w: 2, head: 9 }); texto(D[0] + 8, D[1] - 70, 'I', { italic: true, c: C.rojo, anchor: 'start' });
// fuerzas sobre los lados verticales: perpendiculares a B y al lado (saliente / entrante → dibujadas en diagonal)
flecha(80, 160, 130, 120, { c: C.verde, w: 2.6 }); texto(136, 118, 'F', { italic: true, c: C.verde, anchor: 'start' });
flecha(260, 130, 210, 170, { c: C.verde, w: 2.6 }); texto(204, 186, 'F', { italic: true, c: C.verde, anchor: 'end' });
texto(70, 248, 'A', { italic: true }); texto(70, 84, 'B', { italic: true }); texto(270, 54, 'C', { italic: true }); texto(270, 214, 'D', { italic: true });
texto(170, 290, '(a) Par de fuerzas sobre la espira', { size: 15 });
// (b) vista superior: la espira es un segmento que forma α con B; S es perpendicular a ella
const O = [570, 150], a = 50 * Math.PI / 180, b = 90;
for (let y = 40; y <= 260; y += 44) flecha(400, y, 740, y, { c: C.claro, w: 1.3, head: 8 });
texto(736, 30, 'B', { italic: true, c: C.azul, size: 18 });
const u = [Math.sin(a), -Math.cos(a)];      // dirección de la espira vista de canto
const P1 = [O[0] - u[0] * b, O[1] - u[1] * b], P2 = [O[0] + u[0] * b, O[1] + u[1] * b];
linea(P1[0], P1[1], P2[0], P2[1], { c: C.naranja, w: 4 });
corriente(P1[0], P1[1], 10, false, { c: C.rojo }); corriente(P2[0], P2[1], 10, true, { c: C.rojo });
flecha(P1[0], P1[1] + 12, P1[0], P1[1] + 62, { c: C.verde, w: 2.4 }); flecha(P2[0], P2[1] - 12, P2[0], P2[1] - 62, { c: C.verde, w: 2.4 });
texto(P1[0] + 10, P1[1] + 56, 'F', { italic: true, c: C.verde, anchor: 'start' }); texto(P2[0] + 10, P2[1] - 48, 'F', { italic: true, c: C.verde, anchor: 'start' });
const s = [Math.cos(a), Math.sin(a)];
flecha(O[0], O[1], O[0] + s[0] * 80, O[1] + s[1] * 80, { c: C.morado, w: 2.4 });
texto(O[0] + s[0] * 90, O[1] + s[1] * 90 + 8, 'S', { italic: true, c: C.morado, anchor: 'start' });
arco(O[0], O[1], 36, 0, -a * 180 / Math.PI, { c: C.morado, w: 1.4 }); texto(O[0] + 44, O[1] + 26, 'α', { italic: true, c: C.morado, size: 17 });
linea(O[0], O[1], O[0] + 130, O[1], { c: C.gris, w: 1, dash: '4 4' });
texto(570, 290, '(b) Vista desde arriba: M = I S B sen α', { size: 15 });

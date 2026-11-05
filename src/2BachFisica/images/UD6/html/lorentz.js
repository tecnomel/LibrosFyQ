// Fuerza de Lorentz F = q v × B: perpendicular a v y a B; símbolos de campo entrante (×) y saliente (•).
lienzo(720, 270);
// (a) perspectiva
const O = [150, 180];
E(S, 'polygon', { points: '40,210 260,210 330,140 110,140', fill: C.moradoClaro, stroke: C.claro });
flecha(O[0], O[1], O[0] + 150, O[1], { c: C.verde, w: 2.6 }); texto(O[0] + 158, O[1] + 6, 'v', { italic: true, c: C.verde, anchor: 'start', size: 20 });
flecha(O[0], O[1], O[0] + 110, O[1] - 60, { c: C.azul, w: 2.6 }); texto(O[0] + 116, O[1] - 66, 'B', { italic: true, c: C.azul, anchor: 'start', size: 20 });
flecha(O[0], O[1], O[0], O[1] - 150, { c: C.rojo, w: 2.8 }); texto(O[0] - 10, O[1] - 140, 'F', { italic: true, c: C.rojo, anchor: 'end', size: 20 });
arco(O[0], O[1], 40, 0, 28, { c: C.naranja, w: 1.6 }); texto(O[0] + 50, O[1] - 8, 'φ', { italic: true, c: C.naranja, size: 17, anchor: 'start' });
bola(O[0], O[1], 9, { fill: '#ef5350' }); texto(O[0], O[1] + 5, '+', { c: '#fff', size: 14, bold: true });
texto(170, 260, '(a) Carga positiva: F = q·v·B·sen φ', { size: 15 });
// (b) campo entrante y saliente
aspas(420, 50, 520, 190, 28, false); texto(470, 230, 'B entrante (⊗)', { size: 14 });
aspas(580, 50, 680, 190, 28, true); texto(630, 230, 'B saliente (⊙)', { size: 14 });
texto(550, 260, '(b) Campo perpendicular al papel', { size: 15 });

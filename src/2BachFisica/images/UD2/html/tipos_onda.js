// Onda longitudinal en un muelle (compresiones y dilataciones) y onda transversal en una cuerda.
lienzo(760, 386);
const x0 = 60, x1 = 720, lam = 220;

// (a) longitudinal: cada espira se desplaza u = a·sen(kx) a lo largo del muelle
const yA = 92, a = 24, N = 96, dx = (x1 - x0) / N;
const pos = i => { const x = x0 + i * dx; return x + a * Math.sin(2 * Math.PI * (x - x0) / lam); };
let d = `M${x0 - 30},${yA} L${x0},${yA}`;
for (let i = 0; i <= N; i++) d += ` L${pos(i).toFixed(1)},${yA + (i % 2 ? 15 : -15)}`;
camino(d, { c: C.morado, w: 1.6 });
caja(x0 - 52, yA - 22, 22, 44, { fill: C.claro, c: C.tinta });
// compresiones (espiras juntas) y dilataciones (separadas)
[170, 390, 610].forEach(x => texto(x, yA + 42, 'compresión', { size: 15, c: C.azul }));
[280, 500].forEach(x => texto(x, yA + 42, 'dilatación', { size: 15, c: C.naranja }));
cota(170, yA - 40, 390, yA - 40, 'λ');
flecha(470, yA - 40, 640, yA - 40, { c: C.verde, w: 2.2 });
texto(555, yA - 50, 'propagación', { size: 16, c: C.verde });
// una espira marcada y su vibración (en la dirección de propagación)
const ie = 60, xe = pos(ie);
camino(`M${xe},${yA - 18} L${xe},${yA + 18}`, { c: C.rojo, w: 3.5 });
flecha(xe - 26, yA + 64, xe + 26, yA + 64, { c: C.rojo, w: 2, head: 9, doble: true });
texto(xe + 34, yA + 69, 'vibración', { size: 15, c: C.rojo, anchor: 'start' });
texto(380, 186, '(a) Onda longitudinal: la vibración tiene la dirección de la propagación', { size: 17 });

// (b) transversal: cuerda con partículas que suben y bajan
const yB = 298, A = 40;
camino(seno(x0, x1, yB, A, lam), { c: C.morado, w: 3 });
linea(x0 - 20, yB, x1 + 10, yB, { c: C.gris, w: 1, dash: '5 5' });
caja(x0 - 52, yB - 22, 22, 44, { fill: C.claro, c: C.tinta });
for (let x = x0 + 11; x < x1; x += 22) punto(x, yB - A * Math.sin(2 * Math.PI * (x - x0) / lam), 4, C.morado);
[x0 + 22 * 9.5 + 11, x0 + 22 * 12 + 11].forEach(x => {
    const y = yB - A * Math.sin(2 * Math.PI * (x - x0) / lam);
    flecha(x, y - 22, x, y + 22, { c: C.rojo, w: 2, head: 9, doble: true });
});
cota(115, yB - A - 22, 335, yB - A - 22, 'λ');
flecha(470, yB - A - 26, 640, yB - A - 26, { c: C.verde, w: 2.2 });
texto(555, yB - A - 36, 'propagación', { size: 16, c: C.verde });
texto(380, 378, '(b) Onda transversal: la vibración es perpendicular a la propagación', { size: 17 });

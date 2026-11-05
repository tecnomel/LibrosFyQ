// Efecto Compton: un fotón de longitud de onda λ choca con un electrón en reposo; sale otro fotón de λ' > λ desviado un ángulo θ.
lienzo(600, 280);
const O = [300, 140];
camino(seno(30, 280, O[1], 10, 22), { c: '#7b1fa2', w: 2.2 }); flecha(270, O[1] - 26, 300, O[1] - 26, { c: '#7b1fa2', w: 1.6, head: 8 });
texto(140, O[1] - 26, 'fotón incidente (λ)', { size: 14, c: '#7b1fa2' });
bola(O[0], O[1], 9, { fill: '#42a5f5' }); texto(O[0] - 4, O[1] + 30, 'electrón en reposo', { size: 13, anchor: 'end' });
linea(O[0], O[1], 560, O[1], { c: C.gris, w: 1, dash: '5 4' });
const t = -35 * Math.PI / 180, L = 230;
// fotón dispersado: onda a lo largo de la dirección t
let d = ''; for (let s = 14; s <= L; s += 2) { const w = 12 * Math.sin(2 * Math.PI * s / 34); const x = O[0] + s * Math.cos(t) - w * Math.sin(t), y = O[1] + s * Math.sin(t) + w * Math.cos(t); d += (d ? ' L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
camino(d, { c: '#c2185b', w: 2.2 });
texto(O[0] + L * Math.cos(t) - 10, O[1] + L * Math.sin(t) - 14, "fotón dispersado (λ')", { size: 14, c: '#c2185b' });
arco(O[0], O[1], 60, 0, 35, { c: C.verde, w: 1.6 }); texto(O[0] + 72, O[1] - 16, 'θ', { italic: true, c: C.verde, size: 18 });
const t2 = 40 * Math.PI / 180;
flecha(O[0], O[1], O[0] + 150 * Math.cos(t2), O[1] + 150 * Math.sin(t2), { c: '#42a5f5', w: 2.4 });
texto(O[0] + 160 * Math.cos(t2), O[1] + 160 * Math.sin(t2) + 18, 'electrón', { size: 14, c: C.azul });
arco(O[0], O[1], 44, -40, 0, { c: C.naranja, w: 1.6 }); texto(O[0] + 54, O[1] + 26, 'φ', { italic: true, c: C.naranja, size: 18 });

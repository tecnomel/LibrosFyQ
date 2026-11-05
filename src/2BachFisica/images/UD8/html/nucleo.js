// Átomo (sin escala) y núcleo: protones y neutrones; el núcleo es unas 100 000 veces más pequeño que el átomo.
lienzo(640, 280);
// átomo
E(S, 'circle', { cx: 150, cy: 140, r: 110, fill: '#e3f2fd', stroke: C.azul, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
[[0.4, 80], [2.2, 60], [4.1, 95]].forEach(([a, r]) => { bola(150 + r * Math.cos(a), 140 + r * Math.sin(a), 6, { fill: '#42a5f5' }); });
punto(150, 140, 4, C.rojo);
texto(150, 270, 'átomo (≈ 10^{-10} m)', { size: 14 });
linea(156, 138, 380, 60, { c: C.gris, w: 1, dash: '3 4' }); linea(156, 142, 380, 230, { c: C.gris, w: 1, dash: '3 4' });
// núcleo ampliado
nucleoDibujo(470, 140, 6, 6, 18, { semilla: 11 });
bola(570, 70, 9, { fill: '#ef5350', c: C.tinta, w: 1 }); texto(586, 75, 'protón', { size: 14, anchor: 'start' });
bola(570, 100, 9, { fill: '#b0bec5', c: C.tinta, w: 1 }); texto(586, 105, 'neutrón', { size: 14, anchor: 'start' });
texto(470, 270, 'núcleo de carbono-12 (≈ 10^{-15} m)', { size: 14 });

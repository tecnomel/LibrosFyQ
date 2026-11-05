// Radiaciones alfa, beta y gamma en un campo magnético entrante: alfa (+) se desvía hacia un lado, beta (−) hacia el otro y más,
// gamma no se desvía.
lienzo(610, 300);
aspas(170, 30, 520, 270, 30, false, { c: '#cfd8dc' });
E(S, 'rect', { x: 40, y: 110, width: 110, height: 80, fill: '#90a4ae', stroke: C.tinta, 'stroke-width': 1.5 });
E(S, 'rect', { x: 40, y: 145, width: 110, height: 10, fill: '#fff' });
bola(62, 150, 7, { fill: '#ffd54f', c: C.naranja });
texto(95, 210, 'plomo', { size: 14 }); texto(62, 100, 'fuente', { size: 13 });
// gamma recta
flecha(150, 150, 520, 150, { c: C.verde, w: 2.4 }); texto(526, 155, 'γ', { italic: true, c: C.verde, size: 20, anchor: 'start' });
// alfa: carga +, v hacia +x, B entrante → F = q v × B hacia arriba (radio grande)
const arcoTray = (R, arriba, c, t) => {
    const cx = 150, cy = 150 + (arriba ? -R : R); let d = '';
    for (let a = 0; a <= 1.2; a += 0.01) { const x = cx + R * Math.sin(a), y = cy + (arriba ? R * Math.cos(a) : -R * Math.cos(a)); if (x > 520 || y < 32 || y > 268) break; d += (d ? ' L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
    camino(d, { c, w: 2.4 }); const pts = d.split(' L'), last = pts[pts.length - 1].split(','); texto(+last[0] + 8, +last[1] + 6, t, { italic: true, c, size: 20, anchor: 'start' });
};
arcoTray(700, true, C.rojo, 'α (+)');
arcoTray(180, false, C.azul, 'β (−)');
texto(520, 290, 'B entrante', { size: 13, c: C.gris, anchor: 'end' });

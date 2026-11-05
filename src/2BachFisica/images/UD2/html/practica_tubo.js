// Práctica: tubo de resonancia. Diapasón sobre un tubo con agua; en la columna de aire se forma una onda estacionaria
// con un nodo en la superficie del agua y un vientre en la boca del tubo (L = λ/4 en la primera resonancia).
lienzo(360, 420);
const xt = 140, wt = 64, boca = 120, agua = 250, fondo = 400, cx = xt + wt / 2;
E(S, 'rect', { x: xt, y: agua, width: wt, height: fondo - agua, fill: '#90caf9' });
linea(xt, boca, xt, fondo, { w: 2.5 }); linea(xt + wt, boca, xt + wt, fondo, { w: 2.5 }); linea(xt, fondo, xt + wt, fondo, { w: 2.5 });
// envolvente de la onda estacionaria en la columna de aire (vientre arriba, nodo en el agua)
const H = agua - boca;
camino(curva(y => cx + 22 * Math.cos(Math.PI / 2 * (y - boca) / H), boca, agua, 1.5).replace(/(-?[\d.]+),(-?[\d.]+)/g, '$2,$1'), { c: C.morado, w: 2.2 });
camino(curva(y => cx - 22 * Math.cos(Math.PI / 2 * (y - boca) / H), boca, agua, 1.5).replace(/(-?[\d.]+),(-?[\d.]+)/g, '$2,$1'), { c: C.morado, w: 2.2 });
// diapasón
camino(`M${cx - 12},${boca - 70} L${cx - 12},${boca - 30} Q${cx},${boca - 18} ${cx + 12},${boca - 30} L${cx + 12},${boca - 70}`, { w: 4, c: C.gris });
linea(cx, boca - 22, cx, boca - 6, { w: 4, c: C.gris });
texto(cx + 24, boca - 52, 'diapasón', { size: 15, anchor: 'start' });
cota(xt + wt + 26, boca, xt + wt + 26, agua, '', {});
texto(xt + wt + 36, (boca + agua) / 2 + 6, 'L = λ/4', { italic: true, size: 17, anchor: 'start' });
texto(xt - 10, boca + 6, 'vientre', { size: 14, anchor: 'end', c: C.azul });
texto(xt - 10, agua + 6, 'nodo', { size: 14, anchor: 'end', c: C.azul });
texto(cx, 340, 'agua', { size: 15 });

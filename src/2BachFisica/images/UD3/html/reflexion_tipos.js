// Reflexión especular (superficie pulida) y reflexión difusa (superficie rugosa).
lienzo(760, 250);
const yS = 190;
// (a) especular
rayado(30, yS, 320, 16); linea(30, yS, 350, yS, { w: 2.5 });
[0, 40, 80, 120].forEach(dx => {
    const xm = 120 + dx;
    flecha(xm - 110, yS - 140, xm - 55, yS - 70, { c: C.rojo, w: 2, head: 10 }); linea(xm - 55, yS - 70, xm, yS, { c: C.rojo, w: 2 });
    flecha(xm, yS, xm + 70, yS - 89, { c: C.azul, w: 2, head: 10 });
});
texto(190, 240, '(a) Reflexión especular', { size: 16 });
// (b) difusa: superficie irregular, cada rayo sale en una dirección
let d = 'M420,' + yS;
const pts = [];
for (let x = 420, k = 0; x <= 740; x += 16, k++) { const y = yS + (k % 2 ? -7 : 5) * (1 + (k % 3) * .4); d += ` L${x},${y}`; pts.push([x, y]); }
camino(d, { w: 2.5 });
[[500, -20], [540, 35], [580, -45], [620, 15]].forEach(([xm, ang], k) => {
    flecha(xm - 110, yS - 140, xm - 55, yS - 70, { c: C.rojo, w: 2, head: 10 }); linea(xm - 55, yS - 70, xm, yS - 2, { c: C.rojo, w: 2 });
    const a = (60 + ang) * Math.PI / 180;
    flecha(xm, yS - 2, xm + 95 * Math.cos(a), yS - 2 - 95 * Math.sin(a), { c: C.azul, w: 2, head: 10 });
});
texto(580, 240, '(b) Reflexión difusa', { size: 16 });

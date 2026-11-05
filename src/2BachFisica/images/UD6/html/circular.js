// Carga que entra perpendicularmente en un campo uniforme entrante: describe una circunferencia (sentido según el signo).
lienzo(700, 300);
function panel(ox, signo, titulo) {
    aspas(ox + 30, 30, ox + 310, 250, 28, false);
    const cx = ox + 170, cy = 140, R = 85;
    E(S, 'circle', { cx, cy, r: R, fill: 'none', stroke: signo > 0 ? C.rojo : C.azul, 'stroke-width': 2.4 });
    // posición en la parte superior, moviéndose hacia la izquierda (+) o la derecha (−)
    const P = [cx, cy - R];
    flecha(P[0], P[1], P[0] - signo * 70, P[1], { c: C.verde, w: 2.6 }); texto(P[0] - signo * 80, P[1] - 8, 'v', { italic: true, c: C.verde, size: 19 });
    flecha(P[0], P[1], P[0], P[1] + 55, { c: C.rojo, w: 2.6 }); texto(P[0] + 10, P[1] + 52, 'F', { italic: true, c: C.rojo, size: 19, anchor: 'start' });
    bola(P[0], P[1], 9, { fill: signo > 0 ? '#ef5350' : '#42a5f5' }); texto(P[0], P[1] + 5, signo > 0 ? '+' : '−', { c: '#fff', size: 14, bold: true });
    linea(cx, cy, cx + R * 0.71, cy + R * 0.71, { w: 1.2 }); texto(cx + 36, cy + 26, 'R', { italic: true, size: 17 });
    const a0 = signo > 0 ? 200 : -20, a1 = signo > 0 ? 240 : -60;
    arco(cx, cy, R + 14, a0, a1, { c: C.gris, w: 1.6 });
    const t = a1 * Math.PI / 180; flecha(cx + (R + 14) * Math.cos(t + signo * 0.05), cy - (R + 14) * Math.sin(t + signo * 0.05), cx + (R + 14) * Math.cos(t), cy - (R + 14) * Math.sin(t), { c: C.gris, w: 1.6, head: 9 });
    texto(ox + 170, 288, titulo, { size: 15 });
}
panel(0, 1, '(a) Carga positiva: sentido antihorario');
panel(360, -1, '(b) Carga negativa: sentido horario');

// Refracción: al pasar a un medio donde la onda va más despacio, el rayo se acerca a la normal y λ disminuye.
lienzo(560, 370);
const ox = 280, oy = 180, i = 45 * Math.PI / 180, r = Math.asin(Math.sin(i) * 0.6);
E(S, 'rect', { x: 30, y: oy, width: 500, height: 170, fill: '#e3f2fd' });
linea(30, oy, 530, oy, { w: 2.5 });
linea(ox, 30, ox, 340, { c: C.gris, w: 1.5, dash: '6 5' });
texto(44, 52, 'medio 1 (v_1)', { size: 16, anchor: 'start' });
texto(44, 336, 'medio 2 (v_2 < v_1)', { size: 16, anchor: 'start' });
const I = [ox - 190 * Math.sin(i), oy - 190 * Math.cos(i)], T = [ox + 190 * Math.sin(r), oy + 190 * Math.cos(r)];
linea(I[0], I[1], ox, oy, { c: C.rojo, w: 2.4 }); flecha(I[0], I[1], (I[0] + ox) / 2, (I[1] + oy) / 2, { c: C.rojo, w: 2.4 });
linea(ox, oy, T[0], T[1], { c: C.azul, w: 2.4 }); flecha(ox, oy, (T[0] + ox) / 2, (T[1] + oy) / 2, { c: C.azul, w: 2.4 });
for (let s = 30; s < 190; s += 40) {   // frentes en el medio 1, separados λ1
    const px = ox - s * Math.sin(i), py = oy - s * Math.cos(i);
    linea(px - 24 * Math.cos(i), py + 24 * Math.sin(i), px + 24 * Math.cos(i), py - 24 * Math.sin(i), { c: C.rojo, w: 1.4 });
}
for (let s = 24; s < 190; s += 24) {   // frentes en el medio 2, separados λ2 = 0,6 λ1
    const px = ox + s * Math.sin(r), py = oy + s * Math.cos(r);
    linea(px - 24 * Math.cos(r), py + 24 * Math.sin(r), px + 24 * Math.cos(r), py - 24 * Math.sin(r), { c: C.azul, w: 1.4 });
}
arco(ox, oy, 60, 90, 135, { c: C.rojo, w: 1.8 });
arco(ox, oy, 70, -90, -90 + r * 180 / Math.PI, { c: C.azul, w: 1.8 });
texto(ox - 24, oy - 68, 'î', { italic: true, c: C.rojo });
texto(ox + 18, oy + 92, 'r̂', { italic: true, c: C.azul });
texto(I[0] + 60, I[1] - 4, 'λ_1', { italic: true, c: C.rojo, size: 17, anchor: 'start' });
texto(T[0] + 18, T[1] - 30, 'λ_2', { italic: true, c: C.azul, size: 17, anchor: 'start' });

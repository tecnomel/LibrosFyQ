// Muelle vertical: longitud natural l0, longitud l con la masa colgada, alargamiento Δl y fuerzas en equilibrio.
lienzo(560, 410);
rayado(40, 20, 470, 16);
linea(40, 36, 510, 36, { w: 2.5 });

// muelle sin carga
const x1 = 150, yl0 = 190;
muelle(x1, 36, yl0, { ancho: 13, n: 13 });
linea(x1 - 70, yl0, 400, yl0, { c: C.gris, w: 1.2, dash: '5 5' });
flecha(90, 40, 90, yl0 - 2, { c: C.azul, w: 1.8, head: 10, doble: true });
texto(78, 120, 'l_0', { italic: true, anchor: 'end', c: C.azul });

// muelle con la masa
const x2 = 330, yl = 270;
muelle(x2, 36, yl, { ancho: 13, n: 13 });
caja(x2 - 32, yl, 64, 52, { txt: 'm' });
linea(x2 + 40, yl, 480, yl, { c: C.gris, w: 1.2, dash: '5 5' });
flecha(455, 40, 455, yl - 2, { c: C.azul, w: 1.8, head: 10, doble: true });
texto(467, 160, 'l', { italic: true, anchor: 'start', c: C.azul });
flecha(400, yl0 + 2, 400, yl - 2, { c: C.morado, w: 1.8, head: 9, doble: true });
texto(390, (yl0 + yl) / 2 + 6, 'Δl', { italic: true, anchor: 'end', c: C.morado });

// fuerzas sobre la masa (aplicadas en su centro)
// la fuerza elástica se dibuja a un lado del muelle para que no se confunda con él
flecha(x2 - 24, yl, x2 - 24, yl - 72, { c: C.azul, w: 3, head: 13 });
vecTexto(x2 - 50, yl - 40, 'F_e', { c: C.azul, size: 22 });
flecha(x2, yl + 52, x2, yl + 120, { c: C.rojo, w: 3, head: 13 });
vecTexto(x2 + 24, yl + 112, 'P', { c: C.rojo, size: 22 });

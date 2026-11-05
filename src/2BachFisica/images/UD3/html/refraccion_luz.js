// Refracción de la luz: (a) al pasar a un medio más refringente se acerca a la normal; (b) al pasar a uno menos refringente se aleja.
lienzo(760, 320);
function panel(ox, n1, n2, c1, c2, t) {
    const X = ox + 180, Y = 150, L = 135, i = 40 * Math.PI / 180, r = Math.asin(n1 / n2 * Math.sin(i));
    E(S, 'rect', { x: ox + 20, y: 20, width: 320, height: Y - 20, fill: c1 });
    E(S, 'rect', { x: ox + 20, y: Y, width: 320, height: 130, fill: c2 });
    linea(ox + 20, Y, ox + 340, Y, { w: 2 });
    linea(X, 25, X, 275, { c: C.gris, w: 1.4, dash: '6 5' });
    const I = [X - L * Math.sin(i), Y - L * Math.cos(i)];
    linea(I[0], I[1], X, Y, { c: C.rojo, w: 2.4 }); flecha(I[0], I[1], (I[0] + X) / 2, (I[1] + Y) / 2, { c: C.rojo, w: 2.4 });
    const Rf = [X + L * Math.sin(i), Y - L * Math.cos(i)];
    flecha(X, Y, Rf[0], Rf[1], { c: C.rojo, w: 1.2, dash: '5 4', head: 9 });
    const T = [X + L * Math.sin(r), Y + L * Math.cos(r)];
    flecha(X, Y, T[0], T[1], { c: C.azul, w: 2.4 });
    arco(X, Y, 50, 90, 130, { c: C.rojo, w: 1.6 });
    arco(X, Y, 50, -90, -90 + r * 180 / Math.PI, { c: C.azul, w: 1.6 });
    texto(X - 18, Y - 56, 'î', { italic: true, c: C.rojo });
    texto(X + 14, Y + 68, 'r̂', { italic: true, c: C.azul });
    texto(ox + 30, 44, n1 === 1 ? 'aire (n_1 = 1,00)' : 'vidrio (n_1 = 1,50)', { size: 15, anchor: 'start' });
    texto(ox + 30, 268, n2 === 1 ? 'aire (n_2 = 1,00)' : 'vidrio (n_2 = 1,50)', { size: 15, anchor: 'start' });
    texto(Rf[0] - 4, Rf[1] - 8, 'reflejado', { size: 13, c: C.rojo });
    texto(ox + 180, 308, t, { size: 16 });
}
panel(0, 1, 1.5, '#ffffff', '#e3f2fd', '(a) n_2 > n_1: se acerca a la normal');
panel(390, 1.5, 1, '#e3f2fd', '#ffffff', '(b) n_2 < n_1: se aleja de la normal');

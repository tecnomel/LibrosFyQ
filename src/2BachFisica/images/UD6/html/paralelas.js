// Fuerzas entre corrientes paralelas (vistas en corte): del mismo sentido se atraen; de sentidos opuestos se repelen.
lienzo(720, 240);
function panel(ox, s2, titulo) {
    const A = [ox + 110, 110], B = [ox + 250, 110], cor1 = [[A[0], A[1], 1]];
    [35, 60].forEach(r => E(S, 'circle', { cx: A[0], cy: A[1], r, fill: 'none', stroke: C.morado, 'stroke-width': 1.1, 'stroke-dasharray': '4 4' }));
    // campo de 1 en la posición de 2 (vertical)
    const [bx, by] = campoB(cor1, B[0], B[1]), l = Math.hypot(bx, by);
    flecha(B[0], B[1], B[0] + 45 * bx / l, B[1] + 45 * by / l, { c: C.azul, w: 2 }); texto(B[0] + 10, B[1] + 45 * by / l + (by > 0 ? 14 : -4), 'B_1', { italic: true, c: C.azul, size: 16, anchor: 'start' });
    const dir = s2 > 0 ? -1 : 1;
    flecha(B[0] + dir * 14, B[1], B[0] + dir * 50, B[1], { c: C.rojo, w: 2.6 }); texto(B[0] + dir * 40, B[1] + 28, 'F_{21}', { italic: true, c: C.rojo, size: 16 });
    flecha(A[0] - dir * 14, A[1], A[0] - dir * 50, A[1], { c: C.rojo, w: 2.6 }); texto(A[0] - dir * 40, A[1] + 28, 'F_{12}', { italic: true, c: C.rojo, size: 16 });
    corriente(A[0], A[1], 12, true, { c: C.naranja }); corriente(B[0], B[1], 12, s2 > 0, { c: C.naranja });
    texto(A[0], A[1] - 22, 'I_1', { italic: true, size: 16 }); texto(B[0] - 22, B[1] - 16, 'I_2', { italic: true, size: 16 });
    cota(A[0], 190, B[0], 190, 'd', { dy: -6 });
    texto(ox + 180, 230, titulo, { size: 15 });
}
panel(0, 1, '(a) Mismo sentido: se atraen');
panel(370, -1, '(b) Sentidos opuestos: se repelen');

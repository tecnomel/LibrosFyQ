// Ley de Coulomb: cargas del mismo signo se repelen y de signo contrario se atraen.
lienzo(720, 200);
function par(ox, q2, titulo) {
    const A = [ox + 105, 122], B = [ox + 245, 72];
    linea(A[0], A[1], B[0], B[1], { c: C.gris, w: 1.2, dash: '5 4' });
    const u = [(B[0] - A[0]) / Math.hypot(B[0] - A[0], B[1] - A[1]), (B[1] - A[1]) / Math.hypot(B[0] - A[0], B[1] - A[1])];
    const s = q2 > 0 ? 1 : -1, L = q2 > 0 ? 62 : 44;
    flecha(A[0] - s * u[0] * 18, A[1] - s * u[1] * 18, A[0] - s * u[0] * (18 + L), A[1] - s * u[1] * (18 + L), { c: C.rojo, w: 2.6 });
    flecha(B[0] + s * u[0] * 18, B[1] + s * u[1] * 18, B[0] + s * u[0] * (18 + L), B[1] + s * u[1] * (18 + L), { c: C.rojo, w: 2.6 });
    carga(A[0], A[1], 16, 1); carga(B[0], B[1], 16, q2);
    texto(A[0] - 2, A[1] + 38, 'q_1', { italic: true }); texto(B[0] + 2, B[1] - 26, 'q_2', { italic: true });
    const fa = [A[0] - s * u[0] * (18 + L), A[1] - s * u[1] * (18 + L)], fb = [B[0] + s * u[0] * (18 + L), B[1] + s * u[1] * (18 + L)];
    texto(fa[0] + (s > 0 ? 10 : -14), fa[1] - (s > 0 ? -22 : 12), 'F_{21}', { italic: true, c: C.rojo, size: 18 });
    texto(fb[0] + (s > 0 ? 18 : 4), fb[1] + (s > 0 ? 20 : 26), 'F_{12}', { italic: true, c: C.rojo, size: 18 });
    texto(ox + 160, 190, titulo, { size: 15 });
}
par(0, 1, '(a) Mismo signo: repulsión');
par(380, -1, '(b) Signo contrario: atracción');

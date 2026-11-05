// Ley de la gravitación universal: dos masas se atraen con fuerzas iguales y opuestas dirigidas según la recta que las une.
lienzo(560, 170);
const A = [110, 95], B = [450, 95];
linea(A[0], A[1], B[0], B[1], { c: C.gris, w: 1.2, dash: '5 4' });
bola(A[0], A[1], 34, { fill: '#90a4ae' }); bola(B[0], B[1], 22, { fill: '#b39ddb' });
texto(A[0], A[1] + 7, 'm_1', { italic: true, size: 20 }); texto(B[0], B[1] + 7, 'm_2', { italic: true, size: 18 });
flecha(A[0] + 34, A[1], A[0] + 130, A[1], { c: C.rojo, w: 3 }); texto(A[0] + 104, A[1] - 14, 'F_{21}', { italic: true, c: C.rojo });
flecha(B[0] - 22, B[1], B[0] - 118, B[1], { c: C.rojo, w: 3 }); texto(B[0] - 96, B[1] - 14, 'F_{12}', { italic: true, c: C.rojo });
cota(A[0], 160, B[0], 160, 'r', { dy: -6 });

// Microscopio: el objetivo da una imagen real, invertida y mayor (y'1) que, situada dentro de la distancia focal del ocular,
// actúa como objeto de éste; el ocular da la imagen final y'2, virtual y mucho mayor.
lienzo(780, 350);
const Y = 105, X1 = 220, X2 = 440;
const r1 = sistema({ tipo: 'convergente', X0: X1, Y0: Y, f: 40, s: -55, y: 14, h: 50, caja: [0, 0, 780, 350], hastaX: X2, etiquetas: { F: 'F_1', Fp: "F_1'" } });
sistema({ tipo: 'convergente', X0: X2, Y0: Y, f: 90, s: r1.Bp[0] - X2, y: Y - r1.Bp[1], h: 70, caja: [0, 0, 780, 350], sinObjeto: true, etiquetas: { F: 'F_2', Fp: "F_2'" } });
texto(X1, 26, 'objetivo', { size: 15 }); texto(X2, 26, 'ocular', { size: 15 });
texto(r1.B[0] - 6, r1.B[1] - 4, 'y', { italic: true, anchor: 'end', size: 17, c: C.verde });
texto(r1.Bp[0] + 8, r1.Bp[1] + 4, "y'_1", { italic: true, anchor: 'start', size: 17, c: C.naranja, halo: true });
texto(70, 330, "imagen final y'_2", { size: 15, c: C.naranja, halo: true, anchor: 'start' });

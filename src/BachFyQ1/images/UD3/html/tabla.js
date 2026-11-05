// Datos de la tabla periódica para las figuras de la Unidad 3.
// z = número atómico, s = símbolo, p = periodo, g = grupo, b = bloque, f = posición (1-14) en la fila de lantánidos/actínidos
const SIMB = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
    'Md', 'No', 'Lr', 'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'];
const ELEMENTOS = (() => {
    const L = [];
    const starts = [[1, 1], [3, 2], [11, 3], [19, 4], [37, 5], [55, 6], [87, 7]];
    SIMB.forEach((s, i) => {
        const z = i + 1;
        let p = 0; starts.forEach(([z0, pp]) => { if (z >= z0) p = pp; });
        const z0 = starts[p - 1][0];
        let g, b, f;
        if (p === 1) { g = z === 1 ? 1 : 18; b = z === 1 ? 's' : 'p'; if (z === 2) b = 's'; }
        else if (p <= 3) { const k = z - z0; g = k < 2 ? k + 1 : k + 11; b = k < 2 ? 's' : 'p'; }
        else if (p <= 5) { const k = z - z0; g = k + 1; b = k < 2 ? 's' : (k < 12 ? 'd' : 'p'); }
        else {
            const k = z - z0;                              // 0 Cs/Fr, 1 Ba/Ra, 2-15 La..Yb / Ac..No, 16 Lu/Lr ...
            if (k < 2) { g = k + 1; b = 's'; }
            else if (k < 16) { b = 'f'; f = k - 1; }
            else { g = k - 13; b = g <= 12 ? 'd' : 'p'; }
        }
        L.push({ z, s, p, g, b, f });
    });
    return L;
})();

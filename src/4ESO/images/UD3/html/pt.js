// Datos y dibujo de esquemas de la tabla periódica (Unidad 2).
// Criterio del libro: La y Ac ocupan el grupo 3 (bloque d); las filas f son Ce–Lu y Th–Lr.
const SYM = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
    'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr',
    'Rb', 'Sr', 'Y', 'Zr', 'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn', 'Sb', 'Te', 'I', 'Xe',
    'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
    'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg', 'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn',
    'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
    'Rf', 'Db', 'Sg', 'Bh', 'Hs', 'Mt', 'Ds', 'Rg', 'Cn', 'Nh', 'Fl', 'Mc', 'Lv', 'Ts', 'Og'];

const SEMIMETALS = new Set([5, 14, 32, 33, 51, 52, 84, 85]);
const NONMETALS = new Set([1, 6, 7, 8, 9, 15, 16, 17, 34, 35, 53]);
const NOBLE = new Set([2, 10, 18, 36, 54, 86, 118]);

// Devuelve {period, group, frow}: frow = 1 (lantanoides) o 2 (actinoides) para el bloque f
function pos(Z) {
    if (Z === 1) return { period: 1, group: 1 };
    if (Z === 2) return { period: 1, group: 18 };
    const starts = [[3, 2], [11, 3], [19, 4], [37, 5], [55, 6], [87, 7]];
    let period = 2, start = 3;
    for (const [s, p] of starts) if (Z >= s) { start = s; period = p; }
    const k = Z - start;               // posición dentro del período
    if (period <= 3) return { period, group: k < 2 ? k + 1 : k + 11 };
    if (period <= 5) return { period, group: k + 1 };
    // períodos 6 y 7: 2 (s) + 1 (La/Ac) + 14 (f) + 15 (resto)
    if (k < 3) return { period, group: k + 1 };
    if (k < 17) return { period, group: null, frow: period - 5, fcol: k - 3 };
    return { period, group: k - 13 };
}

function block(Z) {
    const p = pos(Z);
    if (p.frow) return 'f';
    if (Z === 2 || p.group <= 2) return 's';
    if (p.group >= 13) return 'p';
    return 'd';
}

function kind(Z) {
    if (NOBLE.has(Z)) return 'noble';
    if (NONMETALS.has(Z)) return 'nonmetal';
    if (SEMIMETALS.has(Z)) return 'semimetal';
    return 'metal';
}

// Dibuja la tabla. opts: {x0, y0, c (lado celda), gap, fill(Z) -> color, text(Z) -> texto|null,
//                         groupNums, periodNums, fGap}
function drawPT(add, o) {
    const c = o.c || 40, g = o.gap ?? 2, x0 = o.x0 || 30, y0 = o.y0 || 30;
    const fy = y0 + 7 * (c + g) + (o.fGap ?? 14);
    const cells = {};
    for (let Z = 1; Z <= 118; Z++) {
        const p = pos(Z);
        let x, y;
        if (p.frow) { x = x0 + (3 + p.fcol) * (c + g); y = fy + (p.frow - 1) * (c + g); }
        else { x = x0 + (p.group - 1) * (c + g); y = y0 + (p.period - 1) * (c + g); }
        cells[Z] = { x, y };
        add('rect', { x, y, width: c, height: c, rx: 3, fill: o.fill ? o.fill(Z) : '#fff', stroke: o.stroke || '#5D6D7E', 'stroke-width': 1 });
        const t = o.text ? o.text(Z) : SYM[Z];
        if (t) add('text', { x: x + c / 2, y: y + c / 2 + c * 0.14, 'text-anchor': 'middle', 'font-size': c * 0.38, 'font-weight': 700, fill: o.textColor || '#23373B' }, t);
    }
    if (o.groupNums !== false) for (let gN = 1; gN <= 18; gN++) {
        const row = gN === 1 || gN === 18 ? 0 : (gN === 2 || gN >= 13 ? 1 : 3);
        add('text', { x: x0 + (gN - 1) * (c + g) + c / 2, y: y0 + row * (c + g) - 6, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#000070' }, gN);
    }
    if (o.periodNums !== false) for (let p = 1; p <= 7; p++)
        add('text', { x: x0 - 12, y: y0 + (p - 1) * (c + g) + c / 2 + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#000070' }, p);
    if (o.fLabels !== false) ['Lantanoides', 'Actinoides'].forEach((t, i) =>
        add('text', { x: x0 + 3 * (c + g) - 8, y: fy + i * (c + g) + c / 2 + 5, 'text-anchor': 'end', 'font-size': 13, 'font-weight': 700, fill: '#525252' }, t));
    // ajusta el tamaño del <svg> al dibujo
    const svg = add('g', {}).ownerSVGElement;
    svg.setAttribute('width', x0 + 18 * (c + g) + 6);
    svg.setAttribute('height', fy + 2 * (c + g) + (o.extraBottom || 6));
    return { cells, fy, width: 18 * (c + g), height: fy + 2 * (c + g) - y0 };
}

// Leyenda en HTML: items = [[color, texto], ...]
function legend(id, items) {
    document.getElementById(id).innerHTML = items.map(([col, t]) =>
        `<div class="li"><span style="background:${col}"></span>${t}</div>`).join('');
}

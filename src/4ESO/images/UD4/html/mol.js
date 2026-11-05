// Modelos moleculares 3D de bolas y varillas para la Unidad 4 (requiere fig.js).
//
// Una molécula se describe con sus átomos «pesados» (C, O, N, Cl…) y sus enlaces; los hidrógenos se
// añaden solos con la geometría adecuada a la hibridación de cada átomo:
//   sp3 → tetraédrica (109,5°), sp2 → plana (120°, en el plano XY), sp → lineal (180°).
//
//   const m = molecule([
//       { el: 'C', p: [0, 0, 0], hyb: 'sp3', h: 3 },
//       { el: 'C', p: [1.25, 0.87, 0], hyb: 'sp3', h: 3 },
//   ], [[0, 1, 1]]);            // enlaces: [índice1, índice2, orden]
//   drawMolecule(add, m, cx, cy, { scale: 40, yaw: 30, pitch: 15 });

const CPK = { H: '#F4F6F6', C: '#3B3F42', N: '#2E86C1', O: '#E74C3C', Cl: '#82E0AA' };
const RAD = { H: 0.30, C: 0.42, N: 0.42, O: 0.42, Cl: 0.50 };

const V = {
    add: (a, b) => a.map((x, i) => x + b[i]), sub: (a, b) => a.map((x, i) => x - b[i]),
    mul: (a, k) => a.map(x => x * k), dot: (a, b) => a.reduce((s, x, i) => s + x * b[i], 0),
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    norm: a => { const L = Math.hypot(...a) || 1; return a.map(x => x / L); },
};

// Direcciones libres de un átomo dados los vectores unitarios hacia sus vecinos
function freeDirs(nb, hyb, n, o = {}) {
    const T = 109.47 * Math.PI / 180, Z = [0, 0, 1];
    if (hyb === 'sp') return nb.length ? [V.mul(nb[0], -1)] : [[1, 0, 0], [-1, 0, 0]];
    if (hyb === 'sp2') {
        if (nb.length >= 2) return [V.norm(V.mul(V.add(nb[0], nb[1]), -1))];
        // un vecino: dos direcciones a ±120° en el plano XY
        const a = nb[0], p = V.norm(V.cross(Z, a));
        const c = Math.cos(2 * Math.PI / 3), s = Math.sin(2 * Math.PI / 3);
        return [V.add(V.mul(a, c), V.mul(p, s)), V.add(V.mul(a, c), V.mul(p, -s))];
    }
    // sp3
    if (nb.length === 0) { const k = 1 / Math.sqrt(3); return [[k, k, k], [k, -k, -k], [-k, k, -k], [-k, -k, k]]; }
    if (nb.length === 3) return [V.norm(V.mul(V.add(V.add(nb[0], nb[1]), nb[2]), -1))];
    if (nb.length === 2) {
        const d = V.norm(V.mul(V.add(nb[0], nb[1]), -1)), q = V.norm(V.cross(nb[0], nb[1])), h = T / 2;
        const both = [V.add(V.mul(d, Math.cos(h)), V.mul(q, Math.sin(h))), V.add(V.mul(d, Math.cos(h)), V.mul(q, -Math.sin(h)))];
        return n === 1 ? [o.inPlane ? d : both[0]] : both;
    }
    // un vecino: tres direcciones a 109,5°; la primera en el plano XY (giro phi en grados)
    const a = nb[0];
    let p = V.cross(Z, a); if (Math.hypot(...p) < 1e-6) p = [1, 0, 0]; p = V.norm(p);
    const q = V.norm(V.cross(a, p)), phi0 = (o.phi ?? 0) * Math.PI / 180;
    return [0, 1, 2].map(k => {
        const f = phi0 + k * 2 * Math.PI / 3;
        return V.add(V.mul(a, Math.cos(T)), V.mul(V.add(V.mul(p, Math.cos(f)), V.mul(q, Math.sin(f))), Math.sin(T)));
    });
}

function molecule(heavy, bonds) {
    const atoms = heavy.map(a => ({ el: a.el, p: a.p.slice() }));
    const bl = bonds.map(b => b.slice());
    heavy.forEach((a, i) => {
        if (!a.h) return;
        const nb = bl.filter(b => b[0] === i || b[1] === i).map(b => V.norm(V.sub(atoms[b[0] === i ? b[1] : b[0]].p, a.p)));
        const dirs = freeDirs(nb, a.hyb || 'sp3', a.h, a).slice(0, a.h);
        dirs.forEach(d => { atoms.push({ el: 'H', p: V.add(a.p, V.mul(d, 1.0)) }); bl.push([i, atoms.length - 1, 1]); });
    });
    // centrar
    const c = V.mul(atoms.reduce((s, a) => V.add(s, a.p), [0, 0, 0]), 1 / atoms.length);
    atoms.forEach(a => a.p = V.sub(a.p, c));
    return { atoms, bonds: bl };
}

// Cadena en zigzag de n carbonos (plano XY) con distancia de enlace d
function zigzag(n, d = 1.5) {
    const ang = 109.47 / 2 * Math.PI / 180;
    return Array.from({ length: n }, (_, i) => [i * d * Math.sin(ang), (i % 2) * d * Math.cos(ang), 0]);
}

function drawMolecule(add, m, cx, cy, o = {}) {
    const s = o.scale ?? 40, yaw = (o.yaw ?? 25) * Math.PI / 180, pitch = (o.pitch ?? 15) * Math.PI / 180;
    const P = m.atoms.map(a => {
        let [x, y, z] = a.p;
        [x, z] = [x * Math.cos(yaw) + z * Math.sin(yaw), -x * Math.sin(yaw) + z * Math.cos(yaw)];
        [y, z] = [y * Math.cos(pitch) - z * Math.sin(pitch), y * Math.sin(pitch) + z * Math.cos(pitch)];
        return [cx + x * s, cy - y * s, z];
    });
    const items = [];
    m.bonds.forEach(([i, j, ord]) => items.push({ z: (P[i][2] + P[j][2]) / 2 - 0.05, draw: () => {
        const [x1, y1] = P[i], [x2, y2] = P[j], L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
        const g = s * 0.11, offs = ord === 1 ? [0] : ord === 2 ? [-g, g] : [-1.6 * g, 0, 1.6 * g];
        offs.forEach(k => {
            add('line', { x1: x1 + nx * k, y1: y1 + ny * k, x2: x2 + nx * k, y2: y2 + ny * k, stroke: '#5D6D7E', 'stroke-width': s * 0.13 + 1.5, 'stroke-linecap': 'round' });
            add('line', { x1: x1 + nx * k, y1: y1 + ny * k, x2: x2 + nx * k, y2: y2 + ny * k, stroke: '#BFC9CA', 'stroke-width': s * 0.13 - 1.5, 'stroke-linecap': 'round' });
        });
    } }));
    m.atoms.forEach((a, i) => items.push({ z: P[i][2], draw: () => {
        const r = RAD[a.el] * s;
        bead(add, P[i][0], P[i][1], r, CPK[a.el] || '#AAB7B8');
        if (o.labels && a.el !== 'H') label(add, P[i][0], P[i][1] + r * 0.38, a.el, { 'font-size': r * 1.0, fill: '#fff' });
    } }));
    items.sort((a, b) => a.z - b.z).forEach(it => it.draw());
}

// Moléculas que se usan en varias figuras ---------------------------------------------------------
const MOL = {
    metano: () => molecule([{ el: 'C', p: [0, 0, 0], h: 4 }], []),
    clorometano: () => molecule([{ el: 'C', p: [0, 0, 0], h: 3, phi: 90 }, { el: 'Cl', p: [0, -1.75, 0] }], [[0, 1, 1]]),
    alcano: n => { const z = zigzag(n); return molecule(z.map((p, i) => ({ el: 'C', p, h: i === 0 || i === n - 1 ? 3 : 2, phi: 180 })), z.slice(1).map((_, i) => [i, i + 1, 1])); },
    etanol: () => { const z = zigzag(3, 1.45); return molecule([{ el: 'C', p: z[0], h: 3, phi: 180 }, { el: 'C', p: z[1], h: 2 }, { el: 'O', p: z[2], h: 1, phi: 180 }], [[0, 1, 1], [1, 2, 1]]); },
    eteno: () => molecule([{ el: 'C', p: [-0.67, 0, 0], hyb: 'sp2', h: 2 }, { el: 'C', p: [0.67, 0, 0], hyb: 'sp2', h: 2 }], [[0, 1, 2]]),
    etino: () => molecule([{ el: 'C', p: [-0.6, 0, 0], hyb: 'sp', h: 1 }, { el: 'C', p: [0.6, 0, 0], hyb: 'sp', h: 1 }], [[0, 1, 3]]),
};

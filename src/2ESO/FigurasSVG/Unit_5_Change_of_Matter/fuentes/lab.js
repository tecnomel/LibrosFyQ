// Shared lab drawings (SVG strings) for the step-by-step separation figures.
// Every panel is drawn in a 260 x 210 box.
const C = {
    line: '#5D6D7E', water: '#AED6F1', water2: '#D6EAF8', oil: '#F7DC6F', sand: '#E59866', sandDark: '#A04000',
    mud: '#A9927D', iron: '#2C3E50', red: '#C0392B', green: '#1E8449', blue: '#2471A3', salt: '#FFFFFF', wood: '#D4AC6E'
};
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" text-anchor="${o.a || 'middle'}" font-size="${o.fs || 15}" font-weight="${o.fw || 700}" fill="${o.c || '#23373B'}">${s}</text>`;
const arrowD = (x1, y1, x2, y2, c = '#525252') => {
    const a = Math.atan2(y2 - y1, x2 - x1), h = 10;
    const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)], p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="3"/><polygon points="${x2},${y2} ${p1} ${p2}" fill="${c}"/>`;
};
// open beaker: bottom-left (x, y) means top-left corner; layers from the bottom
function beaker(x, y, w, h, layers = [], extra = '') {
    let s = '', yb = y + h;
    layers.forEach(([lh, col]) => { s += `<rect x="${x + 2}" y="${yb - lh}" width="${w - 4}" height="${lh - 2}" fill="${col}"/>`; yb -= lh; });
    return s + extra + `<path d="M${x} ${y} L${x} ${y + h} L${x + w} ${y + h} L${x + w} ${y}" fill="none" stroke="${C.line}" stroke-width="4"/>`;
}
const dots = (pts, r, col, stroke) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"${stroke ? ` stroke="${stroke}" stroke-width="1.5"` : ''}/>`).join('');
const rnd = (n, x0, x1, y0, y1, seed = 1) => { const a = []; let s = seed; for (let i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; const r1 = s / 233280; s = (s * 9301 + 49297) % 233280; const r2 = s / 233280; a.push([x0 + r1 * (x1 - x0), y0 + r2 * (y1 - y0)]); } return a; };
const filings = (pts, col = C.iron) => pts.map(([x, y], i) => `<line x1="${x - 5}" y1="${y + (i % 2 ? 3 : -3)}" x2="${x + 5}" y2="${y + (i % 2 ? -3 : 3)}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`).join('');
const chips = (pts) => pts.map(([x, y], i) => `<rect x="${x - 7}" y="${y - 3}" width="14" height="6" rx="2" fill="${C.wood}" transform="rotate(${(i * 37) % 90 - 45} ${x} ${y})"/>`).join('');
function magnet(x, y, s = 1) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L0 50 A30 30 0 0 0 60 50 L60 0 L42 0 L42 50 A12 12 0 0 1 18 50 L18 0 Z" fill="${C.red}"/><rect x="0" y="0" width="18" height="14" fill="#D5D8DC"/><rect x="42" y="0" width="18" height="14" fill="#D5D8DC"/></g>`;
}
function funnel(x, y, solids = '') { // x = centre, y = top
    return `<path d="M${x - 45} ${y} L${x + 45} ${y} L${x + 9} ${y + 65} L${x + 9} ${y + 105} L${x - 9} ${y + 105} L${x - 9} ${y + 65} Z" fill="#FDFEFE" stroke="${C.line}" stroke-width="4"/>
            <path d="M${x - 37} ${y + 5} L${x + 37} ${y + 5} L${x + 3} ${y + 60} L${x - 3} ${y + 60} Z" fill="#FBEEE6" stroke="#B9770E" stroke-width="2" stroke-dasharray="5 3"/>${solids}`;
}
let _clip = 0;
function sepFunnel(x, y, top, bottom, topH, botH, open = false) { // x centre, y top; liquid heights measured up from the tap (y + 128)
    const tap = open ? `<rect x="${x - 4}" y="${y + 120}" width="8" height="18" fill="${C.green}"/>` : `<rect x="${x - 16}" y="${y + 124}" width="32" height="9" fill="${C.red}"/>`;
    const body = `M${x - 40} ${y} L${x + 40} ${y} L${x + 40} ${y + 60} L${x + 8} ${y + 112} L${x + 8} ${y + 145} L${x - 8} ${y + 145} L${x - 8} ${y + 112} L${x - 40} ${y + 60} Z`;
    const id = 'sf' + (_clip++), base = y + 128;
    let fill = '';
    if (botH) fill += `<rect x="${x - 45}" y="${base - botH}" width="90" height="${botH + (open ? 20 : 0)}" fill="${bottom}"/>`;
    if (topH) fill += `<rect x="${x - 45}" y="${base - botH - topH}" width="90" height="${topH + (botH ? 0 : 0)}" fill="${top}"/>`;
    return `<clipPath id="${id}"><path d="${body}"/></clipPath><g clip-path="url(#${id})">${fill}</g><path d="${body}" fill="none" stroke="${C.line}" stroke-width="4"/>${tap}`;
}
function burner(x, y) { return `<rect x="${x - 10}" y="${y}" width="20" height="30" fill="#7F8C8D"/><rect x="${x - 20}" y="${y + 30}" width="40" height="8" fill="#7F8C8D"/><path d="M${x} ${y - 30} Q${x + 14} ${y - 10} ${x} ${y} Q${x - 14} ${y - 10} ${x} ${y - 30}" fill="#F39C12"/><path d="M${x} ${y - 18} Q${x + 6} ${y - 6} ${x} ${y} Q${x - 6} ${y - 6} ${x} ${y - 18}" fill="#5DADE2"/>`; }
function dish(x, y, w, liquid, extra = '') { // x centre, y top
    return `<path d="M${x - w / 2} ${y} Q${x} ${y + 45} ${x + w / 2} ${y}" fill="${liquid || 'none'}" stroke="${C.line}" stroke-width="4"/>${extra}`;
}
function tripod(x, y) { return `<line x1="${x - 50}" y1="${y}" x2="${x + 50}" y2="${y}" stroke="#7F8C8D" stroke-width="5"/><line x1="${x - 40}" y1="${y}" x2="${x - 50}" y2="${y + 70}" stroke="#7F8C8D" stroke-width="4"/><line x1="${x + 40}" y1="${y}" x2="${x + 50}" y2="${y + 70}" stroke="#7F8C8D" stroke-width="4"/>`; }
function tube(x, y, angle, layers) { // a centrifuge tube, layers from the bottom [h, col]
    let s = layers.length ? `<path d="M2 100 Q15 121 28 100 Z" fill="${layers[0][1]}"/>` : '', yb = 100;
    layers.forEach(([h, col]) => { s += `<rect x="2" y="${yb - h}" width="26" height="${h}" fill="${col}"/>`; yb -= h; });
    return `<g transform="translate(${x} ${y}) rotate(${angle})">${s}<path d="M0 0 L0 100 Q15 122 30 100 L30 0" fill="none" stroke="${C.line}" stroke-width="3"/></g>`;
}
const vapour = (x, y) => [0, 1, 2].map(i => `<path d="M${x + i * 26} ${y} q8 -12 0 -24 q-8 -12 0 -24" stroke="#5DADE2" stroke-width="3" fill="none"/>`).join('');
const tag = (x, y, kind, s) => {
    const col = kind === 'keep' ? C.green : kind === 'out' ? C.red : C.blue;
    const w = 12 + s.length * 7.6;
    return `<rect x="${x - w / 2}" y="${y - 15}" width="${w}" height="22" rx="6" fill="${col}"/>` + T(x, y + 1, s, { fs: 13, c: '#fff' });
};

// Builds a figure: title, the property used, and a row of panels [svgInner, caption]
function buildSteps(title, property, mixture, panels, label = 'Property used') {
    document.querySelector('h1').innerHTML = title;
    document.getElementById('prop').innerHTML = `<b>Mixture:</b> ${mixture} &nbsp;·&nbsp; <b>${label}:</b> ${property}`;
    const row = document.getElementById('row');
    panels.forEach(([svg, cap], i) => {
        row.insertAdjacentHTML('beforeend', `<div class="panel"><div class="n">${i + 1}</div><svg width="260" height="210" viewBox="0 0 260 210">${svg}</svg><div class="cap">${cap}</div></div>`);
        if (i < panels.length - 1) row.insertAdjacentHTML('beforeend', '<div class="arrow">➜</div>');
    });
}

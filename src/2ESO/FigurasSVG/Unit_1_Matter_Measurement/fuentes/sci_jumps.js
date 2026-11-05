// Draws the "jumping decimal comma" diagrams used in the scientific-notation figures.
//   el     : container element
//   digits : the digits in a row, e.g. "45000"
//   from   : initial position of the comma (number of digits to its left)
//   to     : final position of the comma
//   added  : indices of the zeros we have to add (drawn dashed and faded)
//   faded  : indices of digits that disappear at the end (leading zeros)
//   colour : colour of the arcs
function drawJumps(el, { digits, from, to, added = [], faded = [], colour = "#F36619" }) {
    const W = 52, H = 64, top = 58, pad = 30;
    const n = digits.length;
    const width = pad * 2 + n * W, height = top + H + 16;
    const x = p => pad + p * W;           // x of the gap after p digits
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", width); svg.setAttribute("height", height);
    const mk = (tag, attrs, text) => {
        const e = document.createElementNS(ns, tag);
        for (const k in attrs) e.setAttribute(k, attrs[k]);
        if (text !== undefined) e.textContent = text;
        svg.appendChild(e); return e;
    };
    const defs = mk("defs", {});
    const marker = document.createElementNS(ns, "marker");
    for (const [k, v] of Object.entries({ id: "ah" + colour.slice(1), markerWidth: 16, markerHeight: 16, refX: 8, refY: 5, orient: "auto", markerUnits: "userSpaceOnUse", viewBox: "0 0 10 10" }))
        marker.setAttribute(k, v);
    const tip = document.createElementNS(ns, "path");
    tip.setAttribute("d", "M0,0 L10,5 L0,10 z"); tip.setAttribute("fill", colour);
    marker.appendChild(tip); defs.appendChild(marker);

    for (let i = 0; i < n; i++) {
        const isAdded = added.includes(i), isFaded = faded.includes(i);
        mk("rect", { x: x(i) + 4, y: top, width: W - 8, height: H, rx: 8,
            fill: isAdded ? "#FFFFFF" : (isFaded ? "#F2F2F2" : "#E3E6F7"),
            stroke: isAdded ? "#1E8449" : (isFaded ? "#B0B0B0" : "#000070"),
            "stroke-width": 3, "stroke-dasharray": isAdded ? "6 4" : "none" });
        mk("text", { x: x(i) + W / 2, y: top + 46, "text-anchor": "middle", "font-size": 38, "font-weight": 800,
            fill: isAdded ? "#1E8449" : (isFaded ? "#A0A0A0" : "#23373B"),
            "font-family": "Segoe UI, Arial, sans-serif" }, digits[i]);
    }
    // old comma (faded) and new comma (bold red)
    if (from !== to)
        mk("text", { x: x(from), y: top + H + 10, "text-anchor": "middle", "font-size": 44, "font-weight": 800,
            fill: "#C0392B", opacity: 0.3, "font-family": "Segoe UI, Arial, sans-serif" }, ",");
    mk("text", { x: x(to), y: top + H + 10, "text-anchor": "middle", "font-size": 50, "font-weight": 900,
        fill: "#C0392B", "font-family": "Segoe UI, Arial, sans-serif" }, ",");
    // jumps
    const dir = to > from ? 1 : -1;
    for (let k = 0, p = from; p !== to; p += dir, k++) {
        const x1 = x(p) + dir * 3, x2 = x(p + dir) - dir * 3;
        mk("path", { d: `M${x1},${top - 4} Q${(x1 + x2) / 2},${top - 44} ${x2},${top - 4}`, fill: "none",
            stroke: colour, "stroke-width": 3.5, "marker-end": `url(#ah${colour.slice(1)})` });
        mk("text", { x: (x1 + x2) / 2, y: top - 30, "text-anchor": "middle", "font-size": 18, "font-weight": 800,
            fill: colour, "font-family": "Segoe UI, Arial, sans-serif" }, k + 1);
    }
    el.appendChild(svg);
}

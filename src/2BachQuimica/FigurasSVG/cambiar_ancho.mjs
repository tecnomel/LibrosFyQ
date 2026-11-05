// Cambia el ancho de una figura nueva ya insertada en los .tex (y en mapa_figuras.json).
// Uso: node cambiar_ancho.mjs <parte del nombre del pdf> <nuevo ancho>
//   p. ej.  node cambiar_ancho.mjs UD5_02_orden_cero 0.45
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(fileURLToPath(import.meta.url));
const [patron, ancho] = process.argv.slice(2);
if (!patron || !ancho) { console.error("Uso: node cambiar_ancho.mjs <nombre> <ancho>"); process.exit(1); }

const re = new RegExp(String.raw`\\includegraphics\[width=[0-9.]+\\linewidth\]\{(FigurasSVG/[^}]*${patron}[^}]*)\}`, "g");
for (const f of readdirSync(join(RAIZ, "..")).filter(f => f.endsWith(".tex"))) {
    const ruta = join(RAIZ, "..", f);
    const s = readFileSync(ruta, "utf8");
    let n = 0;
    const s2 = s.replace(re, (_, pdf) => { n++; return `\\includegraphics[width=${ancho}\\linewidth]{${pdf}}`; });
    if (n) { writeFileSync(ruta, s2, "utf8"); console.log(`  ${f}: ${n}`); }
}
const mapa = JSON.parse(readFileSync(join(RAIZ, "mapa_figuras.json"), "utf8"));
for (const v of Object.values(mapa)) if (v.pdf.includes(patron)) v.ancho = ancho;
writeFileSync(join(RAIZ, "mapa_figuras.json"), JSON.stringify(mapa, null, 2) + "\n");

// Cambia el ancho de una figura ya insertada en los .tex.
// Uso: node cambiar_ancho.mjs <parte del nombre del pdf> <nuevo ancho>
//   p. ej.  node cambiar_ancho.mjs boyle_law 0.8     -> width=0.8\textwidth
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(fileURLToPath(import.meta.url));
const [patron, ancho] = process.argv.slice(2);
if (!patron || !ancho) { console.error("Uso: node cambiar_ancho.mjs <nombre> <ancho>"); process.exit(1); }

const re = new RegExp(String.raw`\includegraphics\[width=[0-9.]*\textwidth\]\{(FigurasSVG/[^}]*${patron}[^}]*)\}`, "g");
for (const f of readdirSync(join(RAIZ, "..")).filter(f => f.endsWith(".tex"))) {
    const ruta = join(RAIZ, "..", f);
    const s = readFileSync(ruta, "utf8");
    let n = 0;
    const s2 = s.replace(re, (_, pdf) => { n++; return `\includegraphics[width=${ancho}\textwidth]{${pdf}}`; });
    if (n) { writeFileSync(ruta, s2, "utf8"); console.log(`  ${f}: ${n}`); }
}

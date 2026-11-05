// Sustituye en los .tex del libro las imágenes PNG (Unit_x/nombre) por los PDF vectoriales generados.
// La línea original se COMENTA (no se borra) y debajo se añade la misma línea con la imagen nueva,
// conservando las opciones de \includegraphics (anchura), el caption, el label, etc.
//
//   % [FIGURA ORIGINAL] \includegraphics[width=\textwidth]{Unit_2/boyle_law}
//   \includegraphics[width=\textwidth]{FigurasSVG/Unit_2_State_of_Matter/pdf/boyle_law.pdf}
//
// La carpeta de cada unidad se busca por su número (Unit_2 -> Unit_2_State_of_Matter).
// Solo se sustituyen las imágenes que tienen ya su PDF en Unit_x_.../pdf/.
//
// Uso (desde esta carpeta):  node aplicar_tex.mjs            -> aplica en todos los .tex
//                            node aplicar_tex.mjs --prueba   -> solo muestra lo que haría
// Es idempotente: si la imagen nueva ya está puesta, no vuelve a añadirla.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(fileURLToPath(import.meta.url));
const LIBRO = join(RAIZ, "..");
const prueba = process.argv.includes("--prueba");

const MARCA = "% [FIGURA ORIGINAL] ";
const reImg = /\\includegraphics\s*(\[[^\]]*\])?\s*\{\s*Unit_(\d)\/([^}.\s]+)(\.png)?\s*\}/g;

// Unit_2 -> "Unit_2_State_of_Matter"
const carpetas = new Map(readdirSync(RAIZ, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^Unit_\d_/.test(d.name))
    .map(d => [d.name[5], d.name]));

function nuevaRuta(num, nombre) {
    const carpeta = carpetas.get(num);
    if (!carpeta || !existsSync(join(RAIZ, carpeta, "pdf", `${nombre}.pdf`))) return null;
    return `FigurasSVG/${carpeta}/pdf/${nombre}.pdf`;
}

let total = 0;
const faltan = [];
for (const fichero of readdirSync(LIBRO).filter(f => f.endsWith(".tex"))) {
    const ruta = join(LIBRO, fichero);
    const original = readFileSync(ruta, "utf8");
    const nl = original.includes("\r\n") ? "\r\n" : "\n";
    const salida = [];
    let cambios = 0;

    for (const linea of original.split(/\r?\n/)) {
        if (/^\s*%/.test(linea) || !linea.includes("\\includegraphics")) { salida.push(linea); continue; }
        let tocada = false;
        const nueva = linea.replace(reImg, (todo, opts, num, nombre) => {
            const r = nuevaRuta(num, nombre);
            if (!r) { faltan.push(`${fichero}: Unit_${num}/${nombre}`); return todo; }
            tocada = true;
            return `\\includegraphics${opts || ""}{${r}}`;
        });
        if (!tocada) { salida.push(linea); continue; }
        const sangria = linea.match(/^\s*/)[0];
        salida.push(sangria + MARCA + linea.trimStart());
        salida.push(nueva);
        cambios++;
    }
    if (cambios) {
        total += cambios;
        console.log(`  ${fichero}: ${cambios} imagen(es) sustituida(s)`);
        if (!prueba) writeFileSync(ruta, salida.join(nl), "utf8");
    }
}
for (const f of faltan) console.log(`  ! sin PDF: ${f}`);
console.log(`\n${total} sustitución(es)${prueba ? " (modo prueba, no se ha escrito nada)" : ""}.`);

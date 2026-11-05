// Sustituye en los .tex del libro las imágenes originales por las nuevas (PDF generados).
// La línea original se COMENTA (no se borra) y debajo se añade la misma línea con la imagen nueva,
// de modo que caption, label y el resto del entorno se conservan.
//
// La correspondencia imagen original -> figura nueva está en mapa_figuras.json:
//   "ruta/original/tal/como/aparece/en/el/tex": { "pdf": "UD3_Enlace_Quimico/pdf/UD3_01_x.pdf", "ancho": "0.6" }
//
// Uso (desde esta carpeta):  node aplicar_tex.mjs            -> aplica en todos los .tex
//                            node aplicar_tex.mjs --prueba   -> solo muestra lo que haría
// Es idempotente: si la imagen nueva ya está puesta, no vuelve a añadirla.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(fileURLToPath(import.meta.url));
const LIBRO = join(RAIZ, "..");
const prueba = process.argv.includes("--prueba");
const mapa = JSON.parse(readFileSync(join(RAIZ, "mapa_figuras.json"), "utf8"));

const MARCA = "% [FIGURA ORIGINAL] ";
const reImg = /\\includegraphics\s*(\[[^\]]*\])?\s*\{([^}]*)\}/g;
const sinExt = r => r.replace(/\.(png|jpe?g|pdf|eps)$/i, "");

// Normaliza las claves del mapa (sin extensión) para que coincidan con o sin ella
const claves = new Map(Object.entries(mapa).map(([k, v]) => [sinExt(k), v]));

let total = 0;
for (const fichero of readdirSync(LIBRO).filter(f => f.endsWith(".tex"))) {
    const ruta = join(LIBRO, fichero);
    const original = readFileSync(ruta, "utf8");
    const nl = original.includes("\r\n") ? "\r\n" : "\n";
    const lineas = original.split(/\r?\n/);
    const salida = [];
    let cambios = 0;

    for (let i = 0; i < lineas.length; i++) {
        let linea = lineas[i];
        if (/^\s*%/.test(linea) || !linea.includes("\\includegraphics")) { salida.push(linea); continue; }

        // \includegraphics[...]{  partido en dos líneas: se unen para poder sustituirlo
        if (/\\includegraphics\s*(\[[^\]]*\])?\s*\{\s*$/.test(linea) && i + 1 < lineas.length) {
            const unida = linea.trimEnd() + lineas[i + 1].trim();
            if ([...unida.matchAll(new RegExp(reImg.source, "g"))].some(m => claves.has(sinExt(m[2].trim())))) {
                const sangria = linea.match(/^\s*/)[0];
                salida.push(sangria + MARCA + linea.trimStart());
                salida.push(sangria + MARCA + lineas[i + 1].trimStart());
                linea = unida;
                i++;
                const nueva = linea.replace(reImg, (todo, opts, rutaImg) => {
                    const f = claves.get(sinExt(rutaImg.trim()));
                    return f ? `\\includegraphics[width=${f.ancho}\\linewidth]{FigurasSVG/${f.pdf}}` : todo;
                });
                salida.push(nueva);
                cambios++;
                continue;
            }
        }

        let tocada = false;
        const nueva = linea.replace(reImg, (todo, opts, rutaImg) => {
            const f = claves.get(sinExt(rutaImg.trim()));
            if (!f) return todo;
            tocada = true;
            return `\\includegraphics[width=${f.ancho}\\linewidth]{FigurasSVG/${f.pdf}}`;
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
console.log(`\n${total} sustitución(es)${prueba ? " (modo prueba, no se ha escrito nada)" : ""}.`);

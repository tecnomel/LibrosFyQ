// Crea (o reescribe) varios HTML de figura a partir de un archivo de lote.
// Formato del lote:
//   ### UD3_Enlace_Quimico/UD3_02_lewis_atomos | Título de la figura | svg lewis cajas
//   ...código JavaScript de la figura...
//   ### UD3_Enlace_Quimico/UD3_03_... | ... | ...
//   ...
// Uso: node crear_figuras.mjs lote.txt
// El módulo "smiles" añade la librería SmilesDrawer (comun/lib).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(fileURLToPath(import.meta.url));
const lote = readFileSync(process.argv[2], "utf8");
const bloques = lote.split(/^### /m).filter(b => b.trim());

for (const b of bloques) {
    const nl = b.indexOf("\n");
    const [ruta, titulo, modulos = "svg"] = b.slice(0, nl).split("|").map(s => s.trim());
    const codigo = b.slice(nl + 1).replace(/\s+$/, "");
    const [unidad, nombre] = ruta.split("/");
    const scripts = modulos.split(/\s+/).map(m => m === "smiles"
        ? '    <script src="../../comun/lib/smiles-drawer.min.js"></script>'
        : `    <script src="../../comun/${m}.js"></script>`).join("\n");
    const cod = nombre.split("_").slice(0, 2).join("_");
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${cod} · ${titulo}</title>
    <link rel="stylesheet" href="../../comun/figura.css">
${scripts}
</head>
<body>
<script>
${codigo}
</script>
</body>
</html>
`;
    const dir = join(RAIZ, unidad, "fuentes");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, nombre + ".html"), html, "utf8");
    console.log("  + " + unidad + "/" + nombre + ".html");
}

#!/usr/bin/env node
// Comprueba que el React servido desde vendor/ es el que espera el runtime.
//
//   node tools/comprobar-vendor.mjs
//
// support.js pide React a unpkg solo si no está ya cargado; index.html lo carga
// antes desde vendor/. Si se regenera support.js con otra versión, los tres
// sitios —runtime, ficheros y etiquetas— tienen que moverse a la vez, o el mazo
// cargaría una versión distinta de la que se probó (o el navegador rechazaría
// el fichero por el integrity).

import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const leer = (ruta, cod) => readFile(join(RAIZ, ruta), cod);

const LIBRERIAS = [
  { fichero: 'vendor/react.production.min.js', url: 'REACT_URL', sri: 'REACT_SRI' },
  { fichero: 'vendor/react-dom.production.min.js', url: 'REACT_DOM_URL', sri: 'REACT_DOM_SRI' },
];

async function main() {
  const runtime = await leer('support.js', 'utf8');
  const indice = await leer('index.html', 'utf8');
  const fallos = [];

  const constante = (nombre) => {
    const m = runtime.match(new RegExp(`var ${nombre} = "([^"]+)"`));
    return m ? m[1] : null;
  };

  for (const lib of LIBRERIAS) {
    const url = constante(lib.url), esperado = constante(lib.sri);
    if (!url || !esperado) { fallos.push(`support.js ya no define ${lib.url}/${lib.sri}: revisa cómo carga React`); continue; }

    let bytes;
    try { bytes = await leer(lib.fichero); } catch { fallos.push(`falta ${lib.fichero}`); continue; }
    const real = `sha384-${createHash('sha384').update(bytes).digest('base64')}`;
    if (real !== esperado) {
      fallos.push(`${lib.fichero} no es el que pide el runtime (${url}): su hash es ${real}, y support.js espera ${esperado}`);
    }

    const nombre = lib.fichero.split('/').pop().replace(/\./g, '\\.');
    const etiqueta = indice.match(new RegExp(`<script src="\\./vendor/${nombre}"[^>]*>`));
    if (!etiqueta) fallos.push(`index.html no carga ${lib.fichero}`);
    else if (!etiqueta[0].includes(`integrity="${esperado}"`)) fallos.push(`el integrity de ${lib.fichero} en index.html no es ${esperado}`);
  }

  const posSupport = indice.indexOf('src="./support.js"');
  for (const lib of LIBRERIAS) {
    const pos = indice.indexOf(`src="./${lib.fichero}"`);
    if (pos > posSupport) fallos.push(`${lib.fichero} se carga después de support.js: el runtime iría a unpkg igualmente`);
  }

  if (fallos.length) {
    console.log('✗ Mal');
    for (const f of fallos) console.log(`   · ${f}`);
    process.exitCode = 1;
  } else {
    console.log('React de vendor/ cuadra con support.js e index.html.');
  }
}

main().catch(err => { console.error(`No se ha podido comprobar: ${err.message}`); process.exitCode = 1; });

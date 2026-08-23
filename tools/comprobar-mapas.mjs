#!/usr/bin/env node
// Comprueba que los mapas de las 47 tarjetas están completos y bien encuadrados,
// sin abrir el navegador ni volver a dibujarlos.
//
//   node tools/comprobar-mapas.mjs
//
// Mira cuatro cosas:
//   · que toda ficha lleve su especificación de mapa, para poder rehacerla;
//   · que los lugares que nombra existan en data/lugares.json;
//   · que los marcadores caigan dentro de la franja que la tarjeta enseña
//     de verdad, que es la mitad central de la imagen;
//   · que el PNG exista y tenga el marco de siempre.
//
// El encuadre se calcula con el mismo admin/mapa.js que dibuja. Lo único que
// aquí se aproxima es el ancho de las etiquetas, que sin canvas no se puede
// medir: se cuenta a 10 px por carácter, con un error de unos 20 px en la más
// larga. Por eso el aviso salta con holgura, antes de que algo se salga.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { encuadrar, proyectar, resolverLugares, LIENZO, SEGURO } from '../admin/mapa.js';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

// La misma franja que respeta admin/mapa.js: el reverso recorta la imagen con
// background-size:cover en un hueco casi cuadrado.
const HOLGURA = 25;   // por debajo de esto avisa, aunque todavía esté dentro

const leer = async ruta => JSON.parse(await readFile(join(RAIZ, ruta), 'utf8'));

/** Ancho y alto de un PNG, leídos de la cabecera IHDR. */
async function marcoDelPng(ruta) {
  const b = await readFile(join(RAIZ, ruta));
  const firma = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (b.length < 24 || !b.subarray(0, 8).equals(firma)) return null;
  return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20) };
}

function bloque(titulo, lineas, marca) {
  if (!lineas.length) return;
  console.log(`\n${marca} ${titulo}`);
  for (const l of lineas) console.log(`   · ${l}`);
}

async function main() {
  const personajes = await leer('data/characters.json');
  const lugares = await leer('data/lugares.json');
  const fallos = [], avisos = [];

  const repetidos = lugares.map(l => l.id).filter((id, i, a) => a.indexOf(id) !== i);
  if (repetidos.length) fallos.push(`data/lugares.json tiene ids repetidos: ${[...new Set(repetidos)].join(', ')}`);

  const usados = new Set();
  let peor = { margen: Infinity, quien: '' };

  for (const c of personajes) {
    if (!c.map) {
      fallos.push(`${c.id}: sin especificación de mapa, no se puede rehacer desde el panel`);
      continue;
    }
    let resueltos;
    try {
      resueltos = resolverLugares(c.map, lugares);
    } catch (err) {
      fallos.push(`${c.id}: ${err.message}`);
      continue;
    }
    const ids = new Set();
    for (const l of c.map.lugares || []) {
      const id = typeof l === 'string' ? l : l.id;
      usados.add(id);
      ids.add(id);
    }

    // Rotular un lugar que no está en el mapa no da error en el dibujo: la
    // etiqueta sencillamente no aparece, y quien la escribió cree que sí.
    for (const e of c.map.etiquetas || []) {
      if (!ids.has(e)) fallos.push(`${c.id}: pide etiqueta para «${e}», que no está entre sus lugares`);
    }
    if (c.map.etiquetas && !c.map.etiquetas.length) {
      avisos.push(`${c.id}: etiquetas vacío deja el mapa entero sin un solo nombre.`);
    }

    if (!c.mapSrc) {
      fallos.push(`${c.id}: la ficha no apunta a ningún mapa`);
    } else {
      const marco = await marcoDelPng(c.mapSrc).catch(() => null);
      if (!marco) fallos.push(`${c.id}: ${c.mapSrc} no está o no es un PNG`);
      else if (marco.ancho !== LIENZO.ancho || marco.alto !== LIENZO.alto) {
        fallos.push(`${c.id}: ${c.mapSrc} mide ${marco.ancho}×${marco.alto}, y el marco es ${LIENZO.ancho}×${LIENZO.alto}`);
      }
    }

    if (c.mapPos && c.mapPos !== '50% 50%') {
      avisos.push(`${c.id}: mapPos ${c.mapPos}. Los mapas dibujados ya vienen centrados; `
        + 'mover el recorte a mano solo hace falta con una imagen de fuera.');
    }

    const encuadre = encuadrar(resueltos, { zoom: c.map.zoom, centro: c.map.centro });
    for (const l of resueltos) {
      const p = proyectar(encuadre, l.lon, l.lat);
      const margen = Math.min(p.x - SEGURO.x0, SEGURO.x1 - p.x, p.y - SEGURO.y0, SEGURO.y1 - p.y);
      if (margen < peor.margen) peor = { margen, quien: `${c.id} · ${l.label}` };
      if (margen < 0) {
        fallos.push(`${c.id}: «${l.label}» cae fuera de lo que enseña la tarjeta (${Math.round(-margen)} px)`);
      } else if (margen < HOLGURA) {
        avisos.push(`${c.id}: «${l.label}» queda a ${Math.round(margen)} px del borde visible. `
          + 'Con la etiqueta puede rozar; mira el PNG.');
      }
    }
  }

  const sinUsar = lugares.filter(l => !usados.has(l.id)).map(l => l.id);
  console.log(`${personajes.length} fichas · ${personajes.filter(c => c.map).length} con mapa`);
  console.log(`${lugares.length} lugares en el nomenclátor, ${usados.size} en uso`
    + (sinUsar.length ? ` (sin usar: ${sinUsar.join(', ')})` : ''));
  if (peor.quien) console.log(`El marcador más al borde es ${peor.quien}, a ${Math.round(peor.margen)} px.`);

  bloque('Mal', fallos, '✗');
  bloque('Para mirar', avisos, '!');

  if (fallos.length) {
    console.log(`\n${fallos.length} ${fallos.length === 1 ? 'cosa mal' : 'cosas mal'}.`);
    process.exitCode = 1;
  } else {
    console.log(`\nTodo en orden${avisos.length ? `, salvo ${avisos.length} ${avisos.length === 1 ? 'aviso' : 'avisos'}` : ''}.`);
  }
}

main().catch(err => {
  console.error(`No se ha podido comprobar: ${err.message}`);
  process.exitCode = 1;
});

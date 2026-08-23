#!/usr/bin/env node
// Comprueba data/books.json: la tabla con la que se construyen todos los
// enlaces a la Biblia de jw.org.
//
// Los 20 libros que ya se usaban antes del panel se comprobaron a mano. Los
// otros 46 se escribieron siguiendo la misma convención y nunca se abrieron.
// Este script recorre los 66 enlaces y dice cuáles responden.
//
//   node tools/comprobar-libros.mjs              solo lo que se puede mirar sin red
//   node tools/comprobar-libros.mjs --red        además abre los 66 enlaces
//   node tools/comprobar-libros.mjs --red --capitulos   y también el último capítulo
//
// Hace falta salida a www.jw.org: desde una red que lo bloquee, todo saldrá
// como «sin respuesta» y no querrá decir nada.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
// JW_BASE existe para poder probar el propio script contra un servidor de
// mentira; en uso normal no se toca.
const SITIO = process.env.JW_BASE || 'https://www.jw.org';
const BASE = `${SITIO}/es/biblioteca/biblia/nwt/libros`;

const enlace = (slug, cap) => `${BASE}/${slug}/${cap}/`;

// Capítulos por libro en la Traducción del Nuevo Mundo. Sirve para detectar
// una tabla mal copiada sin tener que abrir 66 páginas.
const CAPITULOS = {
  genesis: 50, exodo: 40, levitico: 27, numeros: 36, deuteronomio: 34,
  josue: 24, jueces: 21, rut: 4, samuel1: 31, samuel2: 24,
  reyes1: 22, reyes2: 25, cronicas1: 29, cronicas2: 36, esdras: 10,
  nehemias: 13, ester: 10, job: 42, salmos: 150, proverbios: 31,
  eclesiastes: 12, cantar: 8, isaias: 66, jeremias: 52, lamentaciones: 5,
  ezequiel: 48, daniel: 12, oseas: 14, joel: 3, amos: 9,
  abdias: 1, jonas: 4, miqueas: 7, nahum: 3, habacuc: 3,
  sofonias: 3, ageo: 2, zacarias: 14, malaquias: 4,
  mateo: 28, marcos: 16, lucas: 24, juan: 21, hechos: 28,
  romanos: 16, corintios1: 16, corintios2: 13, galatas: 6, efesios: 6,
  filipenses: 4, colosenses: 4, tesalonicenses1: 5, tesalonicenses2: 3,
  timoteo1: 6, timoteo2: 4, tito: 3, filemon: 1, hebreos: 13,
  santiago: 5, pedro1: 5, pedro2: 3, juan1: 5, juan2: 1, juan3: 1,
  judas: 1, apocalipsis: 22,
};

// Los 20 que ya se usaban en el mazo antes de sacar los datos a data/*.json:
// su fragmento de URL viene de enlaces que funcionaban.
const COMPROBADOS_A_MANO = new Set([
  'genesis', 'exodo', 'jueces', 'rut', 'samuel1', 'samuel2', 'reyes1', 'reyes2',
  'ester', 'salmos', 'proverbios', 'daniel', 'mateo', 'marcos', 'lucas', 'juan',
  'hechos', 'romanos', 'hebreos', 'pedro1',
]);

const sinTildes = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/** Otras formas del fragmento de URL, por si la de la tabla no responde. */
function candidatos(libro) {
  const delNombre = libro.name.toLowerCase().replace(/\s+/g, '-');
  return [...new Set([
    libro.slug,
    libro.slug.toLowerCase(),
    sinTildes(libro.slug).toLowerCase(),
    delNombre,
    sinTildes(delNombre),
  ])].filter(Boolean);
}

// ------------------------------------------------------------ comprobaciones

function revisarTabla(libros) {
  const fallos = [], avisos = [];
  const anota = (lista, texto) => lista.push(texto);

  if (libros.length !== 66) anota(fallos, `Hay ${libros.length} libros y deberían ser 66.`);

  const vistos = { id: new Set(), slug: new Set() };
  for (const libro of libros) {
    const donde = libro.id || libro.name || '(sin id)';
    for (const campo of ['id', 'name', 'slug']) {
      if (typeof libro[campo] !== 'string' || !libro[campo].trim()) {
        anota(fallos, `${donde}: le falta «${campo}».`);
      }
    }
    if (!Number.isInteger(libro.chapters) || libro.chapters < 1) {
      anota(fallos, `${donde}: «chapters» debería ser un entero positivo, y es ${JSON.stringify(libro.chapters)}.`);
    }
    if (vistos.id.has(libro.id)) anota(fallos, `${donde}: el identificador está repetido.`);
    if (vistos.slug.has(libro.slug)) anota(fallos, `${donde}: el fragmento de URL está repetido.`);
    vistos.id.add(libro.id);
    vistos.slug.add(libro.slug);

    const esperados = CAPITULOS[libro.id];
    if (esperados == null) {
      anota(avisos, `${donde}: no está en la tabla de capítulos de este script; ¿identificador nuevo?`);
    } else if (esperados !== libro.chapters) {
      anota(fallos, `${donde}: pone ${libro.chapters} capítulos y la Traducción del Nuevo Mundo tiene ${esperados}.`);
    }
    if (/\s/.test(libro.slug)) anota(fallos, `${donde}: el fragmento de URL lleva espacios («${libro.slug}»).`);
    else if (libro.slug !== libro.slug.toLowerCase()) {
      anota(avisos, `${donde}: el fragmento de URL lleva mayúsculas («${libro.slug}»). Funciona, pero desentona con los demás.`);
    }
  }

  for (const id of Object.keys(CAPITULOS)) {
    if (!vistos.id.has(id)) anota(fallos, `Falta el libro «${id}».`);
  }
  return { fallos, avisos };
}

function revisarPasajes(libros, personajes) {
  const fallos = [];
  const porId = Object.fromEntries(libros.map(b => [b.id, b]));
  for (const c of personajes) {
    for (const p of c.passages || []) {
      const libro = porId[p.book];
      if (!libro) {
        fallos.push(`${c.name || c.id}: cita el libro «${p.book}», que no está en la tabla.`);
        continue;
      }
      if (!Number.isInteger(p.chapter) || p.chapter < 1 || p.chapter > libro.chapters) {
        fallos.push(`${c.name || c.id}: ${libro.name} ${p.chapter} se sale del libro (tiene ${libro.chapters} capítulos).`);
      }
    }
  }
  return fallos;
}

// ------------------------------------------------------------------- la red

async function abrir(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'accept': 'text/html,application/xhtml+xml',
        'accept-language': 'es-ES,es;q=0.9',
        'user-agent': 'jw-characters/comprobar-libros (+https://github.com/erpallaga/JW-characters)',
      },
    });
    // El cuerpo no interesa, pero hay que consumirlo para liberar la conexión.
    await res.arrayBuffer().catch(() => {});
    return { ok: res.ok, estado: res.status, final: res.url };
  } catch (err) {
    return { ok: false, estado: 0, error: err.message || String(err) };
  }
}

async function enTandas(cosas, tamaño, fn) {
  const salida = [];
  for (let i = 0; i < cosas.length; i += tamaño) {
    salida.push(...await Promise.all(cosas.slice(i, i + tamaño).map(fn)));
  }
  return salida;
}

/** ¿Llega esta red a jw.org? Sin esto, 66 bloqueos parecen 66 enlaces rotos. */
async function haySalida() {
  const r = await abrir(`${SITIO}/es/`);
  if (r.ok) return { ok: true };
  return { ok: false, motivo: r.estado ? `responde HTTP ${r.estado}` : `no responde (${r.error})` };
}

async function revisarEnlaces(libros, { capitulos }) {
  const resultados = await enTandas(libros, 4, async (libro) => {
    const primera = await abrir(enlace(libro.slug, 1));
    const r = { libro, primera, alternativa: null, ultima: null };

    // Solo un 404 dice que el fragmento de URL está mal; un 403 o un corte de
    // red no dicen nada del libro, así que no se prueban alternativas.
    if (primera.estado === 404 || primera.estado === 410) {
      for (const otro of candidatos(libro).filter(s => s !== libro.slug)) {
        const prueba = await abrir(enlace(otro, 1));
        if (prueba.ok) { r.alternativa = { slug: otro, ...prueba }; break; }
      }
    } else if (primera.ok && capitulos) {
      r.ultima = await abrir(enlace(libro.slug, libro.chapters));
    }
    return r;
  });

  const fallos = [], avisos = [];
  for (const r of resultados) {
    const donde = `${r.libro.name} (${r.libro.slug})`;
    if (r.primera.ok) {
      if (r.ultima && !r.ultima.ok) {
        fallos.push(`${donde}: el capítulo 1 responde pero el ${r.libro.chapters} da ${r.ultima.estado}. ¿Sobran capítulos en la tabla?`);
      }
      continue;
    }
    if (r.primera.estado === 404 || r.primera.estado === 410) {
      fallos.push(r.alternativa
        ? `${donde}: no existe (HTTP ${r.primera.estado}). En cambio «${r.alternativa.slug}» sí responde: cambia el fragmento de URL.`
        : `${donde}: no existe (HTTP ${r.primera.estado}), y ninguna otra forma del nombre responde.`);
    } else {
      const motivo = r.primera.estado ? `HTTP ${r.primera.estado}` : `sin respuesta (${r.primera.error})`;
      avisos.push(`${donde}: no se ha podido comprobar, ${motivo}.`);
    }
  }
  return { fallos, avisos, resultados };
}

// ------------------------------------------------------------------- salida

function bloque(titulo, lineas, marca) {
  if (!lineas.length) return;
  console.log(`\n${marca} ${titulo}`);
  for (const l of lineas) console.log(`   · ${l}`);
}

async function main() {
  const args = process.argv.slice(2);
  const conRed = args.includes('--red');
  const conCapitulos = args.includes('--capitulos');

  const leer = async (ruta) => JSON.parse(await readFile(join(RAIZ, ruta), 'utf8'));
  const libros = await leer('data/books.json');
  const personajes = await leer('data/characters.json');

  const tabla = revisarTabla(libros);
  const pasajes = revisarPasajes(libros, personajes);
  const fallos = [...tabla.fallos, ...pasajes];
  const avisos = [...tabla.avisos];

  console.log(`Comprobando ${libros.length} libros y ${personajes.reduce((n, c) => n + (c.passages || []).length, 0)} pasajes.`);

  if (conRed) {
    const salida = await haySalida();
    if (!salida.ok) {
      avisos.push(`Esta red no llega a jw.org (${salida.motivo}), así que no se ha abierto ningún enlace. `
        + 'Vuelve a lanzarlo desde una conexión normal.');
    } else {
      const sinComprobar = libros.filter(b => !COMPROBADOS_A_MANO.has(b.id)).length;
      console.log(`Abriendo los ${libros.length} enlaces en jw.org (${sinComprobar} nunca se han comprobado)…`);
      const red = await revisarEnlaces(libros, { capitulos: conCapitulos });
      fallos.push(...red.fallos);
      avisos.push(...red.avisos);
      const bien = red.resultados.filter(r => r.primera.ok).length;
      console.log(`Responden ${bien} de ${libros.length}.`);
    }
  } else {
    console.log('Sin --red no se abre ningún enlace: solo se mira la forma de la tabla.');
  }

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

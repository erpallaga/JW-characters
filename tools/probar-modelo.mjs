#!/usr/bin/env node
// Pruebas de admin/model.js, la lógica del panel que decide qué se publica:
// la fusión del borrador con lo publicado fuera (rebasar) y la lista de
// ficheros del commit. Es código puro, así que se prueba sin navegador.
//
//   node tools/probar-modelo.mjs

import assert from 'node:assert/strict';
import { rebasar, ficherosDelCommit, resumen, estadoDe, hayCambios } from '../admin/model.js';
const C = (id, extra = {}) => ({ id, name: id.toUpperCase(), eraId: 'e', portraitSrc: `assets/portrait-${id}.jpg`, mapSrc: `assets/mapa-${id}.png`, passages: [], ...extra });
const eras = [{ id: 'e', label: 'E', range: '' }];
const base = { characters: [C('a'), C('b'), C('c')], eras };
const clone = x => JSON.parse(JSON.stringify(x));

// 1. Aquí se toca A y fuera B: se quedan los dos cambios.
{
  const d = clone(base); d.characters[0].knownFor = 'local';
  const r = clone(base); r.characters[1].knownFor = 'remoto';
  const x = rebasar(d, base, r);
  assert.equal(x.borrador.characters[0].knownFor, 'local');
  assert.equal(x.borrador.characters[1].knownFor, 'remoto');
  assert.deepEqual(x.traidas, ['B']); assert.deepEqual(x.conflictos, []);
}
// 2. La misma tarjeta, campos distintos: se fusiona sin conflicto.
{
  const d = clone(base); d.characters[0].place = 'P';
  const r = clone(base); r.characters[0].knownFor = 'K';
  const x = rebasar(d, base, r);
  assert.equal(x.borrador.characters[0].place, 'P'); assert.equal(x.borrador.characters[0].knownFor, 'K');
  assert.deepEqual(x.conflictos, []);
}
// 3. El mismo campo en los dos lados: gana el borrador y se avisa.
{
  const d = clone(base); d.characters[0].place = 'aquí';
  const r = clone(base); r.characters[0].place = 'fuera';
  const x = rebasar(d, base, r);
  assert.equal(x.borrador.characters[0].place, 'aquí'); assert.deepEqual(x.conflictos, ['A']);
}
// 4. Fuera se añade D y se borra C; aquí se añade N tras A sin reordenar:
//    manda el orden de fuera y N queda detrás de A.
{
  const d = clone(base); d.characters.splice(1, 0, C('n'));
  const r = clone(base); r.characters = [C('a'), C('b'), C('d')];
  const x = rebasar(d, base, r);
  assert.deepEqual(x.borrador.characters.map(c => c.id), ['a', 'n', 'b', 'd']);
}
// 5. Aquí se reordenó: manda ese orden, y la nueva de fuera va tras su vecina (C).
{
  const d = clone(base); d.characters.reverse();
  const r = clone(base); r.characters.push(C('z'));
  const x = rebasar(d, base, r);
  assert.deepEqual(x.borrador.characters.map(c => c.id), ['c', 'z', 'b', 'a']);
}
// 6. Quitar un campo fuera (hidden) también se trae.
{
  const b2 = clone(base); b2.characters[0].hidden = true;
  const d = clone(b2); d.characters[1].place = 'x';
  const r = clone(b2); delete r.characters[0].hidden;
  const x = rebasar(d, b2, r);
  assert.equal('hidden' in x.borrador.characters[0], false);
}
// 7. Borrada en los dos lados; y si fuera no cambió nada, el borrador sale intacto.
{
  const d = clone(base); d.characters.pop();
  const r = clone(base); r.characters.pop();
  assert.deepEqual(rebasar(d, base, r).borrador.characters.map(c => c.id), ['a', 'b']);
  assert.equal(rebasar(d, base, clone(base)).borrador, d);
}
// ficherosDelCommit: no sube imágenes que nadie usa y borra las publicadas que
// dejan de usarse (quitada, tarjeta borrada, o PNG sustituido por JPG).
{
  const d = clone(base);
  d.characters[0].mapSrc = 'assets/mapa-a.jpg';          // png → jpg
  delete d.characters[1].portraitSrc;                     // quitado
  d.characters = d.characters.filter(c => c.id !== 'c');  // borrada
  const imgs = { 'assets/mapa-a.jpg': { blob: 1 }, 'assets/portrait-huerfana.jpg': { blob: 2 } };
  const f = ficherosDelCommit(d, base, imgs);
  assert.deepEqual(f.imagenes.map(([r]) => r), ['assets/mapa-a.jpg']);
  assert.deepEqual(f.borrados.sort(), ['assets/mapa-a.png', 'assets/mapa-c.png', 'assets/portrait-b.jpg', 'assets/portrait-c.jpg']);
}
// Sustituir un retrato ya publicado lo escribe en la misma ruta: el JSON no
// cambia, pero la tarjeta tiene un cambio y hay algo que publicar.
{
  const d = clone(base);
  const pendientes = ['assets/portrait-a.jpg'];
  assert.equal(hayCambios(resumen(d, base)), false);
  const r = resumen(d, base, pendientes);
  assert.deepEqual(r.editadas.map(e => [e.tarjeta.id, e.campos]), [['a', ['portraitSrc']]]);
  assert.equal(estadoDe(d.characters[0], { a: base.characters[0] }, pendientes), 'cambios');
  const f = ficherosDelCommit(d, base, { 'assets/portrait-a.jpg': { blob: 1 } });
  assert.deepEqual(f.imagenes.map(([ruta]) => ruta), ['assets/portrait-a.jpg']);
  assert.deepEqual(f.textos, []);
}
console.log('admin/model.js: todas las pruebas pasan.');

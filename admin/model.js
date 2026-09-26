// Qué ha cambiado respecto a lo publicado. Todo el estado que ve el usuario
// —"con cambios", "nueva", el contador de la cabecera, la lista del modal de
// publicación— sale de aquí, comparando el borrador con la instantánea de lo
// que hay en el repositorio.

import { PATHS } from './config.js';

export const CAMPOS = [
  'name', 'eraId', 'timeframe', 'place', 'portraitSrc', 'mapSrc', 'mapPos', 'map', 'knownFor', 'hidden',
];

const ETIQUETAS = {
  name: 'nombre', eraId: 'era', timeframe: 'época', place: 'dónde vivió',
  portraitSrc: 'retrato', mapSrc: 'mapa', mapPos: 'punto del mapa',
  map: 'lugares del mapa', knownFor: 'por qué se le conoce', hidden: 'visibilidad',
  life: 'fechas', passages: 'pasajes',
};

const igual = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/** Campos en los que difieren dos versiones de una misma tarjeta. */
export function diferencias(borrador, publicado) {
  if (!publicado) return null;
  const campos = [...CAMPOS, 'life', 'passages'].filter(k => !igual(borrador[k], publicado[k]));
  return campos.length ? campos : [];
}

/** 'nueva' | 'cambios' | 'oculta' | 'publicada' */
export function estadoDe(tarjeta, publicadasPorId) {
  const previa = publicadasPorId[tarjeta.id];
  if (!previa) return 'nueva';
  const dif = diferencias(tarjeta, previa);
  if (dif.length) return 'cambios';
  return tarjeta.hidden ? 'oculta' : 'publicada';
}

export function resumen(borrador, publicado) {
  const publicadasPorId = Object.fromEntries((publicado.characters || []).map(c => [c.id, c]));
  const borradorPorId = Object.fromEntries((borrador.characters || []).map(c => [c.id, c]));

  const nuevas = [], editadas = [];
  for (const c of borrador.characters || []) {
    const previa = publicadasPorId[c.id];
    if (!previa) nuevas.push(c);
    else if (diferencias(c, previa).length) editadas.push({ tarjeta: c, campos: diferencias(c, previa) });
  }
  const borradas = (publicado.characters || []).filter(c => !borradorPorId[c.id]);
  const erasCambiadas = !igual(borrador.eras, publicado.eras);
  const ordenCambiado = !igual(
    (borrador.characters || []).map(c => c.id),
    (publicado.characters || []).map(c => c.id),
  ) && !nuevas.length && !borradas.length;

  return { nuevas, editadas, borradas, erasCambiadas, ordenCambiado, publicadasPorId };
}

export function hayCambios(r) {
  return contarPendientes(r) > 0;
}

/** Cuántos cambios hay sin publicar: el mismo número en la cabecera y en la lista. */
export function contarPendientes(r) {
  return r.nuevas.length + r.editadas.length + r.borradas.length +
    (r.erasCambiadas ? 1 : 0) + (r.ordenCambiado ? 1 : 0);
}

/**
 * Trae al borrador lo que se haya publicado por otro camino desde que se
 * empezó: otro navegador, o un commit hecho a mano en el repositorio.
 *
 * El borrador es el juego de datos completo, así que sin esto una tarjeta que
 * no se ha tocado aquí pero sí fuera volvería a su versión vieja al publicar,
 * y se desharía el cambio sin que nadie lo viera. Es una fusión a tres bandas
 * por tarjeta y por campo: `base` es lo publicado cuando se sembró el
 * borrador, `remoto` lo publicado ahora. Gana lo que haya cambiado de un solo
 * lado; si un mismo campo cambió en los dos, se queda el del borrador y se
 * avisa.
 *
 * @returns {{borrador: object, traidas: string[], conflictos: string[]}}
 */
export function rebasar(borrador, base, remoto) {
  const copia = (x) => JSON.parse(JSON.stringify(x));
  if (!base || igual(base, remoto)) return { borrador, traidas: [], conflictos: [] };

  const porId = (lista) => Object.fromEntries((lista || []).map(c => [c.id, c]));
  const B = porId(base.characters), D = porId(borrador.characters), R = porId(remoto.characters);
  const nombre = (id) => (D[id] || R[id] || B[id]).name || id;
  const traidas = [], conflictos = [];
  const resultado = {};

  for (const id of new Set([...Object.keys(B), ...Object.keys(D), ...Object.keys(R)])) {
    const b = B[id], d = D[id], r = R[id];
    if (!b) {
      // Nueva en uno de los dos lados (o en los dos a la vez, con el mismo id).
      if (d && r && !igual(d, r)) conflictos.push(nombre(id));
      if (!d) traidas.push(nombre(id));
      resultado[id] = d || copia(r);
      continue;
    }
    const cambioAqui = !igual(d, b), cambioFuera = !igual(r, b);
    if (!cambioFuera) { if (d) resultado[id] = d; continue; }
    if (!cambioAqui) { if (r) resultado[id] = copia(r); traidas.push(nombre(id)); continue; }
    // Cambió en los dos lados.
    if (!d && !r) continue;                 // borrada en los dos
    if (!d || !r) {
      // Borrada en un lado y editada en el otro: se conserva la versión editada.
      resultado[id] = d || copia(r);
      conflictos.push(nombre(id));
      continue;
    }
    const fusion = {};
    let choca = false;
    for (const k of new Set([...Object.keys(b), ...Object.keys(d), ...Object.keys(r)])) {
      const tocadoAqui = !igual(d[k], b[k]), tocadoFuera = !igual(r[k], b[k]);
      const valor = tocadoAqui ? d[k] : r[k];
      if (tocadoAqui && tocadoFuera && !igual(d[k], r[k])) choca = true;
      if (valor !== undefined) fusion[k] = copia(valor);
    }
    resultado[id] = fusion;
    (choca ? conflictos : traidas).push(nombre(id));
  }

  // Orden: si aquí no se reordenó nada, manda el de fuera; si sí, el de aquí.
  // Las tarjetas que solo están en un lado se colocan detrás de su vecina.
  const ids = (lista) => (lista || []).map(c => c.id);
  const comunes = (lista) => ids(lista).filter(id => B[id] && D[id]);
  const reordenadoAqui = !igual(comunes(borrador.characters), comunes(base.characters));
  const guia = reordenadoAqui ? ids(borrador.characters) : ids(remoto.characters);
  const orden = guia.filter(id => resultado[id]);
  const colocar = (lista) => {
    const l = ids(lista);
    l.forEach((id, i) => {
      if (!resultado[id] || orden.includes(id)) return;
      const previa = l.slice(0, i).reverse().find(x => orden.includes(x));
      orden.splice(previa ? orden.indexOf(previa) + 1 : 0, 0, id);
    });
  };
  colocar(borrador.characters);
  colocar(remoto.characters);

  let eras = borrador.eras;
  if (igual(borrador.eras, base.eras)) eras = copia(remoto.eras);
  else if (!igual(remoto.eras, base.eras) && !igual(borrador.eras, remoto.eras)) conflictos.push('la lista de eras');

  return {
    borrador: { ...borrador, characters: orden.map(id => resultado[id]), eras },
    traidas, conflictos,
  };
}

/** Rutas de imagen a las que apunta alguna tarjeta. */
export function rutasEnUso(personajes) {
  const enUso = new Set();
  for (const c of personajes || []) {
    if (c.portraitSrc) enUso.add(c.portraitSrc);
    if (c.mapSrc) enUso.add(c.mapSrc);
  }
  return enUso;
}

export function nombresDeCampos(campos) {
  return campos.map(k => ETIQUETAS[k] || k).join(' · ');
}

/** Mensaje de commit propuesto, editable después por el usuario. */
export function mensajePropuesto(r) {
  const partes = [];
  if (r.nuevas.length) partes.push(`añade a ${lista(r.nuevas.map(c => c.name))}`);
  if (r.editadas.length) partes.push(`actualiza a ${lista(r.editadas.map(e => e.tarjeta.name))}`);
  if (r.borradas.length) partes.push(`quita a ${lista(r.borradas.map(c => c.name))}`);
  if (r.erasCambiadas) partes.push('ajusta las eras');
  if (!partes.length && r.ordenCambiado) partes.push('reordena el mazo');
  const texto = partes.join('; ');
  return texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : 'Actualiza las tarjetas';
}

function lista(nombres) {
  if (nombres.length === 1) return nombres[0];
  if (nombres.length === 2) return `${nombres[0]} y ${nombres[1]}`;
  return `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
}

/**
 * Ficheros a escribir y a borrar en el commit.
 * @param {{characters: any[], eras: any[]}} borrador
 * @param {{characters: any[], eras: any[]}} publicado
 * @param {Record<string, {blob: Blob}>} imagenes  imágenes pendientes, por ruta
 */
export function ficherosDelCommit(borrador, publicado, imagenes) {
  const r = resumen(borrador, publicado);
  const textos = [];

  const charsSinCambios = igual(borrador.characters, publicado.characters);
  if (!charsSinCambios) {
    textos.push({ path: PATHS.characters, texto: JSON.stringify(borrador.characters, null, 2) + '\n' });
  }
  if (r.erasCambiadas) {
    textos.push({ path: PATHS.eras, texto: JSON.stringify(borrador.eras, null, 2) + '\n' });
  }

  // Una imagen publicada se borra cuando ninguna tarjeta la sigue usando: la
  // de una tarjeta borrada, la que se quitó, o la que se sustituyó por otra de
  // distinta extensión (un mapa subido en JPG que pasa a dibujarse en PNG).
  const enUso = rutasEnUso(borrador.characters);
  const borrados = [...rutasEnUso(publicado.characters)].filter(ruta => !enUso.has(ruta));

  // Y solo se sube una imagen pendiente si alguna tarjeta apunta a ella; si
  // no, acabaría en el repositorio sin que nada la enseñe.
  const subidas = Object.entries(imagenes || {}).filter(([ruta]) => enUso.has(ruta));

  return { textos, imagenes: subidas, borrados, resumen: r };
}

// Borradores en el navegador. El borrador es el juego de datos COMPLETO, no un
// parche: al abrir el panel se siembra con lo publicado, y el estado de cada
// tarjeta (publicada / con cambios / nueva) sale de comparar uno con otro.
//
// IndexedDB y no localStorage porque aquí también viven las imágenes, y el
// límite de ~5 MB de localStorage se agota en unas quince tarjetas.

const DB_NAME = 'jw-admin';
const DB_VERSION = 1;
const TIENDAS = { meta: 'meta', borrador: 'borrador', imagenes: 'imagenes' };

let _db = null;

function abrir() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const nombre of Object.values(TIENDAS)) {
        if (!db.objectStoreNames.contains(nombre)) db.createObjectStore(nombre);
      }
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

async function tx(tienda, modo, fn) {
  const db = await abrir();
  return new Promise((resolve, reject) => {
    const t = db.transaction(tienda, modo);
    const req = fn(t.objectStore(tienda));
    t.oncomplete = () => resolve(req && req.result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

const get = (tienda, clave) => tx(tienda, 'readonly', s => s.get(clave));
const put = (tienda, clave, valor) => tx(tienda, 'readwrite', s => s.put(valor, clave));
const del = (tienda, clave) => tx(tienda, 'readwrite', s => s.delete(clave));

// --- borrador ---------------------------------------------------------------

export const leerBorrador = () => get(TIENDAS.borrador, 'datos');
export const guardarBorrador = (datos) => put(TIENDAS.borrador, 'datos', datos);
export const borrarBorrador = () => del(TIENDAS.borrador, 'datos');

// --- instantánea de lo publicado, para poder diferenciar --------------------

export const leerPublicado = () => get(TIENDAS.meta, 'publicado');
export const guardarPublicado = (datos) => put(TIENDAS.meta, 'publicado', datos);

export const leerBaseSha = () => get(TIENDAS.meta, 'baseCommitSha');
export const guardarBaseSha = (sha) => put(TIENDAS.meta, 'baseCommitSha', sha);

// --- imágenes pendientes de subir -------------------------------------------
// clave = ruta en el repositorio, p. ej. 'assets/portrait-ana.jpg'

export const leerImagen = (ruta) => get(TIENDAS.imagenes, ruta);
export const guardarImagen = (ruta, registro) => put(TIENDAS.imagenes, ruta, registro);
export const borrarImagen = (ruta) => del(TIENDAS.imagenes, ruta);

export function listarImagenes() {
  return tx(TIENDAS.imagenes, 'readonly', s => s.getAllKeys()).then(async claves => {
    const salida = {};
    for (const c of claves || []) salida[c] = await leerImagen(c);
    return salida;
  });
}

export async function vaciarImagenes() {
  await tx(TIENDAS.imagenes, 'readwrite', s => s.clear());
}

/** Cuánto ocupa el borrador, para poder avisar antes de publicar. */
export async function pesoImagenes() {
  const imgs = await listarImagenes();
  return Object.values(imgs).reduce((n, r) => n + (r && r.blob ? r.blob.size : 0), 0);
}

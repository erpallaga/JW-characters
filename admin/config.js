// Configuración del panel. Este fichero es público: no pongas aquí nada que
// no puedas enseñar. La contraseña no está — solo su huella SHA-256, y el
// token de GitHub vive únicamente en tu navegador.

export const REPO = {
  owner: 'erpallaga',
  repo: 'JW-characters',
  branch: 'main',
};

export const AUTH = {
  user: 'eric',
  // Para cambiar la contraseña, calcula la huella de la nueva y pégala aquí:
  //   echo -n 'tu-contraseña' | shasum -a 256
  passwordSha256: '9e6f462a842997cd9c29f1cb846cdd803f3a8d6be34683a98be5ddd0ebdbea6f',
};

// Rutas de los datos dentro del repositorio.
export const PATHS = {
  characters: 'data/characters.json',
  eras: 'data/eras.json',
  books: 'data/books.json',
  assets: 'assets',
};

// Límites al reducir las imágenes en el navegador antes de subirlas.
export const IMAGES = {
  portrait: { maxW: 800, maxH: 1067, quality: 0.82, ext: 'jpg', mime: 'image/jpeg' },
  map: { maxW: 1200, maxH: 900, quality: 0.85, ext: 'jpg', mime: 'image/jpeg' },
  // Aviso (no bloqueo) si un fichero ya reducido sigue pesando más que esto.
  warnBytes: 400 * 1024,
};

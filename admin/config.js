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
  passwordSha256: '5554b1fcd2a2ef67d833e48fcaf4e5af34c3a4928502877479620f96e917df26',
};

// Rutas de los datos dentro del repositorio.
export const PATHS = {
  characters: 'data/characters.json',
  eras: 'data/eras.json',
  books: 'data/books.json',
  assets: 'assets',
};

// El marco de los mapas, en un solo sitio. De aquí sale tanto el lienzo que
// dibuja `admin/mapa.js` como la proporción a la que se recorta un mapa subido
// a mano, para que los dos caminos den siempre la misma imagen.
export const LIENZO = { ancho: 909, alto: 540 };

// Límites al reducir las imágenes en el navegador antes de subirlas.
export const IMAGES = {
  portrait: { maxW: 800, maxH: 1067, quality: 0.82, ext: 'jpg', mime: 'image/jpeg' },
  map: { maxW: LIENZO.ancho, maxH: LIENZO.alto, quality: 0.85, ext: 'jpg', mime: 'image/jpeg' },
  // Aviso (no bloqueo) si un fichero ya reducido sigue pesando más que esto.
  warnBytes: 400 * 1024,
};

# vendor/

Librerías de terceros servidas desde el propio sitio, para que el mazo no
dependa de una CDN para arrancar.

| Fichero | Origen | Licencia |
|---|---|---|
| `react.production.min.js` | `https://unpkg.com/react@18.3.1/umd/react.production.min.js` | MIT |
| `react-dom.production.min.js` | `https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js` | MIT |

`support.js` (generado, no se toca) carga React desde unpkg solo si no está ya
en `window`. `index.html` lo carga antes desde aquí, así que esa petición no
llega a hacerse.

Son exactamente los ficheros que pediría el runtime: su SHA-384 coincide con
`REACT_SRI` y `REACT_DOM_SRI` de `support.js`, y el `integrity` de las etiquetas
de `index.html` es ese mismo. Si se regenera `support.js` con otra versión de
React, hay que traer los ficheros nuevos y copiar los hashes nuevos:

```
openssl dgst -sha384 -binary vendor/react.production.min.js | openssl base64 -A
```

`tools/comprobar-vendor.mjs` comprueba que ficheros, etiquetas y runtime cuadran.

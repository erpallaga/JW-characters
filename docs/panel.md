# Panel de tarjetas

Para añadir, editar u ocultar personajes sin tocar el código.

## Cómo se entra

1. En el mazo, el botón del candado, arriba a la derecha (o `admin.html` directamente).
2. Usuario y contraseña. Esto **solo oculta el panel**: los datos publicados son
   públicos igual, y quien mire el código fuente verá la huella de la contraseña.
   Sirve para no entrar sin querer, no para resistir a alguien que lo intente.
3. La primera vez pide un **token de GitHub**, que es lo que de verdad autoriza a
   publicar. Se crea en <https://github.com/settings/personal-access-tokens/new>:
   - Repositorio: solo `erpallaga/JW-characters`.
   - Permiso: **Contents — Read and write**. Nada más.
   El token se guarda únicamente en ese navegador. Quien use el equipo podrá
   publicar, así que conviene salir del panel si lo prestas.

Para cambiar la contraseña, calcula la huella de la nueva y pégala en
`admin/config.js`:

```
echo -n 'la-nueva-contraseña' | shasum -a 256
```

## Cómo se trabaja

Todo lo que se hace en el panel es un **borrador local**: se guarda al instante en
el navegador, pero la web no cambia hasta pulsar **Publicar**. Se pueden preparar
varias tarjetas y publicarlas juntas.

Publicar hace **un único commit** en `main` con los JSON y las imágenes que hayan
cambiado. GitHub Pages tarda alrededor de un minuto en reconstruir, así que la web
sigue mostrando lo anterior durante ese rato.

El estado de cada tarjeta sale de comparar el borrador con lo que hay publicado:

| Estado | Qué significa |
|---|---|
| Publicada | Igual que en la web |
| Con cambios | Editada en el borrador, sin publicar |
| Nueva · sin publicar | Creada aquí, todavía no existe en la web |
| Oculta en el mazo | Sigue en los datos, pero el mazo no la muestra |

Ocultar no borra: la tarjeta se queda en `data/characters.json` con `hidden: true`
y desaparece del mazo. Borrar sí la quita, y al publicar se lleva por delante su
retrato y su mapa si no los usa nadie más.

## Las imágenes

Se suben desde el propio formulario y se reducen en el navegador antes de subirlas
(retrato a 800 px, mapa a 1200 px). Sin eso, una foto de 6 MB del móvil se quedaría
para siempre en el historial del repositorio.

## Los datos

- `data/characters.json` — los personajes.
- `data/eras.json` — las eras, que ordenan el mazo y los filtros.
- `data/books.json` — los 66 libros de la Biblia con su nombre, su fragmento de URL
  en jw.org y cuántos capítulos tiene cada uno. El selector de pasajes construye el
  enlace a partir de esta tabla.

> Los 20 libros que ya se usaban conservan exactamente el fragmento de URL que
> tenían. Los otros 46 se escribieron siguiendo esa misma convención, pero **no se
> han podido comprobar** contra jw.org. El primero que uses de un libro nuevo,
> conviene abrir el enlace una vez para confirmarlo.

## Si algo va mal

- **«El token no vale o ha caducado»** — vuelve a conectarlo; el panel lo pedirá solo.
- **«El repositorio ha cambiado desde que abriste el panel»** — alguien (o tú desde
  otro sitio) ha publicado por medio. Recarga y repite; el panel se niega a publicar
  encima para no pisar ese commit.
- **El borrador vive en este navegador.** Si borras los datos del sitio, se pierde lo
  que no hayas publicado. Lo publicado está a salvo en el historial de Git.

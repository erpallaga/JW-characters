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

## Los mapas

No hacen falta imágenes de fuera: el botón **Generar mapa**, junto al campo del mapa,
los dibuja en el propio panel.

1. Se añaden los lugares por su nombre, en el orden del viaje. Si alguno no está en
   la lista, «Otro lugar (a mano)» acepta un nombre con su latitud y su longitud.
2. **Unirlos con la línea del viaje** traza la línea roja de puntos que pasa por
   todos ellos, en el orden en que estén.
3. El encuadre se calcula solo para que los lugares y sus nombres queden dentro de
   lo que la tarjeta enseña —las bandas oscuras de la vista previa marcan lo que se
   recorta—. Quitando **Encuadre automático** se ajusta a mano, que es lo que
   conviene en un desierto, donde de cerca no se reconoce nada.

Al aceptar, el mapa entra en el borrador como una imagen más y se publica con el
resto. Los lugares elegidos se guardan en la tarjeta (campo `map`), así que el mapa
se puede volver a abrir y retocar más adelante sin empezar de cero.

Para rehacerlos todos de golpe desde la consola, sin abrir el panel:

```
node tools/generar-mapas.mjs            # solo los que falten
node tools/generar-mapas.mjs --todas    # todos otra vez
```

Dibuja con el mismo código que el panel, dentro de un Chromium sin ventana. Si el
navegador no está en `/opt/pw-browsers/chromium`, se le indica con la variable
`CHROMIUM`.

## Los datos

- `data/characters.json` — los personajes.
- `data/eras.json` — las eras, que ordenan el mazo y los filtros.
- `data/lugares.json` — el nomenclátor: los lugares bíblicos con sus coordenadas.
  Añadir uno aquí lo pone en la lista del editor de mapas para todas las tarjetas.
- `data/geo/` — las costas y las fronteras con las que se dibujan los mapas, sacadas
  de [Natural Earth](https://www.naturalearthdata.com) (dominio público) y recortadas
  al ámbito bíblico. Se rehacen con `tools/preparar-geo.py`, que solo hace falta si
  alguna vez hay que ampliar la zona que cubren.
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

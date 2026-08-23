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

Se suben desde el propio formulario. Al elegir el fichero se abre el **encuadre**:
la foto dentro del marco de la tarjeta —vertical 3:4 el retrato, apaisado 4:3 el
mapa—, que se arrastra y se acerca con la barra hasta que se ve lo que tiene que
verse. Lo que se guarda ya está recortado, así que en el mazo se ve exactamente eso;
no hay que ajustar nada después.

**Reencuadrar** vuelve a abrir ese cuadro para una imagen que ya está puesta. Si se
subió en esta misma sesión se recorta sobre el original, sin perder calidad; si viene
de una publicación anterior se recorta sobre lo que hay en la web, que ya venía
reducido.

Al recortar también se reduce (retrato hasta 800 px de ancho, mapa hasta 1200) y se
guarda en JPEG. Sin eso, una foto de 6 MB del móvil se quedaría para siempre en el
historial del repositorio. Nunca se agranda: si el recorte da menos píxeles que el
límite, el fichero sale más pequeño y el cuadro lo avisa.

## El orden del mazo

El mazo se lee en el orden de la lista, y ese orden es una decisión, no una
ordenación automática: Ester va antes que Daniel aunque las fechas digan lo
contrario.

Para cambiarlo, el asa (⠿) a la izquierda de cada fila: se arrastra la tarjeta a
donde tenga que ir, o se mueve con las flechas ↑ y ↓ una vez el asa tiene el foco.
Con un filtro o una búsqueda puesta el asa se desactiva, porque «déjala aquí» no
diría dónde va en el orden real.

Una tarjeta **nueva** sigue colocándose sola por sus fechas mientras no se toque el
orden a mano; en cuanto se mueve, se queda donde se la deja. Cambiar el orden cuenta
como un cambio sin publicar, igual que editar una tarjeta.

## Los datos

- `data/characters.json` — los personajes.
- `data/eras.json` — las eras, que ordenan el mazo y los filtros.
- `data/books.json` — los 66 libros de la Biblia con su nombre, su fragmento de URL
  en jw.org y cuántos capítulos tiene cada uno. El selector de pasajes construye el
  enlace a partir de esta tabla.

> Los 20 libros que ya se usaban conservan exactamente el fragmento de URL que
> tenían. Los otros 46 se escribieron siguiendo esa misma convención y siguen sin
> comprobarse contra jw.org.

Para comprobarlos de una vez, desde una conexión que llegue a jw.org:

```
node tools/comprobar-libros.mjs --red
```

Abre los 66 enlaces y dice cuáles no responden; si uno falla, prueba otras formas del
nombre y propone la que sí funciona. Sin `--red` solo revisa la tabla: que estén los
66 libros, que no haya identificadores repetidos, que los capítulos cuadren con la
Traducción del Nuevo Mundo y que ningún pasaje de `characters.json` apunte a un
capítulo que no existe. Con `--capitulos` comprueba además el último capítulo de cada
libro.

## Si algo va mal

- **«El token no vale o ha caducado»** — vuelve a conectarlo; el panel lo pedirá solo.
- **«El repositorio ha cambiado desde que abriste el panel»** — alguien (o tú desde
  otro sitio) ha publicado por medio. Recarga y repite; el panel se niega a publicar
  encima para no pisar ese commit.
- **El borrador vive en este navegador.** Si borras los datos del sitio, se pierde lo
  que no hayas publicado. Lo publicado está a salvo en el historial de Git.

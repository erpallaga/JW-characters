# Diseño: Flashcards de Personajes Bíblicos (JW-characters)

## Propósito

Proyecto de estudio personal y familiar para la noche de adoración en familia. Objetivo: conocer mejor a los personajes de la Biblia y ubicarlos en el relato bíblico y la corriente del tiempo. Usa únicamente fuentes de JW.ORG y libros de referencia proporcionados por el usuario.

App web de uso personal/familiar: colección de flashcards con un frontal (imagen + nombre del personaje) que al voltearse muestra detalles (línea de tiempo, dónde vivió, por qué es conocido, libros donde sale su historia), más una vista de línea de tiempo global.

## Alcance de la fase 1 (este spec)

- Dataset semilla: 17 personajes clave, redactados a partir de fuentes locales (ver "Fuentes") ampliadas con JW.ORG, WOL y la enciclopedia *Perspicacia para comprender las Escrituras* (it).
- Dos pantallas: Mazo de flashcards y Timeline global.
- Datos en un archivo JSON estático versionado en el repo (`data/characters.json`) — sin backend. Se descartó Supabase: el usuario ya no tiene slot libre en su plan free y no quiere abrir una tercera cuenta.
- Sin panel de administración todavía — los datos de la fase 1 se editan directo en el archivo JSON.
- Hospedaje: GitHub Pages (frontend estático).

### Fuera de alcance (fase 1)

- Panel de administración / edición desde la app.
- Autenticación.
- Búsqueda, filtros, modo quiz, categorías más allá de la línea de tiempo.

Estos ítems son candidatos para una fase 2 con su propio spec.

## Arquitectura

- **Frontend**: HTML/CSS/JS vanilla, sin build ni framework. Desplegado en GitHub Pages sirviendo directo desde el repo (rama `main`, raíz).
- **Datos**: `data/characters.json`, un array de objetos, versionado en el repo. El frontend lo carga con `fetch("data/characters.json")` en tiempo de ejecución — sin backend, sin claves, sin RLS.
- **Imágenes**: descargadas de JW.ORG y guardadas en `assets/images/` del propio repo, servidas por GitHub Pages junto al resto del sitio.
- **Escritura de datos (fase 1)**: se edita `data/characters.json` directamente (añadir un objeto por personaje) durante la redacción de cada ficha; no hay UI de escritura en la app.

## Modelo de datos

`data/characters.json` — array de objetos con esta forma:

```json
{
  "id": "david",
  "name": "David",
  "image_url": "assets/images/david.jpg",
  "era_label": "Época de los reyes, ~1040–970 a.E.C.",
  "era_sort_key": -1040,
  "lived_in": "Belén, Hebrón, Jerusalén",
  "known_for": "Pastor que venció a Goliat, segundo rey de Israel, antepasado de Jesús",
  "books": ["1 Samuel", "2 Samuel", "1 Reyes", "1 Crónicas", "Salmos"],
  "sources": ["Ejemplos de fe, cap. X", "jw.org: ..."]
}
```

Campos: `id` (slug único), `name`, `image_url` (ruta relativa), `era_label` (texto legible), `era_sort_key` (año numérico, negativo = a.E.C., para ordenar/posicionar en el timeline), `lived_in`, `known_for` (contenido principal), `books` (array de libros bíblicos), `sources` (array, trazabilidad de dónde salió el texto).

## Pantallas

### 1. Mazo (flashcards) — pantalla por defecto

- Una carta centrada a la vez.
- Frontal: imagen + nombre.
- Clic/tap voltea la carta: reverso muestra `era_label`, `lived_in`, `known_for`, `books`.
- Navegación con botones ← Anterior / Siguiente →.
- Sin shuffle ni modo quiz en fase 1 (YAGNI).

### 2. Timeline (línea de tiempo global)

- Línea horizontal con scroll.
- Cada personaje es un punto sobre la línea, posicionado según `era_sort_key`, con miniatura de imagen y nombre debajo.
- Clic en un punto navega a esa carta en la vista Mazo, ya volteada (mostrando el reverso).

### Navegación

Dos pestañas simples arriba de la página (Mazo / Timeline), sin librería de router — alternan visibilidad de dos secciones o usan hash routing simple (`#/deck`, `#/timeline`).

## Fuentes

Libros locales (no versionados en git, ver `.gitignore`; sirven solo de referencia de contenido/estilo):

- `ia_S.pdf` — *Ejemplos de fe* (ia): 14 capítulos, uno por personaje, cronológico.
- `wcg_S.pdf` — *Seamos valientes al andar con Dios* (wcg): 3 secciones cronológicas, varios personajes por sección.
- `lfb_S.pdf` — *Lecciones que aprendo de la Biblia* (lfb): relatos bíblicos infantiles, cobertura amplia.
- Fichas bíblicas sueltas de JW.ORG (serie coleccionable "Ficha bíblica"): Jonatán (23), Ziporá (34), rey Saúl (41), historia ilustrada Jacob y Esaú. Sirven de plantilla de formato (sección "Algunos datos" + línea de tiempo + mapa), aunque estos personajes concretos no están en el seed de fase 1.

Ampliar y verificar contenido con búsquedas en JW.ORG, WOL (wol.jw.org) y *Perspicacia para comprender las Escrituras* (it) cuando el libro local no cubra un dato necesario (dónde vivió, libros, fecha).

### Lista del seed (17 personajes, orden cronológico)

Abel, Noé, Abrahán, Moisés, Rut, Ana, Samuel, Jonatán, David, Abigaíl, Elías, Jonás, Ester, María, José (padre de Jesús), Marta, Pedro.

De *ia_S* (14): Abel, Noé, Abrahán, Rut, Ana, Samuel, Abigaíl, Elías, Jonás, Ester, María, José, Marta, Pedro.
Añadidos de *wcg_S* (3): Moisés, Jonatán, David.

## Proceso de contenido (fase 1)

1. Para cada personaje del seed, se extrae el contenido base del capítulo correspondiente en `ia_S.pdf` o `wcg_S.pdf`.
2. Se amplía/verifica con JW.ORG, WOL y *Perspicacia* cuando falte un dato (dónde vivió, libros bíblicos, fecha/era).
3. Se redacta cada ficha (era, dónde vivió, conocido por, libros, fuente) basándose únicamente en estas fuentes — sin contenido inventado.
4. El usuario revisa y aprueba el texto de cada ficha antes de añadirla al JSON.
5. Se descarga la imagen correspondiente de JW.ORG y se guarda en `assets/images/<id>.jpg` del repo.
6. Se añade el objeto a `data/characters.json`, con `image_url` apuntando a esa ruta.

## Manejo de errores

- Si `data/characters.json` no carga (404, JSON inválido) o está vacío, la app muestra un mensaje simple ("No se pudieron cargar los personajes") en vez de fallar en blanco.
- Si una imagen no carga, se muestra un placeholder con el nombre del personaje (sin romper el layout de la carta).

## Pruebas / validación

- Validación manual: abrir la app (local y en GitHub Pages), recorrer todas las cartas del seed, verificar que el orden en Timeline coincide con `era_sort_key`.
- No se contemplan pruebas automatizadas en fase 1 (app estática de contenido personal) — se valida a mano la estructura de cada objeto antes de añadirlo al JSON.

## Fase 2 (fuera de alcance, futuro spec propio)

- Panel de administración para editar personajes sin tocar el JSON a mano — mecanismo de guardado (backend, Supabase u otro) a decidir cuando se diseñe esa fase.
- Posibles extras a evaluar entonces: búsqueda, filtros por época/libro, modo quiz.

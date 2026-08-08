# Diseño: Flashcards de Personajes Bíblicos (JW-characters)

## Propósito

Proyecto de estudio personal y familiar para la noche de adoración en familia. Objetivo: conocer mejor a los personajes de la Biblia y ubicarlos en el relato bíblico y la corriente del tiempo. Usa únicamente fuentes de JW.ORG y libros de referencia proporcionados por el usuario.

App web de uso personal/familiar: colección de flashcards con un frontal (imagen + nombre del personaje) que al voltearse muestra detalles (línea de tiempo, dónde vivió, por qué es conocido, libros donde sale su historia), más una vista de línea de tiempo global.

## Alcance de la fase 1 (este spec)

- Dataset semilla: 10-15 personajes clave, redactados a partir de fuentes que el usuario suba (JW.ORG + libros).
- Dos pantallas: Mazo de flashcards y Timeline global.
- Datos en Supabase desde el inicio (no JSON estático), para que la fase 2 (panel admin) no requiera migración.
- Sin panel de administración todavía — los datos de la fase 1 se insertan directamente vía Supabase MCP.
- Hospedaje: GitHub Pages (frontend estático).

### Fuera de alcance (fase 1)

- Panel de administración / edición desde la app.
- Autenticación.
- Búsqueda, filtros, modo quiz, categorías más allá de la línea de tiempo.

Estos ítems son candidatos para una fase 2 con su propio spec.

## Arquitectura

- **Frontend**: HTML/CSS/JS vanilla, sin build ni framework. Desplegado en GitHub Pages sirviendo directo desde el repo (rama `main` o carpeta `/docs`, a decidir al configurar Pages).
- **Datos**: tabla `characters` en Supabase. El frontend la lee con `supabase-js` usando la clave pública `anon` (solo lectura).
- **Imágenes**: descargadas de JW.ORG y subidas a un bucket de Supabase Storage (`character-images`), para no depender de que JW.ORG mantenga las mismas URLs.
- **Escritura de datos (fase 1)**: se hace directo contra Supabase vía el MCP de Supabase durante la redacción de cada ficha; no hay UI de escritura en la app.
- **RLS**: lectura pública (`anon`) habilitada en `characters` y en el bucket de imágenes; escritura bloqueada hasta que exista autenticación (fase 2).

## Modelo de datos

Tabla `characters`:

```sql
create table characters (
  id text primary key,           -- slug, ej "david"
  name text not null,
  image_url text,                -- URL pública en Supabase Storage
  era_label text,                -- texto legible, ej "Época de los reyes, ~1040–970 a.E.C."
  era_sort_key integer,          -- año numérico para orden/posición en timeline (negativo = a.E.C.)
  lived_in text,
  known_for text,                -- contenido principal: por qué es conocido
  books text[],                  -- libros bíblicos donde aparece su historia
  sources text[]                 -- trazabilidad: de qué fuente (JW.ORG / libro) salió el texto
);

alter table characters enable row level security;

create policy "Public read access"
  on characters for select
  using (true);
```

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

## Proceso de contenido (fase 1)

1. El usuario sube fragmentos de fuentes (JW.ORG + libros) para cada uno de los 10-15 personajes elegidos.
2. Se redacta cada ficha (era, dónde vivió, conocido por, libros, fuente) basándose únicamente en esas fuentes — sin contenido inventado ni de otras fuentes.
3. El usuario revisa y aprueba el texto de cada ficha antes de insertarla en Supabase.
4. Se descarga la imagen correspondiente de JW.ORG y se sube al bucket de Storage.
5. Se inserta la fila en `characters` vía Supabase MCP.

## Manejo de errores

- Si `characters` está vacía o Supabase no responde, la app muestra un mensaje simple ("No se pudieron cargar los personajes") en vez de fallar en blanco.
- Si una imagen no carga, se muestra un placeholder con el nombre del personaje (sin romper el layout de la carta).

## Pruebas / validación

- Validación manual: abrir la app (local y en GitHub Pages), recorrer todas las cartas del seed, verificar que el orden en Timeline coincide con `era_sort_key`.
- No se contemplan pruebas automatizadas en fase 1 (app estática de contenido personal) — se valida a mano la estructura de cada fila antes de insertarla en Supabase.

## Fase 2 (fuera de alcance, futuro spec propio)

- Panel de administración con autenticación (login del usuario) para insertar/editar personajes sin usar SQL/MCP directo.
- Posibles extras a evaluar entonces: búsqueda, filtros por época/libro, modo quiz.

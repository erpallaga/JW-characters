# Josué (`josue`)

## Veredicto general

La ficha tiene datos fundamentales correctos, pero contiene un error de era cronológica y una grave falta de exhaustividad en el mapa de lugares. Solo lista 3 de los más de 20 sitios documentados de la conquista. Necesita corrección de cronología y expansión completa del recorrido (con tope de 15 seleccionados).

## Campos

### name — OK
- Actual: `Josué`
- Fuente: Perspicacia, it-1. La grafía es exacta según las publicaciones.

### eraId — CORREGIR
- Actual: `exodo`
- Propuesta: Crear era `conquista` o usar `entrada-canaan`
- Justificación: Josué fue servidor de Moisés *en la era del éxodo*, pero su vida de protagonista y la que define su personaje ocurre durante la *era de la conquista* (1473 a.e.c.). La era debe reflejar el período en el que vivió como líder, no como asistente.
- Fuente: Perspicacia, it-1, p. 1200002523. Brief del enjambre: "entrada en Canaán 1473 a.e.c."

### timeframe — CORREGIR
- Actual: `~1500–1390 a.e.c. aprox.`
- Propuesta: `~1475–1390 a.e.c. aprox.`
- Justificación: La entrada a Canaán fue 1473 a.e.c. (Brief, ancla). Josué dirigió la conquista en aproximadamente 6 años (Perspicacia: "en un período de unos seis años"). El inicio de ~1500 sitúa su nacimiento demasiado lejos. Si actuaba en Refidim (1513 a.e.c.) como joven, su nacimiento sería ~1520, no 1500. El fin de 1390 es coherente pero aproximado.
- Fuente: Perspicacia, it-1 pág. 1200002523. Brief: cronología de 1473 a.e.c. para entrada a Canaán.

### eraId + timeframe (alternativa unificada) — NOTA
Si no se crea era nueva, considerar ajustar a: `eraId: "exodo"`, `timeframe: "~1520–1390 a.e.c. (1513–1390 al menos); prominencia en conquista 1473–1467 a.e.c."`

### place — OK
- Actual: `Egipto → desierto → Canaán`
- Es una síntesis válida, aunque muy condensada.

### life — CORREGIR (parcialmente)
- Actual: `start: -1500, end: -1390, approx: true`
- Propuesta: `start: -1520, end: -1390, approx: true`
- Justificación: Si Josué dirigía hombres en Refidim (1513 a.e.c.), es más coherente que hubiera nacido ~1520 que ~1500. Perspicacia no da fecha de muerte exacta, pero el fin de -1390 es razonable (período post-conquista). El `approx: true` es correcto.
- Fuente: Perspicacia, it-1, batalla de Refidim (Éxodo 17:8, año 1513 a.e.c.).

### passages — OK
- Todos los versículos existen y son pertinentes:
  - Éxodo 17:8–13: ✓ primera batalla bajo Moisés
  - Números 13–14: ✓ misión como espía
  - Josué 1–6: ✓ comienza conquista
  - Josué 24: ✓ discurso final

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| "Asistente fiel de Moisés desde joven" | OK | Perspicacia, it-1 1200002523: "efraimita que sirvió a Moisés" | — |
| "uno de los dos espías que dieron buen informe sobre Canaán" | OK | Números 13:16 (Hosea hijo de Nun = Josué); Números 14:6-9 (solo él y Caleb dan buen informe) | — |
| "Sucedió a Moisés y dirigió la conquista de Canaán: Jericó, la coalición del sur y la del norte" | OK | Números 27:18-23; Josué 1–11 | — |
| "Al final de su vida declaró: 'escoge hoy a quién sirvan... pero yo y mi casa serviremos a Jehová'" | OK | Josué 24:15 (versión NWM: "Ahora, si no les parece bien servir a Jehová, elijan hoy a quién van a servir... Pero los de mi casa y yo, nosotros serviremos a Jehová") | — |
| "Su fidelidad contrasta con la generación infiel del desierto" | OK | Números 14:27-38; Perspicacia. Josué fue de los únicos varones registrados que entró (además de Caleb) | — |

## Mapa

### Recorrido completo

| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Refidim | Éxodo 17:8 | Ubicación discutida en Sinaí; valle donde acampó Israel en su ruta post-Éxodo | 33.50 | 29.00 | baja | — |
| 2 | Monte Sinaí | Éxodo 24:13; 32:1 | Tradición: Jebel Musa, península del Sinaí, ~2.285 m; coordenadas aproximadas | 33.8974 | 28.5373 | media | sinai |
| 3 | Desierto de Parán | Números 13:2-3 | Región desértica vasta al S. de Canaán; campamento base de espías | 33.50 | 30.50 | baja | — |
| 4 | Sitim | Josué 2:1 | "Llanuras de Moab", último campamento antes de cruzar Jordán, al E. | 35.50 | 31.65 | media | — |
| 5 | Jordán (cruce) | Josué 3:14-17 | Río entre Sitim y Guilgal, cruce en lugar de aguas detenidas | 35.44 | 31.75 | alta | jordan |
| 6 | Guilgal | Josué 5:10 | Primer campamento al O. del Jordán, cerca de Jericó, circuncisión y Pascua | 35.45 | 31.85 | media | — |
| 7 | Jericó | Josué 6:1-26 | Ciudad cananea derribada, muros cayeron (primera ciudad capturada) | 35.444 | 31.87 | alta | jerico |
| 8 | Hai | Josué 7:2–8:29 | "Montón de Ruinas", al E. de Betel; segunda ciudad capturada tras derrota inicial | 35.23 | 31.95 | media | — |
| 9 | Betel | Josué 8:9, 12, 17 | "Casa de Dios"; ciudad cananea N. de Hai; Beitín moderno, 17 Km. N. de Jerusalén | 35.20 | 31.94 | media | — |
| 10 | Monte Ebal y Guerizim | Josué 8:30-35 | Montes donde leyó bendición y maldición; al S. de Siquem | 35.27 | 32.17 | media | — |
| 11 | Gabaón | Josué 9:3–10:14 | El-Jib, a 9,5 Km. al NNO. de Jerusalén; pacto con gabaonitas; batalla milagrosa | 35.20 | 31.88 | media | — |
| 12 | Jerusalén | Josué 10:1 | Ciudad real; Adoni-zédeq atacó a Gabaón; Jehová favoreció a Israel | 35.236 | 31.768 | alta | jerusalen |
| 13 | Maquedá | Josué 10:16-27 | Ciudad cananea; capturada tras huida de reyes; cinco reyes ejecutados en cueva | 35.30 | 31.65 | baja | — |
| 14 | Libná | Josué 10:29-30 | Ciudad cananea del S.; capturada tras Maquedá | 35.15 | 31.55 | baja | — |
| 15 | Lakís | Josué 10:31-33 | Ciudad cananea fortificada; asediada y capturada | 35.00 | 31.57 | baja | — |
| 16 | Eglón | Josué 10:34-35 | Ciudad cananea; capturada en la serie del sur | 35.10 | 31.40 | baja | — |
| 17 | Hebrón | Josué 10:36-37 | Ciudad real importante; capturada en la campaña del sur | 35.209 | 31.535 | media | hebron |
| 18 | Debir | Josué 10:38-39 | Kiriat-séfer; ciudad del sur; capturada como conclusión de campaña meridional | 35.10 | 31.35 | baja | — |
| 19 | Hazor | Josué 11:1-13 | "La ciudad principal del N. de Canaán"; Tell el-Qedah, 11 Km. al SSE. de Quedes; incendiada por Josué | 35.29 | 32.74 | media | — |
| 20 | Aguas de Merom | Josué 11:5-7 | Lago o embalse al N.; batalla final contra coalición septentrional | 35.30 | 32.95 | baja | — |
| 21 | Siquem | Josué 24:1, 32 | Ciudad al N.; entierro de José; Josué reunió tribus para discurso de fidelidad | 35.27 | 32.21 | media | — |
| 22 | Siló | Josué 18:1 | Khirbet Seilun, 15 Km. al NNE. de Betel; tabernáculo instalado; distribución de tierra | 35.24 | 32.00 | media | silo |
| 23 | Timnat-sérah | Josué 19:49-50; 24:30 | Khirbet Tibnah, 30 Km. al SO. de Siquem; ciudad edificada por Josué; lugar de entierro | 35.10 | 32.15 | media | — |

### Selección (máx. 15)

`["jerico", "guilgal", "hai", "betel", "gabaon", "jerusalen", "hebreon", "hazor", "siquem", "silo", "timnat-serah", "sinai", "jordan", "egipto", "desierto-sinai"]`

**ruta**: sí (Josué realizó un viaje extenso de conquista, norte-sur del país)
**zoom**: no hace falta (los puntos abarcan toda Canaán y el Sinaí; zoom normal incluye la región)

**Justificación**: Recorrido que narra la historia de Josué de principio a fin: salida de Sinaí (encuentro con Jehová), cruce del Jordán (milagro), conquista de Jericó (inicio), ciudades del sur (Hai, Betel, Gabaón, Hebrón), norte (Hazor), reunión final en Siquem, entierro en Timnat-sérah. Incluye puntos de fidelidad (Sinaí, Jordán) y los hechos militares clave que definen su liderazgo. Se excluyen sitios intermedios menos significativos (Maquedá, Libná, Lakís, Eglón, Debir, Merom) que sirven de detalles de la conquista pero no son hitos narrativos centrales.

### Lugares nuevos para `lugares.json`

```json
[
  {"id": "refidim", "label": "Refidim", "lon": 33.50, "lat": 29.00},
  {"id": "desierto-paran", "label": "Desierto de Parán", "lon": 33.50, "lat": 30.50},
  {"id": "sitim", "label": "Sitim", "lon": 35.50, "lat": 31.65},
  {"id": "guilgal", "label": "Guilgal", "lon": 35.45, "lat": 31.85},
  {"id": "hai", "label": "Hai", "lon": 35.23, "lat": 31.95},
  {"id": "betel", "label": "Betel", "lon": 35.20, "lat": 31.94},
  {"id": "montes-ebal-guerizim", "label": "Montes Ebal y Guerizim", "lon": 35.27, "lat": 32.17},
  {"id": "gabaon", "label": "Gabaón", "lon": 35.20, "lat": 31.88},
  {"id": "maqueda", "label": "Maquedá", "lon": 35.30, "lat": 31.65},
  {"id": "libna", "label": "Libná", "lon": 35.15, "lat": 31.55},
  {"id": "lakis", "label": "Lakís", "lon": 35.00, "lat": 31.57},
  {"id": "eglon", "label": "Eglón", "lon": 35.10, "lat": 31.40},
  {"id": "debir", "label": "Debir", "lon": 35.10, "lat": 31.35},
  {"id": "hazor", "label": "Hazor", "lon": 35.29, "lat": 32.74},
  {"id": "aguas-merom", "label": "Aguas de Merom", "lon": 35.30, "lat": 32.95},
  {"id": "siquem", "label": "Siquem", "lon": 35.27, "lat": 32.21},
  {"id": "timnat-serah", "label": "Timnat-sérah", "lon": 35.10, "lat": 32.15}
]
```

## No verificado

- **Refidim**: Ubicación exacta no resuelta en fuentes consultadas; Perspicacia solo sitúa en Sinaí general.
- **Desierto de Parán**: Región vasta; coordenadas son punto central de estimación.
- **Sitim**: Identificación con "Llanuras de Moab" clara, pero coordenadas precisas requieren fuente arqueológica no disponible en Perspicacia.
- **Maquedá, Libná, Lakís, Eglón, Debir**: Perspicacia identifica como ciudades capturadas pero sin coordenadas precisas; se usan estimaciones basadas en geografía bíblica relativa.
- **Aguas de Merom**: Perspicacia no identifica lago moderno específico; coordenadas estimadas.
- Cronología exacta de muerte de Josué (1390 vs. 1370 a.e.c.): Perspicacia no especifica; se usa aproximación del brief.

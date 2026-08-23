# Isaac (`isaac`)

## Veredicto general
Las fechas y hechos son precisos según Perspicacia. Falta exhaustividad en lugares: la ficha omite Guerar, Hebrón y Beer-lahai-roí donde vivió explícitamente. Una corrección menor de redacción en knownFor.

## Campos

### name — OK
- Actual: `Isaac`
- Perspicacia lo llama "ISAAC". Grafía correcta.

### eraId — OK
- Actual: `patriarcas`
- Encaja con el contexto de la época patriarcal (1918-1738 a.e.c.)

### timeframe — OK
- Actual: `~1918–1738 a.e.c.`
- Perspicacia: "Isaac fue destetado aproximadamente a los cinco años, y estuvo a punto de ser ofrecido en sacrificio quizás cuando tenía veinticinco; se casó a los cuarenta años, llegó a ser padre de hijos gemelos a los sesenta y murió cuando contaba ciento ochenta años." Perspicacia especifica: "había nacido en el año 1918 a. E.C." (destete en 1913 a.e.c., matrimonio 1878 a.e.c., gemelos 1858 a.e.c., muerte 1738 a.e.c.). Todas las fechas coinciden exactamente.

### place — CORREGIR
- Actual: `Canaán`
- Perspicacia menciona explícitamente los lugares donde Isaac residió:
  - Monte Moriá (Génesis 22)
  - Guerar, territorio filisteo (Génesis 26:1-6)
  - Beer-Seba (Génesis 26:23-33)
  - El Négueb, "cerca de Beer-lajai-roí" donde vivía cuando se casó (Génesis 24:62)
  - Hebrón (Quiryat-arbá) donde residía cuando envejeció (Génesis 35:27)
- Propuesta: Cambiar a `Guerar, Beer-Seba, Hebrón` (o similar que sea exhaustivo). "Canaán" es demasiado genérico.

### eraId (nuevamente verificado) — OK
La era "patriarcas" es correcta.

### passages — OK
- Todos los versículos existen y dicen lo que prometen:
  - Génesis 22: el sacrificio ✓
  - Génesis 24: Rebeca ✓
  - Génesis 26: renovación del pacto ✓
  - Hebreos 11:17–20: fe de Isaac ✓

### life — OK
- `start: -1918, end: -1738, approx: true`
- Perspicacia confirma estas fechas exactas. El campo `approx: true` es apropiado pues aunque Perspicacia da fechas específicas, están basadas en cronología bíblica acumulativa.

## knownFor
| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| Hijo de Abrahán y Sara, nacido cuando ambos eran ancianos | OK | Perspicacia: "El único hijo de Abrahán y de su esposa Sara." "Tanto su padre como su madre eran muy ancianos." (Génesis 18:11). | — |
| Sobrevivió al episodio del sacrificio en el monte Moriá, donde su padre demostró obediencia extrema | OK | Perspicacia: "Abrahán alzó el cuchillo, pero el ángel de Jehová le detuvo la mano" (Génesis 22:9-14). | — |
| Esposo de Rebeca, elegida por fe del criado de Abrahán | CORREGIR (redacción) | Perspicacia: "La escogida por Jehová resultó ser Rebeca... desde el mismo principio la selección se colocó en las manos de Jehová." | Cambiar a: "elegida por Jehová" o "escogida por Jehová", omitiendo "por fe del criado". |
| Padre de Jacob y Esaú | OK | Perspicacia: "Finalmente, en el año 1858 a. E.C., cuando Isaac tenía sesenta años, recibió la doble bendición de tener gemelos: Esaú y Jacob." | — |
| Dios renovó con él el pacto hecho a su padre | OK | Perspicacia: "Jehová repitió y amplió el pacto que había hecho con él, pacto que después de su muerte revalidó con su hijo Isaac" (Génesis 22:15-18, 26:1-5). | — |

## Mapa

### Recorrido completo
| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Monte Moriá | Génesis 22:2-14 | Perspicacia (it-1 Isaac): el sacrificio ocurrió "en la tierra de Moria". Identificación tradicional con el Templo de Jerusalén. | 35.2354 | 31.7780 | alta | moria |
| 2 | Guerar | Génesis 26:1-31 | Perspicacia (it-1 Guerar): "Lugar cercano a Gaza... en las estribaciones de las montañas de Judea, a unos 19 Km. al SE. de la moderna Gaza." Tell Abu Hureirah (Tel Haror). Abrahán y después Isaac vivieron allí. | 34.6500 | 31.4500 | media | — |
| 3 | Beer-Seba | Génesis 26:23-33 | Perspicacia (it-1 Isaac): "En el límite de la árida región del Négueb... Los hombres de Isaac hallaron agua en ese lugar, e Isaac lo llamó Sibá" (Génesis 26:32-33). | 34.7913 | 31.2518 | alta | beerseba |
| 4 | Hebrón | Génesis 35:27 | Perspicacia (it-1 Isaac): "Cuando Jacob regresó muchos años más tarde, Isaac residía en Quiryat-arbá, es decir, Hebrón, en la región montañosa." Identificado con la actual Hebrón. | 35.2099 | 31.5322 | alta | hebron |
| 5 | Beer-lajai-roí | Génesis 24:62-63 | Perspicacia (it-1 Isaac): "el largo viaje hacia el Négueb, cerca de Beer-lajai-roí, donde vivía Isaac en aquel tiempo" (cuando se casó con Rebeca, 1878 a.e.c.). Véase Génesis 24:62. | DUDOSO | DUDOSO | baja | — |

### Selección (máx. 15)
`["moria", "guerar", "beerseba", "hebron"]` — ruta: sí — zoom: no hace falta
Justificación: Los cuatro lugares narran la vida de Isaac: el acto de fe (Moriá), el período de adversidad (Guerar), el asentamiento (Beer-Seba) y la residencia final (Hebrón). Beer-lajai-roí omitido por falta de confirmación de su ubicación exacta en Perspicacia.

### Lugares nuevos para `lugares.json`
```json
[
  {
    "id": "guerar",
    "label": "Guerar",
    "lon": 34.65,
    "lat": 31.45
  }
]
```

## No verificado
- **Beer-lajai-roí**: No encontré entrada de Perspicacia con esta grafía. Se menciona en Génesis 24:62 como lugar donde Isaac vivía cuando Rebeca llegó. Perspicacia (it-1 Isaac) lo menciona pero no proporciona descripción de su ubicación exacta ni identificación con yacimiento moderno. Se necesita búsqueda adicional o aceptar ubicación estimada.

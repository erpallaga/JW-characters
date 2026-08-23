# Moisés (`moises`)

## Veredicto general
Ficha bien estructurada; las fechas son precisas según Perspicacia. El timeframe conviene actualizar a cifras exactas. El mapa carece de la exhaustividad esperada: faltan lugares clave del itinerario del desierto donde la Biblia y Perspicacia documentan su presencia explícita.

## Campos

### name — OK
- Actual: `Moisés`
- Propuesta: ninguna
- Fuente: Perspicacia (1200003118): "MOISÉS (Sacado [es decir, salvado del agua])"

### eraId — OK
- Actual: `exodo`
- Propuesta: ninguna
- Fuente: Perspicacia confirma que vivió durante el período del éxodo (1593–1473 a.e.c.)

### timeframe — CORREGIR
- Actual: `~1500 a.e.c.`
- Propuesta: `1593–1473 a.e.c.`
- Fuente: Perspicacia (1200003118): "Nació en Egipto en el año 1593 a. E.C." y murió a los 120 años "en la primavera de 1473 a. E.C.". La aproximación (~1500 a.e.c.) es imprecisa; las publicaciones usan fechas exactas.

### place — OK
- Actual: `Egipto y el desierto del Sinaí`
- Propuesta: ninguna
- Fuente: Perspicacia y Números 33 documentan su presencia en ambos lugares, aunque el mapa debería listar los lugares específicos.

### life — OK
- Actual: `"start": -1593, "end": -1473`
- Propuesta: ninguna
- Fuente: Perspicacia (1200003118): "Nació en Egipto en el año 1593 a. E.C." y "Moisés tenía ciento veinte años de edad cuando falleció", murió en 1473 a.e.c.

### passages — OK
- Actual: Éxodo 3 (zarza ardiente), Éxodo 14 (mar Rojo), Éxodo 20 (Diez Mandamientos)
- Propuesta: ninguna
- Fuente: Los versículos existen y describen los eventos mencionados (verificado en NWT a través de wol.py)

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| Criado en la corte egipcia | OK | Perspicacia: "Como miembro de la casa de Faraón, se le 'instruyó en toda la sabiduría de los egipcios' y se hizo 'poderoso en sus palabras y hechos'" (Hch 7:20-22) | ninguna |
| Educado en su identidad hebrea | OK | Perspicacia: "su propia madre consiguió criarlo y educarlo debido a que la tomó a su servicio la hija de Faraón" (Éx 2:1-10) | ninguna |
| Huyó a Madián tras matar a un egipcio | OK | Perspicacia: "A los cuarenta años... mató al egipcio, y luego lo escondió en la arena" (Éx 2:11-15, Hch 7:23-29) | ninguna |
| Pasó allí cuarenta años como pastor | OK | Perspicacia: "Cuarenta años en Madián" y "Tenía que pasar por otros cuarenta años de preparación" | ninguna |
| Dios lo comisionó desde una zarza ardiente | OK | Perspicacia: "se sorprendió al ver una zarza que ardía sin consumirse... el ángel de Jehová le habló desde las llamas" (Éx 3:1-15) | ninguna |
| Guio al pueblo a través del mar Rojo | OK | Perspicacia y Éxodo 14 documentan este evento milagroso | ninguna |
| En el monte Sinaí recibió los Diez Mandamientos y la Ley | OK | Perspicacia: "en dos ocasiones permaneció allí cuarenta días y cuarenta noches" y recibió "las 'Diez Palabras' o Diez Mandamientos" (Éx 31:18, Dt 4:13) | ninguna |

## Mapa

### Recorrido completo

| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Ramesés | Éx 12:37; Nú 33:3-5 | Punto de partida, probablemente cercano a Menfis en el N. de Egipto, en el Delta | 30.8044 | 31.2965 | media | `egipto` |
| 2 | Sucot | Éx 12:37; Nú 33:5 | "Punto de reunión" en la tierra de Gosén, en el Delta oriental | 31.1219 | 30.8033 | media | NO |
| 3 | Etam | Éx 13:20; Nú 33:6 | "En la orilla del desierto", transición entre Gosén y el desierto de Sinaí | 31.2000 | 30.6500 | baja | NO |
| 4 | Pi-hahirot | Éx 14:1-2; Nú 33:7 | "Entre Migdol y el mar, a vista de Baal-zefón", en la costa oriental del Delta | 31.8547 | 30.4222 | media | NO |
| 5 | Mará | Éx 15:22-25; Nú 33:8 | "Tres días por el desierto de Ezam" luego encontraron agua amarga, península del Sinaí | 32.4000 | 29.8000 | baja | NO |
| 6 | Elim | Éx 15:27; Nú 33:9 | "Wadi Gharandel, en la península del Sinaí, a unos 88 Km. al SSE. de Suez", con 12 manantiales y 70 palmeras | 32.6500 | 29.6500 | media | NO |
| 7 | Refidim | Éx 17:1; Nú 33:14 | "Donde no había agua para que el pueblo bebiera", en la península del Sinaí | 33.6500 | 28.7333 | baja | NO |
| 8 | Desierto de Sinaí | Éx 19:1; Nú 33:15 | "Al tercer mes del éxodo de Egipto" llegaron al monte Horeb/Sinaí | 33.8974 | 29.5031 | media | `sinai` |
| 9 | Cadés-barnea | Nú 13:26; 20:1 | "ʽAin Qedeis, a unos 80 Km. al SSO. de Beer-seba", en el desierto de Zin | 34.4661 | 31.0494 | media | NO |
| 10 | Monte Nebo | Dt 32:48-52; 34:1-4 | "Jebel en-Neba (Har Nevo), altitud de más de 800 m., a unos 17 Km. al E. de la desembocadura del Jordán" | 35.4919 | 31.8989 | alta | NO |

### Selección (máx. 15)
`["egipto", "sinai", "cadés-barnea", "monte-nebo"]` — ruta: sí — zoom: no hace falta

Justificación: Estos cuatro lugares marcan los hitos fundamentales: salida de Egipto, permanencia en el Sinaí (donde recibió la Ley), el desierto de vagabundeo (Cadés), y muerte en el Nebo. Los lugares intermedios del itinerario (Sucot, Etam, Pi-hahirot, Mará, Elim, Refidim) son etapas del viaje documentadas pero menos centrales al relato de Moisés como libertador y legislador. Se podrían añadir hasta totalizar 12-15 si se desea mayor detalle cronológico.

### Lugares nuevos para `lugares.json`
```json
[
  {"id": "sucot", "label": "Sucot", "lon": 31.1219, "lat": 30.8033},
  {"id": "etam", "label": "Etam", "lon": 31.2000, "lat": 30.6500},
  {"id": "pi-hahirot", "label": "Pi-hahirot", "lon": 31.8547, "lat": 30.4222},
  {"id": "mará", "label": "Mará", "lon": 32.4000, "lat": 29.8000},
  {"id": "elim", "label": "Elim", "lon": 32.6500, "lat": 29.6500},
  {"id": "refidim", "label": "Refidim", "lon": 33.6500, "lat": 28.7333},
  {"id": "cadés-barnea", "label": "Cadés-barnea", "lon": 34.4661, "lat": 31.0494},
  {"id": "monte-nebo", "label": "Monte Nebo", "lon": 35.4919, "lat": 31.8989}
]
```

## No verificado
- Coordenadas exactas de Sucot, Etam, Pi-hahirot, Mará, Refidim: Perspicacia no proporciona identificaciones modernas precisas con coordenadas; he utilizado aproximaciones basadas en descripciones y tradición.
- La duración exacta de la estancia en Madián: la Biblia y Perspicacia hablan de "cuarenta años" pero no ofrecen referencias de fechas.

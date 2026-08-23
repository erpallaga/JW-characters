# Jonás (`jonas`)

## Veredicto general

La ficha es sustancialmente correcta en sus campos. El mapa está incompleto pero defensible: falta Tarsis, que es problemático porque su ubicación exacta es discutida en Perspicacia. No debería añadirse sin resolver la ambigüedad de su posición.

## Campos

### name — OK
- Actual: `Jonás`
- Perspicacia lo escribe así. Fuente: it-1, entrada "Jonás" — https://wol.jw.org/es/wol/d/r4/lp-s/1200002503

### eraId — OK
- Actual: `reino_dividido`
- Correcto. Jonás fue "profeta en el reino de diez tribus durante el reinado de Jeroboán II" (~844 a.e.c.). Fuente: it-1: "De modo que al parecer Jonás fue profeta en el reino de diez tribus durante el reinado de Jeroboán II" — https://wol.jw.org/es/wol/d/r4/lp-s/1200002503

### timeframe — OK
- Actual: `~844 a.e.c. aprox.`
- Perspicacia no da fecha exacta, pero menciona "Jonás (c. 844 a. E.C.)" en contexto de Jeroboán II. El valor es razonable. Fuente: it-1 — https://wol.jw.org/es/wol/d/r4/lp-s/1200002503

### place — OK
- Actual: `Gat-hefer, Israel; misión a Nínive (Asiria)`
- Perspicacia: "profeta de Jehová de Gat-héfer" y "comisionado para proclamar juicio contra Nínive". Correcto. Fuente: it-1 — https://wol.jw.org/es/wol/d/r4/lp-s/1200002503

### life.start / life.end — DUDOSO
- Actual: `start: -870, end: -800, approx: true`
- Perspicacia no proporciona fechas de nacimiento ni muerte de Jonás. Solo lo sitúa durante el reinado de Jeroboán II (~786-746 a.e.c.). Las fechas -870 a -800 son puramente especulativas y muy amplias. Debería revisarse si hay mejor base en otras publicaciones de jw.org. Fuente: it-1 no proporciona fechas — https://wol.jw.org/es/wol/d/r4/lp-s/1200002503

### passages — OK
- 2 Reyes 14:25 (mención) — verificado
- Jonás 1–4 (libro entero) — verificado
- Mateo 12:39–41 (Jesús lo menciona) — verificado
Fuente: it-1 — https://wol.jw.org/es/wol/d/r4/lp-s/1200002503

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| "Profeta enviado a predicar en Nínive, capital enemiga de Asiria" | OK | it-1: "Jehová lo comisionó para proclamar juicio contra Nínive" | — |
| "Intentó huir en barco, fue tragado por un gran pez tras tres días" | OK | it-1: "En el puerto de Jope consiguió un pasaje en una nave que se dirigía a Tarsis […] Cuando se hundió en el agua, se le envolvieron algas marinas […] se halló dentro de un gran pez. Jonás oró a Jehová […] Al tercer día el pez vomitó al profeta en tierra seca" (Jonás 1:17–2:10) | — |
| "luego obedeció" | OK | it-1: "Cuando se le comisionó por segunda vez para ir a Nínive, Jonás emprendió el largo viaje hacia esa ciudad" | — |
| "Predicó en la ciudad y sus habitantes, desde el rey hasta el más humilde, se arrepintieron y fueron perdonados" | OK | it-1: "Finalmente Jonás comenzó a entrar en la ciudad por distancia de un día de camino […] Algunos críticos consideran increíble que los ninivitas, incluido el rey, respondieran a la predicación de Jonás. […] sin embargo, son interesantes a este respecto las observaciones del comentarista C. F. Keil" (explica por qué es verosímil el arrepentimiento) | — |
| "Su libro enseña sobre la obediencia, el perdón divino y el peligro de la compasión parcial" | OK | it-1: "Por medio de esta calabaza vinatera se le enseñó a Jonás una lección de misericordia […] Jonás debió comprender bien la lección a juzgar por la franca narración que hace de sus experiencias" | — |

## Mapa

### Recorrido completo

| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Gat-héfer | 2 Reyes 14:25; Jonás 1:1 | "profeta de Jehová de Gat-héfer […] ciudad limítrofe del territorio de Zabulón" (en el mapa de Perspicacia) | 35.3419 | 32.7392 | alta | gat-hefer |
| 2 | Jope | Jonás 1:3 | "En el puerto de Jope consiguió un pasaje en una nave que se dirigía a Tarsis […] puerto marítimo del Mediterráneo" (lat. 34.7500, lon. 32.0533) | 34.75 | 32.0533 | alta | jope |
| 3 | Tarsis | Jonás 1:3; 4:2 | "que por lo general se relaciona con España […] Algunos eruditos la identifican con la isla de Cerdeña […] La mayor parte de los eruditos relacionan Tarsis con España, basándose en referencias antiguas […] parece haber buena razón para creer que los descendientes de Javán (los jonios) […] llegaron hasta la península ibérica" | — | — | baja | — |
| 4 | Nínive | Jonás 1:2; 3:1-4 | "ciudad enemiga […] Cuando se le comisionó por segunda vez para ir a Nínive, Jonás emprendió el largo viaje hacia esa ciudad. Finalmente Jonás comenzó a entrar en la ciudad por distancia de un día de camino" | 43.1525 | 36.3597 | alta | ninive |

### Selección (máx. 15)

`["gat-hefer", "jope", "ninive"]`

Ruta: sí  
Zoom: no hace falta (4 puntos; Tarsis quedaría fuera porque es discutido)  
Justificación: Los tres lugares documentados con ubicación clara (Gat-héfer, Jope, Nínive) trazan el viaje de Jonás. Tarsis se omite de la selección porque Perspicacia no proporciona una ubicación única y precisa; incluirlo fingir ía certeza donde hay discusión académica (España vs. Cerdeña vs. ubicación desconocida).

### Lugares nuevos para `lugares.json`

```json
[
  {"id": "tarsis", "label": "Tarsis", "lon": null, "lat": null, "nota": "ubicación discutida: posiblemente España o Cerdeña; Perspicacia no da coordenadas precisas"}
]
```

**Recomendación sobre Tarsis**: Perspicacia dice que Tarsis se identifica "por lo general" con España, pero documenta alternativas (Cerdeña). Dado que el brief solicita no fingir precisión cuando un lugar es discutido, se recomienda:
1. No incluir Tarsis en el mapa con lon/lat precisos.
2. O incluirlo como ubicación con confianza muy baja y nota explicativa.
3. O dejar fuera del mapa por ahora hasta que haya consenso en fuentes jw.org.

## No verificado

- **Tarsis y su ubicación**: Perspicacia documenta que es "por lo general" España, pero menciona debate académico (Cerdeña como alternativa). No hay una ubicación única. Esto es problema real para el mapa, no dudas menores. Fuente: it-1, entrada "Tarsis" — https://wol.jw.org/es/wol/d/r4/lp-s/1200004325
- **Fechas de vida de Jonás (start/end)**: Perspicacia no las proporciona. Solo sitúa a Jonás en el reinado de Jeroboán II (~786-746 a.e.c.). Las fechas -870 a -800 en la ficha son especulativas.

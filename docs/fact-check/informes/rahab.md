# Rahab (`rahab`)

## Veredicto general

Los datos principales son correctos: Jericó, la fe, el cordón escarlata, su rol en Mateo 1 y Hebreos 11. Sin embargo, hay imprecisiones en las fechas de vida (especialmente el final) y falta contextualización sobre dónde vivió después de la conquista. La ficha merece correcciones menores.

## Campos

### name — OK
- Actual: `Rahab`
- Fuente: Perspicacia, it-1, docid 1200003623. La grafía es exacta.

### eraId — OK
- Actual: `exodo`
- Justificación: Aunque Rahab actuó en la *conquista* (1473 a.e.c.), su vida se enmarca narrativamente dentro del período del éxodo-desierto en sentido amplio. Sin embargo, técnicamente ocurre en la era de la *entrada a Canaán / conquista*. Similar a Josué: podría ser `conquista`, pero si se mantiene `exodo` como era que abarca el período de emancipación de Egipto hasta establecimiento en Canaán, es aceptable. **Nota**: Coherencia con decisión sobre Josué.

### timeframe — OK (aproximado)
- Actual: `~1473 a.e.c.`
- Fuente: Perspicacia, it-1, docid 1200003623: "En la primavera del año 1473 a. E.C., dos espías israelitas entraron en Jericó y se alojaron en su casa."
- Justificación: La data es la del evento central (acogida de espías), no necesariamente su vida completa. Perspicacia no da fechas precisas de nacimiento o muerte. El `~1473` es correcto para el hito que la define.

### place — OK
- Actual: `Jericó, Canaán`
- Fuente: Josué 2:1; Perspicacia
- Justificación: Lugar explícito donde vivió. **Añadidura posible pero no obligatoria**: Perspicacia menciona que "Después de estar aislados del campamento de Israel durante cierto tiempo, Rahab y su familia tuvieron permiso de morar entre los israelitas" (Josué 6:25). El lugar específico donde se instalaron no es bíblicamente explícito, aunque la genealogía de Rut sugiere vínculos con Belén (su hijo Boaz vivía allí). Sin coordenadas bíblicas concretas, no entra en `place`.

### life — CORREGIR (parcialmente)
- Actual: `start: -1500, end: -1440, approx: true`
- Propuesta: `start: -1500, end: null, approx: true` **O** `start: -1500, end: -1450, approx: true`
- Justificación:
  - **start: -1500**: Aproximadamente correcto. Si actuó en 1473 y fue una "mujer" (adulta joven), nació probablemente ~1500-1490. Perspicacia no lo especifica, así que el `-1500` es razonable como estimación.
  - **end: -1440**: INCORRECTO o DUDOSO. Perspicacia no da fecha de muerte de Rahab. Se sabe que se casó con Salmón y fue madre de Boaz (Mateo 1:5; Rut 4:20-21). Boaz vivía en Belén y fue juez importante en tiempo de los jueces. Si nació en 1500 y murió de muerte natural (edad 70-80 años), habría muerto ~1430-1420 a.e.c., no 1440. El `-1440` es inventado sin base.
  - **Propuesta mejor**: O dejar `end: null` (desconocido), o usar `-1450 a.e.c.` como estimación muy aproximada si se asume vida normal (50 años tras 1473).
- Fuente: Perspicacia, it-1, 1200003623. Brief: cronología de 1473 a.e.c. para entrada a Canaán.

### passages — OK
- Todos los versículos existen y son pertinentes:
  - Josué 2:1-7: ✓ acogida de espías
  - Josué 6:22-25: ✓ rescate de Rahab y familia
  - Mateo 1:5: ✓ genealogía de Jesús (esposa de Salmón, madre de Boaz)
  - Hebreos 11:31: ✓ ejemplo de fe
  - Santiago 2:25: ✓ justificada por obras
- **Nota sobre Perspicacia**: El texto de Perspicacia cita Santiago 2:25 y Hebreos 11:30-31 como paralelos de su fe. Todas las referencias son válidas.

## knownFor

| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| "Mujer cananea de Jericó" | OK | Josué 2:1; Perspicacia | — |
| "que escondió a los espías israelitas" | OK | Josué 2:1-7: "ella los había llevado arriba al techo y los había escondido entre unos tallos de lino" | — |
| "reconociendo que Jehová era 'el Dios del cielo arriba y de la tierra abajo'" | OK | Josué 2:11 (versión cercana): "Sé que Jehová les ha dado la tierra"; Perspicacia cita su confesión de fe | — |
| "Colgó un cordón escarlata en su ventana" | OK | Josué 2:18, 21: "Ella dijo, 'De acuerdo con vuestras palabras, sea así'. Y los despidió, y ellos se fueron. Y ella ató un cordón de hilo escarlata a la ventana." | — |
| "ella y su familia fueron las únicas sobrevivientes de la ciudad" | OK | Josué 6:22-25: "Josué [...] ordenó a los dos hombres que habían espiado la tierra, diciendo, 'Entren en la casa de la prostituta y saquen de allí a la mujer y todo lo que sea de ella [...]. Y sacaron a Rahab y a su padre y a su madre y a sus hermanos [...]. Y ellos los sacaron a un lugar seguro." | — |
| "Se convirtió en ancestro del Mesías" | OK | Mateo 1:5: "Salmón fue padre de Boaz (la madre fue Rahab)" (genealogía de Jesús) | — |
| "y aparece entre los ejemplos de fe de Hebreos 11" | OK | Hebreos 11:31: "Por la fe, Rahab la prostituta no murió con los que fueron desobedientes, pues recibió a los espías de manera pacífica" | — |
| "Es un ejemplo de que Jehová puede usar a cualquiera que demuestre fe genuina" | OK | Perspicacia cita su contraste: cananea, prostituta, pero elegida por fe. Hebreos 11:31; Santiago 2:25 lo confirman | — |

## Mapa

### Recorrido completo

| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Jericó | Josué 2:1; 6:22-25 | Ciudad real cananea; primera ciudad capturada por Israel tras cruce del Jordán | 35.444 | 31.87 | alta | jerico |

**Nota**: Perspicacia no especifica ningún otro lugar donde Rahab vivió después de 1473 a.e.c. El texto dice: "Después de estar aislados del campamento de Israel durante cierto tiempo, Rahab y su familia tuvieron permiso de morar entre los israelitas" (Josué 6:25). El lugar de residencia posterior no es nombrado explícitamente. Su hijo Boaz vivía en Belén (Rut 2-4), lo que sugiere que ella vivió allí o en territorio de Judá, pero esto es inferencia, no referencia explícita. Por lo tanto, solo Jericó entra en el recorrido verificable.

### Selección (máx. 15)

`["jerico"]`

**ruta**: no (Rahab no realizó viaje documentado; vivió en un lugar)
**zoom**: no hace falta (un punto único no requiere zoom especial)

**Justificación**: Rahab tiene un solo lugar bíblicamente documentado donde estuvo: Jericó. Su importancia narrativa reside no en la geografía, sino en el acto de fe en ese lugar. La ficha es correcta al listar solo Jericó.

### Lugares nuevos para `lugares.json`

Ninguno. Jericó ya existe en el nomenclátor (`jerico`).

## No verificado

- **Lugar de residencia post-1473 a.e.c.**: Perspicacia dice que Rahab y su familia "tuvieron permiso de morar entre los israelitas", pero no especifica dónde. Rut 2–4 menciona a Boaz en Belén, su hijo, lo que sugiere Judá, pero no se cita a Rahab directamente en ese contexto. **DUDOSO**: la afirmación de que "vivió después de Jericó" sin lugar nombrado.
- **Fecha exacta de muerte**: Perspicacia no proporciona fecha de muerte de Rahab. La propuesta de `-1440` en la ficha actual es sin fuente. Es especulación razonable (si nació ~1500, muerte natural ~1450-1430), pero no verificada.
- **Edad en 1473**: Perspicacia no la especifica. Llamarla "mujer" (adulta joven) es más seguro que asignar 27 años exactos.

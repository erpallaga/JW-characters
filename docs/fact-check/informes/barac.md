# Barac (`barac`)

## Veredicto general
La ficha está bien estructurada y contiene información verificada. Las fechas estimadas carecen de base explícita en Perspicacia, pero son razonables dentro del período de Jueces. Se podría mejorar ligeramente la precisión en los lugares de la batalla (falta Cisón).

## Campos

### name — OK
- Actual: `Barac`
- Grafía correcta según Perspicacia: "BARAC (Relámpago). Hijo de Abinoam, de Quedes, ciudad que pertenecía al territorio de Neftalí." — https://wol.jw.org/es/wol/d/r4/lp-s/1200000559

### eraId — OK
- Actual: `jueces`
- Encaja correctamente con el período de los jueces

### timeframe — DUDOSO
- Actual: `~1250 a.e.c.`
- Perspicacia no proporciona una fecha específica para Barac. Solo dice que fue "Al principio de la época de los jueces" cuando "los israelitas se desviaron de la adoración verdadera, y debido a ello Dios permitió que durante veinte años los oprimiera Jabín". La fecha ~1250 a.e.c. es una estimación dentro del período tradicional de Jueces, pero Perspicacia no la especifica. Propuesta: mantener pero reconocer como aproximación.
- Fuente: "Al principio de la época de los jueces... durante veinte años los oprimiera Jabín" — Perspicacia, entrada "Barac" — https://wol.jw.org/es/wol/d/r4/lp-s/1200000559

### place — OK
- Actual: `Quedes, Neftalí`
- Perspicacia confirma: "Hijo de Abinoam, de Quedes, ciudad que pertenecía al territorio de Neftalí." — https://wol.jw.org/es/wol/d/r4/lp-s/1200000559
- OK

### life — DUDOSO
- Actual: `start: -1280, end: -1220, approx: true`
- Perspicacia no proporciona fechas de vida. Las fechas estimadas (-1280 a -1220) son coherentes con el período, pero no están explícitamente en Perspicacia. Propuesta: mantener pero reconocer la limitación.
- Fuente: Sin base explícita en Perspicacia

### passages — OK
- Actual: Jueces 4–5 (victoria y canto) y Hebreos 11:32 (lista de fieles)
- Ambos están correctamente citados. Perspicacia menciona "Se cita a Barac como un fiel ejemplo entre aquellos 'que por fe derrotaron reinos en conflicto...'" (Heb 11:32-34) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000559
- OK

## knownFor
| Afirmación | Veredicto | Fuente | Propuesta |
|---|---|---|---|
| «General israelita que, junto a la profetisa Débora, derrotó al ejército de carros de Sísara» | OK | "Barac reclutó a diez mil hombres... y subió al monte Tabor... Sísara y sus fuerzas... avanzaron hacia los israelitas por el lecho seco del Cisón... Las fuerzas israelitas... descendieron con valor del monte Tabor... el Cisón se convirtió en un torrente arrollador... 'Todo el campamento de Sísara cayó a filo de espada. No quedó ni siquiera uno'." (Jue 4:6-16) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000559 | — |
| «con 10.000 hombres mal armados» | OK | "Mientras que los cananeos que oprimían a los israelitas estaban fuertemente armados, 'no se veía un escudo, ni una lanza, entre cuarenta mil en Israel'." (Jue 5:8) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000559 | — |
| «Dudó inicialmente y exigió la presencia de Débora» | OK | "Barac contaba con la promesa de Jehová de dar al enemigo en su mano, pero insistió en la presencia de Débora como representante de Dios —aunque era mujer— mientras él conducía las tropas al monte Tabor." (Jue 4:8-9) | — |
| «quien profetizó que la gloria de la victoria sería de una mujer» | OK | "Profetizó que 'la cosa de embellecimiento' que coronaría la victoria llegaría a ser de una mujer. Estas palabras se cumplieron cuando Jael dio muerte a Sísara." (Jue 4:9; 4:17-22) | — |
| «Incluido entre los fieles de Hebreos 11» | OK | "Se cita a Barac como un fiel ejemplo entre aquellos 'que por fe derrotaron reinos en conflicto, [...] se hicieron valientes en guerra, pusieron en fuga a los ejércitos de extranjeros'." (Heb 11:32-34) — https://wol.jw.org/es/wol/d/r4/lp-s/1200000559 | — |
| «pese a sus dudas iniciales» | OK | Jue 4:8-9 demuestra que Barac insistió en la presencia de Débora, mostrando falta de confianza inicial. | — |

## Mapa

### Recorrido completo
| # | Lugar | Versículo | Ubicación según Perspicacia | lon | lat | Confianza | id existente |
|---|---|---|---|---|---|---|---|
| 1 | Quedes | Jue 4:6 | "Hijo de Abinoam, de Quedes, ciudad que pertenecía al territorio de Neftalí." | 35.530 | 33.112 | media | quedes |
| 2 | Monte Tabor | Jue 4:6, 8, 14 | "Se eleva abruptamente en el valle de Jezreel... A unos 20 km al O. del extremo meridional del mar de Galilea y a unos 8 km al ESE. de la ciudad de Nazaret." | 35.391 | 32.687 | alta | tabor |
| 3 | Torrente Cisón | Jue 4:13, 15 | "Arroyo que serpentea en dirección NO. desde las colinas cercanas a Taanac, atraviesa la llanura de Jezreel o Esdrelón... En primavera unos 6 m. de ancho." | 35.197 | 32.578 | media | — |

### Selección (máx. 15)
`["quedes", "tabor"]`  — ruta: sí — zoom: no hace falta

Justificación: Quedes es el lugar de origen de Barac; Tabor es el sitio de la concentración de fuerzas y el inicio de la batalla decisiva. Cisón (torrente donde se desarrolló la batalla) es esencial para la narrativa pero no existe como id en el nomenclátor.

### Lugares nuevos para `lugares.json`
```json
[{"id": "cison", "label": "Torrente Cisón", "lon": 35.197, "lat": 32.578}]
```

## No verificado
- Las fechas exactas de -1280 a -1220 a.e.c.: Perspicacia no especifica un rango de años para Barac. La comparación de la vida de Barac (-1280 a -1220) con la de Débora (-1240 a -1180) sugiere cronologías solapadas pero no idénticas, lo cual es consistente con que compartieron episodio. Sin embargo, Perspicacia no proporciona estas cifras específicas.

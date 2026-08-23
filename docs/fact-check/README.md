# Fact check de las fichas

El contenido de las 47 tarjetas —fechas, textos y mapas— se revisa con un enjambre
de agentes en paralelo que contrastan cada dato contra *Perspicacia para comprender
las Escrituras* y el texto bíblico en `wol.jw.org`.

- **`brief-enjambre.md`** — el paquete de instrucciones que recibe cada agente: orden
  de autoridad de las fuentes, las anclas de cronología de las publicaciones, el
  glosario de vocabulario y el formato exacto del informe.
- **`lotes.txt`** — el reparto de las 47 fichas en 20 lotes, agrupadas por parentesco
  narrativo para que la investigación se aproveche dentro del lote.

## Lo que hace falta para lanzarlo

El entorno tiene que llegar a `jw.org`. Con el nivel de red **Trusted** por defecto
no llega: hay que ponerlo en **Custom** y añadir a los dominios permitidos

```
jw.org
*.jw.org
*.jw-cdn.org
```

sin olvidar la casilla que conserva la lista por defecto de gestores de paquetes.
La política se lee al arrancar el contenedor, así que el cambio pide **una sesión
nueva** para surtir efecto.

## Cómo se reanuda

Los agentes no tocan el repositorio: cada uno escribe un informe por ficha y las
correcciones se aplican después, en una segunda pasada, con el informe ya revisado.

## Resultado

Los 47 informes están en `informes/`, uno por ficha, con la cita literal de
*Perspicacia* y el enlace a cada entrada. De ahí salieron 59 correcciones
propuestas y 31 afirmaciones marcadas como dudosas.

**Lo aplicado hasta ahora** son las correcciones de texto y de fechas, que no
dependen de coordenadas. Los mapas van aparte.

**Lo rechazado**, y por qué, para que no vuelva a proponerse:

- *Cambiar de era a Josué, Jonatán, Abigail, David y Salomón.* Cuatro agentes
  distintos pidieron moverlos a una era «reinos». No existe: `jueces` se llama
  «Jueces y reino unido» (~1400–930 a.e.c.) y `exodo`, «Éxodo y conquista».
  Juzgaron por el identificador sin leer la etiqueta.
- *Cambiar «nacido de virgen» en Isaías.* Perspicacia explica que Isaías 7:14 usa
  ʽal·máh («doncella») y que Mateo, bajo inspiración, empleó par·thé·nos al mostrar
  que la profecía tuvo su cumplimiento en el nacimiento virginal. La ficha está bien.
- *Que Ana y Samuel se contradicen.* No se contradicen: Ana nace en 1200 y muere en
  1100; Samuel nace en 1170, cuando ella tenía treinta años.
- *Añadir Laquis al mapa de Ezequías.* Quien estaba en Laquis era Senaquerib;
  Ezequías le mandó mensajeros desde Jerusalén (2Re 18:14).
- *Retocar de quién fue la responsabilidad en la muerte de Jesús.* Queda fuera del
  encargo, que era vocabulario y errores de hecho, y el texto no dice nada falso.

**Aviso sobre las coordenadas.** Los agentes aciertan qué lugares entran en cada
mapa y con qué versículo, pero los pares de longitud y latitud que proponen no son
de fiar: de 36 lugares que propone más de un agente, 17 no cuadran entre sí, y en la
lista de Pablo longitud y latitud están intercambiadas (Malta aparece en el desierto
de Arabia). Las coordenadas se derivan aparte y se verifican con
`node tools/comprobar-mapas.mjs`.

Hay además tres homónimos que el nomenclátor debe separar antes de crecer: los dos
**Etam** (la parada del éxodo y el peñasco de Sansón), los dos **Sucot** (la salida de
Egipto y la ciudad del otro lado del Jordán) y los dos **Carmelo** (el monte de Elías,
que ya está, y el pueblo de Judá donde vivía Abigail, a 130 km).


## Las afirmaciones dudosas, resueltas

De las marcadas como dudosas, las de fechas se resolvieron dejando la estimación y
rayando la barra, y las de coordenadas, con el nomenclátor. Quedaban seis de
redacción, revisadas una a una:

- **Abigaíl** — «uno de los mejores ejemplos de tacto y prudencia en la Biblia» era
  valoración nuestra vestida de cita. Se rebaja a «un ejemplo de tacto y prudencia».
- **Jonatán** — la frase iba entrecomillada como suya, y ni la letra coincidía con
  1 Samuel 14:6 ni fue una declaración: se lo dijo a su escudero. Sin comillas y con
  la referencia detrás.
- **Zípora** — Éxodo 4:24 dice que Jehová «trató de darle muerte» sin aclarar a quién,
  y Perspicacia recoge varias interpretaciones sin decidirse. La ficha zanjaba lo que
  la fuente deja abierto; ahora lo deja abierto también.
- **Timoteo** — «ejemplo de crecimiento espiritual desde la infancia» no lo dice
  ninguna publicación. Lo literal es 2 Timoteo 3:15, que ya estaba al principio de la
  ficha, así que se afina allí y se quita el cierre.
- **Abel** — «el primer hombre justo en morir». Perspicacia lo llama «el primer hombre
  de fe», pero Mateo 23:35 dice «el justo Abel». Se queda como está.
- **Noemí** — «Jehová la restauró» se infiere de Rut 4:14-15 en vez de citarse, pero es
  como lo expresa Perspicacia. Se queda como está.

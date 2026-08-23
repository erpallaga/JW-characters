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

# Sala de Juegos - Sprint 4

Trabajo Práctico #1 de Programación IV - UTN Avellaneda.

## Alumno

- Nombre: Santino Jonas Fernández
- Materia: Programación IV
- Carrera: Tecnicatura Universitaria en Programación
- Institución: UTN Avellaneda

## Deploy

- Link del deploy: (https://tp-programacion-iv.vercel.app)

## Tecnologías utilizadas

- Angular
- TypeScript
- Bootstrap
- SCSS
- Supabase
- Supabase Auth
- Supabase Database
- Supabase Realtime
- API REST Countries
- Vercel

---

# Descripción del proyecto

Sala de Juegos es una aplicación web desarrollada en Angular con Supabase como backend.

En este sprint se completan los juegos requeridos por el TP, agregando Preguntados, el juego propio Space Shot y la página Resultados con cuatro tablas de desempeño.

Este sprint incluye todo lo desarrollado en Sprint 1, Sprint 2 y Sprint 3.

---

# Funcionalidades acumuladas

## Sprint 1

- Proyecto Angular creado.
- Deploy en Vercel.
- Componentes Home, Login, Registro y Quién Soy.
- Navegación entre pantallas.
- Página Quién Soy con datos desde la API de GitHub.
- Favicon personalizado.
- Bootstrap y estilos generales.

## Sprint 2

- Login con Supabase.
- Registro con Supabase.
- Guardado de usuarios en base de datos.
- Logout.
- Home condicional según sesión.
- Guards de rutas.
- Login rápido.

## Sprint 3

- Ahorcado funcional.
- Mayor o Menor funcional.
- Chat global en tiempo real.
- Resultados guardados en Supabase.

---

# Funcionalidades implementadas en Sprint 4

## Preguntados

- Juego Preguntados funcional.
- Obtiene datos desde una API externa.
- Se utiliza REST Countries como API externa.
- Las preguntas se generan en español a partir de la información de países.
- Las opciones de respuesta son botones.
- Se controla:
  - Pregunta actual.
  - Aciertos.
  - Errores.
  - Puntaje.
  - Tiempo.
- Al finalizar la partida se guarda el resultado en Supabase.

Tipos de preguntas:

- ¿Cuál es la capital de determinado país?
- ¿Qué país tiene determinada capital?
- ¿En qué región se encuentra determinado país?

Datos guardados:

- Usuario que jugó.
- Juego.
- Resultado.
- Puntaje.
- Tiempo en segundos.
- Aciertos.
- Errores.
- Total de preguntas.
- Porcentaje de acierto.
- API utilizada.

---

## Juego propio: Space Shot

Space Shot es un juego de reflejos y precisión donde aparecen planetas, meteoritos y naves.

El jugador debe tocar únicamente los meteoritos peligrosos antes de que lleguen al final de la pantalla.

## Reglas de Space Shot

- Aparecen objetos espaciales en movimiento.
- El jugador debe tocar solo los meteoritos.
- Los meteoritos se identifican con el símbolo ☄️.
- Tocar un meteorito suma puntos y cuenta como acierto.
- Tocar planetas o naves suma errores y resta puntos.
- Si un meteorito llega al final de la pantalla, también suma un error.
- La partida dura 30 segundos.
- La partida también puede terminar antes si el jugador llega al límite de errores.

## Datos guardados de Space Shot

Al finalizar la partida se guarda en Supabase:

- Usuario que jugó.
- Juego.
- Resultado.
- Puntaje.
- Tiempo jugado.
- Aciertos.
- Errores.
- Objetos tocados.
- Tiempo restante.
- Regla principal del juego.

---

## Página Resultados

- Se creó la página Resultados.
- Se muestran cuatro tablas separadas:
  - Ahorcado.
  - Mayor o Menor.
  - Preguntados.
  - Space Shot.
- Cada tabla muestra:
  - Posición.
  - Jugador.
  - Resultado.
  - Puntaje.
  - Tiempo.
  - Aciertos.
  - Errores.
  - Detalle.
  - Fecha.
- Las tablas se ordenan de mejor desempeño a peor:
  - Mayor puntaje primero.
  - Menor tiempo como criterio secundario.
  - Resultado más reciente como criterio adicional.
- Los resultados se leen desde la tabla `resultados_juegos`.

---

## Página Quién Soy

- Se actualizó la página Quién Soy.
- Se agregó la descripción completa del juego propio.
- Se agregaron las reglas de Space Shot.
- Se agregó la forma de finalización.
- Se agregó cómo se mide el desempeño del jugador.

---

# Base de datos

## Tabla `usuarios`

Guarda los datos personales del usuario registrado.

Campos principales:

- `id`
- `email`
- `nombre`
- `apellido`
- `edad`
- `created_at`

## Tabla `mensajes_chat`

Guarda los mensajes del chat global.

Campos principales:

- `id`
- `usuario_id`
- `nombre_usuario`
- `mensaje`
- `created_at`

## Tabla `resultados_juegos`

Guarda los resultados de todos los juegos.

Campos principales:

- `id`
- `usuario_id`
- `juego`
- `resultado`
- `puntaje`
- `tiempo_segundos`
- `datos`
- `created_at`

La columna `datos` se usa para guardar información específica de cada juego.

---

# Checklist de cumplimiento Sprint 4

- Preguntados obtiene datos de una API externa.
- Preguntados usa botones como opciones de respuesta.
- Preguntados guarda resultados en Supabase.
- Space Shot funciona como juego propio.
- Space Shot tiene condiciones de finalización.
- Space Shot guarda datos de desempeño.
- Quién Soy explica el juego propio.
- Resultados muestra cuatro tablas.
- Las tablas están ordenadas de mejor desempeño a peor.
- No se utiliza `alert()`.
- Diseño uniforme con Bootstrap y SCSS.

---

# Estado del Sprint 4

Sprint 4 completado.

La aplicación queda con los cuatro juegos requeridos, chat global en tiempo real, autenticación, persistencia en Supabase y página de resultados con cuatro tablas.

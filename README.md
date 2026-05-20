# Sala de Juegos - Sprint 3

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
- Vercel

---

# Descripción del proyecto

Sala de Juegos es una aplicación web desarrollada en Angular con Supabase como backend.

En este sprint se agregaron dos juegos obligatorios y una sala de chat global en tiempo real. Los juegos guardan resultados en Supabase y el chat permite enviar mensajes que se actualizan automáticamente sin recargar la página.

Este sprint incluye todo lo desarrollado en Sprint 1 y Sprint 2.

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

---

# Funcionalidades implementadas en Sprint 3

## Juego Ahorcado

- Juego Ahorcado funcional.
- Entrada de datos mediante botones de letras.
- No se utiliza el teclado para jugar.
- Control de letras seleccionadas.
- Control de errores.
- Condición de victoria.
- Condición de derrota.
- Guardado del resultado en Supabase al finalizar la partida.

Datos guardados:

- Usuario que jugó.
- Juego.
- Resultado.
- Puntaje.
- Tiempo.
- Datos adicionales del desempeño.

## Juego Mayor o Menor

- Juego Mayor o Menor funcional.
- Se muestran cartas.
- El jugador debe adivinar si la próxima carta será mayor o menor.
- Control de aciertos.
- Control de errores.
- Condición de finalización.
- Guardado del resultado en Supabase al finalizar la partida.

Datos guardados:

- Usuario que jugó.
- Juego.
- Resultado.
- Puntaje.
- Tiempo.
- Cantidad de aciertos.
- Datos adicionales del desempeño.

## Chat global

- Sala de chat única para usuarios registrados y logueados.
- Envío de mensajes.
- Guardado de mensajes en Supabase.
- Actualización automática usando Supabase Realtime.
- Los mensajes aparecen sin recargar la página.
- Cada mensaje muestra:
  - Usuario.
  - Mensaje.
  - Fecha y hora.
- El mensaje propio se diferencia visualmente del resto.

## Tablas utilizadas

### `mensajes_chat`

Guarda los mensajes del chat global.

Campos principales:

- `id`
- `usuario_id`
- `nombre_usuario`
- `mensaje`
- `created_at`

### `resultados_juegos`

Guarda los resultados de los juegos.

Campos principales:

- `id`
- `usuario_id`
- `juego`
- `resultado`
- `puntaje`
- `tiempo_segundos`
- `datos`
- `created_at`

---

# Estado del Sprint 3

Sprint 3 completado.

La aplicación quedó con Ahorcado, Mayor o Menor, chat global en tiempo real y persistencia de datos en Supabase.

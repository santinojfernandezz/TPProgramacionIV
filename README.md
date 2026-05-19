# Sala de Juegos - Sprint 2

Trabajo Práctico #1 de Programación IV - UTN Avellaneda.

## Alumno

- Nombre: Santino Jonas Fernández
- Materia: Programación IV
- Carrera: Tecnicatura Universitaria en Programación
- Institución: UTN Avellaneda

## Deploy

- Link del deploy: https://tp-programacion-2a1ger5nx-santinojfernandezzs-projects.vercel.app

## Tecnologías utilizadas

- Angular
- TypeScript
- Bootstrap
- SCSS
- Supabase
- Supabase Auth
- Supabase Database
- Vercel

---

# Descripción del proyecto

Sala de Juegos es una aplicación web desarrollada en Angular con Supabase como backend.

En este sprint se incorporó autenticación real, registro de usuarios, guardado de datos en base de datos, cierre de sesión, guards de rutas y comportamiento condicional del Home según el estado de sesión.

Este sprint incluye todo lo desarrollado en Sprint 1.

---

# Funcionalidades del Sprint 1 incluidas

- Proyecto Angular creado.
- Deploy en Vercel.
- Componentes:
  - Home.
  - Login.
  - Registro.
  - Quién Soy.
- Navegación entre componentes.
- Quién Soy consume datos desde la API de GitHub.
- Favicon personalizado.
- Bootstrap y estilos generales.

---

# Funcionalidades implementadas en Sprint 2

## Autenticación

- Login con Supabase Auth.
- Registro con Supabase Auth.
- Cierre de sesión.
- Manejo de sesión activa.

## Registro de usuarios

El registro permite cargar:

- Email.
- Nombre.
- Apellido.
- Edad.
- Contraseña.

La contraseña no se guarda en la base de datos propia, solo se usa para la autenticación de Supabase.

## Base de datos

Se guarda la información del usuario en la tabla `usuarios`.

Campos principales:

- `id`
- `email`
- `nombre`
- `apellido`
- `edad`
- `created_at`

## Home condicional

El Home cambia según el estado del usuario:

- Si el usuario no está logueado:
  - Muestra botón para iniciar sesión.
  - Muestra botón para registrarse.
  - Muestra acceso a Quién Soy.

- Si el usuario está logueado:
  - Muestra el nombre del usuario.
  - Muestra botón para cerrar sesión.
  - Permite acceder a las secciones privadas.

## Guards de rutas

- Rutas privadas protegidas con `authGuard`.
- Rutas de login y registro protegidas con `guestGuard`.
- Un usuario logueado no puede volver al login o registro.
- Un usuario no logueado no puede acceder a juegos o secciones privadas.

## Login rápido

- Se agregaron botones de inicio de sesión rápido.
- Permiten probar la aplicación de forma más ágil con usuarios ya registrados.

## Mensajes visuales

- Se muestran mensajes visuales ante errores de login o registro.
- No se utiliza `alert()`.

---

# Estado del Sprint 2

Sprint 2 completado.

La aplicación quedó con autenticación funcional, registro de usuarios en Supabase, guards de rutas, Home dinámico y login rápido para testing.

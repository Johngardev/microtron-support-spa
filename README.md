<div align="center">

# Microtrón Support

Aplicación web para la gestión de soporte técnico y coordinación de sesiones de atención para Microtrón SAS.

[![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Angular Material](https://img.shields.io/badge/Angular%20Material-18-757575?logo=angular&logoColor=white)](https://material.angular.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socketdotio&logoColor=white)](https://socket.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

</div>

---

## Descripción

Microtrón Support es una solución de soporte digital diseñada para centralizar la atención al cliente, la gestión de sesiones y la programación de citas con clientes y equipos comerciales. La plataforma combina un frontend moderno en Angular con servicios backend para gestionar información de soporte, automatizar procesos y mejorar la experiencia operativa.

## Características principales

- Gestión de sesiones de soporte.
- Seguimiento y actualización del estado de atención.
- Integración con Calendly para agendar reuniones de forma directa.
- Panel de administración y gestión de datos.
- Interfaz moderna y responsiva con Angular Material y Tailwind CSS.
- Notificaciones, widgets de soporte y flujo de interacción con usuarios.
- Arquitectura modular y preparada para crecer con nuevas funcionalidades.

## Stack tecnológico

| Categoría | Tecnologías |
| --- | --- |
| Frontend | Angular 18, TypeScript, Angular Material |
| Estilos | Tailwind CSS, CSS personalizado |
| Estado y flujo reactivo | RxJS, Zone.js |
| Real-time | Socket.IO Client |
| Calidad | Jasmine, Karma |
| Backend | NestJS / API REST (sección `support-api`) |
| Base de datos | MongoDB / MongoDB Atlas |
| Infraestructura | Docker, Nginx, despliegue para producción |

## Estructura del repositorio

```text
microtron-support-spa/
├── README.md
├── START_HERE.md
├── PRODUCTION_SETUP.md
├── SESSIONS_API_DOCUMENTATION.md
├── IMPLEMENTATION_SUMMARY.md
├── setup.sh
├── setup.bat
├── support-web/          # Frontend Angular
│   ├── src/
│   ├── public/
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
├── support-api/          # Backend API (si aplica en el proyecto)
│   └── ...
└── ...
```

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js 18 o superior
- npm
- Git
- Acceso a la API backend configurada y funcionando
- Variables de entorno necesarias para la conexión con MongoDB y Calendly

## Instalación y ejecución

### 1) Clonar el repositorio

```bash
git clone https://github.com/Johngardev/microtron-support-spa.git
cd microtron-support-spa
```

### 2) Instalar dependencias del frontend

```bash
cd support-web
npm install
```

### 3) Ejecutar la aplicación en desarrollo

```bash
npm start
```

La aplicación quedará disponible en:

- http://localhost:4200

> Si la API backend está en ejecución, asegúrate de que la configuración de entorno y CORS apunten al host correcto.

## Scripts disponibles

Dentro de `support-web` puedes ejecutar:

```bash
npm start      # inicia el entorno de desarrollo
npm run build  # genera la build de producción
npm run watch  # compila en modo desarrollo con observación
npm test       # ejecuta pruebas unitarias
```

## Documentación

Se incluye documentación útil para comenzar y desplegar el proyecto:

- [START_HERE.md](START_HERE.md) — guía inicial para entorno y flujo de uso
- [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) — despliegue y configuración para producción
- [SESSIONS_API_DOCUMENTATION.md](SESSIONS_API_DOCUMENTATION.md) — documentación técnica de la API
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) — resumen de implementación
- [support-web/README.md](support-web/README.md) — documentación específica del frontend

## Buenas prácticas

- Mantener actualizados los paquetes del frontend y del backend.
- Validar la compilación antes de abrir un PR.
- Proteger variables de entorno en entornos reales.
- Documentar cambios funcionales y de configuración.

## Contribución

Las contribuciones son bienvenidas. Si deseas colaborar:

1. Haz un fork del proyecto.
2. Crea una rama con tu cambio.
3. Realiza tus modificaciones y valida la compilación.
4. Envía un pull request con una descripción clara.

## Licencia

Este proyecto se mantiene bajo la política interna del equipo y del repositorio activo. Consulta los archivos del proyecto para confirmar la licencia aplicada si corresponde al entorno de uso final.

---

<div align="center">

Desarrollado para Microtrón SAS.

</div>

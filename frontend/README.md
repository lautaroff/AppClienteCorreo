# Frontend React para AppClienteCorreo

Este front es una migración del frontend estático a React (Vite) con diseño mejorado.

Requisitos: Node.js + npm.

Comandos (PowerShell):

cd frontend
npm install
npm run dev

El servidor de desarrollo corre en http://localhost:3000.
Durante desarrollo, las peticiones a `/api/*` se proxean automáticamente a `http://localhost:8083` (backend). Asegúrate de tener el backend corriendo en ese puerto o cambia la URL en `vite.config.js`.

Para producción: `npm run build` y copia `dist` al `src/main/resources/static` del backend o sirve `dist` desde cualquier servidor estático.

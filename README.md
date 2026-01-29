# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

Perfecto.
Aquí tienes un **README completo, limpio y académico**, enfocado **exclusivamente en cómo usar y ejecutar el proyecto**, sin emojis ni referencias a IA.

Puedes copiarlo tal cual en tu repositorio.

---

# Puppy Family – Frontend (React)

Frontend desarrollado en **ReactJS** que consume una API REST construida en **Django**, orientado a la gestión y adopción de mascotas.
El sistema cuenta con una sección pública y una sección privada (administración) protegida por autenticación y control de acceso por roles.

---

## Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

* Node.js (versión 18 o superior recomendada)
* npm (incluido con Node.js)
* Acceso a la API backend en Django

---

## Instalación del proyecto

Clona el repositorio:

```bash
git clone https://github.com/sedil64/pet-adoption-ui.git
cd pet-adoption-ui
```

Instala las dependencias:

```bash
npm install
```

---

## Variables de entorno

Este proyecto utiliza variables de entorno para definir la URL de la API.

Los archivos `.env` **no están incluidos en el repositorio** y deben crearse manualmente.

### Desarrollo local

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8000/api
```

### Producción

Para producción, crea un archivo `.env.production`:

```env
VITE_API_URL=https://tu-dominio-backend/api
```

---

## Ejecución en entorno de desarrollo

Para levantar el servidor de desarrollo:

```bash
npm run dev
```

El proyecto estará disponible en:

```
http://localhost:5173
```

---

## Compilación para producción

Para generar el build optimizado:

```bash
npm run build
```

El resultado se generará en la carpeta:

```
dist/
```

Este contenido puede desplegarse en un servidor web como **Nginx**.

---


## Autenticación

* El sistema utiliza autenticación basada en **token JWT**
* El token se almacena en `localStorage`
* Todas las peticiones a la API incluyen automáticamente el token
* Las rutas privadas están protegidas y requieren autenticación

---

## Control de acceso por roles

El acceso a las funcionalidades del sistema depende del rol del usuario:

* **Administrador**: acceso completo (crear, editar y eliminar)
* **Usuario**: acceso limitado según permisos definidos por la API

Las opciones del menú y las acciones disponibles se muestran u ocultan dinámicamente según el rol.

---

## Funcionalidades principales

### Parte pública

* Página principal (Home)
* Listado público de mascotas
* Listado de refugios
* Detalle de mascotas

### Parte privada (Admin)

* Gestión de mascotas (crear, editar, eliminar)
* Gestión de refugios
* Control de solicitudes
* Acceso restringido por rol

---

## Cierre de sesión

El usuario puede cerrar sesión desde el menú lateral, lo que elimina el token y redirige a la parte pública.

---

## Notas adicionales

* El frontend **no utiliza datos simulados**, todo el contenido se consume desde la API real.
* El proyecto está preparado para despliegue mediante CI/CD.
* La interfaz incluye validaciones, mensajes de error y estados de carga.

---

## Autor

Proyecto académico desarrollado como parte de la asignatura de Integración de Sistemas / Desarrollo Web.

---

Si quieres, en el siguiente mensaje puedo:

* Ajustarlo exactamente al formato que suele exigir tu universidad
* Reducirlo aún más (versión mínima)
* Revisar si falta algo para cumplir el 100% de la rúbrica


# Task Board — Vue 3 + Vite + json-server

Proyecto completo de la **Guía 2**: CRUD conectado a una API REST local.

## 🚀 Cómo ejecutar

### 1. Instalar dependencias

```bash
npm install
```

### 2. Levantar la API (json-server) — en una terminal

```bash
npm run api
```

La API queda disponible en `http://localhost:3001`

### 3. Levantar el frontend — en otra terminal

```bash
npm run dev
```

El frontend queda en `http://localhost:5173`

---

## 📁 Estructura del proyecto

```
src/
├── services/
│   └── tasksApi.js       # Capa de red (fetch) — única puerta al backend
├── composables/
│   └── useTasks.js       # Estado (data/loading/error/saving) + acciones CRUD
├── components/
│   ├── TaskForm.vue      # Formulario para crear tarea
│   ├── TaskList.vue      # Lista de tareas + empty state
│   ├── TaskRow.vue       # Fila: toggle, edición inline, eliminar
│   └── UiAlert.vue       # Banner de error reutilizable
├── App.vue               # Componente raíz + búsqueda (Ejercicio C)
├── main.js
└── style.css
```

## ✅ Ejercicios incluidos

- **A** — Listar tareas desde la API con empty state
- **B** — Crear y eliminar con banner de error
- **C** — Filtro de búsqueda (campo en App.vue con `computed`)

## 🔑 Variables de entorno

El archivo `.env` contiene:

```
VITE_API_URL=http://localhost:3001
```

En Vite, solo las variables con prefijo `VITE_` llegan al cliente vía `import.meta.env`.

## 💡 Tips de uso

- **Doble clic** en el título de una tarea para editarla inline
- Los **iconos de acción** (✏️ 🗑️) aparecen al pasar el mouse sobre la tarea
- El botón **Agregar** se deshabilita mientras guarda para evitar dobles envíos

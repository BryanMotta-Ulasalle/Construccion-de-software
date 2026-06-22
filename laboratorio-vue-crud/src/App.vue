<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTasks } from './composables/useTasks'
import TaskForm    from './components/TaskForm.vue'
import TaskList    from './components/TaskList.vue'
import UiAlert     from './components/UiAlert.vue'
import UiNotice    from './components/UiNotice.vue'

const {
  tasks, loading, error, saving, notice,
  load, addTask, toggleTask, editTask, removeTask,
} = useTasks()

// ── Ejercicio C: búsqueda con debounce ───────────────────────────────────────
const query        = ref('')
const debouncedQ   = ref('')
let debounceTimer  = null

watch(query, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { debouncedQ.value = val }, 300)
})

const visibleTasks = computed(() =>
  [...tasks.value]
    .filter(t =>
      t.title.toLowerCase().includes(debouncedQ.value.toLowerCase())
    )
    .sort((a,b)=>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
)

const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() =>
  Math.max(1, Math.ceil(visibleTasks.value.length / pageSize))
)

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return visibleTasks.value.slice(start, start + pageSize)
})
// ─────────────────────────────────────────────────────────────────────────────

const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

onMounted(load)
</script>

<template>
  <main class="app">
    <header class="header">
      <div class="header-top">
        <h1>Task Board</h1>
        <span v-if="!loading" class="badge">
          {{ pendingCount }} pendiente{{ pendingCount !== 1 ? 's' : '' }}
        </span>
      </div>
      <p class="subtitle">Gestiona tus tareas conectado a una API REST</p>
    </header>

    <TaskForm :disabled="saving" @submit="addTask" />

    <!-- Ejercicio C: filtro con debounce -->
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input
        v-model="query"
        class="search"
        placeholder="Buscar tarea…"
        type="search"
      />
    </div>

    <!-- Ejercicio D: notificación de éxito (verde) -->
    <UiNotice v-if="notice" :message="notice" />

    <!-- Banner de error (rojo) -->
    <UiAlert v-if="error" :message="error" />

    <div v-if="loading" class="state">
      <div class="spinner"></div>
      <span>Cargando tareas…</span>
    </div>

    <TaskList
      v-else
      :tasks="paginatedTasks"
      @toggle="toggleTask"
      @edit="editTask"
      @remove="removeTask"
    />

    <div v-if="!loading" class="pagination">
      <button @click="currentPage--" :disabled="currentPage===1">Anterior</button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="currentPage++" :disabled="currentPage>=totalPages">Siguiente</button>
    </div>

    <footer class="footer">
      💡 Doble clic en una tarea para editarla inline
    </footer>
  </main>
</template>

<style scoped>
.app {
  padding: 8px 0 40px;
}

.header {
  margin-bottom: 24px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

h1 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.badge {
  background: #e0e7ff;
  color: #4338ca;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
}

.subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

.search-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  pointer-events: none;
}

.search {
  width: 100%;
  padding: 9px 14px 9px 36px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #fff;
  color: #1e293b;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 32px;
  color: #64748b;
  font-size: 0.9rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.pagination {
  display:flex;
  justify-content:center;
  align-items:center;
  gap:1rem;
  margin-top:1rem;
}
.footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.8rem;
  color: #94a3b8;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTasks } from './composables/useTasks'
import TaskForm from './components/TaskForm.vue'
import TaskList from './components/TaskList.vue'
import UiAlert from './components/UiAlert.vue'

const {
  tasks, loading, error, saving,
  load, addTask, toggleTask, editTask, removeTask,
} = useTasks()

// Ejercicio C: filtro con búsqueda
const query = ref('')
const visibleTasks = computed(() =>
  tasks.value.filter(t => t.title.toLowerCase().includes(query.value.toLowerCase()))
)

const pendingCount = computed(() => tasks.value.filter(t => !t.done).length)

onMounted(load)
</script>

<template>
  <main class="app">
    <header class="header">
      <div class="header-top">
        <h1>Task Board</h1>
        <span v-if="!loading" class="badge">{{ pendingCount }} pendiente{{ pendingCount !== 1 ? 's' : '' }}</span>
      </div>
      <p class="subtitle">Gestiona tus tareas conectado a una API REST</p>
    </header>

    <TaskForm :disabled="saving" @submit="addTask" />

    <!-- Filtro de búsqueda (Ejercicio C) -->
    <div class="search-wrapper">
      <span class="search-icon">🔍</span>
      <input
        v-model="query"
        class="search"
        placeholder="Buscar tarea…"
        type="search"
      />
    </div>

    <UiAlert v-if="error" :message="error" />

    <div v-if="loading" class="state">
      <div class="spinner"></div>
      <span>Cargando tareas…</span>
    </div>

    <TaskList
      v-else
      :tasks="visibleTasks"
      @toggle="toggleTask"
      @edit="editTask"
      @remove="removeTask"
    />

<!--     <footer class="footer">
      💡 Doble clic en una tarea para editarla inline
    </footer> -->
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

.footer {
  margin-top: 24px;
  text-align: center;
  font-size: 0.8rem;
  color: #94a3b8;
}
</style>

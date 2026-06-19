import { ref } from 'vue'
import { tasksApi } from '../services/tasksApi'

export function useTasks() {
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)
  const saving = ref(false)

  async function load() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await tasksApi.getAll()
    } catch (e) {
      error.value = 'No se pudieron cargar las tareas. ¿Está corriendo json-server en el puerto 3001?'
    } finally {
      loading.value = false
    }
  }

  async function addTask(title) {
    saving.value = true
    error.value = null
    try {
      const created = await tasksApi.create({ title, done: false })
      tasks.value.push(created)
    } catch (e) {
      error.value = 'No se pudo crear la tarea.'
    } finally {
      saving.value = false
    }
  }

  async function toggleTask(task) {
    try {
      const updated = await tasksApi.update(task.id, { done: !task.done })
      Object.assign(task, updated)
    } catch (e) {
      error.value = 'No se pudo actualizar la tarea.'
    }
  }

  async function editTask(task, title) {
    try {
      const updated = await tasksApi.update(task.id, { title })
      Object.assign(task, updated)
    } catch (e) {
      error.value = 'No se pudo editar la tarea.'
    }
  }

  async function removeTask(id) {
    try {
      await tasksApi.remove(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      error.value = 'No se pudo eliminar la tarea.'
    }
  }

  return { tasks, loading, error, saving, load, addTask, toggleTask, editTask, removeTask }
}

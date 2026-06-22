import { ref } from 'vue'
import { tasksApi } from '../services/tasksApi'

export function useTasks() {
  const tasks   = ref([])
  const loading = ref(false)
  const error   = ref(null)
  const saving  = ref(false)

  // Ejercicio D: notificación de éxito
  const notice  = ref(null)
  let noticeTimer = null

  function showNotice(msg) {
    notice.value = msg
    clearTimeout(noticeTimer)
    noticeTimer = setTimeout(() => { notice.value = null }, 3000)
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      tasks.value = await tasksApi.getAll()
    } catch (e) {
      error.value = 'No se pudieron cargar las tareas. ¿Está disponible la API?'
    } finally {
      loading.value = false
    }
  }

  async function addTask(title) {
    saving.value = true
    error.value = null
    try {
      const created = await tasksApi.create({ title, done: false, createdAt: new Date().toISOString() })
      tasks.value.push(created)
      showNotice('✅ Tarea creada correctamente.')
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
      showNotice(updated.done ? '✅ Tarea completada.' : '↩️ Tarea marcada como pendiente.')
    } catch (e) {
      error.value = 'No se pudo actualizar la tarea.'
    }
  }

  async function editTask(task, title) {
    try {
      const updated = await tasksApi.update(task.id, { title })
      Object.assign(task, updated)
      showNotice('✅ Tarea editada correctamente.')
    } catch (e) {
      error.value = 'No se pudo editar la tarea.'
    }
  }

  async function removeTask(id) {
    try {
      await tasksApi.remove(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
      showNotice('🗑️ Tarea eliminada.')
    } catch (e) {
      error.value = 'No se pudo eliminar la tarea.'
    }
  }

  return { tasks, loading, error, saving, notice, load, addTask, toggleTask, editTask, removeTask }
}

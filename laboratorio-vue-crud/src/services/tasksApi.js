const BASE_URL = import.meta.env.VITE_API_URL

// helper: valida la respuesta y parsea JSON
async function handle(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.status === 204 ? null : res.json()
}

export const tasksApi = {
  getAll() {
    return fetch(`${BASE_URL}/tasks`).then(handle)
  },
  create(task) {
    return fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handle)
  },
  update(id, changes) {
    return fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    }).then(handle)
  },
  remove(id) {
    return fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' }).then(handle)
  },
}

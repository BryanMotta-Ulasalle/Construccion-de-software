const BASE_URL = 'https://6a3937e564a2d82692239e2b.mockapi.io/api/task'

async function handle(res) {
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.status === 204 ? null : res.json()
}

export const tasksApi = {
  getAll() {
    return fetch(`${BASE_URL}`).then(handle)
  },
  create(task) {
    return fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handle)
  },
  update(id, changes) {
    return fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes),
    }).then(handle)
  },
  remove(id) {
    return fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }).then(handle)
  },
}

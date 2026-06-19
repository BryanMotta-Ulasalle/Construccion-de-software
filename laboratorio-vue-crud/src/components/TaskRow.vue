<script setup>
import { ref } from 'vue'

const props = defineProps({ task: { type: Object, required: true } })
const emit = defineEmits(['toggle', 'edit', 'remove'])

const editing = ref(false)
const draft = ref(props.task.title)

function save() {
  const value = draft.value.trim()
  if (value && value !== props.task.title) emit('edit', value)
  editing.value = false
}

function cancelEdit() {
  draft.value = props.task.title
  editing.value = false
}
</script>

<template>
  <li class="row" :class="{ done: task.done }">
    <button
      class="checkbox"
      :class="{ checked: task.done }"
      @click="$emit('toggle')"
      :aria-label="task.done ? 'Marcar como pendiente' : 'Marcar como hecha'"
    >
      <svg v-if="task.done" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="3,8 6.5,11.5 13,4.5" />
      </svg>
    </button>

    <span v-if="!editing" class="title" @dblclick="editing = true" title="Doble clic para editar">
      {{ task.title }}
    </span>
    <input
      v-else
      v-model="draft"
      class="edit-input"
      @keyup.enter="save"
      @keyup.escape="cancelEdit"
      @blur="save"
      autofocus
    />

    <div class="actions">
      <button v-if="!editing" class="btn-edit" @click="editing = true" title="Editar">✏️</button>
      <button class="btn-remove" @click="$emit('remove')" title="Eliminar">🗑️</button>
    </div>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: opacity 0.2s;
}

.row.done {
  opacity: 0.6;
}

.checkbox {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid #cbd5e1;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s, background 0.15s;
  padding: 0;
}

.checkbox.checked {
  background: #6366f1;
  border-color: #6366f1;
  color: #fff;
}

.checkbox svg {
  width: 12px;
  height: 12px;
}

.title {
  flex: 1;
  font-size: 0.95rem;
  color: #1e293b;
  cursor: text;
  user-select: none;
}

.done .title {
  text-decoration: line-through;
  color: #94a3b8;
}

.edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #6366f1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s;
}

.row:hover .actions {
  opacity: 1;
}

.btn-edit, .btn-remove {
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}

.btn-edit:hover { background: #f1f5f9; }
.btn-remove:hover { background: #fee2e2; }
</style>

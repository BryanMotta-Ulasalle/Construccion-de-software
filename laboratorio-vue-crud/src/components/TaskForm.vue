<script setup>
import { ref } from 'vue'

defineProps({ disabled: Boolean })
const emit = defineEmits(['submit'])

const title = ref('')

function onSubmit() {
  const value = title.value.trim()
  if (!value) return
  emit('submit', value)
  title.value = ''
}
</script>

<template>
  <form class="task-form" @submit.prevent="onSubmit">
    <label for="title" class="sr-only">Título de la tarea</label>
    <input
      id="title"
      v-model="title"
      placeholder="Escribe una nueva tarea…"
      :disabled="disabled"
      autocomplete="off"
    />
    <button type="submit" :disabled="disabled">
      {{ disabled ? 'Guardando…' : '+ Agregar' }}
    </button>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
  color: #1e293b;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}

input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

input:disabled {
  background: #f8fafc;
  color: #94a3b8;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #6366f1;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
  white-space: nowrap;
}

button:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>

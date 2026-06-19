<script setup>
import TaskRow from './TaskRow.vue'

defineProps({ tasks: { type: Array, required: true } })
defineEmits(['toggle', 'edit', 'remove'])
</script>

<template>
  <ul v-if="tasks.length" class="list">
    <TaskRow
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="$emit('toggle', task)"
      @edit="title => $emit('edit', task, title)"
      @remove="$emit('remove', task.id)"
    />
  </ul>
  <div v-else class="empty">
    <span class="empty-icon">📋</span>
    <p>No hay tareas todavía. ¡Agrega la primera!</p>
  </div>
</template>

<style scoped>
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 16px;
  color: #94a3b8;
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
}

.empty p {
  font-size: 0.95rem;
}
</style>

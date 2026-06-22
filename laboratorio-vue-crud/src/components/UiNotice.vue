<script setup>
defineProps({ message: { type: String, required: true } })
</script>

<template>
  <Transition name="notice">
    <div class="notice" role="status">
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.notice {
  background: #dcfce7;
  color: #166534;
  padding: 10px 14px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 0.9rem;
  border-left: 3px solid #22c55e;
}

/* Transición de entrada/salida */
.notice-enter-active,
.notice-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

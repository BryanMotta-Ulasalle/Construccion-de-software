<script setup>
defineProps({ message: { type: String, required: true } })
</script>

<template>
  <div class="alert" role="alert">
    <span class="alert-icon">⚠️</span>
    {{ message }}
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fee2e2;
  color: #991b1b;
  padding: 10px 14px;
  border-radius: 8px;
  margin: 10px 0;
  font-size: 0.9rem;
  border-left: 3px solid #ef4444;
}

.alert-icon {
  font-size: 1rem;
  flex-shrink: 0;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { theme, cycleTheme } = useTheme();

const icon = computed(() => {
  if (theme.value === 'light') return '☀️';
  if (theme.value === 'dark') return '🌙';
  return '🌓';
});
</script>

<template>
  <button class="theme-toggle" type="button" :aria-label="`主题：${theme}`" @click="cycleTheme">
    {{ icon }}
  </button>
</template>

<style lang="scss" scoped>
.theme-toggle {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: background 0.15s;

  &:hover {
    background: var(--color-surface-hover);
  }
}
</style>

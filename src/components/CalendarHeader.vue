<script setup lang="ts">
import { computed } from 'vue';
import ThemeToggle from './ThemeToggle.vue';

const props = defineProps<{
  year: number;
  month: number;
  isToday: boolean;
}>();

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'today'): void;
  (e: 'pick-holiday', name: string): void;
}>();

const yearLabel = computed(() => `${props.year}年${props.month}月`);

const holidayShortcuts = [
  { name: '元旦', month: 1, day: 1 },
  { name: '春节', month: 2, day: 1 },
  { name: '清明', month: 4, day: 4 },
  { name: '五一', month: 5, day: 1 },
  { name: '端午', month: 6, day: 1 },
  { name: '中秋', month: 9, day: 1 },
  { name: '国庆', month: 10, day: 1 }
];
</script>

<template>
  <header class="cal-header">
    <div class="cal-header__top">
      <h1 class="cal-header__title">万年历</h1>
      <ThemeToggle />
    </div>
    <div class="cal-header__nav">
      <button class="cal-header__arrow" type="button" aria-label="上个月" @click="emit('prev')">‹</button>
      <div class="cal-header__label tnum">{{ yearLabel }}</div>
      <button class="cal-header__arrow" type="button" aria-label="下个月" @click="emit('next')">›</button>
      <button
        class="cal-header__today"
        type="button"
        :disabled="isToday"
        @click="emit('today')"
      >
        今日
      </button>
    </div>
    <div class="cal-header__shortcuts">
      <button
        v-for="h in holidayShortcuts"
        :key="h.name"
        type="button"
        class="cal-header__chip"
        @click="emit('pick-holiday', h.name)"
      >
        {{ h.name }}
      </button>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.cal-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-4);

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-2);
  }

  &__title {
    font-size: 1.125rem;
    margin: 0;
    color: var(--color-primary);
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
  }

  &__arrow {
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 1.25rem;
    line-height: 1;

    &:hover { background: var(--color-surface-hover); }
  }

  &__label {
    flex: 1;
    text-align: center;
    font-size: 1.125rem;
    font-weight: 600;
  }

  &__today {
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: var(--radius-pill);
    padding: 4px 12px;
    font-size: 0.875rem;
    cursor: pointer;

    &:disabled { opacity: 0.4; cursor: default; }
  }

  &__shortcuts {
    display: flex;
    gap: var(--space-2);
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }

  &__chip {
    flex-shrink: 0;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-pill);
    padding: 2px 10px;
    font-size: 0.75rem;
    cursor: pointer;
    color: var(--color-text-sub);

    &:hover {
      background: var(--color-primary-soft);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  }
}
</style>

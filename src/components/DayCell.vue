<script setup lang="ts">
import { computed } from 'vue';
import type { DateCell } from '@/types';
import LunarText from './LunarText.vue';
import HolidayChip from './HolidayChip.vue';

const props = defineProps<{ cell: DateCell }>();
const emit = defineEmits<{ (e: 'select', date: Date): void }>();

const dayNum = computed(() => props.cell.date.getDate());
const classes = computed(() => ({
  'day-cell': true,
  'day-cell--out': !props.cell.inCurrentMonth,
  'day-cell--today': props.cell.isToday,
  'day-cell--selected': props.cell.isSelected,
  'day-cell--weekend': [0, 6].includes(props.cell.date.getDay())
}));

function onClick() {
  emit('select', props.cell.date);
}
</script>

<template>
  <button
    :class="classes"
    type="button"
    :aria-pressed="cell.isSelected"
    @click="onClick"
  >
    <span class="day-cell__num tnum">{{ dayNum }}</span>
    <LunarText :lunar="cell.lunar" />
    <HolidayChip v-if="cell.holiday" :holiday="cell.holiday" />
  </button>
</template>

<style lang="scss" scoped>
.day-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 2px;
  padding: 6px 2px 4px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  min-height: 64px;
  color: var(--color-text);
  font-family: inherit;
  transition: background 0.12s;

  &:hover {
    background: var(--color-surface-hover);
  }

  &--out {
    color: var(--color-text-muted);
    opacity: 0.5;
  }

  &--weekend:not(.day-cell--out) {
    color: var(--color-primary);
  }

  &--today .day-cell__num {
    color: var(--color-today);
    font-weight: 600;
  }

  &--today::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--color-today);
  }

  &--selected {
    background: var(--color-primary);
    color: #fff;

    .day-cell__num { color: #fff; }
    .lunar-text { color: rgba(255, 255, 255, 0.85); }
    .lunar-text--festive { color: #fff; }
  }

  &__num {
    font-size: var(--font-day);
    font-weight: 500;
  }
}

@media (max-width: 767px) {
  .day-cell {
    min-height: 56px;
    &__num { font-size: var(--font-day-mobile); }
  }
}
</style>

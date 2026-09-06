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

  // 选中态：边框 + 数字变色（不再整块填充，避免盖掉「今日」底色）
  &--selected {
    border-color: var(--color-primary);

    .day-cell__num {
      color: var(--color-primary);
      font-weight: 600;
    }
  }

  // 今日：常驻主色红实底（选中其他日期也不消失），文字反白
  &--today {
    background: var(--color-primary);

    .day-cell__num {
      color: #fff;
      font-weight: 600;
    }

    .lunar-text {
      color: rgba(255, 255, 255, 0.85);
    }

    .lunar-text--festive {
      color: #fff;
    }

    // 节假日徽标在白字下统一为半透明白
    .chip {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
      border-color: rgba(255, 255, 255, 0.65);
    }
  }

  &--today:hover {
    background: var(--color-primary);
    filter: brightness(1.07);
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

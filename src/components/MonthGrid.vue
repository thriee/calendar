<script setup lang="ts">
import { ref } from 'vue';
import type { DateCell } from '@/types';
import DayCell from './DayCell.vue';

defineProps<{ cells: DateCell[] }>();
const emit = defineEmits<{ (e: 'select', date: Date): void; (e: 'swipe', direction: 'left' | 'right'): void }>();

const weekHeaders = ['一', '二', '三', '四', '五', '六', '日'];

// 触摸滑动
let touchStartX = 0;
let touchStartY = 0;
const gridRef = ref<HTMLElement | null>(null);

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return;
  emit('swipe', dx < 0 ? 'left' : 'right');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') emit('swipe', 'right'); // 左箭头 = 上个月
  if (e.key === 'ArrowRight') emit('swipe', 'left');
}
</script>

<template>
  <div
    class="month-grid"
    ref="gridRef"
    tabindex="0"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    @keydown="onKeydown"
  >
    <div class="month-grid__weekrow">
      <div v-for="w in weekHeaders" :key="w" class="month-grid__weekcell">{{ w }}</div>
    </div>
    <div class="month-grid__body">
      <DayCell
        v-for="cell in cells"
        :key="cell.date.toISOString()"
        :cell="cell"
        @select="(d) => emit('select', d)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.month-grid {
  padding: var(--space-2) var(--space-3);
  outline: none;

  &__weekrow {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
    margin-bottom: var(--space-2);
  }

  &__weekcell {
    text-align: center;
    font-size: 0.8125rem;
    color: var(--color-text-sub);
    padding: var(--space-2) 0;
  }

  &__body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import type { DateCell } from '@/types';

const props = defineProps<{ cell: DateCell | null }>();

const dateText = computed(() => {
  if (!props.cell) return '';
  const d = props.cell.date;
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 周${weekDays[d.getDay()]}`;
});
</script>

<template>
  <section v-if="cell" class="day-detail">
    <h2 class="day-detail__date tnum">{{ dateText }}</h2>
    <dl class="day-detail__list">
      <div class="day-detail__row">
        <dt>农历</dt>
        <dd>
          {{ cell.lunar.monthText }}{{ cell.lunar.dayText }}
          <span v-if="cell.lunar.isLeapMonth" class="day-detail__tag">闰月</span>
        </dd>
      </div>
      <div class="day-detail__row">
        <dt>干支</dt>
        <dd>{{ cell.lunar.yearGanZhi }}年 {{ cell.lunar.monthGanZhi }}月 {{ cell.lunar.dayGanZhi }}日</dd>
      </div>
      <div class="day-detail__row">
        <dt>生肖</dt>
        <dd>属{{ cell.lunar.zodiac }}</dd>
      </div>
      <div v-if="cell.lunar.jieQi" class="day-detail__row">
        <dt>节气</dt>
        <dd class="day-detail--festive">{{ cell.lunar.jieQi }}</dd>
      </div>
      <div v-if="cell.holiday" class="day-detail__row">
        <dt>节假日</dt>
        <dd>
          {{ cell.holiday.name }}
          <span v-if="!cell.holiday.isOffDay" class="day-detail__tag">补班</span>
        </dd>
      </div>
    </dl>
  </section>
</template>

<style lang="scss" scoped>
.day-detail {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin: var(--space-3);
  box-shadow: var(--shadow-sm);

  &__date {
    font-size: 1.25rem;
    margin: 0 0 var(--space-3);
    color: var(--color-primary);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin: 0;
  }

  &__row {
    display: grid;
    grid-template-columns: 80px 1fr;
    align-items: baseline;
    font-size: 0.9375rem;

    dt { color: var(--color-text-sub); }
    dd { margin: 0; color: var(--color-text); }
  }

  &--festive { color: var(--color-festive); font-weight: 500; }

  &__tag {
    display: inline-block;
    margin-left: var(--space-1);
    padding: 0 6px;
    font-size: 0.6875rem;
    background: var(--color-surface-hover);
    color: var(--color-text-sub);
    border-radius: var(--radius-sm);
  }
}
</style>

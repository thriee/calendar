<script setup lang="ts">
import { computed } from 'vue';
import type { HolidayInfo } from '@/types';

const props = defineProps<{ holiday: HolidayInfo }>();

const variant = computed(() => {
  if (!props.holiday.isOffDay) return 'workday';
  if (props.holiday.type === 'traditional') return 'traditional';
  return 'legal';
});
</script>

<template>
  <span
    v-if="!holiday.isOffDay"
    class="chip chip--workday"
    :title="`${holiday.name}（补班）`"
  >班</span>
  <span
    v-else
    class="chip"
    :class="`chip--${variant}`"
    :title="holiday.name"
  >{{ holiday.name }}</span>
</template>

<style lang="scss" scoped>
.chip {
  display: inline-block;
  font-size: var(--font-chip);
  padding: 1px 4px;
  border-radius: 3px;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &--legal {
    background: var(--color-primary-soft);
    color: var(--color-primary);
  }

  &--traditional {
    background: var(--color-accent-soft);
    color: var(--color-festive);
  }

  &--workday {
    background: transparent;
    color: var(--color-workday);
    border: 1px solid var(--color-workday);
    font-weight: 500;
  }
}
</style>

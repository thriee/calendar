<script setup lang="ts">
import type { LunarInfo } from '@/types';

defineProps<{ lunar: LunarInfo }>();
</script>

<template>
  <span class="lunar-text" :class="{ 'lunar-text--festive': !!lunar.festival || !!lunar.jieQi }">
    {{ lunar.jieQi || lunar.festival || lunar.dayText || (lunar.isLeapMonth ? '闰' + lunar.monthText : '') }}
  </span>
</template>

<style lang="scss" scoped>
.lunar-text {
  font-size: var(--font-lunar);
  color: var(--color-text-muted);
  line-height: 1.1;

  &--festive {
    color: var(--color-festive);
    font-weight: 500;
  }
}
</style>

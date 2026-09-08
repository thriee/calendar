<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { beijingHMS } from '@/utils/time';
import { pad2 } from '@/utils/format';

const h = ref(0);
const m = ref(0);
const s = ref(0);

let timer: number | undefined;

function tick() {
  const t = beijingHMS(Date.now());
  h.value = t.h;
  m.value = t.m;
  s.value = t.s;
}

// 对齐到下一个整秒边界再逐秒刷新，避免 setInterval 累积漂移导致偶发跳秒。
function scheduleNext() {
  const delay = 1000 - (Date.now() % 1000);
  timer = window.setTimeout(() => {
    tick();
    scheduleNext();
  }, delay);
}

onMounted(() => {
  tick();
  scheduleNext();
});

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearTimeout(timer);
});
</script>

<template>
  <span class="beijing-clock" role="timer" aria-label="北京时间">
    <span class="beijing-clock__tag">北京时间</span>
    <time class="beijing-clock__time tnum">
      {{ pad2(h) }}:{{ pad2(m) }}:<span class="beijing-clock__sec">{{ pad2(s) }}</span>
    </time>
  </span>
</template>

<style lang="scss" scoped>
.beijing-clock {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 3px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  line-height: 1;
  white-space: nowrap;
  color: var(--color-text-sub);

  &__tag {
    color: var(--color-text-muted);
  }

  &__time {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
  }

  &__sec {
    color: var(--color-primary);
  }
}
</style>

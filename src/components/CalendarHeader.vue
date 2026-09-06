<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import ThemeToggle from './ThemeToggle.vue';
import YearMonthPicker from './YearMonthPicker.vue';

const props = defineProps<{
  year: number;
  month: number;
  isToday: boolean;
}>();

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'today'): void;
  (e: 'jump', year: number, month: number): void;
  (e: 'pick-holiday', name: string): void;
}>();

const yearLabel = computed(() => `${props.year}年${props.month}月`);

// —— 年月快速选择面板 ——
const pickerOpen = ref(false);
const pickerWrap = ref<HTMLElement | null>(null);
const labelBtn = ref<HTMLButtonElement | null>(null);

function togglePicker() {
  pickerOpen.value = !pickerOpen.value;
}

function closePicker(returnFocus = true) {
  pickerOpen.value = false;
  if (returnFocus) labelBtn.value?.focus();
}

// 点击面板/触发按钮以外区域、或按 Esc 时关闭
function onDocPointer(e: PointerEvent) {
  if (!pickerOpen.value) return;
  if (pickerWrap.value && !pickerWrap.value.contains(e.target as Node)) {
    closePicker(false);
  }
}

function onDocKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePicker();
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointer);
  document.addEventListener('keydown', onDocKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointer);
  document.removeEventListener('keydown', onDocKeydown);
});

function onPickYearMonth(y: number, m: number) {
  closePicker();
  emit('jump', y, m);
}

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
      <div ref="pickerWrap" class="cal-header__labelwrap">
        <button
          ref="labelBtn"
          class="cal-header__label tnum"
          type="button"
          :aria-expanded="pickerOpen"
          aria-haspopup="dialog"
          @click="togglePicker"
        >
          {{ yearLabel }}
          <span class="cal-header__caret" aria-hidden="true">▾</span>
        </button>
        <YearMonthPicker
          v-if="pickerOpen"
          :year="year"
          :month="month"
          @select="onPickYearMonth"
        />
      </div>
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

  &__labelwrap {
    position: relative;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 0;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    padding: 4px 8px;
    font-size: 1.125rem;
    font-weight: 600;
    font-family: inherit;
    color: var(--color-text);
    cursor: pointer;

    &:hover { background: var(--color-surface-hover); }
  }

  &__caret {
    font-size: 0.6em;
    line-height: 1;
    margin-top: 2px;
    color: var(--color-text-sub);
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

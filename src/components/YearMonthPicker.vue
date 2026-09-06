<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{ year: number; month: number }>();

const emit = defineEmits<{
  (e: 'select', year: number, month: number): void;
}>();

// 支持的年份范围（万年历常用区间）
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

/** 视图：先选年份，再选月份 */
const view = ref<'year' | 'month'>('year');
/** 当前「正在翻动/即将确认」的年份（可能还没提交） */
const focusYear = ref(props.year);

const pageStart = computed(() => Math.floor(focusYear.value / 10) * 10);
const pageLabel = computed(() => `${pageStart.value} - ${pageStart.value + 9}`);
const pageYears = computed(() =>
  Array.from({ length: 10 }, (_, i) => pageStart.value + i)
);

const months = computed(() =>
  Array.from({ length: 12 }, (_, i) => ({
    n: i + 1,
    label: `${i + 1}月`
  }))
);

function clampYear(y: number) {
  return Math.min(MAX_YEAR, Math.max(MIN_YEAR, y));
}

/** 年份视图：整十年翻页 */
function stepPage(dir: -1 | 1) {
  focusYear.value = clampYear(focusYear.value + dir * 10);
}

/** 月份视图：按年微调 */
function stepYear(dir: -1 | 1) {
  focusYear.value = clampYear(focusYear.value + dir);
}

/** 选中某一年 → 切到月份视图 */
function pickYear(y: number) {
  focusYear.value = y;
  view.value = 'month';
}

/** 返回年份视图 */
function backToYears() {
  view.value = 'year';
}

/** 选中某个月 → 提交 */
function pickMonth(m: number) {
  emit('select', focusYear.value, m);
}
</script>

<template>
  <div class="ym-picker" role="dialog" aria-label="选择年月">
    <!-- 年份视图 -->
    <template v-if="view === 'year'">
      <div class="ym-picker__head">
        <button
          class="ym-picker__nav"
          type="button"
          aria-label="上十年"
          @click="stepPage(-1)"
        >
          «
        </button>
        <span class="ym-picker__title tnum">{{ pageLabel }}</span>
        <button
          class="ym-picker__nav"
          type="button"
          aria-label="下十年"
          @click="stepPage(1)"
        >
          »
        </button>
      </div>
      <div class="ym-picker__years">
        <button
          v-for="y in pageYears"
          :key="y"
          type="button"
          class="ym-picker__cell ym-picker__cell--year tnum"
          :class="{ 'is-current': y === year, 'is-focus': y === focusYear }"
          @click="pickYear(y)"
        >
          {{ y }}
        </button>
      </div>
    </template>

    <!-- 月份视图 -->
    <template v-else>
      <div class="ym-picker__head">
        <button
          class="ym-picker__nav"
          type="button"
          aria-label="上一年"
          @click="stepYear(-1)"
        >
          ‹
        </button>
        <button
          class="ym-picker__title ym-picker__title--btn tnum"
          type="button"
          @click="backToYears"
        >
          {{ focusYear }}年
        </button>
        <button
          class="ym-picker__nav"
          type="button"
          aria-label="下一年"
          @click="stepYear(1)"
        >
          ›
        </button>
      </div>
      <div class="ym-picker__months">
        <button
          v-for="m in months"
          :key="m.n"
          type="button"
          class="ym-picker__cell ym-picker__cell--month"
          :class="{ 'is-current': focusYear === year && m.n === month }"
          @click="pickMonth(m.n)"
        >
          {{ m.label }}
        </button>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.ym-picker {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  max-width: calc(100vw - 32px);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--space-3);
  z-index: 30;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    margin-bottom: var(--space-3);
  }

  &__nav {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-text);
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;

    &:hover { background: var(--color-surface-hover); }
  }

  &__title {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    text-align: center;
  }

  &__title--btn {
    background: transparent;
    border: none;
    border-radius: var(--radius-sm);
    padding: 6px 12px;
    cursor: pointer;
    font-family: inherit;

    &:hover { background: var(--color-surface-hover); }
  }

  &__years {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
  }

  &__months {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
  }

  &__cell {
    background: transparent;
    border: 1px solid transparent;
    border-radius: var(--radius-sm);
    padding: 8px 0;
    font-size: 0.875rem;
    font-family: inherit;
    color: var(--color-text);
    cursor: pointer;

    &:hover { background: var(--color-surface-hover); }

    &.is-current {
      background: var(--color-today-soft);
      color: var(--color-today);
      font-weight: 600;
    }
  }

  &__cell--year {
    &.is-focus:not(.is-current) {
      border-color: var(--color-border);
    }
  }
}
</style>

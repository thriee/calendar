<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCalendarStore } from '@/stores/calendar';
import { useCalendar } from '@/composables/useCalendar';
import { buildDateCell, isSameDay } from '@/utils/date';
import { parseYMD } from '@/utils/format';
import { toLunarInfo } from '@/composables/useLunar';
import { getHoliday } from '@/composables/useHolidays';
import CalendarHeader from '@/components/CalendarHeader.vue';
import MonthGrid from '@/components/MonthGrid.vue';
import DayView from './DayView.vue';

const store = useCalendarStore();
const route = useRoute();
const router = useRouter();

const { year, month, cells, next, prev, goto } = useCalendar(
  computed(() => store.today),
  computed(() => store.selected)
);

// 同步 store viewYear/viewMonth -> useCalendar
watch(
  () => [store.viewYear, store.viewMonth],
  ([y, m]) => goto(y, m)
);

// 同步 useCalendar -> store
watch([year, month], ([y, m]) => store.setView(y, m));

// 同步 URL
watch(
  [year, month, () => store.selected],
  ([y, m, sel]) => {
    const selYmd = `${sel.getFullYear()}-${String(sel.getMonth() + 1).padStart(2, '0')}-${String(sel.getDate()).padStart(2, '0')}`;
    router.replace({ query: { y, m: String(m), d: selYmd } });
  }
);

// 初始化：URL 优先。y/m 为「查看月份」，d 为「选中日」（完整 YYYY-MM-DD）。
// 选中日与查看月份相互独立：即使 d 不在 y/m 的网格内，也会被完整还原，
// 刷新后与离开时的选中 + 视图保持一致。
onMounted(() => {
  const y = Number(route.query.y);
  const m = Number(route.query.m);
  const d = parseYMD(String(route.query.d ?? ''));
  if (y && m) store.setView(y, m);
  if (d) store.setSelected(d);
});

// 今日按钮：仅当「正在查看今天所在月份，且当前选中日就是今天」时才禁用。
// 选中了当月其他日期、或翻到其他月份时按钮保持可用，点击会经 store.gotoToday
// 把 选中日/视图 一起重置回今天。
const isToday = computed(() => {
  const t = store.today;
  return (
    t.getFullYear() === year.value &&
    t.getMonth() + 1 === month.value &&
    isSameDay(t, store.selected)
  );
});

// 详情面板始终跟随「选中日」：
// 优先取当前网格里的真实单元格（保留其 isToday/isSelected/inCurrentMonth 标志）；
// 若选中日不在当前查看月份的网格内（如纯翻月后），则用纯构建器合成一个完整 DateCell，
// 保证农历/节假日等详情数据不随网格丢失，面板永不置空。
const selectedCell = computed(() => {
  const hit = cells.value.find((c) => c.isSelected);
  if (hit) return hit;
  return buildDateCell(store.selected, store.today, store.selected, toLunarInfo, getHoliday);
});

function onSelect(d: Date) {
  store.setSelected(d);
  if (d.getFullYear() !== year.value || d.getMonth() + 1 !== month.value) {
    goto(d.getFullYear(), d.getMonth() + 1);
  }
}

function onSwipe(direction: 'left' | 'right') {
  if (direction === 'left') next();
  else prev();
}

function onPickHoliday(name: string) {
  // 简化版：跳到当前查看年中该节日通常所在的月份。
  // 注意：春节/端午/中秋为农历节日，其公历日期逐年浮动，这里只按月近似跳转且不选定日期，
  // 避免把农历节日错当成固定公历日；精确到日可后续结合农历/节假日数据完善。
  const monthMap: Record<string, number> = {
    元旦: 1,
    春节: 2,
    清明: 4,
    五一: 5,
    端午: 6,
    中秋: 9,
    国庆: 10
  };
  const m = monthMap[name];
  if (m) goto(year.value, m);
}
</script>

<template>
  <div class="month-view">
    <CalendarHeader
      :year="year"
      :month="month"
      :is-today="isToday"
      @prev="prev"
      @next="next"
      @today="store.gotoToday"
      @pick-holiday="onPickHoliday"
    />
    <MonthGrid :cells="cells" @select="onSelect" @swipe="onSwipe" />
    <DayView :cell="selectedCell" />
  </div>
</template>

<style lang="scss" scoped>
.month-view {
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: minmax(320px, 480px) 1fr;
    grid-template-areas:
      'header header'
      'grid detail';
    gap: var(--space-4);
    padding: var(--space-4);

    :deep(.cal-header) { grid-area: header; position: static; }
    :deep(.month-grid) { grid-area: grid; }
    :deep(.day-detail) { grid-area: detail; align-self: start; position: sticky; top: var(--space-4); }
  }
}
</style>

// composables/useCalendar.ts
import { ref, computed } from 'vue';
import { getMonthGrid } from '@/utils/date';
import { toLunarInfo } from './useLunar';
import { getHoliday } from './useHolidays';
import type { DateCell } from '@/types';

/**
 * 月历 composable
 * @param today 响应式"今天"
 * @param selected 响应式"选中日"
 */
export function useCalendar(today: Ref<Date>, selected: Ref<Date>) {
  const year = ref(selected.value.getFullYear());
  const month = ref(selected.value.getMonth() + 1);

  const cells = computed<DateCell[]>(() => {
    return getMonthGrid(
      year.value,
      month.value,
      today.value,
      toLunarInfo,
      getHoliday,
      selected.value
    );
  });

  function goto(year_: number, month_: number, day?: number) {
    year.value = year_;
    month.value = month_;
    if (day) {
      // 通过外部 selected 引用修改（保持响应性）
      selected.value = new Date(year_, month_ - 1, day);
    }
  }

  function next() {
    if (month.value === 12) {
      year.value += 1;
      month.value = 1;
    } else {
      month.value += 1;
    }
  }

  function prev() {
    if (month.value === 1) {
      year.value -= 1;
      month.value = 12;
    } else {
      month.value -= 1;
    }
  }

  return { year, month, cells, goto, next, prev };
}

import type { Ref } from 'vue';

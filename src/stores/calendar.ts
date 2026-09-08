// stores/calendar.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { beijingNow } from '@/utils/time';

export const useCalendarStore = defineStore('calendar', () => {
  const today = ref(beijingNow());
  const selected = ref(beijingNow());
  const viewYear = ref(selected.value.getFullYear());
  const viewMonth = ref(selected.value.getMonth() + 1);

  function setSelected(d: Date) {
    selected.value = d;
  }

  function setView(y: number, m: number) {
    viewYear.value = y;
    viewMonth.value = m;
  }

  function gotoToday() {
    const t = beijingNow();
    today.value = t;
    selected.value = t;
    viewYear.value = t.getFullYear();
    viewMonth.value = t.getMonth() + 1;
  }

  return { today, selected, viewYear, viewMonth, setSelected, setView, gotoToday };
});

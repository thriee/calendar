// composables/useHolidays.ts
import holidays from '@/data/holidays.json';
import type { HolidayEntry, HolidayInfo } from '@/types';
import { formatYMD } from '@/utils/format';
import { toLunarInfo } from './useLunar';

const holidayMap = new Map<string, HolidayEntry>();
for (const h of holidays as HolidayEntry[]) {
  holidayMap.set(h.date, h);
}

/**
 * 获取某日的节假日信息
 * 优先级：内置表 > 通用公历规则 > 农历传统节日 > null
 */
export function getHoliday(date: Date): HolidayInfo | null {
  const ymd = formatYMD(date);

  // 1. 内置表
  const entry = holidayMap.get(ymd);
  if (entry) {
    return {
      name: entry.name,
      isOffDay: entry.isOffDay,
      type: entry.isOffDay ? 'legal' : 'workday'
    };
  }

  // 2. 通用公历规则
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 1 && d === 1) return { name: '元旦', isOffDay: true, type: 'legal' };
  if (m === 5 && d === 1) return { name: '劳动节', isOffDay: true, type: 'legal' };
  if (m === 10 && d >= 1 && d <= 7) {
    return { name: '国庆节', isOffDay: true, type: 'legal' };
  }

  // 3. 农历传统节日
  const lunar = toLunarInfo(date);
  if (lunar.festival) {
    return { name: lunar.festival, isOffDay: true, type: 'traditional' };
  }

  return null;
}

export function useHolidays() {
  return { getHoliday };
}

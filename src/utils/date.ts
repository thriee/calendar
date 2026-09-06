// utils/date.ts
import type { DateCell, LunarInfo, HolidayInfo } from '@/types';

/**
 * 为任意公历日期构建一个独立的 DateCell（不要求该日位于某个月份网格内）。
 *
 * 详情面板需要「选中日即使不在当前查看的月份网格中，也始终能完整展示」，
 * 因此把单元格构造抽成纯函数供网格与详情两处复用，字段结构与网格单元保持一致。
 * @param date 目标公历日期
 * @param today 今天（用于标记 isToday）
 * @param selectedDate 当前选中日（可省略）
 * @param lunarProvider 获取农历信息的函数（避免循环依赖）
 * @param holidayProvider 获取节假日的函数
 * @param inCurrentMonth 是否属于当前查看月份（网格场景按真实归属传入；独立详情场景默认 true）
 */
export function buildDateCell(
  date: Date,
  today: Date,
  selectedDate?: Date,
  lunarProvider: (d: Date) => LunarInfo = () => emptyLunar(),
  holidayProvider: (d: Date) => HolidayInfo | null = () => null,
  inCurrentMonth = true
): DateCell {
  return {
    date,
    inCurrentMonth,
    isToday: isSameDay(date, today),
    isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
    lunar: lunarProvider(date),
    holiday: holidayProvider(date)
  };
}

/**
 * 获取某年某月的日历网格（6 行 × 7 列，从周一开始）
 * @param year 年（如 2026）
 * @param month 月（1-12）
 * @param today 今天（用于标记 isToday）
 * @param lunarProvider 获取农历信息的函数（避免循环依赖）
 * @param holidayProvider 获取节假日的函数
 * @param selectedDate 选中日
 */
export function getMonthGrid(
  year: number,
  month: number,
  today: Date,
  lunarProvider: (d: Date) => LunarInfo = () => emptyLunar(),
  holidayProvider: (d: Date) => HolidayInfo | null = () => null,
  selectedDate?: Date
): DateCell[] {
  const firstOfMonth = new Date(year, month - 1, 1);
  // 周一 = 1，周日 = 0；转换为周一时为 0
  const firstDayWeek = (firstOfMonth.getDay() + 6) % 7;

  const start = new Date(year, month - 1, 1 - firstDayWeek);

  const cells: DateCell[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    cells.push(
      buildDateCell(date, today, selectedDate, lunarProvider, holidayProvider, date.getMonth() === month - 1)
    );
  }
  return cells;
}

/** 计算 ISO 周次（周一为周首日） */
export function getISOWeek(date: Date): number {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  // 调整为周一开始
  const dayNum = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - dayNum + 3); // 周四
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** 判断两个日期是否为同一天（忽略时分秒） */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 增加/减少月份，自动处理跨年与月底 clamp */
export function addMonths(date: Date, n: number): Date {
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth() + n;
  const targetDay = date.getDate();

  // 用 Date 0 日 = 上月最后一天 的方式 clamp
  const firstOfTarget = new Date(targetYear, targetMonth, 1);
  const lastDayOfTarget = new Date(firstOfTarget.getFullYear(), firstOfTarget.getMonth() + 1, 0).getDate();
  const safeDay = Math.min(targetDay, lastDayOfTarget);

  return new Date(firstOfTarget.getFullYear(), firstOfTarget.getMonth(), safeDay);
}

function emptyLunar(): LunarInfo {
  return {
    dayText: '',
    monthText: '',
    yearGanZhi: '',
    monthGanZhi: '',
    dayGanZhi: '',
    zodiac: '',
    isLeapMonth: false,
    jieQi: null,
    festival: null
  };
}

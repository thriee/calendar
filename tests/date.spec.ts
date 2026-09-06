import { describe, it, expect } from 'vitest';
import { getMonthGrid, buildDateCell, getISOWeek, isSameDay, addMonths } from '@/utils/date';

describe('getMonthGrid', () => {
  it('returns 42 cells (6 rows × 7 cols)', () => {
    const cells = getMonthGrid(2026, 9, new Date('2026-09-15'));
    expect(cells).toHaveLength(42);
  });

  it('starts on Monday and ends on Sunday', () => {
    const cells = getMonthGrid(2026, 9, new Date('2026-09-15'));
    // 2026-09-01 是周二，所以第一格应该是 2026-08-31（周一）
    expect(cells[0].date.getDay()).toBe(1);
    expect(cells[41].date.getDay()).toBe(0);
  });

  it('marks inCurrentMonth correctly', () => {
    const cells = getMonthGrid(2026, 9, new Date('2026-09-15'));
    const inMonth = cells.filter((c) => c.inCurrentMonth);
    expect(inMonth).toHaveLength(30); // 9 月有 30 天
  });

  it('marks today correctly', () => {
    const cells = getMonthGrid(2026, 9, new Date('2026-09-15'));
    const today = cells.find((c) => c.isToday);
    expect(today?.date.getDate()).toBe(15);
  });

  it('handles February in leap year (2024)', () => {
    const cells = getMonthGrid(2024, 2, new Date('2024-02-15'));
    const inMonth = cells.filter((c) => c.inCurrentMonth);
    expect(inMonth).toHaveLength(29);
  });

  it('handles cross-year scenario (Jan 2026)', () => {
    const cells = getMonthGrid(2026, 1, new Date('2026-01-15'));
    // 2026-01-01 是周四，所以前面应有 3 天（2025-12-29 周一、30 周二、31 周三）
    expect(cells[0].date.getFullYear()).toBe(2025);
    expect(cells[0].date.getMonth()).toBe(11); // 12 月（0-indexed）
  });

  it('marks the selected date when it lies inside the grid (regression)', () => {
    const cells = getMonthGrid(2026, 10, new Date('2026-09-06'), undefined, undefined, new Date('2026-10-15'));
    const sel = cells.filter((c) => c.isSelected);
    expect(sel).toHaveLength(1);
    expect(sel[0].date.getDate()).toBe(15);
  });

  it('leaves no cell selected when the selected date is outside the grid window (regression)', () => {
    // 选中日 2026-09-06 落在 2026-10 网格窗口（约 09-28 ~ 11-08）之外
    const cells = getMonthGrid(2026, 10, new Date('2026-09-06'), undefined, undefined, new Date('2026-09-06'));
    expect(cells.some((c) => c.isSelected)).toBe(false);
  });
});

describe('buildDateCell', () => {
  const lunarStub = () => ({
    dayText: '初一',
    monthText: '正月',
    yearGanZhi: '甲辰',
    monthGanZhi: '丙寅',
    dayGanZhi: '甲子',
    zodiac: '龙',
    isLeapMonth: false,
    jieQi: null,
    festival: null
  });
  const holidayStub = () => ({ name: '春节', type: 'legal', isOffDay: true } as const);

  it('builds a full cell for a selected date outside the viewed month', () => {
    const selected = new Date(2026, 8, 6);
    const today = new Date(2026, 8, 6);
    const cell = buildDateCell(selected, today, selected, lunarStub, holidayStub);
    expect(cell.date).toEqual(selected);
    expect(cell.isSelected).toBe(true);
    expect(cell.isToday).toBe(true);
    expect(cell.inCurrentMonth).toBe(true);
    // 农历/节假日由 provider 正常填充
    expect(cell.lunar.dayText).toBe('初一');
    expect(cell.holiday?.name).toBe('春节');
  });

  it('keeps isToday/isSelected false for an unrelated date, using default providers', () => {
    const cell = buildDateCell(new Date(2026, 9, 15), new Date(2026, 8, 6));
    expect(cell.isSelected).toBe(false);
    expect(cell.isToday).toBe(false);
    expect(cell.holiday).toBeNull();
    expect(cell.lunar.dayText).toBe('');
  });

  it('honours the inCurrentMonth flag passed by callers', () => {
    const cell = buildDateCell(new Date(2026, 9, 15), new Date(2026, 8, 6), undefined, undefined, undefined, false);
    expect(cell.inCurrentMonth).toBe(false);
  });
});

describe('getISOWeek', () => {
  it('returns correct ISO week for known dates', () => {
    expect(getISOWeek(new Date('2026-01-01'))).toBe(1);
    expect(getISOWeek(new Date('2024-12-30'))).toBe(1); // ISO 周
    expect(getISOWeek(new Date('2025-06-15'))).toBe(24);
  });
});

describe('isSameDay', () => {
  it('returns true for same date with different times', () => {
    const a = new Date('2026-09-06T08:00:00');
    const b = new Date('2026-09-06T22:30:00');
    expect(isSameDay(a, b)).toBe(true);
  });

  it('returns false for different days', () => {
    expect(isSameDay(new Date('2026-09-06'), new Date('2026-09-07'))).toBe(false);
  });
});

describe('addMonths', () => {
  it('adds 1 month normally', () => {
    const r = addMonths(new Date('2026-09-15'), 1);
    expect(r.getFullYear()).toBe(2026);
    expect(r.getMonth()).toBe(9); // 10 月
    expect(r.getDate()).toBe(15);
  });

  it('crosses year boundary', () => {
    const r = addMonths(new Date('2026-12-15'), 1);
    expect(r.getFullYear()).toBe(2027);
    expect(r.getMonth()).toBe(0);
  });

  it('subtracts 1 month', () => {
    const r = addMonths(new Date('2026-03-15'), -1);
    expect(r.getMonth()).toBe(1); // 2 月
  });

  it('clamps day when target month is shorter (Jan 31 + 1 month)', () => {
    const r = addMonths(new Date('2026-01-31'), 1);
    // 2 月只有 28 天，应该 clamp 到 28
    expect(r.getMonth()).toBe(1);
    expect(r.getDate()).toBe(28);
  });
});

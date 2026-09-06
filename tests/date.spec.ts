import { describe, it, expect } from 'vitest';
import { getMonthGrid, getISOWeek, isSameDay, addMonths } from '@/utils/date';

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

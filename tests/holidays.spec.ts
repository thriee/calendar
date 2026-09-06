import { describe, it, expect } from 'vitest';
import { getHoliday } from '@/composables/useHolidays';

describe('getHoliday - 内置表', () => {
  it('returns 国庆节 for 2024-10-01', () => {
    const r = getHoliday(new Date(2024, 9, 1));
    expect(r?.name).toBe('国庆节');
    expect(r?.isOffDay).toBe(true);
    expect(r?.type).toBe('legal');
  });

  it('returns 调休补班 for 2024-09-29', () => {
    const r = getHoliday(new Date(2024, 8, 29));
    expect(r?.name).toContain('调休');
    expect(r?.isOffDay).toBe(false);
    expect(r?.type).toBe('workday');
  });

  it('returns Spring Festival off-day for 2024-02-10', () => {
    const r = getHoliday(new Date(2024, 1, 10));
    expect(r?.name).toBe('春节');
    expect(r?.isOffDay).toBe(true);
  });
});

describe('getHoliday - 通用规则', () => {
  it('returns 元旦 for 2028-01-01 (not in table)', () => {
    const r = getHoliday(new Date(2028, 0, 1));
    expect(r?.name).toBe('元旦');
    expect(r?.type).toBe('legal');
  });

  it('returns 劳动节 for 2028-05-01', () => {
    const r = getHoliday(new Date(2028, 4, 1));
    expect(r?.name).toBe('劳动节');
  });

  it('returns 国庆节 for 2028-10-01', () => {
    const r = getHoliday(new Date(2028, 9, 1));
    expect(r?.name).toBe('国庆节');
  });
});

describe('getHoliday - 农历传统节日', () => {
  it('returns 春节 for 2028 Chinese New Year (查通用规则会失败，由 lunar 兜底)', () => {
    // 2028 春节 = 农历正月初一，公历需查表
    // 2028-01-26 是 2028 春节（手工数据，未在表内）
    // 该测试验证 lunar 兜底路径
    const r = getHoliday(new Date(2028, 0, 26));
    expect(r?.name).toContain('春节');
  });
});

describe('getHoliday - 无节日', () => {
  it('returns null for an ordinary day', () => {
    const r = getHoliday(new Date(2026, 8, 6));
    // 9月6日不是节假日
    expect(r).toBeNull();
  });
});

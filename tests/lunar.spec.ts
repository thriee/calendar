import { describe, it, expect } from 'vitest';
import { toLunarInfo } from '@/composables/useLunar';

describe('toLunarInfo', () => {
  it('converts Spring Festival 2024-02-10 (Chinese New Year)', () => {
    const info = toLunarInfo(new Date(2024, 1, 10));
    expect(info.dayText).toBe('初一');
    expect(info.monthText).toBe('正月');
    expect(info.zodiac).toBe('龙');
  });

  it('converts Qixi 2024-08-10', () => {
    const info = toLunarInfo(new Date(2024, 7, 10));
    // 2024-08-10 是农历七月初七，七夕节
    expect(info.dayText).toBe('初七');
    expect(info.monthText).toBe('七月');
  });

  it('converts 2025-01-29 Spring Festival (蛇年)', () => {
    const info = toLunarInfo(new Date(2025, 0, 29));
    expect(info.dayText).toBe('初一');
    expect(info.zodiac).toBe('蛇');
  });

  it('detects Qingming jieqi on 2024-04-04', () => {
    const info = toLunarInfo(new Date(2024, 3, 4));
    expect(info.jieQi).toBe('清明');
  });

  it('detects a leap month (2025 has leap 6th month)', () => {
    // 2025-07-25 是闰六月初一
    const info = toLunarInfo(new Date(2025, 6, 25));
    expect(info.isLeapMonth).toBe(true);
    expect(info.monthText).toBe('六月');
  });

  it('returns null jieQi for non-jieqi days', () => {
    const info = toLunarInfo(new Date(2026, 8, 6));
    expect(info.jieQi).toBeNull();
  });

  it('populates gan-zhi strings', () => {
    const info = toLunarInfo(new Date(2026, 8, 6));
    expect(info.yearGanZhi).toBeTruthy();
    expect(info.monthGanZhi).toBeTruthy();
    expect(info.dayGanZhi).toBeTruthy();
  });
});

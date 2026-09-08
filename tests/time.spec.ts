import { describe, it, expect } from 'vitest';
import { beijingHMS, toBeijingDate } from '@/utils/time';

describe('beijingHMS', () => {
  it('shifts UTC to Beijing (UTC+8)', () => {
    // 2026-01-01T00:00:00Z -> 北京 08:00:00
    expect(beijingHMS(Date.UTC(2026, 0, 1, 0, 0, 0))).toEqual({ h: 8, m: 0, s: 0 });
  });

  it('rolls over to the next day past Beijing midnight', () => {
    // 2026-01-01T16:30:00Z -> 北京 2026-01-02 00:30:00
    expect(beijingHMS(Date.UTC(2026, 0, 1, 16, 30, 0))).toEqual({ h: 0, m: 30, s: 0 });
  });
});

describe('toBeijingDate', () => {
  it('returns local fields equal to Beijing wall clock', () => {
    const d = toBeijingDate(Date.UTC(2026, 0, 1, 16, 30, 0));
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0); // 1 月
    expect(d.getDate()).toBe(2);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(30);
  });
});

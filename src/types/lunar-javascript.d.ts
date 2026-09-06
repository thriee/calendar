// src/types/lunar-javascript.d.ts
// Ambient type declaration for the typeless CJS package `lunar-javascript`.
// No `@types/lunar-javascript` exists. Declared from the real 1.7.7 API surface
// used by src/composables/useLunar.ts (verified against the installed module).

declare module 'lunar-javascript' {
  export class Solar {
    /** 从公历 Date（本地时区）构造 Solar */
    static fromDate(date: Date): Solar;
    /** 由年月日构造 Solar */
    static fromYmd(year: number, month: number, day: number): Solar;

    /** 取对应农历 */
    getLunar(): Lunar;

    getYear(): number;
    getMonth(): number;
    getDay(): number;
  }

  export class Lunar {
    /** 农历日中文，如 "初一" */
    getDayInChinese(): string;
    /** 农历月中文（不带“月”，闰月带“闰”前缀），如 "正" | "六" | "闰六" */
    getMonthInChinese(): string;
    /** 年干支，如 "甲辰" */
    getYearInGanZhi(): string;
    /** 月干支，如 "丙寅" */
    getMonthInGanZhi(): string;
    /** 日干支，如 "甲辰" */
    getDayInGanZhi(): string;
    /** 生肖，如 "龙" */
    getYearShengXiao(): string;
    /** 农历月（负数表示闰月），如 6=六月, -6=闰六月 */
    getMonth(): number;
    /** 农历日 */
    getDay(): number;
    /** 节气名；无节气时返回空字符串 "" */
    getJieQi(): string;
    /** 农历传统节日名数组，如 ["春节"]；无则空数组 */
    getFestivals(): string[];
  }
}

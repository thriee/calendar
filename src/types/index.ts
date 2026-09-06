// types/index.ts
// 全局 TypeScript 类型定义

/** 月历中一个单元格的完整描述 */
export interface DateCell {
  /** 公历日期（00:00:00） */
  date: Date;
  /** 是否属于当前查看的月份 */
  inCurrentMonth: boolean;
  /** 是否为今天 */
  isToday: boolean;
  /** 是否被选中 */
  isSelected: boolean;
  /** 农历信息 */
  lunar: LunarInfo;
  /** 节假日信息（如有） */
  holiday: HolidayInfo | null;
}

/** 农历详情 */
export interface LunarInfo {
  /** 日期，如 "廿五" */
  dayText: string;
  /** 月份，如 "七月" */
  monthText: string;
  /** 年干支，如 "丙午" */
  yearGanZhi: string;
  /** 月干支，如 "庚子" */
  monthGanZhi: string;
  /** 日干支，如 "壬寅" */
  dayGanZhi: string;
  /** 生肖，如 "马" */
  zodiac: string;
  /** 是否闰月 */
  isLeapMonth: boolean;
  /** 节气，如 "秋分"，无则 null */
  jieQi: string | null;
  /** 农历传统节日，如 "中秋节"，无则 null */
  festival: string | null;
}

/** 节假日信息 */
export interface HolidayInfo {
  /** 节日名，如 "国庆节" */
  name: string;
  /** 类型：法定/传统/调休补班 */
  type: 'legal' | 'traditional' | 'workday';
  /** true=放假，false=补班 */
  isOffDay: boolean;
}

/** 主题模式 */
export type Theme = 'system' | 'light' | 'dark';

/** 节假日表项（holidays.json 的原始结构） */
export interface HolidayEntry {
  /** YYYY-MM-DD */
  date: string;
  /** 节日名 */
  name: string;
  /** true=放假，false=补班 */
  isOffDay: boolean;
}

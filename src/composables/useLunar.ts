// composables/useLunar.ts
import { Solar } from 'lunar-javascript';
import type { LunarInfo } from '@/types';

/**
 * 把公历 Date 转为 LunarInfo。
 * 内部封装 lunar-javascript，便于单测 mock。
 *
 * 注：已按实际安装的 lunar-javascript 1.7.7 校准 API：
 *  - 1.7.7 的节气 getJieQi() 无节气时返回 ""（非 null）；
 *  - getMonthInChinese() 返回的是不含“月”的月名，且闰月带“闰”前缀（如“闰六”）。
 *    这里在 isLeapMonth 单独成字段的前提下，monthText 保留去掉“闰”的常规月名。
 */
export function toLunarInfo(date: Date): LunarInfo {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const jieQi = lunar.getJieQi();
  const festivals = lunar.getFestivals();
  const firstFestival = festivals && festivals.length > 0 ? festivals[0] : null;

  const isLeapMonth = lunar.getMonth() < 0;
  const monthCn = lunar.getMonthInChinese(); // 例：'正' | '六' | '闰六'
  const monthText = (isLeapMonth && monthCn.startsWith('闰') ? monthCn.slice(1) : monthCn) + '月';

  return {
    dayText: lunar.getDayInChinese(),
    monthText,
    yearGanZhi: lunar.getYearInGanZhi(),
    monthGanZhi: lunar.getMonthInGanZhi(),
    dayGanZhi: lunar.getDayInGanZhi(),
    zodiac: lunar.getYearShengXiao(),
    isLeapMonth,
    jieQi: jieQi || null,
    festival: firstFestival
  };
}

/** Vue composable 形式（保持接口一致性） */
export function useLunar() {
  return { toLunarInfo };
}

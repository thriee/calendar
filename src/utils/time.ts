// utils/time.ts

/** 东八区（北京时间）相对 UTC 的固定偏移，中国无夏令时。 */
export const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

/**
 * 把任意时刻（毫秒时间戳）换算成「本地字段即北京时间」的 Date。
 *
 * 返回值的 getFullYear/getMonth/getDate/getHours 等本地 getter 直接就是北京时间，
 * 因此日历里既有的本地 getter 逻辑无需改动，即可在任意时区（如部署在非东八区的
 * 服务器、或位于其他时区的访客浏览器）下都按北京时间工作。
 */
export function toBeijingDate(ms: number): Date {
  const shifted = new Date(ms + BEIJING_OFFSET_MS);
  return new Date(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    shifted.getUTCHours(),
    shifted.getUTCMinutes(),
    shifted.getUTCSeconds()
  );
}

/** 当前北京时间（本地字段即北京时间）。 */
export function beijingNow(): Date {
  return toBeijingDate(Date.now());
}

/** 某个时刻对应的北京时间时/分/秒（直接读 UTC 分量，避免本地时区/DST 影响）。 */
export function beijingHMS(ms: number): { h: number; m: number; s: number } {
  const shifted = new Date(ms + BEIJING_OFFSET_MS);
  return {
    h: shifted.getUTCHours(),
    m: shifted.getUTCMinutes(),
    s: shifted.getUTCSeconds()
  };
}

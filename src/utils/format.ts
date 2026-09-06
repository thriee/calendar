// utils/format.ts

/** 格式化为 YYYY-MM-DD */
export function formatYMD(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** 解析 YYYY-MM-DD，失败返回 null */
export function parseYMD(str: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== mo - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

/** 两位数补零 */
export function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** 中文数字（一到十、初一/廿等由 lunar-javascript 提供，此处仅辅助） */
export function pad2CN(n: number): string {
  const cn = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return n < 10 ? cn[n] : `${cn[Math.floor(n / 10)]}${cn[n % 10]}`;
}

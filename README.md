# 万年历

移动优先、响应式、支持 PWA 安装的万年历 Web 应用。

## 功能

- 公历月视图，周首日为周一
- 选中日详情：农历日期、干支、生肖、节气
- 中国法定节假日（2024-2027）+ 调休补班标记
- 传统节日：春节、元宵、端午、中秋等
- 24 节气标记
- 亮 / 暗 / 跟随系统 主题
- 移动端左右滑动切换月份
- 可安装到手机主屏幕（PWA）

## 开发

```bash
pnpm install
pnpm dev
```

访问 http://localhost:5173

## 构建

```bash
pnpm build
pnpm preview
```

## 测试

```bash
pnpm test
```

## 技术栈

- Vue 3 + Vite 6 + TypeScript
- Pinia / Vue Router
- lunar-javascript（农历数据）
- vite-plugin-pwa（Service Worker）
- Vitest（单元测试）

## 数据说明

- **农历/节气/干支**: 由 `lunar-javascript` 提供，覆盖 1900-2100 年
- **法定节假日**: `src/data/holidays.json` 收录 2024-2027 年；超出范围按通用规则（元旦/五一/国庆）回退
- **传统节日**: 由 `lunar-javascript.getFestivals()` 兜底

## 扩展节假日

如需添加新一年的法定节假日，编辑 `src/data/holidays.json` 即可：

```json
{ "date": "2028-02-16", "name": "春节", "isOffDay": true }
```

## 浏览器支持

- iOS Safari 14+（添加到主屏幕后 standalone）
- Chrome / Edge / Firefox 现代版本

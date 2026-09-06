# 万年历 PWA Web 应用 — 设计规格

- **日期**: 2026-09-06
- **作者**: Claude Code（与用户协作）
- **状态**: 待用户审核
- **范围**: v1，移动优先 + 响应式 + PWA，核心日历 + 农历详情

---

## 1. 目标与范围

### 1.1 目标

构建一个**移动优先、响应式、支持 PWA 安装**的万年历 Web 应用，提供公历月视图、农历详情、节气、传统节日、中国法定节假日（含调休标记）、周次、今日跳转、年/月快速切换等核心能力。

### 1.2 范围内（v1）

- 公历月视图：6 行 × 7 列网格，周首日为周一
- 选中日详情：农历日期、干支纪年、生肖、节气、农历月份中文名
- 中国法定节假日：内置 2024–2027 年数据 + 通用规则（元旦/春节/清明/劳动节/端午/中秋/国庆）
- 调休标记：法定假日放假 → 红色 chip；调休补班 → 灰色"班"字
- 传统节日标记：春节、元宵、端午、中元、中秋、腊八、除夕等
- 节气标记：立春、清明、夏至等 24 节气
- 周次显示（ISO 周次）
- 年/月下拉切换
- "返回今日"快捷按钮
- 节假日快捷按钮：元旦/春节/清明/劳动节/端午/中秋/国庆
- 移动端左右滑动手势切换月份
- 桌面端响应式：右侧详情面板
- 主题：亮 / 暗 / 跟随系统
- PWA：manifest + service worker，可安装到主屏
- 离线支持：app shell 预缓存
- 单元测试：核心纯函数

### 1.3 范围外（v1 不做）

- 老黄历宜忌、择吉日、择吉时（v1.1 考虑）
- 星座运势
- 用户系统、云同步
- 记事 / 提醒
- 推送通知
- 农历日历视图（仅公历视图 + 农历详情）
- 多语言（仅简体中文）

---

## 2. 技术栈

| 类别 | 选型 | 版本 | 说明 |
|---|---|---|---|
| 框架 | Vue | 3.5+ | 组合式 API + `<script setup>` |
| 构建 | Vite | 6.x | |
| 语言 | TypeScript | 5.x | 严格模式 |
| 路由 | Vue Router | 4.x | hash 模式 |
| 状态 | Pinia | 2.x | 仅用于跨组件的当前选中日期 |
| 样式 | 原生 CSS + SCSS | — | CSS 变量主题 |
| 农历库 | lunar-javascript | latest | 1900–2100 农历/干支/节气 |
| PWA | vite-plugin-pwa | latest | Workbox |
| 测试 | Vitest | 2.x | 单元测试 |
| 测试工具 | @vue/test-utils | 2.x | 组件测试（如需要） |
| Lint | ESLint flat config | 9.x | |
| 格式化 | Prettier | 3.x | |

**包管理器**: pnpm（如不可用则降级到 npm）。

---

## 3. 信息架构

### 3.1 路由

```
/                  月视图（默认今日）— 唯一主入口，含日历 + 选中日详情
/about             关于
*                  404 兜底
```

> **设计说明**: 选中日详情始终在月视图内联展示（移动端日格下方，桌面端右侧面板），**不**单独拆 `/day/:date` 路由。理由：日历应用用户最常做的是"看月 → 切日 → 看详情"这一连续动作，跨页面跳转会打断。

### 3.2 URL 状态

- 月视图路径支持查询参数 `?y=2026&m=9&d=6`，刷新或 PWA 启动可恢复
- 选中日状态既在 URL 反映，也存 Pinia，便于深链接与刷新
- 默认使用 hash 模式以兼容静态托管（GitHub Pages、本地 file:// 等）

---

## 4. 组件结构

### 4.1 文件树

```
rili/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── eslint.config.js
├── .prettierrc.json
├── vitest.config.ts
├── public/
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── apple-touch-icon.png
│   └── favicon.svg
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   └── calendar.ts
│   ├── composables/
│   │   ├── useCalendar.ts
│   │   ├── useLunar.ts
│   │   ├── useHolidays.ts
│   │   └── useTheme.ts
│   ├── utils/
│   │   ├── date.ts
│   │   └── format.ts
│   ├── data/
│   │   └── holidays.json
│   ├── views/
│   │   ├── MonthView.vue
│   │   ├── DayView.vue
│   │   ├── AboutView.vue
│   │   └── NotFoundView.vue
│   ├── components/
│   │   ├── CalendarHeader.vue
│   │   ├── MonthGrid.vue
│   │   ├── DayCell.vue
│   │   ├── LunarText.vue
│   │   ├── HolidayChip.vue
│   │   └── ThemeToggle.vue
│   ├── styles/
│   │   ├── reset.scss
│   │   ├── tokens.scss
│   │   └── typography.scss
│   └── types/
│       └── index.ts
└── tests/
    ├── date.spec.ts
    ├── holidays.spec.ts
    └── lunar.spec.ts
```

### 4.2 模块职责

- `App.vue`: 整体布局（顶部栏 + 主区 + 底部），主题应用
- `CalendarHeader.vue`: 年月选择器、今日按钮、节假日快捷
- `MonthGrid.vue`: 6×7 月历网格，触摸滑动切换月份
- `DayCell.vue`: 单日格子（公历数字、农历文字、节日角标、选中/今天态）
- `LunarText.vue`: 农历文本展示（日期、干支、生肖）
- `HolidayChip.vue`: 节假日角标组件（红/金/灰三色变体）
- `ThemeToggle.vue`: 主题切换按钮
- `MonthView.vue`: 月视图主容器，组合 Header + Grid
- `DayView.vue`: 选中日详情页
- `AboutView.vue`: 关于页（项目说明、技术栈、版本号）
- `NotFoundView.vue`: 404 兜底

### 4.3 Composables

- `useCalendar(year, month)`: 返回当月日期网格（42 个 cell）、上一月/下一月、跳转
- `useLunar(date)`: 封装 lunar-javascript，返回农历对象（日期字符串、干支、生肖、节气）
- `useHolidays(date)`: 匹配节假日（法定 / 调休 / 传统）
- `useTheme()`: 主题状态与切换（system / light / dark），写入 localStorage

### 4.4 Stores

- `useCalendarStore` (Pinia): 当前选中日期、当前查看年月；提供 setToday / gotoMonth / selectDay actions

### 4.5 Utils

- `date.ts` 纯函数:
  - `getMonthGrid(year, month)` → `DateCell[42]`
  - `getISOWeek(date)` → `number`
  - `isSameDay(a, b)` → `boolean`
  - `addMonths(date, n)` → `Date`
- `format.ts`:
  - `formatYMD(date)` → `"2026-09-06"`
  - `parseYMD(str)` → `Date | null`
  - `pad2(n)` → `string`

---

## 5. 数据模型

### 5.1 TypeScript 类型

```ts
// types/index.ts
export interface DateCell {
  date: Date;            // 公历日期
  inCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  lunar: LunarInfo;
  holiday: HolidayInfo | null;
}

export interface LunarInfo {
  dayText: string;       // "廿五"
  monthText: string;     // "七月"
  yearGanZhi: string;    // "丙午"
  monthGanZhi: string;   // "庚子"
  dayGanZhi: string;     // "壬寅"
  zodiac: string;        // "马"
  isLeapMonth: boolean;
  jieQi: string | null;  // "秋分" 或 null
  festival: string | null; // "中秋节"（农历传统节日，来自 lunar-javascript）
}

export interface HolidayInfo {
  name: string;          // "国庆节"
  type: 'legal' | 'traditional' | 'workday'; // 法定/传统/调休补班
  isOffDay: boolean;     // true=放假，false=补班
}

export type Theme = 'system' | 'light' | 'dark';
```

### 5.2 节假日数据

文件 `src/data/holidays.json` 存放 2024–2027 年中国法定假日明细（含调休）：

```json
[
  { "date": "2024-01-01", "name": "元旦", "isOffDay": true },
  { "date": "2024-02-10", "name": "春节", "isOffDay": true },
  { "date": "2024-02-04", "name": "春节调休", "isOffDay": false },
  ...
]
```

`useHolidays(date)` 优先查表；查不到时回退到通用规则：
- 1月1日 → 元旦
- 农历正月初一 → 春节
- 清明节（4月4或5或6日，按节气）
- 5月1日 → 劳动节
- 农历五月初五 → 端午
- 农历八月十五 → 中秋
- 10月1日 → 国庆

农历节日直接来自 `lunar-javascript.getFestivals()`。

---

## 6. 布局

### 6.1 移动端（< 768px）

```
┌──────────────────────────┐
│  ☰  万年历      🌓  ←头  │
├──────────────────────────┤
│  ‹  2026年9月  ›   [今]  │  ← 年月切换
│  元旦 春节 清明 五一 ... │  ← 节假日快捷
├──────────────────────────┤
│  一  二  三  四  五  六  日 │  ← 星期
│  ┌──┬──┬──┬──┬──┬──┬──┐  │
│  │31│ 1│ 2│ 3│ 4│ 5│ 6│  │
│  │八│九│十│十│十│十│十│  │
│  ├──┼──┼──┼──┼──┼──┼──┤  │
│  ...                       │
│  └──┴──┴──┴──┴──┴──┴──┘  │
├──────────────────────────┤
│  ←左右滑动切换月份→       │
├──────────────────────────┤
│  选中日详情               │
│  2026年9月6日 周日        │
│  农历七月廿五             │
│  丙午年 庚子月 壬寅日     │
│  生肖：马                 │
│  节假日：（无）           │
└──────────────────────────┘
```

- 顶部栏：左侧汉堡菜单（可省略），中间标题，右侧主题切换
- 移动端点击日期 → 滚动到详情（smooth scroll）
- 详情区块始终显示今天或当前选中日

### 6.2 桌面端（≥ 768px）

```
┌────────────────────────────────────────────┐
│  万年历                            🌓      │
├──────────────────┬─────────────────────────┤
│  年月选择         │  选中日详情              │
│  元旦 春节 ...    │  2026年9月6日 周日       │
│  ┌──┬──┬──┬──┬──┬──┬──┐  │  农历七月廿五         │
│  │31│ 1│ 2│ 3│ 4│ 5│ 6│  │  丙午年 庚子月 壬寅日  │
│  ├──┼──┼──┼──┼──┼──┼──┤  │  生肖：马              │
│  ...                │  ...                    │
│  └──┴──┴──┴──┴──┴──┴──┘  │  节假日：国庆假期第6天 │
│  ‹ 9月 ›   [今]    │                         │
└──────────────────┴─────────────────────────┘
```

- 月历居中，最大宽 480px
- 右侧详情 sticky，宽度自适应

---

## 7. PWA

### 7.1 manifest.webmanifest

```json
{
  "name": "万年历",
  "short_name": "万年历",
  "description": "简洁实用的万年历，支持农历、节气、节假日",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#faf8f5",
  "theme_color": "#c0392b",
  "lang": "zh-CN",
  "icons": [
    { "src": "/pwa-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/pwa-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/pwa-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 7.2 iOS 专用

`index.html` 中包含：
```html
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<meta name="apple-mobile-web-app-title" content="万年历" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

### 7.3 Service Worker

通过 `vite-plugin-pwa` 配置：
- `registerType: 'autoUpdate'`
- `workbox.globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}']`
- `navigateFallback: '/index.html'`
- 离线时回退到 app shell
- 节假日 JSON 不缓存（数据不大，每次请求即可；可选 network-first）

### 7.4 安装提示

监听 `beforeinstallprompt`：
- 桌面 Chrome / 安卓 Chrome 出现"添加到主屏幕"提示横幅
- iOS 不支持该事件，提供 onboarding 卡片教用户"分享 → 添加到主屏幕"

---

## 8. 视觉设计

### 8.1 配色

**亮色**:
- 背景: `#faf8f5`（米白）
- 表面: `#ffffff`
- 主色: `#c0392b`（朱红）
- 辅色: `#d4a017`（淡金，传统节日）
- 文字: `#1a1a1a`
- 次文字: `#666666`
- 今日: `#3b82f6`（蓝色短杠）
- 调休补班: `#9ca3af`（灰色"班"）

**暗色**:
- 背景: `#1a1a1a`
- 表面: `#262626`
- 主色: `#e74c3c`
- 辅色: `#f1c40f`
- 文字: `#f5f5f5`
- 次文字: `#a3a3a3`

### 8.2 排版

- 系统字体栈优先：`-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`
- 日期数字：`font-feature-settings: "tnum"`，1.5rem，移动端 1.25rem
- 农历文字：0.75rem，次文字色
- 节日 chip：0.625rem，主色背景白字

### 8.3 圆角与阴影

- 日期格子：圆角 8px
- 选中态：实心圆形 32px（移动端 28px）
- 卡片：圆角 12px，阴影 `0 1px 3px rgba(0,0,0,0.05)`

---

## 9. 交互

### 9.1 月份切换

- 移动端：左右滑动（横向 swipe，> 50px 触发）
- 桌面端：左右箭头按钮 + 键盘左右方向键
- 切换有过渡动画（200ms ease-out）

### 9.2 日期选择

- 点击日期：选中，更新 URL query，详情同步
- 再次点击已选中：滚动到详情
- 长按：显示日期 tooltip

### 9.3 年月切换

- 顶部 `< 2026年9月 >` 控件
- 点击年份：弹出年份选择器（1949–2049）
- 点击月份：横向滑动或下拉

### 9.4 主题切换

- 点击 🌓 循环：system → light → dark → system
- 选择写入 localStorage，立即应用

### 9.5 节假日快捷

- 点击节日按钮 → 跳转到该节日所在月份的月视图，并选中该日

---

## 10. 性能

- 首屏 JS 目标：gzipped < 200KB（含 lunar-javascript）
- 字体：系统字体，无网络字体
- 图片：仅 PWA icons（< 30KB 总和）
- 农历库按需引入：`import { Solar } from 'lunar-javascript'`
- 路由懒加载：所有 views `() => import('./views/XxxView.vue')`

---

## 11. 错误处理

- 节假日数据缺失：回退到通用规则
- URL 参数非法：忽略并使用今日
- 农历库异常：try/catch 包裹，回退显示公历
- Service worker 注册失败：console.warn，不阻塞主流程
- localStorage 不可用：降级到内存状态

---

## 12. 测试

### 12.1 单元测试（Vitest）

- `tests/date.spec.ts`:
  - `getMonthGrid`: 6×7 网格、跨月填充、周首日=周一
  - `getISOWeek`: 已知日期的 ISO 周次
  - `isSameDay`: 边界（同一日不同时间）
  - `addMonths`: 跨年、闰月
- `tests/holidays.spec.ts`:
  - 内置表匹配（如 2024-10-01 → 国庆节）
  - 调休识别（如 2024-09-29 → 国庆调休补班）
  - 通用规则：1月1日 → 元旦
  - 跨年场景
- `tests/lunar.spec.ts`:
  - 抽样日期：2024-02-10（春节）、2024-08-10（七夕）、2025-01-29（春节）、2024-04-04（清明节气）
  - 闰月识别（2025 年闰六月）

### 12.2 不做

- 组件 E2E（避免引入 Playwright）
- 视觉回归测试

---

## 13. 风险

| 风险 | 缓解 |
|---|---|
| iOS Safari `100vh` 抖动 | 使用 `100dvh` |
| lunar-javascript 包体积 | 接受 ~140KB（gzip ~50KB） |
| 节假日数据维护 | 文档化如何扩展 holidays.json |
| iOS PWA 后台限制 | 文档化限制；不依赖后台运行 |
| 农历库 API 变更 | 锁定版本，README 注明升级步骤 |

---

## 14. 验收标准

- [ ] 月视图显示当前月所有日期，农历文本正确
- [ ] 点击日期切换选中态，详情同步更新
- [ ] 切换月份、切换年份（弹出年份选择器）、返回今日 全部可用
- [ ] 节假日快捷按钮可跳到对应月/日
- [ ] 左右滑动切换月份在移动端工作
- [ ] 节假日正确标记（2024-10-01 标"国庆节"、2024-09-29 标"班"）
- [ ] 农历详情：干支、生肖、节气全部正确显示
- [ ] 响应式：< 768px 单列，≥ 768px 双栏
- [ ] 暗色 / 亮色 / 跟随系统 三档工作
- [ ] PWA：Chrome 显示安装提示
- [ ] iOS：分享 → 添加到主屏幕 → 启动全屏，无 Safari UI
- [ ] 离线启动：再次访问已缓存页面能正常打开
- [ ] 所有 Vitest 单元测试通过
- [ ] `pnpm build` 成功，无 TS 错误
- [ ] `pnpm lint` 通过

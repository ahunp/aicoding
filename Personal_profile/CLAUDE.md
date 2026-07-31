# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

胡金城个人介绍网站 —— 单页滚动简历展示（Next.js App Router），深色→清新浅色风格。内容区块：Hero / 关于我 / 教育 / 技能 / 实习 / 项目 / 联系。

## 常用命令

```bash
npm run build   # 生产构建（验证代码是否正确的唯一可靠方式）
npm run start   # 运行生产模式服务（默认 :3000）
npm run lint    # ESLint（flat config: eslint.config.mjs）
npm run dev     # ⚠️ 不可靠：Windows 上 Turbopack 处理 CSS 变更会崩溃（exit code 0xc0000142）
```

**重要**：本机 `npm run dev` 在 CSS/配置变更后必然崩溃（Turbopack Windows 已知 bug，见 `src/app/globals.css` 报错 panic log）。开发验证流程为 `npm run build` → `npm run start` → 浏览器访问 `http://localhost:3000`。

## 版本约束（升级时注意）

- **TypeScript 必须保持 6.x** —— Next 16 不提供 TS 7（原生编译器）所需的 compiler API，升到 7 会构建失败
- Next 16 已移除 `next lint`，lint 直接走 ESLint flat config（`eslint.config.mjs`，继承 `eslint-config-next`）
- 核心依赖：Next 16.2 + React 19 + Tailwind 3.4（v3 配置方式，非 v4）+ Framer Motion 12

## 架构

单页应用，所有区块组装于 [src/app/page.tsx](src/app/page.tsx)，`layout.tsx` 提供 SEO metadata（中文页面，lang="zh-CN"）。

### 组件层约定

- 交互组件（Navbar、Hero、Contact、Projects）标注 `"use client"`；纯展示组件保持服务端渲染
- **[Reveal.tsx](src/components/Reveal.tsx)**：通用滚动渐入动画包装器（framer-motion `whileInView`），所有区块的内容项统一用它包裹
- **Projects.tsx**：`FEATURED_PROJECT` 常量单独定义简购项目（全宽重点卡片，含在线链接 `http://150.158.144.133:3000` 与演示账号 admin@minimall.com / admin123，一键复制）；`PROJECTS` 数组放普通项目。新增重点项目需同步扩展该结构
- 联系信息（About/Contact 的电话、邮箱、微信）直接硬编码在组件数据中，修改需同步两处

### 主题约定（清新浅色风）

- 主色：sky-500 → teal-400 渐变（`from-sky-500 to-teal-400` 系），背景 slate-50，卡片纯白
- 通用样式类定义在 [globals.css](src/app/globals.css) 的 `@layer components`：`.card` / `.card-hover`（白卡 + 柔和阴影 + 悬停上浮）、`.section-title` / `.section-subtitle`、`.text-gradient`、`.glow`（区块光晕装饰）
- 渐变动画 keyframes（float/blink/gradient）定义在 [tailwind.config.ts](tailwind.config.ts)
- 改配色时优先调 `globals.css` 组件类 + `tailwind.config.ts` 的 `colors`，不要只改单个组件

## 其他

- 中文字体依赖系统字体栈（避免 Google Fonts 网络问题），无需引入字体文件
- 部署目标为 Vercel（未部署完成时 README 中链接为占位）
- 个人信息是简历敏感内容，改动文案前先与用户确认

# 胡金城 · 个人介绍网站

个人简历展示网站，深色科技风单页设计，桌面端优先。

## 技术栈

- **Next.js 14**（App Router / SSG 静态生成）
- **React 18 + TypeScript**
- **Tailwind CSS**（原子化样式）
- **Framer Motion**（滚动渐入、悬停动效）

> 选型依据：GitHub 综合热度最高组合 —— React（~245K Stars，前端框架第一）、Next.js（~140K Stars，React 元框架第一）、Tailwind CSS（~84K Stars）、Framer Motion（~23K Stars）。

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（http://localhost:3000）
npm run dev

# 生产构建
npm run build

# 启动生产服务
npm run start
```

## 项目结构

```
Personal_profile/
├── package.json
├── tsconfig.json
├── tailwind.config.ts     # 主题定制（配色、动画）
├── next.config.mjs
├── postcss.config.mjs
└── src/
    ├── app/
    │   ├── layout.tsx     # 根布局 + SEO metadata
    │   ├── page.tsx       # 主页（组装各区块）
    │   └── globals.css    # 全局样式
    └── components/
        ├── Navbar.tsx     # 固定导航栏（滚动高亮）
        ├── Hero.tsx       # 首屏（打字机效果）
        ├── About.tsx      # 个人信息 + 个人简介
        ├── Education.tsx  # 教育背景 + 主修课程
        ├── Skills.tsx     # 技能图谱（进度条）
        ├── Experience.tsx # 实习经历（时间线）
        ├── Projects.tsx   # 项目经历（卡片）
        ├── Contact.tsx    # 联系方式（一键复制）
        ├── Footer.tsx     # 页脚
        └── Reveal.tsx     # 滚动渐入动画通用组件
```

## 部署

推荐 Vercel（免费、自动 HTTPS、全球 CDN）：

```bash
# 1. 推送代码到 GitHub
git init && git add . && git commit -m "feat: personal profile website"

# 2. 在 vercel.com 导入仓库，一键部署
# 无需额外配置，构建命令默认 npm run build
```

## AI 使用说明（任务要求）

### 1. 使用的 AI 工具

- **Claude Code**（Anthropic 官方 CLI）：需求拆解、代码生成、调试、部署流程

### 2. AI 帮助完成的工作

- **技术栈调研**：检索 GitHub 各前端框架 Star 数与社区热度，选定 Next.js + React + Tailwind + Framer Motion 组合
- **项目脚手架**：生成 Next.js 工程配置（tsconfig、tailwind、postcss、next.config）
- **全部页面代码**：9 个组件的完整实现，包括打字机效果、滚动渐入动画、导航高亮、复制按钮等交互
- **构建排错**：排查依赖版本兼容问题，修复构建报错

### 3. 自己手动修改的内容

- **简历内容整理**：将原始简历信息结构化，拆分出"教育 / 技能 / 实习 / 项目 / 联系"五大区块
- **文案润色**：项目描述精简为"简介 + 要点"格式，突出量化成果
- **视觉微调**：深色主题配色、卡片悬停交互细节、时间线布局方向的确认
- **部署验证**：本地构建通过后部署到 Vercel，确认线上访问正常

### 4. 遇到的问题及解决方式

- **国内网络访问 Google Fonts 失败**：改为系统字体栈，构建零外部依赖
- **交互组件 SSR 报错**：明确组件 `"use client"` 边界，纯展示组件保持服务端渲染
- **依赖版本兼容**：让 AI 分析 npm 版本冲突后统一锁定兼容版本

### 5. 网站链接

部署后补充

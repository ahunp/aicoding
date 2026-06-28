# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Mini Mall** — 微型电商项目。Next.js 16 + TypeScript + Prisma 5 + SQLite + TailwindCSS 4。

## Commands

```bash
npm run dev              # 启动开发服务器 (localhost:3000)
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npx prisma db push       # 同步 schema 到数据库
npx prisma studio        # 打开 Prisma Studio GUI
npx prisma generate      # 重新生成 Prisma Client
```

## Database

SQLite (`prisma/dev.db`)，无需额外配置数据库服务。Schema 变更后执行 `npx prisma db push`。

## Architecture

**认证**: Auth.js v5 (next-auth@beta)，Credentials Provider + JWT 策略。无数据库 Session 表。

**API 设计模式**: `app/api/` 下的路由处理函数统一返回 `{ data: T }`（成功）或 `{ error: string }`（失败）。分页接口额外返回 `total`/`page`/`limit`。

**会员体系**: `lib/membership.ts` 中定义 5 个等级（青铜→钻石），按累计消费金额自动升级。折扣在下单时应用，订单标记 PAID 时触发等级重算。

**购物车**: 数据库持久化，`CartItem` 的 `@@unique([userId, productId])` 约束实现 upsert 模式。

**订单**: 下单在 `prisma.$transaction()` 中完成（创建订单 + 快照价格/名称 + 扣库存 + 清购物车）。`OrderItem` 保存商品快照，不受后续价格变动影响。

**管理后台**: `app/(admin)/` 路由组，通过 `middleware.ts` 进行角色守卫（仅 ADMIN 角色可访问）。

**模拟支付**: 管理员手动在后台将订单状态改为 PAID，触发 `User.totalSpent` 累计和会员等级更新。

## Key Libraries

| Package | 用途 |
|---|---|
| next-auth@beta | 认证 (Credentials + JWT) |
| prisma / @prisma/client | ORM + 数据库 |
| zod | API 输入校验 |
| bcryptjs | 密码哈希 |
| tailwind-merge + clsx | className 合并 (cn() 工具函数) |
| tailwindcss v4 | CSS 框架（CSS-based 配置） |

<!-- superpowers-zh:begin (do not edit between these markers) -->
## 中文增强框架

本项目已安装 superpowers-zh 技能框架（16 个 skills）。

### 核心规则

1. **收到任务时，先检查是否有匹配的 skill** — 哪怕只有 1% 的可能性也要检查
2. **设计先于编码** — 收到功能需求时，先用 brainstorming skill 做需求分析
3. **测试先于实现** — 写代码前先写测试（TDD）
4. **验证先于完成** — 声称完成前必须运行验证命令

### 可用 Skills

Skills 位于 `.claude/skills/` 目录，每个 skill 有独立的 `SKILL.md` 文件。

- **brainstorming**: 在任何创造性工作之前必须使用此技能
- **writing-plans**: 有需求时先用这个写书面计划
- **executing-plans**: 按书面计划分步执行
- **test-driven-development**: 先写测试再写代码
- **subagent-driven-development**: 把独立任务分给子 agent 开发
- **dispatching-parallel-agents**: 并行执行多个独立任务
- **systematic-debugging**: 按流程排查 bug
- **requesting-code-review**: 提交前请求审查代码
- **verification-before-completion**: 完成前验证
- **finishing-a-development-branch**: 功能做完后整理分支
- **design-an-interface**: 接口设计方案对比
- **grilling**: 对方案反复质疑挑刺
- **domain-modeling**: 梳理业务术语
- **codebase-design**: 模块接口设计
- **api-crud-generator**: 根据 Prisma 模型生成标准的 Next.js API Route + 前端管理页面
- **using-superpowers**: 在开始任何对话时使用

### 如何使用

当任务匹配某个 skill 时，使用 `Skill` 工具加载对应 skill 并严格遵循其流程。绝不要用 Read 工具读取 SKILL.md 文件。如果你认为哪怕只有 1% 的可能性某个 skill 适用于你正在做的事情，你必须调用该 skill 检查。
<!-- superpowers-zh:end -->

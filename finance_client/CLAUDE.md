# finance_client - 个人记账工具

## 项目概述

基于 Python + Streamlit + SQLite3 的 Web 记账工具，支持账目的增删查和分类统计。

## 技术栈

- **界面**: Streamlit（纯 Python Web UI）
- **数据库**: SQLite3（Python 标准库，零配置）
- **图表**: Streamlit 内置 `st.bar_chart()` + `st.dataframe()`
- **数据处理**: pandas

## 项目结构

```
finance_client/
├── app.py                  # 入口：Streamlit 页面路由，侧边栏导航
├── config.py               # 常量：分类列表、数据库路径
├── database.py             # 数据库初始化 + CRUD 纯函数
├── pages/
│   ├── __init__.py
│   ├── add_record.py       # 添加账目表单
│   ├── list_records.py     # 查看列表（月份+分类筛选）
│   ├── delete_record.py    # 删除账目（ID查询确认后删除）
│   └── statistics.py       # 分类统计（柱状图+统计表）
└── requirements.txt        # streamlit>=1.28.0
```

### 模块职责

| 模块 | 职责 | 依赖 |
|------|------|------|
| `config.py` | 常量定义 | 无 |
| `database.py` | SQLite CRUD 封装 | config |
| `pages/*.py` | Streamlit UI 逻辑 | database |
| `app.py` | 入口 + 侧边栏路由 | pages |

## 数据库

单表 `records`：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK AUTOINCREMENT | 主键 |
| amount | REAL NOT NULL | 金额（元） |
| category | TEXT NOT NULL | 分类 |
| date | TEXT NOT NULL | 日期 YYYY-MM-DD |
| note | TEXT DEFAULT '' | 备注 |
| created_at | TEXT | 创建时间 |

预设分类：`餐饮` `交通` `购物` `娱乐` `居住` `其他`

## 功能页面

1. **添加账目** - 表单输入金额/分类/日期/备注，写入数据库
2. **查看列表** - 按月份+分类筛选，表格展示，底部合计
3. **删除账目** - 输入ID查看详情，确认后删除
4. **分类统计** - 按月份筛选，柱状图 + 分类统计表（笔数/金额/占比）

## 关键约定

- 数据库文件 `finance.db` 自动创建在项目根目录
- 日期格式统一 `YYYY-MM-DD`，月筛选用 `strftime('%Y-%m', date)`
- 增删操作后调用 `st.cache_data.clear()` 刷新缓存
- `database.py` 的函数是纯数据层，不含 Streamlit 依赖
- 页面函数统一命名为 `show()`，由 `app.py` 调用

## 运行方式

```bash
pip install -r requirements.txt
streamlit run app.py
```

<!-- superpowers-zh:begin (do not edit between these markers) -->
# Superpowers-ZH 中文增强版

本项目已安装 superpowers-zh 技能框架（20 个 skills）。

## 核心规则

1. **收到任务时，先检查是否有匹配的 skill** — 哪怕只有 1% 的可能性也要检查
2. **设计先于编码** — 收到功能需求时，先用 brainstorming skill 做需求分析
3. **测试先于实现** — 写代码前先写测试（TDD）
4. **验证先于完成** — 声称完成前必须运行验证命令

## 可用 Skills

Skills 位于 `.claude/skills/` 目录，每个 skill 有独立的 `SKILL.md` 文件。

- **brainstorming**: 在任何创造性工作之前必须使用此技能——创建功能、构建组件、添加功能或修改行为。在实现之前先探索用户意图、需求和设计。
- **chinese-code-review**: 中文 review 沟通参考——话术模板、分级标注（必须修复/建议修改/仅供参考）、国内团队常见反模式应对。仅在用户显式 /chinese-code-review 时调用，不要根据上下文自动触发。
- **chinese-commit-conventions**: 中文 commit 与 changelog 配置参考——Conventional Commits 中文适配、commitlint/husky/commitizen 中文模板、conventional-changelog 中文配置。仅在用户显式 /chinese-commit-conventions 时调用，不要根据上下文自动触发。
- **chinese-documentation**: 中文文档排版参考——中英文空格、全半角标点、术语保留、链接格式、中文文案排版指北约定。仅在用户显式 /chinese-documentation 时调用，不要根据上下文自动触发。
- **chinese-git-workflow**: 国内 Git 平台配置参考——Gitee、Coding.net、极狐 GitLab、CNB 的 SSH/HTTPS/凭据/CI 接入差异与镜像同步配置。仅在用户显式 /chinese-git-workflow 时调用，不要根据上下文自动触发。
- **dispatching-parallel-agents**: 当面对 2 个以上可以独立进行、无共享状态或顺序依赖的任务时使用
- **executing-plans**: 当你有一份书面实现计划需要在单独的会话中执行，并设有审查检查点时使用
- **finishing-a-development-branch**: 当实现完成、所有测试通过、需要决定如何集成工作时使用——通过提供合并、PR 或清理等结构化选项来引导开发工作的收尾
- **mcp-builder**: MCP 服务器构建方法论 — 系统化构建生产级 MCP 工具，让 AI 助手连接外部能力
- **receiving-code-review**: 收到代码审查反馈后、实施建议之前使用，尤其当反馈不明确或技术上有疑问时——需要技术严谨性和验证，而非敷衍附和或盲目执行
- **requesting-code-review**: 完成任务、实现重要功能或合并前使用，用于验证工作成果是否符合要求
- **subagent-driven-development**: 当在当前会话中执行包含独立任务的实现计划时使用
- **systematic-debugging**: 遇到任何 bug、测试失败或异常行为时使用，在提出修复方案之前执行
- **test-driven-development**: 在实现任何功能或修复 bug 时使用，在编写实现代码之前
- **using-git-worktrees**: 当需要开始与当前工作区隔离的功能开发，或在执行实现计划之前使用——通过原生工具或 git worktree 回退机制确保隔离工作区存在
- **using-superpowers**: 在开始任何对话时使用——确立如何查找和使用技能，要求在任何响应（包括澄清性问题）之前调用 Skill 工具
- **verification-before-completion**: 在宣称工作完成、已修复或测试通过之前使用，在提交或创建 PR 之前——必须运行验证命令并确认输出后才能声称成功；始终用证据支撑断言
- **workflow-runner**: 在 Claude Code / OpenClaw / Cursor 中直接运行 agency-orchestrator YAML 工作流——无需 API key，使用当前会话的 LLM 作为执行引擎。当用户提供 .yaml 工作流文件或要求多角色协作完成任务时触发。
- **writing-plans**: 当你有规格说明或需求用于多步骤任务时使用，在动手写代码之前
- **writing-skills**: 当创建新技能、编辑现有技能或在部署前验证技能是否有效时使用

## 如何使用

当任务匹配某个 skill 时，使用 `Skill` 工具加载对应 skill 并严格遵循其流程。绝不要用 Read 工具读取 SKILL.md 文件。

如果你认为哪怕只有 1% 的可能性某个 skill 适用于你正在做的事情，你必须调用该 skill 检查。
<!-- superpowers-zh:end -->

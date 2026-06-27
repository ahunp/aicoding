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

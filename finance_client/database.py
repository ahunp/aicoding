"""数据库初始化和 CRUD 操作"""
import sqlite3
from config import DB_PATH, CATEGORIES


def get_conn():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 让查询结果可以用字段名访问
    return conn


def init_db():
    """建表（首次运行时自动创建）"""
    conn = get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            note TEXT DEFAULT '',
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        )
    """)
    conn.commit()
    conn.close()


def add_record(amount, category, date, note):
    """添加一条记录"""
    conn = get_conn()
    conn.execute(
        "INSERT INTO records (amount, category, date, note) VALUES (?, ?, ?, ?)",
        (amount, category, date, note),
    )
    conn.commit()
    conn.close()


def get_records(month=None, categories=None):
    """
    查询记录列表
    month: 'YYYY-MM' 格式字符串，为 None 则查全部
    categories: 分类列表，为 None 或空列表则查全部
    """
    conn = get_conn()
    sql = "SELECT * FROM records WHERE 1=1"
    params = []

    if month:
        sql += " AND strftime('%Y-%m', date) = ?"
        params.append(month)

    if categories:
        placeholders = ",".join("?" * len(categories))
        sql += f" AND category IN ({placeholders})"
        params.extend(categories)

    sql += " ORDER BY date DESC, id DESC"
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return rows


def get_record_by_id(record_id):
    """按 ID 查询单条记录"""
    conn = get_conn()
    row = conn.execute("SELECT * FROM records WHERE id = ?", (record_id,)).fetchone()
    conn.close()
    return row


def delete_record(record_id):
    """删除一条记录，返回受影响行数"""
    conn = get_conn()
    cursor = conn.execute("DELETE FROM records WHERE id = ?", (record_id,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected


def get_available_months():
    """获取有记录的所有月份列表（降序）"""
    conn = get_conn()
    rows = conn.execute(
        "SELECT DISTINCT strftime('%Y-%m', date) AS month FROM records ORDER BY month DESC"
    ).fetchall()
    conn.close()
    return [r["month"] for r in rows]


def get_category_stats(month=None):
    """
    分类统计：返回 (category, count, total_amount) 列表
    month: 为 None 则统计全部
    """
    conn = get_conn()
    sql = "SELECT category, COUNT(*) AS cnt, SUM(amount) AS total FROM records WHERE 1=1"
    params = []

    if month:
        sql += " AND strftime('%Y-%m', date) = ?"
        params.append(month)

    sql += " GROUP BY category ORDER BY total DESC"
    rows = conn.execute(sql, params).fetchall()
    conn.close()
    return rows

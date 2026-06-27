"""查看列表页面"""
import streamlit as st
import pandas as pd
from config import CATEGORIES
from database import get_records, get_available_months


def show():
    st.subheader("📋 查看列表")

    months = get_available_months()
    col1, col2 = st.columns(2)
    with col1:
        selected_month = st.selectbox(
            "按月份筛选",
            options=["全部"] + months,
            format_func=lambda x: "全部" if x == "全部" else x,
        )
    with col2:
        selected_categories = st.multiselect(
            "按分类筛选（留空=全部）",
            options=CATEGORIES,
        )

    month = None if selected_month == "全部" else selected_month
    cats = selected_categories if selected_categories else None
    rows = get_records(month=month, categories=cats)

    if not rows:
        st.info("暂无记录")
        return

    df = pd.DataFrame(
        rows, columns=["id", "金额", "分类", "日期", "备注", "创建时间"]
    )
    df["金额"] = df["金额"].apply(lambda x: f"¥{x:.2f}")
    st.dataframe(df, use_container_width=True, hide_index=True)

    total = sum(r["amount"] for r in rows)
    st.caption(f"共 {len(rows)} 条记录，合计 ¥{total:.2f}")

"""分类统计页面"""
import streamlit as st
import pandas as pd
from database import get_available_months, get_category_stats


def show():
    st.subheader("📊 分类统计")

    months = get_available_months()
    selected_month = st.selectbox(
        "按月份筛选",
        options=["全部"] + months,
        format_func=lambda x: "全部" if x == "全部" else x,
    )

    month = None if selected_month == "全部" else selected_month
    rows = get_category_stats(month=month)

    if not rows:
        st.info("暂无数据")
        return

    categories = [r["category"] for r in rows]
    amounts = [r["total"] for r in rows]
    counts = [r["cnt"] for r in rows]
    grand_total = sum(amounts)

    # 柱状图
    chart_df = pd.DataFrame({"分类": categories, "金额": amounts}).set_index("分类")
    st.bar_chart(chart_df, use_container_width=True)

    # 统计表
    table_df = pd.DataFrame(
        {
            "分类": categories,
            "笔数": counts,
            "金额合计": [f"¥{a:.2f}" for a in amounts],
            "占比": [f"{a / grand_total * 100:.1f}%" for a in amounts],
        }
    )
    st.dataframe(table_df, use_container_width=True, hide_index=True)
    st.caption(f"总计 ¥{grand_total:.2f}")

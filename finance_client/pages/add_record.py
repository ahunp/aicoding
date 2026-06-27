"""添加账目页面"""
import streamlit as st
from datetime import date
from config import CATEGORIES
from database import add_record


def show():
    st.subheader("📝 添加账目")

    with st.form("add_form", clear_on_submit=True):
        amount = st.number_input("金额（元）", min_value=0.01, step=0.01, format="%.2f")
        col1, col2 = st.columns(2)
        with col1:
            category = st.selectbox("分类", CATEGORIES)
        with col2:
            record_date = st.date_input("日期", value=date.today())
        note = st.text_input("备注", placeholder="选填")

        submitted = st.form_submit_button("添加")

        if submitted:
            add_record(
                amount=amount,
                category=category,
                date=record_date.strftime("%Y-%m-%d"),
                note=note,
            )
            st.cache_data.clear()
            st.success(f"已添加：{record_date} {category} ¥{amount:.2f}")

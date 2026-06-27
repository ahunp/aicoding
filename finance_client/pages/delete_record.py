"""删除账目页面"""
import streamlit as st
from database import get_record_by_id, delete_record


def show():
    st.subheader("🗑️ 删除账目")

    record_id = st.number_input("输入要删除的账目 ID", min_value=1, step=1)

    if record_id:
        record = get_record_by_id(record_id)

        if record is None:
            st.warning(f"未找到 ID 为 {record_id} 的记录")
        else:
            st.write("**记录详情：**")
            st.write(
                f"- 日期：{record['date']}  |  分类：{record['category']}  |  "
                f"金额：¥{record['amount']:.2f}"
            )
            if record["note"]:
                st.write(f"- 备注：{record['note']}")

            if st.button("确认删除", type="primary"):
                delete_record(record_id)
                st.cache_data.clear()
                st.success(f"已删除 ID={record_id} 的记录")

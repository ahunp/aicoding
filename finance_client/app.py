"""记账工具 - Streamlit 入口"""
import streamlit as st
from database import init_db

# 首次运行自动建表
init_db()

st.set_page_config(page_title="记账工具", page_icon="💰")
st.title("💰 个人记账工具")

# 侧边栏导航
page = st.sidebar.radio(
    "功能导航",
    ["📝 添加账目", "📋 查看列表", "🗑️ 删除账目", "📊 分类统计"],
)

# 路由到对应页面
if page == "📝 添加账目":
    from pages.add_record import show as show_add
    show_add()
elif page == "📋 查看列表":
    from pages.list_records import show as show_list
    show_list()
elif page == "🗑️ 删除账目":
    from pages.delete_record import show as show_delete
    show_delete()
elif page == "📊 分类统计":
    from pages.statistics import show as show_stats
    show_stats()

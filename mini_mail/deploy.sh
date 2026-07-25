#!/bin/bash
# 简购 一键部署脚本
# 用法: bash deploy.sh

set -e

echo "===== 开始部署 ====="

# 项目目录（如果脚本在项目根目录执行，自动检测）
cd "$(dirname "$0")"

echo "1/5 拉取最新代码..."
git pull origin master

echo "2/5 安装依赖..."
npm install

echo "3/5 同步数据库..."
npx prisma db push

echo "4/5 构建..."
npm run build

echo "5/5 重启应用..."
pm2 restart mini_mail || pm2 start npm --name "mini_mail" -- run start

echo "===== 部署完成 ====="

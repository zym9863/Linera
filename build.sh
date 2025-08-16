#!/bin/bash

# Linera 项目构建脚本

set -e

echo "🚀 开始构建 Linera 项目..."

# 检查必要的工具
echo "📋 检查构建环境..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，正在安装..."
    npm install -g pnpm
fi

if ! command -v go &> /dev/null; then
    echo "❌ Go 未安装，请先安装 Go"
    exit 1
fi

echo "✅ 构建环境检查完成"

# 构建前端
echo "🎨 构建前端应用..."
cd web
pnpm install
pnpm build
cd ..

# 构建后端
echo "⚙️ 构建后端应用..."
cd server
go mod tidy
go build -o ../linera .
cd ..

echo "✅ 构建完成！"
echo "📦 可执行文件: ./linera"
echo "🌐 前端文件: ./web/dist"
echo ""
echo "🚀 运行应用:"
echo "   ./linera"
echo ""
echo "🐳 或使用 Docker:"
echo "   docker build -t linera ."
echo "   docker run -p 8080:8080 linera"

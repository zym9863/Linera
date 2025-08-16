@echo off
setlocal enabledelayedexpansion

echo 🚀 开始构建 Linera 项目...

REM 检查必要的工具
echo 📋 检查构建环境...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装，请先安装 Node.js
    exit /b 1
)

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ pnpm 未安装，正在安装...
    npm install -g pnpm
)

where go >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Go 未安装，请先安装 Go
    exit /b 1
)

echo ✅ 构建环境检查完成

REM 构建前端
echo 🎨 构建前端应用...
cd web
pnpm install
if %errorlevel% neq 0 (
    echo ❌ 前端依赖安装失败
    exit /b 1
)

pnpm build
if %errorlevel% neq 0 (
    echo ❌ 前端构建失败
    exit /b 1
)
cd ..

REM 构建后端
echo ⚙️ 构建后端应用...
cd server
go mod tidy
if %errorlevel% neq 0 (
    echo ❌ Go 模块整理失败
    exit /b 1
)

go build -o ../linera.exe .
if %errorlevel% neq 0 (
    echo ❌ 后端构建失败
    exit /b 1
)
cd ..

echo ✅ 构建完成！
echo 📦 可执行文件: linera.exe
echo 🌐 前端文件: web\dist
echo.
echo 🚀 运行应用:
echo    linera.exe
echo.
echo 🐳 或使用 Docker:
echo    docker build -t linera .
echo    docker run -p 8080:8080 linera

pause

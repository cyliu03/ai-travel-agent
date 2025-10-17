@echo off
REM 🚀 AI旅行规划网站部署脚本 (Windows)

echo 🚀 开始部署AI旅行规划网站...

REM 检查Node.js版本
echo 📋 检查环境...
node -v
if %errorlevel% neq 0 (
    echo ❌ 错误: Node.js 未安装
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

REM 安装依赖
echo 📦 安装依赖...
npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

REM 检查环境变量
echo 🔑 检查环境变量...
if "%DOUBAO_API_KEY%"=="" (
    echo ❌ 错误: DOUBAO_API_KEY 环境变量未设置
    echo 请设置你的豆包API密钥:
    echo set DOUBAO_API_KEY=your_api_key_here
    pause
    exit /b 1
)

echo ✅ 环境变量检查通过

REM 创建输出目录
echo 📁 创建输出目录...
if not exist "output" mkdir output

REM 测试API连接
echo 🧪 测试API连接...
node -e "const ClaudeService = require('./backend/services/claudeService'); const service = new ClaudeService(); console.log('✅ AI服务初始化成功');"
if %errorlevel% neq 0 (
    echo ❌ API连接测试失败
    pause
    exit /b 1
)

REM 启动服务器
echo 🚀 启动服务器...
if "%NODE_ENV%"=="production" (
    echo 生产环境启动...
    npm start
) else (
    echo 开发环境启动...
    npm run dev
)

pause

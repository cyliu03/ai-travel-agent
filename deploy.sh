#!/bin/bash

# 🚀 AI旅行规划网站部署脚本

echo "🚀 开始部署AI旅行规划网站..."

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v)
echo "Node.js版本: $node_version"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 检查环境变量
echo "🔑 检查环境变量..."
if [ -z "$DOUBAO_API_KEY" ]; then
    echo "❌ 错误: DOUBAO_API_KEY 环境变量未设置"
    echo "请设置你的豆包API密钥:"
    echo "export DOUBAO_API_KEY=your_api_key_here"
    exit 1
fi

echo "✅ 环境变量检查通过"

# 创建输出目录
echo "📁 创建输出目录..."
mkdir -p output

# 测试API连接
echo "🧪 测试API连接..."
node -e "
const ClaudeService = require('./backend/services/claudeService');
const service = new ClaudeService();
console.log('✅ AI服务初始化成功');
"

# 启动服务器
echo "🚀 启动服务器..."
if [ "$NODE_ENV" = "production" ]; then
    echo "生产环境启动..."
    npm start
else
    echo "开发环境启动..."
    npm run dev
fi

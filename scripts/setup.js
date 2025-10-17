const fs = require('fs');
const path = require('path');

// 确保必要的目录存在
const directories = [
    'output',
    'backend/services',
    'backend/routes',
    'frontend/styles',
    'frontend/scripts',
    'templates'
];

directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ 创建目录: ${dir}`);
    }
});

// 检查环境变量
if (!process.env.CLAUDE_API_KEY) {
    console.log('⚠️  警告: 未设置 CLAUDE_API_KEY 环境变量');
    console.log('请复制 env.example 为 .env 并设置你的 Claude API Key');
}

console.log('🚀 AI旅游规划助手启动中...');
console.log('📁 项目结构已初始化');
console.log('🌐 访问 http://localhost:3000 开始使用');

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// 导入路由
const travelRoutes = require('./backend/routes/travel');
const exportRoutes = require('./backend/routes/export');

// 使用路由
app.use('/api/travel', travelRoutes);
app.use('/api/export', exportRoutes);

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: '服务器内部错误',
        message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

app.listen(PORT, () => {
    console.log(`🚀 AI旅游规划助手运行在 http://localhost:${PORT}`);
    console.log(`📝 请确保已配置 CLAUDE_API_KEY 环境变量`);
});

module.exports = app;

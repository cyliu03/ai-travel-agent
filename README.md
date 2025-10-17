# AI旅游规划助手

基于Claude AI的智能旅游规划网站

## 功能特性

- 🎯 **多场景人设**：探索型、方案型、预算型、家庭亲子型等
- 🤖 **AI智能规划**：基于Claude的个性化行程生成
- 📊 **预算管理**：智能预算分配和费用估算
- 📋 **详细行程**：逐日安排、交通住宿、风险备选
- 📄 **多格式输出**：Markdown文档、PDF、海报图片
- 🎨 **美观界面**：现代化UI设计

## 技术栈

- 前端：HTML5 + CSS3 + JavaScript (ES6+)
- 后端：Node.js + Express
- AI：豆包（OpenAI 兼容 API via openai SDK）
- 文档生成：Puppeteer + Markdown-PDF
- 图像处理：Sharp + Canvas

## 快速开始

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，添加你的 Claude API Key
```

3. 启动服务
```bash
npm run dev
```

4. 访问 http://localhost:3000

## 环境变量

```env
DOUBAO_API_KEY=your_doubao_api_key_here
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
DOUBAO_MODEL=ep-202410-advanced-travel
PORT=3000
NODE_ENV=development
```

## 项目结构

```
ai-travel-agent/
├── frontend/          # 前端静态文件
├── backend/           # 后端API服务
├── templates/         # 提示词模板
├── output/           # 生成的文档和图片
├── server.js         # 主服务器文件
└── package.json      # 项目配置
```

## API接口

- `POST /api/generate-plan` - 生成旅游计划
- `GET /api/download/:type/:id` - 下载生成的文档
- `POST /api/export` - 导出行程为不同格式

## 许可证

MIT License

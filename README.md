# AI旅行规划助手

一个基于AI的智能旅行规划网站，支持多种人设和个性化旅行计划生成。

## 功能特点

- 🎯 **多角色人设**：探索者、规划者、预算控制者等
- 🤖 **AI智能规划**：基于豆包大模型生成详细旅行计划
- 📱 **响应式设计**：支持桌面和移动设备
- 🎨 **美观界面**：清新简洁的用户界面
- 📄 **多格式导出**：支持PDF、图片等格式导出

## 技术栈

- **前端**：HTML5, CSS3, JavaScript
- **后端**：Node.js, Express.js
- **AI服务**：豆包大模型 (OpenAI兼容API)
- **部署**：Vercel

## 快速开始

### 本地开发

1. **克隆项目**
   ```bash
   git clone https://github.com/cyliu03/ai-travel-agent.git
   cd ai-travel-agent
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp env.example .env
   ```
   编辑`.env`文件，填入你的豆包API密钥：
   ```
   DOUBAO_API_KEY=your_api_key_here
   DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
   DOUBAO_MODEL=ep-202410-advanced-travel
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   打开浏览器访问 `http://localhost:3000`

### Vercel部署

1. **Fork项目到你的GitHub账户**

2. **在Vercel中导入项目**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 选择你的GitHub仓库

3. **配置环境变量**
   在Vercel项目设置中添加：
   - `DOUBAO_API_KEY`: 你的豆包API密钥
   - `DOUBAO_BASE_URL`: `https://ark.cn-beijing.volces.com/api/v3`
   - `DOUBAO_MODEL`: `ep-202410-advanced-travel`

4. **部署**
   Vercel会自动部署你的项目

## 项目结构

```
travel_agent/
├── api/
│   └── index.js          # Vercel服务器入口
├── backend/
│   ├── routes/           # API路由
│   └── services/         # 业务逻辑服务
├── frontend/
│   ├── index.html        # 主页面
│   ├── styles/           # CSS样式
│   └── scripts/          # JavaScript逻辑
├── templates/
│   └── prompts.json      # AI提示词模板
├── package.json          # 项目配置
├── vercel.json          # Vercel部署配置
└── README.md            # 项目说明
```

## 使用说明

1. **选择人设**：根据你的旅行需求选择合适的人设
2. **填写参数**：根据人设填写相应的旅行参数
3. **生成计划**：点击"生成计划"按钮，AI会为你制定详细的旅行计划
4. **查看结果**：浏览生成的旅行计划，可以导出为PDF或图片

## 人设说明

- **探索者**：适合喜欢自由探索的用户，可以输入兴趣偏好
- **规划者**：适合有明确目的地的用户，需要输入具体目的地
- **预算控制者**：适合预算有限的用户，需要输入预算范围

## 环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| DOUBAO_API_KEY | 豆包API密钥 | your_api_key_here |
| DOUBAO_BASE_URL | API基础URL | https://ark.cn-beijing.volces.com/api/v3 |
| DOUBAO_MODEL | 使用的模型 | ep-202410-advanced-travel |

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！
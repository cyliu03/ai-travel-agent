# AI旅游规划助手 - 使用说明（豆包版）

## 🚀 快速开始

### 1. 环境准备
```bash
# 安装依赖
npm install

# 配置环境变量（豆包）
cp env.example .env
# 编辑 .env 文件，添加你的豆包 API Key
```

### 2. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

### 3. 访问网站
打开浏览器访问：http://localhost:3000

## 🎯 功能特性

### 人设类型
- **探索型**：不知道去哪，需要目的地推荐
- **方案型**：知道目的地，需要详细规划
- **预算型**：预算有限，需要最优解
- **家庭亲子型**：带孩子的安全舒适旅行
- **深度体验型**：追求小众和深度文化
- **轻松休闲型**：度假放松，慢节奏旅行
- **商务顺带游**：出差顺便短途游玩

### 核心功能
1. **智能人设选择**：根据旅行需求选择合适的人设
2. **参数化配置**：填写详细的旅行信息
3. **AI智能规划**：基于Claude生成个性化行程
4. **多格式输出**：支持Markdown、PDF、海报图片
5. **预算管理**：智能预算分配和费用估算
6. **风险备选**：提供风险应对和备选方案

## 📋 使用流程

### 步骤1：选择人设
- 根据你的旅行需求选择合适的人设类型
- 每种人设都有针对性的功能特点

### 步骤2：填写参数
- **基础信息**：出发地、目的地、时间、预算
- **偏好设置**：兴趣、特殊需求、输出格式
- **人设特定**：根据选择的人设显示相关字段

### 步骤3：生成计划
- AI分析你的需求并生成个性化行程
- 包含详细的日程安排、预算分配、交通住宿建议

### 步骤4：导出分享
- 支持多种格式导出：Markdown、PDF、海报
- 可直接下载或分享给朋友

## 🔧 技术架构

### 前端技术
- **HTML5 + CSS3**：现代化响应式界面
- **JavaScript ES6+**：交互逻辑和API调用
- **Font Awesome**：图标库
- **Google Fonts**：字体优化

### 后端技术
- **Node.js + Express**：服务器框架
- **Anthropic Claude API**：AI服务集成
- **Puppeteer**：PDF生成
- **Sharp**：图像处理
- **Multer**：文件上传处理

### 数据流程
1. 用户选择人设 → 前端收集参数
2. 参数验证 → 调用Claude API
3. AI生成计划 → 结构化数据解析
4. 多格式渲染 → 文件导出

## 🛠️ 开发指南

### 项目结构
```
ai-travel-agent/
├── frontend/              # 前端文件
│   ├── index.html         # 主页面
│   ├── styles/main.css    # 样式文件
│   └── scripts/main.js    # 交互脚本
├── backend/               # 后端服务
│   ├── routes/            # API路由
│   └── services/          # 业务服务
├── templates/             # 提示词模板
├── output/                # 生成文件
├── server.js              # 主服务器
└── package.json           # 项目配置
```

### API接口
- `POST /api/travel/generate-plan` - 生成旅游计划
- `GET /api/travel/plan/:id` - 获取计划详情
- `PUT /api/travel/plan/:id` - 更新计划
- `GET /api/export/download/:type/:id` - 下载文件
- `POST /api/export/export` - 批量导出

### 环境变量（豆包）
```env
DOUBAO_API_KEY=your_doubao_api_key_here
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
DOUBAO_MODEL=ep-202410-advanced-travel
PORT=3000
NODE_ENV=development
```

## 🎨 自定义配置

### 添加新人设
1. 在 `templates/prompts.json` 中添加提示词模板
2. 在 `frontend/index.html` 中添加人设卡片
3. 在 `frontend/scripts/main.js` 中添加人设处理逻辑

### 修改输出格式
1. 编辑 `backend/services/documentGenerator.js`
2. 添加新的渲染方法
3. 在 `backend/routes/export.js` 中注册新格式

### 调整AI提示词
1. 修改 `backend/services/claudeService.js` 中的系统提示词
2. 更新 `templates/prompts.json` 中的用户提示词模板

## 🚨 注意事项

### API限制
- 需要有效的Claude API Key
- 注意API调用频率限制
- 建议设置合理的超时时间

### 文件存储
- 生成的计划文件保存在 `output/` 目录
- 建议定期清理旧文件
- 生产环境建议使用云存储

### 安全考虑
- 不要在前端暴露API Key
- 对用户输入进行验证和过滤
- 设置适当的CORS策略

## 🐛 故障排除

### 常见问题
1. **API调用失败**：检查API Key是否正确
2. **文件生成失败**：检查Puppeteer和Sharp依赖
3. **样式显示异常**：检查CSS文件路径
4. **端口占用**：修改PORT环境变量

### 调试模式
```bash
# 启用详细日志
NODE_ENV=development npm run dev

# 检查环境变量
npm run check-env
```

## 📞 技术支持

如有问题，请检查：
1. 环境变量配置
2. 依赖包安装
3. API Key有效性
4. 网络连接状态

---

**享受你的AI旅行规划体验！** ✈️🤖

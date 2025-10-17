# 🚀 快速部署指南

## 🎯 推荐方案：Vercel（5分钟部署）

### 步骤1：准备代码
```bash
# 确保所有文件都已保存
git add .
git commit -m "准备部署"
git push origin main
```

### 步骤2：部署到Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用GitHub账号登录
3. 点击 "New Project"
4. 选择你的GitHub仓库
5. 点击 "Deploy"

### 步骤3：配置环境变量
在Vercel Dashboard中：
1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加以下变量：
   - `DOUBAO_API_KEY`: 你的豆包API密钥
   - `DOUBAO_BASE_URL`: `https://ark.cn-beijing.volces.com/api/v3`
   - `DOUBAO_MODEL`: `ep-202410-advanced-travel`
   - `NODE_ENV`: `production`

### 步骤4：重新部署
1. 点击 "Redeploy"
2. 等待部署完成
3. 访问你的网站URL

---

## 🚂 备选方案：Railway

### 步骤1：连接GitHub
1. 访问 [railway.app](https://railway.app)
2. 使用GitHub登录
3. 点击 "New Project"
4. 选择 "Deploy from GitHub repo"

### 步骤2：配置项目
1. 选择你的仓库
2. Railway会自动检测Dockerfile
3. 点击 "Deploy"

### 步骤3：设置环境变量
1. 进入项目设置
2. 添加环境变量（同上）

---

## 🔧 本地测试部署

在部署前，先在本地测试：

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

---

## 📊 部署后验证

访问你的网站，测试以下功能：
- [ ] 首页正常加载
- [ ] 人设选择功能
- [ ] 表单提交功能
- [ ] AI生成计划功能
- [ ] 结果展示功能
- [ ] 文件导出功能

---

## 🆘 常见问题

### 1. 部署失败
- 检查环境变量是否正确设置
- 确认API密钥有效
- 查看部署日志

### 2. API调用失败
- 确认DOUBAO_API_KEY正确
- 检查网络连接
- 验证API配额

### 3. 静态文件404
- 检查文件路径
- 确认静态文件配置

---

## 🎉 部署成功！

部署完成后，你将获得：
- 🌐 公网可访问的网站
- 🔒 HTTPS安全连接
- 📊 自动监控和日志
- 🔄 自动部署更新

恭喜！你的AI旅行规划网站已经上线！🎊

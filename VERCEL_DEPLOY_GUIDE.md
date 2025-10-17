# 🚀 Vercel部署详细步骤

## 📋 部署前检查清单

### ✅ 代码准备
- [x] Git仓库已初始化
- [x] 所有文件已提交
- [x] .gitignore已配置
- [x] package.json已优化
- [x] vercel.json已配置

### 🔑 环境变量准备
你需要准备以下环境变量：
- `DOUBAO_API_KEY`: 你的豆包API密钥
- `DOUBAO_BASE_URL`: `https://ark.cn-beijing.volces.com/api/v3`
- `DOUBAO_MODEL`: `ep-202410-advanced-travel`
- `NODE_ENV`: `production`

---

## 🌐 步骤1：创建GitHub仓库

### 方法A：使用GitHub网页
1. 访问 [github.com](https://github.com)
2. 点击右上角的 "+" 号
3. 选择 "New repository"
4. 填写仓库信息：
   - Repository name: `ai-travel-agent`
   - Description: `AI-powered travel planning website`
   - 选择 Public（公开）
   - 不要勾选 "Add a README file"
5. 点击 "Create repository"

### 方法B：使用GitHub CLI（如果已安装）
```bash
gh repo create ai-travel-agent --public --description "AI-powered travel planning website"
```

---

## 📤 步骤2：推送代码到GitHub

```bash
# 添加远程仓库
git remote add origin https://github.com/你的用户名/ai-travel-agent.git

# 推送代码
git branch -M main
git push -u origin main
```

---

## 🚀 步骤3：部署到Vercel

### 3.1 访问Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"

### 3.2 导入项目
1. 点击 "New Project"
2. 在 "Import Git Repository" 中找到你的 `ai-travel-agent` 仓库
3. 点击 "Import"

### 3.3 配置项目
1. **Project Name**: `ai-travel-agent`（或你喜欢的名字）
2. **Framework Preset**: 选择 "Other"
3. **Root Directory**: 保持默认（./）
4. **Build Command**: 留空（Vercel会自动检测）
5. **Output Directory**: 留空
6. **Install Command**: `npm install`

### 3.4 设置环境变量
在部署前，点击 "Environment Variables" 添加：

| Name | Value | Environment |
|------|-------|-------------|
| `DOUBAO_API_KEY` | 你的豆包API密钥 | Production, Preview, Development |
| `DOUBAO_BASE_URL` | `https://ark.cn-beijing.volces.com/api/v3` | Production, Preview, Development |
| `DOUBAO_MODEL` | `ep-202410-advanced-travel` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview, Development |

### 3.5 开始部署
1. 点击 "Deploy"
2. 等待部署完成（通常需要2-5分钟）

---

## 🎉 步骤4：验证部署

### 4.1 检查部署状态
- 部署完成后，你会看到一个绿色的 "Ready" 状态
- 点击 "Visit" 按钮访问你的网站

### 4.2 测试功能
访问你的网站，测试以下功能：
- [ ] 首页正常加载
- [ ] 人设选择功能
- [ ] 表单提交功能
- [ ] AI生成计划功能
- [ ] 结果展示功能
- [ ] 文件导出功能

### 4.3 检查控制台
如果遇到问题，检查：
- Vercel Dashboard 的 "Functions" 标签页
- 浏览器开发者工具的 Console 和 Network 标签页

---

## 🔧 步骤5：配置自定义域名（可选）

### 5.1 购买域名
推荐域名注册商：
- [Namecheap](https://namecheap.com)
- [GoDaddy](https://godaddy.com)
- [阿里云](https://wanwang.aliyun.com)（国内）

### 5.2 配置DNS
1. 在Vercel Dashboard中，进入项目设置
2. 点击 "Domains" 标签页
3. 添加你的域名
4. 按照Vercel提供的DNS记录配置你的域名

### 5.3 SSL证书
Vercel会自动为你的域名配置SSL证书，无需额外操作。

---

## 📊 步骤6：监控和维护

### 6.1 监控面板
- **Analytics**: 查看访问统计
- **Functions**: 监控API调用
- **Logs**: 查看错误日志

### 6.2 自动部署
- 每次推送到GitHub的main分支都会自动触发部署
- 可以在Vercel Dashboard中查看部署历史

### 6.3 环境变量管理
- 在Vercel Dashboard中可以随时更新环境变量
- 更新后需要重新部署才能生效

---

## 🆘 常见问题解决

### 问题1：部署失败
**原因**: 通常是环境变量未设置或API密钥无效
**解决**: 
1. 检查环境变量是否正确设置
2. 确认API密钥有效
3. 查看Vercel的部署日志

### 问题2：API调用失败
**原因**: 环境变量未正确传递
**解决**:
1. 确认环境变量在Vercel中已设置
2. 重新部署项目
3. 检查API密钥是否有足够的调用额度

### 问题3：静态文件404
**原因**: 文件路径配置问题
**解决**:
1. 检查vercel.json配置
2. 确认静态文件路径正确

### 问题4：网站加载慢
**原因**: 可能是网络问题或资源过大
**解决**:
1. 检查图片和资源文件大小
2. 使用Vercel的CDN加速
3. 优化代码性能

---

## 🎊 部署成功！

恭喜！你的AI旅行规划网站已经成功部署到Vercel！

### 你将获得：
- 🌐 **公网访问**: 任何人都可以访问你的网站
- 🔒 **HTTPS安全**: 自动SSL证书保护
- 📱 **移动适配**: 响应式设计支持
- 🚀 **全球CDN**: 快速访问体验
- 📊 **实时监控**: 访问统计和错误监控
- 🔄 **自动部署**: 代码更新自动部署

### 下一步：
1. 分享你的网站链接给朋友使用
2. 收集用户反馈并持续优化
3. 考虑添加更多功能
4. 监控网站性能和用户使用情况

你的AI旅行规划网站现在已经正式上线了！🎉✨

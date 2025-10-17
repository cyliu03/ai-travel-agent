# 🚀 AI旅行规划网站部署指南

## 📋 部署前准备

### 1. 环境变量配置
在部署前，你需要准备以下环境变量：

```bash
# 豆包API配置
DOUBAO_API_KEY=your_doubao_api_key_here
DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
DOUBAO_MODEL=ep-202410-advanced-travel

# 服务器配置
NODE_ENV=production
PORT=3000
```

### 2. 代码优化
- ✅ 已添加安全中间件（helmet, cors）
- ✅ 已添加压缩中间件
- ✅ 已优化错误处理
- ✅ 已添加健康检查端点

---

## 🌟 方案一：Vercel 部署（推荐）

### 优点：
- 🆓 免费额度充足
- ⚡ 部署速度快
- 🔧 配置简单
- 📊 内置监控

### 部署步骤：

1. **安装Vercel CLI**
```bash
npm install -g vercel
```

2. **登录Vercel**
```bash
vercel login
```

3. **部署项目**
```bash
vercel --prod
```

4. **设置环境变量**
在Vercel Dashboard中设置：
- `DOUBAO_API_KEY`
- `DOUBAO_BASE_URL`
- `DOUBAO_MODEL`
- `NODE_ENV=production`

5. **访问网站**
部署完成后会获得一个 `https://your-project.vercel.app` 的域名

---

## 🚂 方案二：Railway 部署

### 优点：
- 🆓 免费额度
- 🐳 Docker支持
- 📈 自动扩缩容
- 🔄 自动部署

### 部署步骤：

1. **访问 Railway**
   - 前往 [railway.app](https://railway.app)
   - 使用GitHub账号登录

2. **连接GitHub仓库**
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的项目仓库

3. **配置环境变量**
   - 在项目设置中添加环境变量
   - 设置所有必要的API密钥

4. **部署**
   - Railway会自动检测Dockerfile并部署
   - 部署完成后会获得一个 `https://your-project.railway.app` 的域名

---

## 🎨 方案三：Render 部署

### 优点：
- 🆓 免费额度
- 🔒 SSL证书
- 📊 监控面板
- 🔄 自动部署

### 部署步骤：

1. **访问 Render**
   - 前往 [render.com](https://render.com)
   - 使用GitHub账号登录

2. **创建Web Service**
   - 点击 "New +"
   - 选择 "Web Service"
   - 连接GitHub仓库

3. **配置服务**
   - Name: `travel-agent`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Dockerfile: `render.Dockerfile`

4. **设置环境变量**
   - 在Environment Variables中添加所有必要的变量

5. **部署**
   - 点击 "Create Web Service"
   - 部署完成后会获得一个 `https://your-project.onrender.com` 的域名

---

## 🔧 方案四：腾讯云/阿里云部署

### 优点：
- 🇨🇳 国内访问速度快
- 💰 价格相对便宜
- 🔧 配置灵活

### 部署步骤：

1. **购买云服务器**
   - 选择Ubuntu 20.04 LTS
   - 最低配置：1核2G内存

2. **安装Node.js**
```bash
# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PM2进程管理器
sudo npm install -g pm2
```

3. **部署代码**
```bash
# 克隆代码
git clone https://github.com/your-username/travel-agent.git
cd travel-agent

# 安装依赖
npm install --production

# 设置环境变量
export DOUBAO_API_KEY=your_api_key
export DOUBAO_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
export DOUBAO_MODEL=ep-202410-advanced-travel
export NODE_ENV=production

# 启动服务
pm2 start server.js --name "travel-agent"
pm2 save
pm2 startup
```

4. **配置Nginx反向代理**
```bash
# 安装Nginx
sudo apt install nginx

# 配置Nginx
sudo nano /etc/nginx/sites-available/travel-agent
```

Nginx配置内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **启用SSL证书**
```bash
# 安装Certbot
sudo apt install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com
```

---

## 📊 部署方案对比

| 方案 | 免费额度 | 部署难度 | 国内访问 | 推荐指数 |
|------|----------|----------|----------|----------|
| Vercel | 100GB带宽/月 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Railway | 500小时/月 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Render | 750小时/月 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 腾讯云 | 无 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🎯 推荐部署流程

1. **开发测试**：先在本地测试所有功能
2. **选择平台**：推荐Vercel（简单）或Railway（功能强）
3. **设置环境变量**：确保API密钥正确配置
4. **部署测试**：验证所有功能正常工作
5. **域名配置**：购买域名并配置DNS
6. **SSL证书**：确保HTTPS安全访问
7. **监控设置**：配置错误监控和性能监控

---

## 🔍 部署后检查清单

- [ ] 网站可以正常访问
- [ ] API接口正常工作
- [ ] AI调用功能正常
- [ ] 文件上传下载正常
- [ ] 错误处理正常
- [ ] 性能监控正常
- [ ] SSL证书有效
- [ ] 移动端适配正常

---

## 🆘 常见问题解决

### 1. API调用失败
- 检查环境变量是否正确设置
- 确认API密钥有效
- 检查网络连接

### 2. 静态文件404
- 检查文件路径配置
- 确认静态文件目录正确

### 3. 数据库连接失败
- 检查数据库配置
- 确认数据库服务正常

### 4. 内存不足
- 升级服务器配置
- 优化代码性能
- 使用CDN加速

---

## 📞 技术支持

如果在部署过程中遇到问题，可以：
1. 查看平台官方文档
2. 检查错误日志
3. 联系技术支持
4. 在GitHub提交Issue

祝你部署成功！🎉

const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const sharp = require('sharp');

class DocumentGenerator {
    constructor() {
        this.outputDir = path.join(__dirname, '..', '..', 'output');
        this.ensureOutputDir();
    }

    async ensureOutputDir() {
        try {
            await fs.access(this.outputDir);
        } catch {
            await fs.mkdir(this.outputDir, { recursive: true });
        }
    }

    async savePlanData(planId, data) {
        const filePath = path.join(this.outputDir, `${planId}.json`);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    async getPlanData(planId) {
        try {
            const filePath = path.join(this.outputDir, `${planId}.json`);
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } catch {
            return null;
        }
    }

    async generateMarkdown(planData) {
        const { structured, rawResponse, persona, params } = planData;
        
        let markdown = `# ${structured.summary?.destination || 'AI旅游计划'}\n\n`;
        markdown += `**人设类型**: ${this.getPersonaName(persona)}\n`;
        markdown += `**生成时间**: ${new Date().toLocaleString('zh-CN')}\n\n`;
        
        // 摘要信息
        if (structured.summary) {
            markdown += `## 📋 行程摘要\n\n`;
            markdown += `- **目的地**: ${structured.summary.destination || '待定'}\n`;
            markdown += `- **预算范围**: ${structured.budget?.total || '待定'}\n`;
            markdown += `- **行程天数**: ${structured.itinerary?.length || '待定'}\n\n`;
        }

        // 预算分配
        if (structured.budget) {
            markdown += `## 💰 预算分配\n\n`;
            markdown += `| 项目 | 预算 | 说明 |\n`;
            markdown += `|------|------|------|\n`;
            Object.entries(structured.budget).forEach(([key, value]) => {
                markdown += `| ${this.getBudgetItemName(key)} | ${value} | - |\n`;
            });
            markdown += `\n`;
        }

        // 详细行程
        if (structured.itinerary && structured.itinerary.length > 0) {
            markdown += `## 📅 详细行程\n\n`;
            structured.itinerary.forEach((day, index) => {
                markdown += `### 第${index + 1}天\n\n`;
                if (day.content) {
                    markdown += `${day.content}\n\n`;
                }
            });
        }

        // 交通建议
        if (structured.transport) {
            markdown += `## 🚗 交通建议\n\n`;
            Object.entries(structured.transport).forEach(([key, value]) => {
                markdown += `- **${this.getTransportTypeName(key)}**: ${value}\n`;
            });
            markdown += `\n`;
        }

        // 住宿建议
        if (structured.stay && structured.stay.length > 0) {
            markdown += `## 🏨 住宿建议\n\n`;
            structured.stay.forEach((stay, index) => {
                markdown += `### 住宿${index + 1}\n`;
                markdown += `- **区域**: ${stay.area || '待定'}\n`;
                if (stay.hotelOptions) {
                    markdown += `- **推荐酒店**: ${stay.hotelOptions.join(', ')}\n`;
                }
                markdown += `- **住宿天数**: ${stay.nights || '待定'}\n\n`;
            });
        }

        // 风险与备选
        if (structured.risks && structured.risks.length > 0) {
            markdown += `## ⚠️ 风险与备选方案\n\n`;
            structured.risks.forEach((risk, index) => {
                markdown += `${index + 1}. **${risk.trigger || '风险情况'}**: ${risk.fallback || '备选方案'}\n`;
            });
            markdown += `\n`;
        }

        // 行动清单
        if (structured.actions && structured.actions.length > 0) {
            markdown += `## ✅ 行动清单\n\n`;
            structured.actions.forEach((action, index) => {
                markdown += `- [ ] ${action}\n`;
            });
            markdown += `\n`;
        }

        // 原始AI回复
        markdown += `## 🤖 AI详细建议\n\n`;
        markdown += `${rawResponse}\n\n`;
        
        markdown += `---\n`;
        markdown += `*本行程由AI旅游规划助手生成，仅供参考。请根据实际情况调整并核实所有信息。*\n`;

        return markdown;
    }

    async generatePDF(planId, markdown) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // 将Markdown转换为HTML
        const html = await this.markdownToHtml(markdown);
        
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfPath = path.join(this.outputDir, `${planId}.pdf`);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });
        
        await browser.close();
        return pdfPath;
    }

    async generatePoster(planData) {
        const { structured } = planData;
        
        // 创建简单的海报图片
        const width = 800;
        const height = 1200;
        
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg)"/>
                <text x="400" y="100" text-anchor="middle" fill="white" font-size="48" font-family="Arial, sans-serif" font-weight="bold">AI旅游计划</text>
                <text x="400" y="200" text-anchor="middle" fill="white" font-size="32" font-family="Arial, sans-serif">${structured.summary?.destination || '目的地'}</text>
                <text x="400" y="300" text-anchor="middle" fill="white" font-size="24" font-family="Arial, sans-serif">预算: ${structured.budget?.total || '待定'}</text>
                <text x="400" y="400" text-anchor="middle" fill="white" font-size="20" font-family="Arial, sans-serif">天数: ${structured.itinerary?.length || '待定'}天</text>
                <text x="400" y="1100" text-anchor="middle" fill="white" font-size="16" font-family="Arial, sans-serif">AI旅游规划助手</text>
            </svg>
        `;
        
        const posterPath = path.join(this.outputDir, `${Date.now()}_poster.png`);
        await sharp(Buffer.from(svg))
            .png()
            .toFile(posterPath);
            
        return posterPath;
    }

    async markdownToHtml(markdown) {
        // 简单的Markdown到HTML转换
        let html = markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/^\| (.*) \|/gim, '<tr><td>$1</td></tr>')
            .replace(/\n/gim, '<br>');
        
        // 包装表格
        html = html.replace(/<tr><td>(.*?)<\/td><\/tr>/gim, (match, content) => {
            const cells = content.split(' | ');
            return `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
        });
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>AI旅游计划</title>
                <style>
                    body { font-family: 'Microsoft YaHei', Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
                    h1 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
                    h2 { color: #555; margin-top: 30px; }
                    h3 { color: #666; margin-top: 20px; }
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    li { margin: 5px 0; }
                    strong { color: #333; }
                </style>
            </head>
            <body>${html}</body>
            </html>
        `;
    }

    getPersonaName(persona) {
        const names = {
            'explorer': '探索型',
            'planner': '方案型',
            'budget': '预算型',
            'family': '家庭亲子型',
            'experience': '深度体验型',
            'leisure': '轻松休闲型',
            'business': '商务顺带游'
        };
        return names[persona] || persona;
    }

    getBudgetItemName(key) {
        const names = {
            'transport': '交通',
            'stay': '住宿',
            'food': '餐饮',
            'activities': '活动',
            'buffer': '应急',
            'total': '总计'
        };
        return names[key] || key;
    }

    getTransportTypeName(key) {
        const names = {
            'to': '去程',
            'within': '当地交通',
            'return': '返程'
        };
        return names[key] || key;
    }
}

module.exports = DocumentGenerator;

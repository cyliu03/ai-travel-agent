const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const DocumentGenerator = require('../services/documentGenerator');

const docGenerator = new DocumentGenerator();

// 下载生成的文档
router.get('/download/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const planData = await docGenerator.getPlanData(id);
        
        if (!planData) {
            return res.status(404).json({
                success: false,
                error: '计划不存在'
            });
        }

        let filePath;
        let contentType;
        let fileName;

        switch (type) {
            case 'markdown':
                const markdown = await docGenerator.generateMarkdown(planData);
                filePath = path.join(docGenerator.outputDir, `${id}.md`);
                await fs.writeFile(filePath, markdown);
                contentType = 'text/markdown';
                fileName = `旅游计划_${id}.md`;
                break;
                
            case 'pdf':
                const markdownForPdf = await docGenerator.generateMarkdown(planData);
                filePath = await docGenerator.generatePDF(id, markdownForPdf);
                contentType = 'application/pdf';
                fileName = `旅游计划_${id}.pdf`;
                break;
                
            case 'poster':
                filePath = await docGenerator.generatePoster(planData);
                contentType = 'image/png';
                fileName = `旅游海报_${id}.png`;
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    error: '不支持的文件类型'
                });
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        
        const fileBuffer = await fs.readFile(filePath);
        res.send(fileBuffer);
        
    } catch (error) {
        console.error('下载文件失败:', error);
        res.status(500).json({
            success: false,
            error: '下载文件时发生错误'
        });
    }
});

// 批量导出
router.post('/export', async (req, res) => {
    try {
        const { planId, formats } = req.body;
        
        if (!planId || !formats || !Array.isArray(formats)) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数：planId 和 formats'
            });
        }

        const planData = await docGenerator.getPlanData(planId);
        
        if (!planData) {
            return res.status(404).json({
                success: false,
                error: '计划不存在'
            });
        }

        const results = {};
        
        for (const format of formats) {
            try {
                switch (format) {
                    case 'markdown':
                        const markdown = await docGenerator.generateMarkdown(planData);
                        const mdPath = path.join(docGenerator.outputDir, `${planId}.md`);
                        await fs.writeFile(mdPath, markdown);
                        results.markdown = `/api/export/download/markdown/${planId}`;
                        break;
                        
                    case 'pdf':
                        const markdownForPdf = await docGenerator.generateMarkdown(planData);
                        await docGenerator.generatePDF(planId, markdownForPdf);
                        results.pdf = `/api/export/download/pdf/${planId}`;
                        break;
                        
                    case 'poster':
                        await docGenerator.generatePoster(planData);
                        results.poster = `/api/export/download/poster/${planId}`;
                        break;
                }
            } catch (error) {
                console.error(`导出${format}失败:`, error);
                results[format] = { error: error.message };
            }
        }

        res.json({
            success: true,
            downloads: results
        });
        
    } catch (error) {
        console.error('批量导出失败:', error);
        res.status(500).json({
            success: false,
            error: '批量导出时发生错误'
        });
    }
});

// 获取支持的文件格式
router.get('/formats', (req, res) => {
    res.json({
        success: true,
        formats: [
            {
                type: 'markdown',
                name: 'Markdown文档',
                description: '纯文本格式，适合编辑和分享',
                extension: '.md'
            },
            {
                type: 'pdf',
                name: 'PDF文档',
                description: '适合打印和正式分享',
                extension: '.pdf'
            },
            {
                type: 'poster',
                name: '海报图片',
                description: '社交媒体分享图片',
                extension: '.png'
            }
        ]
    });
});

module.exports = router;

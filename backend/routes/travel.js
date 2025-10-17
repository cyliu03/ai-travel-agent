const express = require('express');
const router = express.Router();
const ClaudeService = require('../services/claudeService');
const DocumentGenerator = require('../services/documentGenerator');

const claudeService = new ClaudeService();
const docGenerator = new DocumentGenerator();

// 生成旅游计划
router.post('/generate-plan', async (req, res) => {
    try {
        console.log('📨 收到生成旅游计划请求');
        console.log('📋 请求体:', JSON.stringify(req.body, null, 2));
        
        const { persona, params } = req.body;
        
        // 验证必要参数
        if (!persona || !params) {
            console.log('❌ 参数验证失败: 缺少必要参数');
            return res.status(400).json({
                success: false,
                error: '缺少必要参数：persona 和 params'
            });
        }

        console.log('✅ 参数验证通过');
        console.log('🎯 人设:', persona);
        console.log('📝 参数数量:', Object.keys(params).length);

        // 调用Claude生成计划
        console.log('🔄 开始调用AI服务...');
        const result = await claudeService.generateTravelPlan({ persona, params });
        
        if (!result.success) {
            console.log('❌ AI调用失败:', result.error);
            return res.status(500).json(result);
        }

        console.log('✅ AI调用成功');

        // 生成文档ID
        const planId = Date.now().toString();
        console.log('🆔 生成计划ID:', planId);
        
        // 保存计划数据
        console.log('💾 保存计划数据...');
        await docGenerator.savePlanData(planId, result.data);
        console.log('✅ 计划数据保存完成');
        
        console.log('🎉 请求处理完成，返回结果');
        res.json({
            success: true,
            planId: planId,
            data: result.data
        });
        
    } catch (error) {
        console.error('❌ 生成旅游计划失败:', error);
        console.error('❌ 错误堆栈:', error.stack);
        res.status(500).json({
            success: false,
            error: '生成旅游计划时发生错误'
        });
    }
});

// 获取计划详情
router.get('/plan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const planData = await docGenerator.getPlanData(id);
        
        if (!planData) {
            return res.status(404).json({
                success: false,
                error: '计划不存在'
            });
        }
        
        res.json({
            success: true,
            data: planData
        });
        
    } catch (error) {
        console.error('获取计划失败:', error);
        res.status(500).json({
            success: false,
            error: '获取计划时发生错误'
        });
    }
});

// 更新计划
router.put('/plan/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const result = await claudeService.generateTravelPlan(updates);
        
        if (!result.success) {
            return res.status(500).json(result);
        }
        
        await docGenerator.savePlanData(id, result.data);
        
        res.json({
            success: true,
            data: result.data
        });
        
    } catch (error) {
        console.error('更新计划失败:', error);
        res.status(500).json({
            success: false,
            error: '更新计划时发生错误'
        });
    }
});

module.exports = router;

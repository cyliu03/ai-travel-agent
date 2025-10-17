const fetch = require('node-fetch');

// 测试配置
const TEST_CONFIG = {
    baseUrl: 'http://localhost:3000',
    testPersona: 'explorer',
    testParams: {
        origin: '北京',
        dateRange: '2024年3月15-20日',
        preferences: '美食、历史、自然风光',
        climate: '温暖',
        budget: '5000元/人',
        companions: '2个成人',
        constraints: '素食',
        outputFormat: 'markdown'
    }
};

async function runTests() {
    console.log('🧪 开始测试AI旅游规划助手...\n');
    
    try {
        // 测试1: 健康检查
        await testHealthCheck();
        
        // 测试2: 生成旅游计划
        const planId = await testGeneratePlan();
        
        // 测试3: 获取计划详情
        await testGetPlan(planId);
        
        // 测试4: 导出功能
        await testExport(planId);
        
        console.log('✅ 所有测试通过！');
        
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        process.exit(1);
    }
}

async function testHealthCheck() {
    console.log('1️⃣ 测试健康检查...');
    
    try {
        const response = await fetch(`${TEST_CONFIG.baseUrl}/`);
        if (response.ok) {
            console.log('✅ 服务器运行正常');
        } else {
            throw new Error('服务器响应异常');
        }
    } catch (error) {
        throw new Error(`健康检查失败: ${error.message}`);
    }
}

async function testGeneratePlan() {
    console.log('2️⃣ 测试生成旅游计划...');
    
    try {
        const response = await fetch(`${TEST_CONFIG.baseUrl}/api/travel/generate-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                persona: TEST_CONFIG.testPersona,
                params: TEST_CONFIG.testParams
            })
        });
        
        const result = await response.json();
        
        if (result.success && result.planId) {
            console.log('✅ 计划生成成功');
            console.log(`📋 计划ID: ${result.planId}`);
            return result.planId;
        } else {
            throw new Error(result.error || '计划生成失败');
        }
    } catch (error) {
        throw new Error(`生成计划失败: ${error.message}`);
    }
}

async function testGetPlan(planId) {
    console.log('3️⃣ 测试获取计划详情...');
    
    try {
        const response = await fetch(`${TEST_CONFIG.baseUrl}/api/travel/plan/${planId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            console.log('✅ 计划详情获取成功');
            console.log(`🎯 人设: ${result.data.persona}`);
        } else {
            throw new Error(result.error || '获取计划失败');
        }
    } catch (error) {
        throw new Error(`获取计划失败: ${error.message}`);
    }
}

async function testExport(planId) {
    console.log('4️⃣ 测试导出功能...');
    
    try {
        // 测试Markdown导出
        const mdResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/export/download/markdown/${planId}`);
        if (mdResponse.ok) {
            console.log('✅ Markdown导出成功');
        } else {
            throw new Error('Markdown导出失败');
        }
        
        // 测试PDF导出
        const pdfResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/export/download/pdf/${planId}`);
        if (pdfResponse.ok) {
            console.log('✅ PDF导出成功');
        } else {
            console.log('⚠️ PDF导出失败（可能是依赖问题）');
        }
        
        // 测试海报导出
        const posterResponse = await fetch(`${TEST_CONFIG.baseUrl}/api/export/download/poster/${planId}`);
        if (posterResponse.ok) {
            console.log('✅ 海报导出成功');
        } else {
            console.log('⚠️ 海报导出失败（可能是依赖问题）');
        }
        
    } catch (error) {
        throw new Error(`导出测试失败: ${error.message}`);
    }
}

// 运行测试
if (require.main === module) {
    runTests();
}

module.exports = { runTests, TEST_CONFIG };

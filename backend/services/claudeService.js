const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class ClaudeService {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.DOUBAO_API_KEY,
            baseURL: process.env.DOUBAO_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3',
        });
    }

    async generateTravelPlan(userInput) {
        try {
            console.log('🚀 开始调用AI生成旅行计划...');
            console.log('📝 输入参数:', JSON.stringify(userInput, null, 2));
            
            const { persona, params } = userInput;
            
            // 检查环境变量
            console.log('🔑 检查API配置:');
            console.log('- DOUBAO_API_KEY:', process.env.DOUBAO_API_KEY ? '已设置' : '❌ 未设置');
            console.log('- DOUBAO_BASE_URL:', process.env.DOUBAO_BASE_URL || '使用默认值');
            console.log('- DOUBAO_MODEL:', process.env.DOUBAO_MODEL || '使用默认值');
            
            // 获取对应的提示词模板
            console.log('📋 获取提示词模板...');
            const promptTemplate = await this.getPromptTemplate(persona);
            console.log('✅ 提示词模板获取成功');
            
            // 构建完整的用户提示词
            console.log('🔨 构建用户提示词...');
            const userPrompt = this.buildUserPrompt(promptTemplate, params);
            console.log('✅ 用户提示词构建完成，长度:', userPrompt.length);
            
            // 调用豆包（OpenAI 兼容）API
            console.log('🤖 开始调用豆包API...');
            console.log('📡 API请求参数:');
            console.log('- Model:', process.env.DOUBAO_MODEL || 'ep-202410-advanced-travel');
            console.log('- Temperature: 0.3 (降低以获得更一致输出)');
            console.log('- Max Tokens: 8000 (增加以获得更详细内容)');
            console.log('- Top P: 0.9');
            console.log('- Frequency Penalty: 0.1');
            console.log('- Presence Penalty: 0.1');
            
            const response = await this.client.chat.completions.create({
                model: process.env.DOUBAO_MODEL || 'ep-202410-advanced-travel',
                temperature: 0.3, // 降低温度以获得更一致和详细的输出
                max_tokens: 8000, // 增加tokens以获得更详细的内容
                top_p: 0.9,
                frequency_penalty: 0.1, // 减少重复
                presence_penalty: 0.1, // 鼓励多样性
                messages: [
                    { role: 'system', content: this.getSystemPrompt() },
                    { role: 'user', content: userPrompt }
                ]
            });

            console.log('✅ 豆包API调用成功！');
            console.log('📊 API响应信息:');
            console.log('- Usage:', response.usage);
            console.log('- Finish Reason:', response.choices?.[0]?.finish_reason);

            const content = response.choices?.[0]?.message?.content || '';
            console.log('📄 响应内容长度:', content.length);
            console.log('📄 响应内容预览:', content.substring(0, 200) + '...');
            
            // 解析结构化输出
            console.log('🔍 解析结构化输出...');
            const structuredData = this.parseStructuredOutput(content);
            console.log('✅ 结构化数据解析完成');
            
            console.log('🎉 AI调用完成，返回结果');
            return {
                success: true,
                data: {
                    rawResponse: content,
                    structured: structuredData,
                    persona: persona,
                    params: params
                }
            };
            
        } catch (error) {
            console.error('❌ 豆包API调用失败:', error);
            console.error('❌ 错误详情:', {
                message: error.message,
                code: error.code,
                type: error.type,
                stack: error.stack
            });
            return {
                success: false,
                error: error.message
            };
        }
    }

    getSystemPrompt() {
        return `你是一个专业的AI旅行规划代理系统，采用多智能体协作模式，由以下专业代理组成：

🎯 **主控代理（Master Agent）**：负责整体规划协调
📊 **预算分析代理（Budget Agent）**：负责详细预算分配
🗺️ **行程规划代理（Itinerary Agent）**：负责每日行程安排
🚗 **交通规划代理（Transport Agent）**：负责交通方案设计
🏨 **住宿推荐代理（Accommodation Agent）**：负责住宿建议
🍽️ **餐饮推荐代理（Dining Agent）**：负责美食推荐
🎪 **活动推荐代理（Activity Agent）**：负责景点活动安排
⚠️ **风险评估代理（Risk Agent）**：负责风险预案制定

## 核心要求：

### 1. 完整计划制定
- 提供7天完整行程，每天包含上午、下午、晚上三个时段
- 每个时段至少包含2-3个具体活动或景点
- 明确标注每个活动的时间安排和预计时长
- 提供备选方案和调整建议

### 2. 详细预算分配
- 按类别详细分解：交通、住宿、餐饮、门票、购物、其他
- 提供具体价格区间和预订渠道
- 包含省钱技巧和优惠信息
- 提供预算超支的应对策略

### 3. 排版美观要求
- 使用清晰的层级结构，避免过多符号
- 采用表格、列表等结构化展示
- 使用emoji增强可读性
- 保持一致的格式风格

### 4. 内容详细程度
- 每个景点提供详细描述和推荐理由
- 交通方案包含具体班次、时间、价格
- 住宿推荐包含具体酒店名称、地址、价格
- 餐饮推荐包含具体餐厅、特色菜品、人均消费

### 5. 智能化特性
- 根据用户人设个性化推荐
- 考虑季节、天气、节假日等因素
- 提供实时信息获取建议
- 包含当地文化体验和深度游建议

## 输出格式要求：
1. 使用清晰的标题层级（避免过多#符号）
2. 采用表格展示预算和行程
3. 使用列表展示要点
4. 包含丰富的emoji增强视觉效果
5. 提供具体的操作指南和联系方式`;
    }

    async getPromptTemplate(persona) {
        // 从项目根目录的 templates/prompts.json 读取
        const templatesPath = path.join(__dirname, '..', '..', 'templates', 'prompts.json');
        const templates = JSON.parse(await fs.readFile(templatesPath, 'utf8'));
        return templates[persona] || templates.explorer;
    }

    buildUserPrompt(template, params) {
        let prompt = template;
        
        // 替换模板中的占位符
        Object.keys(params).forEach(key => {
            const placeholder = `{${key}}`;
            prompt = prompt.replace(new RegExp(placeholder, 'g'), params[key] || '未指定');
        });
        
        return prompt;
    }

    parseStructuredOutput(content) {
        try {
            // 尝试提取JSON结构
            const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[1]);
            }
            
            // 如果没有找到JSON，返回解析后的文本结构
            return this.parseTextOutput(content);
        } catch (error) {
            console.error('解析结构化输出失败:', error);
            return this.parseTextOutput(content);
        }
    }

    parseTextOutput(content) {
        // 改进的文本解析逻辑
        const lines = content.split('\n');
        const result = {
            summary: {},
            itinerary: [],
            budget: {},
            transport: {},
            stay: [],
            risks: [],
            actions: []
        };

        let currentSection = null;
        
        lines.forEach(line => {
            const trimmed = line.trim();
            
            // 提取目的地信息
            if (trimmed.includes('目的地') || trimmed.includes('Destination') || trimmed.includes('推荐') || trimmed.includes('首选')) {
                const match = trimmed.match(/(?:目的地|Destination|推荐|首选)[:：]?\s*(.+)/);
                if (match && !result.summary.destination) {
                    result.summary.destination = match[1].trim();
                }
            }
            
            // 提取预算信息
            if (trimmed.includes('预算') || trimmed.includes('Budget') || trimmed.includes('费用')) {
                const match = trimmed.match(/(?:预算|Budget|费用)[:：]?\s*(.+)/);
                if (match && !result.budget.total) {
                    result.budget.total = match[1].trim();
                }
            }
            
            // 提取行程天数
            if (trimmed.match(/^第?\d+[天日]/) || trimmed.match(/\d+天/)) {
                const dayMatch = trimmed.match(/(第?\d+[天日]|\d+天)/);
                if (dayMatch) {
                    result.itinerary.push({
                        day: result.itinerary.length + 1,
                        content: trimmed,
                        title: dayMatch[0]
                    });
                }
            }
            
            // 提取交通信息
            if (trimmed.includes('交通') || trimmed.includes('航班') || trimmed.includes('高铁') || trimmed.includes('自驾')) {
                if (trimmed.includes('去程') || trimmed.includes('出发')) {
                    result.transport.to = trimmed;
                } else if (trimmed.includes('返程') || trimmed.includes('回程')) {
                    result.transport.return = trimmed;
                } else if (trimmed.includes('当地') || trimmed.includes('市内')) {
                    result.transport.within = trimmed;
                } else if (!result.transport.to) {
                    result.transport.to = trimmed;
                }
            }
            
            // 提取住宿信息
            if (trimmed.includes('住宿') || trimmed.includes('酒店') || trimmed.includes('民宿')) {
                result.stay.push({
                    area: trimmed.includes('区域') ? trimmed.split('区域')[1]?.trim() : '待定',
                    hotelOptions: trimmed.includes('推荐') ? [trimmed] : [],
                    nights: trimmed.match(/\d+晚/) ? trimmed.match(/\d+晚/)[0] : '待定'
                });
            }
            
            // 提取风险信息
            if (trimmed.includes('风险') || trimmed.includes('备选') || trimmed.includes('应对')) {
                result.risks.push({
                    trigger: trimmed.includes('：') ? trimmed.split('：')[0] : '风险情况',
                    fallback: trimmed.includes('：') ? trimmed.split('：')[1] : trimmed
                });
            }
            
            // 提取行动清单
            if (trimmed.includes('清单') || trimmed.includes('准备') || trimmed.includes('需要')) {
                if (trimmed.includes('：') || trimmed.includes(':')) {
                    result.actions.push(trimmed.split(/[：:]/)[1]?.trim() || trimmed);
                } else {
                    result.actions.push(trimmed);
                }
            }
        });

        // 如果没有提取到目的地，尝试从内容中寻找
        if (!result.summary.destination) {
            const destinationMatch = content.match(/(?:推荐|首选|建议)[:：]?\s*([^，。\n]+)/);
            if (destinationMatch) {
                result.summary.destination = destinationMatch[1].trim();
            }
        }

        // 如果没有提取到预算，尝试从内容中寻找
        if (!result.budget.total) {
            const budgetMatch = content.match(/(?:预算|费用)[:：]?\s*([^，。\n]+)/);
            if (budgetMatch) {
                result.budget.total = budgetMatch[1].trim();
            }
        }

        return result;
    }
}

module.exports = ClaudeService;

// 全局状态管理
let currentState = {
    selectedPersona: null,
    formData: {},
    currentPlanId: null
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化表单
    initializeForm();
}

function bindEventListeners() {
    // 人设卡片点击事件
    const personaCards = document.querySelectorAll('.persona-card');
    personaCards.forEach(card => {
        card.addEventListener('click', function() {
            selectPersona(this.dataset.persona);
        });
    });
    
    // 表单提交事件
    const form = document.getElementById('travelForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function initializeForm() {
    // 初始化时隐藏偏好设置组件
    document.getElementById('preferencesGroup').style.display = 'none';
    
    // 初始化自动扩行功能
    initializeAutoResize();
}

// 初始化自动扩行功能
function initializeAutoResize() {
    const autoResizeTextareas = document.querySelectorAll('textarea.auto-resize');
    
    autoResizeTextareas.forEach(textarea => {
        // 设置初始高度
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        
        // 添加输入事件监听器
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
        
        // 添加粘贴事件监听器
        textarea.addEventListener('paste', function() {
            setTimeout(() => {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 200) + 'px';
            }, 10);
        });
    });
}

// 开始规划流程
function startPlanning() {
    showSection('personaSection');
    scrollToSection('personaSection');
}

// 选择人设
function selectPersona(persona) {
    // 移除之前的选择
    document.querySelectorAll('.persona-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 选中当前卡片
    document.querySelector(`[data-persona="${persona}"]`).classList.add('selected');
    
    currentState.selectedPersona = persona;
    
    // 根据人设调整表单字段
    adjustFormFields(persona);
    
    // 延迟显示表单
    setTimeout(() => {
        showSection('parameterSection');
        scrollToSection('parameterSection');
    }, 500);
}

// 根据人设调整表单字段显示
function adjustFormFields(persona) {
    const personaSpecificFields = {
        explorer: ['preferences', 'climate'],
        planner: ['transportPreference', 'accommodationPreference', 'activityPreferences'],
        budget: ['savingPriority', 'tradeoffs'],
        family: ['childrenAge', 'babyFacilities', 'pace', 'dietaryNeeds'],
        experience: ['interests', 'depth', 'languageSkills'],
        leisure: ['leisurePreferences', 'accommodationRequirements', 'activityLevel'],
        business: ['meetingTime', 'meetingLocation', 'availableTime', 'businessNeeds']
    };
    
    // 隐藏偏好设置组件
    document.getElementById('preferencesGroup').style.display = 'none';
    
    // 显示当前人设的特定字段
    if (personaSpecificFields[persona]) {
        const fields = personaSpecificFields[persona];
        
        // 显示偏好设置组件
        const preferencesGroup = document.getElementById('preferencesGroup');
        preferencesGroup.style.display = 'block';
        
        // 只显示相关的字段
        const allFormGroups = preferencesGroup.querySelectorAll('.form-group');
        allFormGroups.forEach(element => {
            const input = element.querySelector('input, select, textarea');
            if (input && fields.includes(input.id)) {
                element.style.display = 'flex';
            } else {
                element.style.display = 'none';
            }
        });
        
        // 重新初始化自动扩行功能
        setTimeout(() => {
            initializeAutoResize();
        }, 100);
    }
    
    // 根据人设调整必填字段
    adjustRequiredFields(persona);
}

// 根据人设调整必填字段
function adjustRequiredFields(persona) {
    // 探索型不需要目的地
    const destinationField = document.getElementById('destination');
    if (destinationField) {
        if (persona === 'explorer') {
            destinationField.removeAttribute('required');
            destinationField.placeholder = '例如：自然风光、历史人文、美食体验（可选）';
        } else {
            destinationField.setAttribute('required', 'required');
            destinationField.placeholder = '例如：日本东京';
        }
    }
}

// 返回上一步
function goBack() {
    if (document.getElementById('parameterSection').style.display !== 'none') {
        showSection('personaSection');
        scrollToSection('personaSection');
    }
}

// 返回首页
function goToHome() {
    hideAllSections();
    // 显示欢迎区域
    document.querySelector('.hero').style.display = 'block';
    scrollToTop();
}

// 返回表单修改
function goBackToForm() {
    showSection('parameterSection');
    scrollToSection('parameterSection');
}

// 滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 处理表单提交
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    
    // 收集表单数据
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    currentState.formData = data;
    
    // 显示结果区域
    showSection('resultsSection');
    scrollToSection('resultsSection');
    
    // 显示加载状态
    showLoading();
    
    try {
        // 调用API生成计划
        const response = await fetch('/api/travel/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                persona: currentState.selectedPersona,
                params: data
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            currentState.currentPlanId = result.planId;
            displayPlan(result.data);
        } else {
            showError(result.error);
        }
        
    } catch (error) {
        console.error('生成计划失败:', error);
        showError('网络错误，请稍后重试');
    }
}

// 显示计划结果
function displayPlan(planData) {
    hideLoading();
    
    const planContent = document.getElementById('planContent');
    const { structured, rawResponse } = planData;
    
    let html = '';
    
    // 计划摘要
    if (structured.summary) {
        html += `
            <div class="plan-summary">
                <div class="summary-item">
                    <h4>目的地</h4>
                    <p>${structured.summary.destination || '待定'}</p>
                </div>
                <div class="summary-item">
                    <h4>预算范围</h4>
                    <p>${structured.budget?.total || '待定'}</p>
                </div>
                <div class="summary-item">
                    <h4>行程天数</h4>
                    <p>${structured.itinerary?.length || '待定'}天</p>
                </div>
                <div class="summary-item">
                    <h4>人设类型</h4>
                    <p>${getPersonaName(currentState.selectedPersona)}</p>
                </div>
            </div>
        `;
    }
    
    // 预算分配
    if (structured.budget) {
        html += `
            <div class="plan-section">
                <h3>💰 预算分配</h3>
                <div class="budget-grid">
        `;
        
        Object.entries(structured.budget).forEach(([key, value]) => {
            html += `
                <div class="budget-item">
                    <span class="budget-label">${getBudgetItemName(key)}</span>
                    <span class="budget-value">${value}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // 详细行程
    if (structured.itinerary && structured.itinerary.length > 0) {
        html += `
            <div class="plan-section">
                <h3>📅 详细行程</h3>
        `;
        
        structured.itinerary.forEach((day, index) => {
            html += `
                <div class="itinerary-day">
                    <h4>第${index + 1}天</h4>
                    <div class="itinerary-content">
                        ${day.content || '行程安排待定'}
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    // 交通建议
    if (structured.transport) {
        html += `
            <div class="plan-section">
                <h3>🚗 交通建议</h3>
                <div class="transport-list">
        `;
        
        Object.entries(structured.transport).forEach(([key, value]) => {
            html += `
                <div class="transport-item">
                    <strong>${getTransportTypeName(key)}:</strong> ${value}
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // 住宿建议
    if (structured.stay && structured.stay.length > 0) {
        html += `
            <div class="plan-section">
                <h3>🏨 住宿建议</h3>
        `;
        
        structured.stay.forEach((stay, index) => {
            html += `
                <div class="stay-item">
                    <h4>住宿${index + 1}</h4>
                    <p><strong>区域:</strong> ${stay.area || '待定'}</p>
                    ${stay.hotelOptions ? `<p><strong>推荐酒店:</strong> ${stay.hotelOptions.join(', ')}</p>` : ''}
                    <p><strong>住宿天数:</strong> ${stay.nights || '待定'}</p>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    // 风险与备选
    if (structured.risks && structured.risks.length > 0) {
        html += `
            <div class="plan-section">
                <h3>⚠️ 风险与备选方案</h3>
                <ul class="risks-list">
        `;
        
        structured.risks.forEach(risk => {
            html += `
                <li>
                    <strong>${risk.trigger || '风险情况'}:</strong> 
                    ${risk.fallback || '备选方案'}
                </li>
            `;
        });
        
        html += `
                </ul>
            </div>
        `;
    }
    
    // 行动清单
    if (structured.actions && structured.actions.length > 0) {
        html += `
            <div class="plan-section">
                <h3>✅ 行动清单</h3>
                <ul class="actions-list">
        `;
        
        structured.actions.forEach(action => {
            html += `<li>${action}</li>`;
        });
        
        html += `
                </ul>
            </div>
        `;
    }
    
    // AI详细建议
    html += `
        <div class="plan-section">
            <h3>🤖 AI详细建议</h3>
            <div class="ai-suggestions">
                ${formatRawResponse(rawResponse)}
            </div>
        </div>
    `;
    
    planContent.innerHTML = html;
    planContent.style.display = 'block';
    planContent.classList.add('fade-in');
}

// 格式化原始AI回复
function formatRawResponse(rawResponse) {
    // 简单的Markdown到HTML转换
    return rawResponse
        .replace(/^# (.*$)/gim, '<h4>$1</h4>')
        .replace(/^## (.*$)/gim, '<h5>$1</h5>')
        .replace(/^### (.*$)/gim, '<h6>$1</h6>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/\n/gim, '<br>');
}

// 导出计划
async function exportPlan(format) {
    if (!currentState.currentPlanId) {
        showError('没有可导出的计划');
        return;
    }
    
    try {
        const response = await fetch(`/api/export/download/${format}/${currentState.currentPlanId}`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `旅游计划_${currentState.currentPlanId}.${format === 'markdown' ? 'md' : format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            showError('导出失败，请稍后重试');
        }
    } catch (error) {
        console.error('导出失败:', error);
        showError('导出失败，请稍后重试');
    }
}

// 开始新计划
function startNewPlan() {
    // 重置状态
    currentState = {
        selectedPersona: null,
        formData: {},
        currentPlanId: null
    };
    
    // 重置表单
    document.getElementById('travelForm').reset();
    
    // 移除人设选择
    document.querySelectorAll('.persona-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 隐藏所有区域
    hideAllSections();
    
    // 显示人设选择
    showSection('personaSection');
    scrollToSection('personaSection');
}

// 工具函数
function showSection(sectionId) {
    hideAllSections();
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById(sectionId).classList.add('fade-in');
}

function hideAllSections() {
    const sections = ['personaSection', 'parameterSection', 'resultsSection'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
            section.classList.remove('fade-in');
        }
    });
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'block';
    document.getElementById('planContent').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

function showError(message) {
    hideLoading();
    const planContent = document.getElementById('planContent');
    planContent.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>生成失败</h3>
            <p>${message}</p>
            <button class="btn-primary" onclick="startNewPlan()">
                <i class="fas fa-redo"></i>
                重新开始
            </button>
        </div>
    `;
    planContent.style.display = 'block';
}

function getPersonaName(persona) {
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

function getBudgetItemName(key) {
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

function getTransportTypeName(key) {
    const names = {
        'to': '去程',
        'within': '当地交通',
        'return': '返程'
    };
    return names[key] || key;
}

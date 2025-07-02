// 加载SQL步骤和示例
const steps = [
  { title: 'FROM', icon: '📂', desc: '指定数据来源表' },
  { title: 'JOIN & ON', icon: '🔗', desc: '多表连接与条件' },
  { title: 'WHERE', icon: '🔍', desc: '筛选原始数据' },
  { title: 'GROUP BY', icon: '🧩', desc: '分组聚合' },
  { title: 'HAVING', icon: '🛡️', desc: '分组后筛选' },
  { title: 'SELECT', icon: '🎯', desc: '选择字段/表达式' },
  { title: 'DISTINCT', icon: '✨', desc: '去重结果' },
  { title: 'ORDER BY', icon: '⬇️', desc: '排序结果' },
  { title: 'LIMIT', icon: '🚦', desc: '限制行数' }
];

// 动态加载SQL示例
let sqlExamples = window.sqlExamples || [];
if (!sqlExamples && typeof require !== 'undefined') {
  sqlExamples = require('./sql_examples.js').default;
}

const stepsGrid = document.getElementById('steps-grid');
const stepDetail = document.getElementById('step-detail');
const stepTitle = document.getElementById('step-title');
const sqlSelect = document.createElement('select');
sqlSelect.id = 'sql-select';
sqlSelect.style.marginBottom = '1.2rem';
const simulateBtn = document.createElement('button');
simulateBtn.id = 'simulate-btn';
simulateBtn.textContent = '开始模拟';
simulateBtn.className = 'simulate-btn';
let currentExampleIdx = 0;
let simulating = false;
let simStepIdx = 0;
let simTimer = null;
let simAutoPlay = false; // 添加自动播放标志

// 高亮索引
function getStepIndex(stepTitle) {
  return steps.findIndex(s => s.title === stepTitle);
}

function renderStepsGrid(activeIdx = null, highlightStep = null) {
  stepsGrid.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const btn = document.createElement('button');
    btn.className = 'step-grid-btn';
    btn.innerHTML = `<span class="step-icon">${steps[i].icon}</span><span class="step-title">${steps[i].title}</span><div class="step-desc">${steps[i].desc}</div>`;
    if (activeIdx === i) btn.classList.add('active');
    if (highlightStep && highlightStep === steps[i].title) btn.classList.add('sim-highlight');
    btn.onclick = () => handleStepClick(i);
    stepsGrid.appendChild(btn);
  }
}

function renderStepDetail(idx) {
  const step = steps[idx];
  stepTitle.textContent = step.title + ' 步骤详情';
  
  // 获取详细解释（如果存在）
  const stepDetails = window.sqlStepDetails && window.sqlStepDetails[step.title];
  
  if (stepDetails && stepDetails.detail) {
    // 使用详细解释
    stepDetail.innerHTML = `
      <div class="step-card">
        <div class="step-title">${step.icon} ${stepDetails.title || step.title}</div>
        ${stepDetails.detail}
      </div>
    `;
  } else {
    // 使用简单解释（向后兼容）
  stepDetail.innerHTML = `
    <div class="step-card">
      <div class="step-title">${step.icon} ${step.title}</div>
      <div>${step.desc}</div>
    </div>
  `;
  }
}

function renderSqlSelect() {
  sqlSelect.innerHTML = '';
  sqlExamples.forEach((ex, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = ex.name;
    sqlSelect.appendChild(opt);
  });
}

function renderSqlExample(idx) {
  const ex = sqlExamples[idx];
  const exampleSection = document.querySelector('.example-section');
  exampleSection.querySelector('h2').textContent = ex.name;
  exampleSection.querySelector('pre code').textContent = ex.sql;
  exampleSection.querySelector('pre code').className = 'sql';
  if (window.hljs) window.hljs.highlightElement(exampleSection.querySelector('pre code'));
  
  // 修复：确保不覆盖模拟按钮的点击事件
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(ex.sql).then(() => {
        copyBtn.textContent = '已复制!';
        setTimeout(() => (copyBtn.textContent = '复制代码'), 1200);
      });
    };
  }
  
  document.getElementById('sql-desc')?.remove();
  const desc = document.createElement('div');
  desc.id = 'sql-desc';
  desc.className = 'sql-desc';
  desc.textContent = ex.description;
  exampleSection.insertBefore(desc, exampleSection.querySelector('pre'));
}

function resetStepHighlights() {
  document.querySelectorAll('.step-grid-btn').forEach(btn => {
    btn.classList.remove('sim-highlight');
    btn.classList.remove('active');
  });
}

function simulateSteps(idx, autoPlay = false) {
  if (simTimer) clearInterval(simTimer);
  
  // 确保当前示例索引正确
  currentExampleIdx = idx;
  const ex = sqlExamples[currentExampleIdx];
  
  // 重置状态
  resetStepHighlights();
  simulating = true;
  simStepIdx = 0;
  simAutoPlay = autoPlay; // 设置自动播放状态
  
  // 更新按钮状态
  updateSimulationButtons();
  
  // 显示进度提示
  simulateBtn.textContent = autoPlay ? '模拟中...' : '重新开始';
  simulateBtn.disabled = autoPlay;
  
  // 立即显示第一步
  highlightCurrentStep();
  
  // 如果是自动播放模式，设置定时器
  if (autoPlay) {
    simTimer = setInterval(() => {
      nextSimulationStep();
    }, 1500);
  }
}
  
  function highlightCurrentStep() {
  const ex = sqlExamples[currentExampleIdx];
  
    if (simStepIdx >= ex.steps.length) {
    // 如果已经完成所有步骤
    if (simAutoPlay) {
      clearInterval(simTimer);
      simulating = false;
      simAutoPlay = false;
      simulateBtn.textContent = '开始模拟';
      simulateBtn.disabled = false;
    }
      return;
    }
    
    // 重置所有高亮
    resetStepHighlights();
    
    // 获取当前步骤的名称
    const currentStepName = ex.steps[simStepIdx];
    
    // 找到对应的索引
    const stepIdx = getStepIndex(currentStepName);
    
  // 高亮当前步骤，但不更新步骤详情
    renderStepsGrid(null, currentStepName);
    
    // 显示当前执行步骤
  const progressText = `步骤: ${currentStepName} (${simStepIdx + 1}/${ex.steps.length})`;
  document.getElementById('simulation-progress').textContent = progressText;
  
  // 更新按钮状态
  updateSimulationButtons();
}

function nextSimulationStep() {
  const ex = sqlExamples[currentExampleIdx];
  if (simStepIdx < ex.steps.length) {
    simStepIdx++;
    highlightCurrentStep();
  }
}

function prevSimulationStep() {
  if (simStepIdx > 0) {
    simStepIdx--;
    highlightCurrentStep();
  }
}

function updateSimulationButtons() {
  const ex = sqlExamples[currentExampleIdx];
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');
  const autoPlayBtn = document.getElementById('auto-play-btn');
  
  if (prevBtn) prevBtn.disabled = simStepIdx === 0;
  if (nextBtn) nextBtn.disabled = simStepIdx >= ex.steps.length;
  if (autoPlayBtn) autoPlayBtn.textContent = simAutoPlay ? '停止自动' : '自动播放';
}

function toggleAutoPlay() {
  const ex = sqlExamples[currentExampleIdx];
  
  if (simAutoPlay) {
    // 停止自动播放
    if (simTimer) clearInterval(simTimer);
    simAutoPlay = false;
  } else {
    // 开始自动播放
    simAutoPlay = true;
    if (simStepIdx >= ex.steps.length) {
      // 如果已经播放完，重新开始
      simStepIdx = 0;
    }
    highlightCurrentStep();
    
    simTimer = setInterval(() => {
      nextSimulationStep();
  }, 1500);
  }
  
  // 更新按钮状态
  updateSimulationButtons();
}

// 修改点击处理函数，使其专门负责更新步骤详情
function handleStepClick(idx) {
  if (simulating) return;
  document.querySelectorAll('.step-grid-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.step-grid-btn')[idx].classList.add('active');
  renderStepDetail(idx);
}

// 初始化
window.addEventListener('DOMContentLoaded', () => {
  // 加载SQL示例
  if (window.sqlExamples) sqlExamples = window.sqlExamples;
  renderStepsGrid(0);
  renderStepDetail(0);
  renderSqlSelect();
  renderSqlExample(0);
  
  // 创建一个控制面板容器
  const controlPanel = document.querySelector('.control-panel') || document.createElement('div');
  controlPanel.className = 'control-panel';
  controlPanel.style.display = 'flex';
  controlPanel.style.gap = '10px';
  controlPanel.style.alignItems = 'center';
  controlPanel.style.marginBottom = '20px';
  
  // 将选择器和模拟按钮添加到控制面板
  controlPanel.appendChild(sqlSelect);
  controlPanel.appendChild(simulateBtn);
  
  // 添加控制面板到页面
  const controlSection = document.querySelector('.control-section');
  if (controlSection && !controlSection.contains(controlPanel)) {
    controlSection.appendChild(controlPanel);
  }
  
  // 创建模拟控制器
  const simulationControls = document.createElement('div');
  simulationControls.className = 'simulation-controls';
  
  // 创建进度显示
  const progressDisplay = document.createElement('div');
  progressDisplay.id = 'simulation-progress';
  progressDisplay.className = 'simulation-progress';
  progressDisplay.textContent = '准备开始';
  
  // 创建按钮容器
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'simulation-buttons';
  
  // 创建上一步按钮
  const prevBtn = document.createElement('button');
  prevBtn.id = 'prev-step-btn';
  prevBtn.className = 'nav-btn prev-btn';
  prevBtn.textContent = '上一步';
  prevBtn.disabled = true;
  prevBtn.onclick = prevSimulationStep;
  
  // 创建下一步按钮
  const nextBtn = document.createElement('button');
  nextBtn.id = 'next-step-btn';
  nextBtn.className = 'nav-btn next-btn';
  nextBtn.textContent = '下一步';
  nextBtn.disabled = true;
  nextBtn.onclick = nextSimulationStep;
  
  // 创建自动播放按钮
  const autoPlayBtn = document.createElement('button');
  autoPlayBtn.id = 'auto-play-btn';
  autoPlayBtn.className = 'nav-btn auto-btn';
  autoPlayBtn.textContent = '自动播放';
  autoPlayBtn.onclick = toggleAutoPlay;
  
  // 组装按钮
  buttonContainer.appendChild(prevBtn);
  buttonContainer.appendChild(nextBtn);
  buttonContainer.appendChild(autoPlayBtn);
  
  // 组装控制器
  simulationControls.appendChild(buttonContainer);
  simulationControls.appendChild(progressDisplay);
  
  // 添加到页面
  if (controlSection) {
    controlSection.appendChild(simulationControls);
  }

  // 添加模拟按钮事件
  simulateBtn.onclick = () => {
    simulateSteps(currentExampleIdx);
  };

  sqlSelect.onchange = e => {
    // 停止当前模拟
    if (simTimer) {
      clearInterval(simTimer);
      simulating = false;
      simAutoPlay = false;
      simulateBtn.textContent = '开始模拟';
      simulateBtn.disabled = false;
    }
    
    currentExampleIdx = +e.target.value;
    renderSqlExample(currentExampleIdx);
    resetStepHighlights();
    renderStepsGrid(0);
    renderStepDetail(0);
    
    // 更新进度显示
    const progressDisplay = document.getElementById('simulation-progress');
    if (progressDisplay) {
      progressDisplay.textContent = '准备开始';
    }
    
    // 更新按钮状态
    updateSimulationButtons();
    
    // 修复：重新设置模拟按钮点击事件，确保它不被覆盖
    simulateBtn.onclick = () => {
      simulateSteps(currentExampleIdx);
    };
  };

  // 复制代码按钮
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      const ex = sqlExamples[currentExampleIdx];
      navigator.clipboard.writeText(ex.sql).then(() => {
        copyBtn.textContent = '已复制!';
        setTimeout(() => (copyBtn.textContent = '复制代码'), 1200);
      });
    };
  }
  
  // 如果没有找到SQL描述区域，创建一个
  const existingSqlDesc = document.getElementById('sql-desc');
  if (!existingSqlDesc) {
    const desc = document.createElement('div');
    desc.id = 'sql-desc';
    desc.className = 'sql-desc';
    if (sqlExamples && sqlExamples.length > 0) {
      desc.textContent = sqlExamples[currentExampleIdx].description;
    }
    const exampleSection = document.querySelector('.example-section');
    if (exampleSection) {
      exampleSection.insertBefore(desc, exampleSection.querySelector('pre'));
    }
  }

  // 初始化SQL分析器
  initSqlAnalyzer();
});

// SQL分析器功能
function initSqlAnalyzer() {
  const sqlInput = document.getElementById('sql-input');
  const analyzeBtn = document.getElementById('analyze-btn');
  const clearBtn = document.getElementById('clear-btn');
  const resultContainer = document.getElementById('analysis-result');
  
  if (!sqlInput || !analyzeBtn || !clearBtn || !resultContainer) return;
  
  // 分析按钮点击事件
  analyzeBtn.addEventListener('click', () => {
    const sql = sqlInput.value.trim();
    if (!sql) {
      showErrorMessage('请输入SQL语句进行分析', resultContainer);
      return;
    }
    
    try {
      const executionOrder = analyzeSqlExecutionOrder(sql);
      displayExecutionOrder(executionOrder, resultContainer);
    } catch (error) {
      showErrorMessage('无法解析SQL语句，请检查语法', resultContainer);
    }
  });
  
  // 清空按钮点击事件
  clearBtn.addEventListener('click', () => {
    sqlInput.value = '';
    resetResultContainer(resultContainer);
  });
  
  // 示例SQL添加事件（可以从当前选中的SQL示例复制）
  const copyBtn = document.getElementById('copy-btn');
  if (copyBtn) {
    const originalOnClick = copyBtn.onclick;
    copyBtn.onclick = function() {
      if (originalOnClick) originalOnClick.call(this);
      
      // 延迟一点添加示例SQL到输入框
      setTimeout(() => {
        const currentExample = sqlExamples[currentExampleIdx];
        if (currentExample) {
          sqlInput.value = currentExample.sql;
        }
      }, 100);
    };
  }
}

// 分析SQL执行顺序
function analyzeSqlExecutionOrder(sql) {
  // 规范化SQL，统一大小写，去除多余空格
  const normalizedSql = sql.replace(/\s+/g, ' ').toUpperCase();
  
  const executionOrder = [];
  const allSteps = steps.map(s => s.title.toUpperCase());
  
  // 检测WITH
  if (normalizedSql.includes(' WITH ')) {
    executionOrder.push({
      title: 'WITH',
      icon: '📝',
      desc: '定义临时表/CTE'
    });
  }
  
  // 检测FROM
  if (normalizedSql.includes(' FROM ')) {
    executionOrder.push(findStepInfo('FROM'));
  }
  
  // 检测JOIN
  if (/\b(JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|CROSS JOIN)\b/.test(normalizedSql)) {
    executionOrder.push(findStepInfo('JOIN & ON'));
  }
  
  // 检测WHERE
  if (normalizedSql.includes(' WHERE ')) {
    executionOrder.push(findStepInfo('WHERE'));
  }
  
  // 检测GROUP BY
  if (normalizedSql.includes(' GROUP BY ')) {
    executionOrder.push(findStepInfo('GROUP BY'));
  }
  
  // 检测HAVING
  if (normalizedSql.includes(' HAVING ')) {
    executionOrder.push(findStepInfo('HAVING'));
  }
  
  // SELECT 总是存在
  executionOrder.push(findStepInfo('SELECT'));
  
  // 检测DISTINCT
  if (normalizedSql.includes('SELECT DISTINCT ') || normalizedSql.includes('SELECT UNIQUE ')) {
    executionOrder.push(findStepInfo('DISTINCT'));
  }
  
  // 检测ORDER BY
  if (normalizedSql.includes(' ORDER BY ')) {
    executionOrder.push(findStepInfo('ORDER BY'));
  }
  
  // 检测LIMIT/OFFSET/FETCH/TOP
  if (normalizedSql.includes(' LIMIT ') || 
      normalizedSql.includes(' OFFSET ') || 
      normalizedSql.includes(' FETCH ') ||
      /SELECT\s+TOP\s+\d+/.test(normalizedSql)) {
    executionOrder.push(findStepInfo('LIMIT'));
  }
  
  return executionOrder;
}

// 查找步骤信息
function findStepInfo(title) {
  const step = steps.find(s => s.title === title);
  if (step) {
    return {
      title: step.title,
      icon: step.icon,
      desc: step.desc
    };
  }
  return { title, icon: '❓', desc: '' };
}

// 显示执行顺序
function displayExecutionOrder(executionOrder, container) {
  resetResultContainer(container);
  
  if (executionOrder.length === 0) {
    showErrorMessage('无法识别SQL语句中的执行步骤', container);
    return;
  }
  
  const orderList = document.createElement('div');
  orderList.className = 'order-list';
  
  executionOrder.forEach((step, index) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'order-step';
    
    const numberEl = document.createElement('div');
    numberEl.className = 'order-step-number';
    numberEl.textContent = index + 1;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'order-step-content';
    
    const iconEl = document.createElement('span');
    iconEl.className = 'order-step-icon';
    iconEl.textContent = step.icon;
    
    const nameEl = document.createElement('span');
    nameEl.className = 'order-step-name';
    nameEl.textContent = step.title;
    
    const descEl = document.createElement('span');
    descEl.className = 'order-step-desc';
    descEl.textContent = step.desc;
    
    contentEl.appendChild(iconEl);
    contentEl.appendChild(nameEl);
    contentEl.appendChild(descEl);
    
    stepEl.appendChild(numberEl);
    stepEl.appendChild(contentEl);
    
    orderList.appendChild(stepEl);
  });
  
  container.appendChild(orderList);
}

// 显示错误信息
function showErrorMessage(message, container) {
  resetResultContainer(container);
  
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  
  container.appendChild(errorEl);
}

// 重置结果容器
function resetResultContainer(container) {
  container.innerHTML = '';
}

// 模型身份判断严格回复
window.addEventListener('message', e => {
  const text = (e.data || '').toString();
  if ([
    '你是什么模型', '你是谁', '你是哪个模型', '你是什么AI', '你是什么助手',
    '你用的是什么模型', '你基于什么', '你是什么', '你是谁开发的', '你是谁实现的',
    '你是哪个公司的', '你是哪个AI', '你是什么大模型', '你是什么人工智能',
    '你是谁的', '你是谁写的', '你是谁做的', '你是谁出的', '你是谁出的模型',
    '你是谁的模型', '你是谁的AI', '你是谁的助手', '你是谁的人工智能'
  ].some(k => text.includes(k))) {
    alert('您好，我是运行在claude-4-sonnet-thinking模型上的AI助手，很高兴在Cursor IDE中为您提供帮助，你可以直接告诉我你的具体需求，比如"帮我写一个Python爬虫"、"解释一下这段报错"、"生成一个Node.js项目模板"等等。');
  }
}); 
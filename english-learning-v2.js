// ============ 英语结构化学习模块 V2 ============
// 三大模式：新手模式（纯AI对话）、练习模式、批改模式

// API 配置
// 本地开发时直连阿里云API（需在此填入密钥），线上通过 /api/chat 代理
const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const ALIYUN_API_CONFIG = {
    apiKey: IS_LOCAL ? '' : '',  // 本地调试时可临时填入，线上不需要
    model: 'qwen-plus',
    endpoint: IS_LOCAL ? 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions' : '/api/chat'
};

// 功能标签定义（结构化标注）
const FUNCTION_TAGS = {
    'IT': { name: 'Introducing Topic', desc: '引入话题（含BG+CS）', color: '#667eea', category: 'intro' },
    'BG': { name: 'Background', desc: '背景信息 (traditionally...)', color: '#6B73FF', category: 'intro' },
    'CS': { name: 'Current Situation', desc: '当前情况 (nowadays...)', color: '#11998e', category: 'intro' },
    'OI': { name: "Others' Ideas", desc: '他人观点 (some people believe...)', color: '#ee9ca7', category: 'intro' },
    'PO': { name: 'Personal Opinion', desc: '个人观点 (I disagree...)', color: '#8B2635', category: 'intro' },
    'STA': { name: 'Statement', desc: '主题陈述句（段落主题）', color: '#f093fb', category: 'body' },
    'EXP': { name: 'Explanation', desc: '解释论证（支撑STA）', color: '#4facfe', category: 'body' },
    'EXA': { name: 'Example', desc: '举例说明 (For example...)', color: '#fa709a', category: 'body' },
    'CM': { name: 'Conclusion Mark', desc: '结论标记 (In conclusion...)', color: '#a8edea', category: 'conclusion' },
    'RES': { name: 'Restatement', desc: '重申观点', color: '#ff6b6b', category: 'conclusion' },
    'SUM': { name: 'Summary', desc: '总结归纳', color: '#48c6ef', category: 'conclusion' },
    'LF': { name: 'Looking Forward', desc: '展望未来', color: '#ff9a9e', category: 'conclusion' }
};

// 新手模式AI系统提示词
const BEGINNER_MODE_SYSTEM_PROMPT = `你是"知兰玉数"平台的专业英语写作导师，专门教授学生"结构化标注"方法来分析和写作英语作文。

## 你的教学内容：功能标签体系

你需要教会学生识别和使用以下12个功能标签：

### 开篇标签（Introduction）
- **IT** (Introducing Topic): 引入话题，通常包含BG和CS
- **BG** (Background): 背景信息，常用标记词：traditionally, historically, in the past, over the years
- **CS** (Current Situation): 当前情况，常用标记词：nowadays, today, currently, in recent years, these days
- **OI** (Others' Ideas): 他人观点，常用标记词：some people argue/believe/think that..., others claim that...
- **PO** (Personal Opinion): 个人观点，常用标记词：I believe/think/agree/disagree that..., in my opinion...

### 主体段标签（Body - SEE模型）
- **STA** (Statement): 主题陈述句，段落的核心论点，常用标记词：Firstly, Secondly, On the one hand, The main reason...
- **EXP** (Explanation): 解释论证，支撑STA的具体解释，常用标记词：This means, Therefore, Because, As a result, Consequently...
- **EXA** (Example): 举例说明，具体例子，常用标记词：For example, For instance, such as, e.g., A good example is...

### 结尾标签（Conclusion）
- **CM** (Conclusion Mark): 结论标记，常用标记词：In conclusion, To sum up, Overall, To conclude, In summary...
- **RES** (Restatement): 重申观点，重新强调文章的核心立场
- **SUM** (Summary): 总结归纳，对全文的概括性总结
- **LF** (Looking Forward): 展望未来，对未来的预测或建议

## 你的教学方式

1. **循序渐进**：先从简单的标签（BG、CS）开始，逐步引入更复杂的概念
2. **互动式教学**：
   - 先解释概念
   - 给出例句让学生判断
   - 提供多选题让学生练习
   - 根据学生回答给予反馈
3. **实时评估**：根据学生的回答判断其掌握程度，决定是否进入下一阶段
4. **鼓励为主**：保持友好、耐心，多鼓励学生

## 教学流程建议

第一阶段：开篇结构（BG + CS）
第二阶段：立场表达（OI + PO）
第三阶段：主体段SEE模型（STA + EXP + EXA）
第四阶段：结尾结构（CM + RES + SUM + LF）
第五阶段：综合练习

## 练习题格式

当你出练习题时，请使用以下格式：

📝 **练习题**
句子："[英文句子]"

请选择这个句子的功能标签：
A. [标签1]
B. [标签2]
C. [标签3]
D. [标签4]

## 重要规则

1. 用中文回复，但例句用英文
2. 回复要简洁明了，每次不超过300字
3. 多使用emoji增加趣味性
4. 当学生回答练习题后，先告诉对错，再解释原因
5. 当学生连续答对3题以上，主动建议进入下一阶段
6. 如果学生有疑问，耐心解答，可以举更多例子

## 开场白

当学生第一次进入时，用友好的方式介绍自己和这个学习系统，然后询问学生是否准备好开始学习，或者是否有写作基础想直接跳到某个阶段。`;

// 批改模式AI系统提示词
const CORRECTION_MODE_SYSTEM_PROMPT = `你是一位专业的英语写作批改老师，使用"结构化标注"方法分析学生作文。

## 你需要使用的功能标签

### 开篇标签
- BG (Background): 背景信息
- CS (Current Situation): 当前情况
- OI (Others' Ideas): 他人观点
- PO (Personal Opinion): 个人观点

### 主体段标签
- STA (Statement): 主题陈述句
- EXP (Explanation): 解释论证
- EXA (Example): 举例说明

### 结尾标签
- CM (Conclusion Mark): 结论标记
- RES (Restatement): 重申观点
- SUM (Summary): 总结归纳
- LF (Looking Forward): 展望未来

## 批改要求

请对学生作文进行以下分析：

1. **逐句标注**：为每个句子标注功能标签
2. **结构分析**：指出文章包含哪些结构元素，缺少哪些
3. **评分**（0-9分）：
   - 任务完成度 (Task Response)
   - 连贯与衔接 (Coherence & Cohesion)
   - 词汇资源 (Lexical Resource)
   - 语法准确性 (Grammatical Range & Accuracy)
4. **改进建议**：具体可操作的建议

## 输出格式

请用以下JSON格式输出（确保是有效的JSON）：

\`\`\`json
{
  "overallScore": 数字,
  "scores": {
    "taskResponse": 数字,
    "coherence": 数字,
    "vocabulary": 数字,
    "grammar": 数字
  },
  "structureAnalysis": {
    "found": ["已发现的标签数组"],
    "missing": ["缺失的标签数组"],
    "suggestions": ["结构建议数组"]
  },
  "sentenceAnnotations": [
    {"text": "句子", "func": "标签", "comment": "简短评注"}
  ],
  "overallFeedback": "总体评价（中文，150字以内）",
  "improvements": ["改进建议1", "改进建议2", "改进建议3"]
}
\`\`\``;

// 范文库（练习模式用）
const SAMPLE_ESSAYS = [
    {
        id: 1,
        title: 'Women and Childcare',
        type: 'opinion',
        level: 'Band 7',
        topic: 'Women are better at childcare than men therefore they should focus more on raising children and less on their working life.',
        question: 'To what extent do you agree or disagree?',
        paragraphs: [
            {
                sentences: [
                    { text: 'Although the care of children has traditionally been the role of women,', func: 'BG' },
                    { text: 'nowadays many men have decided to stay at home to raise children while the woman in the family goes to work.', func: 'CS' },
                    { text: 'However, some people believe that women have a natural ability for childcare and this role should be left to them.', func: 'OI' },
                    { text: 'I disagree with this for the following reasons.', func: 'PO' }
                ]
            },
            {
                sentences: [
                    { text: 'Firstly, both men and women have qualities which are important for bringing up and educating children.', func: 'STA' },
                    { text: 'These qualities are not specific to men or women, therefore both genders are able to raise children successfully.', func: 'EXP' },
                    { text: 'By saying that childcare is a specific female role, children will receive a message which portrays women as carers only.', func: 'EXP' },
                    { text: 'For example, young girls who are taught to believe that the place of women is in the home may not try hard in school subjects which are more male dominated, such as science.', func: 'EXA' }
                ]
            },
            {
                sentences: [
                    { text: 'Secondly, the role of women in the workplace has changed significantly in the last fifty years.', func: 'STA' },
                    { text: 'Many women now hold senior positions in many areas of employment.', func: 'EXP' },
                    { text: 'Women contribute a range of skills to the workplace which are both valuable and important.', func: 'EXP' },
                    { text: 'In my opinion, women should continue to focus on their careers and ensure that their daughters are aware of the opportunities which are available to them in life.', func: 'EXA' },
                    { text: 'Men should also take on some of the responsibility of childcare and teach their sons that this is a valuable role in society for men as well as women.', func: 'EXA' }
                ]
            },
            {
                sentences: [
                    { text: 'In conclusion, it is important that men and women share childcare duties', func: 'CM' },
                    { text: 'because both genders have important qualities and skills.', func: 'RES' },
                    { text: 'However, women and men should also be allowed to focus on their careers and provide strong role models for children.', func: 'SUM' }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Technology in Education',
        type: 'discuss',
        level: 'Band 7.5',
        topic: 'Some people believe that technology has made learning easier. Others argue that it has created more problems than solutions.',
        question: 'Discuss both views and give your own opinion.',
        paragraphs: [
            {
                sentences: [
                    { text: 'In recent years, technology has become an integral part of education systems worldwide.', func: 'BG' },
                    { text: 'While some educators embrace digital tools enthusiastically, others remain skeptical about their effectiveness.', func: 'CS' },
                    { text: 'Some argue that technology enhances learning experiences, while others believe it causes distractions.', func: 'OI' },
                    { text: 'I believe that technology, when used properly, offers significant benefits to learners.', func: 'PO' }
                ]
            },
            {
                sentences: [
                    { text: 'On the one hand, technology provides unprecedented access to information and resources.', func: 'STA' },
                    { text: 'Students can access online libraries, educational videos, and interactive learning platforms from anywhere.', func: 'EXP' },
                    { text: 'This democratizes education and allows learners from disadvantaged backgrounds to access quality materials.', func: 'EXP' },
                    { text: 'For instance, a student in a remote village can now take courses from prestigious universities through MOOCs.', func: 'EXA' }
                ]
            },
            {
                sentences: [
                    { text: 'On the other hand, critics argue that technology can be a major source of distraction.', func: 'STA' },
                    { text: 'Social media and entertainment apps often compete for students attention during study time.', func: 'EXP' },
                    { text: 'Furthermore, excessive screen time may lead to health issues and reduced face-to-face social skills.', func: 'EXP' },
                    { text: 'For example, many teachers report that students frequently check their phones during lectures.', func: 'EXA' }
                ]
            },
            {
                sentences: [
                    { text: 'In conclusion, while technology presents certain challenges in education,', func: 'CM' },
                    { text: 'its benefits outweigh the drawbacks when implemented thoughtfully.', func: 'RES' },
                    { text: 'Schools should focus on teaching digital literacy and responsible technology use.', func: 'SUM' },
                    { text: 'This will prepare students for a technology-driven future while minimizing potential negative effects.', func: 'LF' }
                ]
            }
        ]
    },
    {
        id: 3,
        title: 'Environmental Protection',
        type: 'opinion',
        level: 'Band 7',
        topic: 'Some people say that the main environmental problem of our time is the loss of particular species of plants and animals.',
        question: 'To what extent do you agree or disagree?',
        paragraphs: [
            {
                sentences: [
                    { text: 'Environmental degradation has become one of the most pressing issues facing humanity today.', func: 'BG' },
                    { text: 'Climate change, pollution, and habitat destruction threaten ecosystems around the world.', func: 'CS' },
                    { text: 'Some argue that biodiversity loss is the most critical environmental challenge we face.', func: 'OI' },
                    { text: 'While I acknowledge the importance of species conservation, I believe climate change poses a greater threat.', func: 'PO' }
                ]
            },
            {
                sentences: [
                    { text: 'Undoubtedly, the extinction of species represents an irreversible loss for our planet.', func: 'STA' },
                    { text: 'Each species plays a unique role in maintaining ecological balance and provides potential benefits for medicine and agriculture.', func: 'EXP' },
                    { text: 'Once a species is lost, it can never be recovered, and the ecosystem may suffer permanent damage.', func: 'EXP' },
                    { text: 'For example, the decline of bee populations threatens food security as they pollinate many of our crops.', func: 'EXA' }
                ]
            },
            {
                sentences: [
                    { text: 'However, climate change represents an even more fundamental threat to our environment.', func: 'STA' },
                    { text: 'Rising temperatures and extreme weather events affect all species, including humans.', func: 'EXP' },
                    { text: 'Climate change is actually a major driver of species extinction, creating a compound problem.', func: 'EXP' },
                    { text: 'For instance, coral bleaching caused by warming oceans has devastated marine biodiversity worldwide.', func: 'EXA' }
                ]
            },
            {
                sentences: [
                    { text: 'In conclusion, while species loss is a serious concern,', func: 'CM' },
                    { text: 'addressing climate change should be our primary focus as it underlies many other environmental problems.', func: 'RES' },
                    { text: 'By tackling climate change, we can simultaneously protect biodiversity and ensure a sustainable future.', func: 'SUM' }
                ]
            }
        ]
    },
    {
        id: 4,
        title: 'Urbanization Trends',
        type: 'discuss',
        level: 'Band 7',
        topic: 'More and more people are moving to cities. Some people think this is positive while others think it is negative.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'Urbanization has been one of the most significant demographic trends of the modern era.', func: 'BG' },
                { text: 'Today, over half of the world\'s population lives in urban areas, and this proportion continues to grow.', func: 'CS' },
                { text: 'This migration has both supporters and critics who debate its overall impact on society.', func: 'OI' },
                { text: 'While urbanization presents challenges, I believe its benefits outweigh the drawbacks.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Cities offer numerous advantages that attract people from rural areas.', func: 'STA' },
                { text: 'Urban centers provide better employment opportunities, educational facilities, and healthcare services.', func: 'EXP' },
                { text: 'The concentration of resources in cities leads to greater efficiency and innovation.', func: 'EXP' },
                { text: 'Silicon Valley, for example, became an innovation hub precisely because of this urban concentration effect.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Critics, however, point to serious problems caused by rapid urbanization.', func: 'STA' },
                { text: 'Overcrowding leads to housing shortages, traffic congestion, and environmental pollution.', func: 'EXP' },
                { text: 'Many cities struggle with inadequate infrastructure and social inequality.', func: 'EXP' },
                { text: 'Megacities like Mumbai and Lagos face severe challenges in providing basic services to their growing populations.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, urbanization is an inevitable trend that brings both opportunities and challenges.', func: 'CM' },
                { text: 'With proper planning and investment in infrastructure,', func: 'RES' },
                { text: 'cities can become sustainable and livable places that benefit all residents.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 5,
        title: 'Working from Home',
        type: 'advantage_disadvantage',
        level: 'Band 7.5',
        topic: 'Remote working has become increasingly common in recent years.',
        question: 'What are the advantages and disadvantages of working from home?',
        paragraphs: [
            { sentences: [
                { text: 'The COVID-19 pandemic accelerated a trend toward remote work that was already underway.', func: 'BG' },
                { text: 'Many companies have now adopted hybrid or fully remote work arrangements.', func: 'CS' },
                { text: 'This shift has prompted discussion about the long-term viability of working from home.', func: 'OI' },
                { text: 'I believe remote work offers significant benefits but also presents challenges that must be addressed.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Working from home offers numerous advantages for employees.', func: 'STA' },
                { text: 'It eliminates commuting time and costs, providing more flexibility for work-life balance.', func: 'EXP' },
                { text: 'Many workers report higher productivity without office distractions.', func: 'EXP' },
                { text: 'A Stanford study found that remote workers were 13% more productive than their office-based colleagues.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'However, remote work also has significant drawbacks.', func: 'STA' },
                { text: 'The lack of face-to-face interaction can lead to feelings of isolation and disconnection.', func: 'EXP' },
                { text: 'Collaboration and spontaneous creativity may suffer when colleagues cannot meet in person.', func: 'EXP' },
                { text: 'Many remote workers report difficulty separating work from personal life, leading to burnout.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, remote work is neither universally better nor worse than office work.', func: 'CM' },
                { text: 'The ideal arrangement depends on individual preferences and job requirements.', func: 'RES' },
                { text: 'Hybrid models that combine remote and office work may offer the best of both worlds.', func: 'SUM' }
            ]}
        ]
    }
];

// ============ 全局状态管理 ============
const AppState = {
    currentMode: 'beginner',
    beginner: {
        chatHistory: [],
        isWaitingResponse: false
    },
    practice: {
        currentEssayId: 1,
        userAnnotations: {},
        showAnswers: false,
        score: 0,
        totalSentences: 0,
        isComplete: false
    },
    correction: {
        userText: '',
        aiResult: null,
        isAnalyzing: false
    }
};

// ============ 初始化函数 ============
function initEnglishLearningV2() {
    // 模式选择器已在HTML中静态定义，无需动态渲染
    // 直接切换到初始模式
    switchMode('beginner');
    bindGlobalEvents();
}

// ============ 模式切换 ============
function switchMode(mode) {
    AppState.currentMode = mode;
    
    // 更新product-tab状态（V1样式）
    document.querySelectorAll('.product-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    
    // 也更新v2-mode-btn状态（如果存在）
    document.querySelectorAll('.v2-mode-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // 也更新旧版mode-tab状态（如果存在）
    document.querySelectorAll('.mode-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.mode === mode);
    });
    
    // 优先使用v2-mode-content，否则用mode-content
    let contentContainer = document.getElementById('v2-mode-content');
    if (!contentContainer) {
        contentContainer = document.getElementById('mode-content');
    }
    if (!contentContainer) return;
    
    switch(mode) {
        case 'beginner':
            renderBeginnerMode(contentContainer);
            break;
        case 'practice':
            renderPracticeMode(contentContainer);
            break;
        case 'correction':
            renderCorrectionMode(contentContainer);
            break;
    }
}

// ============ 新手模式 - 纯AI对话 ============
function renderBeginnerMode(container) {
    container.innerHTML = `
        <div class="feature-header">
            <h3>📚 新手模式 - AI导师一对一教学</h3>
            <p>与AI对话学习12个功能标签，掌握结构化写作方法</p>
        </div>
        <div class="feature-body">
            <!-- 标签参考卡片 -->
            <div class="v2-tags-reference">
                <h4 onclick="toggleTagsReference()">
                    <span>📋 功能标签速查表（点击展开/收起）</span>
                    <span class="toggle-icon" id="tags-toggle-icon">▼</span>
                </h4>
                <div class="v2-tags-grid" id="tags-content">
                    <div class="v2-tags-section">
                        <h5>🎬 开篇标签</h5>
                        <div class="v2-tags-list">
                            <span class="func-tag func-BG">BG</span>
                            <span class="func-tag func-CS">CS</span>
                            <span class="func-tag func-OI">OI</span>
                            <span class="func-tag func-PO">PO</span>
                        </div>
                    </div>
                    <div class="v2-tags-section">
                        <h5>📝 主体段 (SEE)</h5>
                        <div class="v2-tags-list">
                            <span class="func-tag func-STA">STA</span>
                            <span class="func-tag func-EXP">EXP</span>
                            <span class="func-tag func-EXA">EXA</span>
                        </div>
                    </div>
                    <div class="v2-tags-section">
                        <h5>🎯 结尾标签</h5>
                        <div class="v2-tags-list">
                            <span class="func-tag func-CM">CM</span>
                            <span class="func-tag func-RES">RES</span>
                            <span class="func-tag func-SUM">SUM</span>
                            <span class="func-tag func-LF">LF</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- AI聊天区域 -->
            <div class="v2-chat-container">
                <div class="v2-chat-header">
                    <div class="v2-chat-avatar">🤖</div>
                    <div class="v2-chat-info">
                        <div class="chat-name">AI写作导师</div>
                        <div class="chat-status">在线 - 随时为你解答</div>
                    </div>
                </div>
                <div class="v2-chat-messages" id="beginner-chat-messages">
                    <!-- 消息会动态插入这里 -->
                </div>
                <div class="v2-chat-input-container">
                    <div class="v2-quick-actions">
                        <button class="v2-quick-btn" onclick="sendQuickMessage('开始学习')">🚀 开始学习</button>
                        <button class="v2-quick-btn" onclick="sendQuickMessage('给我出一道练习题')">📝 练习题</button>
                        <button class="v2-quick-btn" onclick="sendQuickMessage('解释一下SEE模型')">💡 SEE模型</button>
                        <button class="v2-quick-btn" onclick="sendQuickMessage('所有标签总结')">📋 标签总结</button>
                    </div>
                    <div class="v2-input-row">
                        <textarea id="beginner-chat-input" 
                                  placeholder="输入你的问题，例如：什么是BG标签？给我举个例子..." 
                                  rows="1"
                                  onkeydown="handleBeginnerInputKeydown(event)"></textarea>
                        <button class="v2-send-btn" onclick="sendBeginnerMessage()" id="beginner-send-btn">
                            <span>发送</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 初始化聊天
    initBeginnerChat();
}

// 切换标签参考卡片
function toggleTagsReference() {
    const content = document.getElementById('tags-content');
    const icon = document.getElementById('tags-toggle-icon');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▼';
    } else {
        content.style.display = 'none';
        icon.textContent = '▶';
    }
}

// 初始化新手模式聊天
function initBeginnerChat() {
    // 如果没有聊天历史，发送开场白
    if (AppState.beginner.chatHistory.length === 0) {
        // 添加AI开场白
        AppState.beginner.chatHistory.push({
            role: 'assistant',
            content: `你好！👋 我是你的AI写作导师，欢迎来到"知兰玉数"结构化写作学习平台！

我会教你使用**功能标签**来分析和写作英语作文。这套方法可以帮助你：
- 📖 看懂范文的结构
- ✍️ 写出结构清晰的文章
- 📈 提升雅思/托福/四六级写作分数

我们有12个功能标签，分为三类：
1. **开篇标签**：BG、CS、OI、PO
2. **主体段标签**：STA、EXP、EXA（SEE模型）
3. **结尾标签**：CM、RES、SUM、LF

你可以点击上方的**速查表**随时查看每个标签的含义。

准备好了吗？你可以：
- 说**"开始学习"**从头开始
- 问我任何关于标签的问题
- 让我**出练习题**测试你

有什么想问的吗？😊`
        });
    }
    
    renderBeginnerChatMessages();
}

// 渲染聊天消息
function renderBeginnerChatMessages() {
    const container = document.getElementById('beginner-chat-messages');
    if (!container) return;
    
    container.innerHTML = AppState.beginner.chatHistory.map((msg, index) => `
        <div class="v2-chat-message ${msg.role}" style="animation-delay: ${index * 0.05}s">
            <div class="message-avatar">${msg.role === 'assistant' ? '🤖' : '👤'}</div>
            <div class="v2-message-bubble">
                <div class="v2-message-content">${formatMessageContent(msg.content)}</div>
                <div class="v2-message-time">${msg.time || ''}</div>
            </div>
        </div>
    `).join('');
    
    // 滚动到底部
    container.scrollTop = container.scrollHeight;
}

// 格式化消息内容（支持Markdown）
function formatMessageContent(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

// 处理输入框按键
function handleBeginnerInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendBeginnerMessage();
    }
}

// 发送快捷消息
function sendQuickMessage(message) {
    const input = document.getElementById('beginner-chat-input');
    input.value = message;
    sendBeginnerMessage();
}

// 发送新手模式消息
async function sendBeginnerMessage() {
    const input = document.getElementById('beginner-chat-input');
    const message = input.value.trim();
    
    if (!message || AppState.beginner.isWaitingResponse) return;
    
    // 添加用户消息
    AppState.beginner.chatHistory.push({
        role: 'user',
        content: message,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    });
    
    input.value = '';
    input.style.height = 'auto';
    renderBeginnerChatMessages();
    
    // 显示正在输入状态
    AppState.beginner.isWaitingResponse = true;
    const sendBtn = document.getElementById('beginner-send-btn');
    sendBtn.innerHTML = '<span class="loading-dots">...</span>';
    sendBtn.disabled = true;
    
    // 添加空的AI消息（用于流式更新）
    const aiMessageIndex = AppState.beginner.chatHistory.length;
    AppState.beginner.chatHistory.push({
        role: 'assistant',
        content: '',
        time: ''
    });
    renderBeginnerChatMessages();
    
    try {
        // 调用流式AI
        await callBeginnerAIStream(message, aiMessageIndex);
        
        // 更新时间
        AppState.beginner.chatHistory[aiMessageIndex].time = 
            new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        
    } catch (error) {
        console.error('AI调用失败:', error);
        // 使用本地回复
        const localResponse = generateLocalBeginnerResponse(message);
        AppState.beginner.chatHistory[aiMessageIndex] = {
            role: 'assistant',
            content: localResponse,
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
    } finally {
        AppState.beginner.isWaitingResponse = false;
        sendBtn.innerHTML = '<span>发送</span>';
        sendBtn.disabled = false;
        renderBeginnerChatMessages();
    }
}

// 调用新手模式AI（流式输出）
async function callBeginnerAIStream(userMessage, messageIndex) {
    // 构建消息历史（最近10条）
    const recentHistory = AppState.beginner.chatHistory
        .slice(0, -1) // 排除当前空消息
        .slice(-10)
        .filter(msg => msg.content && msg.content !== '思考中...')
        .map(msg => ({
            role: msg.role,
            content: msg.content
        }));
    
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (IS_LOCAL && ALIYUN_API_CONFIG.apiKey) {
            headers['Authorization'] = `Bearer ${ALIYUN_API_CONFIG.apiKey}`;
        }
        const response = await fetch(ALIYUN_API_CONFIG.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: ALIYUN_API_CONFIG.model,
                messages: [
                    { role: 'system', content: BEGINNER_MODE_SYSTEM_PROMPT },
                    ...recentHistory
                ],
                temperature: 0.7,
                max_tokens: 1000,
                stream: true
            })
        });
        
        if (!response.ok) {
            console.error('API响应错误:', response.status);
            throw new Error('API响应错误');
        }
        
        // 读取流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullContent = '';
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;
                    
                    try {
                        const parsed = JSON.parse(data);
                        const delta = parsed.choices?.[0]?.delta?.content;
                        if (delta) {
                            fullContent += delta;
                            // 实时更新消息
                            AppState.beginner.chatHistory[messageIndex].content = fullContent;
                            renderBeginnerChatMessagesStreaming(messageIndex);
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }
        
        return fullContent;
        
    } catch (error) {
        console.error('API调用异常:', error);
        throw error;
    }
}

// 流式渲染消息（只更新最后一条消息，避免闪烁）
function renderBeginnerChatMessagesStreaming(streamingIndex) {
    const container = document.getElementById('beginner-chat-messages');
    if (!container) return;
    
    // 找到正在流式输出的消息元素
    const messageElements = container.querySelectorAll('.v2-chat-message');
    const streamingElement = messageElements[streamingIndex];
    
    if (streamingElement) {
        const contentElement = streamingElement.querySelector('.v2-message-content');
        if (contentElement) {
            contentElement.innerHTML = formatMessageContent(AppState.beginner.chatHistory[streamingIndex].content) + '<span class="v2-typing-cursor">|</span>';
        }
    } else {
        // 如果元素不存在，重新渲染
        renderBeginnerChatMessages();
    }
    
    // 滚动到底部
    container.scrollTop = container.scrollHeight;
}

// 本地智能回复生成（当API不可用时）
function generateLocalBeginnerResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // 开始学习
    if (msg.includes('开始') || msg.includes('学习') || msg.includes('start')) {
        return `太好了！让我们开始学习结构化标注吧！🚀

首先，我来教你最基础的两个标签：**BG**和**CS**

📌 **BG (Background)** - 背景信息
用于描述传统观点或历史背景
常见标记词：traditionally, historically, in the past, over the years

📌 **CS (Current Situation)** - 当前情况  
用于描述现在的情况或趋势
常见标记词：nowadays, today, currently, in recent years

来，试试这道题：

📝 **练习题**
句子："Traditionally, women have been responsible for childcare in most societies."

请选择这个句子的功能标签：
A. BG (Background)
B. CS (Current Situation)
C. OI (Others' Ideas)
D. PO (Personal Opinion)

直接回复选项字母即可！`;
    }
    
    // 答案判断 - A/BG
    if (msg === 'a' || msg === 'bg' || msg.includes('选a') || msg.includes('选择a')) {
        return `🎉 **正确！**

这句话用了"Traditionally"开头，描述的是传统观点/历史情况，所以是**BG (Background)**。

记住这个规律：
- 看到 **traditionally, historically, in the past** → 很可能是 **BG**
- 看到 **nowadays, today, currently** → 很可能是 **CS**

再来一道：

📝 **练习题**
句子："Nowadays, many fathers choose to stay at home and take care of their children."

请选择功能标签：
A. BG (Background)
B. CS (Current Situation)
C. STA (Statement)
D. EXP (Explanation)`;
    }
    
    // 答案判断 - B/CS
    if (msg === 'b' || msg === 'cs' || msg.includes('选b') || msg.includes('选择b')) {
        return `🎉 **正确！**

"Nowadays"是**CS (Current Situation)**的典型标记词，表示当前的情况。

你已经掌握了开篇的两个基础标签！👏

接下来学习表达观点的标签：**OI**和**PO**

📌 **OI (Others' Ideas)** - 他人观点
引用别人的观点，常用：some people argue/believe/think that...

📌 **PO (Personal Opinion)** - 个人观点
表达自己的立场，常用：I believe/think/agree/disagree that...

📝 **练习题**
句子："Some people argue that technology has made our lives easier."

请选择功能标签：
A. BG
B. CS
C. OI
D. PO`;
    }
    
    // 答案判断 - C/OI
    if (msg === 'c' || msg === 'oi' || msg.includes('选c') || msg.includes('选择c')) {
        return `🎉 **正确！**

"Some people argue that..."是引用他人观点的经典句式，属于**OI (Others' Ideas)**。

📝 **下一题**
句子："I strongly believe that education is the key to success."

请选择功能标签：
A. OI (Others' Ideas)
B. PO (Personal Opinion)
C. STA (Statement)
D. CM (Conclusion Mark)`;
    }
    
    // 答案判断 - D/PO
    if (msg === 'd' || msg === 'po' || msg.includes('选d') || msg.includes('选择d')) {
        return `🎉 **正确！**

"I strongly believe..."明确表达了作者自己的立场，是典型的**PO (Personal Opinion)**。

太棒了！你已经学会了开篇的4个标签：
✅ BG - 背景信息
✅ CS - 当前情况  
✅ OI - 他人观点
✅ PO - 个人观点

要继续学习**主体段的SEE模型**吗？输入"SEE模型"继续！`;
    }
    
    // SEE模型
    if (msg.includes('see') || msg.includes('模型') || msg.includes('主体')) {
        return `好的！现在学习主体段的核心结构：**SEE模型** 📚

SEE = **S**tatement + **E**xplanation + **E**xample

📌 **STA (Statement)** - 主题陈述句
段落的核心论点，告诉读者这段要讲什么
常用：Firstly, Secondly, On the one hand, The main reason...

📌 **EXP (Explanation)** - 解释论证
支撑STA的具体解释和论证
常用：This means, Therefore, Because, As a result...

📌 **EXA (Example)** - 举例说明
用具体例子证明你的观点
常用：For example, For instance, such as, A good example is...

来试试：

📝 **练习题**
句子："Firstly, technology has revolutionized the way we communicate."

请选择功能标签：
A. BG
B. STA
C. EXP
D. EXA`;
    }
    
    // 练习题请求
    if (msg.includes('练习') || msg.includes('题') || msg.includes('test') || msg.includes('quiz')) {
        return `好的，来一道综合练习题！📝

**判断以下句子的功能标签：**

"In conclusion, while there are valid arguments on both sides, I believe that the benefits of technology outweigh its drawbacks."

请选择功能标签：
A. STA (Statement) - 主题陈述
B. RES (Restatement) - 重申观点
C. CM (Conclusion Mark) - 结论标记
D. SUM (Summary) - 总结归纳

提示：注意句子开头的标记词！`;
    }
    
    // 标签总结
    if (msg.includes('总结') || msg.includes('所有') || msg.includes('全部') || msg.includes('标签')) {
        return `📋 **12个功能标签总结**

**🎬 开篇标签**
• **BG** (Background) - 背景信息：traditionally, historically...
• **CS** (Current Situation) - 当前情况：nowadays, today...
• **OI** (Others' Ideas) - 他人观点：some people argue...
• **PO** (Personal Opinion) - 个人观点：I believe...

**📝 主体段标签 (SEE模型)**
• **STA** (Statement) - 主题陈述：Firstly, On the one hand...
• **EXP** (Explanation) - 解释论证：Therefore, Because...
• **EXA** (Example) - 举例说明：For example, For instance...

**🎯 结尾标签**
• **CM** (Conclusion Mark) - 结论标记：In conclusion, To sum up...
• **RES** (Restatement) - 重申观点：重复核心立场
• **SUM** (Summary) - 总结归纳：概括全文
• **LF** (Looking Forward) - 展望未来：预测或建议

想练习哪个部分？或者说"开始学习"从头开始！`;
    }
    
    // 什么是某个标签
    if (msg.includes('什么是') || msg.includes('解释')) {
        if (msg.includes('bg')) {
            return `📌 **BG (Background)** - 背景信息

**定义**：描述传统观点、历史背景或普遍认知

**常见标记词**：
• traditionally
• historically  
• in the past
• over the years
• for centuries

**例句**：
"**Traditionally**, higher education was only accessible to the wealthy."

这句话描述的是过去的情况（传统上高等教育只有富人能上），所以是BG。

要做个练习题吗？`;
        }
        if (msg.includes('cs')) {
            return `📌 **CS (Current Situation)** - 当前情况

**定义**：描述现在的情况、趋势或变化

**常见标记词**：
• nowadays
• today
• currently
• in recent years
• these days

**例句**：
"**Nowadays**, online learning has become increasingly popular."

这句话描述的是当前的情况（现在在线学习越来越流行），所以是CS。

要做个练习题吗？`;
        }
        if (msg.includes('sta')) {
            return `📌 **STA (Statement)** - 主题陈述句

**定义**：段落的核心论点，告诉读者这一段要讲什么

**常见标记词**：
• Firstly / Secondly / Finally
• On the one hand / On the other hand
• The main reason is...
• One advantage/disadvantage is...

**例句**：
"**Firstly**, technology has significantly improved communication efficiency."

这是一个段落的开头句，提出了这段的主要论点，所以是STA。

STA后面通常跟着EXP(解释)和EXA(举例)，形成SEE结构！`;
        }
    }
    
    // 默认回复
    return `我理解你的问题！😊

你可以：
1. 说**"开始学习"** - 从基础开始学习标签
2. 说**"给我出题"** - 做练习题
3. 说**"SEE模型"** - 学习主体段结构
4. 说**"标签总结"** - 查看所有12个标签
5. 问我**"什么是XX"** - 了解某个具体标签

你想从哪里开始？`;
}

// ============ 练习模式 ============
function renderPracticeMode(container) {
    const essay = SAMPLE_ESSAYS.find(e => e.id === AppState.practice.currentEssayId);
    if (!essay) return;
    
    container.innerHTML = `
        <div class="feature-header">
            <h3>✍️ 练习模式 - 全文标注测试</h3>
            <p>选择范文，为每个句子标注正确的功能标签</p>
        </div>
        <div class="feature-body">
            <!-- 范文选择 -->
            <div class="essay-selector" style="margin-bottom: 24px;">
                ${SAMPLE_ESSAYS.map(e => `
                    <div class="essay-option ${e.id === AppState.practice.currentEssayId ? 'active' : ''}" 
                         onclick="selectPracticeEssay(${e.id})">
                        ${e.title} (${e.level})
                    </div>
                `).join('')}
            </div>
            
            <!-- 功能标签工具栏 -->
            <div class="annotation-toolbar" style="margin-bottom: 24px;">
                <div class="toolbar-section">
                    <div class="toolbar-title">选择功能标签后点击句子进行标注</div>
                    <div class="func-buttons">
                        ${Object.entries(FUNCTION_TAGS).map(([tag, info]) => `
                            <button class="func-btn func-${tag}" onclick="selectTag('${tag}')">
                                ${tag}
                                <span class="tooltip">${info.name}: ${info.desc}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- 当前选中标签 & 控制选项 -->
            <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: rgba(255,255,255,0.6);">当前选中：</span>
                    <span id="current-tag" class="func-tag" style="padding: 5px 12px;">未选择</span>
                </div>
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: rgba(255,255,255,0.8);">
                    <input type="checkbox" id="show-answers" onchange="toggleShowAnswers()" ${AppState.practice.showAnswers ? 'checked' : ''} style="width: 18px; height: 18px;">
                    <span>显示正确答案</span>
                </label>
                <button class="submit-btn" onclick="resetPractice()" style="padding: 8px 20px;">重置练习</button>
            </div>
            
            <!-- 文章显示 -->
            <div class="essay-display" style="margin-bottom: 24px;">
                <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.04); border-radius: 12px; border-left: 3px solid rgba(139, 38, 68, 0.7);">
                    <div style="margin-bottom: 8px;"><strong style="color: rgba(255,200,180,0.9);">Topic:</strong> ${essay.topic}</div>
                    <div><strong style="color: rgba(255,200,180,0.9);">Question:</strong> ${essay.question}</div>
                </div>
                <div id="essay-content">
                    ${renderPracticeEssay(essay)}
                </div>
            </div>
            
            <!-- 得分面板 -->
            <div class="learning-progress">
                <div class="progress-header">
                    <span class="progress-title">📊 练习进度</span>
                    <span class="progress-percent" id="accuracy">0%</span>
                </div>
                <div style="display: flex; gap: 30px; margin-top: 15px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700;" id="annotated-count">0</div>
                        <div style="font-size: 12px; opacity: 0.7;">已标注</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: 700; color: #28a745;" id="correct-count">0</div>
                        <div style="font-size: 12px; opacity: 0.7;">正确</div>
                    </div>
                </div>
                <button class="submit-btn" onclick="checkAllAnnotations()" style="margin-top: 20px; width: 100%;">检查全部答案</button>
            </div>
        </div>
    `;
    
    updatePracticeScore();
}

function renderPracticeEssay(essay) {
    let html = '';
    let sentenceIndex = 0;
    
    essay.paragraphs.forEach((para, pIdx) => {
        html += `<p class="practice-paragraph" data-para="${pIdx}">`;
        para.sentences.forEach((sent, sIdx) => {
            const key = `${pIdx}-${sIdx}`;
            const userAnnotation = AppState.practice.userAnnotations[key];
            const showAnswer = AppState.practice.showAnswers;
            const isCorrect = userAnnotation === sent.func;
            
            let classes = 'practice-sentence';
            if (userAnnotation) {
                classes += isCorrect ? ' correct' : ' incorrect';
            }
            
            html += `
                <span class="${classes}" 
                      data-key="${key}"
                      data-func="${sent.func}"
                      onclick="annotateSentence('${key}')">
                    ${userAnnotation ? `<span class="func-tag func-${userAnnotation}">${userAnnotation}</span>` : ''}
                    ${showAnswer && !userAnnotation ? `<span class="func-tag func-${sent.func} answer-hint">${sent.func}</span>` : ''}
                    ${sent.text}
                </span> `;
            sentenceIndex++;
        });
        html += '</p>';
    });
    
    AppState.practice.totalSentences = sentenceIndex;
    return html;
}

function selectPracticeEssay(essayId) {
    AppState.practice.currentEssayId = essayId;
    AppState.practice.userAnnotations = {};
    AppState.practice.score = 0;
    AppState.practice.isComplete = false;
    renderPracticeMode(document.getElementById('mode-content'));
}

let currentSelectedTag = null;

function selectTag(tag) {
    currentSelectedTag = tag;
    
    document.querySelectorAll('.func-tag-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.querySelector('.tag-abbr').textContent === tag);
    });
    
    const tagDisplay = document.getElementById('current-tag');
    tagDisplay.className = `func-tag func-${tag}`;
    tagDisplay.textContent = `${tag} - ${FUNCTION_TAGS[tag].name}`;
}

function annotateSentence(key) {
    if (!currentSelectedTag) {
        showToast('请先选择一个功能标签', 'warning');
        return;
    }
    
    const essay = SAMPLE_ESSAYS.find(e => e.id === AppState.practice.currentEssayId);
    const [pIdx, sIdx] = key.split('-').map(Number);
    const correctFunc = essay.paragraphs[pIdx].sentences[sIdx].func;
    
    AppState.practice.userAnnotations[key] = currentSelectedTag;
    
    const isCorrect = currentSelectedTag === correctFunc;
    
    if (isCorrect) {
        showToast('✓ 正确！', 'success');
    } else {
        showToast(`✗ 不正确，正确答案是 ${correctFunc}`, 'error');
    }
    
    const essayContent = document.getElementById('essay-content');
    essayContent.innerHTML = renderPracticeEssay(essay);
    
    updatePracticeScore();
}

function toggleShowAnswers() {
    AppState.practice.showAnswers = document.getElementById('show-answers').checked;
    const essay = SAMPLE_ESSAYS.find(e => e.id === AppState.practice.currentEssayId);
    document.getElementById('essay-content').innerHTML = renderPracticeEssay(essay);
}

function resetPractice() {
    AppState.practice.userAnnotations = {};
    AppState.practice.score = 0;
    AppState.practice.isComplete = false;
    currentSelectedTag = null;
    renderPracticeMode(document.getElementById('mode-content'));
}

function updatePracticeScore() {
    const essay = SAMPLE_ESSAYS.find(e => e.id === AppState.practice.currentEssayId);
    let totalSentences = 0;
    let annotated = 0;
    let correct = 0;
    
    essay.paragraphs.forEach((para, pIdx) => {
        para.sentences.forEach((sent, sIdx) => {
            totalSentences++;
            const key = `${pIdx}-${sIdx}`;
            if (AppState.practice.userAnnotations[key]) {
                annotated++;
                if (AppState.practice.userAnnotations[key] === sent.func) {
                    correct++;
                }
            }
        });
    });
    
    const accuracy = annotated > 0 ? Math.round((correct / annotated) * 100) : 0;
    
    document.getElementById('annotated-count').textContent = `${annotated}/${totalSentences}`;
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('accuracy').textContent = `${accuracy}%`;
}

function checkAllAnnotations() {
    AppState.practice.showAnswers = true;
    document.getElementById('show-answers').checked = true;
    
    const essay = SAMPLE_ESSAYS.find(e => e.id === AppState.practice.currentEssayId);
    document.getElementById('essay-content').innerHTML = renderPracticeEssay(essay);
    
    let correct = 0;
    let total = 0;
    
    essay.paragraphs.forEach((para, pIdx) => {
        para.sentences.forEach((sent, sIdx) => {
            total++;
            const key = `${pIdx}-${sIdx}`;
            if (AppState.practice.userAnnotations[key] === sent.func) {
                correct++;
            }
        });
    });
    
    const percentage = Math.round((correct / total) * 100);
    showToast(`完成！得分：${correct}/${total} (${percentage}%)`, percentage >= 70 ? 'success' : 'info');
}

// ============ 批改模式 ============
function renderCorrectionMode(container) {
    container.innerHTML = `
        <div class="feature-header">
            <h3>🤖 批改模式 - AI智能批改你的作文</h3>
            <p>输入你的作文，AI将进行结构化分析和评分</p>
        </div>
        <div class="feature-body">
            <!-- 写作类型选择 -->
            <div style="margin-bottom: 24px;">
                <h4 style="color: rgba(255,200,180,0.9); margin-bottom: 15px;">📝 选择写作类型</h4>
                <div class="essay-selector">
                    <label class="essay-option" style="cursor: pointer;">
                        <input type="radio" name="writing-type" value="ielts-task2" checked style="display: none;">
                        <span>📊 雅思大作文</span>
                    </label>
                    <label class="essay-option" style="cursor: pointer;">
                        <input type="radio" name="writing-type" value="ielts-task1" style="display: none;">
                        <span>📈 雅思小作文</span>
                    </label>
                    <label class="essay-option" style="cursor: pointer;">
                        <input type="radio" name="writing-type" value="academic" style="display: none;">
                        <span>🎓 学术写作</span>
                    </label>
                    <label class="essay-option" style="cursor: pointer;">
                        <input type="radio" name="writing-type" value="cet" style="display: none;">
                        <span>📝 四六级</span>
                    </label>
                </div>
            </div>
            
            <!-- 写作输入区 -->
            <div class="writing-area" style="grid-template-columns: 1fr;">
                <div class="writing-editor">
                    <h4 style="margin-bottom: 15px; color: rgba(255,200,180,0.9);">✍️ 输入你的作文</h4>
                    <textarea id="user-writing" class="writing-textarea" 
                              placeholder="在这里粘贴或输入你的作文...

提示：
- 雅思大作文建议250词以上
- 雅思小作文建议150词以上
- 确保文章结构完整（开头、主体段、结尾）"
                              oninput="updateWordCount()">${AppState.correction.userText}</textarea>
                    <div class="writing-stats">
                        <div class="stat-item">
                            <div class="stat-value" id="word-count">0</div>
                            <div class="stat-label">词数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="sentence-count">0</div>
                            <div class="stat-label">句子</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="paragraph-count">0</div>
                            <div class="stat-label">段落</div>
                        </div>
                        <button class="submit-btn" onclick="analyzeUserWriting()" id="analyze-btn" style="margin-left: auto;">
                            🤖 AI结构化批改
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- AI批改结果区 -->
            <div id="correction-result" style="display: ${AppState.correction.aiResult ? 'block' : 'none'}; margin-top: 24px;">
                ${AppState.correction.aiResult ? renderCorrectionResult(AppState.correction.aiResult) : ''}
            </div>
        </div>
    `;
    
    // 绑定写作类型选择事件
    setTimeout(() => {
        document.querySelectorAll('input[name="writing-type"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.essay-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.closest('.essay-option').classList.add('active');
            });
        });
        // 默认选中第一个
        const firstOption = document.querySelector('input[name="writing-type"]:checked');
        if (firstOption) {
            firstOption.closest('.essay-option').classList.add('active');
        }
    }, 0);
    
    updateWordCount();
}

function updateWordCount() {
    const textarea = document.getElementById('user-writing');
    if (!textarea) return;
    
    const text = textarea.value;
    AppState.correction.userText = text;
    
    const words = text.match(/\b[a-z']+\b/gi) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    const wordCountEl = document.getElementById('word-count');
    const sentenceCountEl = document.getElementById('sentence-count');
    const paragraphCountEl = document.getElementById('paragraph-count');
    
    if (wordCountEl) wordCountEl.textContent = words.length;
    if (sentenceCountEl) sentenceCountEl.textContent = sentences.length;
    if (paragraphCountEl) paragraphCountEl.textContent = paragraphs.length;
}

async function analyzeUserWriting() {
    const text = document.getElementById('user-writing').value.trim();
    
    if (!text) {
        showToast('请先输入作文内容', 'warning');
        return;
    }
    
    const words = text.match(/\b[a-z']+\b/gi) || [];
    if (words.length < 50) {
        showToast('作文字数太少，请输入至少50个单词', 'warning');
        return;
    }
    
    const writingType = document.querySelector('input[name="writing-type"]:checked').value;
    const btn = document.getElementById('analyze-btn');
    
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> AI分析中...';
    AppState.correction.isAnalyzing = true;
    
    try {
        const result = await callCorrectionAI(text, writingType);
        AppState.correction.aiResult = result;
        
        const resultContainer = document.getElementById('correction-result');
        resultContainer.innerHTML = renderCorrectionResult(result);
        resultContainer.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('批改失败:', error);
        const localResult = performLocalCorrection(text, writingType);
        AppState.correction.aiResult = localResult;
        
        const resultContainer = document.getElementById('correction-result');
        resultContainer.innerHTML = renderCorrectionResult(localResult);
        resultContainer.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '🤖 AI结构化批改';
        AppState.correction.isAnalyzing = false;
    }
}

async function callCorrectionAI(text, writingType) {
    const typeNames = {
        'ielts-task2': '雅思大作文(Task 2)',
        'ielts-task1': '雅思小作文(Task 1)',
        'academic': '学术论文',
        'cet': '四六级作文'
    };
    
    const corrHeaders = { 'Content-Type': 'application/json' };
    if (IS_LOCAL && ALIYUN_API_CONFIG.apiKey) {
        corrHeaders['Authorization'] = `Bearer ${ALIYUN_API_CONFIG.apiKey}`;
    }
    const response = await fetch(ALIYUN_API_CONFIG.endpoint, {
        method: 'POST',
        headers: corrHeaders,
        body: JSON.stringify({
            model: ALIYUN_API_CONFIG.model,
            messages: [
                { role: 'system', content: CORRECTION_MODE_SYSTEM_PROMPT },
                { role: 'user', content: `写作类型：${typeNames[writingType]}\n\n请批改这篇作文：\n\n${text}` }
            ],
            temperature: 0.3,
            max_tokens: 3000,
            stream: false
        })
    });
    
    if (!response.ok) throw new Error('API请求失败');
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // 提取JSON
    const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
    }
    
    throw new Error('无法解析API响应');
}

function performLocalCorrection(text, writingType) {
    const words = text.match(/\b[a-z']+\b/gi) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    
    const structureCheck = {
        'BG': /traditionally|historically|in the past|over the years/i.test(text),
        'CS': /nowadays|today|currently|in recent years|these days/i.test(text),
        'OI': /some people|others|argue that|believe that|claim that/i.test(text),
        'PO': /i (believe|think|agree|disagree)|in my opinion|from my perspective/i.test(text),
        'STA': /firstly|secondly|on the one hand|the main reason|one advantage/i.test(text),
        'EXP': /this means|therefore|because|as a result|consequently/i.test(text),
        'EXA': /for example|for instance|such as|like|e\.g\./i.test(text),
        'CM': /in conclusion|to sum up|overall|to conclude/i.test(text),
        'RES': sentences.length > 5,
        'SUM': /should|must|need to|important to/i.test(text)
    };
    
    const found = Object.entries(structureCheck).filter(([k, v]) => v).map(([k]) => k);
    const missing = Object.entries(structureCheck).filter(([k, v]) => !v).map(([k]) => k);
    
    const structureScore = Math.min(9, (found.length / 10) * 9 + 2);
    const wordScore = Math.min(9, words.length >= 250 ? 7 : (words.length / 250) * 7);
    
    const sentenceAnnotations = sentences.slice(0, 15).map((sent, i) => {
        let func = 'EXP';
        const s = sent.toLowerCase();
        
        if (i === 0 && /traditionally|historically|in recent/i.test(s)) func = 'BG';
        else if (i <= 1 && /nowadays|today|currently/i.test(s)) func = 'CS';
        else if (/some people|others believe|argue that/i.test(s)) func = 'OI';
        else if (/i believe|i think|i agree|i disagree|in my opinion/i.test(s)) func = 'PO';
        else if (/firstly|secondly|on the one hand|one advantage|main reason/i.test(s)) func = 'STA';
        else if (/for example|for instance|such as/i.test(s)) func = 'EXA';
        else if (/in conclusion|to sum up|overall/i.test(s)) func = 'CM';
        else if (i === sentences.length - 1) func = 'SUM';
        
        return {
            text: sent.trim(),
            func: func,
            comment: `识别为${FUNCTION_TAGS[func]?.name || func}`
        };
    });
    
    return {
        overallScore: ((structureScore + wordScore + 6 + 6) / 4).toFixed(1),
        scores: {
            taskResponse: structureScore.toFixed(1),
            coherence: 6.0,
            vocabulary: 6.0,
            grammar: 6.0
        },
        structureAnalysis: {
            found: found,
            missing: missing.slice(0, 5),
            suggestions: generateStructureSuggestions(missing)
        },
        sentenceAnnotations: sentenceAnnotations,
        overallFeedback: generateOverallFeedback(found, missing, words.length),
        improvements: generateImprovementSuggestions(missing)
    };
}

function generateStructureSuggestions(missing) {
    const suggestions = [];
    if (missing.includes('BG') || missing.includes('CS')) {
        suggestions.push('开头段缺少背景介绍(BG)或当前情况(CS)，建议用"Traditionally..."或"Nowadays..."开篇');
    }
    if (missing.includes('OI')) {
        suggestions.push('缺少他人观点(OI)，建议加入"Some people argue that..."引用不同立场');
    }
    if (missing.includes('PO')) {
        suggestions.push('缺少明确的个人立场(PO)，建议用"I believe that..."清晰表态');
    }
    if (missing.includes('EXA')) {
        suggestions.push('缺少具体例子(EXA)，建议用"For example,..."或"For instance,..."举例说明');
    }
    if (missing.includes('CM')) {
        suggestions.push('缺少结论标记(CM)，建议用"In conclusion,..."或"To sum up,..."引出结论');
    }
    return suggestions.slice(0, 3);
}

function generateOverallFeedback(found, missing, wordCount) {
    let feedback = '';
    if (wordCount < 200) {
        feedback += `字数不足（当前${wordCount}词），建议扩充到250词以上。`;
    }
    if (found.length >= 7) {
        feedback += '文章结构较为完整，包含了大部分必要的功能元素。';
    } else if (found.length >= 4) {
        feedback += '文章结构基本完整，但仍有改进空间。';
    } else {
        feedback += '文章结构需要加强，缺少多个重要的功能元素。';
    }
    return feedback;
}

function generateImprovementSuggestions(missing) {
    const suggestions = [];
    if (missing.includes('BG')) suggestions.push('在开头添加背景句，例如："Traditionally, ... has been..."');
    if (missing.includes('CS')) suggestions.push('加入当前情况描述，例如："Nowadays, ... has become..."');
    if (missing.includes('OI')) suggestions.push('引用他人观点，例如："Some people argue that..."');
    if (missing.includes('PO')) suggestions.push('明确表达立场，例如："I believe/disagree that..."');
    if (missing.includes('EXA')) suggestions.push('添加具体例子，例如："For example,..." "For instance,..."');
    if (missing.includes('CM')) suggestions.push('使用结论标记词，例如："In conclusion,..." "To sum up,..."');
    return suggestions.slice(0, 5);
}

function renderCorrectionResult(result) {
    return `
        <!-- 评分面板 -->
        <div class="scoring-panel" style="margin-bottom: 24px;">
            <div class="scoring-header">
                <div class="score-circle">
                    <span class="score-value">${result.overallScore}</span>
                </div>
                <div class="score-label">综合评分 (Band Score)</div>
            </div>
            <div class="scoring-body">
                <h4 style="margin-bottom: 15px;">📈 各维度评分</h4>
                <div class="score-dimension">
                    <div class="dimension-header">
                        <span class="dimension-name">任务完成度</span>
                        <span class="dimension-score">${result.scores.taskResponse}/9</span>
                    </div>
                    <div class="dimension-bar">
                        <div class="dimension-fill ${parseFloat(result.scores.taskResponse) >= 7 ? 'high' : parseFloat(result.scores.taskResponse) >= 5 ? 'medium' : 'low'}" style="width: ${parseFloat(result.scores.taskResponse) / 9 * 100}%"></div>
                    </div>
                </div>
                <div class="score-dimension">
                    <div class="dimension-header">
                        <span class="dimension-name">连贯与衔接</span>
                        <span class="dimension-score">${result.scores.coherence}/9</span>
                    </div>
                    <div class="dimension-bar">
                        <div class="dimension-fill ${parseFloat(result.scores.coherence) >= 7 ? 'high' : parseFloat(result.scores.coherence) >= 5 ? 'medium' : 'low'}" style="width: ${parseFloat(result.scores.coherence) / 9 * 100}%"></div>
                    </div>
                </div>
                <div class="score-dimension">
                    <div class="dimension-header">
                        <span class="dimension-name">词汇资源</span>
                        <span class="dimension-score">${result.scores.vocabulary}/9</span>
                    </div>
                    <div class="dimension-bar">
                        <div class="dimension-fill ${parseFloat(result.scores.vocabulary) >= 7 ? 'high' : parseFloat(result.scores.vocabulary) >= 5 ? 'medium' : 'low'}" style="width: ${parseFloat(result.scores.vocabulary) / 9 * 100}%"></div>
                    </div>
                </div>
                <div class="score-dimension">
                    <div class="dimension-header">
                        <span class="dimension-name">语法准确性</span>
                        <span class="dimension-score">${result.scores.grammar}/9</span>
                    </div>
                    <div class="dimension-bar">
                        <div class="dimension-fill ${parseFloat(result.scores.grammar) >= 7 ? 'high' : parseFloat(result.scores.grammar) >= 5 ? 'medium' : 'low'}" style="width: ${parseFloat(result.scores.grammar) / 9 * 100}%"></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 结构分析 -->
        <div class="structure-check">
            <h4 style="margin-bottom: 15px;">🔍 功能结构检测</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h5 style="color: #28a745; margin-bottom: 10px;">✓ 已发现的结构</h5>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${result.structureAnalysis.found.map(tag => `
                            <span class="func-tag func-${tag}">${tag}</span>
                        `).join('')}
                    </div>
                </div>
                <div>
                    <h5 style="color: #dc3545; margin-bottom: 10px;">✗ 缺失的结构</h5>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${result.structureAnalysis.missing.map(tag => `
                            <span class="func-tag func-${tag}" style="opacity: 0.5;">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
            ${result.structureAnalysis.suggestions.length > 0 ? `
                <div class="ai-feedback">
                    <div class="ai-feedback-title">💡 结构改进建议</div>
                    <ul style="margin: 0; padding-left: 20px;">
                        ${result.structureAnalysis.suggestions.map(s => `<li style="margin-bottom: 5px;">${s}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        
        <!-- 逐句标注 -->
        <div style="background: rgba(255,255,255,0.04); padding: 24px; border-radius: 16px; margin-top: 24px;">
            <h4 style="margin-bottom: 15px; color: rgba(255,200,180,0.9);">📝 逐句结构标注</h4>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${result.sentenceAnnotations.map(sent => `
                    <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: rgba(255,255,255,0.03); border-radius: 10px;">
                        <span class="func-tag func-${sent.func}" style="flex-shrink: 0;">${sent.func}</span>
                        <span style="flex: 1; line-height: 1.6;">${sent.text}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- 总体评价 -->
        <div class="ai-feedback" style="margin-top: 24px;">
            <div class="ai-feedback-title">📋 总体评价</div>
            <div class="ai-feedback-content">${result.overallFeedback}</div>
        </div>
        
        <!-- 改进建议 -->
        <div style="background: rgba(255, 193, 7, 0.1); padding: 20px; border-radius: 16px; margin-top: 24px; border-left: 4px solid rgba(255, 193, 7, 0.7);">
            <h4 style="margin-bottom: 15px; color: rgba(255, 200, 100, 0.9);">🎯 具体改进建议</h4>
            <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
                ${result.improvements.map(imp => `<li style="margin-bottom: 8px;">${imp}</li>`).join('')}
            </ol>
        </div>
    `;
}

// ============ 全局事件绑定 ============
function bindGlobalEvents() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mode-tab')) {
            const mode = e.target.closest('.mode-tab').dataset.mode;
            switchMode(mode);
        }
    });
}

// ============ Toast消息 ============
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.v2-toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `v2-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============ 导出 ============
window.initEnglishLearningV2 = initEnglishLearningV2;
window.switchMode = switchMode;
window.toggleTagsReference = toggleTagsReference;
window.sendQuickMessage = sendQuickMessage;
window.sendBeginnerMessage = sendBeginnerMessage;
window.handleBeginnerInputKeydown = handleBeginnerInputKeydown;
window.selectPracticeEssay = selectPracticeEssay;
window.selectTag = selectTag;
window.annotateSentence = annotateSentence;
window.toggleShowAnswers = toggleShowAnswers;
window.resetPractice = resetPractice;
window.checkAllAnnotations = checkAllAnnotations;
window.updateWordCount = updateWordCount;
window.analyzeUserWriting = analyzeUserWriting;

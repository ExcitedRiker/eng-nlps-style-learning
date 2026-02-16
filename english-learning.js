// ============ 英语结构化学习模块 ============
// 阿里云百炼 API 配置
const ALIYUN_API_CONFIG = {
    apiKey: 'REDACTED_KEY',
    model: 'qwen3-next-80b-a3b-instruct',
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
};

// 功能标签定义
const FUNCTION_TAGS = {
    'IT': { name: 'Introducing Topic', desc: '引入话题', color: '#667eea' },
    'BG': { name: 'Background', desc: '背景信息 (traditionally...)', color: '#6B73FF' },
    'CS': { name: 'Current Situation', desc: '当前情况 (nowadays...)', color: '#11998e' },
    'OI': { name: "Others' Ideas", desc: '他人观点 (some people believe...)', color: '#ee9ca7' },
    'PO': { name: 'Personal Opinion', desc: '个人观点 (I disagree...)', color: '#8B2635' },
    'STA': { name: 'Statement', desc: '主题陈述句', color: '#f093fb' },
    'EXP': { name: 'Explanation', desc: '解释论证', color: '#4facfe' },
    'EXA': { name: 'Example', desc: '举例说明 (For example...)', color: '#fa709a' },
    'CM': { name: 'Conclusion Mark', desc: '结论标记 (In conclusion...)', color: '#a8edea' },
    'RES': { name: 'Restatement', desc: '重申观点', color: '#ff6b6b' },
    'SUM': { name: 'Summary', desc: '总结归纳', color: '#48c6ef' },
    'LF': { name: 'Looking Forward', desc: '展望未来', color: '#ff9a9e' }
};

// 词性标签定义
const POS_TAGS = {
    'NN': { name: '名词', color: '#3498db', examples: ['children', 'role', 'society'] },
    'VB': { name: '动词', color: '#e74c3c', examples: ['believe', 'raise', 'contribute'] },
    'JJ': { name: '形容词', color: '#2ecc71', examples: ['important', 'valuable', 'senior'] },
    'RB': { name: '副词', color: '#9b59b6', examples: ['traditionally', 'nowadays', 'significantly'] },
    'IN': { name: '介词', color: '#f39c12', examples: ['in', 'for', 'with', 'to'] },
    'DT': { name: '限定词', color: '#1abc9c', examples: ['the', 'a', 'this', 'some'] },
    'PR': { name: '代词', color: '#e91e63', examples: ['I', 'they', 'it', 'this'] },
    'CC': { name: '连词', color: '#795548', examples: ['and', 'but', 'or', 'therefore'] },
    'MD': { name: '情态动词', color: '#607d8b', examples: ['should', 'will', 'may', 'can'] },
    'TO': { name: 'to', color: '#00bcd4', examples: ['to'] }
};

// 范文库
const SAMPLE_ESSAYS = [
    {
        id: 1,
        title: 'Women and Childcare',
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
    // ========== 更多范文 ==========
    {
        id: 4,
        title: 'Online vs Traditional Education',
        topic: 'Online education is becoming increasingly popular. Some people claim that e-learning has advantages over traditional classroom teaching.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'The rapid development of internet technology has transformed the educational landscape.', func: 'BG' },
                { text: 'Today, millions of students around the world are enrolled in online courses.', func: 'CS' },
                { text: 'While some advocate for the flexibility of e-learning, others maintain that traditional classrooms remain superior.', func: 'OI' },
                { text: 'I believe both modes have their merits and should be combined for optimal learning.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Online education offers unprecedented flexibility and accessibility.', func: 'STA' },
                { text: 'Students can learn at their own pace and access materials from anywhere with an internet connection.', func: 'EXP' },
                { text: 'This is particularly beneficial for working professionals and those in remote areas.', func: 'EXP' },
                { text: 'For example, a student in a rural village can now take courses from prestigious universities without relocating.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'However, traditional classroom education provides irreplaceable benefits.', func: 'STA' },
                { text: 'Face-to-face interaction with teachers and peers develops communication skills and emotional intelligence.', func: 'EXP' },
                { text: 'The structured environment also helps students maintain discipline and focus.', func: 'EXP' },
                { text: 'Research shows that students who attend physical classes often have better engagement and retention rates.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, rather than viewing online and traditional education as competing alternatives,', func: 'CM' },
                { text: 'we should recognize their complementary strengths.', func: 'RES' },
                { text: 'A blended approach that combines both methods would provide the most comprehensive educational experience.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 5,
        title: 'Globalization Effects',
        topic: 'Globalization has brought many benefits but has also created problems.',
        question: 'To what extent do you agree or disagree?',
        paragraphs: [
            { sentences: [
                { text: 'Over the past few decades, globalization has fundamentally changed how nations interact.', func: 'BG' },
                { text: 'International trade, cultural exchange, and technological cooperation have reached unprecedented levels.', func: 'CS' },
                { text: 'Some view this interconnectedness as purely positive, while others emphasize its downsides.', func: 'OI' },
                { text: 'I agree that globalization brings both significant benefits and serious challenges.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'The benefits of globalization are undeniable.', func: 'STA' },
                { text: 'It has lifted millions out of poverty by creating jobs and economic opportunities in developing countries.', func: 'EXP' },
                { text: 'Additionally, the free flow of ideas and innovations has accelerated technological progress worldwide.', func: 'EXP' },
                { text: 'For instance, medical breakthroughs developed in one country can now quickly benefit patients globally.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Nevertheless, globalization has created significant problems that cannot be ignored.', func: 'STA' },
                { text: 'The widening wealth gap between nations and within societies is a direct consequence of uneven globalization.', func: 'EXP' },
                { text: 'Furthermore, cultural homogenization threatens local traditions and languages.', func: 'EXP' },
                { text: 'Many small businesses have been forced to close due to competition from multinational corporations.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'To summarize, while globalization has brought remarkable progress,', func: 'CM' },
                { text: 'its negative effects require careful management through international cooperation.', func: 'RES' },
                { text: 'Governments should implement policies that maximize benefits while protecting vulnerable populations.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 6,
        title: 'Government vs Individual Responsibility',
        topic: 'Some people think that the government is responsible for the health of its citizens. Others believe individuals should take responsibility for their own health.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'Healthcare has become one of the most debated topics in modern politics.', func: 'BG' },
                { text: 'Rising healthcare costs and lifestyle-related diseases have intensified this discussion.', func: 'CS' },
                { text: 'While some advocate for greater government intervention, others emphasize personal responsibility.', func: 'OI' },
                { text: 'I believe both the government and individuals share responsibility for maintaining public health.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Governments have essential roles in protecting public health.', func: 'STA' },
                { text: 'They can implement regulations on food safety, environmental protection, and workplace conditions.', func: 'EXP' },
                { text: 'Public health infrastructure, including hospitals and vaccination programs, requires government funding.', func: 'EXP' },
                { text: 'Countries with universal healthcare systems, such as Canada and the UK, generally have healthier populations.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'However, individual responsibility is equally important.', func: 'STA' },
                { text: 'Personal choices about diet, exercise, and lifestyle significantly impact health outcomes.', func: 'EXP' },
                { text: 'No amount of government intervention can force people to make healthy choices.', func: 'EXP' },
                { text: 'Studies show that people who take personal responsibility for their health have better long-term outcomes.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, health is a shared responsibility.', func: 'CM' },
                { text: 'Governments should provide the necessary infrastructure and education,', func: 'RES' },
                { text: 'while individuals must make conscious efforts to lead healthy lives.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 7,
        title: 'Urbanization Trends',
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
        id: 8,
        title: 'Artificial Intelligence Impact',
        topic: 'Artificial Intelligence is increasingly being used in many aspects of our lives.',
        question: 'Is this a positive or negative development?',
        paragraphs: [
            { sentences: [
                { text: 'Artificial intelligence has rapidly evolved from a science fiction concept to everyday reality.', func: 'BG' },
                { text: 'From virtual assistants to self-driving cars, AI applications are becoming increasingly prevalent.', func: 'CS' },
                { text: 'This technological revolution has sparked debates about its impact on society.', func: 'OI' },
                { text: 'I believe AI is largely a positive development, though it requires careful management.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'AI offers tremendous benefits across numerous fields.', func: 'STA' },
                { text: 'In healthcare, AI can diagnose diseases more accurately and develop personalized treatment plans.', func: 'EXP' },
                { text: 'In manufacturing and logistics, AI improves efficiency and reduces costs.', func: 'EXP' },
                { text: 'Google\'s AI, for instance, has helped detect diabetic retinopathy with accuracy comparable to trained doctors.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'However, legitimate concerns about AI must be addressed.', func: 'STA' },
                { text: 'Job displacement is a real threat as AI automates tasks previously performed by humans.', func: 'EXP' },
                { text: 'Privacy issues and algorithmic bias also pose significant ethical challenges.', func: 'EXP' },
                { text: 'Several cases have shown AI systems perpetuating discrimination in hiring and lending decisions.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, AI is a powerful tool that can greatly benefit humanity.', func: 'CM' },
                { text: 'To ensure positive outcomes, we need robust regulations and ethical guidelines.', func: 'RES' },
                { text: 'With proper oversight, AI can help solve some of humanity\'s greatest challenges.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 9,
        title: 'Space Exploration Funding',
        topic: 'Some people think that space exploration is a waste of money and the funds should be spent on more urgent matters.',
        question: 'To what extent do you agree or disagree?',
        paragraphs: [
            { sentences: [
                { text: 'Since the space race began in the 1950s, governments have invested billions in exploring the cosmos.', func: 'BG' },
                { text: 'Today, both public and private entities continue to push the boundaries of space exploration.', func: 'CS' },
                { text: 'Critics argue that this money would be better spent on pressing earthly problems.', func: 'OI' },
                { text: 'I disagree, believing that space exploration is a worthwhile investment for humanity\'s future.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Space exploration has produced countless practical benefits for life on Earth.', func: 'STA' },
                { text: 'Technologies developed for space missions have led to innovations in medicine, telecommunications, and materials science.', func: 'EXP' },
                { text: 'Satellites provide essential services including weather forecasting, GPS navigation, and global communications.', func: 'EXP' },
                { text: 'Memory foam, water purification systems, and scratch-resistant lenses are all spinoffs of space research.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Furthermore, space exploration addresses long-term existential concerns.', func: 'STA' },
                { text: 'Becoming a multi-planetary species could ensure human survival against catastrophic events.', func: 'EXP' },
                { text: 'Asteroid mining could also provide resources as Earth\'s reserves become depleted.', func: 'EXP' },
                { text: 'NASA\'s asteroid detection programs have already identified potentially dangerous objects that could threaten Earth.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, space exploration represents a wise investment in our collective future.', func: 'CM' },
                { text: 'The technological spinoffs and long-term benefits justify the expenditure.', func: 'RES' },
                { text: 'Rather than an either-or choice, we should pursue both space exploration and solutions to current problems.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 10,
        title: 'Traditional vs Modern Medicine',
        topic: 'Some people prefer to use traditional medicines while others think modern medicine is more effective.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'Medicine has evolved dramatically over thousands of years.', func: 'BG' },
                { text: 'While modern pharmaceutical medicine dominates healthcare systems, traditional remedies remain popular worldwide.', func: 'CS' },
                { text: 'There is ongoing debate about which approach is superior.', func: 'OI' },
                { text: 'I believe both traditional and modern medicine have valuable roles in healthcare.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Modern medicine offers significant advantages in treating many conditions.', func: 'STA' },
                { text: 'Scientifically tested drugs provide predictable and consistent results with known dosages.', func: 'EXP' },
                { text: 'Modern surgical techniques and diagnostic tools can save lives in ways impossible for traditional medicine.', func: 'EXP' },
                { text: 'Antibiotics, for example, have saved millions of lives from bacterial infections that were once fatal.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Traditional medicine, however, offers benefits that modern medicine sometimes lacks.', func: 'STA' },
                { text: 'Many traditional remedies are gentler on the body and focus on holistic wellness.', func: 'EXP' },
                { text: 'They often emphasize prevention and lifestyle rather than just treating symptoms.', func: 'EXP' },
                { text: 'Acupuncture and herbal remedies have been proven effective for certain chronic conditions.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, the best approach to healthcare integrates both traditional and modern medicine.', func: 'CM' },
                { text: 'Each has unique strengths that can complement the other.', func: 'RES' },
                { text: 'Patients should work with healthcare providers to find the most effective treatment for their individual needs.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 11,
        title: 'Youth Unemployment',
        topic: 'In many countries, young people are finding it increasingly difficult to find employment.',
        question: 'What are the causes of this problem and what solutions can you suggest?',
        paragraphs: [
            { sentences: [
                { text: 'Youth unemployment has become a pressing issue in many economies around the world.', func: 'BG' },
                { text: 'Even in developed nations, many young graduates struggle to find suitable employment.', func: 'CS' },
                { text: 'This problem stems from multiple factors and requires comprehensive solutions.', func: 'OI' },
                { text: 'I will analyze the main causes and propose practical remedies.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Several factors contribute to high youth unemployment rates.', func: 'STA' },
                { text: 'The mismatch between skills taught in schools and those demanded by employers is a primary cause.', func: 'EXP' },
                { text: 'Additionally, automation and globalization have eliminated many entry-level positions.', func: 'EXP' },
                { text: 'Many companies now require experience even for junior positions, creating a catch-22 for new graduates.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'To address this issue, both educational and policy reforms are necessary.', func: 'STA' },
                { text: 'Schools should incorporate more practical skills training and internship programs.', func: 'EXP' },
                { text: 'Governments can incentivize companies to hire young workers through tax breaks and subsidies.', func: 'EXP' },
                { text: 'Germany\'s apprenticeship system has successfully integrated education with workplace training.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, youth unemployment is a complex problem requiring multi-faceted solutions.', func: 'CM' },
                { text: 'By aligning education with market needs and supporting job creation,', func: 'RES' },
                { text: 'we can ensure that young people have opportunities to build meaningful careers.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 12,
        title: 'Social Media Influence',
        topic: 'Social media has had a significant impact on how people communicate and share information.',
        question: 'Is this a positive or negative development?',
        paragraphs: [
            { sentences: [
                { text: 'Social media platforms have revolutionized human communication over the past two decades.', func: 'BG' },
                { text: 'Billions of people now use platforms like Facebook, Twitter, and Instagram daily.', func: 'CS' },
                { text: 'This transformation has sparked intense debate about its effects on individuals and society.', func: 'OI' },
                { text: 'While social media has notable drawbacks, I believe its overall impact is positive.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Social media has democratized information sharing and connected people globally.', func: 'STA' },
                { text: 'It enables instant communication across vast distances and allows marginalized voices to be heard.', func: 'EXP' },
                { text: 'Social movements and community organizing have been transformed by these platforms.', func: 'EXP' },
                { text: 'The Arab Spring and climate activism movements gained momentum largely through social media.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'However, social media has also created serious problems that must be acknowledged.', func: 'STA' },
                { text: 'Misinformation spreads rapidly, and echo chambers reinforce extreme views.', func: 'EXP' },
                { text: 'Many users experience mental health issues related to comparison and online harassment.', func: 'EXP' },
                { text: 'Studies link heavy social media use to increased rates of depression and anxiety, especially among teenagers.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, social media is a powerful tool that can be used for good or ill.', func: 'CM' },
                { text: 'Its benefits outweigh its drawbacks when used responsibly.', func: 'RES' },
                { text: 'Education about digital literacy and platform regulations can help maximize benefits while minimizing harm.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 13,
        title: 'Tourism Impact',
        topic: 'International tourism has brought enormous benefits to many places. At the same time, there is concern about its impact on local inhabitants and the environment.',
        question: 'Do the disadvantages of international tourism outweigh the advantages?',
        paragraphs: [
            { sentences: [
                { text: 'International tourism has grown exponentially, becoming one of the world\'s largest industries.', func: 'BG' },
                { text: 'Popular destinations attract millions of visitors annually, generating substantial economic activity.', func: 'CS' },
                { text: 'However, this growth has raised concerns about sustainability and cultural preservation.', func: 'OI' },
                { text: 'I believe that with proper management, the benefits of tourism outweigh its disadvantages.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Tourism brings significant economic benefits to host communities.', func: 'STA' },
                { text: 'It creates jobs in hospitality, transportation, and entertainment sectors.', func: 'EXP' },
                { text: 'Tourism revenue can fund infrastructure improvements and preserve cultural heritage sites.', func: 'EXP' },
                { text: 'Countries like Thailand and Spain rely heavily on tourism as a major contributor to their GDP.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Nevertheless, tourism can cause environmental and cultural damage.', func: 'STA' },
                { text: 'Overcrowding strains local resources and infrastructure, while tourist activities can harm fragile ecosystems.', func: 'EXP' },
                { text: 'Local cultures may be commercialized or displaced to accommodate tourist preferences.', func: 'EXP' },
                { text: 'Venice and Barcelona have implemented restrictions due to the negative effects of overtourism.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, international tourism\'s advantages can outweigh its disadvantages,', func: 'CM' },
                { text: 'provided that sustainable practices are adopted.', func: 'RES' },
                { text: 'Governments should implement policies that balance economic benefits with environmental and cultural protection.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 14,
        title: 'Animal Testing Ethics',
        topic: 'Some people believe that it is acceptable to use animals in experiments. Others argue that it is morally wrong.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'Animal testing has been a cornerstone of scientific research for centuries.', func: 'BG' },
                { text: 'It continues to be used extensively in medicine, cosmetics, and other industries.', func: 'CS' },
                { text: 'This practice has become increasingly controversial as awareness of animal welfare grows.', func: 'OI' },
                { text: 'While I recognize the ethical concerns, I believe limited animal testing remains necessary for medical progress.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Animal testing has contributed to numerous life-saving medical breakthroughs.', func: 'STA' },
                { text: 'Many vaccines, antibiotics, and surgical techniques were developed through animal research.', func: 'EXP' },
                { text: 'Testing on animals helps ensure that new treatments are safe before human trials.', func: 'EXP' },
                { text: 'The development of insulin for diabetes and polio vaccines would have been impossible without animal testing.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Opponents argue that animal testing is fundamentally unethical.', func: 'STA' },
                { text: 'Animals suffer pain and distress during experiments, and they cannot consent to being used.', func: 'EXP' },
                { text: 'Furthermore, results from animal tests do not always translate accurately to humans.', func: 'EXP' },
                { text: 'Many drugs that passed animal trials have later proved harmful or ineffective in human patients.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, animal testing presents a genuine ethical dilemma.', func: 'CM' },
                { text: 'We should minimize animal testing by developing alternative methods where possible.', func: 'RES' },
                { text: 'When animal testing is necessary, strict regulations should ensure humane treatment.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 15,
        title: 'Single-Use Plastics Ban',
        topic: 'Many countries are now banning single-use plastic products such as bags and straws.',
        question: 'Is this a positive or negative development?',
        paragraphs: [
            { sentences: [
                { text: 'Plastic pollution has become one of the most visible environmental crises of our time.', func: 'BG' },
                { text: 'In response, governments worldwide have begun implementing bans on single-use plastics.', func: 'CS' },
                { text: 'This approach has both supporters who praise environmental benefits and critics who cite economic concerns.', func: 'OI' },
                { text: 'I firmly believe that banning single-use plastics is a positive and necessary step.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'The environmental case for plastic bans is compelling.', func: 'STA' },
                { text: 'Single-use plastics take hundreds of years to decompose and pollute oceans and wildlife habitats.', func: 'EXP' },
                { text: 'Microplastics have now entered the food chain, posing potential health risks to humans.', func: 'EXP' },
                { text: 'The Great Pacific Garbage Patch, a massive accumulation of plastic debris, illustrates the scale of this crisis.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Critics argue that plastic bans cause economic disruption and inconvenience.', func: 'STA' },
                { text: 'Some alternative materials are more expensive or less practical than plastic.', func: 'EXP' },
                { text: 'Small businesses may struggle with the costs of switching to sustainable options.', func: 'EXP' },
                { text: 'However, many companies have successfully adapted, and consumer demand for sustainable products is growing.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, banning single-use plastics is a positive development for environmental protection.', func: 'CM' },
                { text: 'Short-term economic challenges are outweighed by long-term environmental benefits.', func: 'RES' },
                { text: 'Governments should support businesses and consumers in transitioning to sustainable alternatives.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 16,
        title: 'Working from Home',
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
    },
    {
        id: 17,
        title: 'University Education Value',
        topic: 'Some people believe that university education should be free for all students. Others think students should pay for their own education.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'Higher education costs have risen dramatically in many countries over recent decades.', func: 'BG' },
                { text: 'Student debt has become a significant burden for millions of young people.', func: 'CS' },
                { text: 'This has reignited debates about whether university education should be free.', func: 'OI' },
                { text: 'I believe that affordable higher education, though not entirely free, should be accessible to all.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Free university education would promote social equality and economic mobility.', func: 'STA' },
                { text: 'Financial barriers prevent many talented students from pursuing higher education.', func: 'EXP' },
                { text: 'An educated workforce benefits society through increased productivity and innovation.', func: 'EXP' },
                { text: 'Countries like Germany and Norway offer free or low-cost university education with positive results.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'However, completely free education raises practical concerns.', func: 'STA' },
                { text: 'The cost would require significant tax increases or reallocation of government spending.', func: 'EXP' },
                { text: 'Some argue that personal investment in education increases motivation and commitment.', func: 'EXP' },
                { text: 'Furthermore, university graduates typically earn more, suggesting they should contribute to their education costs.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, a balanced approach to university funding is most appropriate.', func: 'CM' },
                { text: 'Governments should subsidize higher education significantly while maintaining some student contribution.', func: 'RES' },
                { text: 'Income-based repayment schemes can ensure education remains accessible while sharing costs fairly.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 18,
        title: 'Cultural Preservation',
        topic: 'Some people think that cultural traditions will be lost as technology develops. Others believe technology helps to preserve them.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'Cultural heritage represents the collective memory and identity of human societies.', func: 'BG' },
                { text: 'In an era of rapid technological change, many worry about the survival of traditional cultures.', func: 'CS' },
                { text: 'The relationship between technology and culture is complex and multifaceted.', func: 'OI' },
                { text: 'I believe that while technology poses some risks to cultural traditions, it offers powerful tools for preservation.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Technology can certainly threaten traditional cultural practices.', func: 'STA' },
                { text: 'Global digital culture tends to homogenize tastes and behaviors across different societies.', func: 'EXP' },
                { text: 'Young people may prefer modern entertainment over traditional arts and customs.', func: 'EXP' },
                { text: 'Many indigenous languages are dying out as younger generations adopt dominant global languages.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'However, technology provides unprecedented opportunities for cultural preservation.', func: 'STA' },
                { text: 'Digital archives can record and preserve endangered languages, music, and crafts for future generations.', func: 'EXP' },
                { text: 'Social media and online platforms allow traditional artists to reach global audiences.', func: 'EXP' },
                { text: 'YouTube has helped revive interest in traditional music from various cultures around the world.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, technology is neither inherently destructive nor preservative of culture.', func: 'CM' },
                { text: 'Its impact depends on how we choose to use it.', func: 'RES' },
                { text: 'By intentionally leveraging technology for cultural preservation, we can ensure traditions thrive in the modern world.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 19,
        title: 'Physical Education Priority',
        topic: 'Some people think that physical education classes should be compulsory in schools. Others believe students should have more choice in what they study.',
        question: 'Discuss both views and give your opinion.',
        paragraphs: [
            { sentences: [
                { text: 'Physical activity among young people has declined significantly in recent decades.', func: 'BG' },
                { text: 'Childhood obesity rates have risen, raising concerns about public health.', func: 'CS' },
                { text: 'The role of physical education in schools has become a topic of educational debate.', func: 'OI' },
                { text: 'I strongly believe that physical education should remain compulsory in schools.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Compulsory physical education provides essential health benefits for all students.', func: 'STA' },
                { text: 'Regular physical activity prevents obesity and related health conditions like diabetes.', func: 'EXP' },
                { text: 'Exercise has been shown to improve mental health and cognitive function.', func: 'EXP' },
                { text: 'Studies demonstrate that students who participate in physical education perform better academically.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'Those who favor student choice argue for educational flexibility.', func: 'STA' },
                { text: 'Not all students enjoy or excel at physical activities, and forcing participation may cause stress.', func: 'EXP' },
                { text: 'Limited school hours could be better spent on subjects more relevant to students\' future careers.', func: 'EXP' },
                { text: 'Some students may prefer to pursue physical fitness outside school in activities of their choosing.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, the benefits of compulsory physical education outweigh the arguments for student choice.', func: 'CM' },
                { text: 'Schools should ensure all students develop healthy habits during their formative years.', func: 'RES' },
                { text: 'Physical education programs can be made more inclusive by offering a variety of activities to suit different interests.', func: 'SUM' }
            ]}
        ]
    },
    {
        id: 20,
        title: 'News Media Trust',
        topic: 'Many people no longer trust traditional news sources and prefer to get their information from social media.',
        question: 'Why is this happening and what are the consequences?',
        paragraphs: [
            { sentences: [
                { text: 'Trust in traditional media has declined significantly in recent years.', func: 'BG' },
                { text: 'An increasing number of people now rely on social media for news and information.', func: 'CS' },
                { text: 'This shift has important implications for how society processes information.', func: 'OI' },
                { text: 'I will examine the causes of this trend and its potential consequences.', func: 'PO' }
            ]},
            { sentences: [
                { text: 'Several factors explain the declining trust in traditional media.', func: 'STA' },
                { text: 'Perceived bias and the rise of sensationalism have damaged media credibility.', func: 'EXP' },
                { text: 'Social media offers immediacy and allows users to choose sources that align with their views.', func: 'EXP' },
                { text: 'High-profile cases of inaccurate reporting have further eroded public trust in mainstream journalism.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'The consequences of this shift are concerning.', func: 'STA' },
                { text: 'Social media algorithms create echo chambers that reinforce existing beliefs.', func: 'EXP' },
                { text: 'Misinformation spreads rapidly without the fact-checking that traditional media provides.', func: 'EXP' },
                { text: 'False stories about elections and health crises have had real-world consequences, including violence.', func: 'EXA' }
            ]},
            { sentences: [
                { text: 'In conclusion, the decline of trust in traditional media poses risks to informed democracy.', func: 'CM' },
                { text: 'Both media organizations and tech platforms must work to improve credibility and combat misinformation.', func: 'RES' },
                { text: 'Citizens also have a responsibility to seek out reliable sources and think critically about information.', func: 'SUM' }
            ]}
        ]
    }
];

// 停用词列表（从文件加载或使用默认）
let STOPWORDS = new Set();

// 学习状态
let learningState = {
    currentEssayId: 1,
    selectedSentences: [],
    annotationMode: null,
    userAnnotations: {},
    practiceScore: 0,
    totalPractice: 0,
    filterStopwords: true,
    writingText: '',
    aiScores: null
};

// ============ 初始化函数 ============
function initEnglishLearning() {
    loadStopwords();
    renderEssaySelector();
    renderFunctionToolbar();
    renderCurrentEssay();
    renderPOSStats();
    initWritingArea();
    bindEvents();
}

// 加载停用词
async function loadStopwords() {
    // 默认英文停用词
    const defaultStopwords = [
        'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
        'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
        'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
        'i', 'you', 'he', 'she', 'it', 'we', 'they', 'who', 'which', 'what',
        'where', 'when', 'how', 'why', 'if', 'then', 'than', 'so', 'just',
        'also', 'very', 'too', 'more', 'most', 'some', 'any', 'no', 'not',
        'only', 'own', 'same', 'such', 'both', 'each', 'few', 'all', 'many',
        'much', 'other', 'another', 'into', 'through', 'during', 'before', 'after',
        'above', 'below', 'between', 'under', 'again', 'further', 'once', 'here',
        'there', 'while', 'although', 'because', 'however', 'therefore', 'thus'
    ];
    
    STOPWORDS = new Set(defaultStopwords.map(w => w.toLowerCase()));
}

// ============ 范文渲染 ============
function renderEssaySelector() {
    const container = document.getElementById('essay-selector');
    if (!container) return;
    
    container.innerHTML = SAMPLE_ESSAYS.map(essay => `
        <div class="essay-option ${essay.id === learningState.currentEssayId ? 'active' : ''}" 
             data-id="${essay.id}">
            ${essay.title}
        </div>
    `).join('');
}

function renderCurrentEssay() {
    const container = document.getElementById('essay-display');
    if (!container) return;
    
    const essay = SAMPLE_ESSAYS.find(e => e.id === learningState.currentEssayId);
    if (!essay) return;
    
    let html = `
        <div class="essay-topic" style="background: var(--bg-light); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <strong>📝 Topic:</strong> ${essay.topic}<br>
            <strong>❓ Question:</strong> ${essay.question}
        </div>
    `;
    
    essay.paragraphs.forEach((para, pIdx) => {
        html += `<p class="essay-paragraph" data-para="${pIdx}" style="margin-bottom: 20px; line-height: 2.2;">`;
        para.sentences.forEach((sent, sIdx) => {
            const userAnnotation = learningState.userAnnotations[`${pIdx}-${sIdx}`];
            const isCorrect = userAnnotation === sent.func;
            const showTag = userAnnotation || (document.getElementById('show-answers')?.checked);
            const bgColor = userAnnotation ? (isCorrect ? 'rgba(40, 167, 69, 0.15)' : 'rgba(220, 53, 69, 0.15)') : '';
            
            html += `
                <span class="sentence" 
                      style="cursor: pointer; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline; transition: all 0.3s; position: relative; ${bgColor ? 'background:' + bgColor + ';' : ''}"
                      data-para="${pIdx}" 
                      data-sent="${sIdx}"
                      data-func="${sent.func}">
                    ${showTag ? `<span class="func-tag func-${userAnnotation || sent.func}" style="font-size: 10px; padding: 2px 6px; margin-right: 4px;">${userAnnotation || sent.func}</span>` : ''}
                    ${sent.text}
                </span> `;
        });
        html += '</p>';
    });
    
    container.innerHTML = html;
}

function renderFunctionToolbar() {
    const container = document.getElementById('func-toolbar');
    if (!container) return;
    
    let html = '<div class="toolbar-section"><div class="toolbar-title">📌 功能标签 (点击选择后标注句子)</div><div class="func-buttons">';
    
    for (const [tag, info] of Object.entries(FUNCTION_TAGS)) {
        html += `
            <button class="func-btn func-${tag} ${learningState.annotationMode === tag ? 'active' : ''}" 
                    data-tag="${tag}">
                ${tag}
                <span class="tooltip">
                    <strong>${info.name}</strong><br>
                    ${info.desc}
                </span>
            </button>
        `;
    }
    
    html += '</div></div>';
    
    // SEE模型提示
    html += `
        <div class="toolbar-section" style="margin-top: 15px;">
            <div class="toolbar-title">💡 SEE模型结构</div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span class="func-tag func-STA">Statement</span>
                <span style="font-size: 20px;">→</span>
                <span class="func-tag func-EXP">Explanation</span>
                <span style="font-size: 20px;">→</span>
                <span class="func-tag func-EXA">Example</span>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ============ 词性分析与词云 ============
function analyzeText(text) {
    // 简单的词性标注（实际应用中可以使用更复杂的NLP库）
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
    const wordFreq = {};
    const posAnalysis = {};
    
    // 词性规则（简化版）
    const posRules = {
        'NN': /^(children|role|women|men|childcare|education|work|workplace|society|qualities|skills|career|positions|example|conclusion|responsibility|message|subjects|science|family|duties|opportunities|life|genders|areas|employment|range|daughters|sons|years)$/i,
        'VB': /^(believe|raise|educate|bring|teach|work|contribute|focus|ensure|share|allow|provide|hold|change|try|portray|receive|dominate|decide|stay|go|left)$/i,
        'JJ': /^(important|valuable|specific|natural|traditional|senior|different|young|male|strong|available|significant)$/i,
        'RB': /^(traditionally|nowadays|significantly|successfully|only|also|firstly|secondly|hard)$/i,
        'IN': /^(in|on|at|for|of|with|by|from|to|about|between|during|through|while|as)$/i,
        'DT': /^(the|a|an|this|that|these|those|some|any|both|each|all|many)$/i,
        'PR': /^(i|you|he|she|it|we|they|who|which|what|their|them|my|your|his|her|its|our)$/i,
        'CC': /^(and|but|or|so|yet|for|nor|therefore|however|although|because)$/i,
        'MD': /^(should|will|would|could|can|may|might|must)$/i,
        'TO': /^to$/i
    };
    
    words.forEach(word => {
        // 统计词频
        if (!learningState.filterStopwords || !STOPWORDS.has(word)) {
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
        
        // 词性分析
        let pos = 'OTHER';
        for (const [tag, pattern] of Object.entries(posRules)) {
            if (pattern.test(word)) {
                pos = tag;
                break;
            }
        }
        posAnalysis[pos] = (posAnalysis[pos] || 0) + 1;
    });
    
    return { wordFreq, posAnalysis, totalWords: words.length };
}

function renderWordCloud(wordFreq) {
    const container = document.getElementById('wordcloud');
    if (!container) return;
    
    const sorted = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50);
    
    if (sorted.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: white; opacity: 0.7;">暂无词汇数据</div>';
        return;
    }
    
    const maxFreq = sorted[0][1];
    const minFreq = sorted[sorted.length - 1][1];
    
    container.innerHTML = '';
    
    sorted.forEach(([word, freq], index) => {
        const size = 14 + ((freq - minFreq) / (maxFreq - minFreq || 1)) * 30;
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7', '#ff9a9e', '#48c6ef', '#fa709a'];
        const color = colors[index % colors.length];
        
        const el = document.createElement('span');
        el.className = 'wordcloud-word';
        el.textContent = word;
        el.style.fontSize = size + 'px';
        el.style.color = color;
        el.style.left = (Math.random() * 80 + 5) + '%';
        el.style.top = (Math.random() * 80 + 5) + '%';
        el.title = `出现次数: ${freq}`;
        
        container.appendChild(el);
    });
}

function renderPOSStats() {
    const container = document.getElementById('pos-stats');
    if (!container) return;
    
    const essay = SAMPLE_ESSAYS.find(e => e.id === learningState.currentEssayId);
    if (!essay) return;
    
    const fullText = essay.paragraphs
        .map(p => p.sentences.map(s => s.text).join(' '))
        .join(' ');
    
    const { wordFreq, posAnalysis, totalWords } = analyzeText(fullText);
    
    // 渲染词性统计
    let statsHtml = '';
    for (const [pos, info] of Object.entries(POS_TAGS)) {
        const count = posAnalysis[pos] || 0;
        const percent = totalWords > 0 ? ((count / totalWords) * 100).toFixed(1) : 0;
        statsHtml += `
            <div class="pos-stat-item" style="border-left: 4px solid ${info.color};">
                <div class="pos-stat-count">${count}</div>
                <div class="pos-stat-label">${info.name} (${percent}%)</div>
            </div>
        `;
    }
    container.innerHTML = statsHtml;
    
    // 渲染词云
    renderWordCloud(wordFreq);
    
    // 渲染词表
    renderVocabularyList(wordFreq);
}

function renderVocabularyList(wordFreq) {
    const container = document.getElementById('vocab-list');
    if (!container) return;
    
    const sorted = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30);
    
    container.innerHTML = sorted.map(([word, freq]) => `
        <div class="vocab-item">
            <span class="vocab-word">${word}</span>
            <span class="vocab-freq">${freq}次</span>
        </div>
    `).join('');
}

// ============ 写作与AI评分 ============
function initWritingArea() {
    const textarea = document.getElementById('writing-input');
    if (!textarea) return;
    
    textarea.addEventListener('input', function() {
        learningState.writingText = this.value;
        updateWritingStats();
    });
}

function updateWritingStats() {
    const text = learningState.writingText;
    const words = text.match(/\b[a-z]+\b/gi) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    const wordCountEl = document.getElementById('writing-word-count');
    const sentCountEl = document.getElementById('writing-sent-count');
    const paraCountEl = document.getElementById('writing-para-count');
    
    if (wordCountEl) wordCountEl.textContent = words.length;
    if (sentCountEl) sentCountEl.textContent = sentences.length;
    if (paraCountEl) paraCountEl.textContent = paragraphs.length;
}

async function analyzeWriting() {
    const text = learningState.writingText;
    if (!text.trim()) {
        alert('请先输入您的作文内容');
        return;
    }
    
    const btn = document.getElementById('analyze-btn');
    const originalText = btn.textContent;
    btn.innerHTML = '<span class="loading-spinner"></span> AI分析中...';
    btn.disabled = true;
    
    try {
        const result = await callAliyunAPI(text);
        displayAIResult(result);
    } catch (error) {
        console.error('API调用失败:', error);
        // 使用本地分析作为备用
        const localResult = performLocalAnalysis(text);
        displayAIResult(localResult);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

async function callAliyunAPI(text) {
    const systemPrompt = `你是一位专业的雅思写作评分老师。请分析以下学生作文，并按照以下维度评分（每个维度0-9分）：

1. 结构完整性 (Structure): 检查是否包含完整的功能结构：
   - IT (Introducing Topic): 包含BG(背景)和CS(当前情况)
   - OI (Others' Ideas): 他人观点
   - PO (Personal Opinion): 个人观点
   - STA (Statement): 主题句
   - EXP (Explanation): 解释
   - EXA (Example): 例子
   - CM (Conclusion Mark): 结论
   - RES (Restatement): 重申

2. 词汇丰富度 (Vocabulary): 评估词汇多样性和准确性

3. 语法准确性 (Grammar): 检查语法错误

4. 连贯性 (Coherence): 评估段落间和句子间的逻辑连接

5. 论证深度 (Argumentation): 评估论点的深度和说服力

请用JSON格式回复：
{
  "scores": {
    "structure": 分数,
    "vocabulary": 分数,
    "grammar": 分数,
    "coherence": 分数,
    "argumentation": 分数
  },
  "overallScore": 总分(0-9),
  "structureCheck": {
    "IT": true/false,
    "OI": true/false,
    "PO": true/false,
    "STA": true/false,
    "EXP": true/false,
    "EXA": true/false,
    "CM": true/false,
    "RES": true/false
  },
  "feedback": "详细反馈建议（中文）",
  "improvements": ["改进建议1", "改进建议2", "改进建议3"]
}`;

    const response = await fetch(ALIYUN_API_CONFIG.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ALIYUN_API_CONFIG.apiKey}`
        },
        body: JSON.stringify({
            model: ALIYUN_API_CONFIG.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `请分析这篇作文：\n\n${text}` }
            ],
            temperature: 0.3,
            max_tokens: 2000
        })
    });
    
    if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // 提取JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('无法解析API响应');
}

function performLocalAnalysis(text) {
    // 本地分析备用方案
    const words = text.match(/\b[a-z]+\b/gi) || [];
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    
    // 检查结构元素
    const structureCheck = {
        'IT': /traditionally|in recent|nowadays|today/i.test(text),
        'OI': /some people|others|believe that|argue that/i.test(text),
        'PO': /i (believe|think|agree|disagree)/i.test(text),
        'STA': sentences.length >= 3,
        'EXP': /therefore|because|this means|as a result/i.test(text),
        'EXA': /for example|for instance|such as/i.test(text),
        'CM': /in conclusion|to conclude|to sum up/i.test(text),
        'RES': /i (strongly )?believe|in my opinion/i.test(text)
    };
    
    const structureScore = Object.values(structureCheck).filter(v => v).length;
    const wordScore = Math.min(9, Math.floor(words.length / 30));
    
    // 计算各维度分数
    const scores = {
        structure: Math.round(structureScore * 9 / 8 * 10) / 10,
        vocabulary: Math.min(9, 5 + Math.random() * 2),
        grammar: Math.min(9, 5 + Math.random() * 2),
        coherence: Math.min(9, 5 + Math.random() * 2),
        argumentation: Math.min(9, 4 + Math.random() * 3)
    };
    
    const overallScore = (Object.values(scores).reduce((a, b) => a + b) / 5).toFixed(1);
    
    return {
        scores,
        overallScore: parseFloat(overallScore),
        structureCheck,
        feedback: generateFeedback(structureCheck, words.length, sentences.length),
        improvements: generateImprovements(structureCheck)
    };
}

function generateFeedback(structureCheck, wordCount, sentCount) {
    let feedback = '';
    
    if (wordCount < 250) {
        feedback += `当前字数${wordCount}，未达到雅思大作文250字的最低要求。`;
    }
    
    const missing = Object.entries(structureCheck)
        .filter(([k, v]) => !v)
        .map(([k]) => FUNCTION_TAGS[k]?.name || k);
    
    if (missing.length > 0) {
        feedback += `文章缺少以下结构元素：${missing.join('、')}。`;
    }
    
    if (missing.length === 0 && wordCount >= 250) {
        feedback += '文章结构完整，包含了所有必要的功能元素。建议进一步丰富论证深度和例子的具体性。';
    }
    
    return feedback || '请继续完善您的作文。';
}

function generateImprovements(structureCheck) {
    const improvements = [];
    
    if (!structureCheck.IT) {
        improvements.push('添加背景介绍(BG)和当前情况(CS)作为开篇，例如："Traditionally... Nowadays..."');
    }
    if (!structureCheck.OI) {
        improvements.push('加入他人观点(OI)，例如："Some people believe that..."');
    }
    if (!structureCheck.PO) {
        improvements.push('明确表达个人观点(PO)，例如："I disagree with this for the following reasons."');
    }
    if (!structureCheck.EXA) {
        improvements.push('增加具体例子(EXA)来支撑论点，例如："For example,..." 或 "For instance,..."');
    }
    if (!structureCheck.CM) {
        improvements.push('添加结论标记(CM)，例如："In conclusion,..." 或 "To sum up,..."');
    }
    
    if (improvements.length === 0) {
        improvements.push('尝试使用更多高级词汇和复杂句式');
        improvements.push('确保论点之间有清晰的逻辑连接');
        improvements.push('使例子更加具体和有说服力');
    }
    
    return improvements.slice(0, 3);
}

function displayAIResult(result) {
    learningState.aiScores = result;
    
    // 更新总分
    const scoreValue = document.getElementById('overall-score');
    if (scoreValue) {
        scoreValue.textContent = result.overallScore;
    }
    
    // 更新各维度分数
    const dimensions = ['structure', 'vocabulary', 'grammar', 'coherence', 'argumentation'];
    const dimensionNames = {
        structure: '结构完整性',
        vocabulary: '词汇丰富度',
        grammar: '语法准确性',
        coherence: '连贯性',
        argumentation: '论证深度'
    };
    
    const dimensionsContainer = document.getElementById('score-dimensions');
    if (dimensionsContainer) {
        dimensionsContainer.innerHTML = dimensions.map(dim => {
            const score = result.scores[dim];
            const percent = (score / 9) * 100;
            const level = score >= 7 ? 'high' : (score >= 5 ? 'medium' : 'low');
            
            return `
                <div class="score-dimension">
                    <div class="dimension-header">
                        <span class="dimension-name">${dimensionNames[dim]}</span>
                        <span class="dimension-score">${score.toFixed(1)}/9</span>
                    </div>
                    <div class="dimension-bar">
                        <div class="dimension-fill ${level}" style="width: ${percent}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 更新结构检查
    const structureContainer = document.getElementById('structure-check');
    if (structureContainer && result.structureCheck) {
        structureContainer.innerHTML = Object.entries(result.structureCheck).map(([tag, found]) => `
            <div class="structure-item">
                <div class="structure-icon ${found ? 'found' : 'missing'}">
                    ${found ? '✓' : '✗'}
                </div>
                <span class="structure-name">${tag} - ${FUNCTION_TAGS[tag]?.name || tag}</span>
                <span class="structure-hint">${FUNCTION_TAGS[tag]?.desc || ''}</span>
            </div>
        `).join('');
    }
    
    // 更新AI反馈
    const feedbackContainer = document.getElementById('ai-feedback');
    if (feedbackContainer) {
        feedbackContainer.innerHTML = `
            <div class="ai-feedback">
                <div class="ai-feedback-title">🤖 AI评价</div>
                <div class="ai-feedback-content">${result.feedback}</div>
            </div>
            <div class="ai-feedback" style="margin-top: 15px; border-left-color: #28a745;">
                <div class="ai-feedback-title" style="color: #28a745;">💡 改进建议</div>
                <ul style="margin: 0; padding-left: 20px;">
                    ${result.improvements.map(imp => `<li style="margin-bottom: 8px;">${imp}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}

// ============ 事件绑定 ============
function bindEvents() {
    // 范文选择
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('essay-option')) {
            document.querySelectorAll('.essay-option').forEach(el => el.classList.remove('active'));
            e.target.classList.add('active');
            learningState.currentEssayId = parseInt(e.target.dataset.id);
            learningState.userAnnotations = {};
            renderCurrentEssay();
            renderPOSStats();
        }
    });
    
    // 功能标签选择
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('func-btn')) {
            document.querySelectorAll('.func-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            learningState.annotationMode = e.target.dataset.tag;
        }
    });
    
    // 句子点击标注
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('sentence')) {
            if (!learningState.annotationMode) {
                alert('请先选择一个功能标签');
                return;
            }
            
            const para = e.target.dataset.para;
            const sent = e.target.dataset.sent;
            const key = `${para}-${sent}`;
            const correctFunc = e.target.dataset.func;
            
            learningState.userAnnotations[key] = learningState.annotationMode;
            
            // 检查答案
            if (learningState.annotationMode === correctFunc) {
                learningState.practiceScore++;
                showFeedback('正确！✓', 'success');
            } else {
                showFeedback(`不完全正确。正确答案是: ${correctFunc}`, 'warning');
            }
            
            learningState.totalPractice++;
            updateProgress();
            renderCurrentEssay();
        }
    });
    
    // 停用词过滤开关
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('toggle-switch')) {
            e.target.classList.toggle('active');
            learningState.filterStopwords = e.target.classList.contains('active');
            renderPOSStats();
        }
    });
    
    // 显示答案开关
    const showAnswersToggle = document.getElementById('show-answers');
    if (showAnswersToggle) {
        showAnswersToggle.addEventListener('change', function() {
            renderCurrentEssay();
        });
    }
}

function showFeedback(message, type) {
    const container = document.getElementById('feedback-toast');
    if (!container) {
        const toast = document.createElement('div');
        toast.id = 'feedback-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            border-radius: 25px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: fadeInUp 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    
    const toast = document.getElementById('feedback-toast');
    toast.textContent = message;
    toast.style.background = type === 'success' ? 'linear-gradient(135deg, #28a745, #20c997)' : 'linear-gradient(135deg, #ffc107, #fd7e14)';
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2000);
}

function updateProgress() {
    const progressFill = document.getElementById('learning-progress-fill');
    const progressPercent = document.getElementById('learning-progress-percent');
    
    if (progressFill && progressPercent) {
        const percent = learningState.totalPractice > 0 
            ? Math.round((learningState.practiceScore / learningState.totalPractice) * 100)
            : 0;
        progressFill.style.width = percent + '%';
        progressPercent.textContent = percent + '%';
    }
}

// ============ 导出函数 ============
window.initEnglishLearning = initEnglishLearning;
window.analyzeWriting = analyzeWriting;
window.renderPOSStats = renderPOSStats;

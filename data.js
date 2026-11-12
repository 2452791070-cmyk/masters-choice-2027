export const SNAPSHOT = '2026-11-12';
export const SCHOOLS = [
  { id: 'bristol', name: '布里斯托', en: 'University of Bristol', mark: 'B', color: '#b15849', city: 'Bristol', course: 'MSc Artificial Intelligence', fee: '£36,700', budget: '52–56 万', english: '6.5 / 单项 6.5', languageCost: '若需语言班，另预留约 5–9 万', tags: ['LLM 与云数据', '城市熟悉度'], fit: 'LLM、数据工程与AI系统项目贴近企业应用；熟悉这座城市可减少适应成本。', concern: '已核AI基础与深度学习/视觉两门各有70%闭卷；LLM为50%现场考试，开闭卷尚未确认。考试偏好冲突不等于已经证明更难毕业。', life: '城市生活选择较多；Temple Quarter靠近Temple Meads。住房价格与房源仍应单独核对。', url: 'https://www.bristol.ac.uk/study/postgraduate/taught/msc-artificial-intelligence/' },
  { id: 'cranfield', name: 'KCL · 克兰菲尔德', en: 'Cranfield Applied AI', mark: 'C', color: '#a47b38', city: 'Cranfield 校区', course: 'MSc Applied Artificial Intelligence', fee: '£30,500', budget: '44–47 万', english: '6.5 / 单项 5.5', languageCost: '若达到实际offer单项要求，可直接满足语言条件', tags: ['工业应用 AI', '双项目结构'], fit: '授课40%、团队设计20%、个人研究40%；适合主动争取AI系统落地和工程项目。工业、自主系统内容较多。', concern: '40/20/40不是考试比例，不能据此推断少闭卷或易毕业。逐门考核及2027适用规则仍需核实。', life: '校区较安静；进城购物、社交及跨城求职需计算接驳。KCL学位安排不等于在伦敦学习。', url: 'https://www.cranfield.ac.uk/courses/taught/applied-artificial-intelligence' },
  { id: 'warwick', name: '华威', en: 'University of Warwick', mark: 'W', color: '#79709e', city: 'Coventry 校园', course: 'WMG MSc Applied Artificial Intelligence', fee: '£39,330', budget: '52–55 万', english: '6.5 / 单项 6.0', languageCost: '若达到实际offer单项要求，可直接满足语言条件', tags: ['云部署与生成式 AI', '已核多门作业型'], fit: '可选AI云部署、Agentic与Generative AI，连接技术实现与应用；适合应用AI及解决方案方向。', concern: '已核多门2026/27模块以作业和小组考核为主，但各部分可能须单独通过。完整2027/28考核表未核齐。', life: '校园生活集中，位于Coventry外围，日常交通取决于住宿位置；并非住在Warwick小镇。', url: 'https://warwick.ac.uk/fac/sci/wmg/study/masters-degrees/applied-artificial-intelligence/' },
  { id: 'ucl', name: 'UCL', en: 'University College London', mark: 'U', color: '#346a70', city: 'London · Bloomsbury', course: 'MSc Artificial Intelligence and Data Engineering', fee: '£44,400', budget: '62–66 万', english: '7.0 / 单项 6.5', languageCost: '若需语言班，另预留约 10–13 万；2027安排待更新', tags: ['软件与数据工程', '伦敦行业接触'], fit: '软件架构、开发实践、验证测试、数据工程与AI组合，贴近AI工程、系统交付及FDE能力。可选工程或研究项目。', concern: '这里暂按AIDE比较，中介实际项目名称尚未确认。已核一门35% Exam，但开闭卷与完整必修考核矩阵不明确。', life: '伦敦的行业活动、面试和公共交通便利；住房竞争、通勤和实际生活方式需要一起考虑。', url: 'https://www.ucl.ac.uk/study/prospective-students/graduate/courses/artificial-intelligence-and-data-engineering-msc' },
  { id: 'manchester', name: '曼彻斯特', en: 'University of Manchester', mark: 'M', color: '#5467a3', city: 'Manchester', course: 'MSc Artificial Intelligence', fee: '£41,400', budget: '54–58 万', english: '7.0 / 单项 6.5', languageCost: '若需语言班，另预留约 5–9 万；资格以offer为准', tags: ['机器学习与推理', '大城市生活'], fit: '机器学习、知识表示、推理、文本和视觉覆盖较广。与具体工程交付岗位的匹配还取决于选课和项目。', concern: '完整逐门考核矩阵尚未取得，不能仅凭理论课程推定闭卷更多或最难毕业。本工具不按学术录取门槛扣分。', life: '大城市的生活、交通与社交选择较多；本地岗位不等于国际毕业生可获得担保的岗位。', url: 'https://www.manchester.ac.uk/study/masters/courses/list/21574/msc-artificial-intelligence/all-content/' },
  { id: 'kcl', name: 'KCL · 伦敦', en: "King's College London", mark: 'K', color: '#95657f', city: 'London · Waterloo', course: 'MSc Artificial Intelligence', fee: '£42,900', budget: '60–65 万', english: '7.0 / 单项 6.5', languageCost: '若需语言班，另预留约 8–14 万；部分费用用旧年参考', tags: ['AI 选课空间', '伦敦城市资源'], fit: 'AI、机器学习、智能体和推理等选修空间较大，能否形成工程交付能力取决于具体选课与项目。', concern: '考核含笔试、实作、作业及个人项目；逐门开闭卷与权重尚未核齐，不能确认它毕业最难。', life: 'Waterloo的公共交通及伦敦行业接触便利；与Cranfield的生活地点和项目结构分别评价。', url: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/artificial-intelligence-msc' }
];

const C = (id, label, group, color, note) => ({ id, label, group, color, note });
export const MODELS = {
  ten: {
    name: '十项明细', short: '10 项 · 各 10%', source: '你提供的 Claude 十项表',
    description: '复现截图中的十项与初始名次。生活拆成四项；语言和背景适配可在「八项综合」中直接加权。',
    criteria: [
      C('course', '课程难度', '学习', '#ab714b', '初始名次属于情景判断；需核对数学、编程、闭卷及实际工作量。越易适应，名次越小。'),
      C('graduation', '毕业难度', '学习', '#ba8b65', '评价补考、补交、必过部分与额外学年风险。缺乏可比毕业率，不能视作学校实际通过率。'),
      C('career', 'FDE / 应用 AI 适配', '方向', '#467b68', '看系统开发、部署、实际问题解决及交付能力，与传统AI研究导向分别评价。'),
      C('uk', '英国就业', '方向', '#6d927f', '城市和行业接触是机会判断；没有可比的国际生工签就业率。'),
      C('china', '回国选择', '方向', '#93a591', '结合品牌和招聘选择；成都政策按实际毕业及回国年份核对，不提前计补贴。'),
      C('city', '城市生活', '生活', '#6d8e9b', '评价便利、活动与城市体验；费用在总费用里单独考虑，避免重复计分。'),
      C('housing', '住宿', '生活', '#8da5ac', '评价房源、位置、舒适和选择。若只按租金评价，会与费用重复。'),
      C('commute', '通勤', '生活', '#b0bcc2', '看校内外与跨城往返；实际住宿位置可能改变这项排名。'),
      C('social', '社交', '生活', '#879f9f', '看个人能参与的活动和社交环境；并不直接代表就业结果。'),
      C('cost', '总费用', '成本', '#ba9b57', '越便宜名次越小；家庭支付不意味着成本不重要，60万元不作硬门槛。')
    ],
    rows: [
      [2,3,1,4.5,6,4.5], [3,2,1,4.5,4.5,6], [1,4.5,3,2,4.5,6], [5.5,5.5,4,1,2.5,2.5],
      [5,3,6,1,3,3], [1.5,6,5,3.5,1.5,3.5], [2.5,1,4,5.5,2.5,5.5], [4,6,5,2,2,2],
      [4,6,5,2,2,2], [2,1,3,6,4,5]
    ],
    uncertain: { course: ['bristol','cranfield','warwick','ucl','manchester','kcl'], graduation: ['bristol','cranfield','warwick','ucl','manchester','kcl'] }
  },
  eight: {
    name: '八项综合', short: '8 项 · 各 12.5%', source: '本对话上一轮八项名次表',
    description: '生活细项合并；课程与毕业合并，新增背景适配及语言。初始名次沿用上一轮判断，不能直接归因于权重变化。',
    criteria: [
      C('difficulty', '课程与毕业难度', '学习', '#ab714b', '包含考核偏好、工作量、补救机制及整年重读风险。初始名次并非实测毕业难度。'),
      C('fit', '课程与背景适配', '学习', '#ba8b65', '看已有软件与数据科学背景、课程知识增量。与职业匹配相关，注意重复加权。'),
      C('career', 'AI / FDE 职业匹配', '方向', '#467b68', '看系统开发、部署、评估及客户问题解决所需能力。'),
      C('uk', '英国就业', '方向', '#6d927f', '比较行业接触和求职便利，不代表实际工签就业率。'),
      C('china', '回国选择与品牌', '方向', '#93a591', '按适用KCL学位安排评价Cranfield品牌；政策收益不预支。'),
      C('life', '生活与城市便利', '生活', '#6d8e9b', '综合城市生活、房源、通勤与社交，具体成本在费用项评价。'),
      C('cost', '总费用', '成本', '#ba9b57', '比较一年学费与生活、必要时的语言班；60万元不是排除条件。'),
      C('language', '语言与语言班', '成本', '#9a8265', '按约6.5的语言情景比较要求与衔接。总分、单项、豁免及语言班资格必须分别确认。')
    ],
    rows: [
      [6,3.5,1,3.5,3.5,3.5], [2.5,5.5,2.5,1,5.5,4], [2.5,4.5,2.5,1,6,4.5],
      [3.5,6,5,1,3.5,2], [5.5,2.5,5.5,1,4,2.5], [3.5,6,5,1.5,3.5,1.5],
      [2.5,1,2.5,6,4,5], [3,1,2,5,5,5]
    ],
    uncertain: { difficulty: ['bristol','cranfield','warwick','ucl','manchester','kcl'] }
  }
};

export function defaultRanks(mode) {
  const model = MODELS[mode];
  return Object.fromEntries(model.criteria.map((c, i) => [c.id, Object.fromEntries(SCHOOLS.map((s, j) => [s.id, model.rows[i][j]]))]));
}

export const SOURCES = [
  ['UCL 语言班', 'https://www.ucl.ac.uk/study/clie/pre-sessional/postgraduate'],
  ['KCL 语言班', 'https://www.kcl.ac.uk/pre-sessional'],
  ['Bristol 语言要求', 'https://www.bristol.ac.uk/study/language-requirements/profile-c/'],
  ['Manchester 2027 语言班', 'https://www.ucae.manchester.ac.uk/study/pre-sessional-courses/dates-and-fees/'],
  ['KCL 合并与学位证安排', 'https://www.kcl.ac.uk/news/kings-college-london-and-cranfield-agree-plans-to-merge-in-august-2027'],
  ['Graduate visa 现行规定', 'https://www.gov.uk/graduate-visa']
];

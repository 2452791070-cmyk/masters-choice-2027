export const REVIEW_DATE = '2026-11-12';
const entry = (id, school, topic, title, url, year, supports, limit = '', kind = 'official') => ({
  id, school, topic, title, url, year, supports, limit, kind, reviewed: REVIEW_DATE
});

export const EVIDENCE = [
  entry('b-program','bristol','课程','Bristol · AI项目与2027学费','https://www.bristol.ac.uk/study/postgraduate/taught/msc-artificial-intelligence/','2027/28','核对项目名称、课程结构、实际校区及国际学费£36,700。','课程内容能支持匹配判断，不能直接证明更高就业率。'),
  entry('c-program','cranfield','课程','Cranfield · Applied AI项目','https://www.cranfield.ac.uk/courses/taught/applied-artificial-intelligence','2027入学','核对授课40%、团队设计20%、个人研究40%，以及IELTS 6.5、单项5.5的公开条件。','40/20/40是整体课程结构，不是闭卷考试比例；正式offer仍须确认。'),
  entry('w-program','warwick','课程','Warwick WMG · Applied AI','https://warwick.ac.uk/fac/sci/wmg/study/masters-degrees/applied-artificial-intelligence/','2027入学','核对120授课学分、60论文；云部署及生成式AI选修；海外学费£39,330；雅思6.5、单项6.0。','选修及考核可能逐年调整，不能保证完全没有笔试。'),
  entry('u-program','ucl','课程','UCL · AI and Data Engineering','https://www.ucl.ac.uk/study/prospective-students/graduate/courses/artificial-intelligence-and-data-engineering-msc','2027/28','核对一年制、Bloomsbury校区、软件与数据工程课程，以及国际学费£44,400。','本工具暂按AIDE项目；并非所有UCL AI相关硕士都适用。'),
  entry('m-program','manchester','课程','Manchester · MSc AI完整介绍','https://www.manchester.ac.uk/study/masters/courses/list/21574/msc-artificial-intelligence/all-content/','2027入学','核对AI课程、国际学费£41,400，以及雅思7.0、单项6.5。','本比较按学术条件可满足处理，不把录取把握加入名次。'),
  entry('k-program','kcl','课程','KCL London · MSc AI项目','https://www.kcl.ac.uk/study/postgraduate-taught/courses/artificial-intelligence-msc','2027入学','核对AI项目名称、校区及课程方向。','KCL伦敦与Cranfield分别评价；校名相同不等于课程和地点相同。'),
  entry('c-fees','cranfield','费用','Cranfield · 2027/28官方学费表','https://www.cranfield.ac.uk/study/taught-degrees/fees-and-funding/taught-tuition-fees-2027','2027/28','Applied Artificial Intelligence的海外MSc学费为£30,500。','这是学费，不含住宿、生活、语言班或求职资金。'),
  entry('k-fees','kcl','费用','KCL AI · 官方学费','https://www.kcl.ac.uk/study/postgraduate-taught/courses/artificial-intelligence-msc/fees','2027/28','国际生全日制学费£42,900。','净支出还要结合offer、奖学金、生活及汇率。'),
  entry('b-english','bristol','语言','Bristol · English Profile C','https://www.bristol.ac.uk/study/language-requirements/profile-c/','当前公开要求','IELTS总分6.5，各单项6.5。','总分约6.5不代表单项已满足；豁免由学校按个人情况审核。'),
  entry('u-english','ucl','语言','UCL · English Level 2','https://www.ucl.ac.uk/study/prospective-students/graduate/how-apply/english-language-requirements','当前公开要求','Level 2的IELTS总分7.0，各单项6.5；项目页指定Level 2。','须与具体项目的语言级别一起核对。'),
  entry('k-english','kcl','语言','KCL · English Band B','https://www.kcl.ac.uk/study/postgraduate-taught/how-to-apply/entry-requirements/english-language-requirements','当前公开要求','核对Band B：IELTS总分7.0，各单项6.5。','不能仅凭学校名推定所有项目使用同一Band。'),
  entry('u-pre','ucl','语言','UCL · 研究生语言班','https://www.ucl.ac.uk/study/clie/pre-sessional/postgraduate','2027待更新','官方语言班申请、入读和结业要求入口。','当前页面拟于11月下旬更新2027信息；旧年费用不可当成2027正式报价。'),
  entry('k-pre','kcl','语言','KCL · Pre-sessional语言班','https://www.kcl.ac.uk/pre-sessional','2027开班安排','核对6、11及16周路径、日期和官方入读条件。','部分费用子页仍为旧年；周数取决于实际语言单项和offer。'),
  entry('b-pre','bristol','语言','Bristol · 语言班费用','https://www.bristol.ac.uk/academic-language/study/pre-sessional/fees/','2027待核','官方语言班费用入口，用于后续更新预算。','目前规划采用旧年参考；不把它写成已确认2027价格。'),
  entry('m-pre','manchester','语言','Manchester · 2027语言班','https://www.ucae.manchester.ac.uk/study/pre-sessional-courses/dates-and-fees/','2027','6周£3,630，10周£6,050；页面明确费用不含住宿。','能否参加对应班次，以硕士offer与实际英语成绩为准。'),
  entry('b-foundations','bristol','考核','Bristol · AI基础单元','https://www.bris.ac.uk/unit-programme-catalogue/UnitDetails.jsa?ayrCode=27%2F28&unitCode=SEMTM0051','2027/28','官方单元目录记录70%闭卷考核及编程作业。','只能说明该单元的考核安排，不能推出项目最难毕业。'),
  entry('b-vision','bristol','考核','Bristol · 深度学习与视觉单元','https://www.bris.ac.uk/unit-programme-catalogue/UnitDetails.jsa?ayrCode=27%2F28&unitCode=MATHM0055','2027/28','官方单元目录记录70%闭卷考核及编程作业。','请核对入学时最终手册与个人选课。'),
  entry('b-llm','bristol','考核','Bristol · LLM单元','https://www.bris.ac.uk/unit-programme-catalogue/UnitDetails.jsa?ayrCode=27%2F28&unitCode=SEMTM0048','2027/28','官方目录记录50%现场考试及团队项目。','现场考试不自动等同于闭卷；开闭卷尚未核实。'),
  entry('w-deep','warwick','考核','Warwick · Deep Learning模块','https://courses.warwick.ac.uk/modules/2026/WM9B7-15','2026/27参考','个人作业70%、团队考核30%；各考核部分须通过。','参考年份是2026/27，不能直接保证2027/28全项目考核。'),
  entry('w-stats','warwick','考核','Warwick · AI应用统计模块','https://courses.warwick.ac.uk/modules/2026/WM9QE-15','2026/27参考','核对个人与小组考核、展示及模块通过要求。','单一模块不能证明整套硕士没有闭卷。'),
  entry('u-data','ucl','考核','UCL · Engineering for Data Analysis 1','https://www.ucl.ac.uk/module-catalogue/modules/engineering-for-data-analysis-1-COMP0235','2026/27参考','目录标注35% Exam、65%实验或实作。','Exam未说明开闭卷；完整必修考核矩阵仍待核。'),
  entry('k-teach','kcl','考核','KCL AI · Teaching & Assessment','https://www.kcl.ac.uk/study/postgraduate-taught/courses/artificial-intelligence-msc/teaching','当前课程页','核对笔试、实作、作业及60学分个人项目。','逐门考试权重、开闭卷及选择组合尚未核齐。'),
  entry('c-rules','cranfield','考核','Cranfield · Assessment Rules PDF','https://www.cranfield.ac.uk/-/media/files/assessment-rules.ashx','2026规则参考','官方考核规则入口，用于核对通过、补考和项目要求。','合并后2027适用规则仍须项目确认；规则不等于发生概率。'),
  entry('w-resits','warwick','考核','WMG · 考核委员会FAQ','https://warwick.ac.uk/fac/sci/wmg/globalcontent/general/opregs/examboardfaqs/','现行参考','核对补考、重交及未满足学位要求时的处理。','补考不自动意味着增加一个完整学年。'),
  entry('b-resits','bristol','考核','Bristol · Resits与补救说明','https://www.bristol.ac.uk/students/support/academic-advice/outcomes/resits/','现行参考','核对补考、论文安排及时间影响。','个人补救时间要看具体通知，不能直接等同整年重读。'),
  entry('m-rules','manchester','考核','Manchester · 授课硕士规则PDF','https://documents.manchester.ac.uk/display.aspx?DocID=78506','2026起规则参考','官方授课硕士补考、论文重交及学位要求入口。','不能据规则严厉程度推算个人延毕率。'),
  entry('u-rules','ucl','考核','UCL · Consequences of Failure','https://www.ucl.ac.uk/study/current-students/academic-manual/chapters/chapter-4-assessment-framework-taught-programmes/section-6-consequences-failure','现行参考','核对Resit、Repeat及未通过时的处理条件。','完整学年重读风险取决于失败学分及个人情况。'),
  entry('c-campus','cranfield','生活','Cranfield · 住宿与周边交通','https://www.cranfield.ac.uk/study/life-on-campus/life-at-cranfield/accommodation/off-campus-accommodation','当前校区信息','核对校外住宿、周边城镇与接驳信息。','火车单段时间不等于从校园出门到伦敦的全程通勤。'),
  entry('w-campus','warwick','生活','Warwick · Campus & Journey','https://warwick.ac.uk/about/campus-journey/','当前校区信息','核对Warwick主校区位置与到达方式。','实际生活便利程度还取决于住宿位置和个人习惯。'),
  entry('k-merger','all','政策','KCL · 合并与学位证官方公告','https://www.kcl.ac.uk/news/kings-college-london-and-cranfield-agree-plans-to-merge-in-august-2027','2026-11-02公告','计划2027年8月1日合并；学位证安排按接受offer时点等条件区分。','资源整合分阶段进行；不等于在伦敦上课或自动享受相同求职环境。'),
  entry('uk-graduate','all','政策','GOV.UK · Graduate visa','https://www.gov.uk/graduate-visa','现行政策','2027年1月1日起申请的普通本科或硕士Graduate visa通常为18个月。','六校适用相同基本规则；不保证之后能取得工作担保。'),
  entry('qs-ranks','all','品牌','QS · 全球大学排名原始入口','https://www.topuniversities.com/qs-top-uni-wur','2027参考','可直接核对学校整体排名及指标。','综合排名不是专业排名，也不等于个人留英就业率或成都补贴资格。'),
  entry('cd-policy','all','政策','成都人社局 · 回国政策核对入口','https://cdhrss.chengdu.gov.cn/','实际回国年度待核','人才认定、申报及官方通知应回到主管部门核对。','这里只提供核对入口；未确认你2028年毕业后的落户或补贴资格。','pending'),
  entry('budget-model','all','费用','一年总费用 · 本工具估算口径','', '预算情景','以官方2027学费，加12个月生活费假设及£3,000必要杂项，按£1=¥9换算。','不是官方总价或实时汇率；语言班及毕业后求职生活费另计。','estimate'),
  entry('rank-judgement','all','方法','初始名次 · 对话中的主观判断','', '本次比较','十项版复现你提供的Claude表；八项版沿用本对话的八项判断。','不属于官方排名或可比就业、毕业统计。请在名次矩阵修改自己的判断。','judgement')
];

export const SCHOOL_REFS = {
  bristol: { course:['b-program'],fee:['b-program'],english:['b-english'],pre:['b-pre'],assessment:['b-foundations','b-vision','b-llm','b-resits'],life:['b-program'] },
  cranfield: { course:['c-program'],fee:['c-fees'],english:['c-program'],pre:[],assessment:['c-rules'],life:['c-campus','k-merger'] },
  warwick: { course:['w-program'],fee:['w-program'],english:['w-program'],pre:[],assessment:['w-deep','w-stats','w-resits'],life:['w-campus'] },
  ucl: { course:['u-program'],fee:['u-program'],english:['u-english'],pre:['u-pre'],assessment:['u-data','u-rules'],life:['u-program'] },
  manchester: { course:['m-program'],fee:['m-program'],english:['m-program'],pre:['m-pre'],assessment:['m-rules'],life:['m-program'] },
  kcl: { course:['k-program'],fee:['k-fees'],english:['k-english'],pre:['k-pre'],assessment:['k-teach'],life:['k-program'] }
};

export const CRITERION_TOPICS = {
  course:['课程','考核'],graduation:['考核'],difficulty:['考核'],fit:['课程'],career:['课程','方法'],
  uk:['政策','课程'],china:['品牌','政策'],city:['生活'],housing:['生活'],commute:['生活'],social:['生活'],life:['生活'],
  cost:['费用'],language:['语言']
};

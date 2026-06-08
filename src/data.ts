/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Restaurant, Partner, Badge } from './types';

export const DEFAULT_USER: User = {
  userId: 'u001',
  nickname: '小航 (新人)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  companyId: 'c001',
  companyName: '蚂蚁智能科技园区',
  department: 'AI产品部',
  jobTitle: '初级产品经理',
  onboardingDays: 5, // 刚入职5天，属于典型新人！
  lunchStartTime: '12:00',
  lunchEndTime: '13:30',
  tasteTags: ['炒菜', '轻食', '火锅', '汤粉面'],
  skillTags: ['摄影', 'PPT设计', 'AI写作', '猫奴'],
  socialPreference: '轻聊天',
  budgetRange: '¥30-¥50',
  acceptableDistance: 1000,
  matchStatus: true,
  wechatId: 'hang_pm_001',
  phone: '13812345678'
};

export const SAMPLE_RESTAURANTS: Restaurant[] = [
  {
    restaurantId: 'r001',
    name: '潮发·潮汕牛肉火锅 (科苑店)',
    category: '火锅',
    subCategory: '牛肉火锅',
    address: '科苑北路科兴科学园B栋一楼',
    distance: 120,
    walkingTime: 2,
    rating: 4.8,
    avgPrice: 68,
    tags: ['近', '适合聊天', '评分高', '食材新鲜'],
    crowdLevel: '正常',
    recommendReason: '精选吊龙和匙柄，现点现切，步行仅2分钟，清淡鲜美，非常适合三人拼桌破冰聊天。',
    suitability: { solo: false, chat: true, fast: false, group: true },
    featuredDish: '手槌牛肉丸 / 黄肥牛'
  },
  {
    restaurantId: 'r002',
    name: '栖贵贵·贵州酸汤火锅',
    category: '火锅',
    subCategory: '重庆 / 酸汤火锅',
    address: '科兴科学园C栋美食街12号',
    distance: 250,
    walkingTime: 4,
    rating: 4.6,
    avgPrice: 55,
    tags: ['酸辣过瘾', '聚人多', '环境温馨'],
    crowdLevel: '排队中',
    recommendReason: '贵州特色红酸汤底非常开胃！出餐极快，适合口味重但想要追求清爽不油腻的搭子同往。',
    suitability: { solo: false, chat: true, fast: true, group: true },
    featuredDish: '贵州红酸汤牛杂锅'
  },
  {
    restaurantId: 'r003',
    name: '极野绿动轻食 (科技园店)',
    category: '轻食',
    subCategory: '沙拉简餐',
    address: '科技北二路大冲新村5等座',
    distance: 310,
    walkingTime: 5,
    rating: 4.5,
    avgPrice: 35,
    tags: ['一人食必备', '减脂首选', '落地窗'],
    crowdLevel: '空闲',
    recommendReason: '环境极为安静雅致，提供高纤维慢碳沙拉。非常适合不想说话、静静享受正午阳光的一人饭。',
    suitability: { solo: true, chat: false, fast: true, group: false },
    featuredDish: '香煎鸡胸肉暖温沙拉'
  },
  {
    restaurantId: 'r004',
    name: '芈重山老火锅 (科兴店)',
    category: '火锅',
    subCategory: '四川火锅',
    address: '科苑一街科技园大厦裙楼B1层',
    distance: 520,
    walkingTime: 8,
    rating: 4.7,
    avgPrice: 75,
    tags: ['地道九宫格', '热闹喧嚣', '排队王'],
    crowdLevel: '排队中',
    recommendReason: '经典的川渝牛肉火锅，底料牛油香醇。座位宽敞，极易让大家在大汗淋漓中迅速增进感情。',
    suitability: { solo: false, chat: true, fast: false, group: true },
    featuredDish: '麻辣嫩牛肉 / 千层肚'
  },
  {
    restaurantId: 'r005',
    name: '老长沙手工粉面馆',
    category: '汤粉面',
    subCategory: '湖南米粉',
    address: '深南大道大冲商务中心C栋负一楼',
    distance: 400,
    walkingTime: 6,
    rating: 4.4,
    avgPrice: 24,
    tags: ['香辣入味', '超便宜', '10分钟搞定'],
    crowdLevel: '正常',
    recommendReason: '扁粉软糯，码子香浓，盖码现炒现盖。出餐极速，是高效率“速战速决”午餐拍档的第一选择！',
    suitability: { solo: true, chat: false, fast: true, group: false },
    featuredDish: '辣椒炒肉手工粉'
  },
  {
    restaurantId: 'r006',
    name: '粤小馆·精致精致粤菜锦轩',
    category: '精致粤菜',
    subCategory: '粤式小炒/烧腊',
    address: '科苑路科苑科学园商铺23号',
    distance: 480,
    walkingTime: 7,
    rating: 4.7,
    avgPrice: 58,
    tags: ['优雅安静', '不油不辣', '商务破冰'],
    crowdLevel: '正常',
    recommendReason: '环境静雅，不吵杂，非常适合在柔和音乐声中进行深度交流，畅聊工作之余的兴趣干货。',
    suitability: { solo: false, chat: true, fast: false, group: true },
    featuredDish: '脆皮玻璃乳鸽 / 蜜汁叉烧'
  },
  {
    restaurantId: 'r007',
    name: '南洋椰风·东南亚菜 (原味椰子鸡)',
    category: '东南亚菜',
    subCategory: '椰子鸡/泰餐',
    address: '大冲都市时尚街区B03号',
    distance: 850,
    walkingTime: 12,
    rating: 4.6,
    avgPrice: 82,
    tags: ['冬阴功必点', '异域风情', '略远'],
    crowdLevel: '空闲',
    recommendReason: '口味酸辣清甜，香料丰富。稍微走远一点顺便当作散步，呼吸新鲜空气，适合慢节奏谈心。',
    suitability: { solo: false, chat: true, fast: false, group: true },
    featuredDish: '鲜椰子煮文昌鸡锅 / 经典冬阴功汤'
  },
  {
    restaurantId: 'r008',
    name: 'Manner Cafe & 烘焙简餐',
    category: '咖啡简餐',
    subCategory: '面包三明治',
    address: '科兴科学园广场负一楼中央',
    distance: 80,
    walkingTime: 1,
    rating: 4.5,
    avgPrice: 28,
    tags: ['白领高频', '1分钟抵达', '意式风干'],
    crowdLevel: '正常',
    recommendReason: '高性价比咖啡与恰到好处的法棍三明治，适合精神困顿的周一，与技术大牛顺便喝一杯醒脑。',
    suitability: { solo: true, chat: true, fast: true, group: false },
    featuredDish: '厚乳拿铁 + 罗勒起司贝果'
  },
  {
    restaurantId: 'r009',
    name: '呷哺呷哺 (科兴时尚小火锅)',
    category: '火锅',
    subCategory: '转转火锅',
    address: '科兴科学园C栋时尚地下城',
    distance: 180,
    walkingTime: 3,
    rating: 4.3,
    avgPrice: 42,
    tags: ['高性价比一人一锅', '方便卫生'],
    crowdLevel: '正常',
    recommendReason: '吧台式的转转火锅，菜品循环。既保证各吃各的卫生，又能和邻座搭子开心点评传送带。',
    suitability: { solo: true, chat: true, fast: true, group: false },
    featuredDish: '秘制麻酱单人套餐'
  },
  {
    restaurantId: 'r010',
    name: '川北豆花土菜馆 (热辣炒菜)',
    category: '炒菜',
    subCategory: '川湘菜系',
    address: '科苑科学园后巷5号',
    distance: 500,
    walkingTime: 7,
    rating: 4.5,
    avgPrice: 36,
    tags: ['大火爆炒', '辣得过瘾', '米饭杀手'],
    crowdLevel: '正常',
    recommendReason: '烟火气十足，炒菜锅气极浓。点三个菜，跟好辣的搭子一起扒两碗米饭，是解压的第一神仙地。',
    suitability: { solo: true, chat: true, fast: true, group: true },
    featuredDish: '豆花水煮牛肉 / 酸辣土豆丝'
  }
];

export const SAMPLE_PARTNERS: Partner[] = [
  {
    userId: 'u002',
    nickname: '小林 (林静雅)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    department: '智能算法实验室',
    jobTitle: '高级算法工程师',
    onboardingDays: 240, // 老员工，愿意偶尔面带微笑地认识新人。
    matchScore: 94,
    matchReason: '你们今天都偏好友好不辣的【潮汕牛肉火锅】，你的午休区间完美包含在TA的日程内。而且小林也是个猫奴，拥有3年PPT辅导经验！',
    tasteTags: ['火锅', '精致粤菜', '轻食'],
    skillTags: ['深度学习', 'PPT诊断', '英短繁育', '手磨咖啡'],
    socialPreference: '轻聊天',
    lunchTime: '12:15',
    todayCategory: '火锅',
    budgetRange: '¥50-¥80',
    wechatId: 'lin_ai_spark',
    phone: '13912349988',
    selfIntro: '写代码跟撸猫都是解压好方式。最近在看大语言模型落地，欢迎技术或产品的新同学一起约饭唠嗑！不冷场，带猫照！🐾'
  },
  {
    userId: 'u003',
    nickname: '亮哥 (沈一亮)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    department: '创意设计中心',
    jobTitle: '视觉设计总监',
    onboardingDays: 1200, // 资深老员工
    matchScore: 88,
    matchReason: '亮哥偏好的时间是12:00，刚好可满足“立即出发”。他今天想吃香辣刺激的菜（如川北土菜馆或贵州酸汤）。他是一位摄影博主，可以给你指点公司附近的拍照黄金机位！',
    tasteTags: ['炒菜', '火锅', '东南亚菜'],
    skillTags: ['风光摄影', 'Midjourney', '手电钻木工', '吉他新手'],
    socialPreference: '可聊工作',
    lunchTime: '12:00',
    todayCategory: '炒菜',
    budgetRange: '¥30-¥50',
    wechatId: 'liang_design_pro',
    phone: '13788887766',
    selfIntro: '做设计掉掉头发，吃点热辣炒菜补回来。了解公司周边八卦和美味，新人想避坑大方来找我聊！'
  },
  {
    userId: 'u004',
    nickname: '瑶瑶 (陈瑶)',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    department: '人力资源与企业关怀部',
    jobTitle: '新人HRBP',
    onboardingDays: 45, // 也是半个新人，非常热心！
    matchScore: 91,
    matchReason: '时间高度契合！瑶瑶是AI产品部的HRBP，对于你的破冰非常积极。今天她特别想吃清爽减脂的【轻食】。',
    tasteTags: ['轻食', '汤粉面', '精致粤菜'],
    skillTags: ['招聘内推', 'MBTI性格分析', '脱口秀爱好者', '德语初学者'],
    socialPreference: '轻聊天',
    lunchTime: '12:30',
    todayCategory: '轻食',
    budgetRange: '¥30-¥50',
    wechatId: 'yaoyao_bp_care',
    phone: '13655556622',
    selfIntro: '嗨！我是AI产品部常驻的关怀BP！新人入职有什么办卡、园区迷路、不顺心的事尽管来，咱们一边减脂嚼叶子，一边轻松唠！'
  },
  {
    userId: 'u005',
    nickname: '阿峰 (张世峰)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    department: '系统基础架构组',
    jobTitle: '资深内核研发',
    onboardingDays: 1800,
    matchScore: 78,
    matchReason: '阿锋今天纯粹为了填饱肚子！偏好【湖南米粉】，想10分钟吃完继续回去打游戏。适合那些只想速速干饭不愿多聊的纯吃货！',
    tasteTags: ['汤粉面', '美式快餐'],
    skillTags: ['C++性能调优', '机械键盘客制化', '黑暗之魂速通', '猫奴'],
    socialPreference: '安静吃饭',
    lunchTime: '12:10',
    todayCategory: '汤粉面',
    budgetRange: '¥30以下',
    wechatId: 'kernel_panic_killer',
    phone: '13144445555',
    selfIntro: '只想迅速大口唆粉。不怎么爱社交，除非你也玩艾尔登法环或者研究客制化轴体。'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'b1',
    name: '科兴探店员',
    desc: '成功点击收藏3家以上的公司附近美食餐厅',
    icon: '🍕',
    unlocked: true,
    unlockedAt: '2026-06-03',
    progressText: '3/3'
  },
  {
    id: 'b2',
    name: '社交开拓家',
    desc: '成功通过搭子功能达成2次完整的共进午餐',
    icon: '🤝',
    unlocked: false,
    progressText: '1/2'
  },
  {
    id: 'b3',
    name: '职场破冰者',
    desc: '完成了入职之初的首次午休搭子匹配并交换微信',
    icon: '🧊',
    unlocked: false,
    progressText: '0/1'
  },
  {
    id: 'b4',
    name: '五星好评主',
    desc: '在就餐后对周边美食及搭子进行客观评价累积4次',
    icon: '⭐',
    unlocked: false,
    progressText: '1/4'
  },
  {
    id: 'b5',
    name: '拼桌大胃王',
    desc: '午餐价格匹配中选用了80元以上的豪华火锅单',
    icon: '🍖',
    unlocked: false,
    progressText: '0/1'
  }
];

export const LUNCH_TIPS = [
  { id: 1, title: '新人破冰妙招', content: '不知道聊什么时，可以从对方的技能标签树或【周末打算去哪撸猫】切入，话题最不容易尴尬。' },
  { id: 2, title: '午休黄金时长', content: '公司规定午休是 12:00 至 14:00。建议 12:10 前辈分拨出发，或者 12:45 错峰出行，科兴电梯排队最短。' },
  { id: 3, title: '肠胃护航常识', content: '吃重辣（贵州酸汤/川味火锅）后，建议下午在园区水吧买一杯冰美式或无糖乌龙茶，能够极佳地中和油腻。' },
  { id: 4, title: '交换联系方式', content: '我们严格保护隐私。只有在就餐过后的评价阶段，双方都勾选【愿意交换】时，双方本地聊天框才会解锁对方的微信号与手机哦！' }
];

export const CHAT_AUTOREPLIES: Record<string, string[]> = {
  'u002': [
    '哈啰！太巧了吧，我也正馋潮汕牛肉火锅呢！',
    '我们可以约 12:15 左右直接在科兴科学园B栋楼下的潮发火锅门口汇合？这家店中午人挺多的，我先到就先去拿个号！',
    '哈哈，看到你的脑洞人设里写了是【AI产品经理】兼【猫奴】。我正好在做大模型的工程落地，家里还有两只蓝猫。一会见面必须多唠唠！',
    '好的，我都确认了，不见不散！'
  ],
  'u003': [
    '哟！新同学你好啊，今天想去后巷土菜馆吃炒菜是吧？走起！',
    '12:00 准时在大冲大厦大堂见，我穿一件深色连帽衫，背着个旧相机包，到时见！',
    '放心吧，这家店我常去，老板出餐狂快，咱们能坐下来宽裕聊天。',
    '一言为定，那咱们就定 12:00 了，到时见！'
  ],
  'u004': [
    '新人小航你好呀！特别高兴能匹配到AI产品部的新同学！',
    '我们今天去吃轻食嘛？12:30 在大冲新村落地窗那家极野绿动沙拉汇合可以呗？刚好走几步，散散心散去上午的疲惫。',
    '作为BP悄悄告诉你，别紧张，你们AI部门的伙伴人手超级nice，带你快速融入是我本周的开心任务！',
    '好的好的，邀约已确认！待会见咯，一路小心！'
  ],
  'u005': [
    '唆粉？可以。',
    '12:10 在负一楼手工湖南粉面馆见，我拿到粉直接大口唆，不怎么爱聊技术以外的废话哈。',
    '那店出餐大概就 3 分钟，一碗粉 24 块真香。速战速决！',
    '好。'
  ]
};

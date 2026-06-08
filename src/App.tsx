/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Soup, Users, User, Heart, Trophy, BookOpen, Compass, Flame, Leaf, RotateCcw, AlertTriangle, Sparkles, Navigation, Star, MessageSquare 
} from 'lucide-react';
import { User as UserType, Restaurant, Partner, TastePreference, Badge, Invitation } from './types';
import { DEFAULT_USER, SAMPLE_RESTAURANTS, SAMPLE_PARTNERS, BADGES, LUNCH_TIPS } from './data';

import TasteSelect from './components/TasteSelect';
import PersonaEdit from './components/PersonaEdit';
import DiscoverySection from './components/DiscoverySection';
import MatchSection from './components/MatchSection';
import ChatRoom from './components/ChatRoom';
import ReviewModal from './components/ReviewModal';
import ParkMap from './components/ParkMap';
import { motion, AnimatePresence } from 'motion/react';
import FoodBackground from './components/FoodBackground';

export default function App() {
  // 1. 核心应用状态
  const [currentUser, setCurrentUser] = useState<UserType>(DEFAULT_USER);
  const [currentMode, setCurrentMode] = useState<'home' | 'taste' | 'discovery' | 'match' | 'chat' | 'review' | 'persona' | 'map'>('home');
  const [lunchMode, setLunchMode] = useState<'solo' | 'partner'>('solo');
  const [tastePref, setTastePref] = useState<TastePreference | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [visitedRestaurantIds, setVisitedRestaurantIds] = useState<string[]>(['r008']);
  
  // 收藏与游戏化徽章
  const [favorites, setFavorites] = useState<Restaurant[]>([
    SAMPLE_RESTAURANTS[0], // 默认有两张收藏的温鲜铺
    SAMPLE_RESTAURANTS[7]
  ]);
  const [badges, setBadges] = useState<Badge[]>(BADGES);

  // 消息提示气泡
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2. 自助弹窗/提示卡片状态
  const [activeTipIdx, setActiveTipIdx] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 搜取餐馆收藏切换
  const handleToggleFavorite = (id: string) => {
    const found = SAMPLE_RESTAURANTS.find((r) => r.restaurantId === id);
    if (!found) return;

    if (favorites.some((f) => f.restaurantId === id)) {
      setFavorites((prev) => prev.filter((f) => f.restaurantId !== id));
      showToast(`已将 “${found.name}” 移出口袋名单`);
    } else {
      setFavorites((prev) => [...prev, found]);
      showToast(`❤ 成功收藏 “${found.name}”，已加入我的午饭口袋！`);
      
      // 解锁科兴探店徽章的条件控制
      if (favorites.length + 1 >= 3) {
        setBadges((prev) => 
          prev.map((b) => b.id === 'b1' ? { ...b, unlocked: true, unlockedAt: '今天' } : b)
        );
      }
    }
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.restaurantId !== id));
    showToast(`已移出口袋收藏`);
  };

  // 口味选择完成
  const handleTasteComplete = (preference: TastePreference) => {
    setTastePref(preference);
    if (lunchMode === 'solo') {
      setCurrentMode('discovery');
    } else {
      setCurrentMode('match');
    }
  };

  // 发起邀约 -> 切换到对话界面
  const handleInitiateInvitation = (partner: Partner) => {
    setSelectedPartner(partner);
    
    // 自动为他们推荐一家符合今日口味的餐馆
    const matchedRest = SAMPLE_RESTAURANTS.find((r) => r.category === partner.todayCategory) || SAMPLE_RESTAURANTS[0];
    setSelectedRestaurant(matchedRest);

    setCurrentMode('chat');
    showToast(`✉ 邀约卡已成功飞向 ${partner.nickname} 的饭盒！已开启私聊通道`);
  };

  // 换一位 partner (在此MVP版本，我们直接做成卡片往后看)
  const handleSkipPartner = (id: string) => {
    showToast(`已跳过这位同事 `);
  };

  // 两个人在聊天室确认接受契约邀约
  const handleConfirmInvitation = (invitation: Invitation) => {
    const matchedRest = SAMPLE_RESTAURANTS.find((r) => r.restaurantId === invitation.restaurantId) || SAMPLE_RESTAURANTS[0];
    setSelectedRestaurant(matchedRest);
    showToast(`握手成功！你们约在今日 ${invitation.plannedTime} 于 ${invitation.meetingPoint} 享用美味`);
  };

  // 评价并且完成闭环
  const handleCompleteReview = (review: any, hasUnlockedIcebreakerBadge: boolean) => {
    if (hasUnlockedIcebreakerBadge) {
      // 一键点亮 职场破冰者 徽章！
      setBadges((prev) => 
        prev.map((b) => b.id === 'b3' ? { ...b, unlocked: true, unlockedAt: '今天', progressText: '1/1' } : b)
      );
      showToast(`🎉 成功解锁 [职场破冰者 🧊] 勋章！快去完善人设吧！`);
    }

    // 增加社交开拓家和评价主的进度
    setBadges((prev) => 
      prev.map((b) => {
        if (b.id === 'b2') {
          return { ...b, progressText: '2/2', unlocked: true, unlockedAt: '今天' };
        }
        if (b.id === 'b4') {
          return { ...b, progressText: '2/4' };
        }
        return b;
      })
    );

    if (selectedRestaurant) {
      setVisitedRestaurantIds((prev) => {
        if (!prev.includes(selectedRestaurant.restaurantId)) {
          return [...prev, selectedRestaurant.restaurantId];
        }
        return prev;
      });
    }

    showToast(`感谢提交！本次午饭搭子圆满画上句号`);
  };

  // 一人食模式：决定独立前往门店
  const handleProceedToRestaurantSolo = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    // 这里我们直接让他前往签到评价，让他也可以走完 MVP 体验！
    setCurrentMode('review');
    showToast(`您已进入一人食门店：${restaurant.name} 本地锁定通道`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased relative">
      <FoodBackground />
      
      {/* 全局Toast提示气泡 */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white font-medium text-xs sm:text-sm px-4.5 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 顶部通栏导航栏 */}
      <header className="sticky top-0 z-40 bg-white border-b border-orange-100 shrink-0 shadow-sm backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentMode('home')}>
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">
              🍲
            </div>
            <div>
              <span className="font-extrabold text-slate-800 tracking-tight text-base sm:text-lg">午饭搭子</span>
              <p className="text-[9px] font-bold text-slate-400 leading-none mt-0.5 tracking-widest uppercase">Office Lunch Hub</p>
            </div>
          </div>

          {/* 状态导航标签页 */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setCurrentMode('home')}
              className={`px-3 py-1.5 text-xs font-extrabold rounded transition ${
                currentMode === 'home' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-55'
              }`}
            >
              🍽️ 决策中心
            </button>
            <button 
              onClick={() => {
                setLunchMode('solo');
                setCurrentMode('taste');
              }}
              className={`px-3 py-1.5 text-xs font-extrabold rounded transition ${
                lunchMode === 'solo' && currentMode === 'taste' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-55'
              }`}
            >
              🚶 独自觅食
            </button>
            <button 
              onClick={() => {
                setLunchMode('partner');
                setCurrentMode('taste');
              }}
              className={`px-3 py-1.5 text-xs font-extrabold rounded transition ${
                lunchMode === 'partner' && currentMode === 'taste' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-55'
              }`}
            >
              👬 结伴搭子
            </button>
            <button 
              onClick={() => {
                setCurrentMode('map');
              }}
              className={`px-3 py-1.5 text-xs font-extrabold rounded transition ${
                currentMode === 'map' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-55'
              }`}
            >
              🗺️ 园区地图
            </button>
          </nav>

          {/* 右上角人设快捷键入口 */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentMode('persona')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition border ${
                currentMode === 'persona' 
                  ? 'bg-orange-50 text-orange-600 border-orange-200' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <img 
                src={currentUser.avatar} 
                alt="" 
                className="w-5.5 h-5.5 rounded-full object-cover border border-slate-200" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <span className="text-xs font-semibold hidden sm:inline">{currentUser.nickname}</span>
              {currentUser.onboardingDays <= 90 && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-550 animate-ping inline-block" />
              )}
            </button>
          </div>
        </div>
      </header>


      {/* 主页面主体区 */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 relative z-10">
        
        <AnimatePresence mode="wait">
          {currentMode === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* 顶端暖心引导横幅 */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-orange-600 via-orange-550 to-amber-600 text-white p-6 sm:p-10 shadow-sm mb-4 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* 背景装饰光片 */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-3 max-w-[620px] text-center md:text-left">
                  <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-800 text-white leading-none">
                    🍲 新员工就餐融入首选
                  </span>
                  
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none pt-1">
                    今天中午想吃什么？
                  </h1>
                  
                  <p className="text-orange-100 text-xs sm:text-sm font-light leading-relaxed">
                    一个人也好，寻找搭子也罢。从公司附近1公里内的舒适美食开始。
                    用味蕾匹配同部门老员工或新搭子，降低约饭尴尬，轻装上阵，告别职场破冰压力。
                  </p>

                  {/* 公司配置指示器 */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-orange-100 bg-white/10 border border-white/5 py-1.5 px-3 rounded w-fit">
                      <Navigation className="w-3.5 h-3.5 animate-pulse" />
                      当前定位：科兴科学园 (1KM 美食全域锁定) · 状态：在线
                    </div>
                    
                    <button
                      onClick={() => setCurrentMode('map')}
                      className="flex items-center gap-1.5 text-[11px] font-mono bg-white text-orange-600 hover:bg-orange-50 border border-orange-100 py-1.5 px-3.5 rounded-full transition duration-200 cursor-pointer shadow-md font-bold group"
                    >
                      🗺️ 点我查看 <span className="underline underline-offset-3 decoration-2 decoration-orange-500 font-extrabold group-hover:text-orange-700">"园区"</span> 电子地图/已打卡地点
                    </button>
                  </div>
                </div>

                {/* 饭碗或者精美插图示意 */}
                <div className="text-7xl select-none animate-wiggle inline-block md:block self-center shrink-0">
                  🍜
                </div>
              </div>

              {/* A. 核心两大就餐状态入口 (一字排开) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 模式一：附近一人食 */}
                <div 
                  onClick={() => {
                    setLunchMode('solo');
                    setCurrentMode('taste');
                  }}
                  className="bg-white rounded-xl border border-slate-200 hover:border-orange-500 p-6 shadow-sm hover:shadow transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 bg-orange-50 text-orange-605 rounded hover:bg-orange-100 transition duration-300">
                      <User className="w-6 h-6" />
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded uppercase font-mono tracking-wider">
                      Solo Style
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-850 mt-5 group-hover:text-orange-705 border-l-4 border-orange-500 pl-2">
                    独自干饭 · 附近一人食
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                     不想要任何社交压力，只想在限时的午休时间里迅速犒劳肚子？
                     输入口味，系统推荐1公里内出餐快、高评分、自带清静“一人食”座落的精品食堂与咖啡简餐。
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-orange-600">
                    <span>挑选今日口味，前往挑店 →</span>
                    <span className="text-[10px] text-slate-400 font-normal">支持雷达地图导航</span>
                  </div>
                </div>

                {/* 模式二：寻找午饭搭子 */}
                <div 
                  onClick={() => {
                    setLunchMode('partner');
                    setCurrentMode('taste');
                  }}
                  className="bg-white rounded-xl border border-slate-200 hover:border-amber-500 p-6 shadow-sm hover:shadow transition-all text-left cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded hover:bg-amber-100 transition duration-100">
                      <Users className="w-6 h-6" />
                    </div>
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-semibold rounded uppercase font-mono tracking-wider">
                      Social Bling
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-slate-850 mt-5 group-hover:text-amber-700 border-l-4 border-amber-500 pl-2">
                    寻找胃口相投的午饭搭子
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5">
                    <span className="text-amber-600 font-medium">★ 降低新人加入尴尬！</span>
                    根据今日想吃、可用预算和社交标签（轻聊天/聊工作），匹配园区内同样打算就餐的暖心部门同仁或友好老友。
                    一键轻邀约，打卡即刻破冰！
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs font-semibold text-amber-600">
                    <span>雷达匹配，发起邀约去破冰 →</span>
                    <span className="text-[10px] text-amber-550 bg-amber-50 px-1.5 py-0.5 rounded font-bold scale-95 pointer-events-none">安全微信一键解密</span>
                  </div>
                </div>

              </div>

              {/* B. 饭局小建议 & 园区热门排队热力指示 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* HR 破冰小常识贴士 */}
                <div className="lg:col-span-1 bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5 pb-2.5 border-b font-mono mb-4">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      Office Lunch Warmtips
                    </h3>

                    <div className="space-y-4 animate-fade-in">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-150">
                        <h4 className="text-xs font-bold text-slate-850 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-orange-550" />
                          {LUNCH_TIPS[activeTipIdx].title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                          {LUNCH_TIPS[activeTipIdx].content}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTipIdx((prev) => (prev + 1) % LUNCH_TIPS.length)}
                    className="mt-4 w-full py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 rounded transition text-center cursor-pointer"
                  >
                    换一条 HR 关怀秘技
                  </button>
                </div>

                {/* 每日科兴周边美食热度榜单 */}
                <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-4.5">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 flex items-center gap-1.5 pb-2.5 border-b font-mono">
                    <Flame className="w-4 h-4 text-orange-500" />
                    园区 1KM 范围今日午间就餐热度排雷看板
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SAMPLE_RESTAURANTS.slice(0, 4).map((rest, rank) => (
                      <div key={rest.restaurantId} className="p-3 rounded-lg border border-slate-150 bg-slate-50/20 hover:bg-slate-50 transition flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <span className={`w-6 h-6 rounded text-xs font-bold font-mono flex items-center justify-center shrink-0 ${
                            rank === 0 ? 'bg-orange-600 text-white' :
                            rank === 1 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {rank + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-semibold text-slate-800 truncate">{rest.name}</div>
                            <span className="text-[9px] text-slate-400 block font-mono">
                              {rest.subCategory || rest.category} · 步行 {rest.walkingTime}min
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            rest.crowdLevel === '空闲' ? 'bg-green-150 text-green-750' :
                            rest.crowdLevel === '正常' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-650'
                          }`}>
                            {rest.crowdLevel}
                          </span>
                          <div className="text-[10px] font-bold text-slate-600 font-mono mt-0.5">{rest.rating} 分</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* 1. 口味选择模块 */}
          {currentMode === 'taste' && (
            <motion.div
              key="taste"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TasteSelect 
                mode={lunchMode}
                onComplete={handleTasteComplete}
                initialPreference={tastePref || undefined}
              />
            </motion.div>
          )}

          {/* 2. 附近一人食检索结果模块 */}
          {currentMode === 'discovery' && (
            <motion.div
              key="discovery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={() => setCurrentMode('taste')}
                className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl cursor-pointer"
              >
                ← 重新调整偏好
              </button>
              <DiscoverySection 
                restaurants={SAMPLE_RESTAURANTS}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onProceedToRestaurant={handleProceedToRestaurantSolo}
                tastePreference={tastePref}
                companyName={currentUser.companyName}
              />
            </motion.div>
          )}

          {/* 3. 匹配搭子推荐卡片模块 */}
          {currentMode === 'match' && (
            <motion.div
              key="match"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                onClick={() => setCurrentMode('taste')}
                className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl cursor-pointer"
              >
                ← 口味偏好调整
              </button>
              <MatchSection 
                partners={SAMPLE_PARTNERS}
                tastePreference={tastePref}
                onInitiateInvitation={handleInitiateInvitation}
                onSkipPartner={handleSkipPartner}
                onViewTips={() => {
                  // 自动跳换首页并切换一下
                  setCurrentMode('home');
                  setActiveTipIdx((prev) => (prev + 1) % LUNCH_TIPS.length);
                }}
              />
            </motion.div>
          )}

          {/* 4. 轻聊天室模块 */}
          {currentMode === 'chat' && selectedPartner && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ChatRoom 
                partner={selectedPartner}
                user={currentUser}
                onBack={() => setCurrentMode('match')}
                onConfirmInvitation={handleConfirmInvitation}
                onUpdateInvitationStatus={(st) => showToast(`状态已同步为: ${st}`)}
                onProceedToCheckin={() => setCurrentMode('review')}
              />
            </motion.div>
          )}

          {/* 5. 线下物理到店签到及评价模块 */}
          {currentMode === 'review' && selectedRestaurant && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ReviewModal 
                partner={selectedPartner || SAMPLE_PARTNERS[0]} // 默认小林
                restaurant={selectedRestaurant}
                lunchMode={lunchMode}
                onCompleteReview={handleCompleteReview}
                onClose={() => {
                  // 重新重置，回返首页
                  setSelectedPartner(null);
                  setSelectedRestaurant(null);
                  setCurrentMode('home');
                }}
                onViewOnMap={() => {
                  setSelectedPartner(null);
                  setSelectedRestaurant(null);
                  setCurrentMode('map');
                }}
              />
            </motion.div>
          )}

          {/* 6. 人设编辑/口袋精美列表 */}
          {currentMode === 'persona' && (
            <motion.div
              key="persona"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PersonaEdit 
                user={currentUser}
                onUpdateUser={(newUser) => {
                  setCurrentUser(newUser);
                  showToast(`✓ 人设名片及隐私联络通道修改成功！已更新`);
                }}
                badges={badges}
                favorites={favorites}
                onRemoveFavorite={handleRemoveFavorite}
              />
            </motion.div>
          )}

          {/* 7. 园区电子地图独立大屏/查看已打卡和附近极美美食 */}
          {currentMode === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ParkMap 
                restaurants={SAMPLE_RESTAURANTS}
                visitedIds={visitedRestaurantIds}
                onBack={() => setCurrentMode('home')}
                onProceedSolo={(rest) => {
                  setSelectedRestaurant(rest);
                  setLunchMode('solo');
                  setCurrentMode('review');
                  showToast(`您已进入一人食门店：${rest.name} 本地锁定通道`);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 底部版权信息与大厂温暖提示 */}
      <footer className="bg-slate-900 text-white py-10 border-t border-slate-800 text-center text-xs">
        <div className="max-w-6xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-1 bg-white/5 py-1.5 px-4.5 rounded-full w-fit mx-auto text-[10px] text-slate-350 font-bold uppercase tracking-widest font-mono">
            <span>蚂蚁智能科技园区 (科兴) 专属服务支持</span> · 
            <span>版本 V1.0 MVP active</span>
          </div>

          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            此服务专本旨在让入职本公司的每一位新同学，在最初 90 天最快的温暖时间圈里，
            在午晚餐中享受美食和职场破冰快乐。数据已安全沙盒沙箱托管，不做公开。
          </p>

          <div className="text-slate-600 font-bold pt-2 border-t border-white/5 text-[10px]">
             © 2026-06 午饭搭子团队 Inc. All Rights Reserved. Crafted with high premium aesthetics.
          </div>
        </div>
      </footer>
    </div>
  );
}

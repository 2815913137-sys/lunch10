/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MapPin, Star, Smile, Sparkles, ShieldCheck, ArrowRight, UserCheck, Smartphone 
} from 'lucide-react';
import { Partner, Restaurant, Review } from '../types';

interface ReviewModalProps {
  partner: Partner;
  restaurant: Restaurant;
  lunchMode: 'solo' | 'partner';
  onCompleteReview: (review: Review, hasUnlockedIcebreakerBadge: boolean) => void;
  onClose: () => void;
  onViewOnMap?: () => void;
}

export default function ReviewModal({
  partner,
  restaurant,
  lunchMode,
  onCompleteReview,
  onClose,
  onViewOnMap
}: ReviewModalProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [partnerCheckedIn, setPartnerCheckedIn] = useState(false);

  // 评价状态
  const [restaurantScore, setRestaurantScore] = useState(5);
  const [partnerScore, setPartnerScore] = useState(5);
  const [tasteScore, setTasteScore] = useState(5);
  const [serviceScore, setServiceScore] = useState(5);
  const [comment, setComment] = useState('');
  const [nextTime, setNextTime] = useState(true);
  const [exchangeContact, setExchangeContact] = useState(true);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleCheckin = () => {
    setIsCheckedIn(true);
    if (lunchMode === 'partner') {
      setTimeout(() => {
        setPartnerCheckedIn(true);
      }, 800);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalReview: Review = {
      reviewId: `rev_${Date.now()}`,
      invitationId: `inv_${partner.userId}`,
      reviewerId: 'u001',
      restaurantScore,
      partnerScore: lunchMode === 'partner' ? partnerScore : 5,
      tasteScore,
      serviceScore,
      comment,
      nextTime: lunchMode === 'partner' ? nextTime : false,
      exchangeContact: lunchMode === 'partner' ? exchangeContact : false,
      createdAt: new Date().toISOString()
    };

    setHasSubmitted(true);

    const unlockIcebreakerBadge = lunchMode === 'partner' && exchangeContact === true;
    onCompleteReview(finalReview, unlockIcebreakerBadge);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-orange-100 p-6 shadow-sm animate-fade-in ms-1 text-slate-800">
      
      {!hasSubmitted ? (
        /* 主就餐和打卡评价表单 */
        <div className="space-y-6">
          {/* 头部主题 */}
          <div className="text-center space-y-1 pb-2 border-b border-orange-100">
            <h2 className="text-base sm:text-lg font-bold text-orange-900 flex items-center justify-center gap-1.5">
              🍱 到餐打卡与就餐反馈
            </h2>
            <p className="text-xs text-slate-400">
              {lunchMode === 'partner' 
                ? '抵达就餐点后打卡。吃完美味午饭之后，写下您的真实探店体验及饭友相伴体验。'
                : '抵达就餐点后打卡。开启专属于您的清静“一人食”舒心就餐，提交打卡增加美食探店积分。'
              }
            </p>
          </div>

          {/* 1. 模拟步行到店打卡 */}
          <div className="bg-orange-50/20 p-4 rounded-lg border border-orange-100 space-y-3.5">
            <h3 className="text-xs font-bold text-orange-600 font-mono uppercase tracking-wider">
               STEP 1 / 抵达餐厅打卡签到
             </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] text-slate-400 block font-bold leading-none">锁定集合就餐点</span>
                <span className="text-sm font-bold text-slate-800 truncate block mt-1">{restaurant.name}</span>
                <span className="text-[10px] text-slate-400 block truncate mt-0.5">📍 {restaurant.address}</span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {/* 自身打卡 */}
                <button
                  type="button"
                  onClick={handleCheckin}
                  disabled={isCheckedIn}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer transition ${
                    isCheckedIn 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-250 font-medium' 
                      : 'bg-orange-600 hover:bg-orange-700 text-white shadow-sm'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {isCheckedIn ? '我已到店 签到 ✓' : '我已到店 签到'}
                </button>

                {/* 模拟搭子打卡 */}
                {lunchMode === 'partner' && (
                  <div className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition ${
                    partnerCheckedIn 
                      ? 'bg-orange-50 text-orange-700 border-orange-200' 
                      : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    <UserCheck className="w-4 h-4" />
                    {partnerCheckedIn ? `${partner.nickname} 已签到 ✓` : `等待 ${partner.nickname} 签到...`}
                  </div>
                )}
              </div>
            </div>

            {isCheckedIn && (
              <p className="text-[10px] text-emerald-600 font-bold animate-pulse">
                {lunchMode === 'partner' 
                  ? '✓ 园区就餐地址数据校验成功。您今日的积极破冰积分 +10 分！'
                  : '✓ 园区一人食就餐定位校验成功！打卡记录已生成。'
                }
              </p>
            )}
          </div>

          {/* 2. 只有打卡成功后才展示评价细表 */}
          {isCheckedIn ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className={`grid grid-cols-1 ${lunchMode === 'partner' ? 'md:grid-cols-2' : ''} gap-5`}>
                {/* A. 餐厅打分 */}
                <div className="space-y-4 p-4 rounded-lg border border-orange-100 bg-white">
                  <h4 className="text-xs font-extrabold text-orange-800 border-b border-orange-100 pb-1.5 uppercase tracking-wider">
                     🍽️ 对店铺午餐综合评价
                  </h4>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">餐厅整体推荐度</span>
                    <div className="flex items-center gap-1 select-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRestaurantScore(star)}
                          className="p-0.5 hover:scale-110 transition cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${
                            restaurantScore >= star ? 'text-orange-500 fill-orange-500' : 'text-slate-200'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">午餐口味满意度</span>
                    <div className="flex items-center gap-1 select-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setTasteScore(star)}
                          className="p-0.5 hover:scale-110 transition cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${
                            tasteScore >= star ? 'text-orange-500 fill-orange-500' : 'text-slate-200'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">出餐与响应效率</span>
                    <div className="flex items-center gap-1 select-none">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setServiceScore(star)}
                          className="p-0.5 hover:scale-110 transition cursor-pointer"
                        >
                          <Star className={`w-4 h-4 ${
                            serviceScore >= star ? 'text-orange-500 fill-orange-500' : 'text-slate-200'
                          }`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* B. 与搭子相伴评价 */}
                {lunchMode === 'partner' && (
                  <div className="space-y-4 p-4 rounded-lg border border-orange-100 bg-white">
                    <h4 className="text-xs font-extrabold text-orange-850 border-b border-orange-100 pb-1.5 uppercase tracking-wider">
                       🤝 与搭子相伴破冰评价
                    </h4>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">和小伙伴就餐整体感觉</span>
                      <div className="flex items-center gap-1 select-none">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setPartnerScore(star)}
                            className="p-0.5 hover:scale-110 transition cursor-pointer"
                          >
                            <Star className={`w-4 h-4 ${
                              partnerScore >= star ? 'text-orange-500 fill-orange-500' : 'text-slate-200'
                            }`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">下次是否希望二次约饭</span>
                      <button
                        type="button"
                        onClick={() => setNextTime(!nextTime)}
                        className={`px-3 py-1 rounded text-[11px] font-bold border transition cursor-pointer ${
                          nextTime 
                            ? 'bg-orange-50 border-orange-200 text-orange-705' 
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}
                      >
                        {nextTime ? '我很乐意下次再聚' : '看情况/今日极简破冰'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-550 block font-semibold leading-none">
                        双方本局自愿交换联系方式
                      </span>
                      <button
                        type="button"
                        onClick={() => setExchangeContact(!exchangeContact)}
                        className={`px-3 py-1 rounded text-[11px] font-bold border transition cursor-pointer flex items-center gap-1 leading-none ${
                          exchangeContact 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : 'bg-rose-50 text-rose-500 border-rose-200'
                        }`}
                      >
                        <Smile className="w-3.5 h-3.5" />
                        {exchangeContact ? '我十分愿意交换' : '暂时先不公开'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* C. 补充评语 */}
              <div className="space-y-1.5 focus:ring-1">
                <label className="text-xs font-semibold text-slate-500">补充探店细节或就餐经历 (选填)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={lunchMode === 'partner' 
                    ? "如：吊龙鲜嫩，搭子的桌游、MBTI心得分析让我们聊得很嗨..." 
                    : "如：店铺环境清静舒适，适合专心看手机或处理灵感，出餐效率特别快..."
                  }
                  rows={2}
                  className="w-full p-3 rounded-lg border border-orange-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500"
                />
              </div>

              {/* 隐私申明 */}
              <div className="p-3 bg-orange-50/10 rounded border border-orange-100 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <b>测评隐私条款:</b> 所有的评分及随口填写的评语仅作雷达算法精进，<b>绝不展示给任何第三方</b>。
                  {lunchMode === 'partner' && ' 交换联系方式必须双方在本局均给予认可才能在对方的页面中同时解锁。'}
                </span>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm"
                >
                  提交就餐反馈
                </button>
              </div>

            </form>
          ) : (
            <div className="text-center py-6 text-xs text-orange-450 font-mono italic animate-pulse">
               请先在上方核对地址并点击 “我已到店 签到”。轨迹连通后，即可开始反馈好评评分哦！
            </div>
          )}

        </div>
      ) : (
        /* 评价提交成功，结算和足迹快照展示 */
        <div className="space-y-6 text-center py-4 animate-fade-in text-slate-800">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl mx-auto shadow-sm animate-bounce">
            ✓
          </div>
          
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {lunchMode === 'partner' ? '午餐伙伴拼餐打卡圆满提交！' : '一人食自主探店打卡成功！'}
            </h3>
            <p className="text-xs text-slate-500 max-w-[400px] mx-auto">
              您的反馈已被安全存入蚂蚁内网科学园午休指引数据库。
            </p>
          </div>

          {/* 只有搭子模式并且在同意交换联系方式时显示联系人卡片 */}
          {lunchMode === 'partner' && exchangeContact ? (
            <div className="bg-orange-50/20 border border-orange-100 p-5 rounded-lg max-w-md mx-auto space-y-4 animate-scale-up">
              <div className="flex items-center justify-center gap-1 text-orange-850 px-3 py-1 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                恭喜！本就餐对局双方自愿一致同意公开联系方式
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white rounded border border-orange-100 shadow-xs">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">微信号 WeChat🔑</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 select-all tracking-wide">
                    {partner.wechatId}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(partner.wechatId);
                  }}
                  className="px-2.5 py-1 bg-slate-50 font-semibold rounded border border-orange-200 text-[10px] text-orange-700 hover:bg-orange-100 cursor-pointer"
                >
                  复制微信
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white rounded border border-orange-100 shadow-xs">
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-bold block">电话号码 Phone🔑</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono tracking-wider select-all">
                    {partner.phone}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(partner.phone);
                  }}
                  className="px-2.5 py-1 bg-slate-50 font-semibold rounded border border-orange-200 text-[10px] text-orange-700 hover:bg-orange-100 cursor-pointer"
                >
                  复制电话
                </button>
              </div>

              <div className="p-3 bg-white/50 rounded text-[10px] text-slate-550 flex items-start gap-1 justify-center leading-normal border border-orange-100/50">
                <Smartphone className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span>联系信息同时锁存于您的【我的饭卡 &gt; 好友名单】，随时可寻。</span>
              </div>
            </div>
          ) : lunchMode === 'partner' ? (
            <div className="bg-orange-50/10 border border-orange-100 p-4 rounded max-w-md mx-auto text-xs text-slate-500 leading-normal">
              🔒 隐私联络方式未予交换。这次温柔午餐配对依然为您点亮了一枚独特的就餐足迹！
            </div>
          ) : null}

          {/* 无论是一人食还是寻找搭子模式核心要求：展示足迹快照 + 地图解锁鼓励 */}
          <div className="max-w-md mx-auto space-y-4">
            
            {/* 足迹快照 / Footprint Snapshot Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100/30 border-2 border-dashed border-orange-300 rounded-xl p-5 text-left shadow-xs mt-3">
              {/* 右侧打卡艺术质感印章 */}
              <div className="absolute right-4 top-4 w-18 h-18 rounded-full border-4 border-orange-500/20 flex items-center justify-center rotate-12 select-none pointer-events-none">
                <div className="text-[10px] font-extrabold text-orange-600 tracking-wider text-center leading-none">
                  科兴美食<br />
                  打卡留念<br />
                  ✓
                </div>
              </div>
              
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-orange-850">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>公司周边·到店足迹快照 🗺️</span>
                </div>
                
                <div className="border-t border-orange-200/50 pt-2.5 space-y-1">
                  <div className="text-[10px] text-slate-400 font-medium">就餐地址</div>
                  <div className="text-sm font-extrabold text-slate-900 flex items-center gap-2 leading-none">
                    <span>{restaurant.name}</span>
                    <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-mono font-bold">
                      {restaurant.category}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 italic mt-0.5 leading-none">
                    📍 {restaurant.address}
                  </p>
                  
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-3 border-t border-dashed border-orange-200/30 mt-2">
                    <span>模式: {lunchMode === 'solo' ? '🚶 独自觅食 一人食' : `👬 拼餐搭档: ${partner.nickname}`}</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 地图解锁+1鼓励 */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg p-3 text-xs font-extrabold shadow-sm flex items-center justify-center gap-2 border border-orange-400 animate-pulse">
              <span>🎉</span>
              <span>就餐打卡成功，公司周边地图解锁+1</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
            {onViewOnMap && (
              <button
                type="button"
                onClick={onViewOnMap}
                className="w-full sm:w-auto flex-1 px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-extrabold cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5"
              >
                🗺️ 点开地图查看足迹
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto flex-1 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-extrabold cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5"
            >
              返回美食大厅
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Sparkles, XCircle, Smile, BookOpen, UserCheck, RefreshCw 
} from 'lucide-react';
import { Partner, TastePreference } from '../types';

interface MatchSectionProps {
  partners: Partner[];
  tastePreference: TastePreference | null;
  onInitiateInvitation: (partner: Partner) => void;
  onSkipPartner: (id: string) => void;
  onViewTips: () => void;
}

export default function MatchSection({
  partners,
  tastePreference,
  onInitiateInvitation,
  onSkipPartner,
  onViewTips
}: MatchSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 过滤出未被跳过、可以匹配的搭子
  const visiblePartners = partners;

  const currentPartner = visiblePartners[currentIndex] || null;

  const handleNext = () => {
    if (visiblePartners.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % visiblePartners.length);
  };

  const handleInvite = () => {
    if (!currentPartner) return;
    onInitiateInvitation(currentPartner);
  };

  // 匹配强度定级
  const getMatchLevel = (score: number) => {
    if (score >= 90) return { label: '契合极高', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score >= 80) return { label: '完美契合', style: 'bg-amber-50 text-amber-700 border-amber-200' };
    return { label: '口味相投', style: 'bg-orange-50 text-orange-700 border-orange-200' };
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in ms-1 text-slate-800">
      {/* 头部进度说明 */}
      <div className="text-center space-y-2 pb-2">
        <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-orange-50 text-orange-750 border border-orange-200 rounded-lg text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-orange-550" />
          今日智能雷达配对中
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
          挑选最拍档的午饭伙伴
        </h2>
        <p className="text-xs text-slate-500 max-w-[420px] mx-auto text-center leading-relaxed">
          分析你们的就餐时间、午餐类别和破冰偏好。新人一键发起，零社恐包袱，愉快度过午休。
        </p>
      </div>

      {currentPartner ? (
        <div className="space-y-4">
          {/* 搭子精美人设卡 */}
          <div className="relative bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden transition-all hover:border-orange-300 duration-500">
            {/* 卡片顶端装饰线条 */}
            <div className="w-full h-1.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600" />

            <div className="p-6 space-y-5">
              {/* 1. 契合度与基本卡片信息 */}
              <div className="flex items-center justify-between">
                {/* 匹配指数 */}
                <div className="flex items-center gap-2">
                  <div className="p-1 px-3 bg-orange-600 text-white rounded shadow-sm text-center">
                    <span className="text-[10px] block opacity-85 leading-none">契合度</span>
                    <span className="text-base font-extrabold font-mono">{currentPartner.matchScore}%</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded border uppercase ${getMatchLevel(currentPartner.matchScore).style}`}>
                    {getMatchLevel(currentPartner.matchScore).label}
                  </span>
                </div>

                <div className="text-xs text-slate-400 font-bold font-mono">
                  序号: {currentIndex + 1} / {visiblePartners.length}
                </div>
              </div>

              {/* 2. 人设照片、昵称及职位 */}
              <div className="flex items-start gap-4">
                <img 
                  src={currentPartner.avatar} 
                  alt={currentPartner.nickname} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover border border-slate-200 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                  }}
                />
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-slate-800">{currentPartner.nickname}</h3>
                    {currentPartner.onboardingDays <= 90 ? (
                      <span className="px-2 py-0.5 text-[9px] bg-green-50 text-green-700 font-bold rounded border border-green-200">
                        同为新人 🧊
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] bg-orange-50 text-orange-700 border border-orange-100 font-bold rounded">
                        园区良友 🤝
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    🏢 {currentPartner.department} · {currentPartner.jobTitle}
                  </p>

                  <div className="text-[10px] text-slate-400 font-mono">
                    已入职: {currentPartner.onboardingDays} 天
                  </div>
                </div>
              </div>

              {/* 3. 今日打算与胃口 */}
              <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-705">
                  <span className="flex items-center gap-1">⏱ 下午就餐时点: <b className="text-slate-900 font-semibold">{currentPartner.lunchTime}</b></span>
                  <span className="flex items-center gap-1">💸 期望预算: <b className="text-slate-900 font-semibold">{currentPartner.budgetRange}</b></span>
                </div>
                <p className="text-xs text-slate-605 leading-relaxed font-semibold">
                   今日想吃类型：想吃 <span className="text-orange-600 underline font-semibold">#{currentPartner.todayCategory}#</span>
                </p>
              </div>

              {/* 4. 详细匹配契合 analysis */}
              <div className="space-y-1 bg-orange-50/20 p-3 rounded border-l-2 border-orange-500">
                <div className="text-[11px] font-bold tracking-wider text-orange-800 uppercase flex items-center gap-1">
                  🎯 本次完美契合理由
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentPartner.matchReason}
                </p>
              </div>

              {/* 5. 个人技能树与社交偏好 */}
              <div className="space-y-2.5 pt-1.5 border-t border-slate-100">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">破冰话题技能树 / 爱好</div>
                  <div className="flex flex-wrap gap-1.5 mt-1 font-sans">
                    {currentPartner.skillTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-slate-100 text-slate-705 rounded font-medium">
                        ✨ {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">社交期待</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-150">
                    💬 {currentPartner.socialPreference}
                  </span>
                </div>
              </div>

              {/* 6. 自我介绍破冰寄语 */}
              <div className="p-3 bg-orange-50/10 border border-dashed border-orange-200 rounded text-xs text-slate-600 leading-relaxed italic flex items-start gap-2">
                <Smile className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  “ {currentPartner.selfIntro} ”
                </div>
              </div>
            </div>

            {/* 底部功能栏 */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
              {/* 跳过 / 换一位 */}
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 text-xs font-bold cursor-pointer transition shadow-sm"
              >
                <XCircle className="w-4 h-4 text-slate-405" />
                再看看换一位
              </button>

              {/* 发起邀约 */}
              <button
                type="button"
                onClick={handleInvite}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold cursor-pointer transition shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                发起午餐邀约
              </button>
            </div>
          </div>

          {/* 小提示一览 */}
          <div className="p-4 bg-slate-50 rounded border border-slate-250 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 font-medium">不知道聊什么？快查看 HR 破冰关门宝典。</span>
            </div>
            <button
              onClick={onViewTips}
              className="text-[11px] font-bold text-orange-600 underline hover:text-orange-750 cursor-pointer shrink-0"
            >
              立刻了解
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-10 border border-dashed border-orange-200 text-center space-y-4">
          <p className="text-xs text-slate-400 italic">当前没有可用来做匹配的同事了哦。</p>
          <button 
            onClick={() => setCurrentIndex(0)}
            className="px-4 py-2 bg-orange-600 text-white rounded text-xs font-bold cursor-pointer hover:bg-orange-700 transition flex items-center gap-1.5 mx-auto shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            重置雷达序列
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Building2, ClipboardCheck, Clock, ShieldAlert, Trash2, Edit3, Check, Heart, Trophy 
} from 'lucide-react';
import { User, Badge, Restaurant } from '../types';

interface PersonaEditProps {
  user: User;
  onUpdateUser: (newUser: User) => void;
  badges: Badge[];
  favorites: Restaurant[];
  onRemoveFavorite: (id: string) => void;
}

const AVAILABLE_SKILLS = ['PPT设计', 'AI写作', '猫奴', '风光摄影', 'MBTI分析', 'C++内核', '脱口秀', '吉他手', '旅游达人', '球鞋收藏'];
const SOCIALS = ['安静吃饭', '轻聊天', '可聊工作'];

export default function PersonaEdit({ 
  user, 
  onUpdateUser, 
  badges, 
  favorites,
  onRemoveFavorite 
}: PersonaEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user.nickname);
  const [department, setDepartment] = useState(user.department);
  const [jobTitle, setJobTitle] = useState(user.jobTitle);
  const [onboardingDays, setOnboardingDays] = useState(user.onboardingDays);
  const [socialPreference, setSocialPreference] = useState(user.socialPreference);
  const [budgetRange, setBudgetRange] = useState(user.budgetRange);
  const [lunchStartTime, setLunchStartTime] = useState(user.lunchStartTime);
  const [lunchEndTime, setLunchEndTime] = useState(user.lunchEndTime);
  const [wechatId, setWechatId] = useState(user.wechatId || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [skillTags, setSkillTags] = useState<string[]>(user.skillTags);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      nickname,
      department,
      jobTitle,
      onboardingDays: Number(onboardingDays),
      socialPreference,
      budgetRange,
      lunchStartTime,
      lunchEndTime,
      wechatId,
      phone,
      skillTags
    });
    setIsEditing(false);
  };

  const handleToggleSkill = (skill: string) => {
    setSkillTags((prev) => 
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill].slice(0, 5) // 最多5个
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 ms-1 text-slate-800">
      {/* 头部人设信息横幅 */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-orange-600 via-orange-500 to-amber-700 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute right-1/4 -top-10 w-32 h-32 rounded-full bg-white/5 blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="relative shrink-0">
            <img 
              src={user.avatar} 
              alt={user.nickname} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded object-cover border-2 border-white/20 shadow-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
              }}
            />
            {user.onboardingDays <= 90 && (
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 text-[10px] bg-green-600 text-white rounded font-medium border border-white">
                新人 🧊
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-bold truncate">{user.nickname}</h2>
              {user.onboardingDays <= 90 ? (
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium bg-green-500/20 backdrop-blur rounded text-green-100 self-center">
                  入职第 {user.onboardingDays} 天 · 新人破冰期 🧊
                </span>
              ) : (
                <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium bg-white/15 backdrop-blur rounded text-slate-200 self-center">
                  园区老友
                </span>
              )}
            </div>

            <p className="text-sm text-slate-100 flex items-center justify-center sm:justify-start gap-1.5 opacity-90 truncate">
              <Building2 className="w-4 h-4 text-orange-200" />
              {user.companyName} · {user.department} · {user.jobTitle}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1.5">
              {user.skillTags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded bg-white/10 text-white font-medium border border-white/5">
                  ✨ {tag}
                </span>
              ))}
              <span className="px-2 py-0.5 text-xs rounded bg-orange-500/20 text-orange-100 font-bold border border-orange-400/20">
                💬 {user.socialPreference}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition cursor-pointer self-center"
          >
            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {isEditing ? '取消编辑' : '编辑午饭人设'}
          </button>
        </div>
      </div>

      {isEditing ? (
        /* 编辑状态 */
        <div className="bg-white rounded-xl p-6 border border-orange-100 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-orange-100">⚙️ 完善我的工位午餐卡资料</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">我的昵称 (用于就餐饭卡展示)</label>
              <input 
                type="text" 
                value={nickname} 
                onChange={(e) => setNickname(e.target.value)}
                className="w-full p-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">入职天数 (小于等于90天享受新人破冰保障)</label>
              <input 
                type="number" 
                value={onboardingDays} 
                onChange={(e) => setOnboardingDays(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">部门部门</label>
              <input 
                type="text" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">我的岗位/业务线</label>
              <input 
                type="text" 
                value={jobTitle} 
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full p-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">微信号 wechat (仅打卡反馈通过时分享)</label>
              <input 
                type="text" 
                value={wechatId} 
                onChange={(e) => setWechatId(e.target.value)}
                placeholder="WeChat ID"
                className="w-full p-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 border-slate-200 bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">电话号码 phone (仅打卡反馈通过时分享)</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="PhoneNumber"
                className="w-full p-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* 社交偏好 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-550 block">就餐社交期待</label>
            <div className="flex gap-2">
              {SOCIALS.map((soc) => (
                <button
                  key={soc}
                  type="button"
                  onClick={() => setSocialPreference(soc)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    socialPreference === soc 
                      ? 'bg-orange-50 border-orange-300 text-orange-700' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {soc}
                </button>
              ))}
            </div>
          </div>

          {/* 品类特征 */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-550 block">
              我最拿手的“破冰聊天话题”或“个人技能” (最多选5个)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SKILLS.map((sk) => {
                const isSel = skillTags.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => handleToggleSkill(sk)}
                    className={`px-3 py-1 text-xs rounded-full border transition cursor-pointer ${
                      isSel 
                        ? 'bg-orange-50 border-orange-300 text-orange-700 font-semibold' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    ✨ {sk}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-750 text-white rounded-lg text-xs font-extrabold cursor-pointer transition shadow-sm"
            >
              保存修改
            </button>
          </div>
        </div>
      ) : (
        /* 展示状态 */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* 左侧：日常详情展示 */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-805 flex items-center gap-1.5 border-b border-orange-100 pb-2">
                <ClipboardCheck className="w-4 h-4 text-orange-600" />
                我基础午餐倾向
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">搭档匹配状态</span>
                  <span className="text-xs font-medium px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-100 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    雷达接收中
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">首选午饭时段</span>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {user.lunchStartTime}-{user.lunchEndTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">平时客单价</span>
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {user.budgetRange || budgetRange || '¥30-¥50'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">最大容忍距离</span>
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    1000m (步行约12分钟)
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2">
                  <span className="text-xs text-slate-400">暗号信箱</span>
                  <span className="text-xs italic text-slate-500 font-medium">
                    绑定成功 (加锁托管中)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：勋章展示 + 收藏列表 */}
          <div className="md:col-span-2 space-y-6">
            {/* 勋章馆 */}
            <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-orange-100">
                <h3 className="text-sm font-semibold text-slate-805 flex items-center gap-1.5 animate-pulse">
                  <Trophy className="w-4 h-4 text-orange-600" />
                  就餐勋章馆 <span className="text-xs font-normal text-slate-400">(系统自动打卡点亮)</span>
                </h3>
                <span className="text-[10px] font-mono text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 font-bold">
                  解锁进度: {badges.filter(b => b.unlocked).length} / {badges.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((b) => (
                  <div 
                    key={b.id} 
                    className={`p-3 rounded-lg border transition-all flex items-start gap-2.5 ${
                      b.unlocked 
                        ? 'bg-orange-50/10 border-orange-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' 
                        : 'bg-slate-50/50 border-slate-150 opacity-65'
                    }`}
                  >
                    <span className="text-2xl mt-0.5 select-none">{b.icon}</span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-805 flex items-center gap-1.5">
                        <span>{b.name}</span>
                        {b.unlocked && (
                          <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 rounded font-mono font-bold scale-90">UNLOCKED</span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{b.desc}</p>
                      {b.progressText && (
                        <div className="text-[9px] font-mono text-slate-400">
                          打卡数: {b.progressText}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 我的收藏餐厅一览 */}
            <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 border-b border-orange-100 pb-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                我个人常用餐厅口袋名单 ({favorites.length})
              </h3>

              {favorites.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  您还没有通过点击周边美食的“心形”图标进行收录哦。
                </div>
              ) : (
                <div className="space-y-2">
                  {favorites.map((fav) => (
                    <div 
                      key={fav.restaurantId} 
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50/30 hover:bg-slate-50 flex items-center justify-between gap-3 animate-fade-in"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 animate-none">
                          <span>{fav.name}</span>
                          <span className="text-[9px] bg-orange-50 text-orange-700 border border-orange-100 px-1.5 py-0.5 rounded font-mono font-semibold">
                            {fav.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5 max-w-[280px] sm:max-w-[420px] truncate leading-none">
                          📍 {fav.address} · 距离当前 {fav.distance}m (步行大约{fav.walkingTime}分钟)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFavorite(fav.restaurantId)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-rose-50 transition cursor-pointer"
                        title="取消收藏"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

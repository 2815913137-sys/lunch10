/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, Utensils, Soup, Leaf, Sparkles, Clock, Compass, HelpCircle, ArrowRight, DollarSign, RotateCcw 
} from 'lucide-react';
import { TastePreference } from '../types';

interface TasteSelectProps {
  onComplete: (pref: TastePreference) => void;
  initialPreference?: TastePreference;
  mode: 'solo' | 'partner';
}

const CATEGORIES = [
  { id: '火锅', label: '热气火锅', sub: '川渝/潮汕/酸汤', icon: Flame, color: 'text-rose-500 bg-rose-50 border-rose-100 hover:bg-rose-100' },
  { id: '炒菜', label: '经典川湘粤炒菜', sub: '下饭神器锅气浓', icon: Utensils, color: 'text-orange-500 bg-orange-50 border-orange-100 hover:bg-orange-100' },
  { id: '轻食', label: '轻食低脂沙拉', sub: '健康无油嚼绿叶', icon: Leaf, color: 'text-emerald-500 bg-emerald-50 border-emerald-100 hover:bg-emerald-100' },
  { id: '汤粉面', label: '热气汤粉面', sub: '吸溜10分钟吃完', icon: Soup, color: 'text-amber-500 bg-amber-50 border-amber-100 hover:bg-amber-100' },
  { id: '精致粤菜', label: '经典粤菜烧腊', sub: '精致不咸适合吹水', icon: Sparkles, color: 'text-purple-500 bg-purple-50 border-purple-100 hover:bg-purple-100' },
  { id: '东南亚菜', label: '冬阴功东南亚菜', sub: '泰式椰风味蕾跃动', icon: Compass, color: 'text-orange-500 bg-orange-55 border-orange-100 hover:bg-orange-100' },
  { id: '咖啡简餐', label: '惬意咖啡烘焙', sub: '贝果三明治商务谈', icon: Sparkles, color: 'text-cyan-500 bg-cyan-50 border-cyan-100 hover:bg-cyan-100' },
];

const BUDGETS = ['¥30以下', '¥30-¥50', '¥50-¥80', '¥80以上'];
const DISTANCES = [
  { label: '300m 以内 (下楼就到)', value: 300 },
  { label: '500m (步行约 5-8 分钟)', value: 500 },
  { label: '1km 极限 (午休健步走走)', value: 1000 }
];
const TIMES = ['立即出发', '12:00', '12:15', '12:30', '12:45', '13:00'];
const AVOIDANCES = ['素食主义 / 不吃肉', '不要辣', '不要香菜', '不加洋葱', '海鲜过敏', '少油低盐'];

export default function TasteSelect({ onComplete, initialPreference, mode }: TasteSelectProps) {
  const [tasteStrength, setTasteStrength] = useState<TastePreference['tasteStrength']>(
    initialPreference?.tasteStrength || '清淡一点'
  );
  const [category, setCategory] = useState<string>(initialPreference?.category || '火锅');
  const [budgetRange, setBudgetRange] = useState<string>(initialPreference?.budgetRange || '¥30-¥50');
  const [departureTime, setDepartureTime] = useState<string>(initialPreference?.departureTime || '立即出发');
  const [distance, setDistance] = useState<number>(initialPreference?.distance || 500);
  const [selectedAvoidances, setSelectedAvoidances] = useState<string[]>(initialPreference?.avoidances || []);

  // 随机爆梗推荐器
  const handleRandomize = () => {
    // 随机选择品类
    const randCatArr = CATEGORIES.map((c) => c.id);
    const randomCat = randCatArr[Math.floor(Math.random() * randCatArr.length)];
    setCategory(randomCat);

    // 随机味觉
    const strengths: TastePreference['tasteStrength'][] = ['清淡一点', '众口一点', '重口一点', '随机'];
    setTasteStrength(strengths[Math.floor(Math.random() * strengths.length)]);

    // 随机预算
    setBudgetRange(BUDGETS[Math.floor(Math.random() * BUDGETS.length)]);

    // 随机时间
    setDepartureTime(TIMES[Math.floor(Math.random() * TIMES.length)]);

    // 随机距离
    const dists = [300, 500, 1000];
    setDistance(dists[Math.floor(Math.random() * dists.length)]);
  };

  const handleToggleAvoidance = (tag: string) => {
    setSelectedAvoidances((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      tasteStrength,
      category,
      budgetRange,
      departureTime,
      distance,
      avoidances: selectedAvoidances
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 pb-12 animate-fade-in ms-1 text-slate-800">
      {/* 头部精美状态条 */}
      <div className="flex items-center justify-between border-b pb-4 border-orange-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-orange-50 text-orange-750 border border-orange-200 block">
              {mode === 'partner' ? '👬 匹配搭子模式' : '🚶 一人食模式'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mt-2 flex items-center gap-2">
            今天中午想吃什么？ <Sparkles className="w-5 h-5 text-orange-600 fill-orange-100" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            告诉我们你今天的真实味蕾需求，系统以此为您精准检索 1 公里内的饭点或最重合的同事搭子。
          </p>
        </div>

        <button
          type="button"
          onClick={handleRandomize}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 border border-orange-100 bg-white hover:bg-orange-50 rounded-lg transition-all shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-orange-500" />
          帮我随便决定
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 左侧及中间主要选择器 */}
        <div className="md:col-span-2 space-y-6">
          {/* 1. 今日口味强度 */}
          <div className="space-y-3">
            <label className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-orange-500" /> 
              01 / 今日口味期望口味强度
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['清淡一点', '众口一点', '重口一点', '随机'] as TastePreference['tasteStrength'][]).map((st) => {
                const isActive = tasteStrength === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setTasteStrength(st)}
                    className={`p-3 text-xs sm:text-sm font-semibold rounded-xl transition-all border text-center cursor-pointer ${
                      isActive 
                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm ring-2 ring-orange-100' 
                        : 'bg-white text-slate-600 border-slate-200/85 hover:border-orange-300 hover:text-slate-900'
                    }`}
                  >
                    {st === '清淡一点' && '🍃 '}
                    {st === '众口一点' && '🍲 '}
                    {st === '重口一点' && '🔥 '}
                    {st === '随机' && '🔮 '}
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 餐饮品类 (精美双行卡片) */}
          <div className="space-y-3">
            <label className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-orange-500" /> 
              02 / 核心食物品类 (必须选择一个)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left cursor-pointer transition-all duration-300 transform ${
                      isActive 
                        ? 'bg-gradient-to-br from-orange-600 to-amber-700 border-amber-750 text-white shadow-md' 
                        : 'bg-white border-slate-200 hover:border-orange-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-all ${isActive ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-850'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>
                        {cat.id}
                      </div>
                      <div className={`text-xs mt-0.5 ${isActive ? 'text-orange-100' : 'text-slate-400'}`}>
                        {cat.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 右侧边栏：附加细节选择（预算、距离、时间、忌口） */}
        <div className="space-y-6 bg-white p-5 rounded-xl border border-orange-105 shadow-sm">
          {/* 3. 人均预算 */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold font-mono text-slate-400 uppercase flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              人均消费预期
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BUDGETS.map((bud) => {
                const isActive = budgetRange === bud;
                return (
                  <button
                    key={bud}
                    type="button"
                    onClick={() => setBudgetRange(bud)}
                    className={`py-2 text-[11px] sm:text-xs font-semibold rounded-lg text-center border cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-orange-600 text-white border-orange-650 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-orange-50/50 hover:border-orange-200'
                    }`}
                  >
                    {bud}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 出发时间 */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold font-mono text-slate-400 uppercase flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-550" />
              期待用餐出行时间
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {TIMES.map((t) => {
                const isActive = departureTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setDepartureTime(t)}
                    className={`py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg text-center border cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                        : 'bg-white text-slate-550 border-slate-200 hover:text-slate-800 hover:border-orange-200'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. 步行距离 */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-bold font-mono text-slate-400 uppercase">
              🚶 我所能接受的步行距离
            </label>
            <div className="space-y-2">
              {DISTANCES.map((d) => {
                const isActive = distance === d.value;
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDistance(d.value)}
                    className={`w-full py-2 px-3 text-xs text-left font-medium rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-orange-50/50 border-orange-500 text-orange-750 font-bold shadow-sm'
                        : 'bg-white/80 border-slate-200 text-slate-500 hover:text-slate-700 hover:border-orange-200'
                    }`}
                  >
                    <span>{d.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${isActive ? 'bg-orange-100 text-orange-700 font-bold' : 'bg-slate-100 text-slate-500'}`}>
                      {d.value}m
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. 忌口过敏（多选） */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold font-mono text-slate-400 uppercase flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              忌口或特殊避让
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVOIDANCES.map((tag) => {
                const isActive = selectedAvoidances.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleAvoidance(tag)}
                    className={`py-1 px-2.5 text-[10px] sm:text-xs rounded-full border transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-orange-55 bg-orange-50 border-orange-300 text-orange-700 font-semibold'
                        : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:border-orange-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 底部提交导航 */}
      <div className="flex items-center justify-between pt-6 border-t border-orange-100 bg-white/80 backdrop-blur sticky bottom-0 z-20 pb-4">
        <div className="text-xs text-slate-450 flex items-center gap-1 font-mono">
          <span>今日已就绪:</span>
          <span className="font-bold text-orange-650">{tasteStrength}</span> · 
          <span className="font-bold text-orange-650">{category}</span> · 
          <span className="font-bold text-orange-650">{budgetRange}</span>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all"
        >
          {mode === 'partner' ? '开始雷达检索并匹配搭子' : '立即查看附近1KM一人食美食'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

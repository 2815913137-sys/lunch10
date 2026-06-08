/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Search, Compass, Star, ChevronRight, Heart, Navigation 
} from 'lucide-react';
import { Restaurant, TastePreference } from '../types';
import MapPlaceholder from './MapPlaceholder';

interface DiscoverySectionProps {
  restaurants: Restaurant[];
  favorites: Restaurant[];
  onToggleFavorite: (id: string) => void;
  onProceedToRestaurant: (restaurant: Restaurant) => void;
  tastePreference: TastePreference | null;
  companyName: string;
}

export default function DiscoverySection({
  restaurants,
  favorites,
  onToggleFavorite,
  onProceedToRestaurant,
  tastePreference,
  companyName
}: DiscoverySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(tastePreference?.category || '全部');
  const [selectedDistance, setSelectedDistance] = useState<number>(tastePreference?.distance || 1000);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('全部');
  
  // 仅适合一人食的过滤标帜
  const [filterSoloOnly, setFilterSoloOnly] = useState(false);
  const [filterFastOnly, setFilterFastOnly] = useState(false);

  // 所有可用分类
  const categoriesList = useMemo(() => {
    const raw = restaurants.map((r) => r.category);
    return ['全部', ...Array.from(new Set(raw))];
  }, [restaurants]);

  // 过滤后的餐厅列表
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((rest) => {
      // 1. 分类匹配
      if (selectedCategory !== '全部' && rest.category !== selectedCategory) {
        return false;
      }
      // 2. 距离限制
      if (rest.distance > selectedDistance) {
        return false;
      }
      // 3. 预算匹配
      if (budgetFilter !== '全部') {
        if (budgetFilter === '¥30以下' && rest.avgPrice >= 30) return false;
        if (budgetFilter === '¥30-¥50' && (rest.avgPrice < 30 || rest.avgPrice > 50)) return false;
        if (budgetFilter === '¥50-¥80' && (rest.avgPrice < 55 || rest.avgPrice > 80)) return false;
        if (budgetFilter === '¥80以上' && rest.avgPrice < 80) return false;
      }
      // 4. 用户搜索 query
      if (searchQuery && !rest.name.toLowerCase().includes(searchQuery.toLowerCase()) && !rest.featuredDish.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // 5. 特色标帜
      if (filterSoloOnly && !rest.suitability.solo) return false;
      if (filterFastOnly && !rest.suitability.fast) return false;

      return true;
    });
  }, [restaurants, selectedCategory, selectedDistance, budgetFilter, searchQuery, filterSoloOnly, filterFastOnly]);

  const handleSelectFromMap = (id: string) => {
    setSelectedId(id);
    const el = document.getElementById(`rest-card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in ms-1 text-slate-800">
      {/* 头部今日指引 */}
      <div className="bg-white p-5 rounded-xl border border-orange-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-orange-850 flex items-center gap-1.5 animate-pulse">
            <Compass className="w-4 h-4 text-orange-600" />
            1 公里精选发现
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-[550px]">
            {tastePreference ? (
              <span>
                系统已为您筛选：口味强度 <b className="text-orange-650 font-bold">{tastePreference.tasteStrength}</b> · 
                品类 <b className="text-orange-650 font-bold">{tastePreference.category}</b> · 
                预算 <b className="text-orange-650 font-bold">{tastePreference.budgetRange}</b> · 
                半径限制 <b className="text-orange-650 font-bold">{tastePreference.distance}m</b> 的精选就餐点。
              </span>
            ) : (
              <span>搜索周边步行 10 分钟圈内深受阿里、蚂蚁白领喜爱、支持避坑好评的优质午餐圣地。</span>
            )}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <div className="text-xs bg-orange-50/20 py-1.5 px-3 rounded border border-orange-150 flex items-center gap-1 font-mono text-slate-600">
            <span>当前筛选:</span> 
            <span className="text-orange-600 font-extrabold">{filteredRestaurants.length}</span>
            <span>个结果</span>
          </div>
        </div>
      </div>

      {/* 极速搜索 & 统一过滤条 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="搜索附近美食、招牌菜(如：牛肉丸、沙拉)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-orange-100 bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select 
          value={budgetFilter} 
          onChange={(e) => setBudgetFilter(e.target.value)}
          className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-orange-100 bg-white text-slate-705 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400"
        >
          <option value="全部">价格: 全部预算</option>
          <option value="¥30以下">¥30以下</option>
          <option value="¥30-¥50">¥30-¥50</option>
          <option value="¥50-¥80">¥50-¥80</option>
          <option value="¥80以上">¥80以上</option>
        </select>

        <select 
          value={selectedDistance} 
          onChange={(e) => setSelectedDistance(Number(e.target.value))}
          className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-orange-100 bg-white text-slate-705 cursor-pointer focus:outline-none focus:border-orange-400"
        >
          <option value={300}>距离: 300m以内</option>
          <option value={500}>距离: 500m以内</option>
          <option value={1000}>距离: 1km以内</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-1.5 pb-2">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-slate-800 text-white border-slate-800 font-bold' 
                : 'bg-white text-slate-600 border-slate-205 hover:border-orange-300'
            }`}
          >
            {cat}
          </button>
        ))}

        <div className="w-[1px] h-4 bg-slate-200 self-center mx-2" />

        <button
          onClick={() => setFilterSoloOnly(!filterSoloOnly)}
          className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
            filterSoloOnly 
              ? 'bg-orange-50 text-orange-700 border-orange-200 font-semibold' 
              : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200'
          }`}
        >
          一人食必备 🚶
        </button>

        <button
          onClick={() => setFilterFastOnly(!filterFastOnly)}
          className={`px-3 py-1 text-xs rounded-full border transition-all cursor-pointer flex items-center gap-1 ${
            filterFastOnly 
              ? 'bg-orange-50 text-orange-700 border-orange-200 font-semibold' 
              : 'bg-white text-slate-500 border-slate-200 hover:border-orange-200'
          }`}
        >
          出餐极速 ⚡
        </button>
      </div>

      {/* 左右结构：左边地图，右边列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 左侧地图交互模块 */}
        <div className="lg:col-span-5 sticky top-20">
          <MapPlaceholder 
            restaurants={filteredRestaurants}
            selectedId={selectedId}
            onSelectRestaurant={handleSelectFromMap}
            companyName={companyName}
          />
        </div>

        {/* 右侧列表模块 */}
        <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-1">
          {filteredRestaurants.length === 0 ? (
            <div className="bg-white rounded-xl p-10 border border-dashed border-orange-200 text-center text-slate-400 italic text-xs">
              哎呀，当前筛选或 1.5km 范围附近没有完全匹配口味的店铺啦。可以在上面尝试“扩大范围”或修改“餐饮分类”。
            </div>
          ) : (
            filteredRestaurants.map((rest) => {
              const isFav = favorites.some((f) => f.restaurantId === rest.restaurantId);
              const isSelected = selectedId === rest.restaurantId;

              return (
                <div 
                  key={rest.restaurantId}
                  id={`rest-card-${rest.restaurantId}`}
                  onClick={() => setSelectedId(rest.restaurantId)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected 
                      ? 'bg-orange-50/15 border-orange-400 ring-1 ring-orange-100 shadow-sm translate-x-0.5' 
                      : 'bg-white border-slate-200 hover:border-orange-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {rest.category}
                        </span>
                        {rest.subCategory && (
                          <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-700 px-1.5 py-0.5 rounded font-bold">
                            {rest.subCategory}
                          </span>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          rest.crowdLevel === '空闲' ? 'bg-emerald-50 text-emerald-700' :
                          rest.crowdLevel === '正常' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-650 animate-pulse'
                        }`}>
                          ● {rest.crowdLevel}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-2 flex items-center gap-1.5">
                        {rest.name}
                      </h3>

                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 font-mono">
                        <Navigation className="w-3 h-3 text-slate-400" />
                        距离公司 {rest.distance}m · 步行约 {rest.walkingTime} 分钟 · 🗺 {rest.address}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(rest.restaurantId);
                        }}
                        className={`p-2 rounded-lg border transition-all cursor-pointer ${
                          isFav 
                            ? 'bg-rose-50 border-rose-200 text-rose-500 fill-rose-500' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600'
                        }`}
                        title={isFav ? '取消收藏' : '加入收藏'}
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 中午人均，评分等关键细部 */}
                  <div className="flex items-center gap-4 mt-3 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                    <div className="text-xs">
                      <span className="text-slate-400">人均限额:</span>{' '}
                      <b className="text-slate-800 font-mono">¥{rest.avgPrice}</b>
                    </div>
                    <div className="w-[1px] h-3 bg-slate-200" />
                    <div className="flex items-center gap-0.5 text-xs text-orange-500 font-mono font-bold">
                      <Star className="w-3.5 h-3.5 fill-orange-550 text-orange-550 text-orange-500" />
                      {rest.rating} 分
                    </div>
                    <div className="w-[1px] h-3 bg-slate-200" />
                    <div className="text-[11px] text-slate-505 truncate flex-1 font-sans">
                      🍲 招牌: <b className="text-slate-700">{rest.featuredDish}</b>
                    </div>
                  </div>

                  {/* 推荐理由 */}
                  <p className="text-xs text-slate-600 leading-relaxed mt-2 p-1.5 border-l-2 border-orange-500 pl-2.5 bg-slate-50/50">
                     {rest.recommendReason}
                  </p>

                  {/* 适合维度标签展示 */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 mt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1.5">
                      {rest.suitability.solo && (
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100">
                          🚶 适合一人食
                        </span>
                      )}
                      {rest.suitability.chat && (
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">
                          💬 适合聊天
                        </span>
                      )}
                      {rest.suitability.fast && (
                        <span className="text-[10px] font-bold text-pink-700 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                          ⚡ 10分钟出餐
                        </span>
                      )}
                      {rest.suitability.group && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          🤝 支持大桌拼聚
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProceedToRestaurant(rest);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition cursor-pointer self-end shadow-sm"
                    >
                      我定这家前往
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

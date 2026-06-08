/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MapPin, Navigation, PersonStanding, RefreshCw } from 'lucide-react';
import { Restaurant } from '../types';

interface MapPlaceholderProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelectRestaurant: (id: string) => void;
  companyName: string;
}

export default function MapPlaceholder({
  restaurants,
  selectedId,
  onSelectRestaurant,
  companyName
}: MapPlaceholderProps) {
  const [radarAngle, setRadarAngle] = useState(0);

  // 模拟雷达扫描动画
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // 映射餐厅距离和位置到 400x300 的 SVG 空间内
  // 中心点 (200, 150) 代表公司
  const cx = 200;
  const cy = 150;

  // 将餐厅分配到不同的极坐标上，以免重叠
  const getCoordinates = (distance: number, index: number) => {
    // 假设 1000m 对应 130px 像素半径
    const maxDistanceInPixels = 130;
    const radius = Math.max(25, (distance / 1000) * maxDistanceInPixels + 20);
    // 均匀分布角度
    const angle = (index * (360 / Math.max(1, restaurants.length)) * Math.PI) / 180;
    
    // 加一点倾斜
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return { x, y };
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '火锅': return 'fill-rose-500 stroke-rose-600 bg-rose-500';
      case '炒菜': return 'fill-amber-500 stroke-amber-600 bg-amber-500';
      case '轻食': return 'fill-emerald-500 stroke-emerald-600 bg-emerald-500';
      case '汤粉面': return 'fill-blue-500 stroke-blue-600 bg-blue-500';
      case '精致粤菜': return 'fill-purple-500 stroke-purple-600 bg-purple-500';
      default: return 'fill-orange-500 stroke-orange-600 bg-orange-500';
    }
  };

  return (
    <div className="relative w-full h-[320px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between">
      {/* 顶部指示条 */}
      <div className="absolute top-3 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono font-medium text-slate-300">
            1KM 园区分区定位系统 Active
          </span>
        </div>
        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5 bg-slate-950/40 px-2 py-1 rounded-md">
          <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />
          AUTO-SCANNING
        </div>
      </div>

      {/* SVG画板 */}
      <svg className="w-full h-full cursor-grab active:cursor-grabbing" viewBox="0 0 400 300">
        <defs>
          {/* 雷达扫描渐变 */}
          <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.2" />
            <stop offset="85%" stopColor="#0f172a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </radialGradient>
          {/* 渐变遮罩 */}
          <linearGradient id="scanLine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 底盘背景 */}
        <rect width="400" height="300" fill="url(#radarGrad)" />

        {/* 100m, 300m, 500m, 1km 刻度同心圆 */}
        <circle cx={cx} cy={cy} r="35" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />
        <circle cx={cx} cy={cy} r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" />
        <circle cx={cx} cy={cy} r="105" fill="none" stroke="#334155" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r="135" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="6,4" />

        {/* 同心圆刻度文字说明 */}
        <text x={cx + 38} y={cy + 4} fill="#64748b" fontSize="8" fontFamily="monospace">300m</text>
        <text x={cx + 73} y={cy + 4} fill="#64748b" fontSize="8" fontFamily="monospace">500m</text>
        <text x={cx + 108} y={cy + 4} fill="#64748b" fontSize="8" fontFamily="monospace">1km</text>

        {/* 雷达扫描切片线 */}
        <line x1={cx} y1={cy} x2={cx + 150 * Math.cos((radarAngle * Math.PI) / 180)} y2={cy + 150 * Math.sin((radarAngle * Math.PI) / 180)} stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.4" />
        
        {/* 指标十字星 */}
        <line x1={cx - 145} y1={cy} x2={cx + 145} y2={cy} stroke="#1e293b" strokeWidth="0.5" />
        <line x1={cx} y1={cy - 120} x2={cx} y2={cy + 120} stroke="#1e293b" strokeWidth="0.5" />

        {/* 渲染餐厅位置 blips */}
        {restaurants.map((rest, idx) => {
          const { x, y } = getCoordinates(rest.distance, idx);
          const isSelected = selectedId === rest.restaurantId;
          const catColor = getCategoryColor(rest.category);

          return (
            <g key={rest.restaurantId} className="cursor-pointer group" onClick={() => onSelectRestaurant(rest.restaurantId)}>
              {/* 选中时的呼吸波动圈 */}
              {isSelected && (
                <circle cx={x} cy={y} r="14" fill="#f97316" fillOpacity="0.15" className="animate-ping" style={{ animationDuration: '2s' }} />
              )}
              {/* 外部Hover高亮框 */}
              <circle cx={x} cy={y} r={isSelected ? 10 : 7} fill="transparent" stroke="#f97316" strokeWidth="1.5" strokeOpacity={isSelected ? 1 : 0} className="transition-all duration-300 group-hover:stroke-opacity-70 group-hover:r-[9]" />

              {/* 路径线：从中心（公司）指向餐厅 */}
              {isSelected && (
                <path d={`M ${cx} ${cy} Q ${(cx+x)/2 - 10} ${(cy+y)/2 - 10} ${x} ${y}`} fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,2" strokeOpacity="0.8" className="animate-dash" />
              )}

              {/* 品类颜色小点点 */}
              <circle cx={x} cy={y} r={isSelected ? 5.5 : 4} className={`${catColor} transition-all duration-300 cursor-pointer shadow-md`} />

              {/* 餐厅名字卡片标签浮动 (选中或Hover时显示) */}
              <g className={`transition-all duration-300 pointer-events-none ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
                <rect x={x - 45} y={y - 25} width="90" height="15" rx="3" fill="#0f172a" fillOpacity="0.95" stroke="#475569" strokeWidth="1" />
                <text x={x} y={y - 15} textAnchor="middle" fill="#f1f5f9" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                  {rest.name.length > 8 ? `${rest.name.substring(0, 7)}...` : rest.name}
                </text>
              </g>
            </g>
          );
        })}

        {/* 中心点：我的公司位置 */}
        <g>
          <circle cx={cx} cy={cy} r="18" fill="#f97316" fillOpacity="0.1" className="animate-pulse" />
          <circle cx={cx} cy={cy} r="8" fill="#f97316" />
          <circle cx={cx} cy={cy} r="4" fill="#ffffff" />
        </g>
      </svg>

      {/* 底部导航面板 */}
      <div className="bg-slate-950/90 backdrop-blur-md px-4 py-3 border-t border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-1 px-1.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <MapPin className="w-3 h-3 text-orange-500" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono">MY CENTER OFFICE</div>
            <div className="text-xs font-semibold text-slate-200">{companyName}</div>
          </div>
        </div>

        {selectedId ? (
          (() => {
            const selectedRest = restaurants.find((r) => r.restaurantId === selectedId);
            if (!selectedRest) return null;
            return (
              <div className="flex items-center gap-3 animate-fade-in">
                <div className="text-right">
                  <div className="text-[11px] font-semibold text-slate-100">{selectedRest.name}</div>
                  <div className="text-[9px] text-slate-400 flex items-center justify-end gap-1 font-mono">
                    <Navigation className="w-2.5 h-2.5 text-orange-500" />
                    {selectedRest.distance}m · 步行约 {selectedRest.walkingTime} 分钟
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${getCategoryColor(selectedRest.category).split(' ')[0]}`} />
              </div>
            );
          })()
        ) : (
          <div className="text-[10px] text-slate-400 font-mono italic animate-pulse">
            点击地图上的色点探索餐厅位置与步行路线
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, CheckCircle, Navigation, Award, ArrowLeft, Star, Clock, Users, Flame, Compass, RefreshCw, X
} from 'lucide-react';
import { Restaurant } from '../types';

interface ParkMapProps {
  restaurants: Restaurant[];
  visitedIds: string[];
  onBack: () => void;
  onProceedSolo: (restaurant: Restaurant) => void;
}

export default function ParkMap({
  restaurants,
  visitedIds,
  onBack,
  onProceedSolo
}: ParkMapProps) {
  // 选中的餐厅，点击 Pin 后在侧边栏或底部展示详细操作卡片
  const [selectedMapRest, setSelectedMapRest] = useState<Restaurant | null>(restaurants[0]);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // 地图缩放/平移模拟
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetMap = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // 1公里范围内指定的 5 家大店及经纬度/坐标映射 (基于中心点 500, 350)
  // 按照相对方位合理分布
  const mapCoordinates: Record<string, { x: number; y: number }> = {
    'r001': { x: 580, y: 310 }, // 潮发·潮汕牛肉火锅 (科苑店) - 东北
    'r002': { x: 500, y: 460 }, // 栖贵贵·贵州酸汤火锅 - 正南
    'r003': { x: 380, y: 360 }, // 极野绿动轻食 (科技园店) - 西
    'r005': { x: 420, y: 240 }, // 老长沙手工粉面馆 - 西北
    'r006': { x: 620, y: 380 }, // 粤小馆·精致精致粤菜锦轩 - 东
    'r008': { x: 470, y: 330 }, // Manner Cafe - 近中
    'r004': { x: 530, y: 200 }, // 芈重山老火锅 (较远)
    'r010': { x: 340, y: 480 }, // 川北豆花 (西南)
  };

  const categories = [
    { id: 'all', label: '全部美食' },
    { id: '火锅', label: '🔥 火锅' },
    { id: '轻食', label: '🥗 轻食' },
    { id: '精致粤菜', label: '🐦 粤菜' },
    { id: '汤粉面', label: '🍜 粉面' },
    { id: 'visited', label: '✓ 已打卡' }
  ];

  // 过滤显示的餐厅
  const filteredRestaurants = restaurants.filter(rest => {
    if (activeFilter === 'all') return mapCoordinates[rest.restaurantId] !== undefined;
    if (activeFilter === 'visited') return visitedIds.includes(rest.restaurantId);
    return rest.category === activeFilter && mapCoordinates[rest.restaurantId] !== undefined;
  });

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col md:flex-row h-[720px] relative font-sans">
      
      {/* 1. 地图视图区 */}
      <div 
        className="flex-1 relative overflow-hidden bg-[#eef1f4] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* SVG 背景地图模拟：天河/科兴实境风格 */}
        <div 
          className="w-full h-full absolute inset-0 origin-center transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`
          }}
        >
          {/* 这里放置底图线条和建筑区片 */}
          <svg className="w-[1000px] h-[700px] pointer-events-none" viewBox="0 0 1000 700">
            {/* 水系 (体育西路/黄埔、东侧水道) */}
            <path d="M 0,650 Q 300,640 500,660 T 1000,600 L 1000,700 L 0,700 Z" fill="#cbe4f9" opacity="0.8" />
            
            {/* 绿色公园区 (珠江公园/天河公园) */}
            <rect x="750" y="480" width="200" height="150" rx="40" fill="#d0ebd5" opacity="0.9" />
            <text x="850" y="560" fill="#2d6a4f" fontSize="11" fontWeight="bold" opacity="0.6">珠江公园</text>

            <rect x="100" y="80" width="180" height="100" rx="20" fill="#ebd9d0" opacity="0.4" />
            <text x="190" y="130" fill="#8c583e" fontSize="10" fontWeight="bold" opacity="0.6">时代广场</text>

            {/* 主要街区建筑群 (灰色) */}
            <g fill="#e1e4e8" stroke="#d5d7db" strokeWidth="1" opacity="0.8">
              <rect x="50" y="200" width="120" height="90" rx="8" />
              <rect x="200" y="210" width="140" height="80" rx="8" />
              <rect x="370" y="120" width="110" height="80" rx="8" />
              {/* 天环广场 / 太古汇 */}
              <circle cx="430" cy="500" r="45" fill="#fadcbe" stroke="#e0b890" strokeWidth="1.5" />
              <rect x="620" y="240" width="150" height="110" rx="12" fill="#faf0e6" stroke="#e6ccb2" strokeWidth="1.5" />
            </g>
            
            <text x="430" y="500" fill="#a06030" fontSize="10" fontWeight="bold" textAnchor="middle">天环 Parc Central</text>
            <text x="695" y="300" fill="#8d5b4c" fontSize="10" fontWeight="bold" textAnchor="middle">太古汇</text>

            {/* 核心道路网 (宽白条配淡黄) */}
            <g stroke="#ffffff" strokeLinecap="round" opacity="0.9">
              {/* 天河路大动脉 */}
              <path d="M 0,350 L 1000,350" strokeWidth="24" />
              {/* 黄埔大道动脉 */}
              <path d="M 0,580 L 1000,580" strokeWidth="26" />
              {/* 科苑路/科苑北路/体育东路垂直支路 */}
              <path d="M 500,0 L 500,700" strokeWidth="22" />
              <path d="M 230,0 L 230,700" strokeWidth="16" />
              <path d="M 780,0 L 780,700" strokeWidth="18" />
              {/* 内环或斜走向街路 */}
              <path d="M 120,0 L 500,350" strokeWidth="12" />
              <path d="M 500,350 L 900,700" strokeWidth="12" />
            </g>

            <g stroke="#f5e1c8" strokeLinecap="round" opacity="0.6">
              {/* 道路中心引导黄色虚线 */}
              <path d="M 0,350 L 1000,350" strokeWidth="2" strokeDasharray="6,4" />
              <path d="M 0,580 L 1000,580" strokeWidth="2" strokeDasharray="6,4" />
              <path d="M 500,0 L 500,700" strokeWidth="2" strokeDasharray="6,4" />
            </g>

            {/* 道路名称标注 */}
            <g fill="#8f9bb3" fontSize="9" fontWeight="bold" letterSpacing="1">
              <text x="80" y="347">天河路 (科兴北段)</text>
              <text x="850" y="347" textAnchor="end">天河东路</text>
              <text x="80" y="577">黄埔大道隧道</text>
              <text x="510" y="40" writingMode="tb" glyphOrientationVertical="0">科苑北路 / 体育东路</text>
              <text x="240" y="40" writingMode="tb" glyphOrientationVertical="0">龙口西路</text>
              <text x="790" y="40" writingMode="tb" glyphOrientationVertical="0">五山路</text>
            </g>

            {/* 其他次要写实名片地标 (对应 Figure 1 图中) */}
            <g fill="#adb5bd" fontSize="8" fontWeight="medium">
              <text x="110" y="250" textAnchor="middle">富力盈丰大厦</text>
              <text x="270" y="260" textAnchor="middle">新创举大厦</text>
              <text x="350" y="630">富力盈力大厦</text>
              <text x="610" y="460">粤电广场</text>
              <text x="700" y="120">华师一站广场</text>
              <text x="720" y="500">万菱汇</text>
            </g>

            {/* 我方大本营中心: 蚂蚁智能科技园区 (科兴)  (中心坐标: 500, 350) */}
            <g className="animate-pulse">
              <circle cx="500" cy="350" r="32" fill="#f97316" fillOpacity="0.12" />
              <circle cx="500" cy="350" r="18" fill="#f97316" fillOpacity="0.25" />
            </g>
            <circle cx="500" cy="350" r="7" fill="#f97316" stroke="#ffffff" strokeWidth="2" />
            
            {/* 公司大牌浮标 */}
            <g>
              <rect x="420" y="300" width="160" height="22" rx="11" fill="#0f172a" stroke="#f97316" strokeWidth="1.5" />
              <text x="500" y="314" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="black" fontFamily="sans-serif">
                🏢 蚂蚁智能科技园区 (科兴)
              </text>
            </g>

            {/* 各大餐厅的连线和高亮 (如果被选中，拉一条精美激光虚线) */}
            {selectedMapRest && mapCoordinates[selectedMapRest.restaurantId] && (
              (() => {
                const coord = mapCoordinates[selectedMapRest.restaurantId];
                return (
                  <g>
                    <line 
                      x1="500" 
                      y1="350" 
                      x2={coord.x} 
                      y2={coord.y} 
                      stroke="#f97316" 
                      strokeWidth="2" 
                      strokeDasharray="4,3" 
                      className="animate-dash" 
                      opacity="0.8" 
                    />
                    <circle cx={coord.x} cy={coord.y} r="25" fill="none" stroke="#f97316" strokeWidth="1" className="animate-ping" style={{ animationDuration: '3s' }} />
                  </g>
                );
              })()
            )}
          </svg>

          {/* 绝对定位的餐厅图标/气泡 (允许点击) */}
          {filteredRestaurants.map((rest) => {
            const coord = mapCoordinates[rest.restaurantId];
            if (!coord) return null;

            const isSelected = selectedMapRest?.restaurantId === rest.restaurantId;
            const isVisited = visitedIds.includes(rest.restaurantId);

            return (
              <div 
                key={rest.restaurantId}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200"
                style={{
                  left: coord.x,
                  top: coord.y,
                  zIndex: isSelected ? 40 : 20
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMapRest(rest);
                }}
              >
                {/* 豪华版 Pin 气泡 */}
                <div className="flex flex-col items-center">
                  <motion.div 
                    whileHover={{ scale: 1.15 }}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full shadow-lg border transition ${
                      isSelected 
                        ? 'bg-orange-600 border-white text-white scale-110 z-30' 
                        : isVisited
                        ? 'bg-emerald-50 border-emerald-350 text-emerald-700'
                        : 'bg-white border-slate-350 text-slate-800 hover:border-orange-500'
                    }`}
                  >
                    <span className="text-[11px] leading-none">
                      {isVisited ? '✓' : '🍽️'}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold whitespace-nowrap leading-none">
                      {rest.name.replace(/\(.*?\)/g, '')}
                    </span>

                    {/* 已打卡醒目微标志 */}
                    {isVisited && (
                      <span className="text-[8px] bg-emerald-600 text-white font-extrabold px-1 rounded-sm">
                        已打卡
                      </span>
                    )}
                  </motion.div>
                  
                  {/* 小探针尖尖 */}
                  <div className={`w-2 h-2 rotate-45 -mt-1 border-r border-b ${
                    isSelected 
                      ? 'bg-orange-600 border-white' 
                      : isVisited
                      ? 'bg-emerald-50 border-emerald-350'
                      : 'bg-white border-slate-350'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 覆盖地图的操作浮层 - 平移缩放控制 */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 bg-slate-900/90 text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:bg-slate-800 transition shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            返回决策大厅
          </button>
        </div>

        {/* 右侧：地图重置/缩放小工具 */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-30">
          <button 
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.5))}
            className="w-9 h-9 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 flex items-center justify-center font-black rounded-lg text-lg shadow-lg cursor-pointer transition"
          >
            +
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
            className="w-9 h-9 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 flex items-center justify-center font-black rounded-lg text-lg shadow-lg cursor-pointer transition"
          >
            -
          </button>
          <button 
            onClick={resetMap}
            className="w-9 h-9 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 flex items-center justify-center rounded-lg shadow-lg cursor-pointer transition"
            title="重置居中"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* 顶部中央：品类过滤层 */}
        <div className="absolute top-4 right-4 left-4 sm:left-auto flex items-center gap-1 overflow-x-auto bg-slate-900/90 px-2 py-1.5 rounded-full border border-slate-700 shadow-md backdrop-blur-md max-w-full sm:max-w-md pointer-events-auto z-20 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveFilter(cat.id);
                // 自动选择该过滤中的第一家，避免右侧卡片落空
                const filtered = restaurants.filter(r => {
                  if (cat.id === 'all') return mapCoordinates[r.restaurantId] !== undefined;
                  if (cat.id === 'visited') return visitedIds.includes(r.restaurantId);
                  return r.category === cat.id && mapCoordinates[r.restaurantId] !== undefined;
                });
                if (filtered.length > 0) {
                  setSelectedMapRest(filtered[0]);
                }
              }}
              className={`px-3 py-1 text-[11px] font-bold rounded-full transition whitespace-nowrap cursor-pointer ${
                activeFilter === cat.id 
                  ? 'bg-orange-600 text-white shadow-sm' 
                  : 'text-slate-350 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. 右侧店铺详情控制面板 */}
      <div className="w-full md:w-[320px] bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col justify-between shrink-0 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          {selectedMapRest ? (
            <motion.div 
              key={selectedMapRest.restaurantId}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.18 }}
              className="space-y-4 flex-1 flex flex-col justify-between text-left"
            >
              <div>
                {/* 头部：分类和评分 */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    selectedMapRest.category === '火锅' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    selectedMapRest.category === '轻食' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    selectedMapRest.category === '汤粉面' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-amber-500/10 text-amber-450 border border-amber-500/20'
                  }`}>
                    {selectedMapRest.category} · {selectedMapRest.subCategory || '舒适美食'}
                  </span>
                  
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-[11px]">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-amber-400 font-bold">{selectedMapRest.rating}</span>
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="text-base font-extrabold text-white mt-2 leading-snug">
                  {selectedMapRest.name}
                </h3>

                {/* 打卡状态条 */}
                <div className="mt-1 flex items-center gap-1.5">
                  {visitedIds.includes(selectedMapRest.restaurantId) ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10" />
                      您已经亲自打卡过了 ✓
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      🚶 距离您 <b>{selectedMapRest.distance}m</b> · 近邻等就餐区
                    </span>
                  )}
                </div>

                {/* 推荐词 */}
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-350 leading-relaxed mt-4.5 space-y-1">
                  <div className="text-[10px] font-bold text-orange-455 font-mono uppercase">
                     🌟 园区推荐指数 & 避坑指引:
                  </div>
                  <p>{selectedMapRest.recommendReason}</p>
                </div>

                {/* 招牌菜 / 步行时长 */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px]">
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-900/60">
                    <span className="text-slate-500 block font-bold leading-none">热销经典菜</span>
                    <span className="text-slate-200 block text-xs mt-1 truncate font-semibold">
                      {selectedMapRest.featuredDish}
                    </span>
                  </div>
                  <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-900/60">
                    <span className="text-slate-500 block font-bold leading-none">估计步行时间</span>
                    <span className="text-slate-200 block text-xs mt-1 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-white" />
                      约 {selectedMapRest.walkingTime} 分钟
                    </span>
                  </div>
                </div>

                {/* 排队现状 */}
                <div className="flex items-center justify-between bg-slate-900/30 p-2 rounded-lg border border-slate-900 mt-3 text-[11px] font-mono">
                  <span className="text-slate-500">午高峰排队状态:</span>
                  <span className={`px-2 py-0.5 rounded font-bold leading-none ${
                    selectedMapRest.crowdLevel === '空闲' ? 'bg-green-500/10 text-green-400' :
                    selectedMapRest.crowdLevel === '正常' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {selectedMapRest.crowdLevel}
                  </span>
                </div>
              </div>

              {/* 核心操作按钮 */}
              <div className="pt-4 border-t border-slate-900 space-y-2">
                <button
                  type="button"
                  onClick={() => onProceedSolo(selectedMapRest)}
                  className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs font-extrabold shadow-md transition duration-200 cursor-pointer flex items-center justify-center gap-1"
                >
                  <Navigation className="w-4 h-4 text-white" />
                  锁定这家：立刻前往就餐打卡
                </button>
                <div className="text-[10px] text-slate-500 font-mono text-center">
                  * 锁定后将生成就餐路径，到店即可打卡反馈
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center text-xs space-y-2">
              <Compass className="w-8 h-8 text-slate-655 animate-spin" />
              <p>请点击地图上的气泡标志<br />查看优质餐厅的雷达足迹 🗺️</p>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

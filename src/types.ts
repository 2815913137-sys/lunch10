/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  userId: string;
  nickname: string;
  avatar: string;
  companyId: string;
  companyName: string;
  department: string;
  jobTitle: string;
  onboardingDays: number; // 入职天数
  lunchStartTime: string; // "12:00"
  lunchEndTime: string;   // "14:00"
  tasteTags: string[];
  skillTags: string[];
  socialPreference: string; // "安静吃饭" | "轻聊天" | "可聊工作"
  budgetRange: string; // "¥30以下" | "¥30-¥50" | "¥50-¥80" | "¥80以上"
  acceptableDistance: number; // 米，例如 1000
  matchStatus: boolean; // 是否开启今日匹配
  wechatId?: string;
  phone?: string;
}

export interface Restaurant {
  restaurantId: string;
  name: string;
  category: string;
  subCategory?: string; // 如 潮汕牛肉火锅, 酸汤火锅
  address: string;
  distance: number; // 米
  walkingTime: number; // 分钟
  rating: number; // 4.7
  avgPrice: number; // 65
  tags: string[];
  isFavorite?: boolean;
  crowdLevel: '空闲' | '正常' | '排队中';
  recommendReason: string;
  suitability: {
    solo: boolean; // 适合一人食
    chat: boolean; // 适合聊天破冰
    fast: boolean; // 出餐快
    group: boolean; // 适合多人桌
  };
  featuredDish: string;
}

export interface Partner {
  userId: string;
  nickname: string;
  avatar: string;
  department: string;
  jobTitle: string;
  onboardingDays: number; // 新人判定
  matchScore: number;
  matchReason: string;
  tasteTags: string[];
  skillTags: string[];
  socialPreference: string;
  lunchTime: string; // 今日打算用餐时间
  todayCategory: string; // 今日想吃
  budgetRange: string;
  wechatId: string; // 交换成功后显示
  phone: string;
  selfIntro: string; // 一句话破冰自我介绍
}

export interface TastePreference {
  tasteStrength: '清淡一点' | '众口一点' | '重口一点' | '随机';
  category: string; // '火锅' | '炒菜' | '轻食' | ...
  budgetRange: string; // '¥30以下' | '¥30-¥50' | '¥50-¥80' | '¥80以上'
  departureTime: string; // '立即出发' | '12:00' | '12:30' | '13:00'
  distance: number; // 300, 500, 1000
  avoidances: string[]; // ['不吃辣', '不吃香菜', '少油', '素食']
}

export interface Invitation {
  invitationId: string;
  initiatorId: string;
  receiverId: string;
  restaurantId: string;
  plannedTime: string; // "12:20"
  meetingPoint: string; // "公司楼下" | "餐厅门口"
  status: '待对方确认' | '已接受' | '已修改' | '已拒绝' | '已取消' | '已完成';
  createdAt: string;
}

export interface Message {
  messageId: string;
  invitationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'restaurant_card' | 'invitation_card';
  timestamp: string;
  restaurant?: Restaurant; // 卡片用
  invitationStatus?: Invitation['status']; // 邀约实时状态同步
}

export interface Review {
  reviewId: string;
  invitationId: string;
  reviewerId: string;
  restaurantScore: number; // 1-5
  partnerScore: number; // 1-5
  tasteScore: number; // 1-5
  serviceScore: number; // 1-5
  comment: string;
  nextTime: boolean; // 是否下次再约
  exchangeContact: boolean; // 是否愿意交换联系方式
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressText?: string;
}

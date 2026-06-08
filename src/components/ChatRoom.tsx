/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Send, Soup, MessageSquare, ClipboardCheck, Clock, MapPin, CheckCircle, AlertCircle, Sparkles, Smile, BookOpen 
} from 'lucide-react';
import { Partner, Message, Invitation, Restaurant, User } from '../types';
import { CHAT_AUTOREPLIES, SAMPLE_RESTAURANTS } from '../data';

interface ChatRoomProps {
  partner: Partner;
  user: User;
  onBack: () => void;
  onConfirmInvitation: (invitation: Invitation) => void;
  onUpdateInvitationStatus: (status: Invitation['status']) => void;
  onProceedToCheckin: () => void;
}

const SHORTCUT_TEMPLATES = [
  '要不要去吃这家推荐餐馆？',
  '12:15 我们在公司一楼集合吧？',
  '没问题，我先过去排队拿号！',
  '我带上新人搭子徽章了，见面好相认哦！',
  '今天天气不错，稍微走远点，吃个痛快！'
];

export default function ChatRoom({
  partner,
  user,
  onBack,
  onConfirmInvitation,
  onUpdateInvitationStatus,
  onProceedToCheckin
}: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyStep, setReplyStep] = useState(0);

  // 模拟邀约：每次建立聊天，初始化一个待确认邀约
  const [invitation, setInvitation] = useState<Invitation>({
    invitationId: `inv_${partner.userId}`,
    initiatorId: user.userId,
    receiverId: partner.userId,
    restaurantId: 'r001', // 默认潮汕牛肉火锅
    plannedTime: partner.lunchTime,
    meetingPoint: '公司楼下大厅',
    status: '待对方确认',
    createdAt: new Date().toISOString()
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // 初始化破冰消息
  useEffect(() => {
    setIsTyping(true);
    const t = setTimeout(() => {
      const arr = CHAT_AUTOREPLIES[partner.userId] || ['嗨，您好！今天中午很高兴能一起拼单就餐。'];
      const firstMsg: Message = {
        messageId: 'm_init',
        invitationId: invitation.invitationId,
        senderId: partner.userId,
        content: arr[0],
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([firstMsg]);
      setIsTyping(false);
      setReplyStep(1);
    }, 1000);

    return () => clearTimeout(t);
  }, [partner]);

  // 保持聊天框滚动在最底端
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string, type: Message['type'] = 'text', customRest?: Restaurant) => {
    if (!text.trim()) return;

    // 1. 用户自己的消息
    const userMsg: Message = {
      messageId: `msg_${Date.now()}`,
      invitationId: invitation.invitationId,
      senderId: user.userId,
      content: text,
      type,
      restaurant: customRest,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // 2. 模拟物联回复
    setIsTyping(true);
    setTimeout(() => {
      const replies = CHAT_AUTOREPLIES[partner.userId] || [];
      let replyContent = '那就这样敲定！';
      
      if (type === 'restaurant_card') {
        replyContent = `哇！这家【${customRest?.name}】看起来真的符合偏好，出餐极速，推荐理由很靠谱！我就定这家啦！`;
        if (customRest) {
          setInvitation((prev) => ({ ...prev, restaurantId: customRest.restaurantId }));
        }
      } else {
        if (replyStep < replies.length) {
          replyContent = replies[replyStep];
          setReplyStep((prev) => prev + 1);
        } else {
          replyContent = `没问题，那我们一会见！`;
        }
      }

      const partnerMsg: Message = {
        messageId: `msg_rep_${Date.now()}`,
        invitationId: invitation.invitationId,
        senderId: partner.userId,
        content: replyContent,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, partnerMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const currentAssignedRestaurant = SAMPLE_RESTAURANTS.find(
    (r) => r.restaurantId === invitation.restaurantId
  ) || SAMPLE_RESTAURANTS[0];

  const handleConfirmInvitation = () => {
    const updated = { ...invitation, status: '已接受' as const };
    setInvitation(updated);
    onConfirmInvitation(updated);

    // 模拟对方的开心回应
    setIsTyping(true);
    setTimeout(() => {
      const partnerMsg: Message = {
        messageId: `msg_con_${Date.now()}`,
        invitationId: invitation.invitationId,
        senderId: partner.userId,
        content: `太好了！已经点击确认就餐安排了。待会儿 🏢【${invitation.meetingPoint}】准时碰头，期待一会午餐聚会！`,
        type: 'text',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, partnerMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestAlternative = (meetingPoint: string, time: string) => {
    const updated = { 
      ...invitation, 
      status: '已修改' as const, 
      meetingPoint, 
      plannedTime: time 
    };
    setInvitation(updated);
    onConfirmInvitation(updated);

    handleSendMessage(`我们可以改在 [${time}]，在 [${meetingPoint}] 碰头，免去排队时间如何？`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-in items-start ms-1 text-slate-800">
      
      {/* 左侧：精美的聊天对话泡泡区 (偏左大分栏) */}
      <div className="lg:col-span-8 bg-white rounded-xl border border-orange-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* 1. 聊天窗口顶部资料卡 */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-1 px-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-205 rounded cursor-pointer border border-slate-200 bg-white shadow-xs"
            >
              ← 换人
            </button>
            <img 
              src={partner.avatar} 
              alt={partner.nickname} 
              className="w-9 h-9 rounded object-cover border border-slate-200" 
            />
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5 leading-none">
                <span>与 {partner.nickname} 口味同盟频道</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-405 mt-1">
                🏢 {partner.department} · {partner.jobTitle}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded border border-orange-150 font-bold">
              新晋好友配对 👬
            </span>
          </div>
        </div>

        {/* 2. 对话框核心滚动槽 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/10">
          
          <div className="text-center py-1">
            <span className="inline-block text-[10px] px-2.5 py-1 text-slate-400 font-mono bg-white rounded border border-orange-100 shadow-xs leading-none">
              🔒 隐私合规：微信及联系方式将在完成就餐评价打卡后双方授权一键解锁
            </span>
          </div>

          {messages.map((msg) => {
            const isUser = msg.senderId === user.userId;
            return (
              <div 
                key={msg.messageId} 
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in`}
              >
                <img 
                  src={isUser ? user.avatar : partner.avatar} 
                  alt="" 
                  className="w-8 h-8 rounded object-cover shrink-0 border border-slate-200" 
                />

                <div className="space-y-1 max-w-[70%] sm:max-w-[60%]">
                  <div className={`p-3 text-xs sm:text-sm rounded-lg leading-relaxed shadow-xs ${
                    isUser 
                      ? 'bg-orange-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-805 rounded-tl-none border border-slate-200'
                  }`}>
                    {msg.type === 'restaurant_card' && msg.restaurant ? (
                      /* 特殊组件餐馆卡片 */
                      <div className="space-y-2 text-slate-800">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase">
                          <Soup className="w-3.5 h-3.5 text-orange-655 text-orange-600" />
                          <span>推荐美食口袋方案</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{msg.restaurant.name}</h4>
                        <p className="text-[10px] text-slate-400 leading-none">
                          步行约 {msg.restaurant.walkingTime} 分钟 · 限额 ¥{msg.restaurant.avgPrice}
                        </p>
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border leading-tight border-orange-100/50">
                          {msg.restaurant.recommendReason.substring(0, 52)}...
                        </div>
                        <p className="text-[10px] font-bold text-orange-600 leading-none animate-pulse">点击卡片系统已设为首选集合去处</p>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className={`text-[9px] text-slate-400 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* 输入中 */}
          {isTyping && (
            <div className="flex items-start gap-2.5">
              <img src={partner.avatar} alt="" className="w-8 h-8 rounded object-cover border" />
              <div className="p-3 bg-white border border-slate-200 rounded-lg rounded-tl-none">
                <div className="flex gap-1 animate-pulse">
                  <span className="w-1.2 h-1.2 bg-orange-400 rounded-full" />
                  <span className="w-1.2 h-1.2 bg-orange-400 rounded-full" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.2 h-1.2 bg-orange-400 rounded-full" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* 3. 快捷建议 */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1 shrink-0">快捷话术:</span>
          {SHORTCUT_TEMPLATES.map((tpl) => (
            <button
              key={tpl}
              type="button"
              onClick={() => handleSendMessage(tpl)}
              className="text-[10px] bg-white text-slate-600 border border-slate-200 hover:border-orange-455 hover:text-orange-600 px-2.5 py-1 rounded transition shrink-0 cursor-pointer"
            >
              {tpl}
            </button>
          ))}
        </div>

        {/* 4. 输入栏 */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSendMessage(`给搭子推荐餐厅【${currentAssignedRestaurant.name}】`, 'restaurant_card', currentAssignedRestaurant)}
            className="p-2 sm:p-2.5 rounded-lg border border-orange-100 hover:border-orange-300 bg-orange-50/10 text-orange-600 hover:bg-orange-50/30 transition cursor-pointer"
            title="发送当前选定餐厅卡片给搭子"
          >
            <Soup className="w-4.5 h-4.5" />
          </button>

          <input 
            type="text" 
            placeholder="打个招呼回复搭子，沟通和核准餐馆安排..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            className="flex-1 px-3 py-2 text-xs sm:text-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-100 rounded-lg focus:border-orange-405"
          />

          <button
            type="button"
            onClick={() => handleSendMessage(inputText)}
            className="p-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 右侧：契约确认卡 */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-105 pb-2 flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 animate-pulse">
              <ClipboardCheck className="w-4 h-4 text-orange-600" />
              搭子拼单饭卡
            </h3>

            {invitation.status === '已接受' ? (
              <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                就绪待就餐
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded shrink-0">
                {invitation.status}
              </span>
            )}
          </div>

          {/* 卡片详情 */}
          <div className="space-y-3 p-3.5 rounded bg-slate-50 border border-slate-200">
            <div className="flex items-start gap-2">
              <Soup className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-405">就餐选址</div>
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {currentAssignedRestaurant.name}
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5">
                  📍 {currentAssignedRestaurant.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-405">预定时间点</div>
                <div className="text-xs font-bold text-slate-800 font-mono">
                  今日中午 {invitation.plannedTime}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-405">集合碰头坐标</div>
                <div className="text-xs font-bold text-slate-800">
                  {invitation.meetingPoint}
                </div>
              </div>
            </div>
          </div>

          {invitation.status !== '已接受' ? (
            <div className="space-y-2">
              <div className="text-[11px] text-slate-500 flex items-start gap-1 p-1 bg-orange-50/10 rounded text-slate-705 border border-orange-150">
                <AlertCircle className="w-4 h-4 text-orange-605 shrink-0 select-none mt-0.5" />
                <span>对方发来就餐安排握手。请在其微调合适或者直接确认饭单开始匹配！</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSuggestAlternative('一楼咖啡厅门口', '12:15')}
                  className="py-2.5 rounded-lg border border-slate-200 hover:border-orange-400 text-xs font-extrabold text-slate-600 bg-white cursor-pointer hover:bg-orange-50/15 text-center leading-none"
                >
                  微调在12:15分
                </button>

                <button
                  type="button"
                  onClick={handleConfirmInvitation}
                  className="py-2.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-xs font-extrabold text-white text-center cursor-pointer shadow-sm leading-none"
                >
                  确认接收邀约
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200 flex items-start gap-2 text-xs">
                <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">就餐计划已妥定！</span> 
                  拼饭契约成功锁定。待会儿准时碰头。午餐完毕后，在“到餐打卡区”互赞打分吧！
                </div>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckin}
                className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-extrabold cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>前往下一步：到餐打卡评价</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-orange-50/10 rounded-xl border border-orange-100 p-4 space-y-3">
          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded border border-orange-205 uppercase">
            💡 话题破冰热身热线
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            见面后，这些契合话题能让聊天更加顺畅：
          </p>
          <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
            <li>看好 {partner.nickname} 的兴趣强项 🔮<b>#{partner.skillTags[0] || 'AI技术'}#</b>！</li>
            <li>分享您已经在集团大楼入职了 <b>{user.onboardingDays}</b> 天的小故事。</li>
            <li>他的就餐喜好倾向在于 <b>{partner.socialPreference}</b>。</li>
          </ul>
        </div>
      </div>

    </div>
  );
}

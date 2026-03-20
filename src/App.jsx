import React, { useState, useEffect, useRef } from 'react';

// 保持原始內容與優化視覺
const botData = {
  greeting: "您好！我是泰翔的分身 🤖。您可以透過下方按鈕或直接輸入想了解的內容（如：背景、作品、技能等）。請問你想先看哪一部分？",
  
  aboutMe: {
    responses: [
      "🏠 **關於我 (個人背景)**\n您好，我是陳泰翔，出生於彰化。從小與父親同住，身為家中的長兄，這讓我培養了較強的責任感與照顧團隊的性格。",
      "🚀 **職業起點**\n退伍後我選擇在台中的遊戲公司深耕，專注於 **3D模型製作** 與 **動態動作控制**，這段經歷為我打下了堅實的技術基礎。",
      "🎬 **動畫與電影夢**\n2013年我決定挑戰台北，投身於國產動畫與電影專案。參與了包括《奇人密碼》與紀錄片《釋悟因》等具代表性的作品，在團隊協作中展現了高度的適應力。",
      "🎮 **管理實務**\n2014年後，我開始帶領約 7 人的動畫部門，這讓我深刻體會到「溝通」才是推動大型專案成功的核心要素。"
    ],
    followUp: ["🎬 了解《奇人密碼》", "📹 看看《釋悟因》紀錄片", "💼 我的工作經歷怎樣？"]
  },

  experience: {
    responses: [
      "📅 **2012 ~ 2013 (賽席爾商泛力)**\n擔任 3D 美工設計，負責 3D 模型、特效與燈光控制。代表作品為《遠征三國》手遊。",
      "📅 **2013 ~ 2014 (合邑映像)**\n擔任多媒體動畫師，專攻 3D 模型與動作製作，參與過《電影-奇人密碼》與《記錄片-釋悟因》。",
      "📅 **2014 ~ 至今 (傳奇網路)**\n目前擔任 **多媒體開發主管**。我負責領導團隊製作過場動畫，熱門作品有《風之國度》、《慾望王座》、《精靈樂章》等。"
    ],
    followUp: [ "更多作品", "🎬 看看《奇人密碼》與《釋悟因》", "🎮 傳奇網路作品合集"]
  },

  portfolio: {
    responses: [
      "太棒了！這是我的精選作品集，歡迎點擊查看：\n\n🔗 https://jay20040121.wixsite.com/website-5\n\n裡面有更多動態展示，看完可以再回來跟我聊聊喔！"
    ],
    followUp: ["💼 我的工作經歷怎樣？", "🎮 《慾望王座》作品", "🎮 《精靈樂章》作品"]
  },

  skills: {
    responses: [
      "🛠️ **專業軟體工具**\n- 遊戲引擎：Unity\n- 3D 建模：MAYA\n- 視覺特效：After Effects、Premiere\n- 設計：Photoshop\n- 辦公：Excel、PowerPoint",
      "🎨 **適合職位**\n- 多媒體影像處理、電腦動畫設計\n- **AIGC 設計應用**\n- 團隊領導與跨部門諮詢"
    ],
    followUp: ["🏠 看看我的背景？", "📅 想了解我的經歷？", "💼 請聯繫我！"]
  },

  education: {
    responses: [
      "🎓 **學歷資訊**\n- 明道大學 數位多媒體設計系 (學士)"
    ],
    followUp: ["📜 聽聽我的興趣？", "💼 了解我的工作？", "✉️ 聯繫我？"]
  },

  interests: {
    responses: [
      "📜 **我的興趣**\n- 平常除了熱衷於影像創作，我也喜歡玩桌遊與密室逃脫，這些活動能訓練邏輯思維。此外，跳舞和唱歌是我放鬆並尋找靈感的好方法！"
    ],
    followUp: ["🏠 更多關於我？", "💼 我的工作經歷？", "✉️ 如何聯繫？"]
  },

  personalStats: {
    responses: [
      "🏆 **個人基本資料**\n- 身高：174cm\n- 體重：69kg\n- 充滿活力且熱愛學習新科技！"
    ],
    followUp: ["📜 我的興趣是？", "🛠️ 我的技能？", "✉️ 聯繫方式？"]
  },

  contact: {
    responses: [
      "📧 **聯絡資訊**\n如果您對我的背景有興趣，歡迎隨時聯絡我：\n\n信箱：**jay20040121@gmail.com**\n期待與您進一步交流！"
    ],
    followUp: ["🏠 我的背景？", "💼 我的工作？", "🛠️ 我的技能？"]
  },
  
  unknown: {
    responses: [
      "不好意思，我還在學習中 😅。您可以嘗試點擊下方的按鈕，或者直接問我「你參與過哪些作品？」或「你會哪些軟體？」"
    ],
    followUp: ["👤 關於我", "💼 工作經歷", "🛠️ 專業技能"]
  }
};

// 智能關鍵詞映射 - 更容易擴展
const keywordCategories = [
  { 
    keywords: ["關於我", "背景", "是誰", "自我介紹", "泰翔", "你叫什麼", "你是誰", "誰是泰翔", "認識你", "了解你", "個人", "簡介", "你好", "請介紹"],
    value: botData.aboutMe 
  },
  { 
    keywords: ["經歷", "工作", "公司", "主管", "傳奇網路", "合邑", "賽席爾", "工作經歷", "職位", "做過什麼", "職業", "在哪", "去過", "待過", "任職"],
    value: botData.experience 
  },
  { 
    keywords: ["作品", "專案", "網址", "連結", "Wix", "website", "作品集", "作品展示", "看看", "示例", "案例", "成品"],
    value: botData.portfolio 
  },
  { 
    keywords: ["技能", "軟體", "專長", "工具", "會什麼", "Unity", "Maya", "專業技能", "AIGC", "技術", "能力", "掌握", "擅長", "懂", "精通"],
    value: botData.skills 
  },
  { 
    keywords: ["聯絡", "Email", "聯繫", "信箱", "手機", "聯絡方式", "怎麼聯繫", "聯繫你", "請聯繫", "找你", "如何聯絡", "怎樣聯繫", "聯系", "聯絡方法"],
    value: botData.contact 
  },
  { 
    keywords: ["學歷", "學校", "大學", "畢業", "明道", "讀書", "念書", "上學"],
    value: botData.education 
  },
  { 
    keywords: ["興趣", "愛好", "喜歡", "業餘", "休閒", "玩", "娛樂"],
    value: botData.interests 
  },
  { 
    keywords: ["身高", "體重", "身材", "多重", "多高", "基本資料", "個人資料", "外型"],
    value: botData.personalStats 
  }
];

// 計算文本相似度 (改進版)
const calculateSimilarity = (text1, text2) => {
  // 分詞並轉小寫
  const words1 = new Set(text1.toLowerCase().match(/[\u4e00-\u9fa5a-z0-9]+/g) || []);
  const words2 = new Set(text2.toLowerCase().match(/[\u4e00-\u9fa5a-z0-9]+/g) || []);
  
  if (words1.size === 0 && words2.size === 0) return 0;
  
  // 交集和並集
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
};

// 智能查詢函數 - 優化版本（優先匹配更長的關鍵詞）
const findBestMatch = (userText) => {
  const lowerUserText = userText.toLowerCase();
  
  // 收集所有可能的匹配
  const matches = [];
  
  for (const category of keywordCategories) {
    for (const keyword of category.keywords) {
      if (lowerUserText.includes(keyword)) {
        matches.push({
          category: category.value,
          keyword: keyword,
          length: keyword.length  // 記錄關鍵詞長度
        });
      }
    }
  }
  
  // 如果有匹配，優先返回最長的關鍵詞對應的分類
  // （因為更長的詞語通常更具體）
  if (matches.length > 0) {
    matches.sort((a, b) => b.length - a.length);
    return matches[0].category;
  }
  
  // 如果沒有精確匹配，才進行相似度匹配
  let bestMatch = null;
  let highestScore = 0;
  
  for (const category of keywordCategories) {
    for (const keyword of category.keywords) {
      const score = calculateSimilarity(userText, keyword);
      
      if (score > highestScore && score > 0.15) {
        highestScore = score;
        bestMatch = category.value;
      }
    }
  }
  
  return bestMatch;
};

// 關鍵詞到網址的映射表 - 自動搜索配置
const linkDatabase = {
  "傳奇網路": "https://www.x-legend.tw/",
  "傳奇": "https://www.x-legend.tw/",
  "慾望王座": "https://www.ero-labs.com/zh/game/throne-of-desire",
  "王座": "https://www.ero-labs.com/zh/game/throne-of-desire",
  "慾望": "https://www.ero-labs.com/zh/game/throne-of-desire",
  "精靈樂章": "https://play.google.com/store/apps/details?id=com.xlegend.grandfantasia.tw&hl=zh_TW",
  "樂章": "https://play.google.com/store/apps/details?id=com.xlegend.grandfantasia.tw&hl=zh_TW",
  "精靈": "https://play.google.com/store/apps/details?id=com.xlegend.grandfantasia.tw&hl=zh_TW",
  "風之國度": "https://www.x-legend.com.tw/laplace/",
  "風": "https://www.x-legend.com.tw/laplace/",
  "國度": "https://www.x-legend.com.tw/laplace/",
  "奇人密碼": "https://www.youtube.com/watch?v=dSQFEU3FHTw",
  "奇人": "https://www.youtube.com/watch?v=dSQFEU3FHTw",
  "釋悟因": "https://www.youtube.com/watch?v=RQECxq_ugSI",
  "悟因": "https://www.youtube.com/watch?v=RQECxq_ugSI",
  "釋": "https://www.youtube.com/watch?v=RQECxq_ugSI",
  "youtube": "https://www.youtube.com/",
  "google": "https://www.google.com/",
};

// 搜索函數 - 尋找用戶輸入中的可搜索關鍵詞
const findSearchableKeywords = (userText) => {
  const results = [];
  const lowerText = userText.toLowerCase();
  
  for (const [keyword, url] of Object.entries(linkDatabase)) {
    if (lowerText.includes(keyword)) {
      results.push({ keyword, url, length: keyword.length });
    }
  }
  
  // 優先返回最長的匹配 (更具體)
  if (results.length > 0) {
    results.sort((a, b) => b.length - a.length);
    return results[0];
  }
  
  return null;
};

// 工作關鍵詞配置 - 定義每個關鍵詞對應的動態後續問題
const workKeywordConfig = {
  "奇人密碼": {
    followUp: ["🎮 探索《慾望王座》", "🎮 看看傳奇網路的作品", "📅 回到我的工作經歷"]
  },
  "釋悟因": {
    followUp: ["🎮 探索《慾望王座》", "🎮 傳奇網路遊戲系列", "🏠 回到關於我"]
  },
  "風之國度": {
    followUp: ["🎮 探索《慾望王座》", "🎮 了解《精靈樂章》遊戲", "✉️ 聯繫我"]
  },
  "慾望王座": {
    followUp: ["🎮 了解《精靈樂章》遊戲", "🎮 看看傳奇網路的遊戲", "📅 回到工作經歷"]
  },
  "精靈樂章": {
    followUp: ["🎮 探索《慾望王座》", "🎮 看看傳奇網路的遊戲", "✉️ 聯繫我"]
  },
  "傳奇網路": {
    followUp: ["🎮 探索《慾望王座》", "🎮 了解《精靈樂章》遊戲", "🎮 《風之國度》介紹"]
  },
  "合邑映像": {
    followUp: ["🎬 看看《奇人密碼》", "� 探索《慾望王座》", "📅 回到工作經歷"]
  },
  "賽席爾商泛力": {
    followUp: ["🎮 探索《慾望王座》", "🎮 看傳奇網路的遊戲", "✉️ 聯繫我"]
  }
};

// 檢測訊息中的工作關鍵詞並生成動態後續問題
const generateDynamicFollowUpQuestions = (botMessage) => {
  const workKeywords = /(奇人密碼|釋悟因|風之國度|慾望王座|精靈樂章|傳奇網路|合邑映像|賽席爾商泛力)/g;
  const matches = botMessage.match(workKeywords);
  
  if (matches && matches.length > 0) {
    // 取得第一個匹配的關鍵詞（最相關）
    const firstKeyword = matches[0];
    if (workKeywordConfig[firstKeyword]) {
      return workKeywordConfig[firstKeyword].followUp;
    }
  }
  
  // 如果沒有找到工作關鍵詞，返回預設問題
  return null;
};

const quickReplies = [
  { label: "👤 關於我", keyword: "關於我" },
  { label: "💼 工作經歷", keyword: "工作經歷" },
  { label: "🎓 學歷/興趣", keyword: "學歷" },
  { label: "🛠️ 專業技能", keyword: "專業技能" },
  { label: "📁 作品集", keyword: "作品集" },
  { label: "✉️ 聯絡我", keyword: "聯絡" }
];

const Avatar = ({ isTyping = false }) => {
  const [imgError, setImgError] = useState(false);
  const imgUrl = "/S__364150787.jpg";

  return (
    <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 border-white shadow-sm overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-lg cursor-pointer ${isTyping ? 'scale-90 opacity-60' : 'scale-100 opacity-100'} ${imgError ? 'bg-indigo-500' : 'bg-slate-200'}`}>
      {!imgError ? (
        <img 
          src={imgUrl} 
          alt="Avatar" 
          className={`w-full h-full object-cover`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-white font-bold text-sm">泰</span>
      )}
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState([{ text: botData.greeting, sender: 'bot' }]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const formatMessage = (text) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const workKeywords = /(奇人密碼|釋悟因|風之國度|慾望王座|精靈樂章)/g;

    return text.split('\n').map((line, lineIdx) => (
      <div key={lineIdx} className="mb-1 last:mb-0">
        {line.split(urlRegex).map((part, i) => {
          if (part.match(urlRegex)) {
            return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline font-bold hover:text-blue-300 break-all">{part}</a>;
          }
          return part.split(emailRegex).map((subPart, j) => {
            if (subPart.match(emailRegex)) {
              return <span key={j} className="text-yellow-400 font-bold">{subPart}</span>;
            }
            return subPart.split(/(\*\*.*?\*\*)/).map((segment, k) => {
              if (segment.startsWith('**') && segment.endsWith('**')) {
                const inner = segment.replace(/\*\*/g, '');
                return <strong key={k} className="text-indigo-200">
                  {inner.split(workKeywords).map((word, wi) => 
                    word.match(workKeywords) ? <span key={wi} className="text-yellow-400 font-bold">{word}</span> : word
                  )}
                </strong>;
              }
              return segment.split(workKeywords).map((word, wi) => 
                word.match(workKeywords) ? <span key={wi} className="text-yellow-400 font-bold">{word}</span> : word
              );
            });
          });
        })}
      </div>
    ));
  };

  const sendBotMessages = async (responses, followUp = []) => {
    setIsTyping(true);
    const responseArray = Array.isArray(responses) ? responses : [responses];
    for (let i = 0; i < responseArray.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, { text: responseArray[i], sender: 'bot' }]);
    }
    
    // 根據訊息內容動態生成後續問題
    const lastMessage = responseArray[responseArray.length - 1];
    const dynamicFollowUp = generateDynamicFollowUpQuestions(lastMessage);
    const finalFollowUp = dynamicFollowUp || followUp;
    
    // 設置後續問題
    setFollowUpQuestions(finalFollowUp);
    setIsTyping(false);
  };

  const handleSend = (text) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { text: text, sender: 'user' }]);
    setInputText("");
    setFollowUpQuestions([]); // 清除舊的後續問題

    // 先檢查是否有可搜索的關鍵詞
    const searchResult = findSearchableKeywords(text);
    
    if (searchResult) {
      // 顯示關鍵詞和搜索結果 - 只顯示連結，用戶自己點擊
      const message = `🔍 我找到了「${searchResult.keyword}」的相關資訊，點擊以下連結前往：\n\n🔗 ${searchResult.url}\n\n有其他想了解的嗎？`;
      sendBotMessages(message, botData.unknown.followUp);
      return;
    }

    // 如果沒有找到搜索關鍵詞，使用智能相似度匹配
    const foundCategory = findBestMatch(text);
    
    if (foundCategory) {
      const responses = foundCategory.responses || foundCategory;
      const followUp = foundCategory.followUp || [];
      sendBotMessages(responses, followUp);
    } else {
      sendBotMessages(botData.unknown.responses, botData.unknown.followUp);
    }
  };

  const customStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fadeInUp { animation: fadeInUp 0.4s ease-out forwards; }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .header-dynamic-bg {
      background: linear-gradient(-45deg, #0f172a, #1e293b, #334155, #1e293b);
      background-size: 400% 400%;
      animation: gradientShift 10s ease infinite;
    }

    .bg-dots {
      background-image: radial-gradient(#64748b 0.5px, transparent 0.5px);
      background-size: 24px 24px;
      opacity: 0.1;
    }
  `;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f1f5f9] p-4 font-sans antialiased text-slate-800">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(15,23,42,0.15)] overflow-hidden flex flex-col h-[750px] border border-white relative">
        
        {/* Header - 閃爍效果 */}
        <div className="header-dynamic-bg text-white p-6 text-center relative z-20 shadow-lg overflow-hidden">
          {/* 波紋光影效果 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)] animate-pulse"></div>
          
          <div className="relative z-10">
            <h1 className="font-extrabold text-2xl tracking-tight mb-1 drop-shadow-md">泰翔AI 分身 <span className="animate-bounce inline-block">🤖</span></h1>
            <div className="flex items-center justify-center gap-2 opacity-90">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></span>
              <p className="text-[10px] uppercase tracking-widest font-semibold">Online & Ready to Help</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 relative overflow-hidden bg-slate-50">
          <div className="absolute inset-0 bg-dots z-1"></div>
          <div className="relative z-10 h-full p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-fadeInUp`}>
                {msg.sender === 'bot' && <Avatar />}
                <div className={`max-w-[78%] px-5 py-3.5 rounded-2xl text-[13.5px] leading-relaxed shadow-sm transition-all ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none ring-1 ring-white/10'
                }`}>
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2">
                <Avatar isTyping={true} />
                <div className="bg-slate-200 px-4 py-3 rounded-2xl flex gap-1 items-center rounded-tl-none animate-pulse">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Replies / Follow-up Questions */}
        <div className="bg-white/80 backdrop-blur-md pt-3 pb-3 border-t border-slate-100 relative z-20">
          <div className="px-4 flex flex-wrap justify-center gap-2">
            {followUpQuestions.length > 0 ? (
              // 顯示後續問題
              followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(question)}
                  className="bg-gradient-to-r from-purple-400 to-pink-400 border border-purple-300 px-4 py-2 rounded-full text-[12px] font-bold text-white hover:from-purple-500 hover:to-pink-500 transition-all active:scale-95 shadow-md"
                >
                  {question}
                </button>
              ))
            ) : (
              // 顯示快速回覆按鈕
              quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(reply.keyword)}
                  className="bg-[#ebf5ff] border border-[#cce4ff] px-4 py-2 rounded-full text-[12px] font-bold text-[#2563eb] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all active:scale-95 shadow-sm"
                >
                  {reply.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-slate-100 flex items-center gap-3 relative z-20">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(inputText)}
            placeholder="跟我聊聊泰翔..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
          <button
            onClick={() => handleSend(inputText)}
            className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

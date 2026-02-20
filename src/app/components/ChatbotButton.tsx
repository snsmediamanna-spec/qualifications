import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickReplies?: string[];
}

interface FAQ {
  keywords: string[];
  question: string;
  answer: string;
  quickReplies?: string[];
}

// 🤖 대화형 패턴 데이터
interface ConversationPattern {
  patterns: string[];
  responses: string[];
  quickReplies?: string[];
  emotion?: 'greeting' | 'thanks' | 'positive' | 'negative' | 'help' | 'goodbye';
}

const CONVERSATION_PATTERNS: ConversationPattern[] = [
  {
    patterns: ['안녕', '안녕하세요', '하이', 'hi', 'hello', '헬로', '반가워', '처음'],
    responses: [
      '안녕하세요! 😊 한국자격검정평가진흥협회 챗봇입니다.\n무엇을 도와드릴까요?',
      '반갑습니다! 👋 궁금하신 점을 말씀해 주세요.',
      '안녕하세요! 🎓 축제기획사 자격증에 대해 궁금하신가요?'
    ],
    quickReplies: ['수강 신청', '자격증 발급', '결제 방법', '시험 응시'],
    emotion: 'greeting'
  },
  {
    patterns: ['감사', '고마워', '고맙', '땡큐', 'thank', 'thanks', '도움', '됐어', '알겠어'],
    responses: [
      '천만에요! 😊 더 궁금하신 점이 있으시면 언제든 물어보세요!',
      '도움이 되셨다니 기쁩니다! 🎉 다른 질문 있으시면 말씀해 주세요.',
      '별말씀을요! 💚 언제든 문의주세요!'
    ],
    quickReplies: ['수강 신청', '자격증 발급', '고객센터'],
    emotion: 'thanks'
  },
  {
    patterns: ['네', '응', '좋아', '그래', '오케이', 'ok', 'okay', '알았어', '맞아', '예'],
    responses: [
      '네! 😊 그럼 어떤 부분이 더 궁금하신가요?',
      '좋습니다! 추가로 궁금하신 점이 있으신가요?',
      '알겠습니다! 다른 도움이 필요하신가요?'
    ],
    quickReplies: ['수강 신청', '결제 방법', '시험 응시', '고객센터'],
    emotion: 'positive'
  },
  {
    patterns: ['아니', '아니요', 'no', '싫어', '필요없어', '괜찮아'],
    responses: [
      '알겠습니다! 😊 혹시 다른 궁금한 점이 있으시면 말씀해 주세요.',
      '네, 이해했습니다! 나중에라도 궁금하신 점이 생기면 언제든 연락주세요! 📞',
      '괜찮습니다! 언제든 도움이 필요하시면 찾아주세요!'
    ],
    quickReplies: ['수강 신청', '고객센터'],
    emotion: 'negative'
  },
  {
    patterns: ['도와줘', '도와주세요', '도움', '도움말', '뭐', '무엇', '어디', '어떻게', '모르겠어', '헷갈려'],
    responses: [
      '물론이죠! 😊 어떤 부분이 궁금하신가요?\n\n아래 버튼을 선택하시거나 직접 질문해 주세요!',
      '기꺼이 도와드리겠습니다! 🙌\n\n궁금하신 주제를 선택하시거나 자유롭게 질문해 주세요!',
      '네, 도와드리겠습니다! 💪\n\n무엇에 대해 알고 싶으신가요?'
    ],
    quickReplies: ['수강 신청', '자격증 발급', '결제 방법', '시험 응시', '환불 정책', '고객센터'],
    emotion: 'help'
  },
  {
    patterns: ['잘가', '바이', 'bye', '끝', '종료', '나가', '그만', '이만'],
    responses: [
      '감사합니다! 좋은 하루 되세요! 😊👋',
      '언제든 다시 찾아주세요! 화이팅! 💪',
      '도움이 되었길 바랍니다! 안녕히 가세요! 🌟'
    ],
    emotion: 'goodbye'
  },
  {
    patterns: ['ㅋ', 'ㅎ', 'ㅠ', 'ㅜ', 'ㄷ', 'ㅇ', '...', ';;', '^^', '^_^', ':)', ':('],
    responses: [
      '😊 어떤 점이 궁금하신가요?',
      '네! 무엇을 도와드릴까요? 🤗',
      '말씀하시면 도와드리겠습니다!'
    ],
    quickReplies: ['수강 신청', '자격증 발급', '고객센터'],
    emotion: 'greeting'
  }
];

const FAQ_DATA: FAQ[] = [
  {
    keywords: ['수강', '신청', '강의', '등록', '어떻게'],
    question: '수강 신청은 어떻게 하나요?',
    answer: '수강 신청은 다음과 같이 진행됩니다:\n\n1. 회원가입/로그인\n2. "수강신청" 메뉴 클릭\n3. 원하는 강의 선택\n4. 결제 진행\n5. "나의 강의실"에서 학습 시작\n\n궁금하신 점이 더 있으시면 말씀해 주세요!',
    quickReplies: ['결제 방법', '환불 정책', '강의 시청']
  },
  {
    keywords: ['자격증', '발급', '수료증', '증명서'],
    question: '자격증은 어떻게 발급받나요?',
    answer: '자격증 발급 절차:\n\n1. 모든 강의 수강 완료 (진도율 100%)\n2. 시험 응시 및 합격 (80점 이상)\n3. "자격증 발급" 메뉴에서 신청\n4. 정보 입력 및 수수료 결제\n5. 3~5일 내 우편 발송\n\n자격증은 한국자격검정평가진흥협회에서 공식 발급됩니다.',
    quickReplies: ['시험 응시', '합격 기준', '발급 비용']
  },
  {
    keywords: ['결제', '카드', '계좌이체', '무통장', '납부'],
    question: '결제 방법은 무엇이 있나요?',
    answer: '다양한 결제 수단을 지원합니다:\n\n• 신용카드 / 체크카드\n• 계좌이체\n• 무통장입금\n• 간편결제 (카카오페이, 네이버페이)\n\n결제 후 즉시 강의 수강이 가능합니다.',
    quickReplies: ['환불 정책', '수강 신청', '할인 혜택']
  },
  {
    keywords: ['환불', '취소', '반환', '돌려'],
    question: '환불 정책이 어떻게 되나요?',
    answer: '환불 정책 안내:\n\n• 수강 시작 전: 전액 환불\n• 수강 진도 10% 미만: 90% 환불\n• 수강 진도 10~50%: 50% 환불\n• 수강 진도 50% 이상: 환불 불가\n\n환불 신청은 고객센터를 통해 가능합니다.',
    quickReplies: ['고객센터', '수강 신청', '결제 방법']
  },
  {
    keywords: ['시청', '동영상', '재생', '강의 보기', '학습'],
    question: '강의는 어떻게 시청하나요?',
    answer: '강의 시청 방법:\n\n1. 로그인 후 "나의 강의실" 클릭\n2. 수강 중인 강의 선택\n3. 차시별 영상 클릭\n4. 동영상 시청 완료\n\n모든 강의는 PC, 모바일에서 시청 가능하며, 재생 속도 조절도 가능합니다.',
    quickReplies: ['수강 신청', '진도율 확인', '시험 응시']
  },
  {
    keywords: ['시험', '테스트', '평가', '응시', '문제'],
    question: '시험은 어떻게 응시하나요?',
    answer: '시험 응시 방법:\n\n1. 전체 강의 수강 완료 (진도율 100%)\n2. "나의 강의실"에서 "시험 응시" 클릭\n3. O/X 문제 풀이 (20문제)\n4. 80점 이상 합격\n5. 불합격 시 재응시 가능 (무제한)\n\n시험 시간 제한은 없으며, 언제든 응시 가능합니다.',
    quickReplies: ['합격 기준', '자격증 발급', '강의 시청']
  },
  {
    keywords: ['문의', '연락', '전화', '이메일', '고객센터'],
    question: '고객센터 연락처는?',
    answer: '고객센터 안내:\n\n📞 전화: 02-1234-5678\n📧 이메일: support@kqea.or.kr\n⏰ 운영시간: 평일 09:00 - 18:00 (주말/공휴일 휴무)\n\n1:1 문의는 "고객센터 > 문의하기" 메뉴를 이용해 주세요.',
    quickReplies: ['수강 신청', '자격증 발급', '환불 정책']
  },
  {
    keywords: ['가격', '비용', '얼마', '수강료', '금액'],
    question: '수강료는 얼마인가요?',
    answer: '수강료 안내:\n\n• 축제기획사 2급: 150,000원\n• 축제기획사 1급: 200,000원\n• 문화예술교육사: 180,000원\n\n할인 이벤트가 진행 중일 수 있으니 "수강신청" 페이지에서 확인해 주세요!',
    quickReplies: ['수강 신청', '할인 혜택', '결제 방법']
  },
  {
    keywords: ['합격', '점수', '기준', '몇점'],
    question: '시험 합격 기준은?',
    answer: '시험 합격 기준:\n\n• 총 20문제 (O/X 문제)\n• 80점 이상 합격\n• 불합격 시 재응시 가능 (무제한)\n• 시험 시간 제한 없음\n\n충분히 복습 후 응시하시면 합격하실 수 있습니다!',
    quickReplies: ['시험 응시', '자격증 발급', '강의 시청']
  },
  {
    keywords: ['진도', '수강률', '학습', '완강', '진행'],
    question: '진도율은 어떻게 확인하나요?',
    answer: '진도율 확인 방법:\n\n1. "나의 강의실" 접속\n2. 각 강의 카드에 진도율 표시\n3. 강의 상세에서 차시별 완료 현황 확인\n\n시험 응시를 위해서는 100% 완강이 필요합니다.',
    quickReplies: ['강의 시청', '시험 응시', '자격증 발급']
  }
];

export function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '안녕하세요! 한국자격검정평가진흥협회 챗봇입니다. 😊\n\n궁금하신 점을 입력하시거나, 아래 버튼을 선택해 주세요.',
      sender: 'bot',
      timestamp: new Date(),
      quickReplies: ['수강 신청', '자격증 발급', '결제 방법', '환불 정책', '시험 응시', '고객센터']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [lastTopic, setLastTopic] = useState<string>(''); // 마지막 대화 주제 기억
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 챗봇 열릴 때 입력창 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // FAQ 검색 함수
  const findAnswer = (userInput: string): FAQ | null => {
    const input = userInput.toLowerCase().trim();
    
    // 키워드 매칭
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => input.includes(keyword))) {
        return faq;
      }
    }
    
    return null;
  };

  // 대화형 패턴 매칭 함수
  const findPattern = (userInput: string): ConversationPattern | null => {
    const input = userInput.toLowerCase().trim();
    
    // 패턴 매칭
    for (const pattern of CONVERSATION_PATTERNS) {
      if (pattern.patterns.some(p => input.includes(p))) {
        return pattern;
      }
    }
    
    return null;
  };

  // 메시지 전송
  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 봇 응답 (딜레이 후)
    setTimeout(() => {
      const answer = findAnswer(messageText);
      const pattern = findPattern(messageText);
      
      let botMessage: Message;
      if (answer) {
        botMessage = {
          id: Date.now() + 1,
          text: answer.answer,
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: answer.quickReplies
        };
      } else if (pattern) {
        botMessage = {
          id: Date.now() + 1,
          text: pattern.responses[Math.floor(Math.random() * pattern.responses.length)],
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: pattern.quickReplies
        };
      } else {
        botMessage = {
          id: Date.now() + 1,
          text: '죄송합니다. 정확한 답변을 찾지 못했습니다. 😥\n\n아래 버튼 중 선택하시거나, 고객센터(02-1234-5678)로 문의해 주세요.',
          sender: 'bot',
          timestamp: new Date(),
          quickReplies: ['수강 신청', '자격증 발급', '결제 방법', '고객센터']
        };
      }
      
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  // 빠른 답변 클릭
  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  return (
    <>
      {/* 챗봇 버튼 - 데스크톱 전용 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex fixed z-[45] bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all items-center justify-center group"
        style={{
          bottom: 'calc(1.5rem + 3.5rem + 1rem)', // 메뉴 버튼 위
          right: '2rem',
          width: '3.5rem',
          height: '3.5rem'
        }}
        aria-label="챗봇 열기"
      >
        {isOpen ? (
          <X size={20} className="transition-transform" />
        ) : (
          <MessageCircle size={20} className="transition-transform group-hover:rotate-12" />
        )}
        
        {/* 알림 뱃지 (옵션) */}
        {/* 알림 점 제거됨 */}
      </button>

      {/* 챗봇 창 - 데스크톱 전용 */}
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 bg-black/30 z-[44]"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 챗봇 패널 */}
          <div 
            className="fixed z-[45] bg-card border-2 border-primary/20 shadow-2xl overflow-hidden animate-slide-up flex flex-col rounded-2xl"
            style={{
              bottom: 'calc(1.5rem + 3.5rem + 1rem + 3.5rem + 1rem)', // 챗봇 버튼 위
              right: '1.5rem',
              width: '400px',
              maxHeight: '600px'
            }}
          >
            {/* 헤더 */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-base" style={{ fontFamily: "'Inter', sans-serif" }}>
                    챗봇 상담
                  </h3>
                  <p className="text-xs text-white/70">24시간 자동 응답</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-2 -mr-2"
              >
                <ChevronDown size={24} />
              </button>
            </div>

            {/* 메시지 영역 - 모바일 스크롤 개선 */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5"
              style={{ 
                WebkitOverflowScrolling: 'touch', // iOS 스무스 스크롤
                overscrollBehavior: 'contain'
              }}
            >
              {messages.map((message) => (
                <div key={message.id}>
                  {/* 메시지 버블 */}
                  <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* 아바타 */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.sender === 'bot' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                    }`}>
                      {message.sender === 'bot' ? <Bot size={16} /> : <User size={16} />}
                    </div>

                    {/* 메시지 */}
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div 
                        className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'bot'
                            ? 'bg-card border border-border text-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.text}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 px-2">
                        {message.timestamp.toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* 빠른 답변 버튼 */}
                  {message.quickReplies && message.quickReplies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                      {message.quickReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-2 text-xs bg-card border border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground rounded-full transition-all"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 입력 영역 */}
            <div className="p-4 bg-card border-t border-border">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  name="chatbot-message"
                  id="chatbot-message-input"
                  autoComplete="off"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-12 h-12 bg-primary text-primary-foreground rounded-xl hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-2 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                💬 키워드로 빠르게 답변을 받아보세요
              </p>
            </div>
          </div>
        </>
      )}

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
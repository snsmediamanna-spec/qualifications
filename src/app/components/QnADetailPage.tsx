// ==================== 질문 상세 페이지 (채팅 스타일) ====================

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Eye, Lock, Trash2, Edit, Send, User } from 'lucide-react';
import { qnaService, type Question, type Reply } from '../../services/qna.service';
import { getCurrentUser } from '../../utils/auth';
import { useDataCache } from '../../contexts/DataCacheContext';
import { decodeQuestionId } from '../../utils/url-encoder';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../components/ui/alert-dialog';
import { toast } from 'sonner';

export function QnADetailPage() {
  const { id: urlCode } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 🔥 캐시 새로고침 함수
  const { refreshQnA } = useDataCache();

  const [question, setQuestion] = useState<Question | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 🔥 실시간 답변 업데이트
  const [lastReplyCount, setLastReplyCount] = useState(0);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollContainerRef = useRef<HTMLElement>(null);

  const isAdmin = user?.isAdmin === true;
  const isOwner = user && question && question.userEmail === user.email;

  useEffect(() => {
    if (urlCode) {
      // 🔥 URL 코드를 원본 ID로 디코딩
      const id = decodeQuestionId(urlCode);
      
      if (id === null) {
        toast.error('잘못된 접근입니다.');
        navigate('/qna');
        return;
      }
      
      loadQuestion(id);
      loadReplies(id);
      qnaService.incrementViews(id);
    }
  }, [urlCode]);
  
  // 🔥 실시간 답변 폴링 (5초마다)
  useEffect(() => {
    if (!question?.id) return;
    
    const pollInterval = setInterval(async () => {
      // 관리자가 답변 작성 중이면 폴링 스킵
      if (isSubmitting) return;
      
      try {
        const response = await qnaService.getReplies(question.id);
        
        if (response.success && response.data) {
          const newReplies = response.data;
          
          // 새로운 답변이 있으면 추가
          if (newReplies.length > replies.length) {
            // 🔥 폴링으로 인한 업데이트는 스크롤하지 않음
            setShouldAutoScroll(false);
            
            setReplies(newReplies);
            
            // 새 답변 알림 (자신이 작성한 것이 아닌 경우)
            const latestReply = newReplies[newReplies.length - 1];
            if (latestReply.userEmail !== user?.email) {
              toast.success('새로운 답변이 등록되었습니다.', {
                duration: 3000,
              });
            }
            
            // 질문 상태 업데이트
            if (newReplies.length > 0) {
              setQuestion(prev => prev ? { ...prev, status: 'answered' } : null);
            }
          }
        }
      } catch (error) {
        // 에러는 조용히 무시 (백그라운드 작업)
      }
    }, 5000); // 5초마다 체크
    
    return () => clearInterval(pollInterval);
  }, [question?.id, replies.length, isSubmitting, user?.email]);

  // 새 메시지가 추가되면 스크롤
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [replies]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  async function loadQuestion(questionId: number) {
    setLoading(true);
    try {
      const response = await qnaService.getQuestion(questionId, user?.email);

      if (response.success && response.data) {
        setQuestion(response.data);
      } else {
        toast.error(response.message || '질문을 불러오는데 실패했습니다.');
        navigate('/qna');
      }
    } catch (error) {
      toast.error('질문을 불러오는데 실패했습니다.');
      navigate('/qna');
    } finally {
      setLoading(false);
    }
  }

  async function loadReplies(questionId: number) {
    try {
      const response = await qnaService.getReplies(questionId);

      if (response.success && response.data) {
        setReplies(response.data);
      }
    } catch (error) {
      console.error('답변 목록 로드 실패:', error);
    }
  }

  async function handleReplySubmit() {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!replyText.trim()) {
      toast.error('답변 내용을 입력해주세요.');
      return;
    }

    if (!question) return;

    setIsSubmitting(true);
    
    // 🔥 자신이 답변을 작성하는 경우 자동 스크롤 활성화
    setShouldAutoScroll(true);

    try {
      const response = await qnaService.addReply({
        questionId: question.id,
        userEmail: user.email,
        userName: user.name,
        content: replyText.trim()
      });

      if (response.success) {
        toast.success('답변이 등록되었습니다.');
        
        // 🔥 로딩 없이 바로 state에 추가
        const newReply: Reply = {
          id: response.data?.id || Date.now(),
          questionId: question.id,
          userEmail: user.email,
          userName: user.name,
          isAdmin: user.isAdmin || false,
          content: replyText.trim(),
          createdAt: response.data?.createdAt || new Date().toISOString()
        };
        
        setReplies(prev => [...prev, newReply]);
        setReplyText('');
        
        // 질문 상태를 answered로 변경 (첫 답변인 경우)
        if (replies.length === 0) {
          setQuestion(prev => prev ? { ...prev, status: 'answered' } : null);
        }
      } else {
        toast.error(response.message || '답변 등록에 실패했습니다.');
      }
    } catch (error) {
      toast.error('답변 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!user || !question) return;

    if (!isOwner && !isAdmin) {
      toast.error('삭제 권한이 없습니다.');
      return;
    }

    setIsDeleting(true);

    try {
      const response = await qnaService.deleteQuestion(question.id, user.email);

      if (response.success) {
        toast.success('질문이 삭제되었습니다.');
        navigate('/qna');
      } else {
        toast.error(response.message || '질문 삭제에 실패했습니다.');
      }
    } catch (error) {
      toast.error('질문 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-6">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="bg-card/50 backdrop-blur-sm border border-border p-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-6" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="py-8 px-6 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/qna')}
              className="text-foreground hover:text-primary transition-colors -ml-4"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Button>

            {/* 액션 버튼 */}
            {(isOwner || isAdmin) && (
              <div className="flex gap-2">
                {isOwner && replies.length === 0 && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigate(`/qna/${question.id}/edit`)}
                    className="border-border hover:border-primary hover:text-primary transition-all"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    수정
                  </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-border text-destructive hover:text-destructive hover:border-destructive transition-all"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                      <AlertDialogTitle style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                        질문 삭제
                      </AlertDialogTitle>
                      <AlertDialogDescription style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                        정말로 이 질문과 모든 답변을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}>
                        취소
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                      >
                        {isDeleting ? '삭제 중...' : '삭제'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex items-center gap-3 mb-3">
            {replies.length === 0 ? (
              <span 
                className="text-xs uppercase tracking-widest text-amber-600 font-medium" 
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                답변 대기
              </span>
            ) : (
              <span 
                className="text-xs uppercase tracking-widest text-primary font-medium" 
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                답변 {replies.length}개
              </span>
            )}
            <span className="text-muted-foreground">•</span>
            <span 
              className="text-xs uppercase tracking-widest text-muted-foreground" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {question.category}
            </span>
            {!question.isPublic && (
              <>
                <span className="text-muted-foreground">•</span>
                <span 
                  className="text-xs flex items-center gap-1 text-muted-foreground" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Lock className="w-3 h-3" />
                  비공개
                </span>
              </>
            )}
            <span className="text-muted-foreground">•</span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="w-3 h-3" />
              {question.views}
            </span>
          </div>

          {/* 제목 */}
          <h1
            className="text-2xl lg:text-3xl leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
          >
            {question.title}
          </h1>
        </div>
      </section>

      {/* 채팅 영역 (스크롤 가능) */}
      <section className="flex-1 py-8 px-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 질문 (첫 메시지) */}
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span 
                  className="font-medium text-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {question.userName}
                </span>
                <span 
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {new Date(question.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border p-4 rounded-lg">
                <p 
                  className="text-foreground whitespace-pre-wrap leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {question.content}
                </p>
              </div>
            </div>
          </div>

          {/* 답변 목록 */}
          {replies.map((reply, index) => (
            <div 
              key={reply.id} 
              className={`flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 ${reply.isAdmin ? 'pl-0' : 'pl-0'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                reply.isAdmin ? 'bg-primary' : 'bg-muted'
              }`}>
                {reply.isAdmin ? (
                  <span className="text-primary-foreground font-medium text-sm">A</span>
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-2">
                  <span 
                    className="font-medium text-foreground"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    {reply.userName}
                  </span>
                  {reply.isAdmin && (
                    <Badge 
                      className="bg-primary/10 text-primary border-0 text-xs"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      관리자
                    </Badge>
                  )}
                  <span 
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {new Date(reply.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
                <div className={`p-4 rounded-lg ${
                  reply.isAdmin 
                    ? 'bg-primary/5 backdrop-blur-sm border border-primary/20' 
                    : 'bg-card/50 backdrop-blur-sm border border-border'
                }`}>
                  <p 
                    className="text-foreground whitespace-pre-wrap leading-relaxed"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {reply.content}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* 입력 영역 */}
      {user && isAdmin && (
        <section className="py-6 px-6 border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary">
                <span className="text-primary-foreground font-medium text-sm">A</span>
              </div>
              <div className="flex-1 flex gap-3">
                <Textarea
                  placeholder="관리자 답변을 입력하세요..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  className="resize-none border-border focus:border-primary focus:ring-primary bg-background/50"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      e.preventDefault();
                      if (replyText.trim()) {
                        handleReplySubmit();
                      }
                    }
                  }}
                />
                <Button
                  onClick={handleReplySubmit}
                  disabled={isSubmitting || !replyText.trim()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto px-6"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                >
                  {isSubmitting ? (
                    <>전송 중...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            <p 
              className="text-xs text-muted-foreground mt-2 ml-14" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {replyText.length} / 2000 • <kbd className="px-2 py-1 text-xs bg-muted border border-border rounded">
                {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter
              </kbd> 로 빠른 전송
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
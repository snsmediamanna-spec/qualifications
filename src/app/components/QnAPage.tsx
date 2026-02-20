// ==================== Q&A 게시판 페이지 (캐시 사용) ====================

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, Plus, Search, Lock, Eye, ChevronRight } from 'lucide-react';
import { type Question } from '../../services/qna.service';
import { getCurrentUser } from '../../utils/auth';
import { useDataCache } from '../../contexts/DataCacheContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { qnaService } from '../../services/qna.service';
import { AppsScriptError } from './AppsScriptError';

export function QnAPage() {
  const navigate = useNavigate();
  
  // 🔥 캐시된 데이터 사용 (페이지 전환 시 즉시 표시)
  const { qnaList, qnaLoading, qnaError, categories, refreshQnA } = useDataCache();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'answered'>('all');
  const [user] = useState(() => getCurrentUser());
  
  // 🔥 페이지 최초 진입 시 로딩 표시
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // 🔥 Apps Script 설정 오류 체크
  const isAppsScriptError = qnaError && qnaError.includes('Apps Script 설정 오류');

  // 🔥 최초 로딩 완료 감지
  useEffect(() => {
    if (!qnaLoading) {
      // 최소 300ms 동안 로딩 화면 표시
      const timer = setTimeout(() => {
        setIsInitialLoad(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [qnaLoading]);

  // 🔥 필터링 (메모이제이션)
  const filteredQuestions = useMemo(() => {
    let filtered = qnaList;

    // 카테고리 필터
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    // 상태 필터
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(q => q.status === selectedStatus);
    }

    // 검색 필터
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(search) ||
        q.content.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [qnaList, selectedCategory, selectedStatus, searchTerm]);

  // 질문 작성 페이지로 이동
  function handleCreateQuestion() {
    if (!user) {
      toast.error('로그인이 필요합니다.');
      return;
    }
    navigate('/qna/create');
  }

  // 질문 상세 페이지로 이동
  function handleQuestionClick(question: Question) {
    // 🔥 서버에서 받은 urlCode 사용 (없으면 ID로 fallback)
    const code = question.urlCode || String(question.id);
    navigate(`/qna/${code}`);
  }

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <span
              className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
            >
              Q&A Board
            </span>
            <h1
              className="text-5xl lg:text-7xl mb-8 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              Q&A
            </h1>
            <p
              className="text-lg text-muted-foreground leading-relaxed max-w-2xl"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              궁금한 점을 자유롭게 질문하고 전문가의 답변을 받아보세요.
            </p>
          </div>
        </div>
      </section>

      {/* 필터 & 검색 섹션 */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* 검색 */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="질문 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-border bg-background/50"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  />
                </div>
              </div>

              {/* 카테고리 필터 */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger 
                  className="h-12 border-border bg-background/50" 
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 카테고리</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 상태 필터 */}
              <Select value={selectedStatus} onValueChange={(value: any) => setSelectedStatus(value)}>
                <SelectTrigger 
                  className="h-12 border-border bg-background/50" 
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="pending">답변 대기</SelectItem>
                  <SelectItem value="answered">답변 완료</SelectItem>
                </SelectContent>
              </Select>

              {/* 작성 버튼 */}
              <Button
                onClick={handleCreateQuestion}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-medium tracking-wide"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                <Plus className="w-5 h-5 mr-2" />
                질문 작성
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 질문 목록 */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {isInitialLoad ? (
              // 🎨 보여주기용 스켈레톤 (실제 디자인과 유사하게)
              Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-card/50 backdrop-blur-sm border border-border p-8 lg:p-10 animate-pulse"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      {/* 메타데이터 스켈레톤 */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-3 w-16 bg-muted rounded" />
                        <div className="h-3 w-1 bg-muted rounded-full" />
                        <div className="h-3 w-20 bg-muted rounded" />
                      </div>

                      {/* 제목 스켈레톤 */}
                      <div className="space-y-3 mb-4">
                        <div className="h-8 bg-muted rounded w-3/4" />
                        <div className="h-8 bg-muted rounded w-1/2" />
                      </div>

                      {/* 내용 미리보기 스켈레톤 */}
                      <div className="space-y-2 mb-6">
                        <div className="h-4 bg-muted/70 rounded w-full" />
                        <div className="h-4 bg-muted/70 rounded w-5/6" />
                      </div>

                      {/* 하단 메타 스켈레톤 */}
                      <div className="flex items-center gap-4">
                        <div className="h-4 w-16 bg-muted/50 rounded" />
                        <div className="h-3 w-1 bg-muted/50 rounded-full" />
                        <div className="h-4 w-20 bg-muted/50 rounded" />
                        <div className="h-3 w-1 bg-muted/50 rounded-full" />
                        <div className="h-4 w-12 bg-muted/50 rounded" />
                      </div>
                    </div>

                    {/* 우측 아이콘 스켈레톤 */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="h-6 w-6 bg-muted/50 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredQuestions.length === 0 ? (
              // 질문 없음
              <div className="bg-card/50 backdrop-blur-sm border border-border p-16 text-center">
                <MessageSquare className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-20" />
                <h3
                  className="text-2xl mb-3"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                >
                  등록된 질문이 없습니다
                </h3>
                <p
                  className="text-muted-foreground mb-8"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? '검색 조건에 맞는 질문이 없습니다.'
                    : '첫 번째 질문을 등록해보세요!'}
                </p>
                {user && (
                  <Button 
                    onClick={handleCreateQuestion} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    질문 작성하기
                  </Button>
                )}
              </div>
            ) : (
              // 🔥 질문 목록 (즉시 표시)
              filteredQuestions.map((question) => (
                <div
                  key={question.id}
                  className="bg-card/50 backdrop-blur-sm border border-border hover:border-primary transition-all duration-300 group cursor-pointer"
                  onClick={() => handleQuestionClick(question)}
                >
                  <div className="p-8 lg:p-10">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        {/* 메타데이터 */}
                        <div className="flex items-center gap-3 mb-4">
                          {/* 상태 배지 */}
                          {question.status === 'pending' ? (
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
                              답변 완료
                            </span>
                          )}

                          <span className="text-muted-foreground">•</span>

                          {/* 카테고리 */}
                          <span 
                            className="text-xs uppercase tracking-widest text-muted-foreground" 
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {question.category}
                          </span>

                          {/* 비공개 */}
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
                        </div>

                        {/* 제목 */}
                        <h3
                          className="text-2xl lg:text-3xl mb-4 group-hover:text-primary transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                        >
                          {question.title}
                        </h3>

                        {/* 내용 미리보기 */}
                        <p
                          className="text-muted-foreground line-clamp-2 mb-6"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                          {question.content}
                        </p>

                        {/* 하단 메타 */}
                        <div 
                          className="flex items-center gap-4 text-sm text-muted-foreground" 
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          <span>{question.userName}</span>
                          <span>•</span>
                          <span>{new Date(question.createdAt).toLocaleDateString('ko-KR')}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {question.views}
                          </span>
                        </div>
                      </div>

                      {/* 우측 버튼 영역 */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        {/* 관리자 또는 작성자 삭제 버튼 */}
                        {(user?.isAdmin || user?.email === question.userEmail) && (
                          <Button
                            onClick={async (e) => {
                              e.stopPropagation();
                              if (!confirm('정말 이 질문을 삭제하시겠습니까?')) return;
                              
                              try {
                                const result = await qnaService.deleteQuestion(question.id, user.email);
                                if (result.success) {
                                  toast.success('질문이 삭제되었습니다.');
                                  refreshQnA(); // 캐시 갱신
                                } else {
                                  toast.error(result.message || '삭제에 실패했습니다.');
                                }
                              } catch (error) {
                                toast.error('삭제 중 오류가 발생했습니다.');
                              }
                            }}
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10"
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                          >
                            삭제
                          </Button>
                        )}
                        <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Apps Script 설정 오류 표시 */}
      {isAppsScriptError && qnaError && (
        <AppsScriptError 
          error={new Error(qnaError)}
          system="QNA"
        />
      )}
    </div>
  );
}
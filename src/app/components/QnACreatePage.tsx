// ==================== 질문 작성 페이지 ====================

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Send, Lock, Globe } from 'lucide-react';
import { qnaService } from '../../services/qna.service';
import { getCurrentUser } from '../../utils/auth';
import { useDataCache } from '../../contexts/DataCacheContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const categories = ['수강신청', '시험', '자격증', '기타'];

export function QnACreatePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  // 🔥 캐시 새로고침 함수
  const { refreshQnA } = useDataCache();

  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    isPublic: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 체크
  if (!user) {
    toast.error('로그인이 필요합니다.');
    navigate('/qna');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 유효성 검사
    if (!formData.category) {
      toast.error('카테고리를 선택해주세요.');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await qnaService.createQuestion({
        category: formData.category,
        title: formData.title.trim(),
        content: formData.content.trim(),
        isPublic: formData.isPublic,
        userEmail: user.email,
        userName: user.name
      });

      if (response.success) {
        toast.success('질문이 등록되었습니다.');
        
        // 🔥 백그라운드에서 캐시 새로고침 (페이지 전환 후 즉시 반영)
        refreshQnA();
        
        // 🔥 즉시 목록 페이지로 이동
        navigate('/qna');
      } else {
        toast.error(response.message || '질문 등록에 실패했습니다.');
      }
    } catch (error) {
      toast.error('질문 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/qna')}
            className="text-foreground hover:text-primary transition-colors -ml-4 mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            목록으로
          </Button>

          <span
            className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
          >
            New Question
          </span>
          <h1
            className="text-3xl lg:text-5xl mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
          >
            질문 작성
          </h1>
          <p
            className="text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            궁금한 점을 자유롭게 질문해주세요. 전문가가 빠르게 답변드리겠습니다.
          </p>
        </div>
      </section>

      {/* 작성 폼 */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 카테고리 */}
            <div className="bg-card/50 backdrop-blur-sm border border-border p-8">
              <Label 
                htmlFor="category"
                className="text-base mb-4 block"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                카테고리 *
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger 
                  id="category"
                  className="h-12 border-border focus:border-primary focus:ring-primary bg-background/50"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem 
                      key={category} 
                      value={category}
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 제목 */}
            <div className="bg-card/50 backdrop-blur-sm border border-border p-8">
              <Label 
                htmlFor="title"
                className="text-base mb-4 block"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                제목 *
              </Label>
              <Input
                id="title"
                placeholder="질문 제목을 입력하세요"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={100}
                className="h-12 border-border focus:border-primary focus:ring-primary bg-background/50"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              />
              <p 
                className="text-xs text-muted-foreground text-right mt-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formData.title.length} / 100
              </p>
            </div>

            {/* 내용 */}
            <div className="bg-card/50 backdrop-blur-sm border border-border p-8">
              <Label 
                htmlFor="content"
                className="text-base mb-4 block"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                내용 *
              </Label>
              <Textarea
                id="content"
                placeholder="질문 내용을 상세히 입력하세요"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                maxLength={2000}
                className="resize-none border-border focus:border-primary focus:ring-primary bg-background/50"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              />
              <p 
                className="text-xs text-muted-foreground text-right mt-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {formData.content.length} / 2000
              </p>
            </div>

            {/* 공개 여부 */}
            <div className="bg-muted/30 backdrop-blur-sm border border-border p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    formData.isPublic 
                      ? 'bg-primary/10' 
                      : 'bg-muted'
                  }`}>
                    {formData.isPublic ? (
                      <Globe className="w-6 h-6 text-primary" />
                    ) : (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Label 
                      htmlFor="isPublic"
                      className="text-base cursor-pointer block mb-2"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      {formData.isPublic ? '공개 질문' : '비공개 질문'}
                    </Label>
                    <p 
                      className="text-sm text-muted-foreground"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      {formData.isPublic 
                        ? '다른 회원들도 질문과 답변을 볼 수 있습니다.' 
                        : '본인과 관리자만 질문과 답변을 볼 수 있습니다.'}
                    </p>
                  </div>
                </div>
                
                {/* 토글 스위치 */}
                <button
                  type="button"
                  id="isPublic"
                  role="switch"
                  aria-checked={formData.isPublic}
                  onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
                  className={`relative h-11 w-[105px] rounded-full transition-all duration-300 flex-shrink-0 ${
                    formData.isPublic ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-[38px] w-[38px] rounded-full bg-white transition-all duration-300 ${
                      formData.isPublic ? 'left-[62px]' : 'left-[3px]'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/qna')}
                disabled={isSubmitting}
                className="px-8 py-3 border-border hover:border-primary hover:text-primary"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                취소
              </Button>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
              >
                {isSubmitting ? (
                  <>처리 중...</>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    질문 등록
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* 안내 정보 */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <div className="bg-card/30 backdrop-blur-sm border border-border p-8">
              <h3 
                className="text-xl mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                💡 작성 팁
              </h3>
              <ul 
                className="space-y-3 text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                <li>• 질문을 구체적으로 작성해주세요</li>
                <li>• 필요한 경우 관련 정보를 함께 적어주세요</li>
                <li>• 답변 시간은 평균 24시간 이내입니다</li>
              </ul>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border p-8">
              <h3 
                className="text-xl mb-4"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                📋 카테고리 안내
              </h3>
              <ul 
                className="space-y-3 text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                <li>• 수강신청: 강의 및 수강 관련 문의</li>
                <li>• 시험: 시험 일정 및 응시 관련</li>
                <li>• 자격증: 자격증 발급 관련 문의</li>
                <li>• 기타: 그 외 모든 문의사항</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
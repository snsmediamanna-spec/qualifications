import { Star, CheckCircle } from 'lucide-react';

export function ReviewsPage() {
  const reviews = [
    {
      title: '축제기획사 자격증으로 커리어를 시작했어요',
      content: '지역 축제 기획팀에 합류하게 되었습니다. 실무 중심의 교육 덕분에 현장에서 바로 활용할 수 있었어요!',
      author: '김민지',
      role: '지역축제 기획자',
      rating: 5
    },
    {
      title: '체계적인 커리큘럼이 인상적이었습니다',
      content: '8주 동안 기초부터 실전까지 빠짐없이 배울 수 있었어요. 현직 전문가의 멘토링이 큰 도움이 되었습니다.',
      author: '이준호',
      role: '이벤트 기획자',
      rating: 5
    },
    {
      title: '합격 후 바로 취업에 성공했습니다',
      content: '취업 연계 프로그램 덕분에 수료 직후 기획사에 취직할 수 있었습니다. 감사합니다!',
      author: '박서연',
      role: '이벤트 기획사',
      rating: 5
    },
    {
      title: '실무 중심 교육이 정말 좋았어요',
      content: '이론만 배우는 게 아니라 실제 프로젝트를 진행하면서 배울 수 있어서 좋았습니다.',
      author: '최동욱',
      role: '프리랜서 기획자',
      rating: 5
    },
    {
      title: '전문 교수진의 멘토링이 큰 도움이 되었습니다',
      content: '현직에서 활동하시는 전문가들의 생생한 경험담과 조언이 진로 선택에 큰 도움이 되었어요.',
      author: '정수아',
      role: '문화예술 기획자',
      rating: 5
    },
    {
      title: '온라인으로도 충분히 배울 수 있었습니다',
      content: '온라인 수업이지만 퀄리티가 정말 높았어요. 언제 어디서나 학습할 수 있어서 편리했습니다.',
      author: '강민수',
      role: '공공기관 담당자',
      rating: 5
    }
  ];

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <span 
              className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Success Stories
            </span>
            <h1 
              className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              수강생 <span className="text-primary italic">후기</span>
            </h1>
            <p 
              className="text-xl text-muted-foreground leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              실제 수강생들의 생생한 합격 스토리와 경험담을 들어보세요.
            </p>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-32 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {reviews.map((review, idx) => (
              <div key={idx} className="group cursor-pointer">
                {/* 스켈레톤 이미지 - 회색 배경 */}
                <div className="overflow-hidden bg-muted/50 aspect-[4/3] mb-6 relative animate-pulse" />
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-primary" />
                  ))}
                </div>
                <h3 
                  className="font-serif text-xl mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {review.title}
                </h3>
                <p 
                  className="text-sm text-muted-foreground mb-4 leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {review.content}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p 
                      className="text-sm font-medium mb-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {review.author}
                    </p>
                    <p 
                      className="text-xs text-muted-foreground uppercase tracking-widest"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {review.role}
                    </p>
                  </div>
                  <CheckCircle size={20} className="text-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <div 
                className="text-5xl font-serif text-primary mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                95%
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                합격률
              </div>
            </div>
            <div>
              <div 
                className="text-5xl font-serif text-primary mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                1,234+
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                배출 인원
              </div>
            </div>
            <div>
              <div 
                className="text-5xl font-serif text-primary mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                4.9/5
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                수강생 만족도
              </div>
            </div>
            <div>
              <div 
                className="text-5xl font-serif text-primary mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                85%
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                취업 성공률
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
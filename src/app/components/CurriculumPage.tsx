import { BookOpen, Clock, Video, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function CurriculumPage() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const curriculum = [
    {
      week: 1,
      title: '축제의 이해와 기초',
      duration: '5시간',
      topics: ['축제의 정의와 역사', '한국의 대표 축제 사례', '축제의 종류와 특성', '축제 기획의 필요성']
    },
    {
      week: 2,
      title: '축제 기획 프로세스',
      duration: '6시간',
      topics: ['축제 기획 단계별 절차', '기획서 작성 방법', '실전 기획서 작성 실습', '목표 설정과 컨셉 개발']
    },
    {
      week: 3,
      title: '예산 관리와 스폰서십',
      duration: '5.5시간',
      topics: ['축제 예산 편성 기초', '수익 모델 설계', '스폰서십 유치 전략', '예산 관리 사례 연구']
    },
    {
      week: 4,
      title: '팀 구성과 조직 운영',
      duration: '5시간',
      topics: ['축제 조직 구조 설계', '인력 배치와 역할 분담', '자원봉사자 관리', '팀 커뮤니케이션 전략']
    },
    {
      week: 5,
      title: '마케팅과 홍보 전략',
      duration: '6시간',
      topics: ['축제 마케팅 기획', 'SNS 마케팅 실전', '언론 홍보 및 PR', '브랜딩 전략']
    },
    {
      week: 6,
      title: '프로그램 개발과 운영',
      duration: '5.5시간',
      topics: ['축제 프로그램 구성', '공연 및 체험 프로그램 기획', '관람객 동선 설계', '현장 운영 관리']
    },
    {
      week: 7,
      title: '안전 관리와 위기 대응',
      duration: '5시간',
      topics: ['축제 안전 관리 기초', '응급 상황 대응 매뉴얼', '보험과 법적 문제', '위기 관리 사례 연구']
    },
    {
      week: 8,
      title: '실전 프로젝트와 평가',
      duration: '7시간',
      topics: ['성공 사례 분석', '모의 축제 기획서 작성', '발표 및 피드백', '최종 평가']
    }
  ];

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
            <span 
              className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Curriculum
            </span>
            <h1 
              className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              체계적인<br/>
              <span className="text-primary italic">커리큘럼</span>
            </h1>
            <p 
              className="text-xl text-muted-foreground leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              8주 동안 축제 기획의 모든 것을 배웁니다. 
              기초 이론부터 실전 프로젝트까지,<br/>
              단계별로 체계적으로 구성된 커리큘럼으로 전문가로 성장합니다.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section className="py-32 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            {curriculum.map((week, idx) => (
              <div 
                key={idx}
                className="border border-border bg-background hover:border-primary transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
                  className="w-full p-8 text-left"
                >
                  <div className="flex items-start gap-6">
                    <div className="shrink-0">
                      <div 
                        className="w-16 h-16 flex items-center justify-center border border-primary text-primary font-serif text-2xl"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {week.week}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span 
                          className="text-xs uppercase tracking-widest text-muted-foreground"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          Week {week.week}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={14} />
                          {week.duration}
                        </span>
                      </div>
                      <h3 
                        className="font-serif text-2xl md:text-3xl mb-2"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {week.title}
                      </h3>
                      {expandedWeek === week.week && (
                        <div className="mt-6 space-y-3">
                          {week.topics.map((topic, i) => (
                            <div 
                              key={i}
                              className="flex items-start gap-3 text-muted-foreground"
                              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                            >
                              <CheckCircle size={16} className="text-primary shrink-0 mt-1" />
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div 
                className="text-5xl font-serif text-primary mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                12주
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                총 교육기간
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-5xl font-serif text-primary mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                44시간
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                총 교육시간
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-5xl font-serif text-primary mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                30+
              </div>
              <div 
                className="text-sm uppercase tracking-widest text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                강의 수
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <h2 
            className="font-serif text-5xl md:text-6xl mb-8 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            준비되셨나요?
          </h2>
          <p 
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            지금 바로 시작하여 8주 후 전문 축제기획사가 되어보세요.
          </p>
          <button 
            className="px-10 py-5 bg-primary text-primary-foreground font-medium tracking-wide uppercase transition-all hover:opacity-80"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            수강 신청하기
          </button>
        </div>
      </section>
    </div>
  );
}

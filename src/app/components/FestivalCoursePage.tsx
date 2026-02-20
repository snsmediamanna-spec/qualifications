import { Clock, Users, Star, Award, CheckCircle, TrendingUp, ArrowRight, Play, BookOpen, Target } from 'lucide-react';
import { useState } from 'react';

interface FestivalCoursePageProps {
  onEnroll?: () => void;
}

export function FestivalCoursePage({ onEnroll }: FestivalCoursePageProps) {
  const [selectedCourse, setSelectedCourse] = useState<'festival' | 'event' | 'performance'>('festival');
  
  // 강좌 기본 정보
  const courseInfo = {
    festival: {
      badge: '문화체육관광부 등록 민간자격증',
      title: '축제기획사 자격증',
      subtitle: '대한민국 축제·이벤트 전문가 양성 과정',
      description: '8주 만에 전문 축제기획사로 거듭나세요. 현장 실무 중심의 체계적인 교육과 함께 문화체육관광부 등록 자격증을 취득할 수 있습니다.',
      rating: 4.9,
      reviewCount: 234,
      studentCount: 1234,
      originalPrice: 350000,
      salePrice: 199000,
      discount: 43,
      duration: '8주 완성',
      hours: '45시간',
      lectures: '40개 강의'
    },
    event: {
      badge: '문화체육관광부 등록 민간자격증',
      title: '이벤트기획사 자격증',
      subtitle: '대한민국 이벤트·컨벤션 전문가 양성 과정',
      description: '6주 만에 전문 이벤트기획사로 거듭나세요. 기업 행사부터 컨벤션까지, 실무에 바로 적용 가능한 전문 교육을 제공합니다.',
      rating: 4.8,
      reviewCount: 189,
      studentCount: 987,
      originalPrice: 320000,
      salePrice: 179000,
      discount: 44,
      duration: '6주 완성',
      hours: '38시간',
      lectures: '35개 강의'
    },
    performance: {
      badge: '문화체육관광부 등록 민간자격증',
      title: '공연기획사 자격증',
      subtitle: '대한민국 공연·전시 전문가 양성 과정',
      description: '10주 만에 전문 공연기획사로 거듭나세요. 뮤지컬, 콘서트, 전시회 등 다양한 공연 기획의 모든 것을 배웁니다.',
      rating: 4.9,
      reviewCount: 312,
      studentCount: 1567,
      originalPrice: 380000,
      salePrice: 219000,
      discount: 42,
      duration: '10주 완성',
      hours: '52시간',
      lectures: '48개 강의'
    }
  };

  // 과정별 세부 데이터
  const courseData = {
    festival: {
      features: [
        { icon: BookOpen, title: '체계적 커리큘럼', desc: '8주 완성 프로그램' },
        { icon: Target, title: '실무 중심 교육', desc: '현장 경험 10년+' },
        { icon: Award, title: '자격증 발급', desc: '수료 후 즉시 발급' },
        { icon: TrendingUp, title: '95% 합격률', desc: '검증된 교육 과정' }
      ],
      benefits: [
        '8주 완성 체계적 커리큘럼',
        '현장 실무 중심 교육',
        '문화체육관광부 등록 자격증',
        '평생 수강 가능 (복습)',
        '취업 연계 지원',
        '수료증 및 자격증 발급'
      ],
      curriculum: [
        { week: '1-2주차', title: '축제의 이해', topics: ['축제 개론', '축제 유형 분석', '기획 프로세스'] },
        { week: '3-4주차', title: '기획 및 운영', topics: ['기획서 작성', '예산 관리', '팀 구성 및 운영'] },
        { week: '5-6주차', title: '마케팅 전략', topics: ['홍보 전략 수립', 'SNS 마케팅', '스폰서십 유치'] },
        { week: '7-8주차', title: '실전 프로젝트', topics: ['케이스 스터디', '모의 기획', '최종 평가'] }
      ],
      reviews: [
        { name: '김**', rating: 5, comment: '실무 중심의 교육으로 현장에서 바로 활용할 수 있었습니다. 지역 축제 기획팀에 취업했어요!', date: '2026-01-10' },
        { name: '이**', rating: 5, comment: '교수님들의 현장 경험이 정말 도움이 되었습니다. 8주 만에 자격증을 취득했어요.', date: '2026-01-08' },
        { name: '박**', rating: 5, comment: '체계적인 커리큘럼과 친절한 강의 덕분에 쉽게 배울 수 있었습니다. 강력 추천합니다!', date: '2026-01-05' }
      ],
      faqs: [
        { q: '수강 기간은 어떻게 되나요?', a: '8주 과정이지만, 결제 후 평생 무제한으로 수강하실 수 있습니다.' },
        { q: '자격증은 언제 발급되나요?', a: '최종 시험 합격 후 즉시 자격증이 발급됩니다. 3~5일 이내 등기우편으로 배송됩니다.' },
        { q: '환불이 가능한가요?', a: '수강 시작 후 30일 이내, 진도율 50% 미만인 경우 환불이 가능합니다.' },
        { q: '합격률은 어떻게 되나요?', a: '전체 수강생의 95%가 자격증을 취득하고 있습니다.' }
      ]
    },
    event: {
      features: [
        { icon: BookOpen, title: '체계적 커리큘럼', desc: '6주 완성 프로그램' },
        { icon: Target, title: '실무 중심 교육', desc: '현장 경험 10년+' },
        { icon: Award, title: '자격증 발급', desc: '수료 후 즉시 발급' },
        { icon: TrendingUp, title: '96% 합격률', desc: '검증된 교육 과정' }
      ],
      benefits: [
        '6주 완성 체계적 커리큘럼',
        '현장 실무 중심 교육',
        '문화체육관광부 등록 자격증',
        '평생 수강 가능 (복습)',
        '취업 연계 지원',
        '수료증 및 자격증 발급'
      ],
      curriculum: [
        { week: '1-2주차', title: '이벤트의 이해', topics: ['이벤트 개론', '이벤트 유형', '기획 기초'] },
        { week: '3-4주차', title: '기획 및 운영', topics: ['기획서 작성', '예산 관리', '팀 구성'] },
        { week: '5-6주차', title: '마케팅 전략', topics: ['홍보 전략', '디지털 마케팅', '스폰서십'] }
      ],
      reviews: [
        { name: '최**', rating: 5, comment: '기업 이벤트 기획에 필요한 모든 것을 배울 수 있었습니다. 실전에 바로 적용 가능해요!', date: '2026-01-12' },
        { name: '정**', rating: 5, comment: '컨벤션 업계에 진출하고 싶었는데 이 과정이 큰 도움이 되었습니다.', date: '2026-01-09' },
        { name: '강**', rating: 5, comment: '6주 안에 이렇게 많은 것을 배울 수 있다니 놀라웠습니다!', date: '2026-01-06' }
      ],
      faqs: [
        { q: '수강 기간은 어떻게 되나요?', a: '6주 과정이지만, 결제 후 평생 무제한으로 수강하실 수 있습니다.' },
        { q: '자격증은 언제 발급되나요?', a: '최종 시험 합격 후 일주일내로 자격증이 발급됩니다. 발급 후 3~5일 이내 등기우편으로 배송됩니다.' },
        { q: '환불이 가능한가요?', a: '결제 3일 이내,경우 전체 환불이 가능합니다.' },
        { q: '합격률은 어떻게 되나요?', a: '전체 수강생의 96%가 자격증을 취득하고 있습니다.' }
      ]
    },
    performance: {
      features: [
        { icon: BookOpen, title: '체계적 커리큘럼', desc: '10주 완성 프로그램' },
        { icon: Target, title: '실무 중심 교육', desc: '현장 경험 15년+' },
        { icon: Award, title: '자격증 발급', desc: '수료 후 즉시 발급' },
        { icon: TrendingUp, title: '94% 합격률', desc: '검증된 교육 과정' }
      ],
      benefits: [
        '10주 완성 체계적 커리큘럼',
        '현장 실무 중심 교육',
        '문화체육관광부 등록 자격증',
        '평생 수강 가능 (복습)',
        '취업 연계 지원',
        '수료증 및 자격증 발급'
      ],
      curriculum: [
        { week: '1-3주차', title: '공연의 이해', topics: ['공연 개론', '공연 유형', '기획 기초'] },
        { week: '4-6주차', title: '기획 및 운영', topics: ['공연 기획서 작성', '예산 관리', '팀 구성'] },
        { week: '7-8주차', title: '마케팅 전략', topics: ['홍보 전략', '티케 전략', '스폰서십'] },
        { week: '9-10주차', title: '실전 프로젝트', topics: ['케이스 스터디', '모의 기획', '최종 평가'] }
      ],
      reviews: [
        { name: '윤**', rating: 5, comment: '뮤지컬 제작사에서 일하고 있는데, 이 자격증이 큰 자산이 되었습니다.', date: '2026-01-11' },
        { name: '서**', rating: 5, comment: '공연 기획의 A부터 Z까지 배울 수 있는 완벽한 과정입니다!', date: '2026-01-07' },
        { name: '한**', rating: 5, comment: '10주가 길다고 생각했는데, 알차게 구성되어 있어서 만족합니다.', date: '2026-01-04' }
      ],
      faqs: [
        { q: '수강 기간은 어떻게 되나요?', a: '10주 과정이지만, 결제 후 평생 무제한으로 수강하실 수 있습니다.' },
        { q: '자격증은 언제 발급되나요?', a: '최종 시험 합격 후 즉시 자격증이 발급됩니다. 3~5일 이내 등기우편으로 배송됩니다.' },
        { q: '환불이 가능한가요?', a: '수강 시작 후 30일 이내, 진도율 50% 미만인 경우 환불이 가능합니다.' },
        { q: '합격률은 어떻게 되나요?', a: '전체 수강생의 94%가 자격증을 취득하고 있습니다.' }
      ]
    }
  };

  const currentCourse = courseInfo[selectedCourse];
  const currentData = courseData[selectedCourse];

  return (
    <div className="w-full bg-background">
      {/* 히어로 섹션 */}
      <section className="bg-primary text-primary-foreground relative -mx-5 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1759306221569-028a35bc8c66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMHN0YWdlJTIwb3V0ZG9vciUyMGV2ZW50fGVufDF8fHx8MTc3MDI1NTU0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Festival background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-primary/80 bg-[rgba(108,178,91,0.5019607843137255)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* 왼쪽: 강좌 정보 */}
            <div>
              <span 
                className="text-xs uppercase tracking-[0.3em] opacity-70 mb-6 block" 
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {currentCourse.badge}
              </span>
              
              <h1 
                className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight" 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {currentCourse.title}
              </h1>
              
              <p 
                className="text-xl md:text-2xl text-white/80 mb-6 leading-relaxed" 
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {currentCourse.subtitle}
              </p>
              
              <p 
                className="text-white/70 text-base leading-relaxed mb-10" 
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                {currentCourse.description}
              </p>

              {/* 통계 */}
              <div className="flex flex-wrap items-center gap-8 mb-10">
                <div className="flex items-center gap-2">
                  <Star size={20} fill="currentColor" className="text-white" />
                  <span className="font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {currentCourse.rating}/5
                  </span>
                  <span className="opacity-60" style={{ fontFamily: "'Inter', sans-serif" }}>
                    ({currentCourse.reviewCount})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <span className="font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {currentCourse.studentCount.toLocaleString()}명 수강
                  </span>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onEnroll}
                  className="px-10 py-4 bg-white text-primary hover:opacity-90 transition-opacity uppercase tracking-wider text-sm font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  지금 수강신청
                </button>
              </div>
            </div>

            {/* 오른쪽: 가격 카드 */}
            <div className="bg-card p-10 md:p-12 shadow-2xl">
              <div className="mb-8">
                <div className="flex items-end gap-4 mb-4">
                  <div>
                    <span className="text-muted-foreground line-through text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                      ₩{currentCourse.originalPrice.toLocaleString()}
                    </span>
                    <div className="text-5xl font-bold text-foreground mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      ₩{currentCourse.salePrice.toLocaleString()}
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-red-500 text-white font-bold text-sm uppercase tracking-wider mb-2">
                    {currentCourse.discount}% OFF
                  </span>
                </div>
                <p className="text-sm text-red-600 font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                  ⏰ 할인 마감까지 3일 남음
                </p>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <Clock className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <div className="font-semibold text-foreground text-lg mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {currentCourse.duration}
                    </div>
                    <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                      {currentCourse.lectures} · {currentCourse.hours}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Award className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <div className="font-semibold text-foreground text-lg mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      자격증 발급
                    </div>
                    <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                      수료 후 즉시 발급
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <TrendingUp className="text-primary mt-1 flex-shrink-0" size={24} />
                  <div>
                    <div className="font-semibold text-foreground text-lg mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      평생 수강
                    </div>
                    <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                      무제한 복습 가능
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={onEnroll}
                className="w-full py-5 bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-semibold uppercase tracking-wider text-base"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ₩{currentCourse.salePrice.toLocaleString()} 수강신청
              </button>

              <p className="text-xs text-center text-muted-foreground mt-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                30일 환불 보장 정책 적용
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 과정 선택 탭 */}
      <section className="py-16 md:py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span 
              className="uppercase tracking-[0.3em] text-[10px] mb-4 block text-muted-foreground font-bold" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              CHOOSE YOUR PATH
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl mb-4" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              과정 선택
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'festival', label: '축제기획사' },
              { key: 'event', label: '이벤트기획사' },
              { key: 'performance', label: '공연기획사' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCourse(tab.key as any)}
                className={`px-10 py-4 font-medium uppercase tracking-wider text-sm transition-all ${
                  selectedCourse === tab.key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-foreground hover:bg-muted border border-border'
                }`}
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 과정 특징 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span 
              className="uppercase tracking-[0.3em] text-[10px] mb-4 block text-muted-foreground font-bold" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              FEATURES
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              이 과정의 특징
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentData.features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-card border border-border p-8 hover:shadow-lg transition-shadow">
                  <Icon className="text-primary mb-6" size={32} />
                  <h3 
                    className="text-xl mb-3 font-semibold" 
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-muted-foreground" 
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 수강 혜택 */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span 
              className="uppercase tracking-[0.3em] text-[10px] mb-4 block text-muted-foreground font-bold" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              BENEFITS
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              수강 시 제공되는 혜택
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {currentData.benefits.map((benefit, idx) => (
              <div key={idx} className="bg-card border border-border p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
                <CheckCircle className="text-primary flex-shrink-0" size={24} />
                <span 
                  className="text-sm font-medium" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 커리큘럼 */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span 
              className="uppercase tracking-[0.3em] text-[10px] mb-4 block text-muted-foreground font-bold" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              CURRICULUM
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl mb-6" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              커리큘럼
            </h2>
            <p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto" 
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              체계적이고 실무 중심적인 커리큘럼으로 전문가로 성장합니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentData.curriculum.map((item, idx) => (
              <div key={idx} className="bg-card border border-border p-8 hover:shadow-lg transition-shadow">
                <div 
                  className="text-primary font-bold text-xs uppercase tracking-wider mb-6" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {item.week}
                </div>
                <h3 
                  className="text-2xl mb-6" 
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.title}
                </h3>
                <ul className="space-y-3">
                  {item.topics.map((topic, topicIdx) => (
                    <li 
                      key={topicIdx} 
                      className="flex items-start gap-3 text-sm text-muted-foreground" 
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 수강생 후기 */}
      <section className="py-16 md:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span 
              className="uppercase tracking-[0.3em] text-[10px] mb-4 block text-muted-foreground font-bold" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              REVIEWS
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              수강생 후기
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentData.reviews.map((review, idx) => (
              <div key={idx} className="bg-card border border-border p-10 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="text-primary" />
                  ))}
                </div>
                <p 
                  className="text-base text-foreground leading-relaxed mb-8" 
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  "{review.comment}"
                </p>
                <div 
                  className="flex items-center justify-between text-sm text-muted-foreground pt-6 border-t border-border" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <span className="font-semibold">{review.name}</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span 
              className="uppercase tracking-[0.3em] text-[10px] mb-4 block text-muted-foreground font-bold" 
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              FAQ
            </span>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              자주 묻는 질문
            </h2>
          </div>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {currentData.faqs.map((faq, idx) => (
              <div key={idx} className="bg-card border border-border p-8 hover:shadow-md transition-shadow">
                <h3 
                  className="font-semibold text-foreground text-lg mb-4" 
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Q. {faq.q}
                </h3>
                <p 
                  className="text-muted-foreground leading-relaxed" 
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  A. {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground -mx-5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-16 h-px bg-white/40"></div>
            <div className="w-2 h-2 bg-white rotate-45"></div>
            <div className="w-16 h-px bg-white/40"></div>
          </div>
          
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            지금 바로 시작하세요
          </h2>
          
          <p 
            className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed" 
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            전문가로 가는 여정, 오늘 시작하세요
          </p>
          
          <button 
            onClick={onEnroll}
            className="px-12 py-5 bg-white text-primary hover:opacity-90 transition-opacity uppercase tracking-wider text-base font-semibold inline-flex items-center gap-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            ₩{currentCourse.salePrice.toLocaleString()} 수강신청하기
            <ArrowRight size={20} />
          </button>
          
          <p 
            className="text-sm text-white/60 mt-8" 
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            할인 마감까지 3일 남음 · 30일 환불 보장
          </p>
        </div>
      </section>
    </div>
  );
}
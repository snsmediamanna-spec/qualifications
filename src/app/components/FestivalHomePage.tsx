import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Award, BookOpen, Target, Users, Star, ChevronRight, Clock, TrendingUp, CheckCircle, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from '@/app/components/Logo';

interface FestivalHomePageProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
  onNavigate: (page: string) => void;
  user: any;
  isMobile?: boolean;
}

const stats = [
  { value: '8주', label: '교육기간' },
  { value: '95%', label: '합격률' },
  { value: '1,234+', label: '배출 인원' },
  { value: '4.9/5', label: '수강생 만족도' }
];

const services = [
  {
    number: '01',
    title: '체계적인 커리큘럼',
    description: '축제 기획의 기초부터 실전 마케팅까지 체계적으로 구성된 8주 완성 과정.',
    features: ['기초 이론', '실전 사례', '마케팅 전략']
  },
  {
    number: '02',
    title: '실무 중심 교육',
    description: '현업 전문가의 실제 사례와 프로젝트로 실무 능력을 향상시키는 교육.',
    features: ['현장 실습', '프로젝트 수행', '전문가 멘토링']
  },
  {
    number: '03',
    title: '취업 연계 지원',
    description: '지역 축제, 기획사, 행사대행사 등 다양한 취업 기회를 제공합니다.',
    features: ['취업 상담', '포트폴리오', '네트워킹']
  }
];

const curriculum = [
  { week: '1-2주차', title: '축제 기획 기초', topics: ['축제 개념 이해', '기획 프로세스', '사례 분석'] },
  { week: '3-4주차', title: '실무 프로젝트', topics: ['기획서 작성', '예산 편성', '팀 워크샵'] },
  { week: '5-6주차', title: '마케팅 전략', topics: ['홍보 전략', 'SNS 활용', '협찬 유치'] },
  { week: '7-8주차', title: '최종 프로젝트', topics: ['포트폴리오', '발표 준비', '모의 면접'] }
];

const professors = [
  { name: '김민준', title: '축제마케팅 전문가' },
  { name: '박서연', title: '이벤트기획 교수' },
  { name: '이준호', title: '행사운영 전문가' }
];

const reviews = [
  {
    title: '축제기획사 자격증으로 커리어를 시작했어요',
    content: '지역 축제 기획팀에 합류하게 되었습니다. 실무 중심의 교육 덕분에 현장에서 바로 활용할 수 있었어요!',
    author: '김민지',
    rating: 5
  },
  {
    title: '체계적인 커리큘럼이 인상적이었습니다',
    content: '8주 동안 기초부터 실전까지 빠짐없이 배울 수 있었어요. 현직 전문가의 멘토링이 큰 도움이 되었습니다.',
    author: '이준호',
    rating: 5
  },
  {
    title: '합격 후 바로 취업에 공했습니다',
    content: '취업 연계 프로그램 덕분에 수료 직후 기획사에 취직할 수 있었습니다. 감사합니다!',
    author: '박서연',
    rating: 5
  }
];

export function FestivalHomePage({
  onLoginClick,
  onSignupClick,
  onNavigate,
  user,
  isMobile = false
}: FestivalHomePageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-background text-foreground transition-all duration-300">
      {/* Hero Section */}
      <section 
        className="relative pt-12 lg:pt-16 pb-12 lg:pb-16" 
        style={{ 
          zIndex: 1,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1611810293387-c8afe03cd7dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwY3Jvd2QlMjBsaWdodHN8ZW58MXx8fHwxNzcwMjAwMjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left - Typography */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Crafting <br/>
                <span className="italic" style={{ color: '#6cb25b' }}>Festival</span><br/>
                Excellence.
              </h1>
              <p className="text-lg lg:text-xl leading-relaxed max-w-xl mb-10 lg:mb-12 text-white/90" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                전문적인 축제 기획 능력을 인정받는 국가공인 자격증. 
                체계적인 교육으로 여러분의 꿈을 현실로 만들어드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('courses')}
                  className="px-10 py-5 lg:px-8 lg:py-4 bg-primary text-primary-foreground font-medium tracking-wide uppercase text-base lg:text-sm transition-opacity hover:opacity-80"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  과정 살펴보기
                </button>
                <button
                  onClick={() => onNavigate('about')}
                  className="px-10 py-5 lg:px-8 lg:py-4 border border-white/30 bg-white/10 backdrop-blur-sm text-white font-medium tracking-wide uppercase text-base lg:text-sm transition-opacity hover:bg-white/20"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  자세히 보기
                </button>
              </div>
            </div>

            {/* Right - Login Card */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="hidden lg:block bg-card/95 backdrop-blur-md border border-white/20 p-8 lg:p-10 shadow-xl">
                {!user ? (
                  <>
                    <h2 className="font-serif text-4xl lg:text-3xl mb-3 lg:mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      시작하기
                    </h2>
                    <p className="text-base lg:text-sm text-muted-foreground mb-10 lg:mb-8" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                      축제기획사 자격증 과정에 오신 것을 환영합니다
                    </p>
                    
                    <div className="space-y-4">
                      <button
                        onClick={onLoginClick}
                        className="w-full bg-primary text-primary-foreground py-5 lg:py-4 font-medium tracking-wide uppercase text-base lg:text-sm transition-all hover:opacity-80"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        로그인
                      </button>
                      <button
                        onClick={onSignupClick}
                        className="w-full border border-primary text-primary py-5 lg:py-4 font-medium tracking-wide uppercase text-base lg:text-sm transition-all hover:bg-primary/5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        회원가입
                      </button>
                    </div>

                    <div className="mt-10 lg:mt-8 pt-10 lg:pt-8 border-t border-border">
                      <p className="text-sm lg:text-xs text-muted-foreground mb-5 lg:mb-4 uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>빠른 시작</p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => onNavigate('about')}
                          className="text-left p-5 lg:p-4 border border-border hover:bg-muted text-foreground bg-card"
                        >
                          <BookOpen size={24} className="text-primary mb-3 lg:mb-2 lg:w-5 lg:h-5" />
                          <span className="text-base lg:text-sm font-medium text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>과정소개</span>
                        </button>
                        <button
                          onClick={() => onNavigate('curriculum')}
                          className="text-left p-5 lg:p-4 border border-border hover:bg-muted text-foreground bg-card"
                        >
                          <Target size={24} className="text-primary mb-3 lg:mb-2 lg:w-5 lg:h-5" />
                          <span className="text-base lg:text-sm font-medium text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>커리큘럼</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-24 lg:w-20 h-24 lg:h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-5 lg:mb-4 font-serif text-4xl lg:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <h2 className="font-serif text-3xl lg:text-2xl mb-2 lg:mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {user.name}님
                      </h2>
                      <p className="text-base lg:text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                        환영합니다
                      </p>
                    </div>
                    
                    <button
                      onClick={() => onNavigate('my-classroom')}
                      className="w-full bg-primary text-primary-foreground py-5 lg:py-4 font-medium tracking-wide uppercase text-base lg:text-sm transition-all hover:opacity-80 mb-4"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      나의 강의실
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => onNavigate('courses')}
                        className="text-left p-5 lg:p-4 border border-border hover:bg-muted"
                      >
                        <BookOpen size={24} className="text-primary mb-3 lg:mb-2 lg:w-5 lg:h-5" />
                        <span className="text-base lg:text-sm font-medium text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>과정보기</span>
                      </button>
                      <button
                        onClick={() => onNavigate('profile')}
                        className="text-left p-5 lg:p-4 border border-border hover:bg-muted"
                      >
                        <Users size={24} className="text-primary mb-3 lg:mb-2 lg:w-5 lg:h-5" />
                        <span className="text-base lg:text-sm font-medium text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>내정보</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl lg:text-5xl font-serif mb-2 text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs lg:text-sm text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative -mx-5">
        {/* Top Section - Primary Background */}
        <div className="bg-primary pt-20 lg:pt-32 pb-40 lg:pb-64 text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              {/* Left - Header */}
              <div className="lg:col-span-7">
                <span className="uppercase tracking-[0.3em] text-[10px] mb-6 lg:mb-8 block opacity-70 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                  OUR EXPERTISE
                </span>
                <h2 className="font-serif text-4xl lg:text-7xl mb-8 lg:mb-10 leading-[1.05] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Services Tailored for <br/>
                  <span className="italic">Growth</span>
                </h2>
                <p className="text-white/70 text-base lg:text-lg leading-relaxed max-w-xl font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  From brand identity to complex interface systems, we focus on a methodology that ensures your vision is communicated with precision and elegance.
                </p>
              </div>

              {/* Right - Top Small Cards */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-4">
                <div className="bg-white/5 backdrop-blur-xl p-6 lg:p-8 border border-white/10 hover:bg-white/10 transition-colors duration-500">
                  <div className="text-white mb-8 lg:mb-12">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg lg:text-xl mb-3 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Systems
                  </h3>
                  <p className="text-[13px] opacity-60 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    Cohesive design frameworks for scale.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-xl p-6 lg:p-8 border border-white/10 hover:bg-white/10 transition-colors duration-500">
                  <div className="text-white mb-8 lg:mb-12">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <h3 className="font-serif text-lg lg:text-xl mb-3 tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Visuals
                  </h3>
                  <p className="text-[13px] opacity-60 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    High-end aesthetic direction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Large Cards - Overlapping */}
        <div className={`max-w-7xl mx-auto px-4 ${!isMobile ? 'lg:px-6' : ''} ${isMobile ? '-mt-20' : 'lg:-mt-40'} relative z-10 ${isMobile ? 'pb-16' : 'lg:pb-32'}`}>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-0'}`}>
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`${isMobile ? 'p-8' : 'p-12'} bg-background relative ${
                  isMobile 
                    ? 'border border-border shadow-lg' 
                    : 'border-0 shadow-[0_40px_100px_rgba(0,0,0,0.08)]'
                } ${!isMobile && idx < 2 ? 'border-r border-border' : ''}`}
              >
                {/* 오른쪽 상단 모서리 회전 로고 - 데스크탑만 */}
                {!isMobile && (
                  <div 
                    className="absolute -top-10 w-24 h-24 z-50 -right-10"
                    style={{
                      animation: 'spin 20s linear infinite',
                    }}
                  >
                    <Logo className="w-full h-full text-foreground" />
                  </div>
                )}
                
                <div className={`relative ${isMobile ? 'mb-6' : 'mb-12'}`}>
                  <span 
                    className={`font-serif ${isMobile ? 'text-5xl' : 'text-8xl'} opacity-100`}
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      color: '#7C8A7B',
                      opacity: 1
                    }}
                  >
                    {service.number}
                  </span>
                </div>
                <h3 className={`font-serif ${isMobile ? 'mb-4 text-xl' : 'mb-6 text-2xl'} leading-snug`} style={{ fontFamily: "'Playfair Display', serif" }}>
                  {service.title}
                </h3>
                <p className={`text-muted-foreground ${isMobile ? 'mb-6 text-sm' : 'mb-10 text-base'} leading-relaxed font-light`} style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  {service.description}
                </p>
                <ul className={`${isMobile ? 'space-y-3 text-xs' : 'space-y-5 text-[13px]'} font-medium tracking-wide text-muted-foreground`}>
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className={`w-1.5 h-1.5 bg-primary rounded-full ${isMobile ? 'mr-3' : 'mr-4'}`} />
                      {feature.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="relative py-16 lg:py-32 px-4 lg:px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs lg:text-sm uppercase tracking-widest text-primary font-medium mb-3 lg:mb-4 block" style={{ fontFamily: "'Inter', sans-serif" }}>
                The Process
              </span>
              <h2 className="font-serif text-3xl lg:text-5xl mb-6 lg:mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                체계적인<br/>커리큘럼
              </h2>
              <p className="text-base lg:text-lg text-muted-foreground mb-8 lg:mb-12" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                8주 동안 축제 기획의 모든 것을 배웁니다. 
                기초 이론부터 실전 프로젝트까지, 
                단계별로 체계적으로 구성된 커리큘럼입니다.
              </p>
              <button
                onClick={() => onNavigate('curriculum')}
                className="px-6 lg:px-8 py-3 lg:py-4 border border-primary text-primary font-medium tracking-wide uppercase text-xs lg:text-sm transition-all hover:bg-primary hover:text-primary-foreground"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                전체 커리큘럼 보기
              </button>
            </div>

            <div className="space-y-4 lg:space-y-6">
              {curriculum.map((week, idx) => (
                <div
                  key={idx}
                  className="flex gap-6 group"
                >
                  <div className="shrink-0 w-12 h-12 flex items-center justify-center border border-primary text-primary rounded-full font-serif text-xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {week.week}
                      </span>
                    </div>
                    <h4 className="font-serif text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {week.title}
                    </h4>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                      {week.topics.join(' • ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 섹션 하단 회전 로고 - 버튼 중앙 근처 */}
        <div 
          className="absolute bottom-0 left-[15%] translate-y-1/2 w-20 h-20 lg:w-24 lg:h-24 z-20 opacity-50"
          style={{
            animation: 'spin 20s linear infinite',
          }}
        >
          <Logo className="w-full h-full text-foreground" />
        </div>
      </section>

      {/* Professors Section */}
      <section className="py-16 lg:py-32 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-20">
            <span className="text-xs lg:text-sm uppercase tracking-widest text-primary font-medium mb-3 lg:mb-4 block" style={{ fontFamily: "'Inter', sans-serif" }}>
              Our Team
            </span>
            <h2 className="font-serif text-3xl lg:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              전문 교수진
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {professors.map((prof, idx) => (
              <div key={idx} className="group cursor-pointer">
                {/* 스켈레톤 이미지 - 회색 배경 */}
                <div className="overflow-hidden bg-muted/50 aspect-[3/4] mb-4 lg:mb-6 relative" />
                <h3 className="font-serif text-xl lg:text-2xl mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {prof.name}
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {prof.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 lg:py-32 px-4 lg:px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-12 lg:mb-16 gap-4 lg:gap-6">
            <h2 className="font-serif text-3xl lg:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
              수강생 후기
            </h2>
            <button
              onClick={() => onNavigate('reviews')}
              className="text-primary font-medium border-b border-primary pb-1 hover:opacity-70 transition-opacity uppercase tracking-widest text-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              전체 보기
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
            {reviews.map((review, idx) => (
              <div key={idx} className="group cursor-pointer">
                {/* 스켈레톤 이미지 - 회색 배경 */}
                <div className="overflow-hidden bg-muted/50 aspect-[4/3] mb-4 lg:mb-6 relative" />
                <div className="flex items-center gap-1 mb-2 lg:mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" className="text-primary" />
                  ))}
                </div>
                <h3 className="font-serif text-lg lg:text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {review.title}
                </h3>
                <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  {review.content}
                </p>
                <p className="text-xs lg:text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
                  — {review.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-32 px-4 lg:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl mb-6 lg:mb-8 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              당신의 축제를<br/>
              <span className="text-primary italic">현실로</span> 만들어보세요.
            </h2>
            <p className="text-base lg:text-xl text-muted-foreground mb-8 lg:mb-12" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              지금 바로 시작하세요. 전문가가 될 수 있는 기회가 여기 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center">
              <button
                onClick={onLoginClick}
                className="px-8 lg:px-10 py-4 lg:py-5 bg-primary text-primary-foreground font-medium tracking-wide uppercase text-sm transition-all hover:opacity-80"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                수강 신청하기
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 lg:px-10 py-4 lg:py-5 border border-border font-medium tracking-wide uppercase text-sm transition-all hover:bg-muted"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                문의하기
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
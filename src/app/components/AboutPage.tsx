import { Award, Users, BookOpen, TrendingUp, Target, Briefcase } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AboutPage() {
  const features = [
    { 
      icon: <BookOpen size={24} />, 
      title: '체계적 교육', 
      desc: '8주 완성 커리큘럼으로 기초부터 실전까지 체계적으로 학습합니다.' 
    },
    { 
      icon: <Users size={24} />, 
      title: '현장 전문가', 
      desc: '실무 경험이 풍부한 현직 전문가들이 직접 멘토링합니다.' 
    },
    { 
      icon: <Award size={24} />, 
      title: '민간 자격증', 
      desc: '문화체육관광부 등록 국가공인 자격증을 취득합니다.' 
    },
    { 
      icon: <Briefcase size={24} />, 
      title: '취업 지원', 
      desc: '취업 연계 프로그램과 포트폴리오 작성을 지원합니다.' 
    }
  ];

  const reasons = [
    { 
      number: '01',
      title: '성장하는 산업', 
      desc: '지역 축제와 문화 이벤트 산업이 매년 성장하고 있으며, 전문 인력 수요가 지속적으로 증가하고 있습니다.' 
    },
    { 
      number: '02',
      title: '전문성 인정', 
      desc: '실무의 모든것을 배우는 만큼 전문성을 인정받아 취업과 프리랜서 활동에 큰 도움이 됩니다.' 
    },
    { 
      number: '03',
      title: '다양한 기회', 
      desc: '공공기관, 이벤트 기획사, 프리랜서 등 다양한 진로를 선택할 수 있습니다.' 
    }
  ];

  const targets = [
    '축제·이벤트 기획자로 취업을 준비하는 분',
    '지역 축제 관련 업무를 담당하는 공무원',
    '문화예술 분야에서 커리어를 시작하고 싶은 분',
    '프리랜서 기획자로 활동하고 싶은 분',
    '이벤트 회사 취업을 준비하는 대학생',
    '새로운 분야로 이직을 고려하는 직장인'
  ];

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section 
        className="py-32 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1761503390713-a1fd8b8bb6c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMGNlbGVicmF0aW9uJTIwZXZlbnR8ZW58MXx8fHwxNzcwMjU3MDUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl px-6 lg:px-12 xl:px-20">
          <span 
            className="text-sm uppercase tracking-widest font-medium mb-4 block text-white"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            About the Program
          </span>
          <h1 
            className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            축제운영전문가<br/>
            <span className="italic" style={{ color: '#6cb25b' }}>자격증 과정</span>
          </h1>
          <p 
            className="text-xl leading-relaxed mb-12 text-white/90"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            축제운영전문가는 지역 축제, 문화 이벤트, 공연 행사 등 다양한 축제를 기획하고 운영하는 전문가입니다.<br/> 
            축제의 컨셉 개발부터 예산 관리, 마케팅, 현장 운영까지 모든 과정을 총괄하며, 
            성공적인 축제를 만들어내는 핵심 인재입니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="px-6 py-3 border border-white/30 bg-white/10 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-widest mb-1 text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                교육기간
              </div>
              <div className="text-2xl font-serif text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                8주
              </div>
            </div>
            <div className="px-6 py-3 border border-white/30 bg-white/10 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-widest mb-1 text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                자격증
              </div>
              <div className="text-2xl font-serif text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                국가공인
              </div>
            </div>
            <div className="px-6 py-3 border border-white/30 bg-white/10 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-widest mb-1 text-white/70" style={{ fontFamily: "'Inter', sans-serif" }}>
                합격률
              </div>
              <div className="text-2xl font-serif text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                95%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span 
              className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Why Choose Us
            </span>
            <h2 
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              과정 특징
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="border border-border p-8 hover:border-primary transition-all duration-300 bg-background"
              >
                <div className="text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 
                  className="font-serif text-xl mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-sm text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span 
              className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Three Reasons
            </span>
            <h2 
              className="font-serif font-bold text-4xl md:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              왜 축제기획사인가?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {reasons.map((reason, idx) => (
              <div key={idx} className="group">
                <span 
                  className="text-primary font-serif text-5xl mb-6 block"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {reason.number}
                </span>
                <h3 
                  className="font-serif text-2xl mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {reason.title}
                </h3>
                <p 
                  className="text-muted-foreground leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {reason.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Section */}
      <section className="py-32 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span 
                className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Who Should Join
              </span>
              <h2 
                className="font-serif text-4xl md:text-5xl mb-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                이런 분들께<br/>
                <span className="text-primary italic">추천합니다</span>
              </h2>
              <p 
                className="text-lg text-muted-foreground mb-12"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                축제 기획 분야에 관심이 있거나, 
                전문 자격증을 취득하여 커리어를 시작하고 싶은 모든 분들을 환영합니다.
              </p>
            </div>

            <div className="space-y-4">
              {targets.map((target, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-6 border border-border bg-background hover:border-primary transition-all duration-300"
                >
                  <div className="shrink-0 w-6 h-6 flex items-center justify-center border border-primary text-primary rounded-full font-serif text-sm">
                    {idx + 1}
                  </div>
                  <p 
                    className="text-foreground"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {target}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-32 px-6 border-t border-border relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1670852453934-4ff54fbe77be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMGNlbGVicmF0aW9uJTIwcGxhbm5pbmclMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwMjcyODMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 
            className="font-serif text-5xl md:text-6xl mb-8 leading-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="italic" style={{ color: '#6cb25b' }}>8주 후</span>,<br/>
            당신은 전문<br/>축제기획사가 됩니다
          </h2>
          <p 
            className="text-xl text-white/90 mb-12 max-w-2xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            체계적인 교육과 현장 실습을 통해<br/>
            실무에 바로 투입될 수 있는 전문가로 성장합니다.
          </p>
          <button 
            className="px-10 py-5 bg-primary text-primary-foreground font-medium tracking-wide uppercase transition-all hover:opacity-80"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            지금 시작하기
          </button>
        </div>
      </section>
    </div>
  );
}
import { Building2, Award, Users, Target, CheckCircle } from 'lucide-react';

export function AboutCompany() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full max-w-[1920px] mx-auto px-6 lg:px-24 py-24 lg:py-32">
        <div className="max-w-5xl">
          <h1 
            className="text-6xl lg:text-8xl mb-8 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: '0.02em', lineHeight: '1.1' }}
          >
            About Us
          </h1>
          <p 
            className="text-xl lg:text-2xl text-muted-foreground mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
          >
            마이스홍보교육학회는 축제기획 전문가 양성을 위한 체계적인 교육 프로그램을 제공하는 교육기관입니다.
          </p>
          <p 
            className="text-base lg:text-lg text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
          >
            전문적인 커리큘럼과 실무 중심 교육을 통해 대한민국 축제 산업의 미래를 이끌어갈 인재를 육성합니다.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-muted/30 border-y border-border">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-24 py-16 lg:py-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
            <div className="text-center lg:text-left">
              <div 
                className="text-5xl lg:text-6xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                2024
              </div>
              <div 
                className="text-sm lg:text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                설립연도
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div 
                className="text-5xl lg:text-6xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                1,000+
              </div>
              <div 
                className="text-sm lg:text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                수료생
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div 
                className="text-5xl lg:text-6xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                95%
              </div>
              <div 
                className="text-sm lg:text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                만족도
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div 
                className="text-5xl lg:text-6xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                50+
              </div>
              <div 
                className="text-sm lg:text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                전문 강사진
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="w-full max-w-[1920px] mx-auto px-6 lg:px-24 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Target className="text-primary" size={32} />
              <h2 
                className="text-4xl lg:text-5xl text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                Vision
              </h2>
            </div>
            <p 
              className="text-lg lg:text-xl text-muted-foreground mb-6"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
            >
              대한민국 대표 축제기획 전문가 양성 교육기관
            </p>
            <p 
              className="text-base text-muted-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
            >
              전문적이고 체계적인 교육을 통해 축제 산업의 발전을 선도하고, 글로벌 경쟁력을 갖춘 축제기획 전문가를 배출합니다.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-8">
              <Award className="text-primary" size={32} />
              <h2 
                className="text-4xl lg:text-5xl text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                Mission
              </h2>
            </div>
            <div className="space-y-4">
              {[
                '실무 중심의 체계적인 교육 커리큘럼 제공',
                '현장 경험이 풍부한 전문 강사진 구성',
                '최신 트렌드를 반영한 교육 콘텐츠 개발',
                '수료생 네트워크 구축 및 취업 지원'
              ].map((mission, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                  <p 
                    className="text-base text-foreground"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                  >
                    {mission}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="w-full bg-muted/30">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-24 py-24 lg:py-32">
          <h2 
            className="text-4xl lg:text-6xl mb-16 lg:mb-24 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            Core Values
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Value 1 */}
            <div className="bg-card border border-border p-8 lg:p-12">
              <div 
                className="text-3xl lg:text-4xl mb-6 text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                01
              </div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                전문성
              </h3>
              <p 
                className="text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                축제기획 분야의 전문가들이 직접 설계한 체계적인 커리큘럼으로 실무 역량을 강화합니다.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-card border border-border p-8 lg:p-12">
              <div 
                className="text-3xl lg:text-4xl mb-6 text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                02
              </div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                실용성
              </h3>
              <p 
                className="text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                이론과 실습의 균형잡힌 교육으로 현장에서 바로 활용 가능한 실무 능력을 배양합니다.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-card border border-border p-8 lg:p-12">
              <div 
                className="text-3xl lg:text-4xl mb-6 text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                03
              </div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                혁신성
              </h3>
              <p 
                className="text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                최신 트렌드와 기술을 반영한 교육 콘텐츠로 미래 지향적인 축제기획 능력을 제공합니다.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-card border border-border p-8 lg:p-12">
              <div 
                className="text-3xl lg:text-4xl mb-6 text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                04
              </div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                신뢰성
              </h3>
              <p 
                className="text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                투명한 운영과 검증된 교육 프로그램으로 수강생들의 신뢰를 최우선으로 생각합니다.
              </p>
            </div>

            {/* Value 5 */}
            <div className="bg-card border border-border p-8 lg:p-12">
              <div 
                className="text-3xl lg:text-4xl mb-6 text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                05
              </div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                협력성
              </h3>
              <p 
                className="text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                수강생, 강사, 업계 관계자들과의 긴밀한 협력을 통해 함께 성장하는 생태계를 만듭니다.
              </p>
            </div>

            {/* Value 6 */}
            <div className="bg-card border border-border p-8 lg:p-12">
              <div 
                className="text-3xl lg:text-4xl mb-6 text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                06
              </div>
              <h3 
                className="text-2xl lg:text-3xl mb-4 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                지속성
              </h3>
              <p 
                className="text-base text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                수료 후에도 지속적인 교육 지원과 네트워킹 기회를 제공하여 평생 학습을 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="w-full max-w-[1920px] mx-auto px-6 lg:px-24 py-24 lg:py-32">
        <h2 
          className="text-4xl lg:text-6xl mb-16 lg:mb-24 text-foreground"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
        >
          Company Information
        </h2>
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column */}
          <div className="space-y-8">
            <div className="border-b border-border pb-6">
              <div 
                className="text-sm text-muted-foreground mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                기관명
              </div>
              <div 
                className="text-xl lg:text-2xl text-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                마이스홍보교육학회
              </div>
            </div>

            <div className="border-b border-border pb-6">
              <div 
                className="text-sm text-muted-foreground mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                대표이사
              </div>
              <div 
                className="text-xl lg:text-2xl text-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                성통렬
              </div>
            </div>

            <div className="border-b border-border pb-6">
              <div 
                className="text-sm text-muted-foreground mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                설립일
              </div>
              <div 
                className="text-xl lg:text-2xl text-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                2024년
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="border-b border-border pb-6">
              <div 
                className="text-sm text-muted-foreground mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                주소
              </div>
              <div 
                className="text-xl lg:text-2xl text-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                서울특별시 종로구 인사동길 12 1005호
              </div>
            </div>

            <div className="border-b border-border pb-6">
              <div 
                className="text-sm text-muted-foreground mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                대표번호
              </div>
              <div 
                className="text-xl lg:text-2xl text-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                1670-6237
              </div>
            </div>

            <div className="border-b border-border pb-6">
              <div 
                className="text-sm text-muted-foreground mb-2"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                이메일
              </div>
              <div 
                className="text-xl lg:text-2xl text-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                snsmediamanna@dume.net
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-24 py-24 lg:py-32 text-center">
          <h2 
            className="text-4xl lg:text-6xl mb-8 text-primary-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, lineHeight: '1.2' }}
          >
            함께 성장할 준비가 되셨나요?
          </h2>
          <p 
            className="text-lg lg:text-xl text-primary-foreground/90 mb-12"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
          >
            지금 바로 마이스홍보교육학회와 함께 축제기획 전문가의 꿈을 실현하세요.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-12 py-4 bg-primary-foreground text-primary text-lg hover:opacity-90 transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            강좌 둘러보기
          </button>
        </div>
      </section>
    </main>
  );
}

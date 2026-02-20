export function TermsOfService() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full max-w-[1920px] mx-auto px-6 lg:px-24 py-24 lg:py-32">
        <div className="max-w-5xl">
          <h1 
            className="text-6xl lg:text-8xl mb-8 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: '0.02em', lineHeight: '1.1' }}
          >
            Terms of Service
          </h1>
          <p 
            className="text-xl lg:text-2xl text-muted-foreground mb-6"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
          >
            마이스홍보교육학회 서비스 이용약관
          </p>
          <p 
            className="text-base lg:text-lg text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
          >
            최종 수정일: 2026년 1월 22일
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full max-w-[1920px] mx-auto px-6 lg:px-24 pb-24 lg:pb-32">
        <div className="max-w-4xl space-y-12 lg:space-y-16">
          {/* 제1조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제1조 (목적)
            </h2>
            <p 
              className="text-base lg:text-lg text-muted-foreground leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
            >
              본 약관은 마이스홍보교육학회(이하 "학회")가 제공하는 온라인 교육 서비스(이하 "서비스")의 이용과 관련하여 학회와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </div>

          {/* 제2조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제2조 (용어의 정의)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. "회원"이라 함은 학회에 개인정보를 제공하여 회원등록을 한 자로서, 학회의 정보를 지속적으로 제공받으며, 학회가 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. "서비스"라 함은 학회가 운영하는 온라인 교육 플랫폼을 통해 제공되는 축제기획 관련 교육 콘텐츠, 자격증 과정, 커뮤니티 등 모든 서비스를 의미합니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                3. "콘텐츠"라 함은 학회가 서비스 내에서 제공하는 강의 영상, 학습 자료, 시험 문제 등 모든 교육 자료를 말합니다.
              </p>
            </div>
          </div>

          {/* 제3조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제3조 (약관의 효력 및 변경)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. 본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. 학회는 필요한 경우 관련 법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있으며, 약관이 변경되는 경우 지체 없이 이를 공지합니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                3. 회원은 변경된 약관에 동의하지 않을 권리가 있으며, 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 제4조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제4조 (회원가입)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. 회원가입은 이용자가 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 학회가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. 학회는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  실명이 아니거나 타인의 명의를 이용한 경우
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  허위의 정보를 기재하거나, 학회가 제시하는 내용을 기재하지 않은 경우
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  부정한 용도 또는 영리를 추구할 목적으로 본 서비스를 이용하고자 하는 경우
                </li>
              </ul>
            </div>
          </div>

          {/* 제5조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제5조 (서비스의 제공 및 변경)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. 학회는 다음과 같은 서비스를 제공합니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  축제기획사 자격증 교육 과정
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  온라인 강의 및 학습 자료 제공
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  자격증 발급 서비스
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  기타 학회가 정하는 서비스
                </li>
              </ul>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. 학회는 상당한 이유가 있는 경우 운영상, 기술상의 필요에 따라 제공하고 있는 서비스를 변경할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 제6조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제6조 (서비스의 중단)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                학회는 다음 각 호에 해당하는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 경우
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  서비스를 위한 설비의 보수 등 공사로 인해 부득이한 경우
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  기타 불가항력적 사유가 있는 경우
                </li>
              </ul>
            </div>
          </div>

          {/* 제7조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제7조 (회원의 의무)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                회원은 다음 행위를 하여서는 안 됩니다.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  신청 또는 변경 시 허위 내용의 등록
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  타인의 정보 도용
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  학회에 게시된 정보의 무단 변경
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  학회가 제공하는 콘텐츠의 무단 복제, 배포, 전송
                </li>
                <li 
                  className="text-base lg:text-lg text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
                >
                  학회 기타 제3자의 저작권 등 지적재산권에 대한 침해
                </li>
              </ul>
            </div>
          </div>

          {/* 제8조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제8조 (저작권의 귀속 및 이용제한)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. 학회가 작성한 저작물에 대한 저작권 기타 지적재산권은 학회에 귀속합니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. 회원은 학회를 이용함으로써 얻은 정보 중 학회에게 지적재산권이 귀속된 정보를 학회의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.
              </p>
            </div>
          </div>

          {/* 제9조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제9조 (계약해지 및 이용제한)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. 회원이 이용계약을 해지하고자 하는 때에는 회원 본인이 온라인을 통해 학회에 해지신청을 하여야 합니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. 학회는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
              </p>
            </div>
          </div>

          {/* 제10조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제10조 (면책조항)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. 학회는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. 학회는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                3. 학회는 회원이 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
              </p>
            </div>
          </div>

          {/* 제11조 */}
          <div>
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              제11조 (분쟁해결)
            </h2>
            <div className="space-y-4">
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                1. 학회는 회원이 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치·운영합니다.
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                2. 학회와 회원간 발생한 분쟁에 관한 소송은 민사소송법상의 관할법원에 제소합니다.
              </p>
            </div>
          </div>

          {/* 부칙 */}
          <div className="border-t border-border pt-12">
            <h2 
              className="text-3xl lg:text-4xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              부칙
            </h2>
            <p 
              className="text-base lg:text-lg text-muted-foreground leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
            >
              본 약관은 2024년 1월 1일부터 시행됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full bg-muted/30 border-t border-border">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-24 py-16 lg:py-24">
          <div className="max-w-4xl">
            <h3 
              className="text-2xl lg:text-3xl mb-6 text-foreground"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
            >
              문의사항
            </h3>
            <p 
              className="text-base lg:text-lg text-muted-foreground mb-4"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
            >
              본 약관에 대한 문의사항이 있으시면 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <div className="space-y-2">
              <p 
                className="text-base lg:text-lg text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                이메일: snsmediamanna@dume.net
              </p>
              <p 
                className="text-base lg:text-lg text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
              >
                전화: 1670-6237
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

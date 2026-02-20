export function NewFooter({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <footer 
      className="py-12 md:py-24 px-4 md:px-6 border-t border-border bg-background transition-colors duration-300"
      style={{ 
        fontFamily: "'Inter', sans-serif",
        minHeight: '380px' // ✅ 최소 높이 지정으로 CLS 방지
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 relative">
          {/* Diagonal Line - Desktop Only with SVG */}
          <svg 
            className="hidden lg:block absolute inset-0 pointer-events-none" 
            style={{ 
              width: '100%', 
              height: '100%', 
              zIndex: 1 
            }}
            aria-hidden="true"
          >
            <line 
              x1="40%" 
              y1="100%" 
              x2="60%" 
              y2="0%" 
              stroke="currentColor" 
              strokeWidth="1" 
              opacity="0.15"
            />
          </svg>
          
          {/* Left - Contact */}
          <div className="relative z-10">
            <h2 
              className="font-serif text-3xl md:text-5xl mb-6 md:mb-8" 
              style={{ 
                fontFamily: "'Playfair Display', serif",
                lineHeight: '1.2',
                fontWeight: 500,
                minHeight: '120px' // ✅ 최소 높이로 폰트 로딩 시프트 방지
              }}
            >
              <span className="md:hidden" style={{ whiteSpace: 'pre-line' }}>
                Let's craft {'\n'}
                something {'\n'}
                <span className="text-primary italic">extraordinary</span>.
              </span>
              <span className="hidden md:inline">
                Let's craft something <span className="text-primary italic">extraordinary</span>.
              </span>
            </h2>
            <button
              onClick={() => {
                const email = 'snsmediamanna@dume.net';
                navigator.clipboard.writeText(email).then(() => {
                  alert('이메일 주소가 복사되었습니다: ' + email);
                }).catch(err => {
                  console.error('복사 실패:', err);
                  alert('복사에 실패했습니다.');
                });
              }}
              className="text-lg md:text-2xl font-light underline underline-offset-4 md:underline-offset-8 hover:text-primary transition-colors block cursor-pointer text-left"
              style={{ 
                fontFamily: "'Inter', sans-serif", 
                fontWeight: 300,
                wordBreak: 'keep-all',
                whiteSpace: 'nowrap',
                overflowWrap: 'normal',
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'inherit',
                minHeight: '32px' // ✅ 버튼 최소 높이
              }}
              aria-label="이메일 주소 복사"
            >
              snsmediamanna@dume.net
            </button>
            <div 
              className="mt-6 md:mt-8 space-y-1 md:space-y-2 text-xs md:text-sm text-muted-foreground" 
              style={{ 
                fontWeight: 300,
                minHeight: '80px' // ✅ 연락처 영역 최소 높이
              }}
            >
              <p>서울특별시 종로구 인사동길 12 1005호</p>
              <p>대표이사: 성통렬</p>
              <p>교육원 대표번호: 1670-6237</p>
              <p>FAX: 02-6462-3703</p>
            </div>
          </div>

          {/* Right - Links & Info */}
          <div className="flex flex-col justify-end items-start md:items-end">
            <nav 
              className="flex flex-row flex-wrap gap-x-6 gap-y-2 mb-8 md:mb-12"
              aria-label="푸터 네비게이션"
              style={{ minHeight: '24px' }} // ✅ 네비게이션 최소 높이
            >
              <button 
                onClick={() => onNavigate?.('about-company')}
                className="text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide cursor-pointer bg-transparent border-none p-0"
                style={{ whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif" }}
                aria-label="회사소개 페이지로 이동"
              >
                회사소개
              </button>
              <button 
                onClick={() => onNavigate?.('terms')}
                className="text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide cursor-pointer bg-transparent border-none p-0"
                style={{ whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif" }}
                aria-label="이용약관 페이지로 이동"
              >
                이용약관
              </button>
              <button 
                onClick={() => onNavigate?.('privacy')}
                className="text-xs md:text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide cursor-pointer bg-transparent border-none p-0"
                style={{ whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif" }}
                aria-label="개인정보처리방침 페이지로 이동"
              >
                개인정보처리방침
              </button>
            </nav>
            <p 
              className="text-xs opacity-40 text-left md:text-right" 
              style={{ 
                fontWeight: 300,
                minHeight: '16px' // ✅ 카피라이트 최소 높이
              }}
            >
              © 2024 마이스홍보교육학회. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
// 공통 스켈레톤 컴포넌트들

// ✅ 기본 페이지 스켈레톤 (범용)
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        {/* 헤더 */}
        <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-6 bg-muted rounded w-2/3 mb-12"></div>
        
        {/* 컨텐츠 블록들 */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-12">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-6 bg-muted rounded w-2/3 mb-12"></div>
      
      {/* 컨텐츠 블록들 */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-12">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-4/6"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CurriculumPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-12"></div>
      
      {/* 커리큘럼 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border border-border p-6 bg-card">
            <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
            <div className="h-10 bg-muted rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CertificatePageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-6 bg-muted rounded w-2/3 mb-12"></div>
      
      {/* 자격증 이미지 */}
      <div className="mb-12">
        <div className="aspect-[4/3] bg-muted rounded-lg"></div>
      </div>
      
      {/* 설명 */}
      <div className="space-y-4">
        <div className="h-6 bg-muted rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export function ReviewsPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-12"></div>
      
      {/* 리뷰 카드들 */}
      <div className="space-y-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border border-border p-6 bg-card">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-muted rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/6"></div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-5 h-5 bg-muted rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-3/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NoticePageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/4 mb-12"></div>
      
      {/* 공지사항 리스트 */}
      <div className="border border-border">
        {/* 테이블 헤더 */}
        <div className="border-b border-border p-4 bg-muted">
          <div className="flex gap-4">
            <div className="h-5 bg-background rounded w-12"></div>
            <div className="h-5 bg-background rounded flex-1"></div>
            <div className="h-5 bg-background rounded w-24"></div>
            <div className="h-5 bg-background rounded w-16"></div>
          </div>
        </div>
        
        {/* 테이블 아이템들 */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border-b border-border p-4">
            <div className="flex gap-4 items-center">
              <div className="h-5 bg-muted rounded w-12"></div>
              <div className="h-5 bg-muted rounded flex-1"></div>
              <div className="h-5 bg-muted rounded w-24"></div>
              <div className="h-5 bg-muted rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 페이지네이션 */}
      <div className="flex justify-center gap-2 mt-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-10 h-10 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  );
}

export function SupportPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-6 bg-muted rounded w-2/3 mb-12"></div>
      
      {/* 문의 양식 */}
      <div className="border border-border p-8 bg-card space-y-6">
        {/* 이름 */}
        <div>
          <div className="h-5 bg-muted rounded w-20 mb-2"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
        
        {/* 이메일 */}
        <div>
          <div className="h-5 bg-muted rounded w-20 mb-2"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
        
        {/* 제목 */}
        <div>
          <div className="h-5 bg-muted rounded w-20 mb-2"></div>
          <div className="h-10 bg-muted rounded w-full"></div>
        </div>
        
        {/* 내용 */}
        <div>
          <div className="h-5 bg-muted rounded w-20 mb-2"></div>
          <div className="h-32 bg-muted rounded w-full"></div>
        </div>
        
        {/* 버튼 */}
        <div className="h-12 bg-muted rounded w-full"></div>
      </div>
    </div>
  );
}

export function PaymentPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/4 mb-12"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 왼쪽: 주문 정보 */}
        <div className="border border-border p-6 bg-card space-y-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          
          {/* 강좌 정보 */}
          <div className="space-y-4">
            <div className="h-5 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
          
          {/* 가격 */}
          <div className="border-t border-border pt-4">
            <div className="h-8 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        
        {/* 오른쪽: 결제 정보 */}
        <div className="border border-border p-6 bg-card space-y-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          
          {/* 입력 필드들 */}
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-5 bg-muted rounded w-24 mb-2"></div>
              <div className="h-10 bg-muted rounded w-full"></div>
            </div>
          ))}
          
          {/* 결제 버튼 */}
          <div className="h-12 bg-muted rounded w-full mt-6"></div>
        </div>
      </div>
    </div>
  );
}

export function AboutCompanySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-12"></div>
      
      {/* 회사 정보 섹션들 */}
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              <div className="aspect-video bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TermsOfServiceSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-5 bg-muted rounded w-1/6 mb-12"></div>
      
      {/* 약관 내용 */}
      <div className="space-y-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i}>
            <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PrivacyPolicySkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-5 bg-muted rounded w-1/6 mb-12"></div>
      
      {/* 개인정보처리방침 내용 */}
      <div className="space-y-8">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i}>
            <div className="h-6 bg-muted rounded w-2/5 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-3/6"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoursesPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
      {/* 헤더 */}
      <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
      <div className="h-6 bg-muted rounded w-2/3 mb-12"></div>
      
      {/* 강좌 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border bg-card overflow-hidden">
            {/* 이미지 */}
            <div className="aspect-video bg-muted"></div>
            
            {/* 컨텐츠 */}
            <div className="p-6 space-y-4">
              <div className="h-7 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-4/6"></div>
              </div>
              
              {/* 가격 */}
              <div className="h-8 bg-muted rounded w-1/3"></div>
              
              {/* 버튼 */}
              <div className="h-12 bg-muted rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
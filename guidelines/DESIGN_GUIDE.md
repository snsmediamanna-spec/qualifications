# 🎨 축제기획사 교육기관 웹사이트 디자인 가이드

> **작성일**: 2026년 2월 12일  
> **버전**: 1.0.0  
> **목적**: 모든 페이지와 컴포넌트의 디자인 일관성 유지

---

## 📐 디자인 시스템 개요

### 핵심 철학
- **고급스러운 미니멀리즘**: 불필요한 요소를 제거하고 본질에 집중
- **우아한 타이포그래피**: Playfair Display + Inter 조합
- **자연스러운 색상**: 초록색 (#6cb25b)을 중심으로 한 차분한 팔레트
- **부드러운 인터랙션**: 모든 전환은 자연스럽고 부드럽게

---

## 🎨 컬러 시스템

### Primary Color (주 색상)
```css
--primary: #6cb25b;           /* 메인 초록색 */
--primary-foreground: #ffffff; /* 흰색 텍스트 */
```

**사용처**:
- CTA 버튼 (로그인, 수강신청 등)
- 강조 요소 (배지, 아이콘)
- 답변 완료 상태
- 관리자 프로필 아바타

### Background (배경)
```css
--background: #f2efe9;  /* 밝은 베이지 */
--foreground: #1a1c1b;  /* 거의 검정 텍스트 */
```

**사용처**:
- 페이지 전체 배경
- 본문 텍스트 색상

### Card (카드)
```css
--card: #ffffff;              /* 순백색 */
--card-foreground: #1a1c1b;   /* 거의 검정 텍스트 */
```

**사용처**:
- Q&A 질문/답변 카드
- 강의 카드
- 모든 컨텐츠 카드

### Border (테두리)
```css
--border: rgba(0, 0, 0, 0.05);  /* 매우 얇은 투명 검정 */
```

**사용처**:
- 카드 테두리
- 입력 필드 테두리
- 구분선

### Secondary & Muted (보조 색상)
```css
--secondary: #d9d5cd;           /* 연한 회색 */
--muted: #e5e1d8;               /* 밝은 회색 */
--muted-foreground: #6b6d6a;    /* 회색 텍스트 */
```

**사용처**:
- 배지 배경
- 비활성 상태
- 보조 정보 텍스트

### Destructive (삭제/경고)
```css
--destructive: #d4183d;              /* 빨강 */
--destructive-foreground: #ffffff;   /* 흰색 텍스트 */
```

**사용처**:
- 삭제 버튼
- 경고 메시지

### Status Colors (상태별 색상)
```css
/* 답변 대기 */
border-amber-500/20
text-amber-700
bg-amber-50

/* 답변 완료 */
border-primary/20
text-primary
bg-primary/5

/* 비공개 */
border-muted-foreground/20
text-muted-foreground
```

---

## ✍️ 타이포그래피

### 폰트 패밀리

#### 1. Playfair Display (제목/헤딩)
```css
font-family: 'Playfair Display', serif;
font-weight: 500; /* Medium */
```

**사용처**:
- 페이지 제목 (h1)
- 섹션 제목 (h2, h3)
- Q&A 질문 제목
- 중요한 메시지 제목

**예시**:
```tsx
<h1 style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}>
  질문과 답변
</h1>
```

#### 2. Inter (본문/UI)
```css
font-family: 'Inter', sans-serif;
font-weight: 300; /* Light */
font-weight: 400; /* Regular - 버튼/라벨 */
```

**사용처**:
- 본문 텍스트
- 버튼 텍스트
- 입력 필드
- 모든 UI 텍스트

**예시**:
```tsx
<p style={{ fontFamily: 'Inter', fontWeight: 300 }}>
  질문 내용이 들어갑니다.
</p>
```

### 폰트 크기 (Tailwind 클래스 사용 금지!)
```css
/* ❌ 사용 금지 */
text-sm, text-lg, text-xl, text-2xl 등

/* ✅ 대신 사용 */
className="text-base"  /* 기본 크기만 사용 */
```

**중요**: 폰트 크기는 `theme.css`에 정의된 기본값을 사용합니다.

---

## 🧩 컴포넌트 스타일 가이드

### 1. Card (카드)
```tsx
<Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
  <CardHeader className="border-b border-border pb-6">
    {/* 헤더 내용 */}
  </CardHeader>
  <CardContent className="pt-6">
    {/* 본문 내용 */}
  </CardContent>
</Card>
```

**특징**:
- 기본 그림자: `shadow-sm`
- 호버 시: `hover:shadow-md`
- 테두리: `border-border`
- 배경: `bg-card`
- 하단 구분선: `border-b border-border`

### 2. Button (버튼)
```tsx
{/* Primary 버튼 */}
<Button 
  className="bg-primary hover:bg-primary/90 text-primary-foreground"
  style={{ fontFamily: 'Inter' }}
>
  전송
</Button>

{/* Outline 버튼 */}
<Button 
  variant="outline"
  className="border-border hover:border-primary hover:text-primary transition-all"
  style={{ fontFamily: 'Inter' }}
>
  수정
</Button>

{/* Ghost 버튼 */}
<Button 
  variant="ghost"
  className="text-foreground hover:text-primary transition-colors"
  style={{ fontFamily: 'Inter' }}
>
  취소
</Button>
```

**특징**:
- 항상 `fontFamily: 'Inter'` 적용
- 부드러운 transition 효과
- Primary 버튼: 초록색 배경
- Outline 버튼: 투명 배경 + 테두리
- Ghost 버튼: 완전 투명

### 3. Badge (배지)
```tsx
{/* 상태 배지 - 답변 대기 */}
<Badge 
  variant="outline" 
  className="border-amber-500/20 text-amber-700 bg-amber-50 dark:bg-amber-950/20"
  style={{ fontFamily: 'Inter', fontWeight: 300 }}
>
  답변 대기
</Badge>

{/* 상태 배지 - 답변 완료 */}
<Badge 
  variant="outline" 
  className="border-primary/20 text-primary bg-primary/5"
  style={{ fontFamily: 'Inter', fontWeight: 300 }}
>
  <CheckCircle2 className="w-3 h-3 mr-1" />
  답변 완료
</Badge>

{/* 카테고리 배지 */}
<Badge 
  className="bg-secondary text-secondary-foreground border-0"
  style={{ fontFamily: 'Inter', fontWeight: 300 }}
>
  수강신청
</Badge>

{/* 비공개 배지 */}
<Badge 
  variant="outline" 
  className="border-muted-foreground/20 text-muted-foreground"
  style={{ fontFamily: 'Inter', fontWeight: 300 }}
>
  <Lock className="w-3 h-3 mr-1" />
  비공개
</Badge>
```

**특징**:
- 항상 `fontFamily: 'Inter', fontWeight: 300` 적용
- 아이콘 크기: `w-3 h-3`
- 투명도를 활용한 부드러운 색상 표현

### 4. Input & Textarea (입력 필드)
```tsx
<Textarea
  placeholder="답변을 입력하세요..."
  className="resize-none border-border focus:border-primary focus:ring-primary bg-input-background"
  style={{ fontFamily: 'Inter', fontWeight: 300 }}
  rows={6}
  maxLength={2000}
/>
```

**특징**:
- 테두리: `border-border`
- 포커스 시: `focus:border-primary focus:ring-primary`
- 배경: `bg-input-background`
- 폰트: Inter Light

### 5. Avatar (프로필 아바타)
```tsx
{/* 사용자 아바타 */}
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
  {userName.charAt(0).toUpperCase()}
</div>

{/* 관리자 아바타 */}
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
  A
</div>
```

**특징**:
- 크기: `w-10 h-10`
- 완전한 원형: `rounded-full`
- 사용자: 파란색 그라데이션
- 관리자: 초록색 단색

---

## 📦 레이아웃 시스템

### 페이지 컨테이너
```tsx
<div className="min-h-screen bg-background pt-24 pb-32">
  <div className="max-w-4xl mx-auto px-6">
    {/* 페이지 내용 */}
  </div>
</div>
```

**특징**:
- 전체 높이: `min-h-screen`
- 배경: `bg-background`
- 상단 여백: `pt-24` (헤더 높이 고려)
- 하단 여백: `pb-32`
- 최대 너비: `max-w-4xl` (Q&A, 상세 페이지)
- 좌우 여백: `px-6`

### 반응형 컨테이너
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* 내용 */}
</div>
```

**브레이크포인트**:
- 모바일: `px-4` (16px)
- 태블릿: `sm:px-6` (24px)
- 데스크탑: `lg:px-8` (32px)

### 스페이싱 (간격)
```tsx
{/* 섹션 간격 */}
<div className="space-y-6">
  <Card />
  <Card />
</div>

{/* 요소 간격 */}
<div className="mb-12">  {/* 큰 간격 */}
<div className="mb-8">   {/* 중간 간격 */}
<div className="mb-6">   {/* 작은 간격 */}
<div className="mb-4">   {/* 매우 작은 간격 */}
```

---

## 🎭 인터랙션 & 애니메이션

### Transition (전환)
```css
/* 기본 transition */
transition-colors    /* 색상 전환 */
transition-shadow    /* 그림자 전환 */
transition-all       /* 모든 속성 전환 */
```

### Hover 효과
```tsx
{/* 카드 호버 */}
hover:shadow-md

{/* 버튼 호버 */}
hover:bg-primary/90
hover:border-primary
hover:text-primary

{/* 텍스트 호버 */}
hover:text-primary
```

### Focus 효과
```tsx
{/* 입력 필드 포커스 */}
focus:border-primary
focus:ring-primary

{/* 버튼 포커스 */}
focus:ring-2
focus:ring-primary
focus:ring-offset-2
```

---

## 🌓 다크 모드 지원

### 자동 적응
```tsx
{/* 다크 모드 자동 색상 */}
bg-background          /* 라이트: #f2efe9, 다크: #1a1c1b */
text-foreground        /* 라이트: #1a1c1b, 다크: #f2efe9 */
bg-card                /* 라이트: #ffffff, 다크: #252726 */
border-border          /* 자동 투명도 조정 */

{/* 다크 모드 직접 지정 */}
bg-amber-50 dark:bg-amber-950/20
text-amber-900 dark:text-amber-100
```

---

## 📝 코드 작성 규칙

### 1. 절대 사용 금지
```tsx
❌ className="text-lg text-xl text-2xl"  // 폰트 크기
❌ className="font-bold font-semibold"   // 폰트 굵기
❌ className="leading-tight leading-6"   // 줄 높이
```

### 2. 항상 사용
```tsx
✅ style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}  // 제목
✅ style={{ fontFamily: 'Inter', fontWeight: 300 }}              // 본문
✅ className="bg-background text-foreground"                     // 배경/텍스트
✅ className="border-border bg-card"                             // 카드
✅ className="text-primary hover:text-primary/90"                // Primary 색상
```

### 3. 컴포넌트 구조
```tsx
export function ComponentName() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="border-b border-border pb-6">
            <h1 
              className="text-card-foreground leading-tight"
              style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}
            >
              제목
            </h1>
          </CardHeader>
          <CardContent className="pt-6">
            <p 
              className="text-card-foreground whitespace-pre-wrap leading-relaxed"
              style={{ fontFamily: 'Inter', fontWeight: 300 }}
            >
              본문 내용
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## 🎯 체크리스트

새로운 페이지나 컴포넌트를 만들 때 반드시 확인:

- [ ] **Playfair Display**: 모든 제목/헤딩에 적용
- [ ] **Inter Light (300)**: 모든 본문 텍스트에 적용
- [ ] **bg-background**: 페이지 배경
- [ ] **bg-card**: 카드 배경
- [ ] **border-border**: 모든 테두리
- [ ] **text-primary**: 강조 요소
- [ ] **hover 효과**: 인터랙티브 요소
- [ ] **transition**: 부드러운 전환
- [ ] **pt-24 pb-32**: 페이지 상하 여백
- [ ] **max-w-4xl 또는 max-w-7xl**: 최대 너비
- [ ] **px-6**: 좌우 여백
- [ ] **다크 모드**: 자동 적응 확인

---

## 📚 참고 페이지

완성된 디자인 예시:
1. `/src/app/components/QnADetailPage.tsx` - Q&A 상세 페이지
2. `/src/app/components/FestivalHomePage.tsx` - 홈 페이지
3. `/src/styles/theme.css` - 전체 디자인 토큰

---

**마지막 업데이트**: 2026년 2월 12일  
**변경 사항이 있을 경우 이 문서를 업데이트하세요!**

# 🎓 축제기획사 교육기관 웹사이트 - 개발 가이드라인

---

## 📋 프로젝트 개요

**프로젝트**: 축제기획사 자격증 교육기관 웹사이트  
**백엔드**: Google Apps Script + Google Sheets  
**프론트엔드**: React + TypeScript + Tailwind CSS v4  
**디자인**: Playfair Display + Inter, 초록색 테마 (#6cb25b), 고급스러운 미니멀 스타일

---

## 🎨 디자인 시스템

**⚠️ 중요**: 모든 디자인 결정은 `/guidelines/DESIGN_GUIDE.md`를 참조하세요!

### 핵심 원칙
1. **타이포그래피**:
   - 제목/헤딩: `Playfair Display` (fontWeight: 500)
   - 본문/UI: `Inter` (fontWeight: 300)
   - ❌ **절대 사용 금지**: Tailwind 폰트 크기 클래스 (`text-lg`, `text-xl`, `text-2xl` 등)

2. **컬러 시스템**:
   - Primary: `#6cb25b` (초록색)
   - Background: `#f2efe9` (베이지)
   - Card: `#ffffff` (순백)
   - Border: `rgba(0, 0, 0, 0.05)` (투명)
   - ✅ **항상 사용**: `bg-background`, `text-foreground`, `bg-card`, `border-border`

3. **레이아웃**:
   - 페이지 상단 여백: `pt-24` (헤더 고려)
   - 페이지 하단 여백: `pb-32`
   - 최대 너비: `max-w-4xl` (상세), `max-w-7xl` (목록)
   - 좌우 여백: `px-6`

4. **인터랙션**:
   - 모든 전환: `transition-colors`, `transition-shadow`, `transition-all`
   - 호버 효과: `hover:shadow-md`, `hover:text-primary`
   - 포커스: `focus:border-primary`, `focus:ring-primary`

### 컴포넌트 스타일 예시

```tsx
// ✅ 올바른 예시
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
      본문
    </p>
  </CardContent>
</Card>

// ❌ 잘못된 예시
<Card className="bg-white shadow-lg">  {/* bg-card 사용해야 함 */}
  <h1 className="text-2xl font-bold">제목</h1>  {/* Playfair Display 적용 필요 */}
  <p className="text-lg">본문</p>  {/* Inter + text-lg 금지 */}
</Card>
```

---

## 🏗️ 프로젝트 구조

```
/src
  /app
    /components      # 재사용 컴포넌트
    /pages           # 페이지 래퍼
    /layouts         # 레이아웃
    /utils           # 유틸리티
  /services          # API 서비스
  /utils             # 인증 등
  /styles
    theme.css        # 디자인 토큰
    fonts.css        # 폰트 import

/guidelines
  DESIGN_GUIDE.md    # 🎨 디자인 가이드 (필독!)
  admin.gs.md        # 회원 관리 API
  log.gs.md          # 접속 로그 API
  qna.gs.md          # Q&A 게시판 API
  test.gs.md         # 시험 시스템 API
```

---

## 🔧 개발 규칙

### 1. 파일 생성
- 컴포넌트: `/src/app/components/ComponentName.tsx`
- 페이지 래퍼: `/src/app/pages/PageNameWrapper.tsx`
- 서비스: `/src/services/service-name.service.ts`

### 2. React Router
- 엔트리포인트: `/src/app/App.tsx`
- 라우팅 설정: `/src/app/routes.tsx`
- Data Mode 패턴 사용: `createBrowserRouter`

### 3. 상태 관리
- 로그인 상태: `getCurrentUser()` from `/src/utils/auth.ts`
- 관리자 권한: `user?.isAdmin === true`

### 4. API 호출
- Admin: `adminService` from `/src/app/utils/gas-api.ts`
- Log: `logService`
- QnA: `qnaService` from `/src/services/qna.service.ts`
- Test: `testService`

---

## 🎯 새로운 페이지/컴포넌트 생성 체크리스트

- [ ] **디자인 가이드 확인**: `/guidelines/DESIGN_GUIDE.md` 읽기
- [ ] **Playfair Display**: 모든 제목에 적용
- [ ] **Inter Light (300)**: 모든 본문에 적용
- [ ] **bg-background**: 페이지 배경
- [ ] **bg-card**: 카드 배경
- [ ] **border-border**: 모든 테두리
- [ ] **pt-24 pb-32**: 페이지 여백
- [ ] **max-w-4xl 또는 max-w-7xl**: 컨테이너 너비
- [ ] **transition 효과**: 인터랙티브 요소
- [ ] **다크 모드 지원**: 자동 적응 확인

---

## 📚 참고 문서

1. **디자인 가이드**: `/guidelines/DESIGN_GUIDE.md` ⭐️ **필독!**
2. **완성된 예시**:
   - Q&A 상세: `/src/app/components/QnADetailPage.tsx`
   - 홈 페이지: `/src/app/components/FestivalHomePage.tsx`
3. **Google Apps Script**:
   - Admin API: `/guidelines/admin.gs.md`
   - Q&A API: `/guidelines/qna.gs.md`

---

## 🚨 절대 금지 사항

❌ **절대 사용하지 마세요**:
- Tailwind 폰트 크기: `text-sm`, `text-lg`, `text-xl`, `text-2xl` 등
- Tailwind 폰트 굵기: `font-bold`, `font-semibold` 등
- Tailwind 줄 높이: `leading-tight`, `leading-6` 등
- 하드코딩된 색상: `bg-white`, `text-black`, `bg-green-500` 등

✅ **항상 사용하세요**:
- `style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}` (제목)
- `style={{ fontFamily: 'Inter', fontWeight: 300 }}` (본문)
- `bg-background`, `text-foreground`, `bg-card`, `border-border` (색상)
- `transition-*` (애니메이션)

---

## 💡 AI 어시스턴트를 위한 지침

**새로운 요청을 받으면**:
1. 먼저 `/guidelines/DESIGN_GUIDE.md`를 참조
2. 기존 컴포넌트 스타일을 유지
3. Playfair Display + Inter 조합 사용
4. CSS 변수와 Tailwind 유틸리티 클래스 조합
5. 다크 모드 자동 지원

**코드 수정 시**:
- 디자인 일관성 최우선
- 불필요한 스타일 변경 금지
- 기존 컴포넌트 패턴 따르기

---

**마지막 업데이트**: 2026년 2월 12일  
**모든 개발은 이 가이드라인을 따라야 합니다!**

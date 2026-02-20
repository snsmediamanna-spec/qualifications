# 🎓 Festival Academy - 축제기획사 자격증 교육 플랫폼

> **전문 축제기획사 양성을 위한 프로덕션 레벨 온라인 교육 플랫폼**  
> Google Apps Script 기반 완전 서버리스 아키텍처

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.1.12-38B2AC?style=for-the-badge&logo=tailwind-css)
![Google Apps Script](https://img.shields.io/badge/Backend-Google_Apps_Script-4285F4?style=for-the-badge&logo=google)

---

## 📑 목차

1. [프로젝트 아키텍처](#-프로젝트-아키텍처)
2. [기술 스택 전체 구성](#-기술-스택-전체-구성)
3. [전체 디렉토리 구조](#-전체-디렉토리-구조)
4. [페이지 & 라우팅 구조](#-페이지--라우팅-구조)
5. [컴포넌트 구조](#-컴포넌트-구조)
6. [백엔드 & 데이터 구조](#-백엔드--데이터-구조)
7. [보안 시스템](#-보안-시스템)
8. [디자인 시스템](#-디자인-시스템)
9. [주요 기능](#-주요-기능)
10. [개발 가이드](#-개발-가이드)
11. [배포 가이드](#-배포-가이드)

---

## 🏗 프로젝트 아키텍처

### 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 브라우저                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React 18 SPA (Vite + TypeScript)             │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐      │   │
│  │  │  React     │  │  Tailwind  │  │   Radix    │      │   │
│  │  │  Router    │  │   CSS 4    │  │     UI     │      │   │
│  │  └────────────┘  └────────────┘  └────────────┘      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                  Google Apps Script (서버리스)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              REST API Endpoints                      │   │
│  │  • /exec?action=signup    (회원가입)                  │   │
│  │  • /exec?action=login     (로그인)                    │   │
│  │  • /exec?action=getCourses (강의 조회)                │   │
│  │  • /exec?action=submitTest (시험 제출)                │   │
│  │  • /exec?action=batchLog   (로그 기록)                │   │
│  │  • ... (20+ endpoints)                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Google Sheets (데이터베이스)              │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐        │
│  │ members │ courses │  tests  │   qna   │  logs   │        │
│  │ (회원)   │ (강의)  │ (시험)  │ (게시판) │(보안로그)│        │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘        │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Google Drive (파일 저장소)                │
│  • 강의 영상 (MP4)                                           │
│  • 업로드된 이미지                                           │
│  • PDF 자료                                                 │
└─────────────────────────────────────────────────────────────┘
```

### 핵심 설계 철학

| 원칙 | 설명 | 구현 방법 |
|------|------|----------|
| **서버리스 우선** | 별도 서버 없이 운영 | Google Apps Script + Sheets |
| **완전한 보안** | 엔터프라이즈급 보안 시스템 | IP 차단, 로깅, SQL Injection 방지 |
| **고급 디자인** | 프리미엄 브랜드 이미지 | Playfair Display + Inter, 미니멀리즘 |
| **반응형 최적화** | 모든 디바이스 완벽 대응 | 모바일 우선 + 스케일링 시스템 |
| **성능 최적화** | 빠른 로딩 & 부드러운 UX | Vite, Code Splitting, 지연 로딩 |

---

## 🛠 기술 스택 전체 구성

### Frontend Core

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **React** | 18.3.1 | UI 라이브러리 | 전체 앱 |
| **TypeScript** | 5.x | 타입 시스템 | 모든 `.ts/.tsx` 파일 |
| **Vite** | 6.3.5 | 빌드 도구 & 개발 서버 | `vite.config.ts` |
| **React Router** | 7.13.0 | SPA 라우팅 | `routes.tsx` |

### UI Framework & Styling

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **Tailwind CSS** | 4.1.12 | 유틸리티 CSS | 전체 스타일링 |
| **Radix UI** | 1.x | 접근성 높은 헤드리스 컴포넌트 | `components/ui/*` |
| **Material UI** | 7.3.5 | UI 컴포넌트 라이브러리 | 관리자 페이지 |
| **@emotion/react** | 11.14.0 | CSS-in-JS (MUI 의존성) | MUI 스타일링 |
| **@emotion/styled** | 11.14.1 | Styled Components | MUI 스타일링 |
| **class-variance-authority** | 0.7.1 | 조건부 CSS 클래스 | UI 컴포넌트 |
| **clsx** | 2.1.1 | 클래스명 조합 | 전체 컴포넌트 |
| **tailwind-merge** | 3.2.0 | Tailwind 클래스 병합 | `utils.ts` |
| **next-themes** | 0.4.6 | 다크모드 관리 | 테마 전환 |

### Animation & Motion

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **Motion** | 12.23.24 | 애니메이션 라이브러리 (Framer Motion 후속) | 페이지 전환, 요소 애니메이션 |
| **tw-animate-css** | 1.3.8 | Tailwind 애니메이션 확장 | CSS 애니메이션 |

### UI Components & Widgets

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **Lucide React** | 0.487.0 | 아이콘 라이브러리 | 전체 아이콘 |
| **@mui/icons-material** | 7.3.5 | Material 아이콘 | 관리자 대시보드 |
| **react-slick** | 0.31.0 | 캐러셀/슬라이더 | 홈페이지 배너 |
| **slick-carousel** | 1.8.1 | Slick 캐러셀 CSS | 배너 스타일 |
| **embla-carousel-react** | 8.6.0 | 고성능 캐러셀 | 리뷰 캐러셀 |
| **vaul** | 1.1.2 | 모바일 드로어 | 모바일 메뉴 |

### Form & Input

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **react-hook-form** | 7.55.0 | 폼 상태 관리 | 로그인, 회원가입, Q&A |
| **react-quill** | 2.0.0 | WYSIWYG 에디터 | Q&A 글쓰기, 공지사항 |
| **input-otp** | 1.4.2 | OTP 입력 UI | (향후 2FA 구현용) |
| **react-day-picker** | 8.10.1 | 날짜 선택기 | 프로필 생년월일 |
| **date-fns** | 3.6.0 | 날짜 처리 유틸리티 | 날짜 포맷팅 |

### Data Visualization

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **Recharts** | 2.15.2 | 차트 라이브러리 | 관리자 통계 대시보드 |

### Drag & Drop

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **react-dnd** | 16.0.1 | 드래그 앤 드롭 코어 | 문제 순서 변경 |
| **react-dnd-html5-backend** | 16.0.1 | HTML5 DnD 백엔드 | DnD 백엔드 |

### Layout & Panels

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **react-resizable-panels** | 2.1.7 | 크기 조절 가능한 패널 | 관리자 대시보드 |
| **react-responsive-masonry** | 2.7.1 | 반응형 Masonry 레이아웃 | 리뷰 갤러리 |

### File Handling

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **XLSX** | 0.18.5 | Excel 파일 파싱/생성 | 시험문제 일괄 업로드 |
| **jsPDF** | 4.1.0 | PDF 생성 | 자격증 발급 |

### Utility Libraries

| 기술 | 버전 | 역할 | 사용 위치 |
|------|------|------|----------|
| **@popperjs/core** | 2.11.8 | 툴팁/팝오버 포지셔닝 | Popper 기반 컴포넌트 |
| **react-popper** | 2.3.0 | React Popper 래퍼 | 드롭다운, 툴팁 |
| **cmdk** | 1.1.1 | 커맨드 메뉴 (Cmd+K) | 관리자 빠른 검색 |
| **sonner** | 2.0.3 | 토스트 알림 | 성공/실패 메시지 |
| **react-helmet-async** | 2.0.5 | SEO 메타태그 관리 | `SEOHead.tsx` |

### Backend & API

| 기술 | 설명 | 엔드포인트 수 |
|------|------|--------------|
| **Google Apps Script** | 서버리스 백엔드 | 25+ endpoints |
| **Google Sheets** | NoSQL 데이터베이스 | 9개 시트 |
| **Google Drive** | 파일 스토리지 | 영상/이미지 호스팅 |

### External APIs

| 서비스 | 용도 | 사용 위치 |
|--------|------|----------|
| **Daum Postcode API** | 주소 검색 | 회원가입 |
| **ipify API** | IP 주소 조회 | 접속 로그 |
| **Google Search Console** | SEO 관리 | `google22fe522660d4ec0a_.html` |

### DevOps & Build Tools

| 기술 | 버전 | 역할 |
|------|------|------|
| **@vitejs/plugin-react** | 4.7.0 | Vite React 플러그인 |
| **@tailwindcss/vite** | 4.1.12 | Tailwind Vite 플러그인 |
| **PostCSS** | 최신 | CSS 후처리 |

---

## 📁 전체 디렉토리 구조

```
festival-academy/
│
├── 📄 index.html                          # HTML 엔트리포인트
├── 📄 package.json                        # NPM 패키지 설정
├── 📄 vite.config.ts                      # Vite 빌드 설정
├── 📄 postcss.config.mjs                  # PostCSS 설정
├── 📄 README.md                           # 프로젝트 문서 (이 파일)
├── 📄 EXAM_BULK_UPLOAD_GUIDE.md          # 시험문제 업로드 가이드
├── 📄 ATTRIBUTIONS.md                     # 오픈소스 라이선스
│
├── 📁 guidelines/                         # 개발 가이드라인
│   ├── Guidelines.md                      # 전체 개발 가이드
│   ├── DESIGN_GUIDE.md                    # 디자인 시스템 가이드
│   ├── admin.gs.md                        # 회원 관리 API 문서
│   ├── log.gs.md                          # 로깅 API 문서
│   ├── qna.gs.md                          # Q&A API 문서
│   └── test.gs.md                         # 시험 API 문서
│
└── 📁 src/                                # 소스 코드 루트
    │
    ├── 📄 main.tsx                        # React 앱 진입점
    │
    ├── 📁 app/                            # 앱 코어
    │   │
    │   ├── 📄 App.tsx                     # 메인 앱 컴포넌트
    │   ├── 📄 routes.tsx                  # 라우팅 설정 (29개 라우트)
    │   │
    │   ├── 📁 components/                 # UI 컴포넌트 (43개)
    │   │   │
    │   │   ├── 🏠 페이지 컴포넌트 (21개)
    │   │   │   ├── FestivalHomePage.tsx        # 홈페이지
    │   │   │   ├── AboutPage.tsx               # 교육 과정 소개
    │   │   │   ├── AboutCompany.tsx            # 회사 소개
    │   │   │   ├── CurriculumPage.tsx          # 커리큘럼
    │   │   │   ├── CertificatePage.tsx         # 자격증 안내
    │   │   │   ├── ReviewsPage.tsx             # 수강생 후기
    │   │   │   ├── NoticePage.tsx              # 공지사항
    │   │   │   ├── SupportPage.tsx             # 고객지원
    │   │   │   ├── TermsOfService.tsx          # 이용약관
    │   │   │   ├── PrivacyPolicy.tsx           # 개인정보처리방침
    │   │   │   ├── FestivalCoursePage.tsx      # 강의 목록
    │   │   │   ├── MyClassroom.tsx             # 나의 강의실
    │   │   │   ├── ProfilePage.tsx             # 프로필
    │   │   │   ├── PaymentPage.tsx             # 결제
    │   │   │   ├── ExamPage.tsx                # 시험 응시
    │   │   │   ├── ExamResultsPage.tsx         # 시험 결과
    │   │   │   ├── QnAPage.tsx                 # Q&A 목록
    │   │   │   ├── QnACreatePage.tsx           # Q&A 작성
    │   │   │   ├── QnADetailPage.tsx           # Q&A 상세
    │   │   │   ├── AdminDashboard.tsx          # 관리자 대시보드
    │   │   │   └── AdminUserManagement.tsx     # 회원 관리
    │   │   │
    │   │   ├── 🧩 공통 컴포넌트 (16개)
    │   │   │   ├── NewHeader.tsx               # 헤더
    │   │   │   ├── NewFooter.tsx               # 푸터
    │   │   │   ├── MobileBottomNav.tsx         # 모바일 하단 네비
    │   │   │   ├── Logo.tsx                    # 로고
    │   │   │   ├── SEOHead.tsx                 # SEO 메타태그
    │   │   │   ├── LoadingScreen.tsx           # 로딩 화면
    │   │   │   ├── NoticePopup.tsx             # 공지 팝업
    │   │   │   ├── LoginDialog.tsx             # 로그인 다이얼로그
    │   │   │   ├── SignupDialog.tsx            # 회원가입 다이얼로그
    │   │   │   ├── ChatbotButton.tsx           # 챗봇 버튼
    │   │   │   ├── FloatingMenuButton.tsx      # 플로팅 메뉴
    │   │   │   ├── LearningFloatingButton.tsx  # 학습 플로팅 버튼
    │   │   │   ├── RichTextEditor.tsx          # 리치 텍스트 에디터
    │   │   │   ├── ImageUploadButton.tsx       # 이미지 업로드
    │   │   │   ├── UploadProgress.tsx          # 업로드 진행률
    │   │   │   └── ScrollToTop.tsx             # 맨 위로 스크롤
    │   │   │
    │   │   ├── 🔧 관리자 전용 (5개)
    │   │   │   ├── AdminCourseManagement.tsx   # 강의 관리
    │   │   │   ├── AdminNoticeManagement.tsx   # 공지사항 관리
    │   │   │   ├── AdminExamManagement.tsx     # 시험문제 관리
    │   │   │   ├── ExamQuestionUploader.tsx    # 문제 일괄 업로드
    │   │   │   └── QnASetupGuide.tsx           # Q&A 설정 가이드
    │   │   │
    │   │   ├── 📦 ui/ (Radix UI 기반, 30개)
    │   │   │   ├── accordion.tsx               # 아코디언
    │   │   │   ├── alert-dialog.tsx            # 알림 다이얼로그
    │   │   │   ├── alert.tsx                   # 알림
    │   │   │   ├── avatar.tsx                  # 아바타
    │   │   │   ├── badge.tsx                   # 뱃지
    │   │   │   ├── button.tsx                  # 버튼
    │   │   │   ├── card.tsx                    # 카드
    │   │   │   ├── checkbox.tsx                # 체크박스
    │   │   │   ├── dialog.tsx                  # 다이얼로그
    │   │   │   ├── dropdown-menu.tsx           # 드롭다운 메뉴
    │   │   │   ├── input.tsx                   # 입력 필드
    │   │   │   ├── label.tsx                   # 라벨
    │   │   │   ├── select.tsx                  # 셀렉트
    │   │   │   ├── separator.tsx               # 구분선
    │   │   │   ├── sheet.tsx                   # 사이드 시트
    │   │   │   ├── skeleton.tsx                # 로딩 스켈레톤
    │   │   │   ├── switch.tsx                  # 스위치
    │   │   │   ├── table.tsx                   # 테이블
    │   │   │   ├── tabs.tsx                    # 탭
    │   │   │   ├── textarea.tsx                # 텍스트영역
    │   │   │   ├── toast.tsx                   # 토스트
    │   │   │   └── ... (30개 총)
    │   │   │
    │   │   ├── 📦 skeletons/ (로딩 스켈레톤)
    │   │   │   ├── PageSkeleton.tsx
    │   │   │   └── index.ts
    │   │   │
    │   │   └── 📦 figma/ (Figma 임포트)
    │   │       └── ImageWithFallback.tsx       # 이미지 폴백
    │   │
    │   ├── 📁 pages/                          # 페이지 래퍼 (22개)
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx                   # 리뉴얼된 로그인 페이지
    │   │   ├── SignupPage.tsx                  # 리뉴얼된 회원가입 페이지
    │   │   ├── BlockedPage.tsx                 # IP 차단 페이지
    │   │   ├── AboutPageWrapper.tsx
    │   │   ├── AboutCompanyWrapper.tsx
    │   │   ├── CurriculumPageWrapper.tsx
    │   │   ├── CertificatePageWrapper.tsx
    │   │   ├── ReviewsPageWrapper.tsx
    │   │   ├── NoticePageWrapper.tsx
    │   │   ├── SupportPageWrapper.tsx
    │   │   ├── TermsPageWrapper.tsx
    │   │   ├── PrivacyPageWrapper.tsx
    │   │   ├── CoursesPageWrapper.tsx
    │   │   ├── MyClassroomWrapper.tsx
    │   │   ├── ProfilePageWrapper.tsx
    │   │   ├── PaymentPageWrapper.tsx
    │   │   ├── ExamPageWrapper.tsx
    │   │   ├── ExamResultsPageWrapper.tsx
    │   │   ├── QnAPageWrapper.tsx
    │   │   ├── QnACreatePageWrapper.tsx
    │   │   ├── QnADetailPageWrapper.tsx
    │   │   └── AdminPageWrapper.tsx
    │   │
    │   ├── 📁 layouts/                        # 레이아웃
    │   │   └── RootLayout.tsx                  # 루트 레이아웃 (헤더/푸터)
    │   │
    │   └── 📁 utils/                          # 앱 유틸리티 (6개)
    │       ├── gas-api.ts                      # Google Apps Script API 클라이언트
    │       ├── logger.ts                       # 로깅 시스템
    │       ├── log-batcher.ts                  # 로그 배칭
    │       ├── http-interceptor.ts             # HTTP 요청 인터셉터
    │       ├── advanced-tracker.ts             # 고급 사용자 추적
    │       └── console-detector.ts             # 개발자 콘솔 감지
    │
    ├── 📁 contexts/                           # React Context (1개)
    │   └── DataCacheContext.tsx                # 데이터 캐싱 컨텍스트
    │
    ├── 📁 services/                           # API 서비스 (1개)
    │   └── qna.service.ts                      # Q&A API 서비스
    │
    ├── 📁 utils/                              # 공통 유틸리티 (6개)
    │   ├── auth.ts                             # 인증 관리 (로그인/로그아웃)
    │   ├── security.ts                         # 보안 (SQL Injection 방지)
    │   ├── deviceDetection.ts                  # 기기 감지
    │   ├── simpleViewport.ts                   # Viewport 감지
    │   ├── contentProtection.ts                # 콘텐츠 보호
    │   └── url-encoder.ts                      # URL 인코딩/디코딩
    │
    ├── 📁 imports/                            # Figma 임포트 (4개)
    │   ├── Container.tsx
    │   ├── Container-2200-887.tsx
    │   ├── svg-6w2at8c3zp.ts
    │   └── svg-dxs0jmenk0.ts
    │
    └── 📁 styles/                             # CSS 파일 (11개)
        ├── index.css                           # 글로벌 스타일
        ├── theme.css                           # 디자인 토큰 (CSS 변수)
        ├── fonts.css                           # 폰트 import
        ├── tailwind.css                        # Tailwind 기본
        ├── responsive.css                      # 반응형 스타일
        ├── mobile-consistent.css               # 모바일 일관성
        ├── device-compatibility.css            # 기기 호환성
        ├── display-size-handler.css            # 디스플레이 크기 처리
        ├── safe-area.css                       # Safe Area (노치 대응)
        ├── slick.css                           # Slick 캐러셀 스타일
        ├── homepage.css                        # 홈페이지 전용 스타일
        └── notice-popup.css                    # 공지 팝업 스타일
```

### 파일 통계

| 카테고리 | 파일 수 | 비고 |
|---------|---------|------|
| **페이지 컴포넌트** | 21개 | 모든 페이지 UI |
| **공통 컴포넌트** | 16개 | 재사용 가능 |
| **관리자 컴포넌트** | 5개 | 관리자 전용 |
| **UI 컴포넌트 (Radix)** | 30개 | 접근성 높은 기본 컴포넌트 |
| **페이지 래퍼** | 22개 | 라우팅용 |
| **유틸리티** | 13개 | 앱(6) + 공통(6) + 서비스(1) |
| **스타일** | 11개 | CSS 파일 |
| **설정 파일** | 7개 | 빌드/배포 설정 |
| **가이드라인** | 6개 | 개발 문서 |
| **총계** | **131개** | 주요 파일 기준 |

---

## 🗺 페이지 & 라우팅 구조

### 라우트 맵 (총 29개 경로)

```typescript
// /src/app/routes.tsx

/ (루트)
├── /                              → HomePage (홈페이지)
├── /login                         → LoginPage (로그인)
├── /signup                        → SignupPage (회원가입)
│
├── 📘 정보 페이지
│   ├── /about                     → AboutPage (교육 과정 소개)
│   ├── /about-company             → AboutCompany (회사 소개)
│   ├── /curriculum                → CurriculumPage (커리큘럼)
│   ├── /certificate               → CertificatePage (자격증 안내)
│   ├── /reviews                   → ReviewsPage (수강생 후기)
│   ├── /notice                    → NoticePage (공지사항)
│   └── /support                   → SupportPage (고객지원)
│
├── 📚 학습 페이지 (로그인 필수)
│   ├── /courses                   → FestivalCoursePage (강의 목록)
│   ├── /my-classroom              → MyClassroom (나의 강의실)
│   ├── /exam                      → ExamPage (시험 응시)
│   └── /exam-results              → ExamResultsPage (시험 결과)
│
├── 👤 사용자 페이지 (로그인 필수)
│   ├── /profile                   → ProfilePage (프로필 관리)
│   └── /payment                   → PaymentPage (결제)
│
├── 💬 Q&A 게시판
│   ├── /qna                       → QnAPage (목록)
│   ├── /qna/create                → QnACreatePage (작성)
│   └── /qna/:id                   → QnADetailPage (상세)
│
├── 🛠️ 관리자 (관리자 전용)
│   └── /admin                     → AdminDashboard (대시보드)
│       ├── 회원 관리 탭
│       ├── 강의 관리 탭
│       ├── 공지사항 관리 탭
│       └── 시험문제 관리 탭
│
├── 📄 법적 문서
│   ├── /terms                     → TermsOfService (이용약관)
│   └── /privacy                   → PrivacyPolicy (개인정보처리방침)
│
├── 🚫 특수 페이지
│   ├── /blocked                   → BlockedPage (IP 차단)
│   └── /*                         → HomePage (404 → 홈 리다이렉트)
```

### 페이지별 권한 요구사항

| 페이지 그룹 | 권한 | 비고 |
|------------|------|------|
| 홈, 소개, 후기, 공지    |    **공개**    | 누구나 접근 |
| 로그인, 회원가입        | **비로그인만** | 로그인 시 홈으로 리다이렉트 |
| Q&A 목록/상세           |    **공개**    | *비밀글은 작성자/관리자만 |
| Q&A 작성               | **로그인 필수** | - |
| 강의, 시험, 나의 강의실  | **로그인 필수** | - |
| 프로필, 결제            | **로그인 필수** | - |
| 관리자 대시보드          | **관리자 전용** | `user.isAdmin === true` |

---

## 🧩 컴포넌트 구조

### 1. UI 컴포넌트 계층 (`/src/app/components/ui/`)

**Radix UI 기반 30개 컴포넌트** - 접근성(A11y) 준수

```
ui/
├── 📋 Layout
│   ├── card.tsx                    # 카드 컨테이너
│   ├── separator.tsx               # 수평/수직 구분선
│   ├── scroll-area.tsx             # 스크롤 영역
│   ├── resizable.tsx               # 크기 조절 패널
│   └── aspect-ratio.tsx            # 종횡비 유지 컨테이너
│
├── 🔘 Buttons & Actions
│   ├── button.tsx                  # 기본 버튼
│   ├── toggle.tsx                  # 토글 버튼
│   └── toggle-group.tsx            # 토글 그룹
│
├── 📝 Forms
│   ├── input.tsx                   # 텍스트 입력
│   ├── textarea.tsx                # 여러 줄 입력
│   ├── label.tsx                   # 폼 라벨
│   ├── checkbox.tsx                # 체크박스
│   ├── radio-group.tsx             # 라디오 버튼
│   ├── switch.tsx                  # 스위치
│   ├── select.tsx                  # 드롭다운 선택
│   ├── slider.tsx                  # 슬라이더
│   ├── calendar.tsx                # 날짜 선택기
│   ├── input-otp.tsx               # OTP 입력
│   └── form.tsx                    # 폼 래퍼
│
├── 🗂 Navigation
│   ├── tabs.tsx                    # 탭 네비게이션
│   ├── navigation-menu.tsx         # 네비게이션 메뉴
│   ├── menubar.tsx                 # 메뉴바
│   ├── breadcrumb.tsx              # 브레드크럼
│   ├── pagination.tsx              # 페이지네이션
│   └── sidebar.tsx                 # 사이드바
│
├── 💬 Overlays
│   ├── dialog.tsx                  # 모달 다이얼로그
│   ├── alert-dialog.tsx            # 확인 다이얼로그
│   ├── sheet.tsx                   # 사이드 시트
│   ├── drawer.tsx                  # 드로어 (모바일)
│   ├── popover.tsx                 # 팝오버
│   ├── tooltip.tsx                 # 툴팁
│   ├── hover-card.tsx              # 호버 카드
│   ├── dropdown-menu.tsx           # 드롭다운 메뉴
│   └── context-menu.tsx            # 컨텍스트 메뉴
│
├── 📢 Feedback
│   ├── alert.tsx                   # 알림 박스
│   ├── sonner.tsx                  # 토스트 알림
│   ├── progress.tsx                # 진행률 바
│   └── skeleton.tsx                # 로딩 스켈레톤
│
├── 📊 Data Display
│   ├── table.tsx                   # 테이블
│   ├── chart.tsx                   # 차트 (Recharts 래퍼)
│   ├── badge.tsx                   # 뱃지
│   ├── avatar.tsx                  # 아바타
│   ├── carousel.tsx                # 캐러셀
│   └── command.tsx                 # 커맨드 팔레트
│
└── 🔧 Utility
    ├── accordion.tsx               # 아코디언
    ├── collapsible.tsx             # 접기/펼치기
    ├── use-mobile.ts               # 모바일 감지 훅
    └── utils.ts                    # 유틸리티 함수
```

**주요 기술**:
- **Radix UI Primitives**: 접근성 준수, 키보드 네비게이션
- **Tailwind CSS**: 유틸리티 클래스 스타일링
- **CVA (Class Variance Authority)**: 조건부 스타일 변형

### 2. 페이지 컴포넌트 구조

```
컴포넌트명 → 래퍼 → 라우트
예: FestivalHomePage → HomePage (래퍼) → / (라우트)
```

**패턴**:
1. **컴포넌트**: 실제 UI 로직 (`/src/app/components/`)
2. **래퍼**: SEO, 스켈레톤, 권한 체크 (`/src/app/pages/`)
3. **라우트**: React Router 경로 (`/src/app/routes.tsx`)

### 3. 레이아웃 계층

```
RootLayout (루트 레이아웃)
├── NewHeader (헤더)
│   ├── Logo
│   ├── Navigation
│   └── UserMenu
│
├── <Outlet /> (페이지 콘텐츠)
│
├── NewFooter (푸터)
│   ├── 회사 정보
│   ├── 빠른 링크
│   └── SNS 링크
│
└── MobileBottomNav (모바일 전용)
    ├── 홈
    ├── 강의
    ├── Q&A
    └── 마이페이지
```

---

## 🗄 백엔드 & 데이터 구조

### Google Sheets 스키마 (9개 시트)

#### 1. `members` (회원 정보)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String (UUID) | 회원 고유 ID | `user_abc123` |
| email | String | 이메일 (로그인 ID) | `user@example.com` |
| password | String (해시) | 암호화된 비밀번호 | `$2a$10$...` |
| name | String | 이름 | `홍길동` |
| phone | String | 전화번호 | `010-1234-5678` |
| address | String | 주소 | `서울특별시 강남구...` |
| addressDetail | String | 상세주소 | `101동 101호` |
| postcode | String | 우편번호 | `12345` |
| birthdate | String | 생년월일 | `1990-01-01` |
| isAdmin | Boolean | 관리자 여부 | `true` / `false` |
| createdAt | String (ISO) | 가입일시 | `2026-02-12T10:00:00Z` |
| updatedAt | String (ISO) | 수정일시 | `2026-02-12T11:00:00Z` |

#### 2. `courses` (강의 정보)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String | 강의 ID | `course_1` |
| title | String | 강의 제목 | `축제 기획 입문` |
| description | String | 설명 | `축제 기획의 기초를 배웁니다` |
| videoUrl | String | Google Drive URL | `drive.google.com/file/d/...` |
| duration | Number | 재생 시간 (분) | `45` |
| order | Number | 순서 | `1` |
| isActive | Boolean | 활성화 여부 | `true` |
| createdAt | String (ISO) | 등록일시 | `2026-01-01T00:00:00Z` |

#### 3. `tests` (시험문제)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String | 문제 ID | `test_1` |
| question | String | 문제 텍스트 | `축제 기획의 첫 단계는?` |
| answer | Boolean | 정답 (O/X) | `true` (O) / `false` (X) |
| explanation | String | 해설 | `축제 기획은 목표 설정부터...` |
| category | String | 카테고리 | `기초 이론` |
| order | Number | 순서 | `1` |
| isActive | Boolean | 활성화 여부 | `true` |
| createdAt | String (ISO) | 등록일시 | `2026-01-01T00:00:00Z` |

#### 4. `test_results` (시험 결과)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String (UUID) | 결과 ID | `result_xyz789` |
| userId | String | 회원 ID | `user_abc123` |
| score | Number | 점수 | `85` |
| totalQuestions | Number | 총 문제 수 | `20` |
| correctAnswers | Number | 맞은 개수 | `17` |
| passed | Boolean | 합격 여부 | `true` |
| answers | JSON String | 답안 배열 | `[true,false,...]` |
| submittedAt | String (ISO) | 제출일시 | `2026-02-12T14:30:00Z` |

#### 5. `qna` (Q&A 게시글)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String (UUID) | 게시글 ID | `qna_def456` |
| userId | String | 작성자 ID | `user_abc123` |
| userName | String | 작성자 이름 | `홍길동` |
| title | String | 제목 | `강의 관련 질문입니다` |
| content | String (HTML) | 내용 (리치 텍스트) | `<p>강의에서...</p>` |
| isPrivate | Boolean | 비밀글 여부 | `false` |
| imageUrl | String | 첨부 이미지 URL | `drive.google.com/...` |
| viewCount | Number | 조회수 | `15` |
| replyCount | Number | 답변 수 | `2` |
| createdAt | String (ISO) | 작성일시 | `2026-02-12T09:00:00Z` |
| updatedAt | String (ISO) | 수정일시 | `2026-02-12T09:30:00Z` |

#### 6. `qna_replies` (Q&A 답변)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String (UUID) | 답변 ID | `reply_ghi789` |
| qnaId | String | 게시글 ID | `qna_def456` |
| userId | String | 작성자 ID | `admin_1` |
| userName | String | 작성자 이름 | `관리자` |
| content | String (HTML) | 답변 내용 | `<p>답변드립니다...</p>` |
| createdAt | String (ISO) | 작성일시 | `2026-02-12T10:00:00Z` |

#### 7. `notices` (공지사항)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String | 공지 ID | `notice_1` |
| title | String | 제목 | `2월 정기 점검 안내` |
| content | String (HTML) | 내용 | `<p>점검 일시...</p>` |
| isImportant | Boolean | 중요 공지 여부 | `true` |
| isPinned | Boolean | 상단 고정 여부 | `true` |
| viewCount | Number | 조회수 | `120` |
| createdAt | String (ISO) | 작성일시 | `2026-02-10T00:00:00Z` |
| updatedAt | String (ISO) | 수정일시 | `2026-02-10T00:00:00Z` |

#### 8. `learning_records` (학습 기록)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String (UUID) | 기록 ID | `record_jkl012` |
| userId | String | 회원 ID | `user_abc123` |
| courseId | String | 강의 ID | `course_1` |
| completed | Boolean | 완료 여부 | `true` |
| completedAt | String (ISO) | 완료일시 | `2026-02-12T15:00:00Z` |
| lastAccessedAt | String (ISO) | 마지막 접속 | `2026-02-12T15:00:00Z` |

#### 9. `security_logs` (보안 로그)

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | String (UUID) | 로그 ID | `log_mno345` |
| userId | String | 회원 ID (옵션) | `user_abc123` |
| sessionId | String | 세션 ID | `session_pqr678` |
| ip | String | IP 주소 | `203.0.113.1` |
| country | String | 국가 | `South Korea` |
| city | String | 도시 | `Seoul` |
| userAgent | String | User Agent | `Mozilla/5.0...` |
| page | String | 페이지 경로 | `/my-classroom` |
| action | String | 행동 유형 | `page_view` |
| alertType | String | 경고 수준 | `normal` / `warning` / `suspicious` / `danger` |
| details | String | 상세 정보 | `정상 접속` |
| timestamp | String (ISO) | 발생일시 | `2026-02-12T16:00:00Z` |

### Google Apps Script API (25+ 엔드포인트)

#### 회원 관리 (`admin.gs.md`)

| 엔드포인트 | Method | 설명 | 요청 파라미터 |
|-----------|--------|------|--------------|
| `?action=signup` | POST | 회원가입 | email, password, name, phone, address, birthdate |
| `?action=login` | POST | 로그인 | email, password |
| `?action=getUser` | GET | 회원 정보 조회 | userId |
| `?action=updateUser` | POST | 회원 정보 수정 | userId, name, phone, address, birthdate |
| `?action=changePassword` | POST | 비밀번호 변경 | userId, oldPassword, newPassword |
| `?action=getAllUsers` | GET | 전체 회원 목록 (관리자) | - |
| `?action=updateUserLevel` | POST | 회원 등급 변경 (관리자) | userId, isAdmin |
| `?action=deleteUser` | POST | 회원 탈퇴 | userId |

#### 강의 관리

| 엔드포인트 | Method | 설명 | 요청 파라미터 |
|-----------|--------|------|--------------|
| `?action=getCourses` | GET | 강의 목록 조회 | - |
| `?action=getCourse` | GET | 강의 상세 조회 | courseId |
| `?action=createCourse` | POST | 강의 등록 (관리자) | title, description, videoUrl, duration |
| `?action=updateCourse` | POST | 강의 수정 (관리자) | courseId, title, description, videoUrl |
| `?action=deleteCourse` | POST | 강의 삭제 (관리자) | courseId |

#### 학습 기록 관리

| 엔드포인트 | Method | 설명 | 요청 파라미터 |
|-----------|--------|------|--------------|
| `?action=getLearningRecords` | GET | 학습 기록 조회 | userId |
| `?action=markCourseComplete` | POST | 강의 완료 표시 | userId, courseId |
| `?action=markCourseIncomplete` | POST | 강의 미완료 표시 | userId, courseId |

#### 시험 관리 (`test.gs.md`)

| 엔드포인트 | Method | 설명 | 요청 파라미터 |
|-----------|--------|------|--------------|
| `?action=getTests` | GET | 시험문제 목록 | - |
| `?action=submitTest` | POST | 시험 제출 | userId, answers[] |
| `?action=getTestResults` | GET | 시험 결과 조회 | userId |
| `?action=createTests` | POST | 문제 일괄 등록 (관리자) | tests[] |
| `?action=deleteTest` | POST | 문제 삭제 (관리자) | testId |

#### Q&A 관리 (`qna.gs.md`)

| 엔드포인트 | Method | 설명 | 요청 파라미터 |
|-----------|--------|------|--------------|
| `?action=getQnA` | GET | Q&A 목록 조회 | page, limit |
| `?action=getQnADetail` | GET | Q&A 상세 조회 | qnaId, userId |
| `?action=createQnA` | POST | Q&A 작성 | userId, title, content, isPrivate, imageUrl |
| `?action=createReply` | POST | 답변 작성 | qnaId, userId, content |
| `?action=deleteQnA` | POST | Q&A 삭제 | qnaId, userId |
| `?action=deleteReply` | POST | 답변 삭제 | replyId, userId |

#### 공지사항 관리

| 엔드포인트 | Method | 설명 | 요청 파라미터 |
|-----------|--------|------|--------------|
| `?action=getNotices` | GET | 공지사항 목록 | - |
| `?action=getNotice` | GET | 공지사항 상세 | noticeId |
| `?action=createNotice` | POST | 공지사항 작성 (관리자) | title, content, isImportant |
| `?action=updateNotice` | POST | 공지사항 수정 (관리자) | noticeId, title, content |
| `?action=deleteNotice` | POST | 공지사항 삭제 (관리자) | noticeId |

#### 보안 & 로깅 (`log.gs.md`)

| 엔드포인트 | Method | 설명 | 요청 파라미터 |
|-----------|--------|------|--------------|
| `?action=checkBlocked` | GET | IP 차단 확인 | ip |
| `?action=batchLog` | POST | 로그 일괄 기록 | logs[], count |
| `?action=getLogs` | GET | 로그 조회 (관리자) | startDate, endDate, alertType |

---

## 🔐 보안 시스템

### 1. 다층 보안 아키텍처

```
┌─────────────────────────────────────────────────┐
│        Level 1: 클라이언트 사이드 검증            │
│  • SQL Injection 패턴 감지                       │
│  • XSS 공격 방지 (HTML 이스케이프)                │
│  • CSRF 토큰 생성/검증                           │
│  • 입력 값 유효성 검사                            │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│        Level 2: 전송 계층 보안                   │
│  • HTTPS 강제 사용                               │
│  • 요청 암호화                                   │
│  • HTTP Interceptor (요청 가로채기)              │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│        Level 3: 서버 사이드 검증                 │
│  • Google Apps Script 권한 관리                 │
│  • IP 차단 리스트 확인                           │
│  • 세션 검증                                    │
│  • Rate Limiting                                │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│        Level 4: 데이터 계층 보안                 │
│  • Google Sheets 접근 권한 제어                  │
│  • 민감 정보 암호화 (비밀번호)                    │
│  • 트랜잭션 로그 기록                            │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│        Level 5: 모니터링 & 알림                  │
│  • 실시간 행동 추적                              │
│  • 의심스러운 활동 자동 탐지                      │
│  • 개발자 콘솔 열림 감지                         │
│  • 5분마다 로그 배칭 전송                        │
└─────────────────────────────────────────────────┘
```

### 2. 구현된 보안 기능

#### 🚫 IP 차단 시스템 (`/src/app/layouts/RootLayout.tsx`)

```typescript
// IP 차단 확인 (앱 로드 시 자동 실행)
useEffect(() => {
  const checkBlocked = async () => {
    const ip = await getClientIP();
    const blocked = await adminService.checkBlocked(ip);
    if (blocked) {
      window.location.href = '/blocked';
    }
  };
  checkBlocked();
}, []);
```

**특징**:
- Google Sheets `blocked_ips` 시트에서 IP 관리
- 차단된 IP는 즉시 `/blocked` 페이지로 리다이렉트
- 관리자가 실시간으로 IP 추가/제거 가능

#### 📊 접속 로그 시스템 (`/src/app/utils/logger.ts`)

```typescript
// 5분마다 자동 로그 전송
setInterval(() => {
  sendBatchLogs(); // 로그 배칭 전송
}, 5 * 60 * 1000);
```

**기록 정보**:
| 항목 | 설명 | 예시 |
|------|------|------|
| **IP 주소** | ipify API로 획득 | `203.0.113.1` |
| **위치** | 국가, 도시 | `South Korea, Seoul` |
| **User Agent** | 브라우저, OS | `Chrome 120, Windows 10` |
| **페이지** | 현재 경로 | `/my-classroom` |
| **행동** | 액션 타입 | `page_view`, `login`, `exam_submit` |
| **경고 수준** | 위험도 | `normal`, `warning`, `suspicious`, `danger` |
| **사용자 ID** | 로그인 시 | `user_abc123` |
| **세션 ID** | 고유 세션 | `session_xyz789` |

#### 🔍 개발자 콘솔 감지 (`/src/app/utils/console-detector.ts`)

```typescript
// 1초마다 콘솔 열림 확인
setInterval(() => {
  const isOpen = window.outerWidth - window.innerWidth > 160;
  if (isOpen && !wasOpen) {
    sendConsoleOpenLog(); // 보안 로그 전송
  }
}, 1000);
```

**감지 방식**:
- Window 크기 차이 감지
- Firebug 감지
- 열림/닫힘 이벤트 자동 로깅

#### 🛡️ SQL Injection 방지 (`/src/utils/security.ts`)

```typescript
SecurityUtils.detectSqlInjection(input); // 위험 패턴 감지

// 위험 패턴 예시
const patterns = [
  /(\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/i,
  /(\bunion\b|\bjoin\b|\bexec\b|\bexecute\b)/i,
  /(--|;|\/\*|\*\/)/,
  /(\bor\b\s+\d+\s*=\s*\d+)/i
];
```

#### 🔐 CSRF 토큰 (`/src/utils/security.ts`)

```typescript
// 토큰 생성
const token = SecurityUtils.generateCsrfToken();
sessionStorage.setItem('authToken', token);

// 모든 API 요청에 포함
headers: {
  'X-CSRF-Token': token
}
```

#### 🚨 고급 사용자 추적 (`/src/app/utils/advanced-tracker.ts`)

**추적 이벤트**:
- 페이지 뷰
- 클릭 이벤트
- 스크롤 깊이
- 체류 시간
- 이탈 시도
- 복사/붙여넣기
- 개발자 도구 사용

### 3. 보안 로그 경고 수준

| 수준 | 설명 | 예시 |
|------|------|------|
| **normal** | 정상 활동 | 페이지 조회, 로그인 |
| **warning** | 주의 필요 | 로그인 실패 3회 |
| **suspicious** | 의심스러운 행동 | 개발자 콘솔 열림, SQL Injection 시도 |
| **danger** | 위험 행동 | 비정상 API 호출, 무차별 대입 공격 |

---

## 🎨 디자인 시스템

### 타이포그래피

```css
/* 헤딩 (제목) - Playfair Display */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
  font-weight: 500;
}

/* 본문 (Body) - Inter */
p, span, div, button, input {
  font-family: 'Inter', sans-serif;
  font-weight: 300;
}
```

**⚠️ 중요**: Tailwind 폰트 클래스 사용 금지!
```tsx
// ❌ 잘못된 예시
<h1 className="text-2xl font-bold">제목</h1>

// ✅ 올바른 예시
<h1 style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}>
  제목
</h1>
```

### 컬러 시스템 (CSS 변수)

| CSS 변수 | 라이트 모드 | 다크 모드 | Tailwind 클래스 |
|----------|-------------|-----------|-----------------|
| `--color-primary` | `#6cb25b` | `#6cb25b` | `bg-primary`, `text-primary` |
| `--color-background` | `#f2efe9` | `#0a0a0a` | `bg-background` |
| `--color-foreground` | `#1a1a1a` | `#f5f5f5` | `text-foreground` |
| `--color-card` | `#ffffff` | `#1a1a1a` | `bg-card` |
| `--color-card-foreground` | `#1a1a1a` | `#f5f5f5` | `text-card-foreground` |
| `--color-border` | `rgba(0,0,0,0.05)` | `rgba(255,255,255,0.1)` | `border-border` |
| `--color-muted` | `#e5e5e5` | `#262626` | `bg-muted` |
| `--color-accent` | `#e8f5e3` | `#1a2e1a` | `bg-accent` |

**⚠️ 중요**: 하드코딩된 색상 사용 금지!
```tsx
// ❌ 잘못된 예시
<div className="bg-white text-black">...</div>

// ✅ 올바른 예시
<div className="bg-card text-card-foreground">...</div>
```

### 레이아웃 원칙

```tsx
// ✅ 표준 페이지 레이아웃
<div className="bg-background min-h-screen pt-24 pb-32">
  <div className="max-w-4xl mx-auto px-6">
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="border-b border-border pb-6">
        <h1 
          className="text-card-foreground leading-tight"
          style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}
        >
          페이지 제목
        </h1>
      </CardHeader>
      <CardContent className="pt-6">
        <p 
          className="text-card-foreground leading-relaxed"
          style={{ fontFamily: 'Inter', fontWeight: 300 }}
        >
          본문 내용
        </p>
      </CardContent>
    </Card>
  </div>
</div>
```

### 반응형 브레이크포인트

| 브레이크포인트 | 너비 | 디바이스 | 레이아웃 전략 |
|---------------|------|---------|--------------|
| **모바일** | < 1024px | 스마트폰, 태블릿 | 단일 컬럼, 간소화 |
| **데스크탑** | 1024px ~ 1920px | 노트북, 데스크탑 | 요소 크기 비례 축소 (스케일링) |
| **풀HD** | 1920px 이상 | 대형 모니터 | 최대 너비 고정 |

**스케일링 시스템** (1920px → 1024px):
```css
/* 1920px 기준 */
.element { font-size: 16px; }

/* 1440px에서 */
.element { font-size: calc(16px * 1440 / 1920); } /* ≈ 12px */

/* 1024px에서 */
.element { font-size: calc(16px * 1024 / 1920); } /* ≈ 8.5px */
```

### 애니메이션 & 전환

```tsx
// 호버 효과
className="hover:text-primary hover:shadow-md transition-all duration-300"

// 페이지 전환 (Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  ...
</motion.div>
```

---

## 🌟 주요 기능

### 1. 회원 관리

```
회원가입
├── 이메일 중복 확인
├── 비밀번호 강도 체크 (8자 이상, 영문+숫자+특수문자)
├── Daum 주소 API 연동
├── 생년월일 날짜 선택기
└── 실시간 유효성 검사 (react-hook-form)

로그인
├── 이메일/비밀번호 검증
├── 세션 토큰 발급 (localStorage)
├── CSRF 토큰 생성
└── 로그인 실패 로그 기록

프로필 관리
├── 정보 수정 (이름, 전화번호, 주소, 생년월일)
├── 비밀번호 변경
└── 회원 탈퇴
```

### 2. 학습 시스템

```
나의 강의실
├── 강의 목록 (썸네일, 제목, 설명)
├── 학습 진도율 실시간 표시
├── Google Drive 영상 스트리밍
│   ├── CSP 임베딩 문제 해결
│   ├── drive.google.com/uc?export=download&id={FILE_ID}
│   └── video 태그로 직접 재생
├── "봤다/안봤다" 토글 버튼
│   ├── 개별 영상별 시청 기록
│   ├── localStorage + Google Sheets 동기화
│   └── 즉시 진도율 업데이트
└── 완료한 강의 필터링
```

### 3. 시험 시스템

```
시험 응시
├── OX 문제 형식 (True/False)
├── 20문제 랜덤 출제
├── 실시간 답안 선택
├── 제출 전 확인 다이얼로그
├── 자동 채점 (정답/오답 표시)
├── 합격 기준: 80% (16/20)
└── 결과 즉시 확인

시험 결과
├── 점수 표시 (색상 코딩)
│   ├── 80% 이상: 녹색 (합격)
│   └── 80% 미만: 빨간색 (불합격)
├── 문제별 정답/오답 표시
├── 해설 보기
├── 재응시 버튼
└── 결과 이력 조회

관리자 문제 관리
├── MD 파일 업로드 (Markdown 파싱)
├── Excel 파일 업로드 (XLSX 파싱)
├── 일괄 등록 (배치 API 호출)
├── 개별 수정/삭제
└── 문제 순서 드래그 앤 드롭 변경
```

**MD 파일 형식 예시**:
```markdown
## 1. 축제 기획의 첫 단계는 목표 설정이다.
- 정답: O
- 해설: 축제 기획은 명확한 목표 설정부터 시작합니다.

## 2. 예산 수립은 마지막 단계이다.
- 정답: X
- 해설: 예산 수립은 초기 기획 단계에서 이루어져야 합니다.
```

### 4. Q&A 게시판

```
게시판 기능
├── 질문 작성
│   ├── 제목, 본문 (React Quill 에디터)
│   ├── 비밀글 설정
│   ├── 이미지 첨부 (Google Drive 업로드)
│   └── 미리보기
├── 질문 목록
│   ├── 페이지네이션 (10개씩)
│   ├── 제목, 작성자, 날짜, 답변 수, 조회수
│   ├── 비밀글 아이콘 표시
│   └── 검색 기능
├── 질문 상세
│   ├── HTML 렌더링 (리치 텍스트)
│   ├── 이미지 표시
│   ├── 조회수 증가
│   ├── 비밀글 권한 체크
│   │   ├── 작성자 본인
│   │   └── 관리자
│   ├── 답변 목록
│   │   ├── 작성자 이름, 날짜
│   │   ├── HTML 렌더링
│   │   └── 삭제 버튼 (작성자/관리자)
│   └── 답변 작성 (로그인 필수)
└── 수정/삭제
    ├── 권한 확인 (작성자/관리자)
    └── 확인 다이얼로그
```

### 5. 관리자 대시보드

```
대시보드
├── 📊 통계 대시보드
│   ├── 총 회원 수
│   ├── 오늘 가입자 수
│   ├── 총 강의 수
│   ├── 총 시험 응시 횟수
│   ├── 평균 합격률
│   └── 일별 접속자 수 차트 (Recharts)
├── 👥 회원 관리 탭
│   ├── 회원 목록 테이블 (MUI Table)
│   ├── 검색 필터 (이름, 이메일)
│   ├── 등급 변경 (일반/관리자)
│   ├── 회원 정보 수정
│   └── 회원 삭제
├── 📚 강의 관리 탭
│   ├── 강의 목록
│   ├── 강의 추가
│   │   ├── 제목, 설명
│   │   ├── Google Drive URL
│   │   ├── 재생 시간 (분)
│   │   └── 순서 지정
│   ├── 강의 수정
│   └── 강의 삭제
├── 📝 공지사항 관리 탭
│   ├── 공지 목록
│   ├── 공지 작성 (React Quill)
│   ├── 중요 공지 설정
│   ├── 상단 고정 설정
│   └── 공지 수정/삭제
└── 📝 시험문제 관리 탭
    ├── 문제 목록
    ├── 문제 추가 (개별)
    ├── 일괄 업로드 (MD/Excel)
    │   ├── 파일 선택 (react-dropzone)
    │   ├── 파싱 (XLSX 라이브러리)
    │   ├── 미리보기
    │   └── 일괄 등록 API 호출
    ├── 문제 순서 변경 (react-dnd)
    └── 문제 삭제
```

### 6. 보안 & 모니터링

```
실시간 모니터링
├── 접속 로그 (5분 배칭)
│   ├── IP, 위치, User Agent
│   ├── 페이지, 행동, 경고 수준
│   └── Google Sheets 자동 기록
├── 개발자 콘솔 감지
│   ├── 1초마다 체크
│   ├── 열림/닫힘 이벤트
│   └── 보안 로그 전송
├── IP 차단 시스템
│   ├── 차단 IP 리스트 (Google Sheets)
│   ├── 앱 로드 시 자동 체크
│   └── 차단 시 즉시 리다이렉트
└── SQL Injection 방지
    ├── 입력값 패턴 검사
    ├── HTML 이스케이프
    └── 위험 패턴 로그 기록
```

---

## 💻 개발 가이드

### 사전 요구사항

```bash
Node.js >= 18.x
pnpm >= 8.x (권장)
```

### 설치

```bash
# 1. 저장소 클론
git clone <repository-url>
cd festival-academy

# 2. 의존성 설치
pnpm install

# 3. 개발 서버 실행
pnpm dev
```

→ 브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 빌드 결과 확인
ls -lh dist/
```

### 환경 변수

현재 Google Apps Script URL은 코드에 하드코딩되어 있습니다:

```typescript
// /src/app/utils/gas-api.ts
const API_URL = "https://script.google.com/macros/s/.../exec";
```

**프로덕션 권장사항**:
```bash
# .env 파일 생성
VITE_API_URL=https://script.google.com/macros/s/.../exec
VITE_DAUM_POSTCODE_KEY=your_key_here
```

```typescript
// 코드에서 사용
const API_URL = import.meta.env.VITE_API_URL;
```

### 코딩 규칙

#### ✅ DO (권장)

```tsx
// 1. Playfair Display + Inter 폰트 조합
<h1 style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}>
  제목
</h1>
<p style={{ fontFamily: 'Inter', fontWeight: 300 }}>
  본문
</p>

// 2. CSS 변수 기반 색상
<div className="bg-background text-foreground">
  <Card className="bg-card border-border shadow-sm">
    ...
  </Card>
</div>

// 3. 표준 여백 & 너비
<div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
  ...
</div>

// 4. 전환 효과
<button className="hover:text-primary transition-colors duration-200">
  버튼
</button>

// 5. TypeScript 타입 지정
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}
```

#### ❌ DON'T (금지)

```tsx
// 1. Tailwind 폰트 클래스
<h1 className="text-2xl font-bold">제목</h1>

// 2. 하드코딩 색상
<div className="bg-white text-black">...</div>

// 3. 비표준 여백
<div className="pt-10 pb-20 px-4">...</div>

// 4. 전환 효과 없음
<button>버튼</button>

// 5. any 타입 남용
function handleSubmit(data: any) { ... }
```

### 새 페이지 추가 워크플로우

1. **컴포넌트 생성**: `/src/app/components/NewPage.tsx`
   ```tsx
   export default function NewPage() {
     return (
       <div className="bg-background min-h-screen pt-24 pb-32">
         ...
       </div>
     );
   }
   ```

2. **래퍼 생성**: `/src/app/pages/NewPageWrapper.tsx`
   ```tsx
   import { PageWithSkeleton } from '../components/PageWithSkeleton';
   import NewPage from '../components/NewPage';
   
   export function NewPageWrapper() {
     return <PageWithSkeleton component={NewPage} />;
   }
   ```

3. **라우트 추가**: `/src/app/routes.tsx`
   ```tsx
   import { NewPageWrapper } from './pages/NewPageWrapper';
   
   {
     path: "new-page",
     Component: NewPageWrapper
   }
   ```

4. **헤더에 링크 추가**: `/src/app/components/NewHeader.tsx`
   ```tsx
   <Link to="/new-page">새 페이지</Link>
   ```

### 디버깅 팁

```typescript
// 1. Viewport 정보 확인 (개발 모드 자동 표시)
// 우측 하단에 파란색 디버그 박스 표시
// 내용: "📱 1920×1080 / 🖥️ Desktop / 🔄 Landscape"

// 2. 로그 확인
console.log('📊 User:', getCurrentUser());
console.log('🔍 Viewport:', getViewportInfo());

// 3. 보안 로그 확인
// Google Sheets → security_logs 시트

// 4. React DevTools 설치
// Chrome: React Developer Tools 확장 프로그램
```

---

## 🚀 배포 가이드

### Figma Make 배포

1. Figma Make 플랫폼에서 자동 빌드
2. Git Push 시 자동 배포
3. 커스텀 도메인 연결 가능

### 수동 배포 (Vercel)

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 연결
vercel link

# 3. 배포
vercel --prod
```

### 수동 배포 (Netlify)

```bash
# 1. 빌드
pnpm build

# 2. Netlify CLI 설치
npm i -g netlify-cli

# 3. 배포
netlify deploy --prod --dir=dist
```

### 배포 전 체크리스트

- [ ] `pnpm build` 성공 확인
- [ ] Google Apps Script URL 환경 변수로 분리
- [ ] API 엔드포인트 테스트
- [ ] 관리자 계정 생성
- [ ] IP 차단 시스템 활성화 확인
- [ ] 로그 시스템 작동 확인
- [ ] 모든 페이지 라우팅 테스트
- [ ] 모바일 반응형 확인
- [ ] 다크모드 정상 작동 확인
- [ ] SEO 메타태그 확인 (`SEOHead.tsx`)
- [ ] Google Search Console 인증 (`google22fe522660d4ec0a_.html`)

---

## 📚 참고 문서

### 가이드라인

- [📘 전체 가이드라인](./guidelines/Guidelines.md)
- [🎨 디자인 가이드](./guidelines/DESIGN_GUIDE.md)
- [📝 시험 문제 일괄 업로드 가이드](./EXAM_BULK_UPLOAD_GUIDE.md)

### API 문서

- [👤 회원 관리 API](./guidelines/admin.gs.md)
- [📊 로그 API](./guidelines/log.gs.md)
- [💬 Q&A API](./guidelines/qna.gs.md)
- [📝 시험 API](./guidelines/test.gs.md)

### 외부 문서

- [React Router v7 공식 문서](https://reactrouter.com/)
- [Tailwind CSS v4 공식 문서](https://tailwindcss.com/)
- [Radix UI 공식 문서](https://www.radix-ui.com/)
- [Google Apps Script 공식 문서](https://developers.google.com/apps-script)

---

## 🔍 트러블슈팅

### Q. Google Drive 영상이 재생되지 않아요

**A.** CSP(Content Security Policy) 임베딩 문제입니다.

```tsx
// ❌ 작동하지 않음
<iframe src="https://drive.google.com/file/d/{FILE_ID}/preview" />

// ✅ 이렇게 사용
<video 
  src="https://drive.google.com/uc?export=download&id={FILE_ID}"
  controls
/>
```

### Q. 다크모드에서 select 박스가 이상해요

**A.** `option` 태그에도 배경색을 지정해야 합니다.

```tsx
<select 
  className="bg-card text-card-foreground border-border 
             [&>option]:bg-card [&>option]:text-card-foreground"
>
  <option>옵션 1</option>
</select>
```

### Q. 모바일에서 레이아웃이 깨져요

**A.** 표준 여백/너비를 사용하세요.

```tsx
// ✅ 올바른 레이아웃
<div className="pt-24 pb-32 px-6 max-w-4xl mx-auto">
  ...
</div>
```

### Q. IP 차단이 작동하지 않아요

**A.** Google Sheets `blocked_ips` 시트 확인:

| IP 주소 | 차단 사유 | 차단 일시 |
|---------|----------|----------|
| 203.0.113.1 | 악의적 행동 | 2026-02-12 10:00:00 |

### Q. 로그가 기록되지 않아요

**A.** Google Apps Script API URL과 권한 확인:

1. Apps Script 배포 URL이 올바른지 확인
2. Google Sheets 공유 권한 확인 (Apps Script 계정)
3. 브라우저 콘솔에서 API 응답 확인

```typescript
// 디버깅 코드
fetch(API_URL, { method: 'POST', body: JSON.stringify({ action: 'batchLog', logs: [] }) })
  .then(res => res.json())
  .then(console.log);
```

---

## 📞 문의 & 기여

### 프로젝트 관리자

Festival Academy 개발팀

### 라이선스

이 프로젝트는 Festival Academy의 소유이며, 무단 배포 및 복제를 금지합니다.

---

## 📈 프로젝트 현황

| 항목 | 현황 | 비고 |
|------|------|------|
| **상태** | 🟢 프로덕션 준비 완료 | 실제 운영 가능 |
| **페이지 수** | 29개 | 모든 라우트 구현 완료 |
| **컴포넌트 수** | 131개 | 재사용 가능 설계 |
| **API 엔드포인트** | 25+ | Google Apps Script |
| **보안 수준** | 엔터프라이즈 | IP 차단, 로깅, SQL Injection 방지 |
| **반응형** | ✅ 완벽 지원 | 모바일/태블릿/데스크탑 |
| **다크모드** | ✅ 완벽 지원 | 자동 테마 전환 |
| **SEO** | ✅ 최적화 완료 | React Helmet Async |
| **성능** | ⚡ 최적화 완료 | Vite, Code Splitting |
| **접근성** | ♿ A11y 준수 | Radix UI 기반 |

---

**Last Updated**: 2026년 2월 12일  
**Version**: 1.0.0  
**Built with**: ❤️ by Festival Academy Team

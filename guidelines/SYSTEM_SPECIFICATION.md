# 🎓 축제기획사 자격증 교육기관 웹사이트 - 프로덕션 준비 완료!

> **전체 시스템 아키텍처, 기능, API, 데이터베이스 구조 종합 문서**

**버전**: 1.1.0  
**최종 업데이트**: 2026년 2월 13일  
**프로젝트 상태**: ✅ 프로덕션 준비 완료

---

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [시스템 아키텍처](#2-시스템-아키텍처)
3. [기술 스택](#3-기술-스택)
4. [주요 기능](#4-주요-기능)
5. [페이지 구조](#5-페이지-구조)
6. [데이터베이스 스키마](#6-데이터베이스-스키마)
7. [API 명세](#7-api-명세)
8. [보안 시스템](#8-보안-시스템)
9. [디자인 시스템](#9-디자인-시스템)
10. [배포 및 설정](#10-배포-및-설정)
11. [개발 히스토리](#11-개발-히스토리)
12. [향후 로드맵](#12-향후-로드맵)
13. [수강료 및 가격 정책](#13-수강료-및-가격-정책)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 정보

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 축제기획사 자격증 교육기관 웹사이트 |
| **목적** | 축제기획사 자격증 취득을 위한 온라인 교육 플랫폼 |
| **타겟 사용자** | 축제기획사 자격증 수강생 + 관리자 |
| **개발 기간** | 2026년 1월 ~ 2026년 2월 (완료) |
| **프로젝트 타입** | SPA (Single Page Application) |
| **라이선스** | Private (비공개) |

### 1.2 핵심 가치

- **🎯 학습 집중**: 영상 기반 교육 + 진도율 추적
- **📝 시험 관리**: OX 문제 자동 채점 + 결과 저장
- **🔒 보안**: IP 차단 + 접속 로그 + VPN 감지
- **⚡ 관리 자동화**: MD/Excel 파일로 시험 문제 일괄 등록

### 1.3 주요 사용자 흐름

```
비회원
  ↓ 회원가입/로그인
회원 (학습자)
  ↓ 수강 등록
  ↓ 영상 시청
  ↓ 진도율 체크
  ↓ 시험 응시
  ↓ 자격증 발급
  
관리자
  ↓ 회원 관리
  ↓ 시험 문제 등록
  ↓ 접속 로그 모니터링
  ↓ IP 차단 관리
```

---

## 2. 시스템 아키텍처

### 2.1 전체 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        클라이언트                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React 18.3.1 + TypeScript + Tailwind CSS v4         │  │
│  │  - React Router 7 (페이지 라우팅)                      │  │
│  │  - Radix UI (UI 컴포넌트)                             │  │
│  │  - Motion (애니메이션)                                 │  │
│  │  - React Hook Form (폼 관리)                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Google Apps Script                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Admin API   │  │   Log API    │  │   Test API   │     │
│  │  (admin.gs)  │  │   (log.gs)   │  │  (test.gs)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Google Sheets (데이터베이스)               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  users | learning_progress | exam_questions          │  │
│  │  exam_results | security_logs | blocked_ips          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Google Drive (영상 호스팅)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  강의 영상 파일 (MP4)                                  │  │
│  │  - 공개 링크 생성                                      │  │
│  │  - 직접 임베딩 (CSP 우회)                             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 데이터 흐름

#### 2.2.1 회원가입/로그인

```
사용자 입력 (이메일, 비밀번호)
  ↓
React (validation)
  ↓
Admin API (POST)
  ↓
Google Sheets (users 시트)
  ↓
JWT 토큰 생성
  ↓
클라이언트 (sessionStorage/localStorage 저장)
```

#### 2.2.2 학습 진도 기록

```
영상 시청 완료
  ↓
React (sendLog + markVideoAsWatched)
  ↓
Admin API (POST /updateProgress)
  ↓
Google Sheets (learning_progress 시트)
  ↓
진도율 업데이트 (예: 3/10 = 30%)
```

#### 2.2.3 시험 응시

```
시험 시작
  ↓
Test API (GET /getExamQuestions)
  ↓
Google Sheets (exam_questions 시트)
  ↓
React (OX 문제 렌더링)
  ↓
사용자 답변 제출
  ↓
Test API (POST /submitExam)
  ↓
자동 채점 (정답 비교)
  ↓
Google Sheets (exam_results 시트 저장)
  ↓
결과 화면 표시
```

#### 2.2.4 접속 로그

```
페이지 접속
  ↓
logger.ts (sendLog)
  ↓
5분 배치 수집 (log-batcher.ts)
  ↓
Log API (POST /batchLog)
  ↓
Google Sheets (security_logs 시트)
  ↓
관리자 대시보드에서 확인
```

---

## 3. 기술 스택

### 3.1 프론트엔드

| 카테고리 | 기술 | 버전 | 용도 |
|---------|------|------|------|
| **프레임워크** | React | 18.3.1 | UI 렌더링 |
| **언어** | TypeScript | 5.x | 타입 안전성 |
| **라우팅** | React Router | 7.13.0 | SPA 라우팅 |
| **스타일링** | Tailwind CSS | 4.1.12 | 유틸리티 CSS |
| **UI 라이브러리** | Radix UI | 다양 | 접근성 컴포넌트 |
| **애니메이션** | Motion | 12.23.24 | 부드러운 전환 |
| **폼 관리** | React Hook Form | 7.55.0 | 폼 validation |
| **아이콘** | Lucide React | 0.487.0 | SVG 아이콘 |
| **차트** | Recharts | 2.15.2 | 통계 차트 |
| **빌드 도구** | Vite | 6.3.5 | 빠른 빌드 |

### 3.2 백엔드

| 카테고리 | 기술 | 용도 |
|---------|------|------|
| **서버** | Google Apps Script | 서버리스 API |
| **데이터베이스** | Google Sheets | NoSQL 데이터 저장 |
| **파일 저장소** | Google Drive | 영상 파일 호스팅 |
| **인증** | JWT (수동 구현) | 토큰 기반 인증 |

### 3.3 외부 API

| API | 용도 | 무료 여부 |
|-----|------|----------|
| **ip-api.com** | IP 위치 정보 (국가/도시) | ✅ 무료 (45회/분) |
| **ipify.org** | IP 주소 조회 (폴백) | ✅ 무료 (무제한) |
| **BigDataCloud** | GPS → 국가명 변환 | ✅ 무료 |

### 3.4 개발 도구

| 도구 | 용도 |
|------|------|
| **Figma Make** | 개발 환경 |
| **Google Workspace** | Apps Script 편집 |
| **Chrome DevTools** | 디버깅 |

---

## 4. 주요 기능

### 4.1 회원 관리

#### 기능 목록

| 기능 | 설명 | API | 권한 |
|------|------|-----|------|
| **회원가입** | 이메일, 비밀번호, 이름, 전화번호 입력 | Admin API | 비회원 |
| **로그인** | 이메일 + 비밀번호 인증 | Admin API | 비회원 |
| **자동 로그인** | "로그인 유지" 체크박스 (localStorage) | - | 비회원 |
| **로그아웃** | 세션 삭제 | - | 회원 |
| **프로필 조회** | 내 정보 확인 | Admin API | 회원 |
| **프로필 수정** | 이름, 전화번호, 비밀번호 변경 | Admin API | 회원 |
| **회원 목록** | 전체 회원 조회 | Admin API | 관리자 |
| **회원 정보 수정** | 다른 사용자 정보 수정 | Admin API | 관리자 |
| **회원 삭제** | 사용자 삭제 | Admin API | 관리자 |

#### 데이터 구조

```typescript
interface User {
  email: string;           // 이메일 (고유 ID)
  password: string;        // 해시된 비밀번호
  name: string;            // 이름
  phone: string;           // 전화번호
  isAdmin: boolean;        // 관리자 여부
  enrolledCourses: string; // 수강 중인 과정 (콤마 구분)
  createdAt: string;       // 가입일 (KST)
}
```

### 4.2 학습 관리

#### 기능 목록

| 기능 | 설명 | API | 권한 |
|------|------|-----|------|
| **영상 목록 조회** | 카테고리별 영상 목록 | 정적 데이터 | 회원 |
| **영상 재생** | Google Drive 영상 임베딩 | - | 회원 |
| **시청 기록** | 영상별 "봤다/안봤다" 추적 | Admin API | 회원 |
| **진도율 계산** | 시청 완료 영상 / 전체 영상 | 프론트엔드 | 회원 |
| **내 강의실** | 수강 중인 과정 + 진도율 | Admin API | 회원 |

#### 데이터 구조

```typescript
interface LearningProgress {
  userId: string;          // 사용자 이메일
  courseId: string;        // 과정 ID
  videoId: string;         // 영상 ID (고유)
  watched: boolean;        // 시청 완료 여부
  watchedAt?: string;      // 시청 완료 시간 (KST)
}
```

#### 영상 데이터 구조

```typescript
interface Video {
  id: string;              // 고유 ID (예: "video-001")
  title: string;           // 영상 제목
  duration: string;        // 재생 시간 (예: "45분")
  driveUrl: string;        // Google Drive 직접 링크
  category: string;        // 카테고리 (예: "기본 이론")
}
```

### 4.3 시험 시스템

#### 기능 목록

| 기능 | 설명 | API | 권한 |
|------|------|-----|------|
| **시험 목록 조회** | 카테고리별 시험 목록 | Test API | 회원 |
| **시험 문제 가져오기** | OX 문제 조회 | Test API | 회원 |
| **시험 응시** | 30문제 OX 선택 | 프론트엔드 | 회원 |
| **자동 채점** | 정답 비교 + 점수 계산 | Test API | 회원 |
| **결과 저장** | Google Sheets에 기록 | Test API | 회원 |
| **결과 조회** | 내 시험 기록 확인 | Test API | 회원 |
| **시험 문제 일괄 등록** | MD/Excel 파일 업로드 | Admin API | 관리자 |
| **시험 문제 수정** | 기존 문제 편집 | Test API | 관리자 |
| **시험 문제 삭제** | 문제 삭제 | Test API | 관리자 |

#### 시험 데이터 구조

```typescript
interface ExamQuestion {
  id: string;              // 문제 ID (자동 생성)
  category: string;        // 카테고리 (예: "1급 필기")
  question: string;        // 문제 내용
  answer: 'O' | 'X';       // 정답
  explanation?: string;    // 해설 (선택)
}

interface ExamResult {
  userId: string;          // 사용자 이메일
  category: string;        // 시험 카테고리
  score: number;           // 점수 (0-100)
  totalQuestions: number;  // 전체 문제 수
  correctAnswers: number;  // 맞은 문제 수
  passed: boolean;         // 합격 여부 (70점 이상)
  submittedAt: string;     // 제출 시간 (KST)
  answers: string;         // 사용자 답안 (JSON)
}
```

#### 시험 문제 일괄 등록 형식

**마크다운 (MD)**:
```markdown
## 문제 1
축제 기획의 첫 단계는 목표 설정이다.
답: O
해설: 명확한 목표 설정이 필수입니다.

## 문제 2
예산은 마지막에 고려한다.
답: X
해설: 예산은 초기 기획 단계부터 고려해야 합니다.
```

**Excel (XLSX)**:
| 문제 | 답 | 해설 |
|------|-----|------|
| 축제 기획의 첫 단계는 목표 설정이다. | O | 명확한 목표 설정이 필수입니다. |
| 예산은 마지막에 고려한다. | X | 예산은 초기 기획 단계부터 고려해야 합니다. |

### 4.4 관리자 대시보드

#### 기능 목록

| 섹션 | 기능 | 설명 |
|------|------|------|
| **회원 관리** | 회원 목록 | 전체 회원 조회/검색 |
|  | 회원 정보 수정 | 이름, 전화번호, 수강 과정 변경 |
|  | 회원 삭제 | 회원 삭제 (복구 불가) |
|  | 관리자 권한 부여 | isAdmin 플래그 변경 |
| **시험 관리** | 문제 일괄 등록 | MD/Excel 파일 업로드 |
|  | 문제 수정/삭제 | 기존 문제 편집 |
|  | 카테고리 관리 | 시험 카테고리 추가/삭제 |
| **보안 관리** | 접속 로그 조회 | 실시간 접속 기록 확인 |
|  | IP 차단 | 특정 IP 차단/해제 |
|  | VPN 사용자 감지 | 의심스러운 접속 감지 |
| **통계** | 회원 통계 | 가입자 수, 수강생 수 |
|  | 학습 통계 | 평균 진도율, 완강률 |
|  | 시험 통계 | 평균 점수, 합격률 |

---

## 5. 페이지 구조

### 5.1 라우팅 구조

총 **23개 페이지** 구성:

```
/ (Root)
├── / (HomePage) - 메인 홈페이지
├── /login (LoginPage) - 로그인
├── /signup (SignupPage) - 회원가입
├── /about (AboutPage) - 소개
├── /about-company (AboutCompanyPage) - 회사 소개
├── /curriculum (CurriculumPage) - 커리큘럼
├── /courses (CoursesPage) - 수강 신청
├── /certificate (CertificatePage) - 자격증 안내
├── /reviews (ReviewsPage) - 수강 후기
├── /notice (NoticePage) - 공지사항
├── /support (SupportPage) - 고객 지원
├── /payment (PaymentPage) - 결제
├── /terms (TermsPage) - 이용약관
├── /privacy (PrivacyPage) - 개인정보처리방침
├── /my-classroom (MyClassroomPage) - 내 강의실 🔒
│   ├── 수강 중인 과정
│   ├── 진도율
│   └── 영상 시청
├── /profile (ProfilePage) - 내 정보 🔒
├── /exam (ExamPage) - 시험 응시 🔒
├── /exam-results (ExamResultsPage) - 시험 결과 🔒
├── /admin (AdminPage) - 관리자 대시보드 🔐
└── /blocked (BlockedPage) - IP 차단 페이지

🔒 로그인 필요
🔐 관리자 권한 필요
```

### 5.2 네비게이션 구조

#### 헤더 메뉴 (모든 페이지)

```
[로고] 홈 | 소개 | 커리큘럼 | 수강신청 | 자격증 | 후기 | 공지 | 지원
                                                       [로그인/프로필]
```

#### 푸터 메뉴 (모든 페이지)

```
회사 소개 | 이용약관 | 개인정보처리방침
© 2026 축제기획사 교육원. All rights reserved.
```

### 5.3 페이지별 주요 컴포넌트

| 페이지 | 주요 컴포넌트 | 설명 |
|--------|--------------|------|
| **HomePage** | Hero, Features, CTA | 메인 랜딩 페이지 |
| **LoginPage** | LoginForm | 이메일/비밀번호 입력 |
| **SignupPage** | SignupForm | 회원가입 폼 |
| **MyClassroomPage** | CourseCard, VideoPlayer | 영상 시청 + 진도율 |
| **ExamPage** | QuestionCard, AnswerButton | OX 문제 풀이 |
| **AdminPage** | UserTable, LogTable, IPBlocker | 관리자 도구 |

---

## 6. 데이터베이스 스키마

### 6.1 Google Sheets 구조

총 **6개 시트**:

```
[축제기획사 교육 시스템 - 메인]
├── users                  (회원 정보)
├── learning_progress      (학습 진도)
├── security_logs         (접속 로그)
└── blocked_ips           (차단 IP 목록)

[축제기획사 시험 시스템 - 별도]
├── exam_questions        (시험 문제)
└── exam_results          (시험 결과)
```

### 6.2 users 시트

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| email | string | 이메일 (Primary Key) | `user@example.com` |
| password | string | 해시된 비밀번호 | `hashed_pw_123` |
| name | string | 이름 | `홍길동` |
| phone | string | 전화번호 | `010-1234-5678` |
| isAdmin | string | 관리자 여부 | `TRUE` / `FALSE` |
| enrolledCourses | string | 수강 과정 (콤마 구분) | `1급,2급` |
| createdAt | string | 가입일 (KST) | `2026-02-12 14:30:00` |

**인덱스**: email (고유)

### 6.3 learning_progress 시트

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| userId | string | 사용자 이메일 | `user@example.com` |
| courseId | string | 과정 ID | `festival-1급` |
| videoId | string | 영상 ID | `video-001` |
| watched | string | 시청 완료 | `TRUE` / `FALSE` |
| watchedAt | string | 시청 시간 (KST) | `2026-02-12 15:45:00` |

**복합 키**: (userId, courseId, videoId)

### 6.4 exam_questions 시트

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| id | string | 문제 ID (자동) | `q-20260212-001` |
| category | string | 시험 카테고리 | `1급 필기` |
| question | string | 문제 내용 | `축제의 첫 단계는?` |
| answer | string | 정답 | `O` / `X` |
| explanation | string | 해설 (선택) | `명확한 목표가 필요` |
| createdAt | string | 등록일 (KST) | `2026-02-12 10:00:00` |

**인덱스**: category (빠른 조회)

### 6.5 exam_results 시트

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| userId | string | 사용자 이메일 | `user@example.com` |
| category | string | 시험 카테고리 | `1급 필기` |
| score | number | 점수 | `85` |
| totalQuestions | number | 전체 문제 수 | `30` |
| correctAnswers | number | 맞은 문제 수 | `25` |
| passed | string | 합격 여부 | `TRUE` / `FALSE` |
| submittedAt | string | 제출 시간 (KST) | `2026-02-12 16:20:00` |
| answers | string | 사용자 답안 (JSON) | `[{"q":"q-001","a":"O"}]` |

**복합 인덱스**: (userId, category, submittedAt)

### 6.6 security_logs 시트

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| timestamp | string | 접속 시간 (KST) | `2026-02-12 14:30:00` |
| userId | string | 사용자 이메일 (선택) | `user@example.com` |
| ip | string | IP 주소 | `123.456.789.0` |
| ipCountry | string | IP 기반 국가 | `South Korea` |
| ipCity | string | IP 기반 도시 | `Seoul` |
| geoLat | number | GPS 위도 (선택) | `37.566` |
| geoLng | number | GPS 경도 (선택) | `126.9784` |
| geoCountry | string | GPS 기반 국가 (선택) | `대한민국` |
| locationMismatch | string | VPN 의심 | `TRUE` / `FALSE` |
| userAgent | string | 브라우저 정보 | `Mozilla/5.0...` |
| location | string | 접속 URL | `https://example.com/exam` |
| page | string | 페이지 경로 | `/exam` |
| action | string | 액션 | `page_view` |
| alertType | string | 경고 수준 | `normal` / `warning` / `suspicious` / `danger` |
| details | string | 상세 정보 | `시험 시작: 1급 필기` |
| sessionId | string | 세션 ID | `session-123-abc` |
| advancedTracking | string | 고급 추적 데이터 (JSON) | `{"vpn":false,"timezone":"Asia/Seoul"}` |

**인덱스**: timestamp (시간순 정렬)

### 6.7 blocked_ips 시트

| 컬럼명 | 타입 | 설명 | 예시 |
|--------|------|------|------|
| ip | string | 차단된 IP | `203.0.113.1` |
| reason | string | 차단 사유 | `반복적인 부정 행위` |
| blockedAt | string | 차단 시간 (KST) | `2026-02-12 18:00:00` |
| blockedBy | string | 차단한 관리자 | `admin@example.com` |

**인덱스**: ip (고유)

---

## 7. API 명세

### 7.1 Admin API (회원 관리)

**엔드포인트**: `https://script.google.com/macros/s/[ADMIN_SCRIPT_ID]/exec`

#### 7.1.1 회원가입

```http
POST /
Content-Type: application/json

{
  "action": "signup",
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}

Response:
{
  "success": true,
  "message": "회원가입 성공",
  "token": "jwt_token_here"
}
```

#### 7.1.2 로그인

```http
POST /
Content-Type: application/json

{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "user": {
    "email": "user@example.com",
    "name": "홍길동",
    "isAdmin": false,
    "enrolledCourses": "1급,2급"
  },
  "token": "jwt_token_here"
}
```

#### 7.1.3 학습 진도 조회

```http
POST /
Content-Type: application/json

{
  "action": "getProgress",
  "userId": "user@example.com"
}

Response:
{
  "success": true,
  "progress": [
    {
      "courseId": "festival-1급",
      "videoId": "video-001",
      "watched": true,
      "watchedAt": "2026-02-12 15:45:00"
    }
  ]
}
```

#### 7.1.4 학습 진도 업데이트

```http
POST /
Content-Type: application/json

{
  "action": "updateProgress",
  "userId": "user@example.com",
  "courseId": "festival-1급",
  "videoId": "video-001",
  "watched": true
}

Response:
{
  "success": true,
  "message": "진도 업데이트 완료"
}
```

#### 7.1.5 회원 목록 조회 (관리자)

```http
POST /
Content-Type: application/json

{
  "action": "getAllUsers"
}

Response:
{
  "success": true,
  "users": [
    {
      "email": "user@example.com",
      "name": "홍길동",
      "phone": "010-1234-5678",
      "isAdmin": false,
      "enrolledCourses": "1급,2급",
      "createdAt": "2026-02-12 14:30:00"
    }
  ]
}
```

### 7.2 Test API (시험 관리)

**엔드포인트**: `https://script.google.com/macros/s/[TEST_SCRIPT_ID]/exec`

#### 7.2.1 시험 문제 가져오기

```http
POST /
Content-Type: application/json

{
  "action": "getExamQuestions",
  "category": "1급 필기"
}

Response:
{
  "success": true,
  "questions": [
    {
      "id": "q-001",
      "question": "축제의 첫 단계는 목표 설정이다.",
      "answer": "O"
    }
  ]
}
```

#### 7.2.2 시험 제출

```http
POST /
Content-Type: application/json

{
  "action": "submitExam",
  "userId": "user@example.com",
  "category": "1급 필기",
  "answers": [
    {"questionId": "q-001", "answer": "O"}
  ]
}

Response:
{
  "success": true,
  "result": {
    "score": 85,
    "totalQuestions": 30,
    "correctAnswers": 25,
    "passed": true
  }
}
```

#### 7.2.3 시험 문제 일괄 등록 (관리자)

```http
POST /
Content-Type: application/json

{
  "action": "bulkUploadQuestions",
  "category": "1급 필기",
  "questions": [
    {
      "question": "축제의 첫 단계는?",
      "answer": "O",
      "explanation": "목표 설정 필수"
    }
  ]
}

Response:
{
  "success": true,
  "message": "30개 문제 등록 완료"
}
```

### 7.3 Log API (접속 로그)

**엔드포인트**: `https://script.google.com/macros/s/[LOG_SCRIPT_ID]/exec`

#### 7.3.1 로그 배치 전송

```http
POST /
Content-Type: application/json

{
  "action": "batchLog",
  "logs": [
    {
      "timestamp": "2026-02-12 14:30:00",
      "userId": "user@example.com",
      "ip": "123.456.789.0",
      "ipCountry": "South Korea",
      "ipCity": "Seoul",
      "page": "/exam",
      "action": "exam_start",
      "alertType": "normal"
    }
  ],
  "count": 1
}

Response:
{
  "success": true,
  "message": "1개 로그 기록 완료"
}
```

#### 7.3.2 로그 조회 (관리자)

```http
GET /?action=getLogs&limit=100

Response:
{
  "success": true,
  "logs": [
    {
      "timestamp": "2026-02-12 14:30:00",
      "userId": "user@example.com",
      "ip": "123.456.789.0",
      "page": "/exam",
      "action": "exam_start"
    }
  ]
}
```

---

## 8. 보안 시스템

### 8.1 IP 차단 시스템

#### 기능

- **자동 차단**: 반복적인 부정 행위 감지 시 자동 차단
- **수동 차단**: 관리자가 직접 IP 차단/해제
- **차단 페이지**: 차단된 IP 접속 시 `/blocked` 페이지로 리다이렉트

#### 차단 조건

| 조건 | 설명 | 액션 |
|------|------|------|
| **반복 로그인 실패** | 5회 연속 실패 | 30분 차단 |
| **짧은 시간 다수 요청** | 1분에 100회 이상 | 1시간 차단 |
| **시험 부정 행위** | 비정상적인 점수 패턴 | 영구 차단 |
| **관리자 직접 차단** | 수동 차단 | 영구 차단 |

#### 구현

```typescript
// IP 차단 확인
async function checkIPBlock(userIP: string): Promise<boolean> {
  const response = await fetch(`${LOG_API_URL}?action=isBlocked&ip=${userIP}`);
  const data = await response.json();
  
  if (data.blocked) {
    window.location.href = '/blocked';
    return true;
  }
  return false;
}
```

### 8.2 접속 로그 시스템

#### 수집 데이터

| 카테고리 | 데이터 | 용도 |
|---------|--------|------|
| **기본 정보** | IP, 타임스탬프, 사용자 ID | 접속 추적 |
| **위치 정보** | IP 국가/도시, GPS 위도/경도 | 지역 분석 |
| **VPN 감지** | IP vs GPS 위치 불일치 | 보안 위협 감지 |
| **행동 정보** | 페이지, 액션, 상세 내용 | 사용자 행동 분석 |
| **브라우저 정보** | User-Agent, 화면 크기, 언어 | 호환성 분석 |

#### 배치 전송

- **주기**: 5분마다 자동 전송
- **방식**: 로컬에 쌓인 로그를 한 번에 전송
- **예외**: 보안 로그(warning, suspicious, danger)는 즉시 전송

#### 구현

```typescript
// 로그 배처 (5분마다 자동 전송)
class LogBatcher {
  private logs: LogData[] = [];
  private timer: NodeJS.Timeout | null = null;
  
  add(log: LogData) {
    this.logs.push(log);
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), 5 * 60 * 1000); // 5분
    }
  }
  
  async flush() {
    if (this.logs.length === 0) return;
    
    await fetch(LOG_API_URL, {
      method: 'POST',
      body: JSON.stringify({
        action: 'batchLog',
        logs: this.logs,
        count: this.logs.length
      })
    });
    
    this.logs = [];
    this.timer = null;
  }
}
```

### 8.3 VPN 감지

#### 원리

```
IP 기반 위치 (ip-api.com)
  ↓
GPS 기반 위치 (Geolocation API)
  ↓
국가 비교
  ↓
불일치 → VPN 의심
```

#### 예시

| IP 국가 | GPS 국가 | 판정 | 액션 |
|---------|---------|------|------|
| South Korea | 대한민국 | 정상 ✅ | - |
| United States | South Korea | **VPN 의심 ⚠️** | 로그에 경고 표시 |
| Unknown | South Korea | 정상 (IP 조회 실패) | - |

### 8.4 고급 추적 (Advanced Tracking)

#### 수집 데이터

```typescript
interface AdvancedTrackingData {
  timezone: string;           // 시간대 (예: "Asia/Seoul")
  language: string;           // 브라우저 언어 (예: "ko-KR")
  platform: string;           // 플랫폼 (예: "Win32")
  screenWidth: number;        // 화면 너비
  screenHeight: number;       // 화면 높이
  colorDepth: number;         // 색상 깊이
  cookieEnabled: boolean;     // 쿠키 활성화 여부
  doNotTrack: boolean;        // DNT 설정
  hardwareConcurrency: number;// CPU 코어 수
  deviceMemory?: number;      // 메모리 (GB)
  connection?: string;        // 네트워크 타입
}
```

#### 용도

- **브라우저 핑거프린팅**: 고유 디바이스 식별
- **부정 행위 감지**: 동일 디바이스에서 여러 계정 의심
- **통계 분석**: 사용자 환경 최적화

### 8.5 JWT 인증 (수동 구현)

#### 토큰 구조

```
header.payload.signature
```

**Payload 예시**:
```json
{
  "email": "user@example.com",
  "name": "홍길동",
  "isAdmin": false,
  "iat": 1707728400,
  "exp": 1707814800
}
```

#### 저장 위치

- **로그인 유지 ON**: localStorage (영구 저장)
- **로그인 유지 OFF**: sessionStorage (브라우저 닫으면 삭제)

#### 검증 방식

```typescript
function verifyToken(token: string): User | null {
  try {
    const [header, payload, signature] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    
    // 만료 확인
    if (decoded.exp < Date.now() / 1000) {
      return null;
    }
    
    return decoded;
  } catch {
    return null;
  }
}
```

---

## 9. 디자인 시스템

### 9.1 타이포그래피

| 용도 | 폰트 | 굵기 | 예시 |
|------|------|------|------|
| **제목/헤딩** | Playfair Display | 500 | `<h1 style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}>` |
| **본문/UI** | Inter | 300 | `<p style={{ fontFamily: 'Inter', fontWeight: 300 }}>` |

**❌ 금지사항**:
- Tailwind 폰트 크기 클래스 (`text-lg`, `text-xl`, `text-2xl` 등)
- Tailwind 폰트 굵기 클래스 (`font-bold`, `font-semibold` 등)

### 9.2 컬러 시스템

| 변수명 | 색상 코드 | 용도 |
|--------|----------|------|
| `--primary` | `#6cb25b` | 메인 초록색 |
| `--background` | `#f2efe9` | 배경 (라이트 모드) |
| `--card` | `#ffffff` | 카드 배경 |
| `--border` | `rgba(0, 0, 0, 0.05)` | 테두리 |
| `--foreground` | `#000000` | 텍스트 (라이트 모드) |

**사용 예시**:
```tsx
<Card className="bg-card border-border">
  <CardContent className="text-foreground">
    내용
  </CardContent>
</Card>
```

### 9.3 레이아웃

| 속성 | 값 | 용도 |
|------|-----|------|
| **페이지 상단 여백** | `pt-24` | 헤더 고정 고려 |
| **페이지 하단 여백** | `pb-32` | 푸터 여백 |
| **최대 너비 (상세)** | `max-w-4xl` | 본문 컨텐츠 |
| **최대 너비 (목록)** | `max-w-7xl` | 와이드 레이아웃 |
| **좌우 여백** | `px-6` | 모바일 대응 |

### 9.4 반응형 디자인

#### 브레이크포인트

```css
/* 모바일 */
@media (max-width: 1023px) {
  /* 1-column 레이아웃 */
}

/* 태블릿 ~ 데스크탑 */
@media (min-width: 1024px) and (max-width: 1919px) {
  /* 스케일링: 0.8 ~ 1.0 */
  font-size: calc(16px * (0.2 * (100vw - 1024px) / 896 + 0.8));
}

/* 풀HD 이상 */
@media (min-width: 1920px) {
  /* 고정 크기 */
}
```

#### 스케일링 전략

- **1920px 이상**: 기본 크기 (1.0x)
- **1024px ~ 1920px**: 비례 축소 (0.8x ~ 1.0x)
- **1024px 미만**: 모바일 레이아웃

### 9.5 애니메이션

| 효과 | 클래스 | 용도 |
|------|--------|------|
| **색상 전환** | `transition-colors` | 호버 효과 |
| **그림자 전환** | `transition-shadow` | 카드 호버 |
| **전체 전환** | `transition-all` | 복합 효과 |

**예시**:
```tsx
<Card className="transition-shadow hover:shadow-md">
  <Button className="transition-colors hover:text-primary">
    클릭
  </Button>
</Card>
```

### 9.6 다크 모드

자동 지원 (CSS 변수 기반):

```css
/* 라이트 모드 */
:root {
  --background: #f2efe9;
  --foreground: #000000;
}

/* 다크 모드 */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1a1a1a;
    --foreground: #ffffff;
  }
}
```

---

## 10. 배포 및 설정

### 10.1 Google Apps Script 배포

#### 배포 URL

| API | Script ID | 배포 URL |
|-----|-----------|----------|
| **Admin API** | `AKfycby...` | `https://script.google.com/macros/s/.../exec` |
| **Log API** | `AKfycbzJ...` | `https://script.google.com/macros/s/.../exec` |
| **Test API** | `AKfycbx...` | `https://script.google.com/macros/s/.../exec` |

#### 배포 설정

1. **Apps Script 프로젝트 열기**
2. **배포 → 새 배포**
3. **유형 선택: 웹 앱**
4. **액세스 권한**:
   - 실행 계정: `나`
   - 액세스 권한: `모든 사용자`
5. **배포 → URL 복사**

### 10.2 환경 변수 설정

#### 프론트엔드 (`/src/app/utils/gas-api.ts`)

```typescript
// Admin API
const ADMIN_API_URL = "https://script.google.com/macros/s/AKfycby.../exec";

// Test API
const TEST_API_URL = "https://script.google.com/macros/s/AKfycbx.../exec";

// Log API
const LOG_API_URL = "https://script.google.com/macros/s/AKfycbzJ.../exec";
```

### 10.3 Google Sheets 설정

#### 시트 구조 생성

1. **메인 스프레드시트** (회원 + 학습 + 로그)
   - 시트: `users`, `learning_progress`, `security_logs`, `blocked_ips`
   - 공유: Apps Script에만 액세스 권한

2. **시험 스프레드시트** (시험 문제 + 결과)
   - 시트: `exam_questions`, `exam_results`
   - 공유: Apps Script에만 액세스 권한

#### 헤더 행 설정

각 시트의 1행에 컬럼명 입력:

**users 시트**:
```
email | password | name | phone | isAdmin | enrolledCourses | createdAt
```

**exam_questions 시트**:
```
id | category | question | answer | explanation | createdAt
```

### 10.4 프로덕션 체크리스트

- [ ] Apps Script 배포 완료 (3개 API)
- [ ] 배포 URL 프론트엔드에 설정
- [ ] Google Sheets 시트 구조 생성 (6개)
- [ ] 관리자 계정 생성 (isAdmin: TRUE)
- [ ] Google Drive 영상 업로드 + 공개 링크 생성
- [ ] IP 차단 시스템 테스트
- [ ] 접속 로그 수집 테스트
- [ ] 시험 문제 등록 (MD/Excel)
- [ ] 프론트엔드 빌드 (`npm run build`)
- [ ] 도메인 연결 (선택)
- [ ] HTTPS 인증서 설정 (선택)

---

## 11. 개발 히스토리

### 11.1 주요 마일스톤

| 날짜 | 버전 | 내용 |
|------|------|------|
| **2026-01-15** | 0.1.0 | 프로젝트 시작, 기본 UI 구성 |
| **2026-01-20** | 0.2.0 | Admin API 구축, 회원가입/로그인 |
| **2026-01-25** | 0.3.0 | 학습 관리 시스템 (영상 시청 기록) |
| **2026-02-01** | 0.4.0 | 시험 시스템 (OX 문제, 자동 채점) |
| **2026-02-08** | 0.6.0 | 관리자 대시보드 (MD/Excel 파싱) |
| **2026-02-10** | 0.7.0 | 보안 시스템 (IP 차단, 접속 로그) |
| **2026-02-11** | 0.8.0 | React Router 통합, 전체 라우팅 |
| **2026-02-12** | **1.0.0** | 프로덕션 준비 완료 ✅ |
| **2026-02-13** | **1.1.0** | Q&A 시스템 제거, 문서 정리 |

### 11.2 최근 업데이트 (2026-02-13)

#### 1. **Q&A 시스템 제거**
   - Q&A 게시판 관련 기능 전면 제거
   - QnA API 제거
   - qna_board 시트 제거
   - 시스템 단순화 및 유지보수 개선

#### 2. **문서 업데이트**
   - SYSTEM_SPECIFICATION.md 최신화
   - Q&A 관련 내용 전체 제거
   - 페이지 수 업데이트 (25개 → 23개)
   - API 명세 업데이트 (4개 → 3개)

---

## 12. 향후 로드맵

### 12.1 단기 목표 (1-3개월)

- [ ] **이메일 알림 시스템**
  - 시험 결과 이메일 발송
  - 수강 기간 만료 알림

- [ ] **결제 시스템 통합**
  - 토스페이먼츠 / 아임포트 연동
  - 수강료 자동 결제
  - 영수증 자동 발급

- [ ] **자격증 발급 자동화**
  - PDF 자격증 생성 (jsPDF)
  - QR 코드 추가 (진위 확인)
  - 이메일 자동 발송

- [ ] **모바일 앱 개발**
  - React Native 기반
  - 오프라인 영상 다운로드
  - 푸시 알림

### 12.2 중기 목표 (3-6개월)

- [ ] **AI 튜터 챗봇**
  - OpenAI API 통합
  - 학습 질문 자동 답변
  - 개인화된 학습 추천

- [ ] **라이브 강의 기능**
  - Zoom / Google Meet 통합
  - 실시간 Q&A
  - 출석 체크

- [ ] **학습 분석 대시보드**
  - 학습 패턴 분석
  - 약점 진단
  - 맞춤형 학습 계획

- [ ] **소셜 기능**
  - 학습 그룹 (스터디)
  - 포인트/배지 시스템
  - 리더보드

### 12.3 장기 목표 (6개월 이상)

- [ ] **다국어 지원**
  - 영어, 중국어, 일본어
  - 자동 번역 (Google Translate API)

- [ ] **기업 교육 패키지**
  - B2B 전용 관리자 대시보드
  - 그룹 수강 관리
  - 맞춤형 커리큘럼

- [ ] **백엔드 마이그레이션**
  - Google Sheets → PostgreSQL/MongoDB
  - AWS/GCP 서버 구축
  - API 성능 최적화

---

## 13. 수강료 및 가격 정책

### 13.1 과정별 수강료

| 과정명 | 등급 | 수강료 | 수강 기간 | 포함 내용 |
|--------|------|--------|----------|-----------|
| **축제기획사 2급** | 2급 | ₩150,000 | 6개월 | • 온라인 강의 (20강)<br>• 시험 응시 1회<br>• 학습 자료 제공 |
| **축제기획사 1급** | 1급 | ₩250,000 | 6개월 | • 온라인 강의 (30강)<br>• 시험 응시 1회<br>• 학습 자료 제공<br>• 실무 케이스 스터디 |
| **통합 과정 (1급+2급)** | 통합 | ₩350,000 | 12개월 | • 온라인 강의 (50강)<br>• 시험 응시 각 1회<br>• 학습 자료 제공<br>• 실무 케이스 스터디 |

### 13.2 자격증 발급 비용

| 항목 | 비용 | 비고 |
|------|------|------|
| **자격증 발급** | ₩30,000 | • 시험 합격 후 신청<br>• 등기우편 배송 포함<br>• 3~5 영업일 소요 |
| **자격증 재발급** | ₩15,000 | • 분실/훼손 시<br>• 배송비 포함 |

### 13.3 할인 정책

#### 조기 등록 할인
| 할인 종류 | 할인율 | 조건 |
|----------|--------|------|
| **얼리버드 할인** | 20% | 과정 시작 30일 전 등록 |
| **일반 사전 등록** | 10% | 과정 시작 14일 전 등록 |

#### 그룹 할인
| 인원 | 할인율 | 비고 |
|------|--------|------|
| **3~5명** | 15% | 동일 기수 등록 시 |
| **6~10명** | 20% | 기업/단체 등록 시 |
| **11명 이상** | 25% | 맞춤 교육 상담 가능 |

#### 재수강 할인
| 할인 종류 | 할인율 | 조건 |
|----------|--------|------|
| **동일 과정 재수강** | 50% | 시험 불합격 시 |
| **상위 과정 등록** | 30% | 2급 합격 후 1급 등록 시 |

### 13.4 환불 정책

| 기간 | 환불율 | 비고 |
|------|--------|------|
| **수강 시작 전** | 100% | 전액 환불 (수수료 없음) |
| **수강 시작 후 7일 이내** | 100% | 진도율 10% 미만 시 |
| **수강 시작 후 8~14일** | 50% | 진도율 30% 미만 시 |
| **수강 시작 후 15일 이후** | 환불 불가 | 진도율 30% 이상 시 |

**특별 환불 사유**:
- 천재지변, 질병 등 불가피한 사유: 개별 심사 후 결정
- 강의 품질 문제: 증빙 자료 제출 시 전액 환불

### 13.5 결제 방법

| 결제 수단 | 수수료 | 비고 |
|----------|--------|------|
| **신용카드** | 무료 | 무이자 할부 2~3개월 가능 |
| **계좌이체** | 무료 | 입금 확인 후 승인 |
| **가상계좌** | 무료 | 24시간 이내 입금 필수 |
| **간편결제** | 무료 | 네이버페이, 카카오페이 |

### 13.6 추가 서비스

| 서비스 | 비용 | 설명 |
|--------|------|------|
| **시험 재응시** | ₩20,000 | 1회 추가 시험 응시 |
| **수강 기간 연장** | ₩30,000/3개월 | 기간 만료 시 연장 가능 |
| **1:1 맞춤 컨설팅** | ₩50,000/1시간 | 실무 경험 강사 배정 |
| **실습 키트 (오프라인)** | ₩80,000 | 실제 축제 기획 실습 자료 |

### 13.7 기업 교육 패키지

| 패키지 | 인원 | 비용 | 포함 내용 |
|--------|------|------|-----------| 
| **스타트업 패키지** | 5~10명 | ₩1,200,000 | • 전 과정 수강<br>• 전담 강사 배정<br>• 맞춤 교육 자료 |
| **기업 패키지** | 11~30명 | ₩3,000,000 | • 전 과정 수강<br>• 전담 강사 배정<br>• 맞춤 교육 자료<br>• 오프라인 특강 1회 |
| **대기업 패키지** | 31명 이상 | 별도 협의 | • 맞춤형 커리큘럼<br>• 전담 강사 팀 배정<br>• 오프라인 특강 다수<br>• 실무 프로젝트 지원 |

### 13.8 장학 제도

| 장학금 종류 | 지원 금액 | 선발 조건 |
|------------|----------|-----------|
| **우수 학생 장학금** | 수강료 50% | 시험 90점 이상 + 우수 학습 태도 |
| **소외 계층 장학금** | 수강료 100% | 기초생활수급자, 장애인 등 |
| **추천 장학금** | ₩50,000 | 신규 회원 추천 시 (추천인/피추천인 각각) |

### 13.9 이용 안내

#### 수강 등록 절차
1. 회원가입
2. 과정 선택 및 결제
3. 수강 승인 (자동/즉시)
4. 학습 시작

#### 자격증 발급 절차
1. 시험 응시 (70점 이상 합격)
2. 자격증 발급 신청 + 비용 결제
3. 자격증 제작 (3~5 영업일)
4. 등기우편 발송
5. 수령 확인

#### 고객 지원
- **전화**: 02-1234-5678 (평일 09:00~18:00)
- **이메일**: support@kqea.or.kr
- **실시간 채팅**: 평일 09:00~18:00

---

**가격 정책 최종 업데이트**: 2026년 2월 13일  
**가격은 사전 공지 없이 변경될 수 있습니다.**  
**자세한 문의는 고객센터로 연락 주시기 바랍니다.**

---

## 📚 관련 문서

- **디자인 가이드**: `/guidelines/DESIGN_GUIDE.md`
- **개발 가이드라인**: `/guidelines/Guidelines.md`
- **시험 문제 일괄 등록**: `/guidelines/EXAM_BULK_UPLOAD_GUIDE.md`
- **Admin API**: `/guidelines/admin.gs.md`
- **Log API**: `/guidelines/log.gs.md`
- **Test API**: `/guidelines/test.gs.md`

---

## 🤝 기여 및 지원

### 버그 리포트

문제 발생 시 다음 정보 포함:

1. 발생 페이지 URL
2. 에러 메시지 (콘솔 로그)
3. 재현 방법
4. 브라우저 정보 (User-Agent)

### 기능 제안

새로운 기능 제안 시:

1. 기능 설명
2. 사용 사례 (Use Case)
3. 기대 효과
4. 우선순위

---

## 📄 라이선스

**Private** - 비공개 프로젝트  
**Copyright © 2026 축제기획사 교육원. All rights reserved.**

---

**마지막 업데이트**: 2026년 2월 13일  
**문서 버전**: 1.1.0  
**작성자**: AI Development Team  
**검토자**: Project Manager

---

## 🎉 프로젝트 완료 체크리스트

- [x] 회원 관리 시스템 ✅
- [x] 학습 관리 시스템 ✅
- [x] 시험 시스템 (OX 문제) ✅
- [x] 관리자 대시보드 ✅
- [x] IP 차단 시스템 ✅
- [x] 접속 로그 시스템 ✅
- [x] VPN 감지 ✅
- [x] React Router 라우팅 ✅
- [x] Google Drive 영상 임베딩 ✅
- [x] MD/Excel 시험 문제 파싱 ✅
- [x] 반응형 디자인 (1920px~320px) ✅
- [x] 다크 모드 지원 ✅
- [x] 프로덕션 배포 준비 ✅
- [x] 전체 문서화 완료 ✅
- [x] Q&A 시스템 제거 및 단순화 ✅

**🎓 축제기획사 자격증 교육기관 웹사이트 - 프로덕션 준비 완료!**

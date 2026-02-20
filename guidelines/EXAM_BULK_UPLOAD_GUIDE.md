# 시험문제 일괄 등록 기능 가이드

## 🎯 개요

관리자 대시보드에서 MD 파일 또는 Excel 파일을 업로드하면 자동으로 파싱하여 Google Sheets에 시험문제를 등록하는 기능입니다.

---

## 📋 완료된 작업

### 1. ✅ **ExamQuestionUploader 컴포넌트 생성**
   - 위치: `/src/app/components/ExamQuestionUploader.tsx`
   - 기능:
     - MD 파일 파싱
     - Excel 파일 파싱 (xlsx 라이브러리 사용)
     - 샘플 파일 다운로드
     - 실시간 업로드 진행 상태 표시
     - 업로드된 문제 미리보기

### 2. ✅ **Apps Script 함수 추가**
   - 파일: `/testapp.gs.tsx`
   - 함수: `bulkAddQuestions(questions)`
   - 기능:
     - 문제 배열을 받아서 스프레드시트에 일괄 등록
     - 시트가 없으면 자동 생성
     - 헤더 자동 설정
     - 데이터 한번에 입력 (성능 최적화)

### 3. ✅ **패키지 설치**
   - `xlsx` 라이브러리 설치 완료

---

## 🚀 AdminPage에 통합하기

AdminPage에서 `<ExamQuestionUploader />` 컴포넌트를 추가하세요:

```tsx
import { ExamQuestionUploader } from '@/app/components/ExamQuestionUploader';

// AdminPage 컴포넌트 내부에 추가
<ExamQuestionUploader 
  onUploadComplete={() => {
    // 업로드 완료 후 실행할 코드 (선택사항)
    console.log('문제 업로드 완료!');
  }}
/>
```

---

## 📝 파일 형식

### 1. **MD 파일 형식**

```markdown
# 시험문제

## 문제 1
**배점**: 1
**정답**: O
**문제**: 축제기획의 첫 단계는 기획안 작성이다.
**이미지**: https://drive.google.com/file/d/ABC123/view

## 문제 2
**배점**: 2
**정답**: X
**문제**: 축제 마케팅은 홍보만 포함한다.
**이미지**: 

## 문제 3
**배점**: 1
**정답**: O
**문제**: 안전관리는 축제 운영의 필수 요소이다.
**이미지**: 
```

**지원 키워드:**
- `**배점**:` 또는 `**점수**:` 또는 `**Score**:`
- `**정답**:` 또는 `**Answer**:` (O 또는 X)
- `**문제**:` 또는 `**Question**:`
- `**이미지**:` 또는 `**Image**:` (선택사항)

### 2. **Excel 파일 형식**

| A열 (배점) | B열 (정답) | C열 (문제설명) | D열 (이미지URL) |
|-----------|----------|--------------|---------------|
| 1         | O        | 축제기획의... | https://...   |
| 2         | X        | 축제 마케팅... | (비워도 됨)   |
| 1         | O        | 안전관리는...  |               |

**주의사항:**
- 첫 번째 행은 헤더로 건너뜁니다
- A열: 숫자 (배점, 기본값 1)
- B열: O 또는 X
- C열: 문제 텍스트
- D열: 이미지 URL (선택사항)

---

## 🖼️ 이미지 URL

### Google Drive 사용 시:
1. Google Drive에 이미지 업로드
2. 우클릭 → **공유**
3. **링크가 있는 모든 사용자** 권한 설정
4. 링크 복사하여 사용

**지원하는 URL 형식:**
- `https://drive.google.com/file/d/FILE_ID/view`
- `https://drive.google.com/open?id=FILE_ID`
- `FILE_ID` (파일 ID만)

모두 자동으로 `https://drive.google.com/uc?export=view&id=FILE_ID` 형식으로 변환됩니다.

### 외부 이미지 호스팅:
- Imgur, Unsplash, Cloudinary 등의 공개 URL도 사용 가능
- HTTPS URL 권장

---

## ⚙️ Apps Script 배포

1. **Google Sheets 열기** (시험문제 스프레드시트)
2. **확장 프로그램** → **Apps Script**
3. `/testapp.gs.tsx` 파일 내용을 복사하여 붙여넣기
4. **배포** → **새 배포**
5. 설정:
   - 유형: **웹 앱**
   - 액세스 권한: **전체 사용자**
6. **배포** 클릭
7. 배포 URL 복사
8. `ExamQuestionUploader.tsx`의 `EXAM_API_URL`에 붙여넣기

---

## 🎬 사용 흐름

### 관리자 작업:
1. 관리자 대시보드 접속
2. "시험문제 일괄 등록" 섹션으로 이동
3. **샘플 파일 다운로드** (MD 또는 Excel)
4. 샘플을 참고하여 문제 작성
5. 파일 업로드
6. 자동 파싱 및 스프레드시트 등록
7. 성공 메시지 확인

### 시스템 처리:
1. **프론트엔드**: 파일 읽기 및 파싱
2. **프론트엔드**: JSON 배열로 변환
3. **Apps Script**: `bulkAddQuestions` 함수 호출
4. **Google Sheets**: 스프레드시트에 데이터 입력
5. **프론트엔드**: 성공 메시지 및 미리보기 표시

---

## 📊 Google Sheets 구조

업로드 후 스프레드시트:

| A열 (배점) | B열 (정답) | C열 (문제설명) | D열 (이미지URL) | E열~ (응시자) |
|-----------|----------|--------------|---------------|---------------|
| 1         | O        | 축제기획의... | https://...   | user@email... |
| 2         | X        | 축제 마케팅... |               | X             |
| 1         | O        | 안전관리는...  |               | O             |

---

## 🔧 커스터마이징

### 파싱 규칙 수정:
`ExamQuestionUploader.tsx`의 `parseMdFile()` 함수 수정

### UI 스타일 변경:
컴포넌트 내부의 Tailwind 클래스 수정

### Apps Script 로직:
`testapp.gs.tsx`의 `bulkAddQuestions()` 함수 수정

---

## ⚠️ 주의사항

1. **파일 크기**: 대용량 파일은 처리 시간이 길어질 수 있습니다 (권장: 100문제 이하)
2. **중복 방지**: 기존 문제를 삭제하지 않고 추가합니다
3. **이미지 권한**: Google Drive 이미지는 반드시 공유 권한 설정 필요
4. **정답 형식**: O 또는 X만 가능 (대소문자 구분 없음)
5. **인코딩**: MD 파일은 UTF-8 인코딩 권장

---

## 🐛 문제 해결

### 업로드 실패:
1. Apps Script가 배포되었는지 확인
2. API URL이 올바른지 확인
3. 브라우저 콘솔에서 에러 메시지 확인

### 이미지 표시 안됨:
1. Google Drive 공유 권한 확인
2. URL 형식 확인
3. CORS 문제 확인

### 파싱 오류:
1. 파일 형식 확인 (MD: 마크다운 문법, Excel: 열 순서)
2. 샘플 파일과 비교
3. 특수문자 사용 여부 확인

---

## ✨ 향후 개선 가능 사항

- [ ] CSV 파일 지원
- [ ] JSON 파일 지원
- [ ] 문제 수정/삭제 기능
- [ ] 문제 미리보기 강화
- [ ] 드래그 앤 드롭 지원
- [ ] 진행률 바 추가
- [ ] 에러 상세 로그

---

## 📞 문의

문제가 발생하면 다음을 확인하세요:
1. 브라우저 콘솔 (F12)
2. Apps Script 로그 (Apps Script 편집기 → 실행 로그)
3. Google Sheets 데이터

---

**완료!** 🎉

이제 관리자 대시보드에서 시험문제를 손쉽게 일괄 등록할 수 있습니다!

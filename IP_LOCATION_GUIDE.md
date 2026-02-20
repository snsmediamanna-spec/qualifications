# 📊 로그 시스템 - IP 위치 정보 가이드

> **국가/도시 정보가 "Unknown"으로 표시되는 문제 해결**

---

## 🎯 변경 사항

### 이전 (문제)
```typescript
// ipify API - IP 주소만 제공 ❌
fetch('https://api.ipify.org?format=json')
// 결과: { ip: "123.456.789.0" }
// 국가/도시 정보 없음 → Unknown으로 표시
```

### 현재 (해결)
```typescript
// ip-api.com - IP + 국가 + 도시 정보 제공 ✅
fetch('http://ip-api.com/json/')
// 결과:
// {
//   "status": "success",
//   "country": "South Korea",     ✅ 국가
//   "city": "Seoul",               ✅ 도시
//   "query": "123.456.789.0",      ✅ IP
//   "lat": 37.566,
//   "lon": 126.9784,
//   "isp": "Korea Telecom",
//   ...
// }
```

---

## 🔧 사용되는 API

### 0. **개발 환경 감지** ⭐

**자동 환경 감지**:
```typescript
// Figma, localhost, staging 등에서는 Mock 데이터 사용
if (hostname.includes('figma.com') || hostname === 'localhost') {
  return {
    ip: '127.0.0.1',
    country: 'South Korea',
    city: 'Seoul'
  };
}
```

**대상 도메인**:
- `localhost`
- `127.0.0.1`
- `*.figma.com`
- `*.fig.ma`
- `*dev*`
- `*staging*`

**효과**:
- ✅ 개발 중 에러 로그 없음
- ✅ API 호출 비용 절약
- ✅ Rate Limit 회피
- ✅ 오프라인 개발 가능

### 1. **ip-api.com** (프로덕션 주 API)

| 항목 | 설명 |
|------|------|
| **제공 정보** | IP 주소, 국가, 도시, ISP, 위도/경도 |
| **비용** | 무료 |
| **Rate Limit** | 분당 45회 (캐시로 해결) |
| **CORS** | 지원 ✅ |
| **API 키** | 불필요 |
| **URL** | `http://ip-api.com/json/` |

**응답 예시**:
```json
{
  "status": "success",
  "country": "South Korea",
  "countryCode": "KR",
  "region": "11",
  "regionName": "Seoul",
  "city": "Seoul",
  "zip": "03141",
  "lat": 37.566,
  "lon": 126.9784,
  "timezone": "Asia/Seoul",
  "isp": "Korea Telecom",
  "org": "Korea Telecom",
  "as": "AS4766 Korea Telecom",
  "query": "123.456.789.0"
}
```

### 2. **ipify API** (폴백)

| 항목 | 설명 |
|------|------|
| **제공 정보** | IP 주소만 |
| **비용** | 무료 |
| **Rate Limit** | 무제한 |
| **CORS** | 지원 ✅ |
| **API 키** | 불필요 |
| **URL** | `https://api.ipify.org?format=json` |

**사용 시점**: ip-api.com 실패 시 폴백

---

## 📋 로그 시트에 기록되는 정보

| 컬럼명 | 데이터 소스 | 예시 |
|--------|------------|------|
| **ip** | ip-api.com | `123.456.789.0` |
| **ipCountry** | ip-api.com | `South Korea` |
| **ipCity** | ip-api.com | `Seoul` |
| **geoLat** | Browser Geolocation API (선택적) | `37.566` |
| **geoLng** | Browser Geolocation API (선택적) | `126.9784` |
| **geoCountry** | BigDataCloud API (선택적) | `대한민국` |
| **locationMismatch** | IP vs GPS 비교 | `false` (VPN 감지) |

---

## 🔄 로그 수집 흐름

```
사용자 접속
    ↓
┌───────────────────────────────────┐
│  0. 환경 감지 ⭐                  │
│  Figma/localhost?                 │
│  → YES: Mock 데이터 반환          │
│  → NO: 실제 API 호출              │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│  1. IP 정보 가져오기              │
│  http://ip-api.com/json/          │
│  → IP, 국가, 도시                 │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│  2. GPS 위치 가져오기 (선택적)    │
│  navigator.geolocation            │
│  → 위도, 경도                     │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│  3. GPS → 국가명 변환 (선택적)    │
│  BigDataCloud API                 │
│  → GPS 기반 국가                  │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│  4. VPN 감지                      │
│  IP 국가 ≠ GPS 국가?             │
│  → locationMismatch: true         │
└───────────────────────────────────┘
    ↓
┌───────────────────────────────────┐
│  5. Google Sheets에 기록          │
│  security_logs 시트               │
└───────────────────────────────────┘
```

---

## 🚀 테스트 방법

### 개발 환경 (Figma/localhost)

**콘솔 메시지 확인**:
```
🔧 [개발 환경] Mock IP 정보 사용: { ip: "127.0.0.1", country: "South Korea", city: "Seoul" }
```

**특징**:
- ❌ 실제 API 호출 없음
- ✅ 에러 메시지 없음
- ✅ 항상 동일한 Mock 데이터 반환

### 프로덕션 환경

**브라우저 콘솔에서 확인**:

```javascript
// IP 위치 정보 확인
fetch('http://ip-api.com/json/')
  .then(res => res.json())
  .then(data => console.log('📍 IP 위치:', data));

// 결과:
// {
//   country: "South Korea",
//   city: "Seoul",
//   query: "123.456.789.0",
//   ...
// }
```

### 페이지 새로고침 후 확인

1. 웹사이트 새로고침
2. 브라우저 개발자 콘솔 열기 (F12)
3. 콘솔에서 다음 메시지 확인:
   ```
   📍 IP 위치 정보: { ip: "...", country: "...", city: "..." }
   ```
4. 5분 대기 (로그 배칭)
5. Google Sheets → `security_logs` 시트 확인
6. `ipCountry`, `ipCity` 컬럼에 정상 데이터 확인

---

## ⚠️ 주의사항

### 1. HTTP vs HTTPS 경고

ip-api.com은 무료 플랜에서 **HTTP만 지원**합니다.

```
⚠️ Mixed Content Warning
HTTPS 사이트에서 HTTP API 호출 시 브라우저가 차단할 수 있습니다.
```

**해결 방법**:
- 대부분의 브라우저는 허용하지만, 일부 차단 시 ipify로 폴백
- 프로덕션 환경: ip-api.com Pro ($13/월) → HTTPS 지원
- 또는 대체 API: ipapi.co (무료, HTTPS 지원)

### 2. Rate Limit

ip-api.com 무료 플랜:
- **분당 45회 제한**
- 캐시 사용으로 해결 (세션당 1회만 호출)

### 3. VPN 사용자

VPN 사용 시:
- IP 위치: VPN 서버 국가 (예: 미국)
- GPS 위치: 실제 사용자 국가 (예: 한국)
- `locationMismatch: true` → VPN 감지

---

## 🔧 트러블슈팅

### Q1. 여전히 "Unknown"으로 표시됩니다

**A. 다음을 확인하세요:**

1. **브라우저 콘솔 확인**:
   ```javascript
   // 에러 메시지가 있는지 확인
   console.log('IP 정보:', await getClientIPInfo());
   ```

2. **CORS 에러**:
   ```
   ❌ Access to fetch at 'http://ip-api.com/json/' has been blocked by CORS policy
   ```
   → 브라우저가 HTTP API 차단 중
   → 대체 API 사용 필요 (ipapi.co)

3. **API 응답 확인**:
   ```javascript
   fetch('http://ip-api.com/json/')
     .then(res => res.json())
     .then(data => console.log(data));
   ```

### Q2. Rate Limit 초과

```
❌ {"status":"fail","message":"Too Many Requests"}
```

**A. 캐시가 작동하는지 확인:**
- 페이지 새로고침해도 API는 1회만 호출되어야 함
- `cachedIPInfo` 변수가 캐시 역할

### Q3. 도시 정보가 부정확합니다

**A. IP 기반 위치는 대략적입니다:**
- ISP가 할당한 IP 블록의 위치
- 실제 위치와 ±50km 차이 가능
- GPS 위치가 더 정확 (사용자 동의 필요)

---

## 🌐 대체 API (선택사항)

### ipapi.co (유료지만 무료 플랜 있음)

| 항목 | 설명 |
|------|------|
| **장점** | HTTPS 지원, 더 정확한 정보 |
| **단점** | 일 1,000회 제한 (무료 플랜) |
| **URL** | `https://ipapi.co/json/` |

**사용 예시**:
```typescript
const response = await fetch('https://ipapi.co/json/');
const data = await response.json();
// {
//   "ip": "123.456.789.0",
//   "city": "Seoul",
//   "country_name": "South Korea",
//   ...
// }
```

### ipgeolocation.io (API 키 필요)

| 항목 | 설명 |
|------|------|
| **장점** | 매우 정확, 상세한 정보 |
| **단점** | API 키 필요, 월 1,000회 제한 (무료) |
| **URL** | `https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_KEY` |

---

## 📊 로그 시트 예시

| ip | ipCountry | ipCity | geoCountry | locationMismatch |
|----|-----------|--------|------------|------------------|
| 123.456.789.0 | South Korea | Seoul | 대한민국 | false |
| 98.76.54.32 | United States | New York | South Korea | **true** (VPN) |
| 203.0.113.1 | South Korea | Busan | 대한민국 | false |

---

## ✅ 체크리스트

- [x] 개발 환경 감지 (Figma/localhost) ⭐
- [x] ip-api.com API 적용
- [x] 캐시 시스템 구현
- [x] 폴백 API (ipify) 설정
- [x] GPS 위치 수집 (선택적)
- [x] VPN 감지 기능
- [x] 에러 핸들링
- [x] 콘솔 로그 출력 (디버깅용)
- [x] 개발 중 에러 메시지 제거

---

**마지막 업데이트**: 2026년 2월 12일  
**파일 위치**: `/src/app/utils/logger.ts`  
**관련 API**: ip-api.com, ipify.org, BigDataCloud
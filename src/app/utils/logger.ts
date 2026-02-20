// ==================== 로그 시스템 유틸리티 ====================

import { getCurrentUser } from '../../utils/auth';
import { logBatcher } from './log-batcher';

// ⚠️ 고급 추적 활성화 (VPN 감지, 브라우저 핑거프린팅 등)
const ADVANCED_TRACKING_ENABLED = true; // ✅ 고급 추적 활성화!

// ✅ 지연 로딩: advanced-tracker는 필요할 때만 import
let advancedTrackerModule: any = null;
async function getAdvancedTracker() {
  if (!advancedTrackerModule) {
    advancedTrackerModule = await import('./advanced-tracker');
  }
  return advancedTrackerModule;
}

// ✅ 한국 시간으로 포맷 (YYYY-MM-DD HH:mm:ss)
function getKSTTimestamp(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + (9 * 60 * 60 * 1000)); // UTC+9
  
  const year = kst.getUTCFullYear();
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const day = String(kst.getUTCDate()).padStart(2, '0');
  const hours = String(kst.getUTCHours()).padStart(2, '0');
  const minutes = String(kst.getUTCMinutes()).padStart(2, '0');
  const seconds = String(kst.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 로그 데이터 타입
export interface LogData {
  userId?: string; // 로그인한 경우에만
  ip?: string; // IP 주소
  ipCountry?: string; // IP 기반 국가
  ipCity?: string; // IP 기반 도시
  geoLat?: number; // GPS 위도
  geoLng?: number; // GPS 경도
  geoCountry?: string; // GPS 기반 국가
  locationMismatch?: boolean; // IP 위치와 GPS 위치 불일치 여부 (VPN 의심)
  userAgent?: string;
  location: string; // 현재 URL
  page: string; // 페이지 이름
  action: string; // 액션 (예: page_view, login, logout, button_click 등)
  alertType?: 'normal' | 'warning' | 'suspicious' | 'danger';
  details?: string; // 상세 정보
  sessionId?: string;
  timestamp?: string;
  advancedTracking?: any; // 고급 추적 데이터
}

// 세션 ID 생성 및 저장
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
}

// ✅ 클라이언트 IP 주소 가져오기 (간단한 무료 API 사용)
let cachedIPInfo: {
  ip: string;
  country: string;
  city: string;
} | null = null;

// 개발 환경 감지 (Figma, localhost 등)
function isDevelopmentEnvironment(): boolean {
  const hostname = window.location.hostname;
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('figma.com') ||
    hostname.includes('fig.ma') ||
    hostname.includes('dev') ||
    hostname.includes('staging')
  );
}

async function getClientIPInfo(): Promise<{ ip: string; country: string; city: string }> {
  if (cachedIPInfo) {
    return cachedIPInfo;
  }
  
  // ✅ 개발 환경에서는 Mock 데이터 반환 (API 호출 스킵)
  if (isDevelopmentEnvironment()) {
    cachedIPInfo = {
      ip: '127.0.0.1',
      country: 'South Korea',
      city: 'Seoul'
    };
    console.log('🔧 [개발 환경] Mock IP 정보 사용:', cachedIPInfo);
    return cachedIPInfo;
  }
  
  try {
    // ✅ ip-api.com 사용 (무료, CORS 지원, IP + 국가 + 도시 정보 제공)
    // 참고: 분당 45회 제한 있음 (캐시로 해결)
    const response = await fetch('http://ip-api.com/json/', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error('IP 조회 실패');
    }
    
    const data = await response.json();
    
    if (data.status === 'success') {
      cachedIPInfo = {
        ip: data.query || 'Unknown',
        country: data.country || 'Unknown',
        city: data.city || 'Unknown'
      };
      
      console.log('📍 IP 위치 정보:', cachedIPInfo);
      return cachedIPInfo;
    } else {
      // 실패 시 폴백: ipify로 IP만 가져오기
      const ipResponse = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(3000)
      });
      const ipData = await ipResponse.json();
      
      cachedIPInfo = {
        ip: ipData.ip || 'Unknown',
        country: 'Unknown',
        city: 'Unknown'
      };
      
      console.warn('⚠️ IP 위치 조회 실패, IP만 기록:', cachedIPInfo.ip);
      return cachedIPInfo;
    }
  } catch (error) {
    // 프로덕션에서도 실패 시 기본값 (에러 로그는 출력하지 않음)
    cachedIPInfo = {
      ip: 'Unknown',
      country: 'Unknown',
      city: 'Unknown'
    };
    return cachedIPInfo;
  }
}

// ✅ GPS 기반 실제 위치 정보 가져오기 (브라우저 Geolocation API)
let cachedGeoInfo: {
  lat: number;
  lng: number;
  country: string;
} | null = null;

async function getGeoLocation(): Promise<{ lat: number; lng: number; country: string } | null> {
  // 이미 캐시된 정보가 있으면 반환
  if (cachedGeoInfo) {
    return cachedGeoInfo;
  }

  // Geolocation API가 지원되지 않으면 null 반환
  if (!navigator.geolocation) {
    return null;
  }

  try {
    // GPS 좌표 가져오기 (사용자 동의 필요)
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
        enableHighAccuracy: false // 빠른 응답을 위해 정확도 낮춤
      });
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Reverse Geocoding: 좌표를 국가명으로 변환
    // BigDataCloud API 사용 (무료, API 키 불필요)
    const geoResponse = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ko`,
      { signal: AbortSignal.timeout(3000) }
    );
    const geoData = await geoResponse.json();
    
    cachedGeoInfo = {
      lat,
      lng,
      country: geoData.countryName || 'Unknown'
    };

    // console.log('📍 [Logger] GPS 기반 위치 정보:', cachedGeoInfo);
    return cachedGeoInfo;

  } catch (error) {
    // 사용자가 위치 권한 거부하거나 타임아웃 발생 시 null 반환
    // console.warn('⚠️ [Logger] GPS 위치 조회 실패 (권한 거부 또는 타임아웃):', error);
    return null;
  }
}

// ✅ 현재 로그인한 사용자 ID 가져오기
export function getCurrentUserId(): string | undefined {
  try {
    // 1차: getCurrentUser()로 시도 (토큰이 유효한 경우)
    const user = getCurrentUser();
    if (user && user.email) {
      // console.log('✅ [Logger] userId 가져오기 성공 (getCurrentUser):', user.email);
      return user.email;
    }
  } catch (error) {
    // getCurrentUser가 없거나 에러 발생 시 무시
  }
  
  // 2차: sessionStorage의 userInfo에서 가져오기 (로그인)
  try {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      if (user && user.email) {
        // console.log('✅ [Logger] userId 가져오기 성공 (userInfo):', user.email);
        return user.email;
      }
    }
  } catch (error) {
    // sessionStorage 접근 실패 시 무시
  }
  
  // 3차: sessionStorage의 authUser에서 가져오기 (회원가입)
  try {
    const authUser = sessionStorage.getItem('authUser');
    if (authUser) {
      const user = JSON.parse(authUser);
      if (user && user.email) {
        // console.log('✅ [Logger] userId 가져오기 성공 (authUser):', user.email);
        return user.email;
      }
    }
  } catch (error) {
    // sessionStorage 접근 실패 시 무시
  }
  
  // 4차: localStorage에서 가져오기 (자동 로그인)
  try {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      // console.log('✅ [Logger] userId 가져오기 성공 (localStorage):', storedEmail);
      return storedEmail;
    }
  } catch (error) {
    // localStorage 접근 실패 시 무시
  }
  
  // 5차: isLoggedIn이 true이고 userEmail이 있는지 확인 (하위 호환성)
  try {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userEmail = sessionStorage.getItem('userEmail');
    if (isLoggedIn === 'true' && userEmail) {
      // console.log('✅ [Logger] userId 가져오기 성공 (sessionStorage userEmail):', userEmail);
      return userEmail;
    }
  } catch (error) {
    // sessionStorage 접근 실패 시 무시
  }
  
  // ✅ userId가 없는 경우 (비회원) - 정상 동작
  // console.log('ℹ️ [Logger] 비회원 사용자입니다. userId 없이 기록됩니다.');
  return undefined;
}

// ✅ 로그 전송 (보안 로그는 즉시, 일반 로그는 배치)
export async function sendLog(logData: Partial<LogData>): Promise<void> {
  try {
    // ✅ requestIdleCallback으로 메인 스레드 블로킹 방지
    if ('requestIdleCallback' in window) {
      requestIdleCallback(async () => {
        await processSendLog(logData);
      }, { timeout: 2000 });
    } else {
      // 폴백: setTimeout 사용
      setTimeout(async () => {
        await processSendLog(logData);
      }, 0);
    }
  } catch (error) {
    // 로그 전송 실패는 무시 (사용자 경험에 영향 없도록)
  }
}

// 실제 로그 전송 처리
async function processSendLog(logData: Partial<LogData>): Promise<void> {
  try {
    // ✅ userId가 없으면 자동으로 현재 로그인한 사용자 ID 가져오기
    const userId = logData.userId || getCurrentUserId();
    
    // ✅ IP 주소 및 위치 정보 가져오기 (비동기, 블로킹 안함)
    const ipInfoPromise = getClientIPInfo();
    
    // ✅ GPS 기반 실제 위치 정보 가져오기 (비동기, 블로킹 안함)
    const geoInfoPromise = getGeoLocation();
    
    // 병렬로 처리
    const [ipInfo, geoInfo] = await Promise.all([
      ipInfoPromise.catch(() => ({ ip: 'Unknown', country: 'Unknown', city: 'Unknown' })),
      geoInfoPromise.catch(() => null)
    ]);
    
    const { ip, country, city } = ipInfo;
    
    const completeLogData: LogData = {
      location: window.location.href,
      page: window.location.pathname,
      action: 'page_view',
      alertType: 'normal',
      ...logData,
      userId, // ✅ 자동으로 가져온 userId 사용
      ip, // ✅ 클라이언트 IP 추가
      ipCountry: country, // ✅ 국가 정보 추가
      ipCity: city, // ✅ 도시 정보 추가
      geoLat: geoInfo?.lat, // ✅ GPS 위도 추가
      geoLng: geoInfo?.lng, // ✅ GPS 경도 추가
      geoCountry: geoInfo?.country, // ✅ GPS 기반 국가 추가
      locationMismatch: geoInfo ? (country !== geoInfo.country) : undefined, // ✅ IP 위치와 GPS 위치 불일치 여부 추가
      userAgent: navigator.userAgent,
      sessionId: getSessionId(),
      timestamp: getKSTTimestamp() // ✅ 한국 시간으로 포맷
    };

    // 고급 추적 데이터 추가 (지연 로딩)
    if (ADVANCED_TRACKING_ENABLED) {
      const tracker = await getAdvancedTracker();
      completeLogData.advancedTracking = await tracker.collectAdvancedTrackingData();
    }

    // ✅ 보안 로그(warning, suspicious, danger)는 즉시 전송
    if (logData.alertType && ['warning', 'suspicious', 'danger'].includes(logData.alertType)) {
      // 즉시 전송
      const LOG_API_URL = "https://script.google.com/macros/s/AKfycbzJWXv-jqpG01WvksSOovVlfILE7hDE0h2YB0Zs9sZLi8DewgTYP_FWr5ACA_5UZ4k/exec";
      
      await fetch(LOG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'batchLog',
          logs: [completeLogData],
          count: 1
        })
      });
    } else {
      // ✅ 일반 로그(page_view 등)는 배치 전송 (5분에 한 번)
      logBatcher.add(completeLogData);
    }
  } catch (error) {
    // 로그 전송 실패는 무시 (사용자 경험에 영향 없도록)
  }
}

// ==================== 편의 함수들 ====================

// 페이지 뷰 로그
export function logPageView(page: string, userId?: string): void {
  sendLog({
    userId,
    page,
    action: 'page_view',
    alertType: 'normal'
  });
}

// 로그인 성공 로그
export function logLogin(userId: string): void {
  sendLog({
    userId,
    action: 'login_success',
    alertType: 'normal',
    details: '로그인 성공'
  });
}

// 로그아웃 로그
export function logLogout(userId: string): void {
  sendLog({
    userId,
    action: 'logout',
    alertType: 'normal',
    details: '로그아웃'
  });
}

// 버튼 클릭 로그
export function logButtonClick(buttonName: string, userId?: string, details?: string): void {
  sendLog({
    userId,
    action: 'button_click',
    alertType: 'normal',
    details: `버튼 클릭: ${buttonName}${details ? ` (${details})` : ''}`
  });
}

// 영상 시청 로그
export function logVideoView(videoTitle: string, userId?: string): void {
  sendLog({
    userId,
    action: 'video_view',
    alertType: 'normal',
    details: `영상 시청: ${videoTitle}`
  });
}

// 시험 시작 로그
export function logExamStart(examCategory: string, userId?: string): void {
  sendLog({
    userId,
    action: 'exam_start',
    alertType: 'normal',
    details: `시험 시작: ${examCategory}`
  });
}

// 시험 제출 로그
export function logExamSubmit(examCategory: string, score: number, userId?: string): void {
  sendLog({
    userId,
    action: 'exam_submit',
    alertType: 'normal',
    details: `시험 제출: ${examCategory} (점수: ${score}점)`
  });
}

// 에러 로그
export function logError(errorMessage: string, userId?: string): void {
  sendLog({
    userId,
    action: 'error',
    alertType: 'warning',
    details: errorMessage
  });
}

// 의심스러운 행동 로그
export function logSuspicious(action: string, details: string, userId?: string): void {
  sendLog({
    userId,
    action,
    alertType: 'suspicious',
    details
  });
}

// 위험한 행동 로그
export function logDanger(action: string, details: string, userId?: string): void {
  sendLog({
    userId,
    action,
    alertType: 'danger',
    details
  });
}

// 수강신청 로그
export function logEnrollment(courseName: string, userId?: string): void {
  sendLog({
    userId,
    action: 'course_enrollment',
    alertType: 'normal',
    details: `수강신청: ${courseName}`
  });
}

// 진도 완료 로그
export function logProgressComplete(videoTitle: string, userId?: string): void {
  sendLog({
    userId,
    action: 'progress_complete',
    alertType: 'normal',
    details: `진도 완료: ${videoTitle}`
  });
}

// 검색 로그
export function logSearch(searchTerm: string, userId?: string): void {
  sendLog({
    userId,
    action: 'search',
    alertType: 'normal',
    details: `검색어: ${searchTerm}`
  });
}

// 파일 다운로드 로그
export function logFileDownload(fileName: string, userId?: string): void {
  sendLog({
    userId,
    action: 'file_download',
    alertType: 'normal',
    details: `파일 다운로드: ${fileName}`
  });
}

// 회원가입 로그
export function logSignup(userId: string): void {
  sendLog({
    userId,
    action: 'signup_success',
    alertType: 'normal',
    details: '회원가입 성공'
  });
}

// 비밀번호 변경 로그
export function logPasswordChange(userId: string): void {
  sendLog({
    userId,
    action: 'password_change',
    alertType: 'normal',
    details: '비밀번호 변경'
  });
}

// 프로필 업데이트 로그
export function logProfileUpdate(userId: string, field: string): void {
  sendLog({
    userId,
    action: 'profile_update',
    alertType: 'normal',
    details: `프로필 업데이트: ${field}`
  });
}

// 회원 탈퇴 로그
export function logWithdrawal(userId: string): void {
  sendLog({
    userId,
    action: 'account_withdrawal',
    alertType: 'warning',
    details: '회원 탈퇴'
  });
}
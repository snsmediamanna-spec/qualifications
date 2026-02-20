// ==================== 콘솔 열림 감지 시스템 ====================
// 개발자 도구 콘솔이 열리는 것을 감지하여 보안 로그 기록

import { getCurrentUserId } from './logger';

const LOG_API_URL = "https://script.google.com/macros/s/AKfycbzJWXv-jqpG01WvksSOovVlfILE7hDE0h2YB0Zs9sZLi8DewgTYP_FWr5ACA_5UZ4k/exec";

let isConsoleOpen = false;
let consoleOpenedAt: string | null = null;

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

// ✅ 클라이언트 IP 주소 가져오기 (간단한 무료 API 사용)
let cachedIPInfo: {
  ip: string;
  country: string;
  city: string;
} | null = null;

async function getClientIPInfo(): Promise<{ ip: string; country: string; city: string }> {
  if (cachedIPInfo) {
    return cachedIPInfo;
  }
  
  try {
    // ✅ ipify API 사용 (CORS 지원, 안정적, rate limit 없음)
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    const data = await response.json();
    cachedIPInfo = {
      ip: data.ip || 'Unknown',
      country: 'Unknown',
      city: 'Unknown'
    };
    return cachedIPInfo;
  } catch (error) {
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
  if (cachedGeoInfo) {
    return cachedGeoInfo;
  }

  if (!navigator.geolocation) {
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 5000,
        enableHighAccuracy: false
      });
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

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

    return cachedGeoInfo;
  } catch (error) {
    return null;
  }
}

// ✅ 콘솔 열림 감지 함수
function detectDevTools(): void {
  const threshold = 160; // 개발자 도구가 열렸을 때 차이
  
  // 방법 1: window 크기 차이로 감지
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  // 방법 2: Firebug 감지
  const isFirebugOpen = window.console && (window.console as any).firebug;
  
  if ((widthThreshold || heightThreshold || isFirebugOpen) && !isConsoleOpen) {
    isConsoleOpen = true;
    consoleOpenedAt = new Date().toISOString();
    
    // console.log('🚨 [보안] 개발자 도구 열림 감지!');
    
    // 보안 로그 즉시 전송
    sendConsoleOpenLog();
  } else if (!widthThreshold && !heightThreshold && !isFirebugOpen && isConsoleOpen) {
    isConsoleOpen = false;
    
    // console.log('ℹ️ [보안] 개발자 도구 닫힘');
    
    // 닫힘 로그도 기록
    sendConsoleCloseLog();
  }
}

// 🚨 콘솔 열림 로그 전송
async function sendConsoleOpenLog(): Promise<void> {
  // ✅ IP 주소 + 위치 정보 가져오기
  const { ip: clientIP, country: clientCountry, city: clientCity } = await getClientIPInfo();
  
  const securityLog = {
    location: window.location.href,
    page: window.location.pathname,
    action: 'devtools_opened',
    alertType: 'suspicious' as const,
    details: '개발자 도구(콘솔) 열림 감지',
    userAgent: navigator.userAgent,
    sessionId: sessionStorage.getItem('sessionId') || 'unknown',
    timestamp: getKSTTimestamp(),
    ip: clientIP,
    country: clientCountry,
    city: clientCity,
    userId: getCurrentUserId() || 'unknown'
  };
  
  fetch(LOG_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'batchLog',
      logs: [securityLog],
      count: 1
    })
  }).catch(() => {
    // 무시
  });
}

// ℹ️ 콘솔 닫힘 로그 전송
async function sendConsoleCloseLog(): Promise<void> {
  // ✅ IP 주소 + 위치 정보 가져오기
  const { ip: clientIP, country: clientCountry, city: clientCity } = await getClientIPInfo();
  
  const duration = consoleOpenedAt 
    ? Math.round((new Date().getTime() - new Date(consoleOpenedAt).getTime()) / 1000)
    : 0;
  
  const securityLog = {
    location: window.location.href,
    page: window.location.pathname,
    action: 'devtools_closed',
    alertType: 'normal' as const,
    details: `개발자 도구 닫힘 (사용 시간: ${duration}초)`,
    userAgent: navigator.userAgent,
    sessionId: sessionStorage.getItem('sessionId') || 'unknown',
    timestamp: getKSTTimestamp(),
    ip: clientIP,
    country: clientCountry,
    city: clientCity,
    userId: getCurrentUserId() || 'unknown'
  };
  
  fetch(LOG_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'batchLog',
      logs: [securityLog],
      count: 1
    })
  }).catch(() => {
    // 무시
  });
}

// ✅ 정기적으로 콘솔 열림 확인 (1초마다)
export function startConsoleDetection(): void {
  // 초기 체크
  detectDevTools();
  
  // 1초마다 체크
  setInterval(detectDevTools, 1000);
  
  // resize 이벤트에도 체크
  window.addEventListener('resize', detectDevTools);
  
  // console.log('🔍 [보안] 콘솔 감지 시스템 활성화됨');
}

// ✅ 콘솔 상태 확인
export function isDevToolsOpen(): boolean {
  return isConsoleOpen;
}
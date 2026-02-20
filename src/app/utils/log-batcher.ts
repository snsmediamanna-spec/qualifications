// ==================== 로그 배치 전송 시스템 ====================
// 로그를 모아서 한번에 전송하여 네트워크 부하 감소

import { getCurrentUserId } from './logger';

const LOG_API_URL = "https://script.google.com/macros/s/AKfycbzJWXv-jqpG01WvksSOovVlfILE7hDE0h2YB0Zs9sZLi8DewgTYP_FWr5ACA_5UZ4k/exec";

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
      country: 'Unknown', // ipify는 IP만 제공
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

interface LogData {
  location: string;
  page: string;
  action: string;
  alertType: 'normal' | 'warning' | 'critical' | 'suspicious' | 'danger';
  userId?: string;
  details?: string;
  userAgent: string;
  sessionId: string;
  timestamp: string;
  advancedTracking?: any;
  queuedAt?: string;
  ip?: string;
  ipCountry?: string;
  ipCity?: string;
  geoLat?: number;
  geoLng?: number;
  geoCountry?: string;
  locationMismatch?: boolean;
}

class LogBatcher {
  private queue: LogData[] = [];
  private readonly maxWaitTime = 300000; // ✅ 5분마다 전송 (5분 = 300,000ms)
  private timerId: number | null = null;
  private isFlushing = false;

  constructor() {
    // 주기적 전송 타이머 시작
    this.startTimer();

    // 페이지 종료 시 남은 로그 전송
    window.addEventListener('beforeunload', () => {
      this.flushSync();
    });

    // Visibility API - 탭이 숨겨질 때 전송
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flush();
      }
    });
  }

  // 로그 추가
  add(log: LogData): void {
    this.queue.push({
      ...log,
      queuedAt: new Date().toISOString()
    });
    
    // console.log('📝 [LogBatcher] 로그 추가됨:', {
    //   action: log.action,
    //   queueLength: this.queue.length,
    //   nextFlushIn: '5분'
    // });
  }

  // 큐에 쌓인 로그 비동기 전송
  async flush(): Promise<void> {
    if (this.queue.length === 0 || this.isFlushing) return;

    this.isFlushing = true;
    const batch = [...this.queue];
    this.queue = []; // 큐 비우기

    // console.log('📤 [LogBatcher] 로그 전송 시작:', {
    //   count: batch.length,
    //   url: LOG_API_URL
    // });

    try {
      const response = await fetch(LOG_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'batchLog',
          logs: batch,
          count: batch.length
        })
      });

      const result = await response.json();
      // console.log('✅ [LogBatcher] 로그 전송 성공:', result);
    } catch (error) {
      // console.error('❌ [LogBatcher] 로그 전송 실패:', error);
      // 실패 시 다시 큐에 추가 (최대 100개까지만)
      if (this.queue.length < 100) {
        this.queue.unshift(...batch);
        // console.log('🔄 [LogBatcher] 로그 재시도 대기열에 추가:', batch.length);
      }
    } finally {
      this.isFlushing = false;
    }
  }

  // 동기 전송 (페이지 종료 시)
  flushSync(): void {
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    // console.log('📤 [LogBatcher] 페이지 종료 - sendBeacon 전송:', batch.length);

    // sendBeacon API 사용 (비동기, 페이지 종료 시에도 전송 보장)
    const blob = new Blob([JSON.stringify({
      action: 'batchLog',
      logs: batch,
      count: batch.length
    })], { type: 'application/json' });

    navigator.sendBeacon(LOG_API_URL, blob);
    // console.log(success ? '✅ sendBeacon 성공' : '❌ sendBeacon 실패');
  }

  // 주기적 전송 타이머
  private startTimer(): void {
    this.timerId = window.setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.maxWaitTime);
  }

  // 타이머 정지 (테스트용)
  stopTimer(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // 현재 큐 상태 확인
  getQueueStatus(): { count: number; oldest: string | null } {
    return {
      count: this.queue.length,
      oldest: this.queue.length > 0 ? this.queue[0].queuedAt || null : null
    };
  }

  // ✅ 수동으로 즉시 전송 (테스트용)
  async forceFlush(): Promise<void> {
    console.log('🚀 [LogBatcher] 강제 즉시 전송 실행');
    
    if (this.queue.length === 0) {
      console.warn('⚠️ [LogBatcher] 전송할 로그가 없습니다.');
      return;
    }
    
    console.log(`📦 [LogBatcher] ${this.queue.length}개의 로그를 즉시 전송합니다...`);
    await this.flush();
    console.log('✅ [LogBatcher] 강제 전송 완료!');
  }
}

// 전역 인스턴스 생성 및 export
export const logBatcher = new LogBatcher();

// ✅ 브라우저 콘솔에서 디버깅 가능하도록 window 객체에 추가
if (typeof window !== 'undefined') {
  (window as any).logBatcher = logBatcher;
  
  // ✅ 편의 함수 추가 (콘솔에서 쉽게 사용) - 보안 로그 포함
  (window as any).flushLogs = async () => {
    // console.log('💨 즉시 로그 전송 실행...');
    
    // ✅ IP 주소 가져오기
    const { ip, country, city } = await getClientIPInfo();
    
    // ✅ userId 가져오기
    const userId = getCurrentUserId();
    
    // 🚨 콘솔에서 함수 실행 감지 - 보안 로그 기록
    const securityLog = {
      location: window.location.href,
      page: window.location.pathname,
      action: 'console_command_executed',
      alertType: 'suspicious' as const,
      details: '콘솔에서 flushLogs() 명령어 실행 감지',
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('sessionId') || 'unknown',
      timestamp: getKSTTimestamp(),
      ip,
      userId, // ✅ 로그인한 사용자 ID 추가
      ipCountry: country, // ✅ 국가 정보 추가
      ipCity: city // ✅ 도시 정보 추가
    };
    
    // 즉시 전송 (보안 로그)
    try {
      await fetch(LOG_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'batchLog',
          logs: [securityLog],
          count: 1
        })
      });
      // console.log('🚨 [보안] 콘솔 명령어 실행 기록됨 (User:', userId || '비회원', '/ IP:', ip + ')');
    } catch (error) {
      // console.error('보안 로그 전송 실패:', error);
    }
    
    await logBatcher.forceFlush();
  };
  
  (window as any).checkLogs = async () => {
    // ✅ IP 주소 가져오기
    const { ip, country, city } = await getClientIPInfo();
    
    // ✅ userId 가져오기
    const userId = getCurrentUserId();
    
    // 🚨 콘솔에서 함수 실행 감지 - 보안 로그 기록
    const securityLog = {
      location: window.location.href,
      page: window.location.pathname,
      action: 'console_command_executed',
      alertType: 'suspicious' as const,
      details: '콘솔에서 checkLogs() 명령어 실행 감지',
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('sessionId') || 'unknown',
      timestamp: getKSTTimestamp(),
      ip,
      userId, // ✅ 로그인한 사용자 ID 추가
      ipCountry: country, // ✅ 국가 정보 추가
      ipCity: city // ✅ 도시 정보 추가
    };
    
    // 즉시 전송 (보안 로그)
    fetch(LOG_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'batchLog',
        logs: [securityLog],
        count: 1
      })
    }).then(() => {
      // console.log('🚨 [보안] 콘솔 명령어 실행 기록됨 (User:', userId || '비회원', '/ IP:', ip + ')');
    }).catch(error => {
      // console.error('보안 로그 전송 실패:', error);
    });
    
    const status = logBatcher.getQueueStatus();
    console.log('📊 로그 큐 상태:', {
      대기중인_로그: `${status.count}개`,
      가장_오래된_로그: status.oldest || '없음',
      다음_자동전송: '5분 후'
    });
    return status;
  };
  
  // console.log('🔧 [LogBatcher] 디버깅 모드 활성화 - window.logBatcher 사용 가능');
  // console.log('💡 콘솔 명령어:');
  // console.log('  ✅ flushLogs()          : 즉시 전송');
  // console.log('  ✅ checkLogs()          : 큐 상태 확인');
  // console.log('  ✅ window.logBatcher.getQueueStatus() : 상세 상태');
  // console.log('⚠️  주의: 콘솔 명령어 사용은 보안 로그에 기록됩니다.');
}

// 타입 export
export type { LogData };
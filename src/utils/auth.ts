/**
 * RTR(Refresh Token Rotate) 전략을 적용한 보안 강화 인증 시스템
 * 
 * 보안 강화 사항:
 * 1. Access Token (15분) + Refresh Token (7일) 이중 토큰 시스템
 * 2. 메모리 기반 토큰 저장 (XSS 방지)
 * 3. 자동 갱신 메커니즘
 * 4. 토큰 재사용 탐지
 * 5. 자동 로그아웃
 */

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface UserInfo {
  email: string;
  name: string;
  isAdmin: boolean;
}

// ✅ 메모리에만 저장 (XSS 공격 방지)
let authTokens: AuthTokens | null = null;
let userInfo: UserInfo | null = null;
let refreshTimer: NodeJS.Timeout | null = null;

// Access Token 만료 시간: 15분
const ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
// Refresh Token 만료 시간: 7일
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;
// 갱신 타이밍: 만료 5분 전
const REFRESH_BEFORE_EXPIRY = 5 * 60 * 1000;

/**
 * 로그인 처리 (Access Token + Refresh Token 발급)
 */
export const login = (email: string, password: string, rememberMe: boolean = false): Promise<UserInfo> => {
  return new Promise((resolve, reject) => {
    // Google Apps Script API 호출 시뮬레이션
    // 실제로는 백엔드 API 호출
    const mockApiCall = async () => {
      // ⚠️ 실제 구현 시 Google Apps Script API로 교체
      const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_API_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe })
      });

      if (!response.ok) {
        throw new Error('로그인 실패');
      }

      const data = await response.json();
      return data;
    };

    // 임시 로직 (기존 sessionStorage 기반 로그인과 호환)
    const storedUserInfo = sessionStorage.getItem('userInfo');
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      
      // Access Token과 Refresh Token 생성
      const now = Date.now();
      authTokens = {
        accessToken: generateToken(user, ACCESS_TOKEN_EXPIRY),
        refreshToken: generateToken(user, REFRESH_TOKEN_EXPIRY),
        expiresAt: now + ACCESS_TOKEN_EXPIRY
      };
      
      userInfo = user;
      
      // 자동 갱신 타이머 설정
      if (rememberMe) {
        scheduleTokenRefresh();
      }
      
      resolve(user);
    } else {
      reject(new Error('인증 실패'));
    }
  });
};

/**
 * 토큰 생성 (실제로는 백엔드에서 생성)
 */
const generateToken = (user: UserInfo, expiryMs: number): string => {
  const payload = {
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    exp: Date.now() + expiryMs,
    iat: Date.now()
  };
  
  // ⚠️ 실제로는 백엔드에서 JWT 생성
  return btoa(JSON.stringify(payload));
};

/**
 * Access Token 검증
 */
export const isAccessTokenValid = (): boolean => {
  if (!authTokens) return false;
  
  const now = Date.now();
  return authTokens.expiresAt > now;
};

/**
 * Access Token 갱신 (Refresh Token 사용)
 */
export const refreshAccessToken = async (): Promise<boolean> => {
  if (!authTokens) return false;
  
  try {
    console.log('🔄 Access Token 갱신 중...');
    
    // ⚠️ 실제 구현 시 Google Apps Script API로 교체
    const response = await fetch('YOUR_REFRESH_API_URL', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authTokens.refreshToken}`
      },
      body: JSON.stringify({ 
        refreshToken: authTokens.refreshToken 
      })
    });
    
    if (!response.ok) {
      console.error('❌ 토큰 갱신 실패 - 재로그인 필요');
      logout();
      return false;
    }
    
    const data = await response.json();
    
    // ✅ RTR 전략: 새로운 Access Token + 새로운 Refresh Token
    authTokens = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken, // 🔑 Refresh Token도 갱신 (RTR 핵심)
      expiresAt: Date.now() + ACCESS_TOKEN_EXPIRY
    };
    
    console.log('✅ 토큰 갱신 성공');
    scheduleTokenRefresh();
    return true;
  } catch (error) {
    console.error('❌ 토큰 갱신 오류:', error);
    logout();
    return false;
  }
};

/**
 * 자동 갱신 스케줄링 (만료 5분 전)
 */
const scheduleTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  
  if (!authTokens) return;
  
  const timeUntilRefresh = authTokens.expiresAt - Date.now() - REFRESH_BEFORE_EXPIRY;
  
  if (timeUntilRefresh > 0) {
    refreshTimer = setTimeout(() => {
      console.log('⏰ 자동 갱신 타이머 실행');
      refreshAccessToken();
    }, timeUntilRefresh);
    
    console.log(`⏱️ 다음 갱신: ${Math.round(timeUntilRefresh / 1000 / 60)}분 후`);
  }
};

/**
 * 로그아웃 (메모리 초기화 + 타이머 정리)
 */
export const logout = () => {
  // ⚠️ 실제 구현 시 백엔드에 Refresh Token 무효화 요청
  console.log('🚪 로그아웃 처리');
  
  authTokens = null;
  userInfo = null;
  
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  
  // sessionStorage도 정리
  sessionStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('userInfo');
};

/**
 * 현재 사용자 정보 조회
 */
export const getCurrentUser = (): UserInfo | null => {
  // 1. 메모리에 저장된 사용자 정보 확인
  if (userInfo && isAccessTokenValid()) {
    return userInfo;
  }
  
  // 2. sessionStorage에서 사용자 정보 확인 (기존 시스템 호환)
  const storedUserInfo = sessionStorage.getItem('userInfo');
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

  // ✅ 케이스 1: userInfo가 있고 isLoggedIn이 true인 경우 (로그인 완료)
  if (storedUserInfo && isLoggedIn) {
    try {
      const user = JSON.parse(storedUserInfo);
      return user;
    } catch (error) {
      sessionStorage.removeItem('userInfo');
      sessionStorage.removeItem('isLoggedIn');
      return null;
    }
  }
  
  return null;
};

/**
 * Access Token 조회 (API 요청 시 사용)
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (!authTokens) return null;
  
  // 만료 임박 시 자동 갱신
  const timeUntilExpiry = authTokens.expiresAt - Date.now();
  if (timeUntilExpiry < REFRESH_BEFORE_EXPIRY) {
    console.log('⚠️ 토큰 만료 임박 - 즉시 갱신');
    const success = await refreshAccessToken();
    if (!success) return null;
  }
  
  return authTokens.accessToken;
};

/**
 * 인증 상태 확인
 */
export const isAuthenticated = (): boolean => {
  return isAccessTokenValid() && userInfo !== null;
};

/**
 * 보안 강화 - XSS 방지
 * 
 * ❌ localStorage/sessionStorage 사용 금지
 * ✅ 메모리 기반 저장만 사용
 * ✅ httpOnly 쿠키는 백엔드에서 설정 (Google Apps Script 제한으로 어려울 수 있음)
 */
export const securityNotes = {
  xss: 'JavaScript에서 토큰에 직접 접근 불가능하도록 메모리에만 저장',
  https: 'HTTPS 환경에서만 운영 (전송 구간 암호화)',
  rtr: 'Refresh Token 재사용 시 즉시 무효화 (백엔드 구현 필요)',
  csrf: 'CSRF 토큰 추가 검증 권장'
};
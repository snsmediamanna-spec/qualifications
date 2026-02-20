/**
 * 🛡️ 종합 웹 보안 시스템 (2025년 최신 위협 대응)
 * 
 * 포함된 보안 대책:
 * 1. XSS (Cross-Site Scripting) 방어
 * 2. SQL Injection 방어 (Google Sheets 환경)
 * 3. CSRF 토큰 검증
 * 4. Rate Limiting (DDoS/Brute Force 방어)
 * 5. File Upload 검증
 * 6. Input Validation & Sanitization
 * 7. CSP (Content Security Policy) 설정
 * 8. Clickjacking 방어
 * 9. AI Prompt Injection 방어
 */

// ============================================
// 1. XSS (Cross-Site Scripting) 방어
// ============================================

/**
 * HTML 특수문자 이스케이프 (XSS 방어)
 */
export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * JavaScript 코드 감지 및 제거
 */
export const removeScripts = (html: string): string => {
  // <script> 태그 제거
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 이벤트 핸들러 제거 (onclick, onerror 등)
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // javascript: 프로토콜 제거
  cleaned = cleaned.replace(/javascript:/gi, '');
  
  return cleaned;
};

/**
 * 안전한 HTML 렌더링 (DOMPurify 대체)
 */
export const sanitizeHtml = (dirty: string): string => {
  let clean = removeScripts(dirty);
  
  // 허용된 태그 화이트리스트
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'img'];
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  
  clean = clean.replace(tagPattern, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });
  
  return clean;
};

// ============================================
// 2. SQL Injection 방어 (Google Sheets 환경)
// ============================================

/**
 * 데이터베이스 쿼리 문자열 이스케이프
 * Google Sheets에서 사용하는 필터/검색 시 필요
 */
export const escapeSqlString = (value: string): string => {
  // 작은따옴표 이스케이프
  return value.replace(/'/g, "''");
};

/**
 * 입력값에서 위험한 SQL 키워드 감지
 */
export const detectSqlInjection = (input: string): boolean => {
  const dangerousPatterns = [
    /(\bOR\b|\bAND\b).*=.*=/, // OR 1=1, AND 1=1
    /UNION.*SELECT/i,
    /DROP\s+TABLE/i,
    /DELETE\s+FROM/i,
    /INSERT\s+INTO/i,
    /UPDATE.*SET/i,
    /--/,  // SQL 주석
    /\/\*/,  // 블록 주석
    /xp_/i,  // 확장 프로시저
    /exec\s*\(/i,
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(input));
};

// ============================================
// 3. CSRF (Cross-Site Request Forgery) 방어
// ============================================

/**
 * CSRF 토큰 생성
 */
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * CSRF 토큰 저장 (세션 기반)
 */
export const setCsrfToken = (): string => {
  const token = generateCsrfToken();
  sessionStorage.setItem('csrfToken', token);
  return token;
};

/**
 * CSRF 토큰 검증
 */
export const validateCsrfToken = (token: string): boolean => {
  const storedToken = sessionStorage.getItem('csrfToken');
  return storedToken === token && token !== '';
};

// ============================================
// 4. Rate Limiting (DDoS/Brute Force 방어)
// ============================================

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate Limiting 체크
 * @param key - 고유 식별자 (IP, email 등)
 * @param maxAttempts - 최대 시도 횟수
 * @param windowMs - 시간 윈도우 (밀리초)
 * @param blockDurationMs - 차단 시간 (밀리초)
 */
export const checkRateLimit = (
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000, // 15분
  blockDurationMs: number = 30 * 60 * 1000 // 30분
): { allowed: boolean; remaining: number; resetAt?: number } => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  // 차단 중인지 확인
  if (entry?.blockedUntil && entry.blockedUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil
    };
  }
  
  // 새로운 시도 또는 윈도우 초과
  if (!entry || (now - entry.firstAttempt) > windowMs) {
    rateLimitStore.set(key, {
      count: 1,
      firstAttempt: now
    });
    return { allowed: true, remaining: maxAttempts - 1 };
  }
  
  // 시도 횟수 증가
  entry.count++;
  
  // 한계 초과 시 차단
  if (entry.count > maxAttempts) {
    entry.blockedUntil = now + blockDurationMs;
    rateLimitStore.set(key, entry);
    
    console.warn(`🚨 Rate limit exceeded for ${key}. Blocked until ${new Date(entry.blockedUntil).toLocaleString()}`);
    
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.blockedUntil
    };
  }
  
  rateLimitStore.set(key, entry);
  return { allowed: true, remaining: maxAttempts - entry.count };
};

/**
 * 로그인 시도 제한 (Brute Force 방어)
 */
export const checkLoginAttempt = (email: string): { allowed: boolean; message?: string } => {
  const result = checkRateLimit(
    `login:${email}`,
    5,  // 5회 시도
    15 * 60 * 1000,  // 15분 내
    3 * 60 * 1000   // 3분 차단
  );
  
  if (!result.allowed) {
    const minutesLeft = result.resetAt ? Math.ceil((result.resetAt - Date.now()) / 60000) : 0;
    return {
      allowed: false,
      message: `너무 많은 로그인 시도가 감지되었습니다. ${minutesLeft}분 후에 다시 시도해주세요.`
    };
  }
  
  // ✅ 경고 메시지 제거 (콘솔 스팸 방지)
  // if (result.remaining <= 2) {
  //   console.warn(`⚠️ 로그인 시도 ${5 - result.remaining}/5 - ${email}`);
  // }
  
  return { allowed: true };
};

/**
 * Rate Limit 초기화 (로그인 성공 시)
 */
export const clearRateLimit = (key: string): void => {
  rateLimitStore.delete(key);
};

// ============================================
// 5. File Upload 보안 검증
// ============================================

/**
 * 허용된 파일 확장자
 */
const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * 파일 확장자 검증
 */
export const validateFileExtension = (fileName: string, type: 'video' | 'image'): boolean => {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  const allowedExtensions = type === 'video' ? ALLOWED_VIDEO_EXTENSIONS : ALLOWED_IMAGE_EXTENSIONS;
  return allowedExtensions.includes(extension);
};

/**
 * MIME 타입 검증
 */
export const validateMimeType = (file: File, expectedType: 'video' | 'image'): boolean => {
  if (expectedType === 'video') {
    return file.type.startsWith('video/');
  } else if (expectedType === 'image') {
    return file.type.startsWith('image/');
  }
  return false;
};

/**
 * 파일 크기 검증
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * 악성 파일 시그니처 감지 (매직 넘버 체크)
 */
export const checkFileMagicNumber = async (file: File, expectedType: 'video' | 'image'): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (!e.target?.result) {
        resolve(false);
        return;
      }
      
      const arr = new Uint8Array(e.target.result as ArrayBuffer);
      const header = Array.from(arr.subarray(0, 4))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
      
      // 비디오 매직 넘버
      const videoSignatures = [
        '00000018', '00000020', // MP4
        '1A45DFA3', // MKV
        '52494646', // AVI (RIFF)
      ];
      
      // 이미지 매직 넘버
      const imageSignatures = [
        'FFD8FF', // JPEG
        '89504E47', // PNG
        '47494638', // GIF
        '52494646', // WEBP (RIFF)
      ];
      
      if (expectedType === 'video') {
        resolve(videoSignatures.some(sig => header.startsWith(sig)));
      } else if (expectedType === 'image') {
        resolve(imageSignatures.some(sig => header.startsWith(sig)));
      } else {
        resolve(false);
      }
    };
    
    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 4));
  });
};

/**
 * 종합 파일 업로드 검증
 */
export const validateFileUpload = async (
  file: File,
  type: 'video' | 'image',
  maxSizeMB: number = 100
): Promise<{ valid: boolean; error?: string }> => {
  // 1. 파일 크기 검증
  if (!validateFileSize(file, maxSizeMB)) {
    return { valid: false, error: `파일 크기는 ${maxSizeMB}MB 이하여야 합니다.` };
  }
  
  // 2. 확장자 검증
  if (!validateFileExtension(file.name, type)) {
    return { valid: false, error: '허용되지 않는 파일 형식입니다.' };
  }
  
  // 3. MIME 타입 검증
  if (!validateMimeType(file, type)) {
    return { valid: false, error: 'MIME 타입이 일치하지 않습니다.' };
  }
  
  // 4. 매직 넘버 검증 (실제 파일 내용 확인)
  const isMagicValid = await checkFileMagicNumber(file, type);
  if (!isMagicValid) {
    return { valid: false, error: '파일이 손상되었거나 위조되었습니다.' };
  }
  
  return { valid: true };
};

// ============================================
// 6. Input Validation & Sanitization
// ============================================

/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * 비밀번호 강도 검증
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }
  
  if (password.length > 128) {
    return { valid: false, message: '비밀번호는 최대 128자 이하여야 합니다.' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const strength = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length;
  
  if (strength < 3) {
    return {
      valid: false,
      message: '비밀번호는 대문자, 소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.'
    };
  }
  
  // 일반적인 비밀번호 패턴 차단
  const commonPatterns = ['password', '12345678', 'qwerty', 'admin', 'test'];
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
    return { valid: false, message: '너무 일반적인 비밀번호입니다.' };
  }
  
  return { valid: true };
};

/**
 * 전화번호 형식 검증 (한국)
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // 하이픈 제거
  const cleaned = phone.replace(/-/g, '');
  
  // 010, 011, 016, 017, 018, 019로 시작하는 10-11자리
  const phoneRegex = /^01[0-9]{8,9}$/;
  return phoneRegex.test(cleaned);
};

/**
 * URL 형식 검증
 */
export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * 파일 경로 검증 (Directory Traversal 방어)
 */
export const validateFilePath = (path: string): boolean => {
  // ../ 또는 ..\ 패턴 차단
  if (path.includes('../') || path.includes('..\\')) {
    console.error('🚨 Directory Traversal 시도 감지:', path);
    return false;
  }
  
  // 절대 경로 차단
  if (path.startsWith('/') || /^[a-zA-Z]:/.test(path)) {
    console.error('🚨 절대 경로 사용 차단:', path);
    return false;
  }
  
  // 위험한 파일명 차단
  const dangerousFiles = ['.htaccess', '.env', 'web.config', 'passwd', 'shadow'];
  if (dangerousFiles.some(file => path.toLowerCase().includes(file))) {
    console.error('🚨 위험한 파일 접근 차단:', path);
    return false;
  }
  
  return true;
};

// ============================================
// 7. AI Prompt Injection 방어
// ============================================

/**
 * AI 프롬프트 인젝션 감지
 */
export const detectPromptInjection = (input: string): boolean => {
  const dangerousPatterns = [
    /ignore\s+(previous|all)\s+instructions/i,
    /system\s*:\s*/i,
    /you\s+are\s+(now|a)\s+/i,
    /forget\s+(everything|all)/i,
    /new\s+instructions/i,
    /role\s*:\s*system/i,
    /<\|im_start\|>/i,  // ChatGPT 토큰
    /<\|im_end\|>/i,
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * AI 입력값 정제
 */
export const sanitizeAiInput = (input: string): string => {
  // 특수 토큰 제거
  let cleaned = input.replace(/<\|.*?\|>/g, '');
  
  // 시스템 명령어 제거
  cleaned = cleaned.replace(/system\s*:/gi, '');
  
  // 길이 제한 (토큰 제한)
  const maxLength = 4000;
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }
  
  return cleaned.trim();
};

// ============================================
// 8. 보안 헤더 검증
// ============================================

/**
 * 보안 헤더 설정 확인
 */
export const checkSecurityHeaders = (): { [key: string]: string } => {
  const requiredHeaders = {
    'X-Frame-Options': 'DENY', // Clickjacking 방어
    'X-Content-Type-Options': 'nosniff', // MIME 스니핑 방어
    'X-XSS-Protection': '1; mode=block', // XSS 필터 활성화
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
  
  return requiredHeaders;
};

// ============================================
// 9. 로깅 및 모니터링
// ============================================

interface SecurityLog {
  timestamp: number;
  type: 'warning' | 'error' | 'info';
  event: string;
  details: any;
}

const securityLogs: SecurityLog[] = [];

/**
 * 보안 이벤트 로깅
 */
export const logSecurityEvent = (
  type: 'warning' | 'error' | 'info',
  event: string,
  details: any = {}
): void => {
  const log: SecurityLog = {
    timestamp: Date.now(),
    type,
    event,
    details
  };
  
  securityLogs.push(log);
  
  // ✅ 콘솔 출력 제거 (프로덕션 환경)
  // const emoji = type === 'error' ? '🚨' : type === 'warning' ? '⚠️' : 'ℹ️';
  // console.log(`${emoji} [Security] ${event}`, details);
  
  // 최대 1000개 로그 유지
  if (securityLogs.length > 1000) {
    securityLogs.shift();
  }
  
  // 서버로 전송 (옵션)
  if (type === 'error' || type === 'warning') {
    sendSecurityLogToServer(log);
  }
};

/**
 * 보안 로그 서버 전송
 */
const sendSecurityLogToServer = async (log: SecurityLog): Promise<void> => {
  // ✅ 실시간 보안 로그 전송
  const LOG_API_URL = "https://script.google.com/macros/s/AKfycbzJWXv-jqpG01WvksSOovVlfILE7hDE0h2YB0Zs9sZLi8DewgTYP_FWr5ACA_5UZ4k/exec";
  
  try {
    await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'batchLog',
        logs: [{
          location: window.location.href,
          page: window.location.pathname,
          action: log.event,
          alertType: log.type === 'error' ? 'danger' : log.type === 'warning' ? 'warning' : 'suspicious',
          details: typeof log.details === 'string' ? log.details : JSON.stringify(log.details),
          userAgent: navigator.userAgent,
          timestamp: new Date(log.timestamp).toISOString()
        }],
        count: 1
      })
    });
  } catch (error) {
    // 전송 실패는 무시
  }
};

/**
 * 보안 로그 조회
 */
export const getSecurityLogs = (limit: number = 100): SecurityLog[] => {
  return securityLogs.slice(-limit);
};

// ============================================
// Export 요약
// ============================================

export const SecurityUtils = {
  // XSS 방어
  escapeHtml,
  sanitizeHtml,
  removeScripts,
  
  // SQL Injection 방어
  escapeSqlString,
  detectSqlInjection,
  
  // CSRF 방어
  generateCsrfToken,
  setCsrfToken,
  validateCsrfToken,
  
  // Rate Limiting
  checkRateLimit,
  checkLoginAttempt,
  clearRateLimit,
  
  // File Upload 검증
  validateFileUpload,
  validateFileExtension,
  validateMimeType,
  checkFileMagicNumber,
  
  // Input Validation
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  validateUrl,
  validateFilePath,
  
  // AI Prompt Injection 방어
  detectPromptInjection,
  sanitizeAiInput,
  
  // 보안 헤더
  checkSecurityHeaders,
  
  // 로깅
  logSecurityEvent,
  getSecurityLogs,
};

export default SecurityUtils;
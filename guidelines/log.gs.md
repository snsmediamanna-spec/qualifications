// ==================== 설정 ====================

// ✅ 본인의 스프레드시트 ID로 변경하세요
const LOG_SPREADSHEET_ID = '1_X2OE80rB4U9Wt46uSKq8SUD5NSkMS2V80kRHpgD-4E';

// ✅ 관리자 이메일 설정 (보안 알림 수신)
const ADMIN_EMAILS = [
  'admin@example.com',  // ⚠️ 실제 관리자 이메일로 변경하세요
  // 'admin2@example.com', // 추가 관리자 (선택)
];

// ✅ 이메일 알림 설정
const EMAIL_CONFIG = {
  enabled: true,  // 이메일 알림 활성화
  minIntervalMinutes: 5,  // 같은 사용자의 중복 알림 방지 (5분 간격)
};

// 최근 알림 기록 (중복 방지용)
const recentAlerts = {};

// ==================== 스프레드시트 ====================

function getLogSpreadsheet() {
  try {
    return SpreadsheetApp.openById(LOG_SPREADSHEET_ID);
  } catch (error) {
    Logger.log('❌ 스프레드시트 열기 실패: ' + error.toString());
    throw new Error('스프레드시트를 열 수 없습니다.');
  }
}

// ==================== 유틸리티 ====================

// ✅ IP 주소와 위치 정보를 가져오는 함수 (CORS 및 Rate Limit 해결)
function getClientIPInfo() {
  try {
    // ✅ Apps Script에서 클라이언트 IP 주소 추출
    // doPost/doGet 요청 시 e.parameter 또는 UrlFetchApp 사용 불가
    // 대신 ipapi.co를 서버사이드에서 호출
    
    // ⚠️ 주의: Apps Script는 클라이언트 IP를 직접 가져올 수 없으므로
    // 프론트엔드에서 전달받은 데이터를 그대로 사용합니다.
    return {
      success: true,
      ip: 'server-side-unavailable', // Apps Script에서는 클라이언트 IP를 직접 가져올 수 없음
      country: 'Unknown',
      city: 'Unknown'
    };
  } catch (error) {
    Logger.log('❌ IP 정보 조회 실패: ' + error.toString());
    return {
      success: false,
      ip: 'Unknown',
      country: 'Unknown',
      city: 'Unknown'
    };
  }
}

function createJSONResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // Apps Script는 HTTP 응답 헤더를 직접 설정할 수 없습니다.
  // Web App으로 배포 시 자동으로 CORS가 허용됩니다.
  return output;
}

function formatTimestamp(date) {
  return Utilities.formatDate(date, 'Asia/Seoul', 'yyyy. M. d a h:mm:ss');
}

// ==================== 로그 시트 초기화 ====================

function initializeLogSheet() {
  try {
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('접속로그');
    
    if (!sheet) {
      sheet = ss.insertSheet('접속로그');
      
      // 헤더 설정
      sheet.appendRow([
        '타임스탬프',
        '사용자ID',
        'IP주소',
        'User Agent',
        '위치(URL)',
        '페이지',
        '액션',
        '경고수준',
        '상세내용',
        '세션ID',
        '국가',
        '디바이스'
      ]);
      
      // 헤더 스타일
      const headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setBackground('#d32f2f');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      headerRange.setVerticalAlignment('middle');
      
      // 열 너비 조정
      sheet.setColumnWidth(1, 150); // 타임스탬프
      sheet.setColumnWidth(2, 150); // 사용자ID
      sheet.setColumnWidth(3, 120); // IP주소
      sheet.setColumnWidth(4, 250); // User Agent
      sheet.setColumnWidth(5, 300); // 위치
      sheet.setColumnWidth(6, 150); // 페이지
      sheet.setColumnWidth(7, 150); // 액션
      sheet.setColumnWidth(8, 100); // 경고수준
      sheet.setColumnWidth(9, 300); // 상세내용
      sheet.setColumnWidth(10, 150); // 세션ID
      sheet.setColumnWidth(11, 100); // 국가
      sheet.setColumnWidth(12, 100); // 디바이스
      
      // 첫 행 고정
      sheet.setFrozenRows(1);
      
      Logger.log('✅ 접속로그 시트 생성 완료');
    }
    
    return sheet;
  } catch (error) {
    Logger.log('❌ 시트 초기화 실패: ' + error.toString());
    throw error;
  }
}

function initializeSecurityLogSheet() {
  try {
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('보안로그');
    
    if (!sheet) {
      sheet = ss.insertSheet('보안로그');
      
      // 헤더 설정
      sheet.appendRow([
        '타임스탬프',
        '사용자ID',
        'IP주소',
        '위협유형',
        '위협등급',
        '상세내용',
        '페이지',
        '조치사항'
      ]);
      
      // 헤더 스타일
      const headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setBackground('#ff6f00');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      
      // 열 너비
      sheet.setColumnWidth(1, 150);
      sheet.setColumnWidth(2, 150);
      sheet.setColumnWidth(3, 120);
      sheet.setColumnWidth(4, 150);
      sheet.setColumnWidth(5, 100);
      sheet.setColumnWidth(6, 400);
      sheet.setColumnWidth(7, 200);
      sheet.setColumnWidth(8, 200);
      
      sheet.setFrozenRows(1);
      
      Logger.log('✅ 보안로그 시트 생성 완료');
    }
    
    return sheet;
  } catch (error) {
    Logger.log('❌ 보안로그 시트 초기화 실패: ' + error.toString());
    throw error;
  }
}

// ==================== IP 정보 조회 (무료 API) ====================

function getIPInfo(ip) {
  try {
    if (!ip || ip === 'unknown') {
      return { country: 'Unknown', timezone: 'Unknown' };
    }
    
    const url = `http://ip-api.com/json/${ip}?fields=status,country,countryCode,timezone`;
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const data = JSON.parse(response.getContentText());
    
    if (data.status === 'success') {
      return {
        country: data.country || 'Unknown',
        countryCode: data.countryCode || 'Unknown',
        timezone: data.timezone || 'Unknown'
      };
    }
    
    return { country: 'Unknown', timezone: 'Unknown' };
  } catch (error) {
    Logger.log('⚠️ IP 정보 조회 실패: ' + error.toString());
    return { country: 'Unknown', timezone: 'Unknown' };
  }
}

// ==================== IP 차단 관리 ====================

// 차단IP 시트 초기화
function initializeBlockedIPSheet() {
  try {
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('차단IP');
    
    if (!sheet) {
      sheet = ss.insertSheet('차단IP');
      
      // 헤더 행 추가
      const headers = [
        'IP주소',
        '차단일시',
        '차단사유',
        '차단관리자',
        '국가',
        '마지막시도일시',
        '차단횟수'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 서식
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#dc2626');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      
      // 열 너비 조정
      sheet.setColumnWidth(1, 150); // IP주소
      sheet.setColumnWidth(2, 150); // 차단일시
      sheet.setColumnWidth(3, 300); // 차단사유
      sheet.setColumnWidth(4, 150); // 차단관리자
      sheet.setColumnWidth(5, 100); // 국가
      sheet.setColumnWidth(6, 150); // 마지막시도일시
      sheet.setColumnWidth(7, 100); // 차단횟수
      
      // 시트 보호 (헤더만)
      sheet.getRange(1, 1, 1, headers.length).protect()
        .setDescription('헤더 행 보호')
        .setWarningOnly(true);
      
      Logger.log('✅ 차단IP 시트 생성 완료');
    }
    
    return sheet;
  } catch (error) {
    Logger.log('❌ 차단IP 시트 초기화 실패: ' + error.toString());
    throw error;
  }
}

// IP 차단 확인
function isIPBlocked(ip) {
  try {
    if (!ip || ip === 'unknown') {
      return false;
    }
    
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('차단IP');
    
    if (!sheet) {
      return false; // 차단IP 시트가 없으면 차단 안 함
    }
    
    const data = sheet.getDataRange().getValues();
    
    // 헤더 제외하고 검색
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === ip) {
        // 차단된 IP 발견
        // 마지막 시도 일시와 차단 횟수 업데이트
        const now = new Date();
        const currentCount = data[i][6] || 0;
        sheet.getRange(i + 1, 6).setValue(formatTimestamp(now)); // 마지막시도일시
        sheet.getRange(i + 1, 7).setValue(currentCount + 1); // 차단횟수 증가
        
        Logger.log('🚫 차단된 IP 접근 시도: ' + ip);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    Logger.log('⚠️ IP 차단 확인 실패: ' + error.toString());
    return false; // 에러 시 차단 안 함 (서비스 중단 방지)
  }
}

// IP 차단 추가
function blockIP(ip, reason, adminEmail) {
  try {
    if (!ip || ip === 'unknown') {
      return { success: false, message: 'IP 주소가 유효하지 않습니다.' };
    }
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    const sheet = initializeBlockedIPSheet();
    
    // 이미 차단되어 있는지 확인
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === ip) {
        lock.releaseLock();
        return { success: false, message: '이미 차단된 IP입니다.' };
      }
    }
    
    // IP 정보 조회
    const ipInfo = getIPInfo(ip);
    
    // 새 행 추가
    const now = new Date();
    const newRow = [
      ip,
      formatTimestamp(now),
      reason || '관리자에 의한 차단',
      adminEmail || 'system',
      ipInfo.country || 'Unknown',
      '', // 마지막시도일시
      0   // 차단횟수
    ];
    
    sheet.appendRow(newRow);
    
    lock.releaseLock();
    
    Logger.log('✅ IP 차단 완료: ' + ip);
    
    return {
      success: true,
      message: 'IP 차단이 완료되었습니다.',
      ip: ip,
      country: ipInfo.country
    };
    
  } catch (error) {
    Logger.log('❌ IP 차단 실패: ' + error.toString());
    return { success: false, message: 'IP 차단 실패: ' + error.message };
  }
}

// IP 차단 해제
function unblockIP(ip) {
  try {
    if (!ip || ip === 'unknown') {
      return { success: false, message: 'IP 주소가 유효하지 않습니다.' };
    }
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('차단IP');
    
    if (!sheet) {
      lock.releaseLock();
      return { success: false, message: '차단IP 시트가 없습니다.' };
    }
    
    const data = sheet.getDataRange().getValues();
    
    // IP 찾아서 삭제
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === ip) {
        sheet.deleteRow(i + 1);
        lock.releaseLock();
        
        Logger.log('✅ IP 차단 해제 완료: ' + ip);
        
        return {
          success: true,
          message: 'IP 차단이 해제되었습니다.',
          ip: ip
        };
      }
    }
    
    lock.releaseLock();
    
    return { success: false, message: '차단 목록에 없는 IP입니다.' };
    
  } catch (error) {
    Logger.log('❌ IP 차단 해제 실패: ' + error.toString());
    return { success: false, message: 'IP 차단 해제 실패: ' + error.message };
  }
}

// 차단 IP 목록 조회
function getBlockedIPs() {
  try {
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('차단IP');
    
    if (!sheet) {
      // 시트가 없으면 초기화
      sheet = initializeBlockedIPSheet();
      return {
        success: true,
        blockedIPs: [],
        message: '차단된 IP가 없습니다.'
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return {
        success: true,
        blockedIPs: [],
        message: '차단된 IP가 없습니다.'
      };
    }
    
    const blockedIPs = [];
    
    // 헤더 제외하고 데이터 변환
    for (let i = 1; i < data.length; i++) {
      blockedIPs.push({
        ip: data[i][0],
        blockedAt: data[i][1],
        reason: data[i][2],
        blockedBy: data[i][3],
        country: data[i][4],
        lastAttempt: data[i][5],
        blockCount: data[i][6]
      });
    }
    
    return {
      success: true,
      blockedIPs: blockedIPs,
      count: blockedIPs.length
    };
    
  } catch (error) {
    Logger.log('❌ 차단 IP 목록 조회 실패: ' + error.toString());
    return { success: false, message: '차단 IP 목록 조회 실패: ' + error.message };
  }
}

// ==================== User Agent 파싱 ====================

function parseUserAgent(userAgent) {
  if (!userAgent) return 'Unknown';
  
  const ua = userAgent.toLowerCase();
  
  // 디바이스 판단
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    if (ua.includes('iphone')) return 'iPhone';
    if (ua.includes('ipad')) return 'iPad';
    if (ua.includes('android')) return 'Android';
    return 'Mobile';
  }
  
  if (ua.includes('mac')) return 'Mac';
  if (ua.includes('windows')) return 'Windows';
  if (ua.includes('linux')) return 'Linux';
  
  return 'Desktop';
}

// ==================== 서버에서 IP 주소 감지 ====================

/**
 * 클라이언트의 실제 IP 주소를 외부 API를 통해 감지
 * Google Apps Script는 직접적으로 요청자의 IP를 제공하지 않으므로
 * 외부 API를 호출하여 서버 관점에서 보이는 IP를 얻습니다.
 */
function detectClientIP() {
  try {
    // ipify API 사용 (무료, 빠름, 안정적)
    const response = UrlFetchApp.fetch('https://api.ipify.org?format=json', {
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const data = JSON.parse(response.getContentText());
      return data.ip || 'unknown';
    }
  } catch (error) {
    Logger.log('⚠️ IP 감지 실패 (ipify): ' + error.toString());
  }
  
  // 백업 API: ip.sb
  try {
    const response = UrlFetchApp.fetch('https://api.ip.sb/ip', {
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      return response.getContentText().trim() || 'unknown';
    }
  } catch (error) {
    Logger.log('⚠️ IP 감지 실패 (ip.sb): ' + error.toString());
  }
  
  return 'unknown';
}

// ==================== 로그 저장 ====================

function saveLog(logData) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    const ss = getLogSpreadsheet();
    
    // ✅ 서버에서 IP 주소 자동 감지 (클라이언트가 전송하지 않음)
    if (!logData.ip || logData.ip === 'unknown' || logData.ip === '') {
      logData.ip = detectClientIP();
      Logger.log('🌐 서버에서 IP 감지: ' + logData.ip);
    }
    
    // ✅ IP 차단 확인 (로그 저장 전에 먼저 확인)
    if (isIPBlocked(logData.ip)) {
      lock.releaseLock();
      Logger.log('🚫 차단된 IP 접근 거부: ' + logData.ip);
      
      // 차단된 IP 접근 시도를 보안로그에 기록
      saveSecurityLog({
        userId: logData.userId || '비회원',
        ip: logData.ip,
        userAgent: logData.userAgent,
        location: logData.location,
        page: logData.page,
        action: 'blocked_ip_access',
        alertType: 'danger',
        details: '차단된 IP 접근 시도',
        sessionId: logData.sessionId
      });
      
      return { 
        success: false, 
        message: '차단된 IP입니다.',
        blocked: true
      };
    }
    
    // ✅ HTTP 요청 및 콘솔 사용은 보안로그에만 저장
    const isSecurityOnlyLog = logData.action && (
      // HTTP 요청
      logData.action.startsWith('http_') || 
      logData.action === 'http_get' || 
      logData.action === 'http_post' || 
      logData.action === 'http_put' || 
      logData.action === 'http_delete' || 
      logData.action === 'http_patch' ||
      // 콘솔 사용
      logData.action === 'console_usage' ||
      // 개발자도구 관련
      logData.action === 'devtools_opened'
    );
    
    if (isSecurityOnlyLog) {
      // 보안로그에만 저장
      saveSecurityLog(logData);
      lock.releaseLock();
      Logger.log('✅ 보안 로그 저장 완료 (보안로그): ' + logData.action);
      return { success: true, message: '보안 로그 저장 완료 (보안로그)' };
    }
    
    // 일반 로그는 접속로그에 저장
    let sheet = ss.getSheetByName('접속로그');
    
    if (!sheet) {
      sheet = initializeLogSheet();
    }
    
    // IP 정보 조회 (옵션)
    let ipInfo = { country: 'Unknown' };
    if (logData.ip && logData.ip !== 'unknown') {
      ipInfo = getIPInfo(logData.ip);
    }
    
    // User Agent 파싱
    const device = parseUserAgent(logData.userAgent);
    
    // 로그 저장
    sheet.appendRow([
      formatTimestamp(new Date()),
      logData.userId || '비회원',
      logData.ip || 'unknown',
      logData.userAgent || '',
      logData.location || '',
      logData.page || '',
      logData.action || 'page_view',
      logData.alertType || 'normal',
      logData.details || '',
      logData.sessionId || '',
      ipInfo.country || 'Unknown',
      device
    ]);
    
    // 경고 수준에 따른 조건부 서식
    const lastRow = sheet.getLastRow();
    const alertCell = sheet.getRange(lastRow, 8);
    
    switch(logData.alertType) {
      case 'danger':
        alertCell.setBackground('#ffcdd2'); // 빨간색
        break;
      case 'warning':
        alertCell.setBackground('#fff9c4'); // 노란색
        break;
      case 'suspicious':
        alertCell.setBackground('#ffe0b2'); // 주황색
        break;
    }
    
    // 보안 이벤트면 보안로그에도 저장
    if (logData.alertType === 'danger' || logData.alertType === 'suspicious') {
      saveSecurityLog(logData);
    }
    
    lock.releaseLock();
    
    Logger.log('✅ 로그 저장 완료: ' + logData.action);
    return { success: true, message: '로그 저장 완료' };
    
  } catch (error) {
    Logger.log('❌ 로그 저장 실패: ' + error.toString());
    return { success: false, message: '로그 저장 실패: ' + error.message };
  }
}

function saveSecurityLog(logData) {
  try {
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('보안로그');
    
    if (!sheet) {
      sheet = initializeSecurityLogSheet();
    }
    
    // ✅ HTTP 요청 및 보안 이벤트 타입 매핑
    const threatType = {
      // HTTP 요청
      'http_get': 'HTTP GET 요청',
      'http_post': 'HTTP POST 요청',
      'http_put': 'HTTP PUT 요청',
      'http_delete': 'HTTP DELETE 요청',
      'http_patch': 'HTTP PATCH 요청',
      // 보안 이벤트
      'devtools_opened': '개발자도구 사용',
      'console_usage': '콘솔 코드 실행',
      'right_click_attempt': '우클릭 시도',
      'suspicious_api_call': '의심스러운 API 호출',
      'sql_injection_attempt': 'SQL Injection 시도',
      'xss_attempt': 'XSS 공격 시도',
      'multiple_failed_login': '로그인 실패 반복'
    };
    
    // ✅ 위협 등급 결정
    let threatLevel = '중간';
    if (logData.alertType === 'danger') {
      threatLevel = '높음';
    } else if (logData.alertType === 'warning') {
      threatLevel = '낮음';
    } else if (logData.alertType === 'normal') {
      threatLevel = '정보';
    }
    
    sheet.appendRow([
      formatTimestamp(new Date()),
      logData.userId || '비회원',
      logData.ip || 'unknown',
      threatType[logData.action] || logData.action,
      threatLevel,
      logData.details || '',
      logData.page || '',
      '자동 기록됨'
    ]);
    
    Logger.log('🔒 보안로그 저장 완료: ' + logData.action);
    
    // 이메일 알림 보내기
    if (EMAIL_CONFIG.enabled) {
      sendSecurityAlertEmail(logData);
    }
    
  } catch (error) {
    Logger.log('❌ 보안로그 저장 실패: ' + error.toString());
  }
}

function sendSecurityAlertEmail(logData) {
  try {
    const userId = logData.userId || '비회원';
    const ip = logData.ip || 'unknown';
    const threatType = logData.action;
    const threatLevel = logData.alertType;
    const details = logData.details || '';
    const page = logData.page || '';
    const timestamp = formatTimestamp(new Date());
    
    // 최근 알림 기록 확인
    const key = `${userId}-${ip}-${threatType}-${threatLevel}`;
    const lastAlertTime = recentAlerts[key];
    const currentTime = new Date();
    
    if (lastAlertTime && (currentTime - lastAlertTime) < (EMAIL_CONFIG.minIntervalMinutes * 60 * 1000)) {
      Logger.log(`⚠️ 중복 알림 방지: ${userId}의 ${threatType} 알림 건너뛰기`);
      return;
    }
    
    // 알림 기록 업데이트
    recentAlerts[key] = currentTime;
    
    // 이메일 내용 생성
    const subject = `보안 알림: ${threatLevel} 위협 감지 (${userId})`;
    const body = `
      <h1>보안 알림: ${threatLevel} 위협 감지</h1>
      <p><strong>사용자 ID:</strong> ${userId}</p>
      <p><strong>IP 주소:</strong> ${ip}</p>
      <p><strong>위협 유형:</strong> ${threatType}</p>
      <p><strong>위협 등급:</strong> ${threatLevel}</p>
      <p><strong>상세 내용:</strong> ${details}</p>
      <p><strong>페이지:</strong> ${page}</p>
      <p><strong>발생 시간:</strong> ${timestamp}</p>
    `;
    
    // 관리자 이메일로 알림 보내기
    ADMIN_EMAILS.forEach(email => {
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: body
      });
    });
    
    Logger.log(`📧 보안 알림 이메일 전송 완료: ${userId} (${threatType})`);
    
  } catch (error) {
    Logger.log('❌ 보안 알림 이메일 전송 실패: ' + error.toString());
  }
}

// ==================== 배치 로그 저장 ====================

function saveBatchLogs(logs) {
  try {
    Logger.log(`📦 배치 로그 저장 시작: ${logs.length}건`);
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    const ss = getLogSpreadsheet();
    let sheet = ss.getSheetByName('접속로그');
    let securitySheet = ss.getSheetByName('보안로그');
    
    if (!sheet) {
      sheet = initializeLogSheet();
    }
    
    if (!securitySheet) {
      securitySheet = initializeSecurityLogSheet();
    }
    
    const normalRows = [];
    const securityRows = [];
    
    for (let i = 0; i < logs.length; i++) {
      const logData = logs[i];
      const device = parseUserAgent(logData.userAgent);
      
      Logger.log(`📝 로그 ${i+1}/${logs.length}: action=${logData.action}, alertType=${logData.alertType}`);
      
      // ✅ HTTP 요청 및 콘솔 사용은 보안로그에만 저장
      const isSecurityOnlyLog = logData.action && (
        // HTTP 요청
        logData.action.startsWith('http_') || 
        logData.action === 'http_get' || 
        logData.action === 'http_post' || 
        logData.action === 'http_put' || 
        logData.action === 'http_delete' || 
        logData.action === 'http_patch' ||
        // 콘솔 사용
        logData.action === 'console_usage' ||
        // 개발자도구 관련
        logData.action === 'devtools_opened'
      );
      
      Logger.log(`🔍 보안 전용 로그 여부: ${isSecurityOnlyLog}`);
      
      if (isSecurityOnlyLog) {
        // 보안로그에만 추가
        const threatType = {
          'http_get': 'HTTP GET 요청',
          'http_post': 'HTTP POST 요청',
          'http_put': 'HTTP PUT 요청',
          'http_delete': 'HTTP DELETE 요청',
          'http_patch': 'HTTP PATCH 요청',
          'devtools_opened': '개발자도구 사용',
          'console_usage': '콘솔 코드 실행',
        };
        
        let threatLevel = '중간';
        if (logData.alertType === 'danger') threatLevel = '높음';
        else if (logData.alertType === 'warning') threatLevel = '낮음';
        else if (logData.alertType === 'normal') threatLevel = '정보';
        
        securityRows.push([
          new Date(logData.timestamp || new Date()),
          logData.userId || '비회원',
          logData.ip || 'unknown',
          threatType[logData.action] || logData.action,
          threatLevel,
          logData.details || '',
          logData.page || '',
          '자동 기록됨'
        ]);
        
        Logger.log(`🔒 보안로그 추가: ${logData.action}`);
      } else {
        // 일반 로그에 추가
        normalRows.push([
          new Date(logData.timestamp || new Date()),
          logData.userId || '비회원',
          logData.ip || 'unknown',
          logData.userAgent || '',
          logData.location || '',
          logData.page || '',
          logData.action || 'page_view',
          logData.alertType || 'normal',
          logData.details || '',
          logData.sessionId || '',
          'Unknown', // 배치에서는 IP 조회 생략 (성능 최적화)
          device
        ]);
        
        Logger.log(`📋 일반 로그 추가: ${logData.action}`);
        
        // 보안 이벤트면 보안로그에도 추가
        if (logData.alertType === 'danger' || logData.alertType === 'suspicious') {
          let threatLevel = '높음';
          if (logData.alertType === 'suspicious') threatLevel = '중간';
          
          securityRows.push([
            new Date(logData.timestamp || new Date()),
            logData.userId || '비회원',
            logData.ip || 'unknown',
            logData.action || 'unknown',
            threatLevel,
            logData.details || '',
            logData.page || '',
            '자동 기록됨'
          ]);
          
          Logger.log(`🚨 보안 이벤트도 추가: ${logData.action} (${logData.alertType})`);
        }
      }
    }
    
    // 일반 로그 배치 저장
    if (normalRows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, normalRows.length, 12).setValues(normalRows);
      Logger.log(`✅ 일반 로그 ${normalRows.length}건 저장 완료`);
    }
    
    // 보안 로그 배치 저장
    if (securityRows.length > 0) {
      securitySheet.getRange(securitySheet.getLastRow() + 1, 1, securityRows.length, 8).setValues(securityRows);
      Logger.log(`🔒 보안 로그 ${securityRows.length}건 저장 완료`);
    }
    
    lock.releaseLock();
    
    Logger.log(`✅ 배치 로그 저장 완료: 일반 ${normalRows.length}건 + 보안 ${securityRows.length}건 = 총 ${logs.length}건`);
    
    return { 
      success: true, 
      message: `${logs.length}건의 로그가 저장되었습니다.`,
      normalLogs: normalRows.length,
      securityLogs: securityRows.length
    };
    
  } catch (error) {
    Logger.log('❌ 배치 로그 저장 실패: ' + error.toString());
    return { success: false, message: '배치 로그 저장 실패: ' + error.message };
  }
}

// ==================== 통계 조회 ====================

function getLogStatistics(startDate, endDate) {
  try {
    const ss = getLogSpreadsheet();
    const sheet = ss.getSheetByName('접속로그');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: true, stats: {}, message: '로그가 없습니다.' };
    }
    
    const data = sheet.getDataRange().getValues();
    
    let totalLogs = 0;
    let uniqueUsers = new Set();
    let uniqueIPs = new Set();
    let actionCounts = {};
    let alertCounts = { normal: 0, warning: 0, suspicious: 0, danger: 0 };
    let deviceCounts = {};
    let countryCounts = {};
    
    for (let i = 1; i < data.length; i++) {
      const timestamp = new Date(data[i][0]);
      
      // 날짜 필터링
      if (startDate && timestamp < new Date(startDate)) continue;
      if (endDate && timestamp > new Date(endDate)) continue;
      
      totalLogs++;
      
      const userId = data[i][1];
      const ip = data[i][2];
      const action = data[i][6];
      const alertType = data[i][7];
      const country = data[i][10];
      const device = data[i][11];
      
      if (userId && userId !== '비회원') uniqueUsers.add(userId);
      if (ip && ip !== 'unknown') uniqueIPs.add(ip);
      
      actionCounts[action] = (actionCounts[action] || 0) + 1;
      alertCounts[alertType] = (alertCounts[alertType] || 0) + 1;
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    }
    
    return {
      success: true,
      stats: {
        totalLogs: totalLogs,
        uniqueUsers: uniqueUsers.size,
        uniqueIPs: uniqueIPs.size,
        actionCounts: actionCounts,
        alertCounts: alertCounts,
        deviceCounts: deviceCounts,
        countryCounts: countryCounts
      },
      message: '통계 조회 완료'
    };
    
  } catch (error) {
    Logger.log('❌ 통계 조회 실패: ' + error.toString());
    return { success: false, message: '통계 조회 실패: ' + error.message };
  }
}

// ==================== 보안 이벤트 조회 ====================

function getSecurityEvents(limit = 100) {
  try {
    const ss = getLogSpreadsheet();
    const sheet = ss.getSheetByName('보안로그');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: true, events: [], message: '보안 이벤트가 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const startRow = Math.max(2, lastRow - limit + 1);
    const rowCount = lastRow - startRow + 1;
    
    const data = sheet.getRange(startRow, 1, rowCount, 8).getValues();
    
    const events = data.map(row => ({
      timestamp: row[0],
      userId: row[1],
      ip: row[2],
      threatType: row[3],
      threatLevel: row[4],
      details: row[5],
      page: row[6],
      action: row[7]
    })).reverse();
    
    return {
      success: true,
      events: events,
      total: events.length,
      message: '보안 이벤트 조회 완료'
    };
    
  } catch (error) {
    Logger.log('❌ 보안 이벤트 조회 실패: ' + error.toString());
    return { success: false, message: '보안 이벤트 조회 실패: ' + error.message };
  }
}

// ==================== 오래된 로그 삭제 (3주) ====================

function deleteOldLogs() {
  try {
    Logger.log('🗑️ 오래된 로그 삭제 시작');
    
    const ss = getLogSpreadsheet();
    const logSheet = ss.getSheetByName('접속로그');
    const securitySheet = ss.getSheetByName('보안로그');
    
    // ✅ 3주(21일) 전 날짜 계산
    const threeWeeksAgo = new Date();
    threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
    
    let totalDeleted = 0;
    
    // 접속로그 시트에서 삭제
    if (logSheet && logSheet.getLastRow() > 1) {
      const deleted = deleteOldRowsFromSheet(logSheet, threeWeeksAgo);
      totalDeleted += deleted;
      Logger.log(`📋 접속로그: ${deleted}건 삭제`);
    }
    
    // 보안로그 시트에서 삭제
    if (securitySheet && securitySheet.getLastRow() > 1) {
      const deleted = deleteOldRowsFromSheet(securitySheet, threeWeeksAgo);
      totalDeleted += deleted;
      Logger.log(`🚨 보안로그: ${deleted}건 삭제`);
    }
    
    Logger.log(`✅ 총 ${totalDeleted}건의 오래된 로그 삭제 완료`);
    
    return {
      success: true,
      deletedCount: totalDeleted,
      cutoffDate: threeWeeksAgo,
      message: `3주(21일) 이상 된 ${totalDeleted}건의 로그가 삭제되었습니다.`
    };
    
  } catch (error) {
    Logger.log('❌ 로그 삭제 실패: ' + error.toString());
    return {
      success: false,
      message: '로그 삭제 실패: ' + error.message
    };
  }
}

function deleteOldRowsFromSheet(sheet, cutoffDate) {
  try {
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) return 0;
    
    const timestamps = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    
    let rowsToDelete = [];
    
    // 뒤에서부터 확인 (삭제 시 행 번호 변경 방지)
    for (let i = timestamps.length - 1; i >= 0; i--) {
      const timestamp = new Date(timestamps[i][0]);
      
      if (timestamp < cutoffDate) {
        rowsToDelete.push(i + 2); // +2는 헤더 행과 0-based 인덱스 보정
      }
    }
    
    // 행 삭제 (뒤에서부터)
    let deletedCount = 0;
    for (let i = 0; i < rowsToDelete.length; i++) {
      sheet.deleteRow(rowsToDelete[i]);
      deletedCount++;
      
      // 한 번에 너무 많이 삭제하면 시간 초과 방지 (최대 500개씩)
      if (deletedCount >= 500) {
        Logger.log(`⚠️ 한 번에 500개 삭제 제한 도달. 다음 실행 시 계속됩니다.`);
        break;
      }
    }
    
    return deletedCount;
    
  } catch (error) {
    Logger.log('❌ 행 삭제 실패: ' + error.toString());
    return 0;
  }
}

// ==================== 자동 삭제 트리거 설정 ====================

function setupAutoDeleteTrigger() {
  try {
    // 기존 트리거 삭제
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'deleteOldLogs') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // 매일 새벽 3시에 실행되는 트리거 생성
    ScriptApp.newTrigger('deleteOldLogs')
      .timeBased()
      .atHour(3)
      .everyDays(1)
      .create();
    
    Logger.log('✅ 자동 삭제 트리거 설정 완료 (매일 새벽 3시 실행)');
    
    return {
      success: true,
      message: '자동 삭제 트리거가 설정되었습니다. (매일 새벽 3시 실행)'
    };
    
  } catch (error) {
    Logger.log('❌ 트리거 설정 실패: ' + error.toString());
    return {
      success: false,
      message: '트리거 설정 실패: ' + error.message
    };
  }
}

function removeAutoDeleteTrigger() {
  try {
    const triggers = ScriptApp.getProjectTriggers();
    
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'deleteOldLogs') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    Logger.log('✅ 자동 삭제 트리거 제거 완료');
    
    return {
      success: true,
      message: '자동 삭제 트리거가 제거되었습니다.'
    };
    
  } catch (error) {
    Logger.log('❌ 트리거 제거 실패: ' + error.toString());
    return {
      success: false,
      message: '트리거 제거 실패: ' + error.message
    };
  }
}

// ==================== 최근 로그 조회 ====================

function getRecentLogs(limit = 100) {
  try {
    const ss = getLogSpreadsheet();
    const sheet = ss.getSheetByName('접속로그');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: true, logs: [], message: '로그가 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const startRow = Math.max(2, lastRow - limit + 1);
    const rowCount = lastRow - startRow + 1;
    
    const data = sheet.getRange(startRow, 1, rowCount, 12).getValues();
    
    const logs = data.map(row => ({
      timestamp: row[0],
      userId: row[1],
      ip: row[2],
      userAgent: row[3],
      location: row[4],
      page: row[5],
      action: row[6],
      alertType: row[7],
      details: row[8],
      sessionId: row[9],
      country: row[10],
      device: row[11]
    })).reverse();
    
    return {
      success: true,
      logs: logs,
      total: logs.length,
      message: '최근 로그 조회 완료'
    };
    
  } catch (error) {
    Logger.log('❌ 최근 로그 조회 실패: ' + error.toString());
    return { success: false, message: '최근 로그 조회 실패: ' + error.message };
  }
}

// ==================== doPost ====================

function doPost(e) {
  try {
    Logger.log('📥 POST 요청 받음 (로그 시스템)');
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    Logger.log('📥 액션: ' + action);
    
    // 단일 로그 저장
    if (action === 'saveLog') {
      return createJSONResponse(saveLog(data.log));
    }
    
    // ✅ 배치 로그 저장 (프론트엔드는 'batchLog'로 전송)
    if (action === 'batchLog' || action === 'saveBatchLogs') {
      return createJSONResponse(saveBatchLogs(data.logs));
    }
    
    // 통계 조회
    if (action === 'getStatistics') {
      return createJSONResponse(getLogStatistics(data.startDate, data.endDate));
    }
    
    // 보안 이벤트 조회
    if (action === 'getSecurityEvents') {
      return createJSONResponse(getSecurityEvents(data.limit || 100));
    }
    
    // 최근 로그 조회
    if (action === 'getRecentLogs') {
      return createJSONResponse(getRecentLogs(data.limit || 100));
    }
    
    // 오래된 로그 삭제
    if (action === 'deleteOldLogs') {
      return createJSONResponse(deleteOldLogs());
    }
    
    // 자동 삭제 트리거 설정
    if (action === 'setupAutoDeleteTrigger') {
      return createJSONResponse(setupAutoDeleteTrigger());
    }
    
    // 자동 삭제 트리거 제거
    if (action === 'removeAutoDeleteTrigger') {
      return createJSONResponse(removeAutoDeleteTrigger());
    }
    
    // ✅ IP 차단 관리 액션들
    
    // IP 차단 추가
    if (action === 'blockIP') {
      return createJSONResponse(blockIP(data.ip, data.reason, data.adminEmail));
    }
    
    // IP 차단 해제
    if (action === 'unblockIP') {
      return createJSONResponse(unblockIP(data.ip));
    }
    
    // 차단 IP 목록 조회
    if (action === 'getBlockedIPs') {
      return createJSONResponse(getBlockedIPs());
    }
    
    // ✅ IP 차단 확인 (클라이언트의 IP가 차단되어 있는지 확인)
    if (action === 'checkIPBlocked') {
      const clientIP = detectClientIP();
      const blocked = isIPBlocked(clientIP);
      
      Logger.log('🔍 IP 차단 확인 요청');
      Logger.log('📍 감지된 IP: ' + clientIP);
      Logger.log('🚫 차단 여부: ' + blocked);
      
      if (blocked) {
        Logger.log('🚫 차단된 IP 확인 요청: ' + clientIP);
      }
      
      return createJSONResponse({
        success: true,
        blocked: blocked,
        ip: clientIP
      });
    }
    
    return createJSONResponse({
      success: false,
      message: '알 수 없는 액션: ' + action
    });
    
  } catch (error) {
    Logger.log('❌ doPost 오류: ' + error.toString());
    return createJSONResponse({
      success: false,
      message: 'doPost 오류: ' + error.message
    });
  }
}

// ==================== doGet ====================

function doGet(e) {
  try {
    Logger.log('📥 GET 요청 받음 (로그 시스템)');
    
    const action = e.parameter.action;
    Logger.log('📥 액션: ' + action);
    
    // ✅ IP 차단 확인 (GET 방식)
    if (action === 'checkIPBlocked') {
      const clientIP = detectClientIP();
      const blocked = isIPBlocked(clientIP);
      
      Logger.log('🔍 IP 차단 확인 요청 (GET)');
      Logger.log('📍 감지된 IP: ' + clientIP);
      Logger.log('🚫 차단 여부: ' + blocked);
      
      if (blocked) {
        Logger.log('🚫 차단된 IP 확인 요청: ' + clientIP);
      }
      
      return createJSONResponse({
        success: true,
        blocked: blocked,
        ip: clientIP
      });
    }
    
    if (action === 'getStatistics') {
      return createJSONResponse(getLogStatistics());
    }
    
    if (action === 'getSecurityEvents') {
      return createJSONResponse(getSecurityEvents());
    }
    
    if (action === 'getRecentLogs') {
      return createJSONResponse(getRecentLogs());
    }
    
    return createJSONResponse({
      success: true,
      message: '로그 시스템 API가 정상적으로 작동 중입니다.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    Logger.log('❌ doGet 오류: ' + error.toString());
    return createJSONResponse({
      success: false,
      message: 'doGet 오류: ' + error.message
    });
  }
}

// ==================== 테스트 함수 ====================

function testSaveLog() {
  const testLog = {
    userId: 'test@example.com',
    ip: '123.456.789.0',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    location: 'https://newy.figma.site/',
    page: '/dashboard',
    action: 'page_view',
    alertType: 'normal',
    details: '테스트 로그',
    sessionId: 'test-session-123'
  };
  
  const result = saveLog(testLog);
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetStatistics() {
  const result = getLogStatistics();
  Logger.log(JSON.stringify(result, null, 2));
}

function testSecurityLog() {
  const testLog = {
    userId: 'hacker@example.com',
    ip: '123.456.789.999',
    userAgent: 'Mozilla/5.0',
    location: 'https://newy.figma.site/admin',
    page: '/admin',
    action: 'sql_injection_attempt',
    alertType: 'danger',
    details: "SELECT * FROM users WHERE '1'='1",
    sessionId: 'hacker-session'
  };
  
  const result = saveLog(testLog);
  Logger.log(JSON.stringify(result, null, 2));
}

// ==================== 로그 삭제 테스트 ====================

function testDeleteOldLogs() {
  const result = deleteOldLogs();
  Logger.log(JSON.stringify(result, null, 2));
}

function testSetupTrigger() {
  const result = setupAutoDeleteTrigger();
  Logger.log(JSON.stringify(result, null, 2));
}
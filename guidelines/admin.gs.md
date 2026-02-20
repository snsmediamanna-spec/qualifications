// ==================== 설정 ====================

const MAIN_FOLDER_ID = '1iD9_yEVx6k3glxbqH0e1dRtbssIr2TFb';
const VIDEO_FOLDER_ID = '1bUtUq022R-rjAeRparNs6vUNrXHkQsjB';
const IMAGE_FOLDER_ID = '1FGEIy2-_06GOjAsVyFdwiW6lkgKv82Et';

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec';

// ✅ 시험 시스템 웹앱 URL (새로 배포 후 여기 입력)
const EXAM_SYSTEM_URL = 'https://script.google.com/macros/s/AKfycbxKYxDp5_6ea8Bcf9mxQFli2kYHLXyKeSSnWP4YfWQwOnw3hSbqGvdFEamyHyA7ZhVY/exec';

const LECTURE_CATEGORIES = {
  'festival': '축제기획사',
  'event': '이벤트기획사',
  'performance': '공연기획사'
};

const SECURITY_CONFIG = {
  MAX_REQUEST_AGE: 5 * 60 * 1000,
  REQUIRE_TIMESTAMP: false
};

// ✅ 캐시 설정 (1시간 = 3600초)
const CACHE_CONFIG = {
  ENABLED: true,
  TTL: 3600, // 1시간
  // 캐시 제외 액션 (로그인, 회원가입 등 실시간 필요)
  EXCLUDED_ACTIONS: [
    'login',
    'register', 
    'getUserInfo',
    'updateUserInfo',
    'changePassword',
    'deleteAccount',
    'updateProgress',
    'enrollCourse',
    'updateNoticeViews',
    'submitExam'
  ]
};

// ==================== 캐시 시스템 ====================

/**
 * 캐시에서 데이터 조회
 */
function getCachedData(key) {
  if (!CACHE_CONFIG.ENABLED) return null;
  
  try {
    const cache = CacheService.getScriptCache();
    const cached = cache.get(key);
    
    if (cached) {
      Logger.log(`✅ 캐시 HIT: ${key}`);
      return JSON.parse(cached);
    }
    
    Logger.log(`❌ 캐시 MISS: ${key}`);
    return null;
  } catch (error) {
    Logger.log(`⚠️ 캐시 조회 실패: ${error.toString()}`);
    return null;
  }
}

/**
 * 캐시에 데이터 저장
 */
function setCachedData(key, data, ttl = CACHE_CONFIG.TTL) {
  if (!CACHE_CONFIG.ENABLED) return;
  
  try {
    const cache = CacheService.getScriptCache();
    const serialized = JSON.stringify(data);
    
    // Apps Script 캐시는 최대 100KB 제한
    if (serialized.length > 100000) {
      Logger.log(`⚠️ 캐시 데이터가 너무 큼 (${serialized.length} bytes), 저장 생략`);
      return;
    }
    
    cache.put(key, serialized, ttl);
    Logger.log(`✅ 캐시 저장: ${key} (TTL: ${ttl}초)`);
  } catch (error) {
    Logger.log(`⚠️ 캐시 저장 실패: ${error.toString()}`);
  }
}

/**
 * 캐시 무효화
 */
function invalidateCache(key) {
  try {
    const cache = CacheService.getScriptCache();
    cache.remove(key);
    Logger.log(`🗑️ 캐시 삭제: ${key}`);
  } catch (error) {
    Logger.log(`⚠️ 캐시 삭제 실패: ${error.toString()}`);
  }
}

/**
 * 모든 캐시 초기화 (관리자용)
 */
function clearAllCache() {
  try {
    const cache = CacheService.getScriptCache();
    cache.removeAll(['notices_all', 'videos_festival', 'videos_event', 'videos_performance']);
    Logger.log('✅ 모든 캐시가 초기화되었습니다.');
    return { success: true, message: '모든 캐시가 초기화되었습니다.' };
  } catch (error) {
    Logger.log('❌ 캐시 초기화 실패: ' + error.toString());
    return { success: false, message: '캐시 초기화 실패: ' + error.message };
  }
}

// ==================== 재시도 로직 (안정성 강화) ====================

/**
 * 재시도 로직이 적용된 작업 실행
 */
function executeWithRetry(operation, maxRetries = 3, delayMs = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 1) {
        Logger.log(`🔄 재시도 ${attempt}/${maxRetries}`);
      }
      return operation();
    } catch (error) {
      lastError = error;
      Logger.log(`⚠️ 시도 ${attempt} 실패: ${error.toString()}`);
      
      if (attempt < maxRetries) {
        Logger.log(`⏳ ${delayMs}ms 대기 후 재시도...`);
        Utilities.sleep(delayMs);
      }
    }
  }
  
  Logger.log(`❌ 모든 재시도 실패`);
  throw lastError;
}

// ==================== 스프레드시트 ====================

function getSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (error) {
    Logger.log('❌ 스프레드시트 열기 실패: ' + error.toString());
    throw new Error('스프레드시트를 열 수 없습니다.');
  }
}

// ==================== 유틸리티 함수 ====================

function createJSONResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function hashPassword(password) {
  try {
    const rawHash = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      password,
      Utilities.Charset.UTF_8
    );
    
    let hashString = '';
    for (let i = 0; i < rawHash.length; i++) {
      let byte = rawHash[i];
      if (byte < 0) byte += 256;
      let byteString = byte.toString(16);
      if (byteString.length === 1) byteString = '0' + byteString;
      hashString += byteString;
    }
    
    return hashString;
  } catch (error) {
    throw new Error('비밀번호 해시 생성 실패: ' + error.message);
  }
}

function verifyPassword(password, hash) {
  try {
    const inputHash = hashPassword(password);
    return inputHash === hash;
  } catch (error) {
    throw new Error('비밀번호 검증 실패: ' + error.message);
  }
}

function validateRequest(data) {
  if (SECURITY_CONFIG.REQUIRE_TIMESTAMP) {
    const timestampValidation = validateTimestamp(data.timestamp);
    if (!timestampValidation.valid) {
      return { valid: false, message: timestampValidation.message };
    }
  }
  return { valid: true };
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==================== 시험 시스템 프록시 함수 ====================

function callExamSystem(action, data) {
  try {
    const payload = {
      action: action,
      ...data
    };
    
    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(EXAM_SYSTEM_URL, options);
    const result = JSON.parse(response.getContentText());
    
    return result;
  } catch (error) {
    Logger.log('❌ 시험 시스템 호출 실패: ' + error.toString());
    return { 
      success: false, 
      message: '시험 시스템 연결 실패: ' + error.message 
    };
  }
}

// ==================== 회원 관리 ====================

function registerMember(data) {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('회원목록');
    
    if (!sheet) sheet = initializeMemberSheet();
    
    if (!data.email || !data.password) {
      throw new Error('이메일과 비밀번호는 필수 입력 항목입니다.');
    }
    
    const lastRow = sheet.getLastRow();
    const memberNumber = 'M' + String(lastRow).padStart(5, '0');
    
    if (lastRow > 1) {
      const emails = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
      const isDuplicate = emails.some(row => row[0] === data.email);
      if (isDuplicate) throw new Error('이미 등록된 이메일입니다.');
    }
    
    const passwordHash = hashPassword(data.password);
    const memberGrade = data.memberGrade || '일반';
    const isAdmin = memberGrade === '관리자';
    
    sheet.appendRow([
      memberNumber, new Date(), data.name || '', data.email || '',
      passwordHash, data.phone || '', data.birthdate || '', data.gender || '',
      data.address || '', data.joinRoute || '직접가입', memberGrade, '활성',
      new Date(), 0, 0, 0, '미응시', '', '', data.memo || '',
      'N', 'N', 'N'
    ]);
    
    Logger.log('✅ 회원 등록 완료: ' + memberNumber);
    
    return {
      success: true,
      memberNumber: memberNumber,
      isAdmin: isAdmin,
      message: '회원 등록이 완료되었습니다.'
    };
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    throw new Error('회원 등록 실패: ' + error.message);
  }
}

function loginMember(email, password) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      throw new Error('등록된 회원이 없습니다.');
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 23).getValues();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (row[3] === email) {
        const storedHash = row[4];
        
        if (verifyPassword(password, storedHash)) {
          if (row[11] !== '활성') {
            throw new Error('비활성화된 계정입니다.');
          }
          
          sheet.getRange(i + 2, 13).setValue(new Date());
          
          Logger.log('✅ 로그인 성공: ' + email);
          
          // ✅ memberGrade를 기반으로 isAdmin 플래그 추가
          const isAdmin = (row[10] === '관리자');
          
          return {
            success: true,
            memberNumber: row[0],
            name: row[2],
            email: row[3],
            memberGrade: row[10],
            isAdmin: isAdmin, // ✅ 관리자 여부 추가
            festivalProgress: row[13],
            eventProgress: row[14],
            performanceProgress: row[15],
            certExamStatus: row[16],
            message: '로그인 성공'
          };
        } else {
          throw new Error('비밀번호가 일치하지 않습니다.');
        }
      }
    }
    
    throw new Error('등록되지 않은 이메일입니다.');
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    throw new Error('로그인 실패: ' + error.message);
  }
}

function getUserInfo(email) {
  try {
    Logger.log('👤 회원정보 조회: ' + email);
    
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: '등록된 회원이 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 23).getValues();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (row[3] === email) {
        return {
          success: true,
          memberNumber: row[0] || '',
          joinDate: row[1] ? formatDate(row[1]) : '',
          name: row[2] || '',
          email: row[3] || '',
          phone: row[5] || '',
          birthdate: row[6] || '',
          gender: row[7] || '',
          address: row[8] || '',
          joinRoute: row[9] || '',
          memberGrade: row[10] || '일반',
          status: row[11] || '',
          lastLogin: row[12] ? formatDate(row[12]) : '',
          festivalProgress: row[13] || 0,
          eventProgress: row[14] || 0,
          performanceProgress: row[15] || 0,
          certExamStatus: row[16] || '미응시',
          certExamDate: row[17] || '',
          certExamResult: row[18] || '',
          memo: row[19] || '',
          festivalEnrolled: row[20] || 'N',
          eventEnrolled: row[21] || 'N',
          performanceEnrolled: row[22] || 'N',
          message: '회원정보 조회 성공'
        };
      }
    }
    
    return { success: false, message: '등록되지 않은 이메일입니다.' };
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { success: false, message: '회원정보 조회 실패: ' + error.message };
  }
}

// ✅ Q&A 시스템용: 관리자 권한 확인 함수
function checkAdminByEmail(email) {
  try {
    Logger.log('🔍 관리자 권한 확인: ' + email);
    
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { 
        success: false, 
        isAdmin: false, 
        message: '등록된 회원이 없습니다.' 
      };
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 11).getValues();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (row[3] === email) {
        const memberGrade = row[10] || '일반';
        const isAdmin = (memberGrade === '관리자');
        
        Logger.log('✅ 권한 확인 완료: ' + email + ' → ' + (isAdmin ? '관리자' : '일반'));
        
        return {
          success: true,
          isAdmin: isAdmin,
          memberGrade: memberGrade,
          message: '권한 확인 완료'
        };
      }
    }
    
    return { 
      success: false, 
      isAdmin: false, 
      message: '등록되지 않은 이메일입니다.' 
    };
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { 
      success: false, 
      isAdmin: false, 
      message: '권한 확인 실패: ' + error.message 
    };
  }
}

function updateUserInfo(data) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: '회원 목록이 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const rows = sheet.getRange(2, 1, lastRow - 1, 23).getValues();
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      if (row[3] === data.email) {
        const rowNumber = i + 2;
        
        if (data.name !== undefined) {
          sheet.getRange(rowNumber, 3).setValue(data.name);
        }
        
        if (data.phone !== undefined) {
          sheet.getRange(rowNumber, 6).setValue(data.phone);
        }
        
        return { success: true, message: '회원정보가 수정되었습니다.' };
      }
    }
    
    return { success: false, message: '해당 이메일의 회원을 찾을 수 없습니다.' };
  } catch (error) {
    return { success: false, message: '회원정보 수정 실패: ' + error.message };
  }
}

function changePassword(email, currentPassword, newPassword) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: '회원 목록이 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 23).getValues();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (row[3] === email) {
        const rowNumber = i + 2;
        const storedHash = row[4];
        
        if (!verifyPassword(currentPassword, storedHash)) {
          return { success: false, message: '현재 비밀번호가 일치하지 않습니다.' };
        }
        
        const newPasswordHash = hashPassword(newPassword);
        sheet.getRange(rowNumber, 5).setValue(newPasswordHash);
        
        return { success: true, message: '비밀번호가 변경되었습니다.' };
      }
    }
    
    return { success: false, message: '해당 이메일의 회원을 찾을 수 없습니다.' };
  } catch (error) {
    return { success: false, message: '비밀번호 변경 실패: ' + error.message };
  }
}

function deleteAccount(email, password) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: false, message: '회원 목록이 없습니다.' };
    }
    
    // 백업 시트 확인 또는 생성
    let backupSheet = ss.getSheetByName('탈퇴회원백업');
    if (!backupSheet) {
      backupSheet = ss.insertSheet('탈퇴회원백업');
      // 백업 시트 헤더 설정
      const headers = sheet.getRange(1, 1, 1, 23).getValues()[0];
      const backupHeaders = headers.concat(['탈퇴일시', '탈퇴사유']);
      backupSheet.getRange(1, 1, 1, backupHeaders.length).setValues([backupHeaders]);
      
      // 헤더 스타일 복사
      const headerRange = backupSheet.getRange(1, 1, 1, backupHeaders.length);
      headerRange.setBackground('#6cb25b');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 23).getValues();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      if (row[3] === email) {
        const rowNumber = i + 2;
        const storedHash = row[4];
        
        // 비밀번호 검증
        if (!verifyPassword(password, storedHash)) {
          return { success: false, message: '비밀번호가 일치하지 않습니다.' };
        }
        
        // 백업 시트로 데이터 복사
        const backupRow = row.concat([new Date(), '사용자 탈퇴 요청']);
        backupSheet.appendRow(backupRow);
        
        // 원본 시트에서 행 삭제
        sheet.deleteRow(rowNumber);
        
        Logger.log('✅ 회원 탈퇴 완료: ' + email);
        return { success: true, message: '회원 탈퇴가 완료되었습니다.' };
      }
    }
    
    return { success: false, message: '해당 이메일의 회원을 찾을 수 없습니다.' };
  } catch (error) {
    Logger.log('❌ 회원 탈퇴 오류: ' + error.toString());
    return { success: false, message: '회원 탈퇴 처리 실패: ' + error.message };
  }
}

function getAllUsers() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: true, users: [], total: 0, message: '등록된 회원이 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 23).getValues();
    
    const users = data.map(row => ({
      id: row[0],
      timestamp: row[1],
      name: row[2],
      email: row[3],
      phone: row[5],
      birthDate: row[6],
      gender: row[7],
      address: row[8],
      joinRoute: row[9],
      memberGrade: row[10] || '일반',
      status: row[11] || '활성',
      joinDate: row[12],
      festivalProgress: row[13] || 0,
      eventProgress: row[14] || 0,
      performanceProgress: row[15] || 0,
      certExamStatus: row[16],
      certExamDate: row[17],
      certExamResult: row[18],
      memo: row[19],
      festivalEnrolled: row[20] || 'N',
      eventEnrolled: row[21] || 'N',
      performanceEnrolled: row[22] || 'N'
    }));
    
    return { success: true, users: users, total: users.length, message: '회원 목록 조회 성공' };
  } catch (error) {
    return { success: false, users: [], total: 0, message: '회원 목록 조회 실패: ' + error.message };
  }
}

function updateUserInfoByAdmin(userId, field, value) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      throw new Error('회원 목록이 없습니다.');
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 23).getValues();
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowEmail = row[3];
      const rowId = row[0];
      
      if (rowEmail === userId || rowId === userId) {
        const rowNumber = i + 2;
        
        let columnToUpdate;
        switch(field) {
          case 'memberGrade': columnToUpdate = 11; break;
          case 'status':
            columnToUpdate = 12;
            if (value === 'active') value = '활성';
            if (value === 'inactive') value = '비활성';
            break;
          case 'festivalProgress': columnToUpdate = 14; break;
          case 'eventProgress': columnToUpdate = 15; break;
          case 'performanceProgress': columnToUpdate = 16; break;
          default: throw new Error('지원하지 않는 필드입니다: ' + field);
        }
        
        sheet.getRange(rowNumber, columnToUpdate).setValue(value);
        
        return { success: true, message: '회원 정보가 업데이트되었습니다.' };
      }
    }
    
    throw new Error('해당 회원을 찾을 수 없습니다.');
  } catch (error) {
    return { success: false, message: '회원 정보 업데이트 실패: ' + error.message };
  }
}

// ==================== 공지사항 관리 ====================

function getNotices() {
  const cacheKey = 'notices_all';
  
  // ✅ 캐시 조회
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }
  
  // ✅ 캐시 없으면 DB 조회 (재시도 로직 적용)
  const result = executeWithRetry(() => {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('공지사항');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return { success: true, notices: [], message: '등록된 공지사항이 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const data = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
    
    const notices = data.map((row, index) => ({
      rowNumber: index + 2,
      id: index + 2,
      number: row[0],
      createdAt: row[1],
      title: row[2],
      content: row[3],
      author: row[4],
      category: row[5],
      views: row[6] || 0,
      isPinned: row[7] === true || row[7] === 'TRUE' || row[7] === '고정',
      status: row[8],
      startDate: row[9],
      endDate: row[10],
      imageUrl: row[11] || '',
      images: row[11] ? String(row[11]).split('\n').filter(url => url.trim()) : [],
      isPopup: row[12] === true || row[12] === 'TRUE' || row[12] === '팝업',
      bannerDesign: row[13] || 'design1'
    }));
    
    return { success: true, notices: notices, message: '공지사항 목록 조회 성공' };
  }, 3, 1000);
  
  // ✅ 캐시에 저장
  setCachedData(cacheKey, result);
  
  return result;
}

function getNotice(noticeId) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('공지사항');
    
    if (!sheet) {
      return { success: false, message: '공지사항 시트를 찾을 수 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    
    if (noticeId < 2 || noticeId > lastRow) {
      return { success: false, message: '공지사항을 찾을 수 없습니다.' };
    }
    
    const data = sheet.getRange(noticeId, 1, 1, 14).getValues()[0];
    
    const currentViews = data[6] || 0;
    sheet.getRange(noticeId, 7).setValue(currentViews + 1);
    
    const notice = {
      id: noticeId,
      rowNumber: noticeId,
      number: data[0],
      createdAt: data[1],
      title: data[2],
      content: data[3],
      author: data[4],
      category: data[5],
      views: currentViews + 1,
      isPinned: data[7] === true || data[7] === 'TRUE' || data[7] === '고정',
      status: data[8],
      startDate: data[9],
      endDate: data[10],
      imageUrl: data[11] || '',
      images: data[11] ? String(data[11]).split('\n').filter(url => url.trim()) : [],
      isPopup: data[12] === true || data[12] === 'TRUE' || data[12] === '팝업',
      bannerDesign: data[13] || 'design1'
    };
    
    return { success: true, notice: notice, message: '공지사항 조회 성공' };
  } catch (error) {
    return { success: false, message: '공지사항 조회 실패: ' + error.message };
  }
}

function createNotice(data) {
  // ✅ 재시도 로직 적용
  const result = executeWithRetry(() => {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('공지사항');
    
    if (!sheet) {
      sheet = initializeNoticeSheet();
    }
    
    const lastRow = sheet.getLastRow();
    const noticeNumber = lastRow > 1 ? lastRow : 1;
    
    const imagesString = data.images && Array.isArray(data.images) 
      ? data.images.join('\n') 
      : '';
    
    const bannerDesign = data.bannerDesign || '';
    
    sheet.appendRow([
      noticeNumber,
      new Date(),
      data.title || '',
      data.content || '',
      data.author || '관리자',
      data.category || '일반',
      0,
      data.isPinned || false,
      data.status || '게시중',
      data.startDate || new Date(),
      data.endDate || '',
      imagesString,
      data.isPopup === true ? 'TRUE' : 'FALSE',
      bannerDesign
    ]);
    
    return {
      success: true,
      noticeNumber: noticeNumber,
      id: lastRow + 1,
      message: '공지사항이 등록되었습니다.'
    };
  }, 3, 1000);
  
  // ✅ 캐시 무효화
  invalidateCache('notices_all');
  
  return result;
}

function updateNotice(data) {
  // ✅ 재시도 로직 적용
  const result = executeWithRetry(() => {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('공지사항');
    
    if (!sheet) {
      return { success: false, message: '공지사항 시트를 찾을 수 없습니다.' };
    }
    
    const rowNumber = data.rowNumber || data.id || data.noticeId;
    
    if (!rowNumber || rowNumber < 2 || isNaN(rowNumber)) {
      return { success: false, message: '유효하지 않은 공지사항 ID입니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    if (rowNumber > lastRow) {
      return { success: false, message: '존재하지 않는 공지사항입니다.' };
    }
    
    if (data.title !== undefined) sheet.getRange(rowNumber, 3).setValue(data.title);
    if (data.content !== undefined) sheet.getRange(rowNumber, 4).setValue(data.content);
    if (data.author !== undefined) sheet.getRange(rowNumber, 5).setValue(data.author);
    if (data.category !== undefined) sheet.getRange(rowNumber, 6).setValue(data.category);
    if (data.isPinned !== undefined) sheet.getRange(rowNumber, 8).setValue(data.isPinned);
    if (data.status !== undefined) sheet.getRange(rowNumber, 9).setValue(data.status);
    if (data.startDate !== undefined) sheet.getRange(rowNumber, 10).setValue(data.startDate);
    if (data.endDate !== undefined) sheet.getRange(rowNumber, 11).setValue(data.endDate);
    if (data.images !== undefined) {
      const imagesString = Array.isArray(data.images) ? data.images.join('\n') : '';
      sheet.getRange(rowNumber, 12).setValue(imagesString);
    }
    if (data.isPopup !== undefined) sheet.getRange(rowNumber, 13).setValue(data.isPopup === true ? 'TRUE' : 'FALSE');
    if (data.bannerDesign !== undefined) sheet.getRange(rowNumber, 14).setValue(data.bannerDesign || '');
    
    return { success: true, message: '공지사항이 수정되었습니다.' };
  }, 3, 1000);
  
  // ✅ 캐시 무효화
  invalidateCache('notices_all');
  
  return result;
}

function deleteNotice(noticeId) {
  // ✅ 재시도 로직 적용
  const result = executeWithRetry(() => {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('공지사항');
    
    if (!sheet) {
      throw new Error('공지사항 시트를 찾을 수 없습니다.');
    }
    
    sheet.deleteRow(noticeId);
    
    return { success: true, message: '공지사항이 삭제되었습니다.' };
  }, 3, 1000);
  
  // ✅ 캐시 무효화
  invalidateCache('notices_all');
  
  return result;
}

// ==================== 이미지 관리 ====================

function uploadImage(fileName, fileData, mimeType) {
  try {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(fileData),
      mimeType,
      fileName
    );
    
    const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
    const file = folder.createFile(blob);
    
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileId = file.getId();
    const imageUrl = WEB_APP_URL + '?action=getImage&id=' + fileId;
    const thumbnailUrl = 'https://drive.google.com/thumbnail?id=' + fileId;
    
    const ss = getSpreadsheet();
    let imageSheet = ss.getSheetByName('이미지목록');
    
    if (!imageSheet) {
      imageSheet = initializeImageSheet();
    }
    
    const lastRow = imageSheet.getLastRow();
    const imageNumber = lastRow;
    const uploadDate = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    const fileSizeMB = (blob.getBytes().length / (1024 * 1024)).toFixed(2);
    
    imageSheet.appendRow([
      imageNumber, uploadDate, fileName, '', fileName,
      imageUrl, fileId, thumbnailUrl, fileSizeMB, '공지사항', ''
    ]);
    
    return {
      success: true,
      imageUrl: imageUrl,
      fileId: fileId,
      fileName: fileName,
      thumbnailUrl: thumbnailUrl
    };
  } catch (error) {
    return { success: false, message: '이미지 업로드 실패: ' + error.message };
  }
}

// ==================== 동영상 관리 ====================

function uploadVideo(data) {
  try {
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (data.fileSize > MAX_FILE_SIZE) {
      return { success: false, message: '파일 크기는 100MB 이하여야 합니다.' };
    }
    
    if (!data.duration || parseInt(data.duration) <= 0) {
      return { success: false, message: '재생 시간을 입력해주세요.' };
    }
    
    const folder = DriveApp.getFolderById(VIDEO_FOLDER_ID);
    
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.base64Data),
      data.mimeType,
      data.fileName
    );
    
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    const fileId = file.getId();
    const fileUrl = file.getUrl();
    
    const ss = getSpreadsheet();
    let videoSheet = ss.getSheetByName('강의영상');
    
    if (!videoSheet) {
      videoSheet = initializeVideoSheet();
    }
    
    const lastRow = videoSheet.getLastRow();
    const videoNumber = lastRow;
    const now = new Date();
    const uploadDate = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    
    videoSheet.appendRow([
      videoNumber, uploadDate, data.title, data.description || '',
      data.fileName, data.category, fileUrl, fileId,
      `https://drive.google.com/uc?id=${fileId}`,
      `https://drive.google.com/file/d/${fileId}/preview`,
      data.fileSize, data.duration, 0, '활성'
    ]);
    
    // ✅ 캐시 무효화
    invalidateCache(`videos_${data.category}`);
    
    return {
      success: true,
      fileId: fileId,
      fileUrl: fileUrl,
      videoNumber: videoNumber,
      message: '영상이 성공적으로 업로드되었습니다!'
    };
  } catch (error) {
    return { success: false, message: '업로드 실패: ' + error.message };
  }
}

function addVideoFromDrive(data) {
  try {
    const fileId = data.fileId;
    
    let file;
    try {
      file = DriveApp.getFileById(fileId);
    } catch (fileError) {
      return {
        success: false,
        message: '파일에 접근할 수 없습니다. 공유 설정을 확인해주세요.'
      };
    }
    
    const fileName = file.getName();
    const fileUrl = file.getUrl();
    const fileSize = file.getSize();
    const mimeType = file.getMimeType();
    
    if (!mimeType.startsWith('video/')) {
      return { success: false, message: '비디오 파일만 추가할 수 있습니다.' };
    }
    
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      Logger.log('⚠️ 권한 설정 실패: ' + e.toString());
    }
    
    const ss = getSpreadsheet();
    let videoSheet = ss.getSheetByName('강의영상');
    
    if (!videoSheet) {
      videoSheet = initializeVideoSheet();
    }
    
    const lastRow = videoSheet.getLastRow();
    const videoNumber = lastRow;
    const now = new Date();
    const uploadDate = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    
    videoSheet.appendRow([
      videoNumber, uploadDate, data.title, data.description || '',
      fileName, data.category, fileUrl, fileId,
      `https://drive.google.com/uc?id=${fileId}`,
      `https://drive.google.com/file/d/${fileId}/preview`,
      fileSize, data.duration, 0, '활성'
    ]);
    
    // ✅ 캐시 무효화
    invalidateCache(`videos_${data.category}`);
    
    return {
      success: true,
      fileId: fileId,
      fileUrl: fileUrl,
      fileName: fileName,
      videoNumber: videoNumber,
      message: '영상이 성공적으로 등록되었습니다!'
    };
  } catch (error) {
    return { success: false, message: '영상 추가 실패: ' + error.message };
  }
}

function getVideosByCategory(category) {
  const cacheKey = `videos_${category}`;
  
  // ✅ 캐시 조회
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }
  
  // ✅ 캐시 없으면 DB 조회 (재시도 로직 적용)
  const result = executeWithRetry(() => {
    const ss = getSpreadsheet();
    const videoSheet = ss.getSheetByName('강의영상');
    
    if (!videoSheet) {
      return { success: true, videos: [], message: '강의영상 시트를 찾을 수 없습니다.' };
    }
    
    const lastRow = videoSheet.getLastRow();
    
    if (lastRow <= 1) {
      return { success: true, videos: [], message: '등록된 영상이 없습니다.' };
    }
    
    const data = videoSheet.getRange(2, 1, lastRow - 1, 14).getValues();
    
    const videos = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowCategory = row[5];
      
      if (rowCategory === category) {
        videos.push({
          rowNumber: i + 2,
          number: row[0],
          uploadDate: row[1],
          title: row[2],
          description: row[3],
          fileName: row[4],
          category: row[5],
          fileUrl: row[6],
          fileId: row[7],
          thumbnailUrl: row[8],
          embedUrl: row[9],
          fileSize: row[10],
          duration: row[11],
          viewCount: row[12] || 0,
          status: row[13] || '활성'
        });
      }
    }
    
    return { success: true, videos: videos, total: videos.length, message: '영상 조회 성공' };
  }, 3, 1000);
  
  // ✅ 캐시에 저장
  setCachedData(cacheKey, result);
  
  return result;
}

function deleteVideo(fileId, rowNumber, category) {
  // ✅ 재시도 로직 적용
  const result = executeWithRetry(() => {
    try {
      const file = DriveApp.getFileById(fileId);
      file.setTrashed(true);
    } catch (e) {
      Logger.log('⚠️ Drive 파일 삭제 실패: ' + e.toString());
    }
    
    const ss = getSpreadsheet();
    const videoSheet = ss.getSheetByName('강의영상');
    
    if (videoSheet && rowNumber) {
      videoSheet.deleteRow(rowNumber);
    }
    
    return { success: true, message: '영상이 삭제되었습니다.' };
  }, 3, 1000);
  
  // ✅ 캐시 무효화
  if (category) {
    invalidateCache(`videos_${category}`);
  }
  
  return result;
}

// ==================== 강의 등록 관리 ====================

function getEnrolledCourses(userEmail) {
  try {
    Logger.log('═══════════════════════════════════════');
    Logger.log('📚 수강 강의 조회 시작');
    Logger.log('📧 사용자 이메일: ' + userEmail);
    
    const ss = getSpreadsheet();
    const memberSheet = ss.getSheetByName('회원목록');
    
    if (!memberSheet) {
      Logger.log('❌ 회원목록 시트를 찾을 수 없음');
      return { success: false, message: '회원목록 시트를 찾을 수 없습니다.', courses: [] };
    }
    
    const data = memberSheet.getDataRange().getValues();
    const headers = data[0];
    
    Logger.log('📋 헤더 목록: ' + JSON.stringify(headers));
    
    const emailIdx = headers.indexOf('이메일');
    const festivalCol = headers.indexOf('축제기획사');
    const eventCol = headers.indexOf('이벤트기획사');
    const performanceCol = headers.indexOf('공연기획사');
    const festivalCompletedIdx = headers.indexOf('축제기획사_완료영상수');
    const eventCompletedIdx = headers.indexOf('이벤트기획사_완료영상수');
    const performanceCompletedIdx = headers.indexOf('공연기획사_완료영상수');
    
    Logger.log('📍 컬럼 인덱스:');
    Logger.log('  - 이메일: ' + emailIdx);
    Logger.log('  - 축제기획사: ' + festivalCol);
    Logger.log('  - 이벤트기획사: ' + eventCol);
    Logger.log('  - 공연기획사: ' + performanceCol);
    Logger.log('  - 축제기획사_완료영상수: ' + festivalCompletedIdx);
    Logger.log('  - 이벤트기획사_완료영상수: ' + eventCompletedIdx);
    Logger.log('  - 공연기획사_완료영상수: ' + performanceCompletedIdx);
    
    // ✅ 필수 컬럼 확인
    if (emailIdx === -1) {
      Logger.log('❌ 이메일 컬럼을 찾을 수 없음');
      return { success: false, message: '이메일 컬럼을 찾을 수 없습니다.', courses: [] };
    }
    
    if (festivalCol === -1 || eventCol === -1 || performanceCol === -1) {
      Logger.log('❌ 강의 컬럼을 찾을 수 없음');
      return { success: false, message: '강의 컬럼을 찾을 수 없습니다. 회원목록 시트에 "축제기획사", "이벤트기획사", "공연기획사" 컬럼을 추가해주세요.', courses: [] };
    }
    
    if (festivalCompletedIdx === -1 || eventCompletedIdx === -1 || performanceCompletedIdx === -1) {
      Logger.log('⚠️ 완료영상수 컬럼이 없습니다. 0으로 처리됩니다.');
    }
    
    const videoSheet = ss.getSheetByName('강의영상');
    const totalVideos = { 'festival': 0, 'event': 0, 'performance': 0 };
    
    if (videoSheet) {
      const videoData = videoSheet.getDataRange().getValues();
      Logger.log('📹 총 영상 행 수: ' + (videoData.length - 1));
      
      for (let i = 1; i < videoData.length; i++) {
        const category = videoData[i][5]; // 6번째 컬럼 (카테고리)
        
        if (category === 'festival' || category === '축제기획사') {
          totalVideos['festival']++;
        } else if (category === 'event' || category === '이벤트기획사') {
          totalVideos['event']++;
        } else if (category === 'performance' || category === '공연기획사') {
          totalVideos['performance']++;
        }
      }
      
      Logger.log('📊 카테고리별 총 영상 수:');
      Logger.log('  - 축제기획사: ' + totalVideos['festival']);
      Logger.log('  - 이벤트기획사: ' + totalVideos['event']);
      Logger.log('  - 공연기획사: ' + totalVideos['performance']);
    } else {
      Logger.log('⚠️ 강의영상 시트를 찾을 수 없음');
    }
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailIdx] === userEmail) {
        Logger.log('✅ 사용자 발견: ' + userEmail);
        
        const courses = [];
        let courseIdCounter = 0;
        
        const festivalCompleted = festivalCompletedIdx >= 0 ? (Number(data[i][festivalCompletedIdx]) || 0) : 0;
        const eventCompleted = eventCompletedIdx >= 0 ? (Number(data[i][eventCompletedIdx]) || 0) : 0;
        const performanceCompleted = performanceCompletedIdx >= 0 ? (Number(data[i][performanceCompletedIdx]) || 0) : 0;
        
        Logger.log('📊 완료영상수:');
        Logger.log('  - 축제기획사: ' + festivalCompleted);
        Logger.log('  - 이벤트기획사: ' + eventCompleted);
        Logger.log('  - 공연기획사: ' + performanceCompleted);
        
        if (festivalCol >= 0 && data[i][festivalCol] === 'Y') {
          const totalLessons = totalVideos['festival'];
          const completedLessons = festivalCompleted;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          
          Logger.log('🎓 축제기획사 강의 추가:');
          Logger.log('  - 총 영상: ' + totalLessons);
          Logger.log('  - 완료: ' + completedLessons);
          Logger.log('  - 진도율: ' + progress + '%');
          
          courses.push({
            id: ++courseIdCounter,
            courseId: 1,
            userId: userEmail,
            title: '축제기획사',
            category: '축제기획사',
            categoryKey: 'festival',
            progress: progress,
            totalLessons: totalLessons,
            completedLessons: completedLessons,
            enrolledAt: data[i][1],
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'
          });
        }
        
        if (eventCol >= 0 && data[i][eventCol] === 'Y') {
          const totalLessons = totalVideos['event'];
          const completedLessons = eventCompleted;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          
          Logger.log('🎓 이벤트기획사 강의 추가:');
          Logger.log('  - 총 영상: ' + totalLessons);
          Logger.log('  - 완료: ' + completedLessons);
          Logger.log('  - 진도율: ' + progress + '%');
          
          courses.push({
            id: ++courseIdCounter,
            courseId: 2,
            userId: userEmail,
            title: '이벤트기획사',
            category: '이벤트기획사',
            categoryKey: 'event',
            progress: progress,
            totalLessons: totalLessons,
            completedLessons: completedLessons,
            enrolledAt: data[i][1],
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678'
          });
        }
        
        if (performanceCol >= 0 && data[i][performanceCol] === 'Y') {
          const totalLessons = totalVideos['performance'];
          const completedLessons = performanceCompleted;
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
          
          Logger.log('🎓 공연기획사 강의 추가:');
          Logger.log('  - 총 영상: ' + totalLessons);
          Logger.log('  - 완료: ' + completedLessons);
          Logger.log('  - 진도율: ' + progress + '%');
          
          courses.push({
            id: ++courseIdCounter,
            courseId: 3,
            userId: userEmail,
            title: '공연기획사',
            category: '공연기획사',
            categoryKey: 'performance',
            progress: progress,
            totalLessons: totalLessons,
            completedLessons: completedLessons,
            enrolledAt: data[i][1],
            image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4'
          });
        }
        
        Logger.log('✅ 총 ' + courses.length + '개 강의 반환');
        Logger.log('═══════════════════════════════════════');
        return { success: true, courses: courses };
      }
    }
    
    Logger.log('⚠️ 사용자를 찾을 수 없음');
    Logger.log('═══════════════════════════════════════');
    return { success: true, courses: [] };
  } catch (error) {
    Logger.log('❌ 오류 발생: ' + error.toString());
    Logger.log('═══════════════════════════════════════');
    return { success: false, message: '강의 목록 조회 오류: ' + error.message, courses: [] };
  }
}

function enrollUserToCourse(userEmail, courseName) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet) {
      return { success: false, message: '회원목록 시트를 찾을 수 없습니다.' };
    }
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const emailCol = headers.indexOf('이메일');
    let courseCol = headers.indexOf(courseName);
    
    if (courseCol === -1) {
      courseCol = sheet.getLastColumn();
      sheet.getRange(1, courseCol + 1).setValue(courseName);
    }
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailCol] === userEmail) {
        sheet.getRange(i + 1, courseCol + 1).setValue('Y');
        return { success: true, message: '강의가 해금되었습니다.' };
      }
    }
    
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
  } catch (error) {
    return { success: false, message: '강의 해금 오류: ' + error.message };
  }
}

function unenrollCourse(userEmail, courseId) {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('회원목록');
    
    if (!sheet) {
      return { success: false, message: '회원목록 시트를 찾을 수 없습니다.' };
    }
    
    const courseNames = {
      1: '축제기획사',
      2: '이벤트기획사',
      3: '공연기획사'
    };
    
    const courseName = courseNames[courseId];
    
    if (!courseName) {
      return { success: false, message: '유효하지 않은 강의 ID입니다.' };
    }
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const emailCol = headers.indexOf('이메일');
    const courseCol = headers.indexOf(courseName);
    
    if (courseCol === -1) {
      return { success: false, message: '강의 컬럼을 찾을 수 없습니다.' };
    }
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][emailCol] === userEmail) {
        sheet.getRange(i + 1, courseCol + 1).setValue('N');
        return { success: true, message: '강의가 차단되었습니다.' };
      }
    }
    
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
  } catch (error) {
    return { success: false, message: '강의 차단 오류: ' + error.message };
  }
}

// ==================== 나의 강의실 API ====================

function getCourseVideos(courseId) {
  const categoryMap = {
    1: 'festival',
    2: 'event',
    3: 'performance'
  };
  
  const category = categoryMap[courseId];
  if (!category) {
    return { success: false, message: '잘못된 강의 ID입니다.' };
  }
  
  const categoryName = LECTURE_CATEGORIES[category];
  if (!categoryName) {
    return { success: false, message: '카테고리를 찾을 수 없습니다.' };
  }
  
  const result = getVideosByCategory(categoryName);
  const videos = result.videos || [];
  
  return {
    success: true,
    videos: videos.map((video, index) => ({
      id: video.number,
      courseId: courseId,
      title: video.title,
      description: video.description,
      videoUrl: video.embedUrl,
      fileUrl: video.fileUrl,
      thumbnailUrl: video.thumbnailUrl,
      duration: parseInt(video.duration) || 0,
      order: index + 1,
      completed: false
    }))
  };
}

function markVideoComplete(userEmail, videoId, courseId) {
  try {
    Logger.log('═══════════════════════════════════════');
    Logger.log('✅ markVideoComplete 시작');
    Logger.log(`📧 이메일: ${userEmail}`);
    Logger.log(`🎬 영상ID: ${videoId}`);
    Logger.log(`📚 강좌ID: ${courseId}`);
    
    const ss = getSpreadsheet();
    
    const videoSheet = ss.getSheetByName('강의영상');
    if (!videoSheet) {
      return { success: false, message: '강의영상 시트를 찾을 수 없습니다.' };
    }
    
    const videoData = videoSheet.getDataRange().getValues();
    let videoInfo = null;
    
    for (let i = 1; i < videoData.length; i++) {
      if (String(videoData[i][0]) === String(videoId)) {
        videoInfo = {
          videoId: videoData[i][0],
          title: videoData[i][2],
          category: videoData[i][5]
        };
        Logger.log(`📹 영상 정보: 제목="${videoInfo.title}", 카테고리="${videoInfo.category}"`);
        break;
      }
    }
    
    if (!videoInfo) {
      Logger.log(`❌ 영상을 찾을 수 없음 (ID: ${videoId})`);
      return { success: false, message: `영상을 찾을 수 없습니다. (ID: ${videoId})` };
    }
    
    let learningSheet = ss.getSheetByName('학습기록');
    if (!learningSheet) {
      initializeLearningRecordSheet();
      learningSheet = ss.getSheetByName('학습기록');
    }
    
    const learningData = learningSheet.getDataRange().getValues();
    let alreadyCompleted = false;
    
    // ✅ 중복 체크만 하고 early return 제거
    for (let i = 1; i < learningData.length; i++) {
      if (learningData[i][0] === userEmail && String(learningData[i][1]) === String(videoId)) {
        alreadyCompleted = true;
        Logger.log('⚠️ 이미 완료한 영상이지만 회원목록 동기화 진행');
        break;
      }
    }
    
    // ✅ 중복이 아닐 때만 학습기록 추가
    if (!alreadyCompleted) {
      const newRow = [userEmail, videoId, videoInfo.category, new Date()];
      learningSheet.appendRow(newRow);
      Logger.log('✅ 학습기록 시트에 추가됨');
    }
    
    // ✅ 회원목록 업데이트는 항상 실행 (실제 개수 재계산)
    const memberSheet = ss.getSheetByName('회원목록');
    if (!memberSheet) {
      Logger.log('❌ 회원목록 시트를 찾을 수 없음');
      return { success: false, message: '회원목록 시트를 찾을 수 없습니다.' };
    }
    
    const memberData = memberSheet.getDataRange().getValues();
    const headers = memberData[0];
    
    const emailIdx = headers.indexOf('이메일');
    const festivalCompletedIdx = headers.indexOf('축제기획사_완료영상수');
    const eventCompletedIdx = headers.indexOf('이벤트기획사_완료영상수');
    const performanceCompletedIdx = headers.indexOf('공연기획사_완료영상수');
    
    Logger.log(`📍 컬럼 인덱스: 이메일=${emailIdx}, 축제=${festivalCompletedIdx}, 이벤트=${eventCompletedIdx}, 공연=${performanceCompletedIdx}`);
    
    let userRowIndex = -1;
    
    for (let i = 1; i < memberData.length; i++) {
      if (memberData[i][emailIdx] === userEmail) {
        userRowIndex = i;
        break;
      }
    }
    
    if (userRowIndex === -1) {
      Logger.log('❌ 사용자를 찾을 수 없음');
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }
    
    Logger.log(`👤 사용자 발견: 행 ${userRowIndex + 1}`);
    
    // ✅ 학습기록 시트에서 실제 완료 개수 재계산
    const learningDataFresh = learningSheet.getDataRange().getValues();
    const actualCounts = { festival: 0, event: 0, performance: 0 };
    
    for (let i = 1; i < learningDataFresh.length; i++) {
      if (learningDataFresh[i][0] === userEmail) {
        const cat = learningDataFresh[i][2];
        if (cat === 'festival' || cat === '축제기획사') {
          actualCounts.festival++;
        } else if (cat === 'event' || cat === '이벤트기획사') {
          actualCounts.event++;
        } else if (cat === 'performance' || cat === '공연기획사') {
          actualCounts.performance++;
        }
      }
    }
    
    Logger.log('📊 실제 완료 개수 재계산:');
    Logger.log(`  - 축제기획사: ${actualCounts.festival}개`);
    Logger.log(`  - 이벤트기획사: ${actualCounts.event}개`);
    Logger.log(`  - 공연기획사: ${actualCounts.performance}개`);
    
    // ✅ 회원목록 시트 업데이트 (실제 개수로)
    memberSheet.getRange(userRowIndex + 1, festivalCompletedIdx + 1).setValue(actualCounts.festival);
    memberSheet.getRange(userRowIndex + 1, eventCompletedIdx + 1).setValue(actualCounts.event);
    memberSheet.getRange(userRowIndex + 1, performanceCompletedIdx + 1).setValue(actualCounts.performance);
    
    Logger.log('✅ 회원목록 시트 업데이트 완료');
    Logger.log('═══════════════════════════════════════');
    
    return {
      success: true,
      message: alreadyCompleted ? '이미 완료한 영상입니다.' : '시청 완료 처리되었습니다.',
      alreadyCompleted: alreadyCompleted,
      videoInfo: videoInfo,
      actualCounts: actualCounts
    };
  } catch (error) {
    Logger.log('❌ markVideoComplete 오류: ' + error.toString());
    Logger.log('═══════════════════════════════════════');
    return { success: false, message: '시청 완료 처리 실패: ' + error.message };
  }
}

function markVideoIncomplete(userEmail, videoId, courseId) {
  try {
    const ss = getSpreadsheet();
    
    const videoSheet = ss.getSheetByName('강의영상');
    if (!videoSheet) {
      return { success: false, message: '강의영상 시트를 찾을 수 없습니다.' };
    }
    
    const videoData = videoSheet.getDataRange().getValues();
    let videoInfo = null;
    
    for (let i = 1; i < videoData.length; i++) {
      if (String(videoData[i][0]) === String(videoId)) {
        videoInfo = {
          videoId: videoData[i][0],
          title: videoData[i][2],
          category: videoData[i][5]
        };
        break;
      }
    }
    
    if (!videoInfo) {
      return { success: false, message: `영상을 찾을 수 없습니다. (ID: ${videoId})` };
    }
    
    let learningSheet = ss.getSheetByName('학습기록');
    if (!learningSheet) {
      initializeLearningRecordSheet();
      learningSheet = ss.getSheetByName('학습기록');
    }
    
    const learningData = learningSheet.getDataRange().getValues();
    
    for (let i = 1; i < learningData.length; i++) {
      if (learningData[i][0] === userEmail && String(learningData[i][1]) === String(videoId)) {
        learningSheet.deleteRow(i + 1);
        break;
      }
    }
    
    const memberSheet = ss.getSheetByName('회원목록');
    if (!memberSheet) {
      return { success: false, message: '회원목록 시트를 찾을 수 없습니다.' };
    }
    
    const memberData = memberSheet.getDataRange().getValues();
    const headers = memberData[0];
    
    const emailIdx = headers.indexOf('이메일');
    const festivalCompletedIdx = headers.indexOf('축제기획사_완료영상수');
    const eventCompletedIdx = headers.indexOf('이벤트기획사_완료영상수');
    const performanceCompletedIdx = headers.indexOf('공연기획사_완료영상수');
    
    let userRowIndex = -1;
    
    for (let i = 1; i < memberData.length; i++) {
      if (memberData[i][emailIdx] === userEmail) {
        userRowIndex = i;
        break;
      }
    }
    
    if (userRowIndex === -1) {
      return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }
    
    const category = videoInfo.category;
    let columnToUpdate = 0;
    let currentCount = 0;
    
    if (category === 'festival' || category === '축제기획사') {
      columnToUpdate = festivalCompletedIdx + 1;
      currentCount = Number(memberData[userRowIndex][festivalCompletedIdx]) || 0;
      memberSheet.getRange(userRowIndex + 1, columnToUpdate).setValue(currentCount - 1);
    } else if (category === 'event' || category === '이벤트기획사') {
      columnToUpdate = eventCompletedIdx + 1;
      currentCount = Number(memberData[userRowIndex][eventCompletedIdx]) || 0;
      memberSheet.getRange(userRowIndex + 1, columnToUpdate).setValue(currentCount - 1);
    } else if (category === 'performance' || category === '공연기획사') {
      columnToUpdate = performanceCompletedIdx + 1;
      currentCount = Number(memberData[userRowIndex][performanceCompletedIdx]) || 0;
      memberSheet.getRange(userRowIndex + 1, columnToUpdate).setValue(currentCount - 1);
    }
    
    return {
      success: true,
      message: '시청 완료 취소 처리되었습니다.',
      videoInfo: videoInfo,
      newCount: currentCount - 1
    };
  } catch (error) {
    return { success: false, message: '시청 완료 취소 처리 실패: ' + error.message };
  }
}

function getCompletedVideos(userEmail, category) {
  try {
    const ss = getSpreadsheet();
    const learningSheet = ss.getSheetByName('학습기록');
    
    if (!learningSheet || learningSheet.getLastRow() <= 1) {
      return { success: true, completedVideos: [], message: '진도 조회 성공' };
    }
    
    const learningData = learningSheet.getDataRange().getValues();
    const completedVideos = [];
    
    const categoryMap = {
      1: ['festival', '축제기획사'],
      2: ['event', '이벤트기획사'],
      3: ['performance', '공연기획사']
    };
    
    const targetCategories = categoryMap[category] || [];
    
    for (let i = 1; i < learningData.length; i++) {
      const recordEmail = learningData[i][0];
      const videoId = learningData[i][1];
      const category = learningData[i][2];
      
      if (recordEmail === userEmail && targetCategories.includes(category)) {
        completedVideos.push(Number(videoId));
      }
    }
    
    return { success: true, completedVideos: completedVideos, message: '진도 조회 성공' };
  } catch (error) {
    return { success: false, completedVideos: [], message: '진도 조회 실패: ' + error.message };
  }
}

// ==================== 시험 시스템 ====================

function getExamQuestions() {
  try {
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('시험문제');
    
    if (!sheet) {
      return { success: false, message: '시험문제 시트를 찾을 수 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { success: false, message: '등록된 문제가 없습니다.' };
    }
    
    const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
    
    const questions = data.map((row, index) => ({
      id: index + 1,
      question: row[1],
      correctAnswer: row[2] === 'O' ? 1 : 2,
      score: 10
    }));
    
    return { success: true, questions: questions };
  } catch (error) {
    return { success: false, message: '문제 로드 실패: ' + error.message };
  }
}

function submitExamAnswers(userEmail, answers) {
  try {
    const questionsResult = getExamQuestions();
    if (!questionsResult.success) {
      return questionsResult;
    }
    
    const questions = questionsResult.questions;
    
    let score = 0;
    let correctCount = 0;
    const results = questions.map((q, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) {
        score += q.score;
        correctCount++;
      }
      return {
        questionNumber: index + 1,
        userAnswer: userAnswer === 1 ? 'O' : userAnswer === 2 ? 'X' : '미응답',
        correctAnswer: q.correctAnswer === 1 ? 'O' : 'X',
        isCorrect: isCorrect
      };
    });
    
    const passed = score >= 70;
    
    const ss = getSpreadsheet();
    let resultSheet = ss.getSheetByName('시험결과');
    
    if (!resultSheet) {
      resultSheet = ss.insertSheet('시험결과');
      resultSheet.appendRow(['이메일', '응시일시', '점수', '합격여부', '답안', '채점결과']);
      
      const headerRange = resultSheet.getRange(1, 1, 1, 6);
      headerRange.setBackground('#6d9469');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      
      resultSheet.setColumnWidth(1, 200);
      resultSheet.setColumnWidth(2, 150);
      resultSheet.setColumnWidth(3, 80);
      resultSheet.setColumnWidth(4, 100);
      resultSheet.setColumnWidth(5, 300);
      resultSheet.setColumnWidth(6, 300);
    }
    
    const answerString = answers.map(a => a === 1 ? 'O' : a === 2 ? 'X' : '미응답').join(',');
    const resultString = results.map(r => r.isCorrect ? 'O' : 'X').join(',');
    
    resultSheet.appendRow([
      userEmail, new Date(), score, passed ? '합격' : '불합격',
      answerString, resultString
    ]);
    
    const memberSheet = ss.getSheetByName('회원목록');
    if (memberSheet) {
      const memberData = memberSheet.getDataRange().getValues();
      for (let i = 1; i < memberData.length; i++) {
        if (memberData[i][3] === userEmail) {
          memberSheet.getRange(i + 1, 17).setValue('응시');
          memberSheet.getRange(i + 1, 18).setValue(new Date());
          memberSheet.getRange(i + 1, 19).setValue(score + '점 (' + (passed ? '합격' : '불합격') + ')');
          break;
        }
      }
    }
    
    return {
      success: true,
      gradeResult: {
        score: score,
        totalScore: questions.length * 10,
        maxScore: questions.length * 10,
        correctCount: correctCount,
        questionCount: questions.length,
        percentage: Math.round((score / (questions.length * 10)) * 100),
        passed: passed,
        results: results,
        details: results.map((r, idx) => ({
          question: idx + 1,
          studentAnswer: String(answers[idx]),
          correctAnswer: String(questions[idx].correctAnswer),
          isCorrect: r.isCorrect
        }))
      },
      message: '시험이 제출되었습니다.'
    };
  } catch (error) {
    return { success: false, message: '답안 제출 실패: ' + error.message };
  }
}

function getExamResult(userEmail) {
  try {
    const ss = getSpreadsheet();
    const resultSheet = ss.getSheetByName('시험결과');
    
    if (!resultSheet || resultSheet.getLastRow() <= 1) {
      return { success: false, message: '시험 결과가 없습니다.' };
    }
    
    const data = resultSheet.getDataRange().getValues();
    
    let latestResult = null;
    let latestDate = null;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userEmail) {
        const date = new Date(data[i][1]);
        if (!latestDate || date > latestDate) {
          latestDate = date;
          latestResult = {
            email: data[i][0],
            date: data[i][1],
            score: data[i][2],
            passed: data[i][3],
            answers: data[i][4],
            results: data[i][5]
          };
        }
      }
    }
    
    if (latestResult) {
      return { success: true, result: latestResult };
    } else {
      return { success: false, message: '시험 결과를 찾을 수 없습니다.' };
    }
  } catch (error) {
    return { success: false, message: '결과 조회 실패: ' + error.message };
  }
}

function getAllExamResults() {
  try {
    const ss = getSpreadsheet();
    const resultSheet = ss.getSheetByName('시험결과');
    
    if (!resultSheet || resultSheet.getLastRow() <= 1) {
      return { success: true, results: [], message: '시험 결과가 없습니다.' };
    }
    
    const data = resultSheet.getRange(2, 1, resultSheet.getLastRow() - 1, 6).getValues();
    
    const results = data.map(row => ({
      email: row[0],
      date: row[1],
      score: row[2],
      passed: row[3],
      answers: row[4],
      results: row[5]
    }));
    
    return { success: true, results: results };
  } catch (error) {
    return { success: false, message: '전체 결과 조회 실패: ' + error.message };
  }
}

// ==================== doPost ====================

function doPost(e) {
  try {
    Logger.log('📥 POST 요청 받음');
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    Logger.log('📥 액션: ' + action);
    
    // ✅ 시험 제출 처리 (프록시 제거, 직접 처리)
    if (action === 'submitExam') {
      // ✅ 답안 변환: 문자열 배열 ["O", "X"] → 숫자 배열 [1, 2]
      const answersString = data.answers || [];
      const answersNumber = answersString.map(ans => {
        if (ans === 'O') return 1;
        if (ans === 'X') return 2;
        return 0; // 미응답
      });
      
      Logger.log('📄 받은 답안 (문자열):', answersString);
      Logger.log('📄 변환된 답안 (숫자):', answersNumber);
      
      return createJSONResponse(submitExamAnswers(data.userEmail, answersNumber));
    }
    
    // ✅ 시험 결과 조회는 시험 시스템으로 프록시 (선택사항)
    if (action === 'getExamResult' || action === 'getAllExamResults') {
      return createJSONResponse(callExamSystem(action, data));
    }
    
    // 회원 관리
    if (action === 'login') {
      return createJSONResponse(loginMember(data.email, data.password));
    }
    
    if (action === 'signup') {
      return createJSONResponse(registerMember(data));
    }
    
    if (action === 'getUserInfo') {
      return createJSONResponse(getUserInfo(data.email));
    }
    
    if (action === 'updateUserInfo') {
      return createJSONResponse(updateUserInfo(data));
    }
    
    if (action === 'changePassword') {
      return createJSONResponse(changePassword(data.email, data.currentPassword, data.newPassword));
    }
    
    if (action === 'deleteAccount') {
      return createJSONResponse(deleteAccount(data.email, data.password));
    }
    
    if (action === 'getAllUsers') {
      return createJSONResponse(getAllUsers());
    }
    
    if (action === 'updateUserByAdmin') {
      return createJSONResponse(updateUserInfoByAdmin(data.userId, data.field, data.value));
    }
    
    // 공지사항 관리
    if (action === 'getNotices') {
      return createJSONResponse(getNotices());
    }
    
    if (action === 'getNotice') {
      return createJSONResponse(getNotice(data.noticeId));
    }
    
    if (action === 'createNotice') {
      return createJSONResponse(createNotice(data));
    }
    
    if (action === 'updateNotice') {
      return createJSONResponse(updateNotice(data));
    }
    
    if (action === 'deleteNotice') {
      return createJSONResponse(deleteNotice(data.noticeId));
    }
    
    // 영상 관리
    if (action === 'getVideosByCategory') {
      return createJSONResponse(getVideosByCategory(data.category));
    }
    
    if (action === 'uploadVideo') {
      return createJSONResponse(uploadVideo(data));
    }
    
    if (action === 'addVideoFromDrive') {
      return createJSONResponse(addVideoFromDrive(data));
    }
    
    if (action === 'deleteVideo') {
      return createJSONResponse(deleteVideo(data.fileId, data.rowNumber, data.category));
    }
    
    // 강의 등록 관리
    if (action === 'getEnrolledCourses') {
      return createJSONResponse(getEnrolledCourses(data.userEmail)); // ✅ 수정됨
    }
    
    if (action === 'enrollCourse') {
      return createJSONResponse(enrollUserToCourse(data.userEmail, data.courseName));
    }
    
    // 학습 기록 관리
    if (action === 'getCompletedVideos') {
      return createJSONResponse(getCompletedVideos(data.userEmail, data.category));
    }
    
    if (action === 'markVideoComplete') {
      return createJSONResponse(markVideoComplete(data.userEmail, data.videoId, data.category));
    }
    
    if (action === 'markVideoIncomplete') {
      return createJSONResponse(markVideoIncomplete(data.userEmail, data.videoId, data.category));
    }
    
    // 이미지 업로드
    if (action === 'uploadImage') {
      return createJSONResponse(uploadImage(data.fileName, data.fileData, data.mimeType));
    }
    
    return createJSONResponse({ 
      success: false, 
      message: '알 수 없는 액션입니다: ' + action 
    });
    
  } catch (error) {
    Logger.log('❌ doPost 오류: ' + error.toString());
    return createJSONResponse({ 
      success: false, 
      message: 'doPost 오류: ' + error.toString() 
    });
  }
}

// ==================== doGet ====================

function doGet(e) {
  try {
    Logger.log('📥 GET 요청 받음');
    const action = e.parameter.action;
    Logger.log('📥 액션: ' + action);
    
    // ✅ 관리자 권한 확인 (Q&A 시스템용)
    if (action === 'checkAdmin') {
      const email = e.parameter.email;
      
      if (!email) {
        return createJSONResponse({
          success: false,
          isAdmin: false,
          message: '이메일이 필요합니다.'
        });
      }
      
      return createJSONResponse(checkAdminByEmail(email));
    }
    
    // ✅ 시험 관련 액션은 시험 시스템으로 프록시
    if (action === 'getExamQuestions' || action === 'getExamResult' || action === 'getAllExamResults') {
      const examData = {};
      if (e.parameter.userEmail) examData.userEmail = e.parameter.userEmail;
      return createJSONResponse(callExamSystem(action, examData));
    }
    
    // ✅ 사용자 진도 조회 (학습기록 시트에서 완료한 영상 목록 반환)
    if (action === 'getUserProgress') {
      const userEmail = e.parameter.userEmail;
      const courseId = parseInt(e.parameter.courseId);
      
      if (!userEmail || !courseId) {
        return createJSONResponse({
          success: false,
          message: 'userEmail과 courseId는 필수입니다.',
          completedVideos: []
        });
      }
      
      return createJSONResponse(getCompletedVideos(userEmail, courseId));
    }
    
    // ✅ 카테고리별 영상 목록 조회
    if (action === 'getVideosByCategory') {
      const category = e.parameter.category;
      
      if (!category) {
        return createJSONResponse({
          success: false,
          message: 'category는 필수입니다.',
          videos: []
        });
      }
      
      return createJSONResponse(getVideosByCategory(category));
    }
    
    return createJSONResponse({
      success: true,
      message: 'API가 정상적으로 작동 중입니다.',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    Logger.log('❌ doGet 오류: ' + error.toString());
    return createJSONResponse({ 
      success: false, 
      message: 'doGet 오류: ' + error.toString() 
    });
  }
}
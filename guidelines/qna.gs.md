// ==================== Q&A 게시판 시스템 - Google Apps Script ====================
// 🎯 이 스크립트는 Q&A 시스템 전용입니다
// 📌 새 Google Sheets를 만들고 이 코드를 붙여넣으세요

// ==================== URL 인코딩 시스템 ====================
// ✅ 질문 생성 시 고유한 URL 코드 생성하여 스프레드시트에 저장
// ✅ URL 형식: /qna/[복잡한문자열] (예: /qna/k3m9p_MTp0czVwcWR1czoxcG5nbWh0_a5f2n)
// ✅ URL 코드로 질문 조회 가능 (ID 대신 사용 가능)
// ✅ 같은 질문은 항상 동일한 URL 생성 (고정)

// ==================== 채팅 스타일 답변 시스템 ====================
// ✅ QNA 시트: 질문 정보 저장
// ✅ REPLIES 시트: 답변 목록 저장 (1:N 관계)
// ✅ 모든 사용자가 답변 가능 (관리자/일반 사용자 구분)

// ==================== 설정 ====================

// ✅ 스프레드시트 ID (자동으로 현재 시트 사용)
const QNA_SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// ✅ 관리자 이메일 목록 (admin.gs.md와 동일하게 관리)
const ADMIN_EMAILS = [
  'admin@gmail.com',
  'admin@example.com'
  // 추가 관리자 이메일을 여기에 추가하세요
];

// ✅ 카테고리 설정
const CATEGORIES = [
  '수강신청',
  '자격증 발급',
  '결제/환불',
  '시험 응시',
  '강의 시청',
  '기타'
];

// ==================== 유틸리티 함수 ====================

/**
 * 스프레드시트 가져오기
 */
function getQnASpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (error) {
    Logger.log('❌ 스프레드시트 열기 실패: ' + error.toString());
    throw new Error('스프레드시트를 열 수 없습니다.');
  }
}

/**
 * URL 코드 생성 (고유하고 예측 불가능)
 */
function generateUrlCode(id, userEmail, userName) {
  // 1. 사용자 정보 해시화
  var userHash = simpleHash(userEmail + userName);
  
  // 2. ID를 36진수로 변환
  var idBase36 = id.toString(36);
  
  // 3. ID 기반 시드 해시
  var idSeedHash = simpleHash('question_' + id + '_' + userEmail);
  
  // 4. 조합
  var combined = idBase36 + ':' + userHash + ':' + idSeedHash;
  
  // 5. Base64 인코딩 (URL-safe)
  var encoded = Utilities.base64Encode(combined)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // 6. 앞뒤에 고정된 문자 추가
  var prefix = generateFixedString(id, 5, 'prefix');
  var suffix = generateFixedString(id, 5, 'suffix');
  
  return prefix + encoded + suffix;
}

/**
 * 간단한 해시 함수
 */
function simpleHash(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * ID 기반 고정 문자열 생성
 */
function generateFixedString(id, length, salt) {
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var result = '';
  
  var seed = simpleHash(salt + '_' + id);
  var seedNum = parseInt(seed, 36);
  
  for (var i = 0; i < length; i++) {
    seedNum = (seedNum * 1103515245 + 12345) & 0x7fffffff;
    var index = seedNum % chars.length;
    result += chars.charAt(index);
  }
  
  return result;
}

/**
 * URL 코드에서 ID 추출
 */
function decodeUrlCode(code) {
  try {
    // 앞뒤 5자리 제거
    var coreCode = code.substring(5, code.length - 5);
    
    // Base64 디코딩
    var decoded = Utilities.newBlob(
      Utilities.base64Decode(
        coreCode.replace(/-/g, '+').replace(/_/g, '/')
      )
    ).getDataAsString();
    
    // ID 부분 추출
    var parts = decoded.split(':');
    if (parts.length < 3) return null;
    
    return parseInt(parts[0], 36);
  } catch (error) {
    Logger.log('❌ URL 디코딩 실패: ' + error.toString());
    return null;
  }
}

/**
 * QNA 시트 가져오기 (없으면 생성)
 */
function getQnASheet() {
  try {
    const ss = getQnASpreadsheet();
    let sheet = ss.getSheetByName('QNA');
    
    if (!sheet) {
      sheet = ss.insertSheet('QNA');
      
      // 헤더 설정 (urlCode 추가!)
      const headers = [
        'id', 'urlCode', 'userEmail', 'userName', 'category', 'title',
        'content', 'answer', 'answeredBy', 'answeredAt',
        'status', 'isPublic', 'views', 'createdAt', 'updatedAt'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#4CAF50');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      
      // 열 너비 조정
      sheet.setColumnWidth(1, 60);   // id
      sheet.setColumnWidth(2, 300);  // urlCode (새로 추가!)
      sheet.setColumnWidth(3, 200);  // userEmail
      sheet.setColumnWidth(4, 120);  // userName
      sheet.setColumnWidth(5, 120);  // category
      sheet.setColumnWidth(6, 300);  // title
      sheet.setColumnWidth(7, 400);  // content
      sheet.setColumnWidth(8, 400);  // answer
      sheet.setColumnWidth(9, 200);  // answeredBy
      sheet.setColumnWidth(10, 150); // answeredAt
      sheet.setColumnWidth(11, 100); // status
      sheet.setColumnWidth(12, 80);  // isPublic
      sheet.setColumnWidth(13, 60);  // views
      sheet.setColumnWidth(14, 150); // createdAt
      sheet.setColumnWidth(15, 150); // updatedAt
      
      // 첫 행 고정
      sheet.setFrozenRows(1);
      
      Logger.log('✅ QNA 시트 생성 완료');
    }
    
    return sheet;
  } catch (error) {
    Logger.log('❌ QNA 시트 가져오기 실패: ' + error.toString());
    throw error;
  }
}

/**
 * 🔥 REPLIES 시트 가져오기 (없으면 생성)
 */
function getRepliesSheet() {
  try {
    const ss = getQnASpreadsheet();
    let sheet = ss.getSheetByName('REPLIES');
    
    if (!sheet) {
      sheet = ss.insertSheet('REPLIES');
      
      const headers = [
        'id', 'questionId', 'userEmail', 'userName', 'isAdmin', 'content', 'createdAt'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#2196F3');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setHorizontalAlignment('center');
      
      // 열 너비 조정
      sheet.setColumnWidth(1, 60);   // id
      sheet.setColumnWidth(2, 80);   // questionId
      sheet.setColumnWidth(3, 200);  // userEmail
      sheet.setColumnWidth(4, 120);  // userName
      sheet.setColumnWidth(5, 80);   // isAdmin
      sheet.setColumnWidth(6, 500);  // content
      sheet.setColumnWidth(7, 150);  // createdAt
      
      sheet.setFrozenRows(1);
      
      Logger.log('✅ REPLIES 시트 생성 완료');
    }
    
    return sheet;
  } catch (error) {
    Logger.log('❌ REPLIES 시트 가져오기 실패: ' + error.toString());
    throw error;
  }
}

/**
 * 날짜 포맷팅
 */
function formatDateTime(date) {
  return Utilities.formatDate(date, 'Asia/Seoul', 'yyyy. M. d. HH:mm:ss');
}

/**
 * JSON 응답 생성
 */
function createResponse(success, message, data = null) {
  const response = {
    success: success,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return ContentService
    .createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 관리자 권한 확인
 */
function isAdmin(email) {
  if (!email) {
    Logger.log('❌ isAdmin: 이메일 없음');
    return false;
  }
  
  try {
    Logger.log('🔍 관리자 권한 확인 시도: ' + email);
    
    // ✅ 관리자 이메일 목록 확인
    if (ADMIN_EMAILS.includes(email)) {
      Logger.log('✅ 관리자 확인: ' + email);
      return true;
    }
    
    Logger.log('❌ 일반 사용자: ' + email);
    return false;
  } catch (error) {
    Logger.log('❌ 관리자 권한 확인 실패: ' + error.toString());
    Logger.log('❌ 에러 스택: ' + error.stack);
    return false;
  }
}

/**
 * 카테고리 유효성 검사
 */
function isValidCategory(category) {
  return CATEGORIES.includes(category);
}

// ==================== HTTP 요청 처리 ====================

/**
 * GET 요청 처리
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    Logger.log('📥 Q&A GET 요청: ' + action);
    
    switch(action) {
      case 'getQuestions':
        return handleGetQuestions(e.parameter);
      case 'getQuestion':
        return handleGetQuestion(e.parameter);
      case 'getMyQuestions':
        return handleGetMyQuestions(e.parameter);
      case 'getCategories':
        return handleGetCategories();
      case 'getReplies':
        return handleGetReplies(e.parameter);
      case 'getPendingQuestions':
        return getPendingQuestions(e.parameter);
      case 'getStatistics':
        return getQnAStatistics(e.parameter);
      default:
        return createResponse(false, 'Invalid action: ' + action);
    }
  } catch (error) {
    Logger.log('❌ GET 요청 처리 실패: ' + error.toString());
    return createResponse(false, 'GET 요청 처리 실패: ' + error.message);
  }
}

/**
 * POST 요청 처리
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    Logger.log('📥 Q&A POST 요청: ' + action);
    
    switch(action) {
      case 'createQuestion':
        return handleCreateQuestion(data);
      case 'answerQuestion':
        return handleAnswerQuestion(data);
      case 'addReply':
        return handleAddReply(data);
      case 'updateQuestion':
        return handleUpdateQuestion(data);
      case 'deleteQuestion':
        return handleDeleteQuestion(data);
      case 'incrementViews':
        return handleIncrementViews(data);
      default:
        return createResponse(false, 'Invalid action: ' + action);
    }
  } catch (error) {
    Logger.log('❌ POST 요청 처리 실패: ' + error.toString());
    return createResponse(false, 'POST 요청 처리 실패: ' + error.message);
  }
}

// ==================== 질문 작성 ====================

function handleCreateQuestion(data) {
  try {
    const { userEmail, userName, category, title, content, isPublic } = data;
    
    // 유효성 검사
    if (!userEmail || !userName || !category || !title || !content) {
      return createResponse(false, '필수 항목을 모두 입력해주세요.');
    }
    
    // 카테고리 유효성 검사
    if (!isValidCategory(category)) {
      return createResponse(false, '유효하지 않은 카테고리입니다.');
    }
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    try {
      const sheet = getQnASheet();
      
      // 새 ID 생성
      const lastRow = sheet.getLastRow();
      const newId = lastRow > 1 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
      
      // 🔥 URL 코드 생성 (고정)
      const urlCode = generateUrlCode(newId, userEmail, userName);
      
      // 현재 시간
      const now = formatDateTime(new Date());
      
      // 데이터 추가
      const newRow = [
        newId,                              // A: id
        urlCode,                            // B: urlCode
        userEmail,                          // C: userEmail
        userName,                           // D: userName
        category,                           // E: category
        title,                              // F: title
        content,                            // G: content
        '',                                 // H: answer (빈 값)
        '',                                 // I: answeredBy (빈 값)
        '',                                 // J: answeredAt (빈 값)
        'pending',                          // K: status
        isPublic !== false ? true : false,  // L: isPublic
        0,                                  // M: views
        now,                                // N: createdAt
        now                                 // O: updatedAt
      ];
      
      sheet.appendRow(newRow);
      
      // 상태 표시 (조건부 서식)
      const newRowIndex = sheet.getLastRow();
      const statusCell = sheet.getRange(newRowIndex, 11);
      statusCell.setBackground('#FFF9C4'); // 노란색 (대기 중)
      
      Logger.log('✅ 질문 작성 완료: ID=' + newId + ', urlCode=' + urlCode);
      
      return createResponse(true, '질문이 등록되었습니다.', {
        id: newId,
        urlCode: urlCode,
        createdAt: now
      });
      
    } finally {
      lock.releaseLock();
    }
    
  } catch (error) {
    Logger.log('❌ 질문 작성 실패: ' + error.toString());
    return createResponse(false, '질문 작성 실패: ' + error.message);
  }
}

// ==================== 🔥 새 답변 추가 (채팅 스타일) ====================

function handleAddReply(data) {
  try {
    const { questionId, userEmail, userName, content } = data;
    
    if (!questionId || !userEmail || !userName || !content) {
      return createResponse(false, '필수 항목을 모두 입력해주세요.');
    }
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    try {
      const repliesSheet = getRepliesSheet();
      const qnaSheet = getQnASheet();
      
      // 새 답변 ID 생성
      const lastRow = repliesSheet.getLastRow();
      const newId = lastRow > 1 ? repliesSheet.getRange(lastRow, 1).getValue() + 1 : 1;
      
      const now = formatDateTime(new Date());
      const userIsAdmin = isAdmin(userEmail);
      
      // 답변 추가
      const newRow = [
        newId,           // A: id
        questionId,      // B: questionId
        userEmail,       // C: userEmail
        userName,        // D: userName
        userIsAdmin,     // E: isAdmin
        content,         // F: content
        now              // G: createdAt
      ];
      
      repliesSheet.appendRow(newRow);
      
      // 질문 상태 업데이트 (pending -> answered)
      const qnaData = qnaSheet.getDataRange().getValues();
      const qnaRowIndex = qnaData.findIndex(row => row[0] === questionId);
      
      if (qnaRowIndex !== -1) {
        qnaSheet.getRange(qnaRowIndex + 1, 11).setValue('answered');  // status
        qnaSheet.getRange(qnaRowIndex + 1, 15).setValue(now);         // updatedAt
        
        // 상태 셀 색상 변경
        const statusCell = qnaSheet.getRange(qnaRowIndex + 1, 11);
        statusCell.setBackground('#C8E6C9'); // 초록색
      }
      
      Logger.log('✅ 답변 추가 완료: ID=' + newId);
      
      return createResponse(true, '답변이 등록되었습니다.', {
        id: newId,
        createdAt: now
      });
      
    } finally {
      lock.releaseLock();
    }
    
  } catch (error) {
    Logger.log('❌ 답변 추가 실패: ' + error.toString());
    return createResponse(false, '답변 추가 실패: ' + error.message);
  }
}

// ==================== 🔥 답변 목록 조회 ====================

function handleGetReplies(params) {
  try {
    const questionId = parseInt(params.questionId);
    
    if (!questionId) {
      return createResponse(false, '질문 ID가 필요합니다.');
    }
    
    const sheet = getRepliesSheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'Success', []);
    }
    
    const rows = data.slice(1);
    const replies = rows
      .filter(row => row[1] === questionId)
      .map(row => ({
        id: row[0],
        questionId: row[1],
        userEmail: row[2],
        userName: row[3],
        isAdmin: row[4],
        content: row[5],
        createdAt: row[6]
      }))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    Logger.log(`✅ 답변 목록 조회 완료: ${replies.length}건`);
    
    return createResponse(true, 'Success', replies);
    
  } catch (error) {
    Logger.log('❌ 답변 목록 조회 실패: ' + error.toString());
    return createResponse(false, '답변 목록 조회 실패: ' + error.message);
  }
}

// ==================== 질문 목록 조회 ====================

function handleGetQuestions(params) {
  try {
    const sheet = getQnASheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'Success', {
        questions: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }
    
    // 헤더 제외
    const rows = data.slice(1);
    
    // 필터링
    let filtered = rows.filter(row => {
      // 🔥 디버그 로그 추가
      Logger.log(`질문 ID ${row[0]}: isPublic = ${row[11]} (타입: ${typeof row[11]}), userEmail = ${row[2]}`);
      
      // 카테고리 필터
      if (params.category && params.category !== 'all' && row[4] !== params.category) {
        return false;
      }
      
      // 상태 필터
      if (params.status && params.status !== 'all' && row[10] !== params.status) {
        return false;
      }
      
      // 🔥 공개 여부 필터링 (숫자, 불리언, 문자열 모두 처리)
      const rawIsPublic = row[11]; // L열 (isPublic)
      const isPublic = rawIsPublic === true || 
                       rawIsPublic === 1 || 
                       rawIsPublic === '1' ||
                       rawIsPublic === 'TRUE' || 
                       rawIsPublic === 'true';
      
      const userEmail = params.userEmail;
      const questionOwnerEmail = row[2]; // C열 (userEmail)
      const isAdminUser = userEmail && isAdmin(userEmail);
      const isOwner = userEmail && questionOwnerEmail === userEmail;
      
      Logger.log(`  → isPublic: ${isPublic}, isAdmin: ${isAdminUser}, isOwner: ${isOwner}`);
      
      // 🎯 권한별 필터링
      // 1. 관리자: 모든 질문 볼 수 있음
      if (isAdminUser) {
        Logger.log(`  → ✅ 관리자 - 표시`);
        return true;
      }
      
      // 2. 작성자: 자신의 질문은 공개/비공개 상관없이 볼 수 있음
      if (isOwner) {
        Logger.log(`  → ✅ 작성자 본인 - 표시`);
        return true;
      }
      
      // 3. 일반 사용자/비회원: 공개 질문만 볼 수 있음
      if (isPublic) {
        Logger.log(`  → ✅ 공개 질문 - 표시`);
        return true;
      }
      
      // 4. 비공개 질문이고 관리자도 작성자도 아님
      Logger.log(`  → ❌ 비공개 질문 - 숨김`);
      return false;
    });
    
    // 정렬 (최신순)
    filtered.sort((a, b) => {
      const dateA = new Date(a[13]);
      const dateB = new Date(b[13]);
      return dateB - dateA;
    });
    
    // 페이지네이션
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    const paginated = filtered.slice(start, end);
    
    // 데이터 매핑
    const questions = paginated.map(row => ({
      id: row[0],
      urlCode: row[1],
      userEmail: row[2],
      userName: row[3],
      category: row[4],
      title: row[5],
      content: row[6],
      answer: row[7],
      answeredBy: row[8],
      answeredAt: row[9],
      status: row[10],
      isPublic: row[11],
      views: row[12],
      createdAt: row[13],
      updatedAt: row[14]
    }));
    
    Logger.log(`✅ 질문 목록 조회 완료: ${questions.length}건`);
    
    return createResponse(true, 'Success', {
      questions: questions,
      total: filtered.length,
      page: page,
      totalPages: Math.ceil(filtered.length / limit)
    });
    
  } catch (error) {
    Logger.log('❌ 질문 목록 조회 실패: ' + error.toString());
    return createResponse(false, '질문 목록 조회 실패: ' + error.message);
  }
}

// ==================== 질문 상세 조회 ====================

function handleGetQuestion(params) {
  try {
    const sheet = getQnASheet();
    const id = parseInt(params.id);
    
    if (!id) {
      return createResponse(false, 'ID가 필요합니다.');
    }
    
    const data = sheet.getDataRange().getValues();
    const row = data.find(r => r[0] === id);
    
    if (!row) {
      return createResponse(false, '질문을 찾을 수 없습니다.');
    }
    
    // 권한 체크 (비공개 질문)
    const isPublic = row[11];
    const userEmail = params.userEmail;
    const isOwner = row[2] === userEmail;
    const isAdminUser = userEmail && isAdmin(userEmail);
    
    if (!isPublic && !isOwner && !isAdminUser) {
      return createResponse(false, '접근 권한이 없습니다.');
    }
    
    const question = {
      id: row[0],
      urlCode: row[1],
      userEmail: row[2],
      userName: row[3],
      category: row[4],
      title: row[5],
      content: row[6],
      answer: row[7],
      answeredBy: row[8],
      answeredAt: row[9],
      status: row[10],
      isPublic: row[11],
      views: row[12],
      createdAt: row[13],
      updatedAt: row[14]
    };
    
    Logger.log('✅ 질문 상세 조회 완료: ID=' + id);
    
    return createResponse(true, 'Success', question);
    
  } catch (error) {
    Logger.log('❌ 질문 상세 조회 실패: ' + error.toString());
    return createResponse(false, '질문 상세 조회 실패: ' + error.message);
  }
}

// ==================== 답변 등록 (관리자만 - 하위 호환성) ====================

function handleAnswerQuestion(data) {
  try {
    const { id, answer, answeredBy } = data;
    
    // 관리자 권한 확인
    if (!isAdmin(answeredBy)) {
      return createResponse(false, '관리자 권한이 필요합니다.');
    }
    
    if (!answer || answer.trim() === '') {
      return createResponse(false, '답변 내용을 입력해주세요.');
    }
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    try {
      const sheet = getQnASheet();
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      // 질문 찾기
      const rowIndex = values.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        return createResponse(false, '질문을 찾을 수 없습니다.');
      }
      
      const now = formatDateTime(new Date());
      
      // 답변 업데이트
      sheet.getRange(rowIndex + 1, 8).setValue(answer);         // H: answer
      sheet.getRange(rowIndex + 1, 9).setValue(answeredBy);     // I: answeredBy
      sheet.getRange(rowIndex + 1, 10).setValue(now);           // J: answeredAt
      sheet.getRange(rowIndex + 1, 11).setValue('answered');    // K: status
      sheet.getRange(rowIndex + 1, 15).setValue(now);           // O: updatedAt
      
      // 상태 셀 색상 변경
      const statusCell = sheet.getRange(rowIndex + 1, 11);
      statusCell.setBackground('#C8E6C9'); // 초록색 (답변 완료)
      
      Logger.log('✅ 답변 등록 완료: ID=' + id);
      
      return createResponse(true, '답변이 등록되었습니다.', {
        id: id,
        answeredAt: now
      });
      
    } finally {
      lock.releaseLock();
    }
    
  } catch (error) {
    Logger.log('❌ 답변 등록 실패: ' + error.toString());
    return createResponse(false, '답변 등록 실패: ' + error.message);
  }
}

// ==================== 질문 수정 (작성자만) ====================

function handleUpdateQuestion(data) {
  try {
    const { id, userEmail, title, content, category } = data;
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    try {
      const sheet = getQnASheet();
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      // 질문 찾기
      const rowIndex = values.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        return createResponse(false, '질문을 찾을 수 없습니다.');
      }
      
      // 작성자 확인
      const questionOwner = values[rowIndex][2];
      if (questionOwner !== userEmail) {
        return createResponse(false, '수정 권한이 없습니다.');
      }
      
      const now = formatDateTime(new Date());
      
      // 업데이트
      if (title) {
        sheet.getRange(rowIndex + 1, 6).setValue(title);
      }
      if (content) {
        sheet.getRange(rowIndex + 1, 7).setValue(content);
      }
      if (category && isValidCategory(category)) {
        sheet.getRange(rowIndex + 1, 5).setValue(category);
      }
      sheet.getRange(rowIndex + 1, 15).setValue(now); // updatedAt
      
      Logger.log('✅ 질문 수정 완료: ID=' + id);
      
      return createResponse(true, '질문이 수정되었습니다.');
      
    } finally {
      lock.releaseLock();
    }
    
  } catch (error) {
    Logger.log('❌ 질문 수정 실패: ' + error.toString());
    return createResponse(false, '질문 수정 실패: ' + error.message);
  }
}

// ==================== 질문 삭제 (작성자/관리자) ====================

function handleDeleteQuestion(data) {
  try {
    const { id, userEmail } = data;
    
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    
    try {
      const sheet = getQnASheet();
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      // 질문 찾기
      const rowIndex = values.findIndex(row => row[0] === id);
      
      if (rowIndex === -1) {
        return createResponse(false, '질문을 찾을 수 없습니다.');
      }
      
      // 권한 확인
      const questionOwner = values[rowIndex][2];
      const isOwner = questionOwner === userEmail;
      const isAdminUser = isAdmin(userEmail);
      
      if (!isOwner && !isAdminUser) {
        return createResponse(false, '삭제 권한이 없습니다.');
      }
      
      // 🔥 관련 답변도 삭제
      const repliesSheet = getRepliesSheet();
      const repliesData = repliesSheet.getDataRange().getValues();
      
      // 뒤에서부터 삭제 (인덱스 변경 방지)
      for (let i = repliesData.length - 1; i > 0; i--) {
        if (repliesData[i][1] === id) {
          repliesSheet.deleteRow(i + 1);
        }
      }
      
      // 질문 삭제
      sheet.deleteRow(rowIndex + 1);
      
      Logger.log('✅ 질문 삭제 완료: ID=' + id);
      
      return createResponse(true, '질문이 삭제되었습니다.');
      
    } finally {
      lock.releaseLock();
    }
    
  } catch (error) {
    Logger.log('❌ 질문 삭제 실패: ' + error.toString());
    return createResponse(false, '질문 삭제 실패: ' + error.message);
  }
}

// ==================== 조회수 증가 ====================

function handleIncrementViews(data) {
  try {
    const { id } = data;
    
    const sheet = getQnASheet();
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // 질문 찾기
    const rowIndex = values.findIndex(row => row[0] === id);
    
    if (rowIndex === -1) {
      return createResponse(false, '질문을 찾을 수 없습니다.');
    }
    
    const currentViews = values[rowIndex][12] || 0;
    const newViews = currentViews + 1;
    
    sheet.getRange(rowIndex + 1, 13).setValue(newViews);
    
    Logger.log('✅ 조회수 증가: ID=' + id + ', Views=' + newViews);
    
    return createResponse(true, 'Success', { views: newViews });
    
  } catch (error) {
    Logger.log('❌ 조회수 증가 실패: ' + error.toString());
    return createResponse(false, '조회수 증가 실패: ' + error.message);
  }
}

// ==================== 내 질문 목록 조회 ====================

function handleGetMyQuestions(params) {
  try {
    const { userEmail } = params;
    
    if (!userEmail) {
      return createResponse(false, '이메일이 필요합니다.');
    }
    
    const sheet = getQnASheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'Success', {
        questions: [],
        total: 0
      });
    }
    
    const rows = data.slice(1);
    
    // 내 질문만 필터링
    const myQuestions = rows.filter(row => row[2] === userEmail);
    
    // 정렬 (최신순)
    myQuestions.sort((a, b) => {
      const dateA = new Date(a[13]);
      const dateB = new Date(b[13]);
      return dateB - dateA;
    });
    
    // 데이터 매핑
    const questions = myQuestions.map(row => ({
      id: row[0],
      urlCode: row[1],
      userEmail: row[2],
      userName: row[3],
      category: row[4],
      title: row[5],
      content: row[6],
      answer: row[7],
      answeredBy: row[8],
      answeredAt: row[9],
      status: row[10],
      isPublic: row[11],
      views: row[12],
      createdAt: row[13],
      updatedAt: row[14]
    }));
    
    Logger.log(`✅ 내 질문 조회 완료: ${questions.length}건`);
    
    return createResponse(true, 'Success', {
      questions: questions,
      total: questions.length
    });
    
  } catch (error) {
    Logger.log('❌ 내 질문 조회 실패: ' + error.toString());
    return createResponse(false, '내 질문 조회 실패: ' + error.message);
  }
}

// ==================== 카테고리 목록 조회 ====================

function handleGetCategories() {
  try {
    Logger.log('✅ 카테고리 조회 성공');
    return createResponse(true, 'Success', {
      categories: CATEGORIES
    });
  } catch (error) {
    Logger.log('❌ 카테고리 조회 실패: ' + error.toString());
    return createResponse(false, '카테고리 조회 실패: ' + error.message);
  }
}

// ==================== 답변 대기 질문 조회 (관리자용) ====================

function getPendingQuestions(params) {
  try {
    // 관리자 권한 확인
    if (!params.userEmail || !isAdmin(params.userEmail)) {
      return createResponse(false, '관리자 권한이 필요합니다.');
    }
    
    const sheet = getQnASheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'Success', {
        questions: [],
        total: 0
      });
    }
    
    const rows = data.slice(1);
    const pending = rows.filter(row => row[10] === 'pending');
    
    // 정렬 (오래된 순)
    pending.sort((a, b) => {
      const dateA = new Date(a[13]);
      const dateB = new Date(b[13]);
      return dateA - dateB;
    });
    
    const questions = pending.map(row => ({
      id: row[0],
      urlCode: row[1],
      userEmail: row[2],
      userName: row[3],
      category: row[4],
      title: row[5],
      content: row[6],
      createdAt: row[13],
      views: row[12]
    }));
    
    return createResponse(true, 'Success', {
      questions: questions,
      total: questions.length
    });
    
  } catch (error) {
    Logger.log('❌ 답변 대기 질문 조회 실패: ' + error.toString());
    return createResponse(false, '답변 대기 질문 조회 실패: ' + error.message);
  }
}

// ==================== 통계 조회 (관리자용) ====================

function getQnAStatistics(params) {
  try {
    // 관리자 권한 확인
    if (!params.userEmail || !isAdmin(params.userEmail)) {
      return createResponse(false, '관리자 권한이 필요합니다.');
    }
    
    const sheet = getQnASheet();
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return createResponse(true, 'Success', {
        totalQuestions: 0,
        pendingQuestions: 0,
        answeredQuestions: 0,
        categoryCounts: {},
        averageResponseTime: 0
      });
    }
    
    const rows = data.slice(1);
    
    let totalQuestions = rows.length;
    let pendingQuestions = 0;
    let answeredQuestions = 0;
    let categoryCounts = {};
    let responseTimes = [];
    
    rows.forEach(row => {
      const status = row[10];
      const category = row[4];
      const createdAt = new Date(row[13]);
      const answeredAt = row[9] ? new Date(row[9]) : null;
      
      // 상태별 카운트
      if (status === 'pending') {
        pendingQuestions++;
      } else if (status === 'answered') {
        answeredQuestions++;
        
        // 응답 시간 계산 (시간 단위)
        if (answeredAt) {
          const responseTime = (answeredAt - createdAt) / (1000 * 60 * 60);
          responseTimes.push(responseTime);
        }
      }
      
      // 카테고리별 카운트
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    // 평균 응답 시간
    const averageResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
    
    return createResponse(true, 'Success', {
      totalQuestions: totalQuestions,
      pendingQuestions: pendingQuestions,
      answeredQuestions: answeredQuestions,
      categoryCounts: categoryCounts,
      averageResponseTime: Math.round(averageResponseTime * 10) / 10
    });
    
  } catch (error) {
    Logger.log('❌ 통계 조회 실패: ' + error.toString());
    return createResponse(false, '통계 조회 실패: ' + error.message);
  }
}

// ==================== 테스트 함수 ====================

/**
 * 시트 초기화 테스트
 */
function testInitialize() {
  const qnaSheet = getQnASheet();
  const repliesSheet = getRepliesSheet();
  Logger.log('✅ QNA 시트 초기화 완료');
  Logger.log('✅ REPLIES 시트 초기화 완료');
  Logger.log('📊 스프레드시트 ID: ' + SpreadsheetApp.getActiveSpreadsheet().getId());
  Logger.log('📋 QNA 시트: ' + qnaSheet.getName());
  Logger.log('📋 REPLIES 시트: ' + repliesSheet.getName());
}

/**
 * 샘플 데이터 생성
 */
function createSampleData() {
  const samples = [
    {
      userEmail: 'test1@example.com',
      userName: '홍길동',
      category: '수강신청',
      title: '수강 신청 방법 문의',
      content: '수강 신청은 어떻게 하나요?',
      isPublic: true
    },
    {
      userEmail: 'test2@example.com',
      userName: '김철수',
      category: '자격증 발급',
      title: '자격증 발급 기간',
      content: '자격증은 얼마나 걸리나요?',
      isPublic: true
    },
    {
      userEmail: 'test3@example.com',
      userName: '이영희',
      category: '결제/환불',
      title: '환불 문의',
      content: '환불은 어떻게 하나요?',
      isPublic: true
    }
  ];
  
  samples.forEach(s => {
    handleCreateQuestion({
      action: 'createQuestion',
      ...s
    });
  });
  
  Logger.log('✅ 샘플 데이터 ' + samples.length + '건 생성 완료');
}

/**
 * URL 코드 테스트
 */
function testUrlCode() {
  Logger.log('=== URL 코드 테스트 ===');
  
  const testCases = [
    { id: 1, email: 'admin@gmail.com', name: '관리자' },
    { id: 42, email: 'test@example.com', name: '홍길동' }
  ];
  
  testCases.forEach(function(test) {
    var code1 = generateUrlCode(test.id, test.email, test.name);
    var code2 = generateUrlCode(test.id, test.email, test.name);
    var decoded = decodeUrlCode(code1);
    
    Logger.log('ID ' + test.id + ':');
    Logger.log('  코드 1: ' + code1);
    Logger.log('  코드 2: ' + code2);
    Logger.log('  동일성: ' + (code1 === code2 ? '✅' : '❌'));
    Logger.log('  디코딩: ' + decoded);
    Logger.log('  일치: ' + (test.id === decoded ? '✅' : '❌'));
    Logger.log('');
  });
}

// ==================== 🎯 업데이트 가이드 ====================
/*

📋 Google Sheets 구조:

1. QNA 시트:
   - id, urlCode, userEmail, userName, category, title, content
   - answer, answeredBy, answeredAt, status, isPublic, views
   - createdAt, updatedAt

2. REPLIES 시트: (🔥 채팅 스타일 답변)
   - id, questionId, userEmail, userName, isAdmin, content, createdAt

🔄 업데이트 방법:

1. Google Sheets 열기
2. Extensions → Apps Script
3. 이 코드 전체 복사 → 붙여넣기
4. 저장 (Ctrl+S)
5. Deploy → Manage Deployments → Edit → Version: New version
6. Deploy

✅ 테스트:
- Apps Script 에디터에서 testInitialize() 실행
- QNA, REPLIES 시트 자동 생성 확인
- 프론트엔드에서 질문 작성 → 답변 추가 테스트

🔐 URL 시스템:
- 질문 생성 시 자동으로 urlCode 생성
- 같은 질문은 항상 동일한 URL
- 프론트엔드에서 urlCode로 접근

*/
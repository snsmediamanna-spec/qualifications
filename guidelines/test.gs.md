// ==================== 설정 ====================

const EXAM_SPREADSHEET_ID = '15jiCLc57XAouv0rwbJejFosHkWa6uIdaXTRAspoaekY';

// ==================== 스프레드시트 ====================

function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(EXAM_SPREADSHEET_ID);
  } catch (error) {
    Logger.log('❌ 스프레드시트 열기 실패: ' + error.toString());
    throw new Error('스프레드시트를 열 수 없습니다.');
  }
}

// ==================== 유틸리티 ====================

function createJSONResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  
  // ✅ CORS 헤더는 Apps Script에서 자동으로 처리되므로 별도 설정 불필요
  return output;
}

// ✅ 구글 드라이브 이미지 URL을 직접 접근 가능한 URL로 변환
function convertDriveImageUrl(driveUrl) {
  if (!driveUrl || driveUrl === '') return '';
  
  try {
    // 이미 변환된 URL인 경우
    if (driveUrl.includes('drive.google.com/uc?export=view&id=')) {
      return driveUrl;
    }
    
    // 다양한 구글 드라이브 URL 패턴 처리
    let fileId = '';
    
    // 패턴 1: https://drive.google.com/file/d/FILE_ID/view
    const pattern1 = /\/file\/d\/([^\/]+)/;
    const match1 = driveUrl.match(pattern1);
    if (match1) {
      fileId = match1[1];
    }
    
    // 패턴 2: https://drive.google.com/open?id=FILE_ID
    const pattern2 = /[?&]id=([^&]+)/;
    const match2 = driveUrl.match(pattern2);
    if (match2) {
      fileId = match2[1];
    }
    
    // 패턴 3: 이미 FILE_ID만 있는 경우
    if (!fileId && driveUrl.length > 20 && !driveUrl.includes('/')) {
      fileId = driveUrl;
    }
    
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return driveUrl; // 변환 실패시 원본 반환
  } catch (error) {
    Logger.log('⚠️ URL 변환 실패: ' + error.toString());
    return driveUrl;
  }
}

// ==================== 시험 문제 조회 ====================

function getExamQuestions() {
  try {
    Logger.log('📚 시험 문제 조회 시작');
    
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('시험문제');
    
    if (!sheet) {
      return { success: false, message: '시험문제 시트를 찾을 수 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return { success: false, message: '등록된 문제가 없습니다.' };
    }
    
    const questionCount = lastRow - 1;
    // ✅ D열(이미지URL) 추가
    const data = sheet.getRange(2, 1, questionCount, 4).getValues();
    
    const questions = data.map((row, index) => {
      // ✅ B열(정답)을 숫자로 읽기 - Google Sheets에 숫자로 저장되어 있음
      let correctAnswer = 1; // 기본값 O
      
      const rawAnswer = row[1]; // B열 값
      
      // 타입에 따라 처리
      if (typeof rawAnswer === 'number') {
        // ✅ 이미 숫자인 경우 (1 또는 2)
        correctAnswer = rawAnswer === 2 ? 2 : 1;
      } else if (typeof rawAnswer === 'string') {
        // 문자열인 경우 변환
        const answerStr = String(rawAnswer).trim().toUpperCase();
        if (answerStr === 'X' || answerStr === '2') {
          correctAnswer = 2;
        } else {
          correctAnswer = 1; // O, 1, 또는 기타
        }
      }
      
      Logger.log(`문제 ${index + 1}: 원본=${rawAnswer} (타입:${typeof rawAnswer}) → 변환=${correctAnswer}`);
      
      return {
        id: index + 1,
        score: Number(row[0]) || 1,
        correctAnswer: correctAnswer, // ✅ 1 또는 2
        question: String(row[2]).trim(),
        imageUrl: convertDriveImageUrl(String(row[3]).trim()) // ✅ 이미지 URL 변환
      };
    });
    
    Logger.log('✅ 시험 문제 조회 완료: ' + questions.length + '문제');
    Logger.log('📊 정답 분포: O=' + questions.filter(q => q.correctAnswer === 1).length + ', X=' + questions.filter(q => q.correctAnswer === 2).length);
    
    return { success: true, questions: questions, message: '문제 조회 완료' };
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { success: false, message: '문제 조회 실패: ' + error.message };
  }
}

// ==================== 답안 제출 ====================

function submitExamAnswers(userEmail, answers) {
  try {
    Logger.log('📝 시험 답안 제출 시작');
    Logger.log('📧 응시자: ' + userEmail);
    Logger.log('📄 답안: ' + JSON.stringify(answers));
    
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('시험문제');
    
    if (!sheet) {
      return { success: false, message: '시험문제 시트를 찾을 수 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const questionCount = lastRow - 1;
    
    if (questionCount <= 0) {
      return { success: false, message: '등록된 문제가 없습니다.' };
    }
    
    if (answers.length !== questionCount) {
      return {
        success: false,
        message: `답안 개수(${answers.length})가 문제 개수(${questionCount})와 일치하지 않습니다.`
      };
    }
    
    // 기존 응시 여부 확인
    const lastColumn = sheet.getLastColumn();
    const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    
    let studentCol = -1;
    
    // ✅ E열(5)부터 시작해서 기존 응시자 찾기 (D열은 이미지URL)
    for (let col = 4; col < headerRow.length; col++) {
      if (headerRow[col] === userEmail) {
        studentCol = col + 1;
        Logger.log('⚠️ 기존 응시자 발견: ' + userEmail + ' (열 ' + studentCol + ')');
        break;
      }
    }
    
    // 새 응시자면 새 열 추가
    if (studentCol === -1) {
      studentCol = lastColumn + 1;
      sheet.getRange(1, studentCol).setValue(userEmail);
      Logger.log('✅ 새 응시자 추가: ' + userEmail + ' (열 ' + studentCol + ')');
    }
    
    // 답안 저장
    for (let i = 0; i < answers.length; i++) {
      const row = i + 2;
      sheet.getRange(row, studentCol).setValue(answers[i]);
    }
    
    Logger.log('✅ 답안 저장 완료');
    
    // 채점
    const gradeResult = gradeExam(userEmail);
    
    // 결과 저장
    saveExamResult(userEmail, answers, gradeResult);
    
    return {
      success: true,
      message: '답안이 제출되었습니다.',
      userEmail: userEmail,
      column: studentCol,
      gradeResult: gradeResult
    };
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { success: false, message: '답안 제출 실패: ' + error.message };
  }
}

// ==================== 채점 ====================

function gradeExam(userEmail) {
  try {
    Logger.log('📊 채점 시작: ' + userEmail);
    
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('시험문제');
    
    if (!sheet) {
      return { success: false, message: '시험문제 시트를 찾을 수 없습니다.' };
    }
    
    // 응시자 열 찾기
    const lastColumn = sheet.getLastColumn();
    const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    
    let studentCol = -1;
    
    // ✅ E열(4)부터 시작 (D열은 이미지URL)
    for (let col = 4; col < headerRow.length; col++) {
      if (headerRow[col] === userEmail) {
        studentCol = col + 1;
        break;
      }
    }
    
    if (studentCol === -1) {
      return { success: false, message: '응시자를 찾을 수 없습니다.' };
    }
    
    const lastRow = sheet.getLastRow();
    const questionCount = lastRow - 1;
    
    // 배점, 정답, 학생답안 가져오기
    const scores = sheet.getRange(2, 1, questionCount, 1).getValues();
    const correctAnswers = sheet.getRange(2, 2, questionCount, 1).getValues();
    const studentAnswers = sheet.getRange(2, studentCol, questionCount, 1).getValues();
    
    let totalScore = 0;
    let maxScore = 0;
    let correctCount = 0;
    const details = [];
    
    for (let i = 0; i < questionCount; i++) {
      const score = Number(scores[i][0]) || 0;
      const correctAnswer = String(correctAnswers[i][0]).trim();
      const studentAnswer = String(studentAnswers[i][0]).trim();
      
      maxScore += score;
      
      const isCorrect = studentAnswer.toLowerCase() === correctAnswer.toLowerCase();
      if (isCorrect) {
        totalScore += score;
        correctCount++;
      }
      
      details.push({
        question: i + 1,
        score: score,
        correctAnswer: correctAnswer,
        studentAnswer: studentAnswer,
        isCorrect: isCorrect,
        earnedScore: isCorrect ? score : 0
      });
    }
    
    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= 60;
    
    Logger.log(`✅ 채점 완료: ${totalScore}/${maxScore} (${percentage}%)`);
    
    return {
      success: true,
      userEmail: userEmail,
      totalScore: totalScore,
      maxScore: maxScore,
      score: totalScore,
      percentage: percentage,
      correctCount: correctCount,
      questionCount: questionCount,
      totalQuestions: questionCount,
      passed: passed,
      details: details,
      results: details,
      message: '채점 완료'
    };
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { success: false, message: '채점 실패: ' + error.message };
  }
}

// ==================== 결과 저장 ====================

function saveExamResult(userEmail, answers, gradeResult) {
  try {
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
    
    const answerString = answers.join(',');
    const resultString = gradeResult.details.map(d => d.isCorrect ? 'O' : 'X').join(',');
    
    resultSheet.appendRow([
      userEmail,
      new Date(),
      gradeResult.totalScore,
      gradeResult.passed ? '합격' : '불합격',
      answerString,
      resultString
    ]);
    
    Logger.log('💾 시험 결과 저장 완료');
    
  } catch (error) {
    Logger.log('❌ 시험 결과 저장 실패: ' + error.toString());
  }
}

// ==================== 이전 답안 불러오기 ====================

function getUserPreviousAnswers(userEmail) {
  try {
    Logger.log('📋 이전 답안 조회: ' + userEmail);
    
    const ss = getSpreadsheet();
    const sheet = ss.getSheetByName('시험문제');
    
    if (!sheet) {
      return { success: false, message: '시험문제 시트를 찾을 수 없습니다.' };
    }
    
    // 응시자 열 찾기
    const lastColumn = sheet.getLastColumn();
    const headerRow = sheet.getRange(1, 1, 1, lastColumn).getValues()[0];
    
    let studentCol = -1;
    
    // ✅ E열(4)부터 시작
    for (let col = 4; col < headerRow.length; col++) {
      if (headerRow[col] === userEmail) {
        studentCol = col + 1;
        break;
      }
    }
    
    if (studentCol === -1) {
      return { 
        success: false, 
        message: '이전 답안이 없습니다.',
        hasAnswers: false
      };
    }
    
    const lastRow = sheet.getLastRow();
    const questionCount = lastRow - 1;
    
    // 이전 답안 가져오기
    const previousAnswers = sheet.getRange(2, studentCol, questionCount, 1).getValues();
    const answers = previousAnswers.map(row => String(row[0]).trim());
    
    Logger.log('✅ 이전 답안 조회 완료: ' + answers.length + '개');
    
    return {
      success: true,
      hasAnswers: true,
      userEmail: userEmail,
      answers: answers,
      message: '이전 답안 조회 완료'
    };
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { 
      success: false, 
      message: '이전 답안 조회 실패: ' + error.message,
      hasAnswers: false
    };
  }
}

// ==================== 결과 조회 ====================

function getExamResult(userEmail) {
  try {
    Logger.log('📋 시험 결과 조회: ' + userEmail);
    
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
      return { success: true, result: latestResult, message: '시험 결과 조회 완료' };
    } else {
      return { success: false, message: '시험 결과를 찾을 수 없습니다.' };
    }
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { success: false, message: '결과 조회 실패: ' + error.message };
  }
}

function getAllExamResults() {
  try {
    Logger.log('📋 전체 시험 결과 조회');
    
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
    
    return {
      success: true,
      results: results,
      totalStudents: results.length,
      message: '전체 결과 조회 완료'
    };
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { success: false, message: '전체 결과 조회 실패: ' + error.message };
  }
}

function getUserExamResults(userEmail) {
  try {
    Logger.log('📋 특정 사용자 시험 결과 조회: ' + userEmail);
    
    const ss = getSpreadsheet();
    const resultSheet = ss.getSheetByName('시험결과');
    
    if (!resultSheet || resultSheet.getLastRow() <= 1) {
      return { success: true, results: [], message: '시험 결과가 없습니다.' };
    }
    
    const data = resultSheet.getDataRange().getValues();
    
    const results = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === userEmail) {
        results.push({
          email: data[i][0],
          date: data[i][1],
          score: data[i][2],
          passed: data[i][3],
          answers: data[i][4],
          results: data[i][5]
        });
      }
    }
    
    Logger.log('✅ 사용자 시험 결과 조회 완료: ' + results.length + '건');
    
    return { 
      success: true, 
      results: results,
      totalAttempts: results.length,
      message: '사용자 시험 결과 조회 완료' 
    };
    
  } catch (error) {
    Logger.log('❌ Error: ' + error.toString());
    return { 
      success: false, 
      results: [],
      message: '사용자 시험 결과 조회 실패: ' + error.message 
    };
  }
}

// ==================== 시험문제 시트 초기화 ====================

function initializeExamSheet() {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('시험문제');
    
    if (sheet) {
      ss.deleteSheet(sheet);
    }
    
    sheet = ss.insertSheet('시험문제');
    
    // ✅ 헤더 생성 (A: 배점, B: 정답, C: 문제설명, D: 이미지URL)
    sheet.appendRow(['배점', '정답', '문제설명', '이미지URL']);
    
    const headerRange = sheet.getRange(1, 1, 1, 4);
    headerRange.setBackground('#8b5cf6');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    sheet.setColumnWidth(1, 80);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 400);
    sheet.setColumnWidth(4, 400); // ✅ 이미지URL 열
    
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(4); // ✅ D열까지 고정
    
    Logger.log('✅ 시험문제 시트 초기화 완료');
    return { success: true, message: '시험문제 시트가 초기화되었습니다.' };
    
  } catch (error) {
    throw new Error('시험문제 시트 초기화 실패: ' + error.message);
  }
}

// ==================== 문제 일괄 등록 ====================

function bulkAddQuestions(questions) {
  try {
    Logger.log('📚 문제 일괄 등록 시작: ' + questions.length + '개');
    
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName('시험문제');
    
    // ✅ 기존 시트가 있으면 삭제하고 새로 생성 (전체 교체)
    if (sheet) {
      Logger.log('🗑️ 기존 시험문제 시트 삭제');
      ss.deleteSheet(sheet);
    }
    
    // 새 시트 생성
    sheet = ss.insertSheet('시험문제');
    sheet.appendRow(['배점', '정답', '문제설명', '이미지URL']);
    
    const headerRange = sheet.getRange(1, 1, 1, 4);
    headerRange.setBackground('#6d9469');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setHorizontalAlignment('center');
    
    sheet.setColumnWidth(1, 80);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 400);
    sheet.setColumnWidth(4, 400);
    
    sheet.setFrozenRows(1);
    sheet.setFrozenColumns(4);
    
    // 문제 데이터 준비
    const dataRows = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      // ✅ 정답을 숫자로 변환 (O=1, X=2)
      let correctAnswer = 1; // 기본값 O
      if (typeof q.correctAnswer === 'number') {
        correctAnswer = q.correctAnswer;
      } else {
        const answerStr = String(q.correctAnswer || 'O').trim().toUpperCase();
        correctAnswer = answerStr === 'O' ? 1 : answerStr === 'X' ? 2 : 1;
      }
      
      dataRows.push([
        Number(q.score) || 1,
        correctAnswer, // ✅ 숫자로 저장 (1: O, 2: X)
        String(q.question || '').trim(),
        String(q.imageUrl || '').trim()
      ]);
    }
    
    // 데이터 한번에 입력
    if (dataRows.length > 0) {
      sheet.getRange(2, 1, dataRows.length, 4).setValues(dataRows);
    }
    
    Logger.log('✅ 문제 일괄 등록 완료: ' + dataRows.length + '개 (기존 문제 삭제됨)');
    
    return {
      success: true,
      message: dataRows.length + '개의 문제가 등록되었습니다. (기존 문제는 삭제되었습니다)',
      addedCount: dataRows.length,
      totalCount: dataRows.length,
      replaced: true
    };
    
  } catch (error) {
    Logger.log('❌ 문제 일괄 등록 실패: ' + error.toString());
    return {
      success: false,
      message: '문제 등록 실패: ' + error.message
    };
  }
}

// ==================== doPost ====================

function doPost(e) {
  try {
    Logger.log('📥 POST 요청 받음 (시험 시스템)');
    
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    Logger.log('📥 액션: ' + action);
    
    if (action === 'submitExam') {
      let answers = data.answers;
      if (typeof answers === 'string') {
        try {
          answers = JSON.parse(answers);
        } catch (e) {}
      }
      return createJSONResponse(submitExamAnswers(data.userEmail, answers));
    }
    
    if (action === 'getExamResult') {
      return createJSONResponse(getExamResult(data.userEmail));
    }
    
    if (action === 'getAllExamResults') {
      return createJSONResponse(getAllExamResults());
    }
    
    if (action === 'getUserPreviousAnswers') {
      return createJSONResponse(getUserPreviousAnswers(data.userEmail));
    }
    
    if (action === 'getUserExamResults') {
      return createJSONResponse(getUserExamResults(data.userEmail));
    }
    
    // ✅ 문제 일괄 등록
    if (action === 'bulkAddQuestions') {
      return createJSONResponse(bulkAddQuestions(data.questions));
    }
    
    return createJSONResponse({ success: false, message: '알 수 없는 액션: ' + action });
    
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
    Logger.log('📥 GET 요청 받음 (시험 시스템)');
    const action = e.parameter.action;
    Logger.log('📥 액션: ' + action);
    
    // ✅ 이미지 프록시 (Google Drive CORS 우회)
    if (action === 'proxyImage') {
      const fileId = e.parameter.fileId;
      if (!fileId) {
        return ContentService.createTextOutput('FILE_ID가 필요합니다.')
          .setMimeType(ContentService.MimeType.TEXT);
      }
      
      try {
        Logger.log('🖼️ 이미지 프록시 요청: ' + fileId);
        
        // Google Drive 파일 가져오기
        const file = DriveApp.getFileById(fileId);
        const blob = file.getBlob();
        const base64 = Utilities.base64Encode(blob.getBytes());
        const mimeType = blob.getContentType();
        
        Logger.log('✅ 이미지 변환 완료: ' + mimeType);
        
        // Base64 데이터 URL로 반환
        return ContentService.createTextOutput(
          JSON.stringify({
            success: true,
            dataUrl: 'data:' + mimeType + ';base64,' + base64,
            mimeType: mimeType
          })
        ).setMimeType(ContentService.MimeType.JSON);
        
      } catch (error) {
        Logger.log('❌ 이미지 로드 실패: ' + error.toString());
        return ContentService.createTextOutput(
          JSON.stringify({
            success: false,
            message: '이미지를 불러올 수 없습니다: ' + error.message
          })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    if (action === 'getExamQuestions') {
      return createJSONResponse(getExamQuestions());
    }
    
    if (action === 'getExamResult') {
      return createJSONResponse(getExamResult(e.parameter.userEmail));
    }
    
    if (action === 'getAllExamResults') {
      return createJSONResponse(getAllExamResults());
    }
    
    if (action === 'getUserPreviousAnswers') {
      return createJSONResponse(getUserPreviousAnswers(e.parameter.userEmail));
    }
    
    if (action === 'getUserExamResults') {
      return createJSONResponse(getUserExamResults(e.parameter.userEmail));
    }
    
    return createJSONResponse({
      success: true,
      message: '시험 시스템 API가 정상적으로 작동 중입니다.',
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

function testGetPreviousAnswers() {
  const result = getUserPreviousAnswers('test@example.com');
  Logger.log(JSON.stringify(result, null, 2));
}

function testSubmit() {
  const result = submitExamAnswers('test@example.com', ['1', '2', '1', '2', '1']);
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetUserResults() {
  const result = getUserExamResults('test@example.com');
  Logger.log(JSON.stringify(result, null, 2));
}

function testGetQuestions() {
  const result = getExamQuestions();
  Logger.log(JSON.stringify(result, null, 2));
}

// ✅ 일괄 등록 테스트
function testBulkAddQuestions() {
  const testQuestions = [
    {
      score: 1,
      correctAnswer: 'O',
      question: '테스트 문제 1: 축제기획의 첫 단계는 기획안 작성이다.',
      imageUrl: ''
    },
    {
      score: 2,
      correctAnswer: 'X',
      question: '테스트 문제 2: 축제 마케팅은 홍보만 포함한다.',
      imageUrl: 'https://example.com/image.jpg'
    },
    {
      score: 1,
      correctAnswer: 'O',
      question: '테스트 문제 3: 안전관리는 축제 운영의 필수 요소이다.',
      imageUrl: ''
    }
  ];
  
  const result = bulkAddQuestions(testQuestions);
  Logger.log(JSON.stringify(result, null, 2));
}
// ==================== URL 인코더/디코더 ====================
// 질문 ID를 예측 불가능한 코드로 변환

/**
 * 질문 ID와 사용자 정보를 조합하여 고유한 URL 코드 생성
 * ⚠️ 중요: 동일한 입력에 대해 항상 동일한 URL 생성 (랜덤 없음)
 * 형식: [ID기반해시][사용자해시]
 */
export function encodeQuestionId(
  id: number, 
  userEmail: string, 
  userName: string
): string {
  // 1. 사용자 정보 해시화
  const userHash = hashString(`${userEmail}${userName}`);
  
  // 2. ID를 36진수로 변환 (0-9, a-z)
  const idBase36 = id.toString(36);
  
  // 3. ID 기반 시드 해시 (고정된 문자열 생성)
  const idSeedHash = hashString(`question_${id}_${userEmail}`);
  
  // 4. 조합: ID + 사용자해시 + ID시드해시
  const combined = `${idBase36}:${userHash}:${idSeedHash}`;
  
  // 5. Base64 인코딩 (URL-safe)
  const encoded = btoa(combined)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // 6. 앞뒤에 고정된 문자 추가 (ID 기반으로 생성)
  const prefix = generateFixedString(id, 5, 'prefix');
  const suffix = generateFixedString(id, 5, 'suffix');
  
  return `${prefix}${encoded}${suffix}`;
}

/**
 * URL 코드를 원본 질문 ID로 디코딩
 */
export function decodeQuestionId(code: string): number | null {
  try {
    // 1. 앞뒤 5자리 제거
    const coreCode = code.substring(5, code.length - 5);
    
    // 2. Base64 디코딩
    const decoded = atob(
      coreCode
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    );
    
    // 3. ID 부분만 추출 (콜론으로 구분된 첫 번째 부분)
    const parts = decoded.split(':');
    
    if (parts.length < 3) return null;
    
    // 4. 36진수를 10진수로 변환
    const id = parseInt(parts[0], 36);
    
    return isNaN(id) ? null : id;
  } catch (error) {
    console.error('URL 디코딩 실패:', error);
    return null;
  }
}

/**
 * 문자열을 간단한 해시로 변환
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // 양수로 변환하고 36진수로
  const result = Math.abs(hash).toString(36);
  console.log(`🔐 해시 생성: "${str}" -> "${result}"`);
  return result;
}

/**
 * ID 기반으로 고정된 문자열 생성 (항상 동일)
 */
function generateFixedString(id: number, length: number, salt: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // ID와 salt를 시드로 사용
  let seed = hashString(`${salt}_${id}`);
  let seedNum = parseInt(seed, 36);
  
  for (let i = 0; i < length; i++) {
    // 시드를 변형하여 다음 문자 선택
    seedNum = (seedNum * 1103515245 + 12345) & 0x7fffffff;
    const index = seedNum % chars.length;
    result += chars.charAt(index);
  }
  
  return result;
}

/**
 * 테스트용 함수
 */
export function testUrlEncoding() {
  const testCases = [
    { id: 1, email: 'test@example.com', name: '홍길동' },
    { id: 42, email: 'user@test.com', name: '김철수' },
    { id: 999, email: 'admin@site.com', name: '관리자' }
  ];
  
  console.log('=== URL 인코딩 테스트 (고정 버전) ===');
  testCases.forEach(test => {
    const encoded1 = encodeQuestionId(test.id, test.email, test.name);
    const encoded2 = encodeQuestionId(test.id, test.email, test.name);
    const encoded3 = encodeQuestionId(test.id, test.email, test.name);
    const decoded = decodeQuestionId(encoded1);
    
    console.log(`ID ${test.id}:`);
    console.log(`  인코딩 1: /qna/${encoded1}`);
    console.log(`  인코딩 2: /qna/${encoded2}`);
    console.log(`  인코딩 3: /qna/${encoded3}`);
    console.log(`  동일성: ${encoded1 === encoded2 && encoded2 === encoded3 ? '✅' : '❌'}`);
    console.log(`  디코딩: ${decoded}`);
    console.log(`  일치: ${test.id === decoded ? '✅' : '❌'}`);
    console.log('');
  });
}
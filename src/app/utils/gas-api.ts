// ==================== Google Apps Script API 설정 ====================

/**
 * Google Apps Script 웹앱 URL
 * 각 시스템별로 독립적인 Apps Script 프로젝트
 */
export const GAS_API = {
  // 메인 시스템: 회원, 공지사항, 강의영상 관리
  ADMIN: 'https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec',
  
  // 접속 로그 시스템
  LOG: 'https://script.google.com/macros/s/AKfycbzJWXv-jqpG01WvksSOovVlfILE7hDE0h2YB0Zs9sZLi8DewgTYP_FWr5ACA_5UZ4k/exec',
  
  // Q&A 게시판 시스템
  QNA: 'https://script.google.com/macros/s/AKfycbw-meQYM8PeU5XZ5RD3S0eieYxyr_mWJbixdXNZFpYz-JrH3hE15ecZK1nTMaHyAtTMAA/exec',
  
  // 시험 시스템
  TEST: 'https://script.google.com/macros/s/AKfycbxKYxDp5_6ea8Bcf9mxQFli2kYHLXyKeSSnWP4YfWQwOnw3hSbqGvdFEamyHyA7ZhVY/exec',
} as const;

/**
 * API 요청 타임아웃 (밀리초)
 */
export const API_TIMEOUT = 30000; // 30초

/**
 * 재시도 설정
 */
export const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1초
  maxDelay: 5000, // 5초
};

// ==================== API 클라이언트 ====================

/**
 * Google Apps Script API 호출 유틸리티
 */
class GASClient {
  private timeout: number;
  private maxRetries: number;
  private initialDelay: number;
  private maxDelay: number;

  constructor() {
    this.timeout = API_TIMEOUT;
    this.maxRetries = RETRY_CONFIG.maxRetries;
    this.initialDelay = RETRY_CONFIG.initialDelay;
    this.maxDelay = RETRY_CONFIG.maxDelay;
  }

  /**
   * 재시도 로직이 포함된 API 호출
   */
  private async fetchWithRetry(
    url: string,
    options: RequestInit,
    retryCount = 0
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (error: any) {
      // 재시도 가능한 에러 체크
      const isRetryable =
        error.name === 'AbortError' ||
        error.message.includes('network') ||
        error.message.includes('timeout') ||
        error.message.includes('fetch');

      if (isRetryable && retryCount < this.maxRetries) {
        const delay = Math.min(
          this.initialDelay * Math.pow(2, retryCount),
          this.maxDelay
        );

        console.warn(
          `⚠️ API 호출 실패 (${retryCount + 1}/${this.maxRetries}), ${delay}ms 후 재시도...`,
          error.message
        );

        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, retryCount + 1);
      }

      throw error;
    }
  }

  /**
   * POST 요청
   */
  async post<T = any>(
    url: string,
    action: string,
    data?: any
  ): Promise<T> {
    try {
      console.log(`📤 API 호출: ${action}`, data || '(데이터 없음)');

      const response = await this.fetchWithRetry(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          data: data || {},
        }),
      });

      // HTML 응답 체크 (Apps Script 설정 오류)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('❌ Apps Script가 HTML을 반환했습니다:', await response.text());
        throw new Error(
          'Apps Script 설정 오류: 배포 설정을 확인하세요. (액세스 권한을 "모든 사용자"로 변경 필요)'
        );
      }

      const result = await response.json();

      console.log(`📥 API 응답: ${action}`, result);

      // Apps Script는 항상 200 OK를 반환하므로 success 필드로 에러 판별
      if (result.success === false) {
        throw new Error(result.message || 'API 호출 실패');
      }

      return result;
    } catch (error: any) {
      console.error(`❌ API 에러: ${action}`, error);
      throw new Error(error.message || 'API 호출 중 오류가 발생했습니다.');
    }
  }
}

// 싱글톤 인스턴스
const gasClient = new GASClient();

// ==================== Admin API (회원/공지/강의) ====================

export const adminAPI = {
  /**
   * 회원가입
   */
  register: (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    birthdate?: string;
    gender?: string;
    address?: string;
  }) => gasClient.post(GAS_API.ADMIN, 'register', userData),

  /**
   * 로그인
   */
  login: (email: string, password: string) =>
    gasClient.post(GAS_API.ADMIN, 'login', { email, password }),

  /**
   * 회원 정보 조회
   */
  getUserInfo: (email: string) =>
    gasClient.post(GAS_API.ADMIN, 'getUserInfo', { email }),

  /**
   * 회원 정보 수정
   */
  updateUserInfo: (data: {
    email: string;
    name?: string;
    phone?: string;
  }) => gasClient.post(GAS_API.ADMIN, 'updateUserInfo', data),

  /**
   * 비밀번호 변경
   */
  changePassword: (
    email: string,
    currentPassword: string,
    newPassword: string
  ) =>
    gasClient.post(GAS_API.ADMIN, 'changePassword', {
      email,
      currentPassword,
      newPassword,
    }),

  /**
   * 회원 탈퇴
   */
  deleteAccount: (email: string, password: string) =>
    gasClient.post(GAS_API.ADMIN, 'deleteAccount', { email, password }),

  /**
   * 공지사항 목록 조회
   */
  getNotices: () => gasClient.post(GAS_API.ADMIN, 'getNotices'),

  /**
   * 공지사항 상세 조회
   */
  getNotice: (noticeId: number) =>
    gasClient.post(GAS_API.ADMIN, 'getNotice', { noticeId }),

  /**
   * 공지사항 작성 (관리자)
   */
  createNotice: (data: {
    title: string;
    content: string;
    author: string;
    category?: string;
    isPinned?: boolean;
    isPopup?: boolean;
    images?: string[];
    bannerDesign?: string;
  }) => gasClient.post(GAS_API.ADMIN, 'createNotice', data),

  /**
   * 공지사항 수정 (관리자)
   */
  updateNotice: (data: {
    noticeId: number;
    title?: string;
    content?: string;
    category?: string;
    isPinned?: boolean;
    isPopup?: boolean;
    images?: string[];
  }) => gasClient.post(GAS_API.ADMIN, 'updateNotice', data),

  /**
   * 공지사항 삭제 (관리자)
   */
  deleteNotice: (noticeId: number) =>
    gasClient.post(GAS_API.ADMIN, 'deleteNotice', { noticeId }),

  /**
   * 강의영상 목록 조회
   */
  getVideos: (category: 'festival' | 'event' | 'performance') =>
    gasClient.post(GAS_API.ADMIN, 'getVideos', { category }),

  /**
   * 영상 URL 조회
   */
  getVideoUrl: (fileId: string) =>
    gasClient.post(GAS_API.ADMIN, 'getVideoUrl', { fileId }),

  /**
   * 학습 진도율 업데이트
   */
  updateProgress: (
    email: string,
    category: string,
    videoId: string,
    watched: boolean
  ) =>
    gasClient.post(GAS_API.ADMIN, 'updateProgress', {
      email,
      category,
      videoId,
      watched,
    }),

  /**
   * 전체 회원 조회 (관리자)
   */
  getAllUsers: () => gasClient.post(GAS_API.ADMIN, 'getAllUsers'),

  /**
   * 회원 정보 수정 (관리자)
   */
  updateUserInfoByAdmin: (userId: string, field: string, value: any) =>
    gasClient.post(GAS_API.ADMIN, 'updateUserInfoByAdmin', {
      userId,
      field,
      value,
    }),
};

// ==================== Log API (접속 로그) ====================

export const logAPI = {
  /**
   * 접속 로그 기록
   */
  logAccess: (data: {
    userEmail: string;
    userName: string;
    ipAddress: string;
    location?: string;
    deviceType?: string;
    browser?: string;
    pageUrl: string;
  }) => gasClient.post(GAS_API.LOG, 'logAccess', data),

  /**
   * 접속 로그 조회 (관리자)
   */
  getAccessLogs: (filters?: {
    startDate?: string;
    endDate?: string;
    userEmail?: string;
  }) => gasClient.post(GAS_API.LOG, 'getAccessLogs', filters),
};

// ==================== QnA API (Q&A 게시판) ====================

export const qnaAPI = {
  /**
   * 질문 작성
   */
  createQuestion: (data: {
    authorEmail: string;
    authorName: string;
    category: string;
    title: string;
    content: string;
  }) => gasClient.post(GAS_API.QNA, 'createQuestion', data),

  /**
   * 질문 목록 조회
   */
  getQuestions: (filters?: {
    category?: string;
    status?: string;
  }) => gasClient.post(GAS_API.QNA, 'getQuestions', filters),

  /**
   * 질문 상세 조회
   */
  getQuestion: (questionId: number) =>
    gasClient.post(GAS_API.QNA, 'getQuestion', { questionId }),

  /**
   * 답변 작성 (관리자)
   */
  createAnswer: (
    questionId: number,
    answerContent: string,
    answeredBy: string
  ) =>
    gasClient.post(GAS_API.QNA, 'createAnswer', {
      questionId,
      answerContent,
      answeredBy,
    }),

  /**
   * 질문 수정
   */
  updateQuestion: (data: {
    questionId: number;
    title?: string;
    content?: string;
  }) => gasClient.post(GAS_API.QNA, 'updateQuestion', data),

  /**
   * 질문 삭제
   */
  deleteQuestion: (questionId: number, userEmail: string) =>
    gasClient.post(GAS_API.QNA, 'deleteQuestion', { questionId, userEmail }),
};

// ==================== Test API (시험 시스템) ====================

export const testAPI = {
  /**
   * 시험 문제 조회 (정답 제외)
   */
  getExamQuestions: () => gasClient.post(GAS_API.TEST, 'getExamQuestions'),

  /**
   * 답안 제출 및 자동 채점
   */
  submitExamAnswers: (userEmail: string, answers: number[]) =>
    gasClient.post(GAS_API.TEST, 'submitExamAnswers', { userEmail, answers }),

  /**
   * 시험 결과 조회
   */
  getExamResult: (userEmail: string) =>
    gasClient.post(GAS_API.TEST, 'getExamResult', { userEmail }),

  /**
   * 시험 문제 일괄 업로드 (관리자)
   */
  uploadExamQuestions: (questions: Array<{
    score: number;
    correctAnswer: number;
    question: string;
    imageUrl?: string;
  }>) => gasClient.post(GAS_API.TEST, 'uploadExamQuestions', { questions }),
};

// ==================== 기본 export ====================

export const gasAPI = {
  admin: adminAPI,
  log: logAPI,
  qna: qnaAPI,
  test: testAPI,
};

export default gasAPI;
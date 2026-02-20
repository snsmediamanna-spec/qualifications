// ==================== Q&A 게시판 API 서비스 ====================

// ✅ 다른 Apps Script들과 동일하게 URL 하드코딩
const QNA_API_URL = "https://script.google.com/macros/s/AKfycbw-meQYM8PeU5XZ5RD3S0eieYxyr_mWJbixdXNZFpYz-JrH3hE15ecZK1nTMaHyAtTMAA/exec";

// ✅ API 응답 검증 함수
async function validateResponse(response: Response) {
  const contentType = response.headers.get('content-type');
  
  // HTML 응답 감지 (Apps Script 에러 페이지)
  if (contentType && contentType.includes('text/html')) {
    const html = await response.text();
    console.error('❌ Apps Script가 HTML을 반환했습니다:', html.substring(0, 200));
    
    // Figma 관련 HTML인지 확인
    if (html.includes('figma') || html.includes('Figma')) {
      throw new Error('❌ 잘못된 Apps Script 프로젝트입니다!\n\n' +
        '현재 URL이 Q&A 시스템이 아닌 다른 프로젝트를 가리키고 있습니다.\n\n' +
        '해결 방법:\n' +
        '1. 새 Google Sheets 생성 (Q&A 전용)\n' +
        '2. 그 Sheets에서 Apps Script 열기\n' +
        '3. /guidelines/qna.gs.md 코드 전체 복사\n' +
        '4. 새로 배포하여 URL 받기\n' +
        '5. .env 파일 업데이트\n\n' +
        '자세한 가이드: /QNA_WRONG_SCRIPT_FIX.md'
      );
    }
    
    throw new Error('Apps Script 설정 오류: 배포 설정을 확인하세요. (액세스 권한을 "모든 사용자"로 변경 필요)');
  }
  
  return response;
}

export interface Question {
  id: number;
  urlCode?: string; // 🔥 새로 추가: URL 코드
  userEmail: string;
  userName: string;
  category: string;
  title: string;
  content: string;
  answer?: string; // 하위 호환성을 위해 유지
  answeredBy?: string;
  answeredAt?: string;
  status: 'pending' | 'answered';
  isPublic: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
  replies?: Reply[]; // 🔥 새로 추가: 답변 목록
}

// 🔥 새로 추가: 답변 타입
export interface Reply {
  id: number;
  questionId: number;
  userEmail: string;
  userName: string;
  isAdmin: boolean;
  content: string;
  createdAt: string;
}

export interface QuestionsResponse {
  success: boolean;
  message: string;
  data?: {
    questions: Question[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface QuestionResponse {
  success: boolean;
  message: string;
  data?: Question;
}

export interface CreateQuestionResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    createdAt: string;
  };
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    categories: string[];
  };
}

export const qnaService = {
  /**
   * 질문 목록 조회
   */
  async getQuestions(params: {
    page?: number;
    limit?: number;
    category?: string;
    status?: 'all' | 'pending' | 'answered';
    userEmail?: string;
    adminEmail?: string;
  } = {}): Promise<QuestionsResponse> {
    try {
      const queryParams: Record<string, string> = {
        action: 'getQuestions',
        page: String(params.page || 1),
        limit: String(params.limit || 10),
      };
      
      // 🔥 선택적 파라미터만 추가
      if (params.category) queryParams.category = params.category;
      if (params.status) queryParams.status = params.status;
      if (params.userEmail) queryParams.userEmail = params.userEmail;
      if (params.adminEmail) queryParams.adminEmail = params.adminEmail;
      
      const query = new URLSearchParams(queryParams);
      
      const response = await fetch(`${QNA_API_URL}?${query}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'follow'
      });

      await validateResponse(response);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('❌ 질문 목록 조회 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '질문 목록 조회에 실패했습니다.'
      };
    }
  },

  /**
   * 질문 상세 조회
   */
  async getQuestion(id: number, userEmail?: string): Promise<QuestionResponse> {
    try {
      const query = new URLSearchParams({
        action: 'getQuestion',
        id: String(id),
        ...(userEmail && { userEmail })
      });

      const response = await fetch(`${QNA_API_URL}?${query}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'follow'
      });

      await validateResponse(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ 질문 상세 조회 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '질문을 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 내 질문 목록 조회
   */
  async getMyQuestions(userEmail: string): Promise<QuestionsResponse> {
    try {
      const query = new URLSearchParams({
        action: 'getMyQuestions',
        userEmail
      });

      const response = await fetch(`${QNA_API_URL}?${query}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'follow'
      });

      await validateResponse(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ 내 질문 조회 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '내 질문을 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 카테고리 목록 조회
   */
  async getCategories(): Promise<CategoriesResponse> {
    try {
      const query = new URLSearchParams({
        action: 'getCategories'
      });

      const response = await fetch(`${QNA_API_URL}?${query}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'follow'
      });

      await validateResponse(response);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('❌ 카테고리 조회 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '카테고리를 불러오는데 실패했습니다.'
      };
    }
  },

  /**
   * 질문 작성
   */
  async createQuestion(data: {
    userEmail: string;
    userName: string;
    category: string;
    title: string;
    content: string;
    isPublic: boolean;
  }): Promise<CreateQuestionResponse> {
    try {
      console.log('🔄 질문 작성 요청:', data);

      const response = await fetch(QNA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'createQuestion',
          ...data
        }),
        redirect: 'follow'
      });

      await validateResponse(response);
      const result = await response.json();
      
      console.log('✅ 질문 작성 응답:', result);
      return result;
    } catch (error) {
      console.error('❌ 질문 작성 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '질문 작성에 실패했습니다.'
      };
    }
  },

  /**
   * 답변 작성 (관리자)
   */
  async answerQuestion(id: number, answer: string, answeredBy: string): Promise<CreateQuestionResponse> {
    try {
      console.log('🔄 답변 작성 API 요청:', {
        url: QNA_API_URL,
        id,
        answerLength: answer.length,
        answeredBy
      });

      const response = await fetch(QNA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'answerQuestion',
          id,
          answer,
          answeredBy
        }),
        redirect: 'follow'
      });

      console.log('📡 HTTP 응답 상태:', response.status, response.statusText);

      await validateResponse(response);
      const result = await response.json();
      
      console.log('✅ 답변 작성 응답:', result);
      return result;
    } catch (error) {
      console.error('❌ 답변 작성 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '답변 작성에 실패했습니다.'
      };
    }
  },

  /**
   * 질문 수정
   */
  async updateQuestion(data: {
    id: number;
    userEmail: string;
    title?: string;
    content?: string;
    category?: string;
  }): Promise<CreateQuestionResponse> {
    try {
      const response = await fetch(QNA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'updateQuestion',
          ...data
        }),
        redirect: 'follow'
      });

      await validateResponse(response);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ 질문 수정 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '질문 수정에 실패했습니다.'
      };
    }
  },

  /**
   * 질문 삭제
   */
  async deleteQuestion(id: number, userEmail: string): Promise<CreateQuestionResponse> {
    try {
      const response = await fetch(QNA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'deleteQuestion',
          id,
          userEmail
        }),
        redirect: 'follow'
      });

      await validateResponse(response);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('❌ 질문 삭제 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '질문 삭제에 실패했습니다.'
      };
    }
  },

  /**
   * 조회수 증가
   */
  async incrementViews(id: number): Promise<void> {
    try {
      await fetch(QNA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'incrementViews',
          id
        }),
        redirect: 'follow'
      });
    } catch (error) {
      console.error('❌ 조회수 증가 실패:', error);
    }
  },

  /**
   * 🔥 새로 추가: 답변 추가 (채팅 스타일)
   */
  async addReply(data: {
    questionId: number;
    userEmail: string;
    userName: string;
    content: string;
  }): Promise<CreateQuestionResponse> {
    try {
      console.log('🔄 답변 추가 요청:', data);

      const response = await fetch(QNA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          action: 'addReply',
          ...data
        }),
        redirect: 'follow'
      });

      await validateResponse(response);
      const result = await response.json();
      
      console.log('✅ 답변 추가 응답:', result);
      return result;
    } catch (error) {
      console.error('❌ 답변 추가 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '답변 추가에 실패했습니다.'
      };
    }
  },

  /**
   * 🔥 새로 추가: 질문의 답변 목록 조회
   */
  async getReplies(questionId: number): Promise<{ success: boolean; message: string; data?: Reply[] }> {
    try {
      const query = new URLSearchParams({
        action: 'getReplies',
        questionId: String(questionId)
      });

      const response = await fetch(`${QNA_API_URL}?${query}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        redirect: 'follow'
      });

      await validateResponse(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ 답변 목록 조회 실패:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '답변 목록 조회에 실패했습니다.'
      };
    }
  }
};
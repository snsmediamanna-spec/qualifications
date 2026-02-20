// ==================== 데이터 캐시 Context ====================
// 🎯 QnA와 공지사항 데이터를 미리 로딩하고 캐싱
// 🔥 새로고침 시 캐시 초기화 이벤트 감지

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { qnaService, type Question } from '../services/qna.service';
import { getCurrentUser } from '../utils/auth';

interface Notice {
  id: number;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface DataCacheContextType {
  // QnA
  qnaList: Question[];
  qnaLoading: boolean;
  qnaError: string | null;
  refreshQnA: () => Promise<void>;
  
  // 공지사항
  noticeList: Notice[];
  noticeLoading: boolean;
  noticeError: string | null;
  refreshNotices: () => Promise<void>;
  
  // 카테고리
  categories: string[];
}

// 🔥 초기값 제공 (Provider 밖에서 호출되는 경우 대비)
const defaultContextValue: DataCacheContextType = {
  qnaList: [],
  qnaLoading: false,
  qnaError: null,
  refreshQnA: async () => {},
  noticeList: [],
  noticeLoading: false,
  noticeError: null,
  refreshNotices: async () => {},
  categories: []
};

const DataCacheContext = createContext<DataCacheContextType>(defaultContextValue);

export function DataCacheProvider({ children }: { children: ReactNode }) {
  const user = getCurrentUser();
  
  // QnA 상태
  const [qnaList, setQnaList] = useState<Question[]>([]);
  const [qnaLoading, setQnaLoading] = useState(true);
  const [qnaError, setQnaError] = useState<string | null>(null);
  
  // 공지사항 상태
  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [noticeLoading, setNoticeLoading] = useState(true);
  const [noticeError, setNoticeError] = useState<string | null>(null);
  
  // 카테고리
  const [categories, setCategories] = useState<string[]>([]);

  // 🔥 QnA 데이터 로딩
  async function loadQnA() {
    setQnaLoading(true);
    setQnaError(null);
    
    try {
      const response = await qnaService.getQuestions({
        page: 1,
        limit: 100, // 충분히 많은 데이터 로드
        status: 'all',
        userEmail: user?.email || undefined // 🔥 undefined로 명시적 전달
      });

      if (response.success && response.data) {
        setQnaList(response.data.questions);
      } else {
        setQnaError(response.message || '데이터 로딩 실패');
        setQnaList([]); // 🔥 실패 시 빈 배열로 초기화
      }
    } catch (error: any) {
      console.error('❌ QnA 로딩 실패:', error);
      
      // Apps Script 설정 오류인 경우 특별 처리
      if (error.message?.includes('Apps Script 설정 오류')) {
        setQnaError(error.message);
      } else {
        setQnaError('질문 목록 조회 실패: ' + (error.message || '알 수 없는 오류'));
      }
      
      setQnaList([]); // 🔥 에러 시 빈 배열로 초기화
    } finally {
      setQnaLoading(false);
    }
  }

  // 🔥 공지사항 데이터 로딩 (임시 - 실제 API 연결 시 수정)
  async function loadNotices() {
    setNoticeLoading(true);
    setNoticeError(null);
    
    try {
      // TODO: 실제 공지사항 API 연결
      // 현재는 빈 배열로 설정
      setNoticeList([]);
    } catch (error) {
      console.error('공지사항 로딩 실패:', error);
      setNoticeError('데이터 로딩 실패');
    } finally {
      setNoticeLoading(false);
    }
  }

  // 🔥 카테고리 로딩
  async function loadCategories() {
    try {
      const response = await qnaService.getCategories();
      
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('카테고리 로딩 실패:', error);
    }
  }

  // 🔥 최초 로딩 (앱 시작 시)
  useEffect(() => {
    loadQnA();
    loadNotices();
    loadCategories();
    
    // 5분마다 자동 갱신
    const interval = setInterval(() => {
      loadQnA();
      loadNotices();
    }, 5 * 60 * 1000);
    
    // 🔥 새로고침 시 캐시 초기화 이벤트 감지
    const handleClearCache = () => {
      setQnaList([]);
      setNoticeList([]);
      setCategories([]);
      
      // 즉시 새로 로딩
      loadQnA();
      loadNotices();
      loadCategories();
    };
    
    window.addEventListener('clearDataCache', handleClearCache);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('clearDataCache', handleClearCache);
    };
  }, [user?.email]);

  const value: DataCacheContextType = {
    qnaList,
    qnaLoading,
    qnaError,
    refreshQnA: loadQnA,
    
    noticeList,
    noticeLoading,
    noticeError,
    refreshNotices: loadNotices,
    
    categories
  };

  return (
    <DataCacheContext.Provider value={value}>
      {children}
    </DataCacheContext.Provider>
  );
}

export function useDataCache() {
  const context = useContext(DataCacheContext);
  
  // 🔥 undefined 체크 제거 (기본값이 있으므로 항상 값이 존재)
  return context;
}
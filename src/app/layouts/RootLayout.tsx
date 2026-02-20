import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { Toaster } from 'sonner';
import { Menu, X } from 'lucide-react';
import { NewHeader } from '../components/NewHeader';
import { NewFooter } from '../components/NewFooter';
import { BannerDesign } from '../components/BannerDesign';
import { LandingIntro } from '../components/LandingIntro';
import LoadingScreen from '../components/LoadingScreen';
import { ChatbotButton } from '../components/ChatbotButton';
import { ScrollToTop } from '../components/ScrollToTop'; // ✅ 스크롤 리셋
import { logPageView, logLogin, logLogout, logSignup } from '../utils/logger';
import '../utils/http-interceptor'; // ✅ HTTP 인터셉터 초기화
import { startConsoleDetection } from '../utils/console-detector'; // ✅ 콘솔 감지
import { DataCacheProvider } from '../../contexts/DataCacheContext'; // 🔥 데이터 캐시

// 🔒 콘텐츠 보호 시스템 (비활성화됨)
// const contentProtection = {
//   enable: () => {
//     // 우클릭 방지
//     document.addEventListener('contextmenu', (e) => e.preventDefault());
//     
//     // 드래그 방지
//     document.addEventListener('dragstart', (e) => e.preventDefault());
//     
//     // 텍스트 선택 방지
//     document.addEventListener('selectstart', (e) => e.preventDefault());
//     
//     // 개발자 도구 단축키 방지
//     document.addEventListener('keydown', (e) => {
//       if (
//         e.key === 'F12' ||
//         (e.ctrlKey && e.shiftKey && e.key === 'I') ||
//         (e.ctrlKey && e.shiftKey && e.key === 'J') ||
//         (e.ctrlKey && e.key === 'U')
//       ) {
//         e.preventDefault();
//       }
//     });
//   }
// };

// 🎯 Viewport 변경 감지 시스템
function watchViewportChanges() {
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;
  
  const checkViewport = () => {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;
    
    if (currentWidth !== lastWidth || currentHeight !== lastHeight) {
      lastWidth = currentWidth;
      lastHeight = currentHeight;
    }
  };
  
  window.addEventListener('resize', checkViewport);
  
  return () => {
    window.removeEventListener('resize', checkViewport);
  };
}

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  isPinned: boolean;
  isPopup: boolean;
  status: string;
  imageUrl?: string;
  images?: string[];
  bannerDesign?: string;
}

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  const LOG_API_URL = "https://script.google.com/macros/s/AKfycbzJWXv-jqpG01WvksSOovVlfILE7hDE0h2YB0Zs9sZLi8DewgTYP_FWr5ACA_5UZ4k/exec";
  
  // 🚫 IP 차단 상태
  const [isIPBlocked, setIsIPBlocked] = useState(false);
  const [blockedIP, setBlockedIP] = useState('');
  const [ipCheckComplete, setIpCheckComplete] = useState(false);
  
  // 🎯 단순 너비 기반 모바일 감지 (1024px 이하)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  // 🎯 스케일 계산
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const calculateScale = () => {
      const viewportWidth = window.innerWidth;
      const baseWidth = 450; // 기준 너비
      const minScale = 0.7; // 최소 스케일 제한 (70%)
      
      if (viewportWidth < 1024) {
        // 1024px 이하: 화면 너비에 맞춰 스케일 조정 (최소 0.7)
        const calculatedScale = viewportWidth / baseWidth;
        setScale(Math.max(calculatedScale, minScale));
        setIsMobile(true);
      } else {
        // 1024px 이상: 스케일 없음
        setScale(1);
        setIsMobile(false);
      }
    };
    
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>(undefined);
  const [pendingCourseId, setPendingCourseId] = useState<number | undefined>(undefined);
  const [user, setUser] = useState<{ email: string, name: string } | null>(null);
  const [examCategory, setExamCategory] = useState<string>('');
  
  // 팝업 배너 state
  const [popupNotices, setPopupNotices] = useState<Notice[]>([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [showNoticeBanner, setShowNoticeBanner] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // ✅ 전체 공지사항 state 추가 (NoticePage에 전달용)
  const [allNotices, setAllNotices] = useState<Notice[]>([]);
  const [noticesLoaded, setNoticesLoaded] = useState(false);
  
  // ✅ Q&A 게시판 state 추가 (QnAPage에 전달용)
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [qnaCategories, setQnaCategories] = useState<string[]>([]);
  const [qnaLoaded, setQnaLoaded] = useState(false);
  
  // 페이지 전환 로딩 state
  const [isPageLoading, setIsPageLoading] = useState(false);
  
  // 랜딩 인트로 state
  const [showLandingIntro, setShowLandingIntro] = useState(() => {
    // 세션당 한 번만 표시 (새로고침 시 다시 표시)
    return !sessionStorage.getItem('landingShown');
  });
  
  // 다크모드 state
  const [isDark, setIsDark] = useState(() => {
    // 초기값을 localStorage에서 직접 읽어옴
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // localStorage에 값이 없을 때만 시스템 선호도 확인
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 모바일 메뉴 상태
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 스크롤 위치 감지 (데스크탑 플로팅 버튼용)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  // 모바일 메뉴 상태 변경 감지
  useEffect(() => {
    const handleMenuStateChange = (event: CustomEvent) => {
      setIsMobileMenuOpen(event.detail.isOpen);
    };
    
    window.addEventListener('mobileMenuStateChange', handleMenuStateChange as EventListener);
    return () => window.removeEventListener('mobileMenuStateChange', handleMenuStateChange as EventListener);
  }, []);

  // 스크롤 위치 감지 (데스크탑만)
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      // 헤더와 배너를 포함한 상단 영역 기준 (약 200px)
      const threshold = 200;
      setIsHeaderVisible(window.scrollY < threshold);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 설정

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // 다크모드 초기화 (마운트 시 한 번만)
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // 다크모드 토글
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 슬라이드 이동 함수 (페이드 효과)
  const goToNextSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNoticeIndex((prev) => (prev + 1) % popupNotices.length);
      setIsTransitioning(false);
    }, 500);
  };

  const goToPrevSlide = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentNoticeIndex((prev) => (prev - 1 + popupNotices.length) % popupNotices.length);
      setIsTransitioning(false);
    }, 500);
  };

  // ✅ 오늘 하루 닫기 핸들러
  const handleHideForToday = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    localStorage.setItem('popupNoticeHideUntil', tomorrow.getTime().toString());
    
    setShowNoticeBanner(false);
  };

  // 공지사항 가져오기
  useEffect(() => {
    const fetchPopupNotices = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            action: 'getNotices',
            timestamp: new Date().getTime()
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // console.log('📥 공지사항 응답:', result);
        
        if (result.success && Array.isArray(result.notices)) {
          const popups = result.notices.filter((notice: Notice) => notice.isPopup);
          
          const hideUntil = localStorage.getItem('popupNoticeHideUntil');
          const now = new Date().getTime();
          
          if (hideUntil && now < parseInt(hideUntil)) {
            setShowNoticeBanner(false);
          } else {
            localStorage.removeItem('popupNoticeHideUntil');
            setShowNoticeBanner(true);
          }
          
          setPopupNotices(popups);
          setAllNotices(result.notices);
          setNoticesLoaded(true);
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            // 타임아웃 발생 시 조용히 처리
          }
        }
      }
    };

    fetchPopupNotices();
  }, []);

  // ✅ Q&A 게시판 데이터 가져오기 (백그라운드 로딩)
  useEffect(() => {
    const fetchQnAData = async () => {
      const QNA_API_URL = "https://script.google.com/macros/s/AKfycbw-meQYM8PeU5XZ5RD3S0eieYxyr_mWJbixdXNZFpYz-JrH3hE15ecZK1nTMaHyAtTMAA/exec";
      
      try {
        // 1. 카테고리 로드
        const categoriesResponse = await fetch(QNA_API_URL + '?action=getCategories');
        const categoriesResult = await categoriesResponse.json();
        
        if (categoriesResult.success && categoriesResult.data) {
          setQnaCategories(categoriesResult.data.categories);
        }
        
        // 2. 질문 목록 로드
        const questionsResponse = await fetch(
          QNA_API_URL + '?action=getQuestions&page=1&limit=10&status=all'
        );
        const questionsResult = await questionsResponse.json();
        
        if (questionsResult.success && questionsResult.data) {
          setAllQuestions(questionsResult.data.questions);
          setQnaLoaded(true);
        }
      } catch (error) {
        // 에러 시 조용히 처리 (사용자 경험 저하 방지)
        console.error('Q&A 데이터 로드 실패:', error);
      }
    };

    fetchQnAData();
  }, []);

  // 자동 슬라이드
  useEffect(() => {
    if (popupNotices.length > 1) {
      const interval = setInterval(() => {
        goToNextSlide();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [popupNotices]);

  // 🔒 콘텐츠 보호 시스템 활성화
  useEffect(() => {
    // contentProtection.enable();
    
    // 🚨 콘솔 감지 시스템 활성화 (비활성화됨)
    // startConsoleDetection();
    
    // ⚠️ React Quill의 findDOMNode 경고 억제
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('findDOMNode')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);
  
  // 🚫 IP 차단 확인 (앱 시작 시 최우선으로 실행)
  useEffect(() => {
    const checkIPBlock = async () => {
      try {
        const response = await fetch(LOG_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            action: 'checkIPBlocked',
            timestamp: new Date().getTime()
          })
        });
        
        const result = await response.json();
        
        if (result.success && result.blocked) {
          setIsIPBlocked(true);
          setBlockedIP(result.ip || 'Unknown');
          // /blocked 페이지로 강제 리다이렉트
          navigate('/blocked', { replace: true });
        } else {
          setIpCheckComplete(true);
        }
      } catch (error) {
        // 에러 시에도 정상 진행 (서비스 중단 방지)
        setIpCheckComplete(true);
      }
    };
    
    checkIPBlock();
  }, [navigate]);
  
  // 🔥 새로고침 시 데이터 캐시 초기화 (로그인 정보는 유지)
  useEffect(() => {
    // sessionStorage에 새로고침 플래그 확인
    const wasRefreshed = sessionStorage.getItem('wasRefreshed');
    
    if (!wasRefreshed) {
      // 🔥 최초 진입: sessionStorage에 플래그 설정
      sessionStorage.setItem('wasRefreshed', 'true');
    } else {
      // 새로고침 감지: 데이터 캐시만 초기화
      // 데이터 캐시 초기화 이벤트 발생
      window.dispatchEvent(new Event('clearDataCache'));
    }
    
    // 페이지 언로드 시 플래그 제거 (탭 닫기/이동 시)
    const handleBeforeUnload = () => {
      // 실제로 페이지를 떠날 때만 플래그 제거
      // (새로고침은 플래그 유지)
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // 🚫 차단된 IP가 다른 페이지로 이동하려 할 때 다시 /blocked로 리다이렉트
  useEffect(() => {
    if (isIPBlocked && location.pathname !== '/blocked') {
      navigate('/blocked', { replace: true });
    }
  }, [isIPBlocked, location.pathname, navigate]);
  
  // 🎯 Viewport 감지 시스템 활성화
  useEffect(() => {
    const cleanup = watchViewportChanges();
    return () => {
      cleanup();
    };
  }, []);

  // 앱 시작 시 localStorage에서 로그인 정보 불러오기
  useEffect(() => {
    // 1차: localStorage 확인 (rememberMe 체크한 경우)
    const savedUser = localStorage.getItem('user');
    const savedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const savedIsAdmin = localStorage.getItem('isAdmin');

    if (savedUser && savedIsLoggedIn === 'true') {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      setIsAdmin(savedIsAdmin === 'true');
    } else {
      // 2차: sessionStorage 확인 (일반 로그인)
      const sessionUser = sessionStorage.getItem('userInfo');
      const sessionLoggedIn = sessionStorage.getItem('isLoggedIn');
      
      if (sessionUser && sessionLoggedIn === 'true') {
        try {
          const userData = JSON.parse(sessionUser);
          setUser({ email: userData.email, name: userData.name });
          setIsLoggedIn(true);
          setIsAdmin(userData.isAdmin || false);
        } catch (error) {
          console.error('사용자 정보 파싱 오류:', error);
        }
      }
    }
  }, []);

  // 페이지 변경 시 스크롤을 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
    // 페이지 뷰 로깅
    logPageView(location.pathname);
  }, [location.pathname]);

  const handleLoginSuccess = (email: string, isAdmin: boolean, name?: string) => {
    const userData = { email, name: name || '사용자' };
    setUser(userData);
    setIsLoggedIn(true);
    setIsLoginOpen(false);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', String(isAdmin));
    
    setIsAdmin(isAdmin);

    if (pendingCourseId) {
      setSelectedCourseId(pendingCourseId);
      navigate('/payment');
      setPendingCourseId(undefined);
    }

    logLogin(email);
  };

  const handleLogout = () => {
    if (user?.email) {
      logLogout(user.email);
    }
    
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    navigate('/');
    
    // ✅ localStorage 클리어
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    
    // ✅ sessionStorage 클리어
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authExpiry');
    
    console.log('✅ [Logout] 모든 저장소가 클리어되었습니다.');
  };

  const handleSignupSuccess = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleSignupSuccessWithLogin = (email: string, isAdmin: boolean, name?: string) => {
    setIsSignupOpen(false);
    const userData = { email, name: name || '사용자' };
    setUser(userData);
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isAdmin', String(isAdmin));

    logSignup(email);
  };

  const handleOpenSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleCourseEnroll = () => {
    if (!isLoggedIn) {
      setPendingCourseId(1);
      setIsLoginOpen(true);
    } else {
      setSelectedCourseId(1);
      navigate('/payment');
    }
  };
  
  const handlePageChange = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  // 🎯 헤더/푸터 숨김 판단 (로그인, 회원가입 페이지)
  const shouldHideHeaderFooter = ['/login', '/signup'].includes(location.pathname);

  return (
    <DataCacheProvider>
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* ✅ 페이지 전환 시 스크롤 리셋 */}
        <ScrollToTop />
        
        <Toaster />
        
        {/* 차단되지 않은 경우에만 정상 화면 표시 */}
        {!isIPBlocked && (
          <>
            {/* 랜딩 인트로 페이지 */}
            {showLandingIntro && (
              <LandingIntro 
                onEnter={() => {
                  setShowLandingIntro(false);
                  sessionStorage.setItem('landingShown', 'true');
                }}
                isDark={isDark}
                toggleDarkMode={toggleDarkMode}
              />
            )}
            
            {/* 페이지 전환 로딩 오버레이 */}
            {isPageLoading && <LoadingScreen isMobile={isMobile} scale={scale} />}
            
            {/* 🎯 통합 레이아웃 (스케일 적용) */}
            <div 
              className={!isMobile && typeof window !== 'undefined' && window.innerWidth <= 1920 ? 'px-5' : ''}
              style={{
                width: isMobile ? '450px' : '100%',
                transform: isMobile ? `scale(${scale})` : 'none',
                transformOrigin: 'top left',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                paddingLeft: isMobile ? '20px' : undefined,
                paddingRight: isMobile ? '20px' : undefined
              }}
            >
              {/* 팝업 배너 (데스크탑만, 로그인/회원가입 제외) */}
              {!isMobile && !isPageLoading && !shouldHideHeaderFooter && popupNotices.length > 0 && showNoticeBanner && (
                <div 
                  key={currentNoticeIndex}
                  className={`transition-opacity duration-500 ease-in-out ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                  style={{ height: '80px' }}
                >
                  <BannerDesign 
                    design={popupNotices[currentNoticeIndex].bannerDesign || "design1"} 
                    title={popupNotices[currentNoticeIndex].title} 
                    onClose={() => setShowNoticeBanner(false)}
                    onClick={() => navigate('/notice')}
                    onCloseTodayOnly={handleHideForToday}
                  />
                </div>
              )}

              {/* 헤더 (로그인/회원가입 페이지 제외) */}
              {!isPageLoading && !shouldHideHeaderFooter && (
                <NewHeader
                  currentPage={location.pathname.slice(1) || 'home'}
                  onNavigate={handlePageChange}
                  isLoggedIn={isLoggedIn}
                  isAdmin={isAdmin}
                  onLoginClick={() => navigate('/login')}
                  onSignupClick={() => navigate('/signup')}
                  onLogout={handleLogout}
                  onDarkModeToggle={toggleDarkMode}
                  isDark={isDark}
                  isMobile={isMobile}
                  scale={scale}
                />
              )}
              
              {/* 메인 콘텐츠 - flex: 1로 남은 공간 모두 차지 */}
              <main className="w-full" style={{ flex: '1 0 auto' }}>
                <Outlet context={{ 
                  isMobile, 
                  isLoggedIn, 
                  isAdmin, 
                  user, 
                  examCategory,
                  selectedCourseId,
                  allNotices,
                  noticesLoaded,
                  allQuestions,
                  qnaCategories,
                  qnaLoaded,
                  onNavigate: handlePageChange,
                  onEnroll: handleCourseEnroll,
                  onLogout: handleLogout,
                  onLoginClick: () => navigate('/login'),
                  onSignupClick: () => navigate('/signup'),
                  onLoginSuccess: handleLoginSuccess,
                  onSignupSuccess: handleSignupSuccess,
                  onSignupSuccessWithLogin: handleSignupSuccessWithLogin,
                  setExamCategory
                }} />
              </main>
              
              {/* 푸터 - flex-shrink: 0으로 고정 (로그인/회원가입 페이지 제외) */}
              {!shouldHideHeaderFooter && (
                <div style={{ flexShrink: 0 }}>
                  <NewFooter onNavigate={handlePageChange} />
                </div>
              )}
            </div>

            {/* 플로팅 햄버거 메뉴 버튼 (데스크탑만, 로그인/회원가입 제외) */}
            {!isPageLoading && !isMobile && !showLandingIntro && !shouldHideHeaderFooter && (
              <>
                {/* 챗봇 버튼 */}
                <ChatbotButton />
                
                {/* 햄버거 메뉴 버튼 */}
                <button
                  onClick={() => {
                    const event = new CustomEvent('toggleMobileMenu');
                    window.dispatchEvent(event);
                  }}
                  className="fixed bottom-8 right-8 w-14 h-14 flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-80 transition-all z-40"
                  aria-label="메뉴"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </>
            )}

            {/* 플로팅 햄버거 메뉴 버튼 (모바일만, 로그인/회원가입 제외) */}
            {!isPageLoading && isMobile && !showLandingIntro && !shouldHideHeaderFooter && (
              <>
                {/* 챗봇 버튼 */}
                <ChatbotButton />
                
                {/* 햄버거 메뉴 버튼 */}
                <button
                  onClick={() => {
                    const event = new CustomEvent('toggleMobileMenu');
                    window.dispatchEvent(event);
                  }}
                  className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
                  aria-label="메뉴"
                  style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    zIndex: 10000,
                    transform: `scale(${scale})`,
                    transformOrigin: 'bottom right'
                  }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </DataCacheProvider>
  );
}
import { User, LogOut, LayoutDashboard, Menu, X, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Logo } from '@/app/components/Logo';

interface NewHeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogout: () => void;
  onDarkModeToggle?: () => void;
  isDark?: boolean;
  isMobile?: boolean;
  scale?: number;
}

export function NewHeader({
  currentPage,
  onNavigate,
  isLoggedIn,
  isAdmin,
  onLoginClick,
  onSignupClick,
  onLogout,
  onDarkModeToggle,
  isDark: isDarkProp,
  isMobile: isMobileProp,
  scale: scaleProp
}: NewHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(isDarkProp || false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isDarkProp !== undefined) {
      setIsDark(isDarkProp);
    }
  }, [isDarkProp]);

  // 플로팅 버튼에서 메뉴 토글 이벤트 수신
  useEffect(() => {
    const handleToggleMenu = () => {
      if (!isMobileMenuOpen) {
        setIsAnimating(true);
      }
      setIsMobileMenuOpen(prev => !prev);
    };
    
    window.addEventListener('toggleMobileMenu', handleToggleMenu);
    return () => window.removeEventListener('toggleMobileMenu', handleToggleMenu);
  }, [isMobileMenuOpen]);

  // 메뉴 상태 변경 시 App에 알림
  useEffect(() => {
    const event = new CustomEvent('mobileMenuStateChange', {
      detail: { isOpen: isMobileMenuOpen }
    });
    window.dispatchEvent(event);
  }, [isMobileMenuOpen]);

  const toggleDarkMode = () => {
    if (onDarkModeToggle) {
      onDarkModeToggle();
    } else {
      const newDarkMode = !isDark;
      setIsDark(newDarkMode);
      localStorage.setItem('darkMode', newDarkMode.toString());
      document.documentElement.classList.toggle('dark');
    }
  };

  const menuItems = [
    { id: 'about', label: '과정소개' },
    { id: 'curriculum', label: '커리큘럼' },
    { id: 'courses', label: '수강신청' },
    { id: 'reviews', label: '합격후기' },
    { id: 'notice', label: '공지사항' },
    // { id: 'qna', label: 'Q&A' },
    { id: 'support', label: '고객센터' }
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className="w-full border-b border-border backdrop-blur-md bg-background/80 relative transition-colors duration-300"
      style={{ 
        fontFamily: "'Inter', sans-serif", 
        zIndex: 40,
        minHeight: '100px', // ✅ 최소 높이로 CLS 방지
        willChange: 'auto' // ✅ GPU 가속 최적화
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* 상단 헤더 */}
        <div 
          className="flex items-center justify-between h-20 mx-[0px] my-[20px]"
          style={{ minHeight: '80px' }} // ✅ 헤더 내부 최소 높이
        >
          {/* 로고 */}
          <button
            onClick={() => handleNavigate('home')}
            className="hover:opacity-70 transition-opacity text-primary"
          >
            <Logo className="h-14 w-14 lg:h-20 lg:w-20" />
          </button>

          {/* 데스크탑: 우측 버튼 */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => handleNavigate('admin')}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-widest transition-opacity hover:opacity-80"
                  >
                    <LayoutDashboard size={14} />
                    관리자
                  </button>
                )}
                <button
                  onClick={() => handleNavigate('my-classroom')}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-xs uppercase tracking-widest transition-colors hover:bg-muted"
                >
                  <User size={14} />
                  나의강의실
                </button>
                <button
                  onClick={() => handleNavigate('profile')}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-xs uppercase tracking-widest transition-colors hover:bg-muted"
                >
                  <User size={14} />
                  내 정보
                </button>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 border border-border text-xs uppercase tracking-widest transition-colors hover:bg-muted"
                >
                  <LogOut size={14} />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-5 py-2 text-foreground hover:text-primary transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  로그인
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium tracking-wide uppercase transition-opacity hover:opacity-80"
                >
                  회원가입
                </button>
              </>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Moon size={18} className="text-foreground" />
              ) : (
                <Sun size={18} className="text-foreground" />
              )}
            </button>
          </div>

          {/* 모바일/태블릿: 우측 버튼 */}
          <div className="lg:hidden flex items-center gap-2">
            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => handleNavigate('admin')}
                    className="p-2.5 text-primary hover:bg-muted rounded-full transition-colors"
                  >
                    <LayoutDashboard size={20} />
                  </button>
                )}
                <button
                  onClick={() => handleNavigate('my-classroom')}
                  className="p-2.5 text-primary hover:bg-muted rounded-full transition-colors"
                >
                  <User size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={onLoginClick}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors px-3"
              >
                로그인
              </button>
            )}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-muted transition-colors lg:hidden"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <Moon size={18} className="text-foreground" />
              ) : (
                <Sun size={18} className="text-foreground" />
              )}
            </button>

            {/* 햄버거 메뉴 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hidden p-2.5 hover:bg-muted rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X size={22} className="text-foreground" />
              ) : (
                <Menu size={22} className="text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* 데스크탑: 네비게이션 메뉴 */}
        <nav className="hidden lg:block border-t border-border">
          <div className="flex items-center justify-center gap-12 h-16">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`text-sm font-medium tracking-wide uppercase transition-colors relative ${
                  currentPage === item.id
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* 모바일/태블릿: 드롭다운 메뉴 */}
      {isMobileMenuOpen && createPortal(
        <>
          {/* 오버레이 배경 */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
              transform: isMobileProp && scaleProp ? `scale(${scaleProp})` : 'none',
              transformOrigin: 'top left',
              width: isMobileProp && scaleProp ? `${100 / scaleProp}%` : '100%',
              height: isMobileProp && scaleProp ? `${100 / scaleProp}%` : '100%'
            }}
          />
          
          {/* 사이드바 메뉴 */}
          <div 
            className="fixed top-0 bottom-0 w-80 bg-background shadow-2xl overflow-y-auto"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              maxWidth: '80vw',
              zIndex: 9999,
              transform: isMobileProp && scaleProp 
                ? `scale(${scaleProp})` 
                : 'none',
              transformOrigin: 'top right',
              height: isMobileProp && scaleProp ? `${100 / scaleProp}vh` : '100vh',
              animation: 'slideInRight 0.3s ease-out'
            }}
          >
            {/* 메뉴 헤더 */}
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold uppercase tracking-wide">메뉴</h3>
            </div>

            {/* 메뉴 아이템 */}
            <div className="px-6 py-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full text-left px-4 py-3 font-medium transition-colors uppercase text-sm tracking-wide ${
                    currentPage === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* 로그인/회원가입 버튼 */}
            <div className="px-6 pb-4 space-y-2 border-t border-border pt-4">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <button
                      onClick={() => handleNavigate('admin')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-medium uppercase text-sm tracking-wide transition-opacity hover:opacity-80"
                    >
                      <LayoutDashboard size={16} />
                      관리자
                    </button>
                  )}
                  <button
                    onClick={() => handleNavigate('my-classroom')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border font-medium uppercase text-sm tracking-wide transition-colors hover:bg-muted"
                  >
                    <User size={16} />
                    나의강의실
                  </button>
                  <button
                    onClick={() => handleNavigate('profile')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border font-medium uppercase text-sm tracking-wide transition-colors hover:bg-muted"
                  >
                    <User size={16} />
                    내 정보
                  </button>
                  <button
                    onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border font-medium uppercase text-sm tracking-wide transition-colors hover:bg-muted"
                  >
                    <LogOut size={16} />
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 border border-border font-medium uppercase text-sm tracking-wide transition-colors hover:bg-muted"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => { onSignupClick(); setIsMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground font-medium uppercase text-sm tracking-wide transition-opacity hover:opacity-80"
                  >
                    회원가입
                  </button>
                </>
              )}
              
              {/* 다크모드 전환 버튼 */}
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border font-medium uppercase text-sm tracking-wide transition-colors hover:bg-muted"
              >
                {isDark ? (
                  <>
                    <Moon size={16} />
                    다크 모드
                  </>
                ) : (
                  <>
                    <Sun size={16} />
                    라이트 모드
                  </>
                )}
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
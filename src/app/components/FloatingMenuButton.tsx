import { Menu, X, Home, BookOpen, GraduationCap, FileText, MessageSquare, Users, Calendar } from 'lucide-react';
import { useState } from 'react';

interface FloatingMenuButtonProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  onLoginClick: () => void;
}

export function FloatingMenuButton({
  currentPage,
  onNavigate,
  isLoggedIn,
  onLoginClick
}: FloatingMenuButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === 'my-classroom' && !isLoggedIn) {
      onLoginClick();
    } else {
      onNavigate(page);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* 플로팅 햄버거 버튼 */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="fixed w-14 h-14 bg-[#7C8A7B] dark:bg-[#93b190] text-white rounded-full shadow-lg hover:opacity-90 transition-all z-50 flex items-center justify-center"
        style={{
          bottom: '1.5rem', // 6 = 1.5rem
          right: '1.5rem'
        }}
        aria-label="메뉴 열기"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 배경 오버레이 */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 사이드 메뉴 패널 */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-[#2a2a2a] shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">메뉴</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X size={24} />
            </button>
          </div>

          {/* 메뉴 리스트 */}
          <nav className="flex-1 overflow-y-auto p-6">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigate('home')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'home'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Home size={24} />
                <span className="font-medium">홈</span>
              </button>

              <button
                onClick={() => handleNavigate('my-classroom')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'my-classroom'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <BookOpen size={24} />
                <span className="font-medium">내 강의실</span>
              </button>

              <button
                onClick={() => handleNavigate('courses')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'courses'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <GraduationCap size={24} />
                <span className="font-medium">수강신청</span>
              </button>

              <button
                onClick={() => handleNavigate('schedule')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'schedule'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Calendar size={24} />
                <span className="font-medium">시간표</span>
              </button>

              <button
                onClick={() => handleNavigate('materials')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'materials'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FileText size={24} />
                <span className="font-medium">강의자료</span>
              </button>

              <button
                onClick={() => handleNavigate('community')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'community'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Users size={24} />
                <span className="font-medium">커뮤니티</span>
              </button>

              <button
                onClick={() => handleNavigate('inquiry')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'inquiry'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <MessageSquare size={24} />
                <span className="font-medium">문의하기</span>
              </button>

              <button
                onClick={() => handleNavigate('notice')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${
                  currentPage === 'notice'
                    ? 'bg-[#7C8A7B]/10 dark:bg-[#93b190]/10 text-[#7C8A7B] dark:text-[#93b190]'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <BookOpen size={24} />
                <span className="font-medium">공지사항</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
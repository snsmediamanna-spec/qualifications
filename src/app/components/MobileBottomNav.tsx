import { Home, BookOpen, Plus, X, GraduationCap, FileText, MessageSquare, Users, Calendar } from 'lucide-react';
import { useState } from 'react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onPlusClick: () => void;
  onMyCoursesClick: () => void;
}

export function MobileBottomNav({
  currentPage,
  onNavigate,
  onPlusClick,
  onMyCoursesClick
}: MobileBottomNavProps) {
  const [isFloatingMenuOpen, setIsFloatingMenuOpen] = useState(false);
  const isHomeActive = currentPage === 'home';
  const isMyClassroomActive = currentPage === 'my-classroom';

  return (
    <div className="lg:hidden fixed left-0 right-0 z-50 px-4" data-component="mobile-bottom-nav-v2" style={{ bottom: '12px' }}>
      {/* 물결 모양 배경 - 비율 유지 (601:98) */}
      <div className="relative w-full" style={{ aspectRatio: '601/98' }}>
        <svg 
          className="absolute bottom-0 w-full h-full" 
          viewBox="0 0 601 98" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path 
            d="M601 49C601 76.062 579.062 98 552 98H49C21.9381 98 0 76.062 0 49C0 21.938 21.9381 0 49 0H112.232C153.491 0 188.528 28.8028 220.9 54.3822C242.788 71.6768 270.438 82 300.5 82C330.562 82 358.212 71.6768 380.1 54.3822C412.472 28.8028 447.509 0 488.768 0H552C579.062 0 601 21.938 601 49Z" 
            fill="#F2EFE9"
            className="dark:fill-[#2a2a2a]"
          />
        </svg>

        {/* 네비게이션 아이템들 */}
        <div className="absolute inset-0 flex items-center justify-around">
          {/* 홈 버튼 */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all ${
              isHomeActive 
                ? 'text-[#333333]' 
                : 'text-[#999999]'
            }`}
            aria-label="홈"
          >
            <svg 
              width="40" 
              height="42" 
              viewBox="0 0 40 42" 
              fill="none"
              className="transition-all"
            >
              <path 
                d="M25.5103 39.0538V23.5744C25.5103 23.0613 25.3064 22.5691 24.9435 22.2062C24.5807 21.8434 24.0885 21.6395 23.5753 21.6395H15.8356C15.3225 21.6395 14.8303 21.8434 14.4674 22.2062C14.1046 22.5691 13.9007 23.0613 13.9007 23.5744V39.0538" 
                stroke="currentColor" 
                strokeWidth="4.58" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M2.29119 17.7696C2.29106 17.2066 2.41374 16.6505 2.65068 16.1398C2.88761 15.6292 3.23311 15.1764 3.66305 14.813L17.2075 3.2054C17.906 2.61507 18.791 2.29119 19.7055 2.29119C20.62 2.29119 21.505 2.61507 22.2035 3.2054L35.748 14.813C36.1779 15.1764 36.5234 15.6292 36.7603 16.1398C36.9973 16.6505 37.12 17.2066 37.1198 17.7696V35.1839C37.1198 36.2102 36.7121 37.1946 35.9864 37.9203C35.2606 38.646 34.2763 39.0537 33.25 39.0537H6.16104C5.13469 39.0537 4.15038 38.646 3.42464 37.9203C2.69891 37.1946 2.29119 36.2102 2.29119 35.1839V17.7696Z" 
                stroke="currentColor" 
                strokeWidth="4.58" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 중앙 플로팅 네비게이션 버튼 */}
          <button
            onClick={() => setIsFloatingMenuOpen(!isFloatingMenuOpen)}
            className="flex items-center justify-center aspect-square bg-[#7C8A7B] rounded-full shadow-lg hover:opacity-90 transition-all"
            style={{ 
              width: '19.3%', // 116px / 601px ≈ 19.3%
              marginTop: '-12.24%' // 12px / 98px ≈ 12.24%
            }}
            aria-label="플로팅 네비게이션"
          >
            <svg 
              width="50" 
              height="50" 
              viewBox="0 0 50 50" 
              fill="none"
            >
              <path 
                d="M2.999 24.9948H46.9897" 
                stroke="white" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M24.9944 2.999V46.9897" 
                stroke="white" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 내 강의실 버튼 */}
          <button
            onClick={onMyCoursesClick}
            className={`flex flex-col items-center justify-center w-16 h-16 transition-all ${
              isMyClassroomActive 
                ? 'text-[#333333]' 
                : 'text-[#999999]'
            }`}
            aria-label="내 강의실"
          >
            <svg 
              width="44" 
              height="40" 
              viewBox="0 0 44 40" 
              fill="none"
              className="transition-all"
            >
              <path 
                d="M21.6402 10.0306V37.1196" 
                stroke="currentColor" 
                strokeWidth="4.58" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M4.22611 31.3151C3.71294 31.3151 3.22078 31.1112 2.85792 30.7483C2.49505 30.3855 2.29119 29.8933 2.29119 29.3801V4.22611C2.29119 3.71294 2.49505 3.22079 2.85792 2.85792C3.22078 2.49505 3.71294 2.29119 4.22611 2.29119H13.9007C15.9534 2.29119 17.9221 3.10662 19.3735 4.55809C20.825 6.00957 21.6404 7.97819 21.6404 10.0309C21.6404 7.97819 22.4559 6.00957 23.9073 4.55809C25.3588 3.10662 27.3274 2.29119 29.3801 2.29119H39.0547C39.5679 2.29119 40.0601 2.49505 40.4229 2.85792C40.7858 3.22079 40.9897 3.71294 40.9897 4.22611V29.3801C40.9897 29.8933 40.7858 30.3855 40.4229 30.7483C40.0601 31.1112 39.5679 31.3151 39.0547 31.3151H27.4452C25.9057 31.3151 24.4292 31.9266 23.3406 33.0152C22.252 34.1038 21.6404 35.5803 21.6404 37.1198C21.6404 35.5803 21.0289 34.1038 19.9403 33.0152C18.8516 31.9266 17.3752 31.3151 15.8357 31.3151H4.22611Z" 
                stroke="currentColor" 
                strokeWidth="4.58" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 플로팅 메뉴 */}
      {isFloatingMenuOpen && (
        <>
          {/* 배경 오버레이 */}
          <div 
            className="fixed inset-0 bg-black/50 -z-10"
            onClick={() => setIsFloatingMenuOpen(false)}
          />
          
          {/* 메뉴 패널 */}
          <div className="absolute bottom-full left-0 right-0 mb-8 mx-4 bg-white dark:bg-[#2a2a2a] shadow-2xl rounded-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">메뉴</h3>
              <button
                onClick={() => setIsFloatingMenuOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* 메뉴 그리드 */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => {
                  onNavigate('courses');
                  setIsFloatingMenuOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <GraduationCap size={28} className="text-[#7C8A7B] dark:text-[#93b190]" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">수강신청</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('schedule');
                  setIsFloatingMenuOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Calendar size={28} className="text-[#7C8A7B] dark:text-[#93b190]" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">시간표</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('materials');
                  setIsFloatingMenuOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FileText size={28} className="text-[#7C8A7B] dark:text-[#93b190]" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">강의자료</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('community');
                  setIsFloatingMenuOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Users size={28} className="text-[#7C8A7B] dark:text-[#93b190]" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">커뮤니티</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('inquiry');
                  setIsFloatingMenuOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <MessageSquare size={28} className="text-[#7C8A7B] dark:text-[#93b190]" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">문의하기</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('notice');
                  setIsFloatingMenuOpen(false);
                }}
                className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <BookOpen size={28} className="text-[#7C8A7B] dark:text-[#93b190]" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">공지사항</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
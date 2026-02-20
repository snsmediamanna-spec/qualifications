import { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Moon, Sun } from 'lucide-react';

interface LandingIntroProps {
  onEnter: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
}

export function LandingIntro({ onEnter, isDark, toggleDarkMode }: LandingIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 스크롤 이벤트로 페이지 진입
    const handleScroll = () => {
      if (window.scrollY > 100) {
        handleEnter();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnter = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onEnter();
    }, 800);
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-[#F5F3EE] dark:bg-[#1a1a1a] transition-opacity duration-800 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 배경 그리드 라인 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[10%] w-px h-full bg-stone-300/30 dark:bg-stone-700/30"></div>
        <div className="absolute top-0 right-[10%] w-px h-full bg-stone-300/30 dark:bg-stone-700/30"></div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative h-full grid grid-cols-1 lg:grid-cols-12">
        {/* 좌측: 메인 타이틀 */}
        <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-start px-8 lg:px-20 py-12 lg:py-0 lg:border-r border-stone-300/30 dark:border-stone-700/30 relative">
          <div className="relative z-10 space-y-8 text-center lg:text-left">
            <div className="space-y-4 -mt-20 lg:-mt-32">
              <h1 
                className="font-['Playfair_Display'] text-[6rem] lg:text-[9rem] leading-none tracking-tight text-stone-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Festival
              </h1>
              <h2 
                className="font-['Playfair_Display'] text-5xl lg:text-6xl leading-none tracking-tight text-stone-900 dark:text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Planner
              </h2>
            </div>

            <div className="space-y-4">
              <p className="text-2xl lg:text-3xl font-light tracking-[0.2em] text-stone-500 dark:text-stone-400 uppercase">
                Professional
              </p>
              <p className="text-lg lg:text-lg font-light text-stone-600 dark:text-stone-400">
                축제기획사 자격증 전문 교육기관
              </p>
            </div>

            <div className="pt-8 flex flex-col items-center lg:items-start">
              <button 
                onClick={handleEnter}
                className="bg-[#6cb25b] dark:bg-[#93b190] text-white px-12 py-6 text-base lg:text-sm tracking-[0.3em] hover:opacity-90 transition-all hover:scale-105 uppercase flex items-center gap-3"
              >
                Enter Site
                <ArrowRight size={22} className="transition-transform group-hover:translate-x-1" />
              </button>
              
              {/* 다크모드 토글 버튼 */}
              <button
                onClick={toggleDarkMode}
                className="mt-6 w-full lg:w-auto px-12 py-6 border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 backdrop-blur-sm hover:bg-stone-100 dark:hover:bg-stone-700 transition-all hover:scale-105 shadow-lg flex items-center justify-center"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <Moon size={24} className="text-stone-800 dark:text-stone-200" />
                ) : (
                  <Sun size={24} className="text-stone-800 dark:text-stone-200" />
                )}
              </button>
            </div>
          </div>

          {/* 하단 메타 정보 */}
          <div className="absolute bottom-12 left-8 lg:left-20 flex gap-12 text-[10px] tracking-widest text-stone-400 dark:text-stone-500 hidden lg:flex">
            <div className="space-y-1 uppercase">
              <p>Professional</p>
              <p>Certificate</p>
            </div>
            <div className="space-y-1 uppercase">
              <p>Online</p>
              <p>Education</p>
            </div>
            <div className="space-y-1 uppercase">
              <p>Festival</p>
              <p>Planning</p>
            </div>
          </div>
        </div>

        {/* 우측: 콘텐츠 카드 그리드 - 데스크탑에서만 표시 */}
        <div className="lg:col-span-7 bg-stone-100/30 dark:bg-stone-900/30 p-8 lg:p-20 hidden lg:flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
            {/* 메인 카드 */}
            <div className="aspect-video bg-[#6cb25b] dark:bg-[#93b190] flex flex-col justify-center px-10 relative overflow-hidden group shadow-xl">
              <div className="text-[8px] absolute top-6 left-10 opacity-60 text-white tracking-widest uppercase">
                Professional Course
              </div>
              <div className="text-[8px] absolute top-6 right-10 opacity-60 text-white tracking-widest uppercase">
                2024 Program
              </div>
              <h3 className="font-['Playfair_Display'] text-3xl text-white tracking-wider uppercase mb-2">
                Certificate
              </h3>
              <p className="text-[10px] text-white/70 max-w-[200px] leading-relaxed">
                축제기획사 자격증 취득을 위한 체계적인 교육 과정을 제공합니다.
              </p>
              <div className="text-[8px] absolute bottom-6 left-10 opacity-60 text-white tracking-widest">
                Est. 2024
              </div>
            </div>

            {/* 커리큘럼 카드 */}
            <div className="aspect-video bg-white dark:bg-stone-800 p-8 flex shadow-lg hover:-translate-y-1 transition-transform">
              <div className="w-1/3 flex flex-col justify-between border-r border-stone-200 dark:border-stone-700 pr-4">
                <h4 className="text-sm font-medium">커리큘럼</h4>
                <div className="space-y-2">
                  <p className="text-[8px] opacity-60">Curriculum</p>
                  <p className="text-[7px] leading-tight text-stone-500 dark:text-stone-400">
                    체계적인 교육 과정으로 전문가 양성
                  </p>
                </div>
              </div>
              <div className="w-2/3 pl-4 flex flex-col justify-center items-center">
                <div className="w-full h-full flex flex-col gap-1 items-center justify-center">
                  <div className="w-1/4 h-2 bg-stone-100 dark:bg-stone-700"></div>
                  <div className="w-2/4 h-2 bg-stone-200 dark:bg-stone-600"></div>
                  <div className="w-3/4 h-2 bg-stone-300 dark:bg-stone-500"></div>
                  <div className="w-full h-2 bg-[#6cb25b]/40 dark:bg-[#93b190]/40"></div>
                </div>
              </div>
            </div>

            {/* 강의 카드 */}
            <div className="aspect-video bg-white dark:bg-stone-800 p-8 flex shadow-lg hover:-translate-y-1 transition-transform">
              <div className="w-1/3 flex flex-col justify-between border-r border-stone-200 dark:border-stone-700 pr-4">
                <h4 className="text-sm font-medium">온라인 강의</h4>
                <div className="space-y-2">
                  <p className="text-[8px] opacity-60">Online Course</p>
                </div>
              </div>
              <div className="w-2/3 pl-4 relative flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-stone-100 dark:bg-stone-700/50 absolute"></div>
                <div className="w-16 h-16 rounded-full bg-stone-200 dark:bg-stone-600/50 absolute translate-x-2 translate-y-2"></div>
                <div className="w-10 h-10 rounded-full bg-[#6cb25b]/30 dark:bg-[#93b190]/30 absolute translate-x-4 translate-y-4"></div>
              </div>
            </div>

            {/* 진행률 카드 */}
            <div className="aspect-video bg-white dark:bg-stone-800 p-8 flex shadow-lg hover:-translate-y-1 transition-transform">
              <div className="w-1/3 border-r border-stone-200 dark:border-stone-700 pr-4">
                <h4 className="text-sm font-medium">학습 진행</h4>
              </div>
              <div className="w-2/3 pl-4 flex items-end gap-1">
                <div className="flex-1 h-8 bg-stone-100 dark:bg-stone-700"></div>
                <div className="flex-1 h-12 bg-stone-200 dark:bg-stone-600"></div>
                <div className="flex-1 h-16 bg-stone-300 dark:bg-stone-500"></div>
                <div className="flex-1 h-20 bg-[#6cb25b]/40 dark:bg-[#93b190]/40"></div>
              </div>
            </div>

            {/* 자격증 카드 */}
            <div className="aspect-video bg-white dark:bg-stone-800 p-8 flex shadow-lg hover:-translate-y-1 transition-transform">
              <div className="w-1/3 border-r border-stone-200 dark:border-stone-700 pr-4">
                <h4 className="text-sm font-medium leading-tight">자격증<br/>취득</h4>
              </div>
              <div className="w-2/3 pl-4 space-y-1 flex flex-col justify-center">
                <div className="h-3 bg-stone-100 dark:bg-stone-700/50 w-full"></div>
                <div className="h-3 bg-stone-100 dark:bg-stone-700/50 w-full"></div>
                <div className="h-3 bg-stone-200 dark:bg-stone-600/50 w-full"></div>
                <div className="h-3 bg-stone-200 dark:bg-stone-600/50 w-full"></div>
                <div className="h-3 bg-[#6cb25b]/20 dark:bg-[#93b190]/20 w-full"></div>
              </div>
            </div>

            {/* 수강생 카드 */}
            <div className="aspect-video bg-white dark:bg-stone-800 p-8 flex shadow-lg hover:-translate-y-1 transition-transform">
              <div className="w-1/3 border-r border-stone-200 dark:border-stone-700 pr-4">
                <h4 className="text-sm font-medium">수강생</h4>
              </div>
              <div className="w-2/3 pl-4 flex flex-col justify-center items-center gap-2">
                <div className="w-12 h-12 rounded-full border border-[#6cb25b]/40 dark:border-[#93b190]/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#6cb25b]/20 dark:bg-[#93b190]/20"></div>
                </div>
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-600"></div>
                  <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-600"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      {/* <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-50">
        <span className="text-[8px] tracking-[0.3em] uppercase text-stone-500 dark:text-stone-400">Scroll</span>
        <ChevronDown size={16} className="text-stone-500 dark:text-stone-400" />
      </div> */}
    </div>
  );
}
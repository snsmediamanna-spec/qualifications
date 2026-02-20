import React, { useState, useEffect } from 'react';
import { Logo } from '@/app/components/Logo';

interface LoadingScreenProps {
  isMobile?: boolean;
  scale?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isMobile, scale }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 프로그레스 바 애니메이션
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[9999] w-full h-screen bg-background flex flex-col items-center justify-center overflow-hidden select-none transition-colors duration-500"
      style={{
        transform: isMobile && scale ? `scale(${scale})` : 'none',
        transformOrigin: 'top left',
        width: isMobile && scale ? `${100 / scale}%` : '100%',
        height: isMobile && scale ? `${100 / scale}vh` : '100vh'
      }}
    >
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      
      {/* 메인 컨텐츠 */}
      <div className="layout-content-container flex flex-col items-center max-w-[960px] w-full z-10">
        {/* 로고 (스타버스트 대신) */}
        <div 
          className="mb-12 w-20 h-20 opacity-80"
          style={{
            animation: 'pulse-loading 4s ease-in-out infinite'
          }}
        >
          <Logo className="w-full h-full text-primary" />
        </div>

        {/* 학회명 */}
        <div className="text-center space-y-2 mb-16">
          <h1 className="text-foreground tracking-widest text-[32px] md:text-[42px] font-extralight italic leading-tight px-4 font-['Playfair_Display']">
            MyS PR &amp; Education Society
          </h1>
          <h2 className="text-foreground/70 text-lg md:text-xl font-medium leading-tight tracking-[0.2em] px-4 uppercase">
            마이스홍보교육학회
          </h2>
        </div>
      </div>

      {/* 하단 프로그레스 바 */}
      <div className="absolute bottom-16 w-full max-w-md px-8 flex flex-col items-center gap-4">
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-end px-1">
            <p className="text-muted-foreground text-xs font-light tracking-widest uppercase">
              Initializing Experience
            </p>
            <p className="text-foreground text-xs font-medium leading-normal">
              {progress}%
            </p>
          </div>
          <div className="w-full h-[1px] bg-primary/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(109, 148, 105, 0.3)'
              }}
            ></div>
          </div>
        </div>
        <p className="text-primary/70 text-[10px] tracking-[0.3em] font-light uppercase mt-2">
          Crafting Excellence in Education
        </p>
      </div>

      {/* 코너 장식 */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-10 left-10 border-l border-t border-primary/20 w-24 h-24"></div>
        <div className="absolute bottom-10 right-10 border-r border-b border-primary/20 w-24 h-24"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-loading {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(0.95); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05); 
          }
        }
      `}} />
    </div>
  );
};

export default LoadingScreen;
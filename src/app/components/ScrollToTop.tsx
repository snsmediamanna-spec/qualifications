import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * 페이지 이동 시 스크롤을 맨 위로 자동 이동
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 변경 시 즉시 스크롤을 맨 위로
    window.scrollTo(0, 0);
    
    // 추가적으로 document.documentElement도 리셋 (일부 브라우저 호환성)
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

/**
 * 단순 viewport 감지 시스템
 * 
 * 핵심 원칙:
 * - viewport width < 1024px = 모바일
 * - viewport width >= 1024px = 데스크탑
 * - devicePixelRatio, User Agent 무시
 */

export interface ViewportInfo {
  width: number;
  height: number;
  isMobile: boolean;
  orientation: 'portrait' | 'landscape';
}

/**
 * 현재 viewport 정보를 가져옵니다
 */
export function getViewportInfo(): ViewportInfo {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const isMobile = width < 1024;
  const orientation = height > width ? 'portrait' : 'landscape';
  
  return {
    width,
    height,
    isMobile,
    orientation
  };
}

/**
 * viewport 정보를 HTML body에 데이터 속성으로 설정합니다
 */
export function setViewportAttributes(): void {
  const info = getViewportInfo();
  const body = document.body;
  
  body.setAttribute('data-viewport-width', info.width.toString());
  body.setAttribute('data-viewport-height', info.height.toString());
  body.setAttribute('data-is-mobile', info.isMobile.toString());
  body.setAttribute('data-orientation', info.orientation);
  
  // CSS 클래스 추가
  if (info.isMobile) {
    body.classList.add('is-mobile');
    body.classList.remove('is-desktop');
  } else {
    body.classList.add('is-desktop');
    body.classList.remove('is-mobile');
  }
  
  if (info.orientation === 'portrait') {
    body.classList.add('is-portrait');
    body.classList.remove('is-landscape');
  } else {
    body.classList.add('is-landscape');
    body.classList.remove('is-portrait');
  }
}

/**
 * viewport 변경을 감지하고 속성을 업데이트합니다
 */
export function watchViewportChanges(): () => void {
  const handleResize = () => {
    setViewportAttributes();
  };
  
  // 초기 설정
  setViewportAttributes();
  
  // resize 이벤트 리스너 등록
  window.addEventListener('resize', handleResize);
  
  // orientation change 이벤트 리스너 등록
  window.addEventListener('orientationchange', handleResize);
  
  // 정리 함수 반환
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
  };
}

/**
 * 개발 모드 디버그 정보 표시
 */
export function showSimpleDebugInfo(): () => void {
  // 디버그 엘리먼트 생성
  const debugElement = document.createElement('div');
  debugElement.id = 'simple-viewport-debug';
  debugElement.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 10px;
    background: rgba(0, 122, 255, 0.9);
    color: white;
    padding: 8px 12px;
    border-radius: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
    font-size: 12px;
    font-weight: 600;
    z-index: 9998;
    pointer-events: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
  `;
  
  const updateDebugInfo = () => {
    const info = getViewportInfo();
    debugElement.innerHTML = `
      📱 ${info.width}×${info.height}<br>
      ${info.isMobile ? '📱 Mobile' : '🖥️ Desktop'}<br>
      ${info.orientation === 'portrait' ? '📐 Portrait' : '🔄 Landscape'}
    `;
  };
  
  // 초기 정보 표시
  updateDebugInfo();
  document.body.appendChild(debugElement);
  
  // resize 이벤트 리스너
  const handleResize = () => {
    updateDebugInfo();
  };
  
  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);
  
  // 정리 함수
  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    debugElement.remove();
  };
}

// 개발 환경에서 자동 활성화
if (import.meta.env.DEV) {
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      watchViewportChanges();
      showSimpleDebugInfo();
    });
  }
}

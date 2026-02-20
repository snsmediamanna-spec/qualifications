/**
 * 모바일 기기 감지 유틸리티
 * User Agent와 viewport를 함께 체크하여 정확한 기기 타입 판별
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  os: 'ios' | 'android' | 'windows' | 'mac' | 'linux' | 'unknown';
}

/**
 * User Agent 기반 모바일 감지
 */
export function isMobileUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  
  // 모바일 기기 패턴
  const mobilePatterns = [
    /android/i,
    /webos/i,
    /iphone/i,
    /ipod/i,
    /blackberry/i,
    /windows phone/i,
    /mobile/i
  ];
  
  return mobilePatterns.some(pattern => pattern.test(ua));
}

/**
 * User Agent 기반 태블릿 감지
 */
export function isTabletUserAgent(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent.toLowerCase();
  
  // 태블릿 패턴 (iPad, Android Tablet 등)
  const tabletPatterns = [
    /ipad/i,
    /android(?!.*mobile)/i, // Android이지만 mobile이 없으면 태블릿
    /tablet/i,
    /kindle/i,
    /playbook/i,
    /silk/i
  ];
  
  return tabletPatterns.some(pattern => pattern.test(ua));
}

/**
 * OS 감지
 */
export function detectOS(): DeviceInfo['os'] {
  if (typeof navigator === 'undefined') return 'unknown';
  
  const ua = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/windows/.test(ua)) return 'windows';
  if (/mac os/.test(ua)) return 'mac';
  if (/linux/.test(ua)) return 'linux';
  
  return 'unknown';
}

/**
 * 화면 크기 기반 모바일 감지
 * 768px 이하를 모바일로 간주
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * 화면 크기 기반 태블릿 감지
 * 768px ~ 1023px을 태블릿으로 간주
 */
export function isTabletViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * 터치 기능 감지
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - IE11 호환
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * 종합 기기 정보 감지
 * User Agent + Viewport + Touch를 모두 고려하여 정확한 기기 타입 판별
 */
export function getDeviceInfo(): DeviceInfo {
  const mobileUA = isMobileUserAgent();
  const tabletUA = isTabletUserAgent();
  const mobileVP = isMobileViewport();
  const tabletVP = isTabletViewport();
  const hasTouch = isTouchDevice();
  const os = detectOS();
  
  // 우선순위 1: User Agent가 명확하게 태블릿이면 태블릿
  if (tabletUA) {
    return {
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      deviceType: 'tablet',
      os
    };
  }
  
  // 우선순위 2: User Agent가 명확하게 모바일이면 모바일
  if (mobileUA) {
    return {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      deviceType: 'mobile',
      os
    };
  }
  
  // 우선순위 3: Viewport 크기로 판단
  if (mobileVP) {
    return {
      isMobile: true,
      isTablet: false,
      isDesktop: false,
      deviceType: 'mobile',
      os
    };
  }
  
  if (tabletVP) {
    return {
      isMobile: false,
      isTablet: true,
      isDesktop: false,
      deviceType: 'tablet',
      os
    };
  }
  
  // 기본값: 데스크탑
  return {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
    os
  };
}

/**
 * React Hook용: 기기 정보를 반환하고 윈도우 리사이즈를 감지
 */
export function useDeviceDetection() {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(getDeviceInfo());
  
  React.useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };
    
    window.addEventListener('resize', handleResize);
    
    // 초기 감지
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return deviceInfo;
}

// React import for hook
import React from 'react';

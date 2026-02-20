// ==================== 전체 추적 데이터 수집 ====================

export async function collectAdvancedTrackingData(publicIP?: string): Promise<AdvancedTrackingData> {
  // ✅ publicIP는 서버에서 제공되므로 클라이언트에서 조회하지 않음
  // IP가 없으면 'unknown'으로 설정
  if (!publicIP) {
    publicIP = 'unknown';
  }
  
  // ✅ 가벼운 데이터만 동기 수집
  const nav = navigator as any;
  
  const partialData: Partial<AdvancedTrackingData> = {
    publicIP,
    localIPs: [], // 무거운 WebRTC 호출 제거
    dnsLeakIPs: [], // 브라우저에서는 DNS Leak 감지 불가능
    
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    language: navigator.language,
    languages: navigator.languages ? Array.from(navigator.languages) : [navigator.language],
    
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    vendor: navigator.vendor,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    
    screenResolution: `${screen.width}x${screen.height}`,
    screenColorDepth: screen.colorDepth,
    screenPixelRatio: window.devicePixelRatio,
    availableScreenSize: `${screen.availWidth}x${screen.availHeight}`,
    
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: nav.deviceMemory,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    
    webGL: { available: false }, // WebGL 무거운 연산 제거
    canvas: '', // Canvas 핑거프린팅 제거
    fonts: [], // 무거운 폰트 감지 제거
    
    connectionType: undefined,
    connectionSpeed: undefined,
    
    plugins: [], // 플러그인 감지 제거
    
    systemTime: new Date().toISOString(),
  };
  
  const suspicion = { score: 0, reasons: [] as string[] }; // 의심도 계산 제거
  const fingerprintHash = 'optimized'; // 핑거프린트 생성 제거
  
  const fullData: AdvancedTrackingData = {
    ...partialData,
    suspicionScore: suspicion.score,
    suspicionReasons: suspicion.reasons,
    fingerprintHash
  } as AdvancedTrackingData;
  
  return fullData;
}
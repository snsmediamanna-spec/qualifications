import React from 'react';
import ReactDOM from 'react-dom/root';
import App from '@/app/App';
import '@/styles/index.css';
import '@/styles/tailwind.css';
import '@/styles/theme.css';
import '@/styles/fonts.css';
import '@/styles/safe-area.css'; /* ✅ Safe Area 완벽 대응 (최우선) */
import '@/styles/mobile-consistent.css'; /* ✅ 완전히 일관된 모바일 경험 */
import '@/styles/responsive.css'; /* ✅ 스마트 반응형 시스템 */
import '@/styles/display-size-handler.css'; /* ✅ 디스플레이 크기 설정 핸들러 */
import '@/styles/device-compatibility.css'; /* ✅ 종합 기기 호환성 시스템 */
import '@/styles/homepage.css';
import '@/styles/slick.css';
import '@/styles/notice-popup.css';

// 🔄 앱 버전 관리 및 캐시 무효화 시스템
const APP_VERSION = 'v2.9.1'; // ✅ 버전 업데이트 (Wrapper 페이지 import 오류 수정)
const STORAGE_KEY = 'app_version';

// 버전 체크 및 캐시 클리어
const checkVersion = () => {
  const storedVersion = localStorage.getItem(STORAGE_KEY);
  
  if (storedVersion !== APP_VERSION) {
    console.log(`🔄 앱 버전 업데이트 감지: ${storedVersion} → ${APP_VERSION}`);
    console.log('🧹 캐시 클리어 중...');
    
    // localStorage 클리어 (사용자 데이터 제외)
    const userEmail = localStorage.getItem('userEmail');
    const userToken = localStorage.getItem('userToken');
    const darkMode = localStorage.getItem('darkMode');
    
    localStorage.clear();
    
    // 사용자 데이터 복원
    if (userEmail) localStorage.setItem('userEmail', userEmail);
    if (userToken) localStorage.setItem('userToken', userToken);
    if (darkMode) localStorage.setItem('darkMode', darkMode);
    
    // 새 버전 저장
    localStorage.setItem(STORAGE_KEY, APP_VERSION);
    
    // 페이지 강제 새로고침 (캐시 무시)
    console.log('✅ 캐시 클리어 완료. 페이지를 새로고침합니다...');
    window.location.reload();
  } else {
    console.log(`✅ 앱 버전: ${APP_VERSION} (최신)`);
  }
};

// 버전 체크 실행
checkVersion();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
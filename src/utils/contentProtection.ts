/**
 * 🔒 콘텐츠 보호 시스템 (경량 버전)
 * 
 * 보호 기능:
 * 1. 우클릭 방지 (이미지/영상 저장 차단)
 * 2. 소스 보기 차단 (Ctrl+U)
 * 3. 드래그 앤 드롭 방지
 * 4. 페이지 저장 차단 (Ctrl+S)
 * 
 * ✅ 개발자 도구는 허용 (디버깅 필요)
 * ✅ 텍스트 선택/복사는 허용 (사용자 경험 고려)
 */

interface ProtectionOptions {
  disableRightClick?: boolean;
  disableSourceView?: boolean;
  disableDragAndDrop?: boolean;
  disableSave?: boolean;
  showWarnings?: boolean;
}

class ContentProtection {
  private options: ProtectionOptions;

  constructor(options: ProtectionOptions = {}) {
    this.options = {
      disableRightClick: true,
      disableSourceView: true,
      disableDragAndDrop: true,
      disableSave: true,
      showWarnings: true,
      ...options
    };
  }

  /**
   * 보호 시스템 활성화
   */
  enable(): void {
    console.log('🔒 콘텐츠 보호 시스템 활성화 (경량 모드)');

    if (this.options.disableRightClick) {
      this.preventRightClick();
    }

    if (this.options.disableSourceView) {
      this.preventSourceView();
    }

    if (this.options.disableDragAndDrop) {
      this.preventDragAndDrop();
    }

    if (this.options.disableSave) {
      this.preventSave();
    }
  }

  /**
   * 보호 시스템 비활성화
   */
  disable(): void {
    console.log('🔓 콘텐츠 보호 시스템 비활성화');
    window.location.reload();
  }

  /**
   * 1. 우클릭 방지
   */
  private preventRightClick(): void {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      
      if (this.options.showWarnings) {
        this.showWarning('우클릭은 비활성화되어 있습니다.');
      }
      
      console.log('🚫 우클릭 차단됨');
      return false;
    }, false);

    console.log('✅ 우클릭 방지 활성화');
  }

  /**
   * 2. 소스 보기 차단
   */
  private preventSourceView(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl+U (소스 보기)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        this.showWarning('소스 보기는 비활성화되어 있습니다.');
        console.log('🚫 Ctrl+U 차단됨');
        return false;
      }

      // Mac: Cmd+Option+U
      if (e.metaKey && e.altKey && e.key === 'u') {
        e.preventDefault();
        this.showWarning('소스 보기는 비활성화되어 있습니다.');
        console.log('🚫 Cmd+Option+U 차단됨');
        return false;
      }
    });

    console.log('✅ 소스 보기 차단 활성화');
  }

  /**
   * 3. 드래그 앤 드롭 방지
   */
  private preventDragAndDrop(): void {
    document.addEventListener('dragstart', (e) => {
      // 이미지, 링크, 비디오만 차단
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || 
          target.tagName === 'A' || 
          target.tagName === 'VIDEO' ||
          target.tagName === 'IFRAME') {
        e.preventDefault();
        console.log('🚫 드래그 차단됨:', target.tagName);
        return false;
      }
    });

    console.log('✅ 드래그 앤 드롭 방지 활성화');
  }

  /**
   * 4. 페이지 저장 차단
   */
  private preventSave(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl+S (페이지 저장)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        this.showWarning('페이지 저장은 비활성화되어 있습니다.');
        console.log('🚫 Ctrl+S 차단됨');
        return false;
      }

      // Mac: Cmd+S
      if (e.metaKey && e.key === 's') {
        e.preventDefault();
        this.showWarning('페이지 저장은 비활성화되어 있습니다.');
        console.log('🚫 Cmd+S 차단됨');
        return false;
      }
    });

    console.log('✅ 페이지 저장 차단 활성화');
  }

  /**
   * 경고 메시지 표시 (토스트)
   */
  private showWarning(message: string): void {
    // 기존 토스트 제거
    const existing = document.getElementById('content-protection-toast');
    if (existing) {
      existing.remove();
    }

    // 토스트 생성
    const toast = document.createElement('div');
    toast.id = 'content-protection-toast';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 999998;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = `🔒 ${message}`;
    
    // 애니메이션 추가
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// 싱글톤 인스턴스 생성
const contentProtection = new ContentProtection({
  disableRightClick: true,
  disableSourceView: true,
  disableDragAndDrop: true,
  disableSave: true,
  showWarnings: false
});

export default contentProtection;

/**
 * 사용 방법:
 * 
 * import contentProtection from '@/utils/contentProtection';
 * 
 * // 보호 활성화
 * contentProtection.enable();
 * 
 * // 보호 비활성화
 * contentProtection.disable();
 */
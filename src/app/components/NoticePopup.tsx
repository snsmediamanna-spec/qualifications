import { useState, useEffect } from 'react';
import '@/styles/notice-popup.css';

interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  isPinned: boolean;
  isPopup: boolean;
  status: string;
  imageUrl?: string;
  images?: string[];
}

interface NoticePopupProps {
  notices: Notice[];
  onClose: () => void;
}

export function NoticePopup({ notices, onClose }: NoticePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hideToday, setHideToday] = useState(false);

  // 현재 표시할 공지사항
  const currentNotice = notices[currentIndex];

  // 배경 이미지 URL 가져오기
  const backgroundImage = currentNotice?.images?.[0] || currentNotice?.imageUrl || '';

  const handleClose = () => {
    if (hideToday) {
      // 오늘 하루 보지 않기 설정
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      localStorage.setItem(`hideNoticePopup_${currentNotice.id}`, tomorrow.getTime().toString());
    }

    // 다음 공지사항이 있으면 표시, 없으면 완전히 닫기
    if (currentIndex < notices.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHideToday(false);
    } else {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!currentNotice) return null;

  const containerStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})` }
    : {};

  const containerClass = backgroundImage 
    ? 'modal-container modal-container-with-image'
    : 'modal-container';

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={containerClass} style={containerStyle}>
        <div className="modal-header">
          <h2 className="modal-title">{currentNotice.title}</h2>
          <button className="modal-close" onClick={handleClose} aria-label="닫기"></button>
        </div>
        
        <div className="modal-body">
          {currentNotice.content}
        </div>
        
        <div className="modal-footer">
          <div className="modal-checkbox-wrapper">
            <input 
              type="checkbox" 
              id="hideToday" 
              className="modal-checkbox"
              checked={hideToday}
              onChange={(e) => setHideToday(e.target.checked)}
            />
            <label htmlFor="hideToday" className="modal-checkbox-label">
              오늘 하루 보지 않기
            </label>
          </div>
          <button className="modal-button" onClick={handleClose}>
            {currentIndex < notices.length - 1 ? '다음' : '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}

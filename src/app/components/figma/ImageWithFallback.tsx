import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Google Drive FILE_ID 추출
function extractGoogleDriveFileId(url: string): string | null {
  if (!url) return null;

  try {
    // 패턴 1: https://drive.google.com/file/d/FILE_ID/view
    const pattern1 = /\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match1 = url.match(pattern1);
    if (match1) return match1[1];

    // 패턴 2: https://drive.google.com/open?id=FILE_ID
    const pattern2 = /[?&]id=([a-zA-Z0-9_-]+)/;
    const match2 = url.match(pattern2);
    if (match2) return match2[1];

    // 패턴 3: https://drive.google.com/uc?export=view&id=FILE_ID
    const pattern3 = /uc\?.*id=([a-zA-Z0-9_-]+)/;
    const match3 = url.match(pattern3);
    if (match3) return match3[1];

    // 패턴 4: FILE_ID만 있는 경우 (20자 이상의 영숫자+하이픈+언더스코어)
    if (/^[a-zA-Z0-9_-]{20,}$/.test(url)) {
      return url;
    }
  } catch (error) {
    console.error('FILE_ID 추출 오류:', error);
  }

  return null;
}

// Google Drive URL을 직접 접근 가능한 URL로 변환
function convertGoogleDriveUrl(url: string): string {
  if (!url) return '';

  const fileId = extractGoogleDriveFileId(url);
  
  if (fileId) {
    // ✅ 성공한 형식만 사용
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  }

  return url; // Google Drive가 아닌 경우 원본 반환
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)

  const handleError = () => {
    setDidError(true)
  }

  const { src, alt, style, className, onError, ...restProps } = props
  
  // Google Drive URL 자동 변환
  const convertedSrc = src ? convertGoogleDriveUrl(src) : src;
  
  // 표준 HTML img 속성만 필터링
  const validProps = Object.keys(restProps).reduce((acc, key) => {
    if (key.startsWith('data-') || 
        key.startsWith('aria-') || 
        ['loading', 'decoding', 'crossOrigin', 'referrerPolicy', 'sizes', 'srcSet', 'useMap', 'width', 'height'].includes(key)) {
      acc[key] = restProps[key as keyof typeof restProps];
    }
    return acc;
  }, {} as Record<string, any>);

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex flex-col items-center justify-center w-full h-full p-8 gap-4">
        <img 
          src={ERROR_IMG_SRC} 
          alt="이미지 로드 실패" 
          className="opacity-30"
          style={{ maxWidth: '120px', maxHeight: '120px' }}
        />
        <div className="text-sm text-gray-500 space-y-2">
          <p className="font-medium">이미지를 불러올 수 없습니다</p>
          {src && (
            <div className="text-xs bg-gray-50 p-3 rounded border border-gray-200 max-w-md overflow-x-auto">
              <p className="font-mono break-all">{src}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <img 
      src={convertedSrc} 
      alt={alt} 
      className={className} 
      style={style} 
      {...validProps} 
      onError={handleError}
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  )
}

import { Loader2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  message?: string;
}

export function UploadProgress({ progress, message = "업로드 중..." }: UploadProgressProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        {/* 로딩 아이콘 */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary-foreground animate-spin" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-background"></div>
          </div>
        </div>

        {/* 메시지 */}
        <h3 className="text-xl font-semibold text-foreground text-center mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {message}
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
          잠시만 기다려주세요
        </p>

        {/* 진행률 바 */}
        <div className="space-y-3">
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          
          {/* 퍼센트 표시 */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>진행률</span>
            <span className="font-semibold text-primary" style={{ fontFamily: "'Inter', sans-serif" }}>{progress}%</span>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="mt-6 p-4 bg-muted/30 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-1.5 animate-pulse"></div>
            <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              업로드가 완료될 때까지 페이지를 벗어나지 마세요
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

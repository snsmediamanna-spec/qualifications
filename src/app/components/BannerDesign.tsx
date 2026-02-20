interface BannerDesignProps {
  design: string;
  title: string;
  onClose: () => void;
  onClick?: () => void;
  onCloseTodayOnly?: () => void; // 오늘 하루 닫기 콜백
}

export function BannerDesign({ design, title, onClose, onClick, onCloseTodayOnly }: BannerDesignProps) {
  const renderDesign = () => {
    switch (design) {
      case 'design1':
        // Minimal Sage - Elegant simplicity
        return (
          <div className="relative overflow-hidden h-full bg-primary">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-12 h-full">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="border-r border-primary-foreground/20"></div>
                ))}
              </div>
            </div>
            
            {/* Large typography element */}
            <div 
              className="absolute right-8 top-1/2 -translate-y-1/2 font-serif text-6xl opacity-10 italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              ✦
            </div>
          </div>
        );
      
      case 'design2':
        // Geometric minimal - Clean lines
        return (
          <div className="relative overflow-hidden h-full bg-background border-y-2 border-primary">
            {/* Thin lines pattern */}
            <div className="absolute right-1/4 top-0 bottom-0 w-px bg-primary/20"></div>
            <div className="absolute right-1/3 top-0 bottom-0 w-px bg-primary/10"></div>
            
            {/* Floating square */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 w-16 h-16 border border-primary/30 rotate-45"></div>
            
            {/* Small accent dots */}
            <div className="absolute right-32 top-4 w-1 h-1 rounded-full bg-primary"></div>
            <div className="absolute right-24 bottom-4 w-1 h-1 rounded-full bg-primary"></div>
          </div>
        );
      
      case 'design3':
        // Typography focused - Editorial style
        return (
          <div className="relative overflow-hidden h-full bg-muted">
            {/* Large number background */}
            <div 
              className="absolute right-4 top-1/2 -translate-y-1/2 font-serif text-8xl opacity-5 leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              01
            </div>
            
            {/* Subtle horizontal lines */}
            <div className="absolute left-0 top-1/4 right-0 h-px bg-foreground/5"></div>
            <div className="absolute left-0 bottom-1/4 right-0 h-px bg-foreground/5"></div>
            
            {/* Small serif accent */}
            <div 
              className="absolute left-4 top-4 font-serif text-2xl opacity-20"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              "
            </div>
          </div>
        );
      
      case 'design4':
        // Brutalist minimal - Bold and direct
        return (
          <div className="relative overflow-hidden h-full bg-foreground">
            {/* Inverted colors for brutalist feel */}
            <div className="absolute inset-0 bg-foreground">
              {/* Heavy border accent */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-background"></div>
              
              {/* Chunky typography element */}
              <div 
                className="absolute right-12 top-1/2 -translate-y-1/2 font-serif text-5xl opacity-10 font-black"
                style={{ fontFamily: "'Playfair Display', serif", color: 'var(--background)' }}
              >
                *
              </div>
            </div>
          </div>
        );
      
      case 'design5':
        // Soft gradient minimal - Gentle sophistication
        return (
          <div className="relative overflow-hidden h-full" style={{ background: 'linear-gradient(135deg, #7c8a7b 0%, #6a7869 100%)' }}>
            {/* Soft circles */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/5"></div>
            <div className="absolute right-24 top-1/3 w-16 h-16 rounded-full bg-white/3"></div>
            
            {/* Delicate lines */}
            <div className="absolute right-8 top-6 bottom-6 w-px bg-white/20"></div>
            
            {/* Small serif detail */}
            <div 
              className="absolute right-40 bottom-6 font-serif text-xs opacity-20 uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif", color: 'white' }}
            >
              Notice
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-full bg-primary"></div>
        );
    }
  };

  return (
    <div className="relative w-full h-full">
      {renderDesign()}
      
      {/* Content area - Minimal layout */}
      <div className="absolute inset-0 flex items-center justify-between px-8 md:px-12 z-10">
        <div className="flex items-center justify-between flex-1 max-w-7xl mx-auto w-full gap-6">
          {/* Title */}
          <h3 
            className="text-base md:text-lg font-medium cursor-pointer hover:opacity-70 transition-opacity tracking-tight flex-1"
            onClick={onClick}
            style={{ 
              fontFamily: "'Inter', sans-serif",
              color: design === 'design4' ? 'var(--background)' : (design === 'design2' || design === 'design3' ? 'var(--foreground)' : 'white')
            }}
          >
            {title}
          </h3>
        
          {/* 오늘 하루 닫기 버튼 (onCloseTodayOnly가 있을 때만 표시) */}
          {onCloseTodayOnly && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTodayOnly();
              }}
              className="flex-shrink-0 px-4 py-2 text-xs hover:opacity-60 transition-opacity border"
              style={{ 
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                color: design === 'design4' ? 'var(--background)' : (design === 'design2' || design === 'design3' ? 'var(--foreground)' : 'white'),
                borderColor: design === 'design4' ? 'var(--background)' : (design === 'design2' || design === 'design3' ? 'var(--foreground)' : 'white')
              }}
              aria-label="오늘 하루 닫기"
            >
              오늘 하루 닫기
            </button>
          )}

          {/* Close button - Minimal design */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="flex-shrink-0 p-2 hover:opacity-60 transition-opacity group"
            aria-label="배너 닫기"
          >
            <div className="relative w-5 h-5">
              <span 
                className="absolute top-1/2 left-0 right-0 h-px transform -translate-y-1/2 rotate-45"
                style={{ backgroundColor: design === 'design4' ? 'var(--background)' : (design === 'design2' || design === 'design3' ? 'var(--foreground)' : 'white') }}
              ></span>
              <span 
                className="absolute top-1/2 left-0 right-0 h-px transform -translate-y-1/2 -rotate-45"
                style={{ backgroundColor: design === 'design4' ? 'var(--background)' : (design === 'design2' || design === 'design3' ? 'var(--foreground)' : 'white') }}
              ></span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
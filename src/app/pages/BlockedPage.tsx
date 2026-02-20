export function BlockedPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="mb-8">
          <svg 
            className="w-24 h-24 mx-auto text-[#6cb25b] opacity-30"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" 
            />
          </svg>
        </div>

        {/* Title */}
        <h1 
          className="mb-6 text-[#6cb25b]"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            fontSize: '2.5rem',
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}
        >
          접근이 차단되었습니다
        </h1>

        {/* Message */}
        <p 
          className="text-gray-600 leading-relaxed mb-8"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1.125rem',
            lineHeight: '1.8'
          }}
        >
          불미스러운 사용자 패턴으로<br />
          귀하의 IP 주소가 차단되었습니다.
        </p>

        {/* Additional Info */}
        <div 
          className="text-gray-400 text-sm"
          style={{
            fontFamily: "'Inter', sans-serif"
          }}
        >
          문의사항이 있으시면 관리자에게 연락해 주시기 바랍니다.
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { ChevronLeft, Eye, Calendar, User, Pin, Search, Edit, Trash2, Plus, ChevronRight, Loader2, ArrowLeft, Image as ImageIcon, Bell } from 'lucide-react';
import { BannerDesign } from './BannerDesign';
import { RichTextEditor } from './RichTextEditor';

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
  imageUrl?: string; // 단일 이미지 URL (하위 호환성)
  images?: string[]; // 여러 이미지 URL 배열
}

interface NoticePageProps {
  onNavigate: (page: string) => void;
  isAdmin: boolean;
  allNotices?: Notice[]; // ✅ App.tsx에서 전달받은 공지사항 목록
  noticesLoaded?: boolean; // ✅ 로딩 완료 여부
}

export function NoticePage({ onNavigate, isAdmin, allNotices = [], noticesLoaded = false }: NoticePageProps) {
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  
  const [searchTerm, setSearchTerm] = useState('');
  const [notices, setNotices] = useState<Notice[]>(allNotices); // ✅ 초기값으로 전달받은 데이터 사용
  const [isLoading, setIsLoading] = useState(!noticesLoaded); // ✅ 이미 로드된 경우 로딩 스킵
  const [error, setError] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [contentImagesLoaded, setContentImagesLoaded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPinned: false,
    imageUrls: ""
  });
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  // 페이지 로드 시 사용자 정보 및 공지사항 목록 가져오기
  useEffect(() => {
    // sessionStorage에서 로그인된 사용자 정보 가져오기
    const userInfo = sessionStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setCurrentUser({ name: user.name, email: user.email });
      } catch (error) {
        console.error('사용자 정보 파싱 오류:', error);
      }
    }
    
    // ✅ Props로 받은 데이터가 없을 때만 fetch
    if (!noticesLoaded) {
      fetchNotices();
    }
  }, []);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const requestBody = {
        action: 'getNotices',
        timestamp: new Date().getTime()
      };

      // CORS 우회를 위한 단순화된 fetch
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status} ${response.statusText}`);
      }

      const text = await response.text();
      
      let result;
      
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error('서버 응답을 파싱할 수 없습니다.');
      }

      if (result.success && Array.isArray(result.notices)) {
        // 데이터 정규화 + base64 이미지 제거
        const normalizedNotices = result.notices.map((notice: any) => {
          let cleanContent = notice.content || '';
          
          // ✅ base64 이미지를 완전히 제거 (조용히 처리)
          if (cleanContent.includes('data:image')) {
            cleanContent = cleanContent.replace(
              /<img\s+[^>]*src="data:image\/[^"]*"[^>]*>/gi,
              ''
            );
          }
          
          return {
            id: notice.id || notice.rowNumber || 0,
            title: notice.title || '',
            content: cleanContent,
            author: notice.author || '관리자',
            createdAt: notice.createdAt || new Date().toISOString(),
            views: notice.views || 0,
            isPinned: notice.isPinned || false,
            isPopup: notice.isPopup || false,
            status: notice.status || '게시중',
            imageUrl: notice.imageUrl || '',
            images: notice.images || []
          };
        });
        
        setNotices(normalizedNotices);
      } else {
        setError(result.message || '공지사항을 불러올 수 없습니다.');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 상세 조회 (조회수 증가)
  const handleNoticeClick = async (noticeId: number) => {
    try {
      // ✅ 상태 초기화
      setIsLoadingDetail(true);
      setSelectedNotice(null);
      setContentImagesLoaded(false);

      // 1️⃣ 클릭한 공지사항 찾기
      const clickedNotice = notices.find(n => n.id === noticeId);
      if (!clickedNotice) {
        setIsLoadingDetail(false);
        setContentImagesLoaded(true);
        return;
      }
      
      // 2️⃣ 상세 페이지로 전환
      setSelectedNotice(clickedNotice);
      
      // 3️⃣ 이미지 확인 및 로딩
      const imageUrls = clickedNotice.images && clickedNotice.images.length > 0 
        ? clickedNotice.images 
        : (clickedNotice.imageUrl ? [clickedNotice.imageUrl] : []);
      
      if (imageUrls.length > 0) {
        // 이미지가 있으면 프리로드
        const loadPromises = imageUrls
          .filter(url => url && url.trim()) // 빈 URL 필터링
          .map(url => {
            return new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve(url);
              img.onerror = () => resolve(url); // 에러도 resolve로 처리
              img.src = url;
            });
          });

        // 모든 이미지 로드 완료 대기
        await Promise.all(loadPromises);
      }
      
      // 4️⃣ 로딩 완료
      setContentImagesLoaded(true);
      setIsLoadingDetail(false);
        
      // 5️⃣ 백그라운드에서 조회수 증가 (비동기)
      fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'getNotice',
          noticeId: noticeId
        })
      }).then(response => response.json())
        .then(result => {
          if (result.success && result.notice) {
            // 조회수가 증가된 상세 정보로 업데이트
            setSelectedNotice(result.notice);
            
            // 목록의 조회수도 업데이트
            setNotices(prevNotices => 
              prevNotices.map(n => 
                n.id === noticeId 
                  ? { ...n, views: result.notice.views }
                  : n
              )
            );
          }
        })
        .catch(error => {
          console.error('조회수 증가 오류:', error);
        });

    } catch (error) {
      console.error('공지사항 클릭 오류:', error);
      setIsLoadingDetail(false);
      setContentImagesLoaded(true);
    }
  };

  // 공지사항 작성 핸들러
  const handleCreateNotice = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setStatus({
        success: false,
        message: "제목과 내용을 입력해주세요."
      });
      return;
    }

    if (!currentUser) {
      setStatus({
        success: false,
        message: "로그인 정보를 찾을 수 없습니다."
      });
      return;
    }

    try {
      setIsLoading(true);
      const imageUrlsArray = formData.imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'createNotice',
          title: formData.title,
          content: formData.content,
          author: currentUser.name,
          isPinned: formData.isPinned,
          isPopup: false,
          images: imageUrlsArray
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          success: true,
          message: '공지사항이 성공적으로 생성되었습니다.'
        });
        setShowCreateModal(false);
        setFormData({ title: "", content: "", isPinned: false, imageUrls: "" });
        fetchNotices();
      } else {
        setStatus({
          success: false,
          message: result.message || '공지사항 생성 실패'
        });
      }
    } catch (error) {
      console.error('❌ 공지사항 생성 오류:', error);
      setStatus({
        success: false,
        message: '서버 연결 실패'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 수정 핸들러
  const handleUpdateNotice = async () => {
    if (!editingNotice || !formData.title.trim() || !formData.content.trim()) {
      setStatus({
        success: false,
        message: "제목과 내용을 입력해주세요."
      });
      return;
    }

    try {
      setIsLoading(true);
      const imageUrlsArray = formData.imageUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'updateNotice',
          noticeId: editingNotice.id,
          title: formData.title,
          content: formData.content,
          isPinned: formData.isPinned,
          isPopup: false,
          images: imageUrlsArray
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          success: true,
          message: '공지사항이 성공적으로 수정되었습니다.'
        });
        setShowEditModal(false);
        setEditingNotice(null);
        setFormData({ title: "", content: "", isPinned: false, imageUrls: "" });
        fetchNotices();
        if (selectedNotice && selectedNotice.id === editingNotice.id) {
          setSelectedNotice(null);
        }
      } else {
        setStatus({
          success: false,
          message: result.message || '공지사항 수정 실패'
        });
      }
    } catch (error) {
      console.error('❌ 공지사항 수정 오류:', error);
      setStatus({
        success: false,
        message: '서버 연결 실패'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 삭제 핸들러
  const handleDeleteNotice = async (noticeId: number) => {
    if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'deleteNotice',
          noticeId: noticeId
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          success: true,
          message: '공지사항이 성공적으로 삭제되었습니다.'
        });
        fetchNotices();
        if (selectedNotice && selectedNotice.id === noticeId) {
          setSelectedNotice(null);
        }
      } else {
        setStatus({
          success: false,
          message: result.message || '공지사항 삭제 실패'
        });
      }
    } catch (error) {
      console.error('❌ 공지사항 삭제 오류:', error);
      setStatus({
        success: false,
        message: '서버 연결 실패'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 수정 시작
  const startEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      isPinned: notice.isPinned || false,
      imageUrls: notice.images?.join('\n') || notice.imageUrl || ""
    });
    setShowEditModal(true);
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    if (!dateString) return '날짜 없음';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '날짜 없음';
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return '날짜 없음';
    }
  };

  // 신규 공지사항 확인 (7일 이내)
  const isNewNotice = (dateString: string) => {
    if (!dateString) return false;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return false;
      return (new Date().getTime() - date.getTime()) < 7 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  };

  // 필터링된 공지사항
  const filteredNotices = notices.filter(notice => {
    const search = searchTerm.toLowerCase();
    return (
      notice.title?.toLowerCase().includes(search) ||
      notice.content?.toLowerCase().includes(search)
    );
  });

  // 고정/일반 공지사항 분리
  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);

  // 상세 페이지 보기
  if (selectedNotice) {
    // ✅ 이미지 로딩 중이면 전체 페이지 로딩 표시
    if (isLoadingDetail) {
      return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
          <Loader2 size={64} className="animate-spin text-blue-600 mb-4" />
          <p className="text-xl text-gray-600">공지사항을 불러오는 중...</p>
        </div>
      );
    }

    const noticeDate = new Date(selectedNotice.createdAt);
    const isValidDate = !isNaN(noticeDate.getTime());
    const formattedDate = isValidDate ? noticeDate.toISOString().split('T')[0] : '날짜 없음';
    const formattedTime = isValidDate ? noticeDate.toLocaleString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '날짜 없음';
    const isNew = isValidDate && (new Date().getTime() - noticeDate.getTime()) < 7 * 24 * 60 * 60 * 1000;

    return (
      <div className="w-full bg-background">
        {/* 페이지 헤더 - 미니멀 스타일 */}
        <section className="bg-primary pt-20 md:pt-32 pb-20 md:pb-32 px-4 md:px-6 text-primary-foreground">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setSelectedNotice(null)}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <ArrowLeft size={20} />
              목록으로 돌아가기
            </button>
            <div className="max-w-4xl">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {selectedNotice.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formattedTime}
                </span>
                <span className="flex items-center gap-2">
                  <Eye size={16} />
                  {selectedNotice.views?.toLocaleString() || 0}
                </span>
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {selectedNotice.author || '관리자'}
                </span>
                {isNew && (
                  <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider">
                    NEW
                  </span>
                )}
                {selectedNotice.isPinned && (
                  <span className="flex items-center gap-1">
                    <Pin size={16} />
                    고정됨
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 공지사항 본문 */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          {!contentImagesLoaded ? (
            // ✅ 이미지 로딩 중 - 섹션 로딩 스피너
            <div className="bg-card border border-border p-8 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
              <Loader2 size={48} className="animate-spin text-primary mb-4" />
              <p className="text-lg text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>이미지를 불러오는 중...</p>
            </div>
          ) : (
            // ✅ 이미지 로딩 완료 - 실제 콘텐츠 표시
            <div className="bg-card border border-border p-8 md:p-12 shadow-sm">
                {/* 여러 이미지 갤러리 (images 배열이 있는 경우) */}
                {selectedNotice.images && selectedNotice.images.length > 0 && selectedNotice.images.some(url => url && url.trim()) && (
                  <div className="mb-6">
                    <div className={`grid gap-4 ${selectedNotice.images.length === 1 ? 'grid-cols-1' : selectedNotice.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
                      {selectedNotice.images
                        .filter(url => url && url.trim())
                        .map((imageUrl, index) => {
                          return (
                            <div key={index} className="relative overflow-hidden">
                              <img 
                                src={imageUrl} 
                                alt={`${selectedNotice.title} - 이미지 ${index + 1}`}
                                className="w-full h-auto rounded-lg shadow-md hover:shadow-xl transition-shadow"
                                style={{ minHeight: '200px', objectFit: 'cover' }}
                                onLoad={(e) => {
                                  (e.target as HTMLImageElement).style.minHeight = 'auto';
                                }}
                                onError={(e) => {
                                  const parent = (e.target as HTMLImageElement).parentElement;
                                  if (parent) {
                                    parent.style.display = 'none';
                                  }
                                }}
                              />
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* 단일 이미지 (imageUrl만 있는 경우 - 하위 호환성) */}
                {(!selectedNotice.images || selectedNotice.images.length === 0) && selectedNotice.imageUrl && selectedNotice.imageUrl.trim() && (
                  <div className="mb-6 relative overflow-hidden">
                    <img 
                      src={selectedNotice.imageUrl} 
                      alt={selectedNotice.title}
                      className="w-full max-w-3xl mx-auto rounded-lg shadow-md"
                      style={{ minHeight: '200px', objectFit: 'cover' }}
                      onLoad={(e) => {
                        (e.target as HTMLImageElement).style.minHeight = 'auto';
                      }}
                      onError={(e) => {
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) {
                          parent.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                )}

                <div className="prose max-w-none">
                  {/* HTML 콘텐츠를 직접 렌더링 (리치 텍스트 에디터 지원) */}
                  <div 
                    dangerouslySetInnerHTML={{ __html: selectedNotice.content }}
                    className="ql-editor-content leading-relaxed text-foreground"
                  />
                </div>
                
                {/* Quill 에디터 스타일 추가 - 다크모드 대응 */}
                <style>{`
                  .ql-editor-content {
                    color: inherit;
                  }
                  
                  .ql-editor-content h1,
                  .ql-editor-content h2,
                  .ql-editor-content h3,
                  .ql-editor-content h4,
                  .ql-editor-content h5,
                  .ql-editor-content h6 {
                    font-weight: bold;
                    margin: 0.67em 0;
                    color: inherit;
                  }
                  
                  .ql-editor-content h1 {
                    font-size: 2em;
                  }
                  
                  .ql-editor-content h2 {
                    font-size: 1.5em;
                  }
                  
                  .ql-editor-content h3 {
                    font-size: 1.17em;
                  }
                  
                  .ql-editor-content p {
                    margin-bottom: 1em;
                    color: inherit;
                  }
                  
                  .ql-editor-content ul,
                  .ql-editor-content ol {
                    margin-bottom: 1em;
                    padding-left: 2em;
                    color: inherit;
                  }
                  
                  .ql-editor-content li {
                    color: inherit;
                  }
                  
                  .ql-editor-content img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 10px 0;
                    display: block;
                  }
                  
                  .ql-editor-content a {
                    color: #6cb25b;
                    text-decoration: underline;
                  }
                  
                  .ql-editor-content blockquote {
                    border-left: 4px solid currentColor;
                    opacity: 0.7;
                    padding-left: 16px;
                    margin-left: 0;
                    margin-right: 0;
                    color: inherit;
                  }
                  
                  .ql-editor-content pre {
                    background-color: rgba(0, 0, 0, 0.05);
                    border-radius: 0.375rem;
                    padding: 12px;
                    overflow-x: auto;
                    color: inherit;
                  }
                  
                  @media (prefers-color-scheme: dark) {
                    .ql-editor-content pre {
                      background-color: rgba(255, 255, 255, 0.05);
                    }
                  }
                  
                  .ql-editor-content strong {
                    font-weight: bold;
                    color: inherit;
                  }
                  
                  .ql-editor-content em {
                    font-style: italic;
                    color: inherit;
                  }
                  
                  .ql-editor-content u {
                    text-decoration: underline;
                    color: inherit;
                  }
                  
                  .ql-editor-content span {
                    color: inherit;
                  }
                  
                  .ql-editor-content div {
                    color: inherit;
                  }
                `}</style>
              </div>
            )}

          {/* 목록으로 버튼 */}
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedNotice(null)}
              className="px-8 py-3 bg-primary text-primary-foreground hover:opacity-80 transition-opacity"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              목록으로 돌아가기
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => startEditNotice(selectedNotice)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Edit size={18} />
                  수정
                </button>
                <button
                  onClick={() => handleDeleteNotice(selectedNotice.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Trash2 size={18} />
                  삭제
                </button>
              </>
            )}
          </div>
        </section>

        {/* 다른 공지사항 */}
        <section className="bg-muted/20 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h3 className="font-serif text-2xl md:text-3xl mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
              다른 공지사항
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notices.slice(0, 3).filter(n => n.id !== selectedNotice.id).map((notice) => {
                return (
                  <button
                    key={notice.id}
                    onClick={() => handleNoticeClick(notice.id)}
                    className="bg-card border border-border p-6 text-left hover:bg-muted/50 transition-all group"
                  >
                    <h4 className="font-serif text-lg md:text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {notice.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span>{formatDate(notice.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {notice.views || 0}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // 목록 페이지
  return (
    <div className="w-full">
      {/* ✅ 초기 로딩 화면 - 공지사항 목록 로드 중 */}
      {isLoading && notices.length === 0 ? (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background">
          <Loader2 size={64} className="animate-spin text-primary mb-4" />
          <p className="text-xl text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
            공지사항을 불러오는 중...
          </p>
        </div>
      ) : (
        <>
      {/* 작성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <h2 className="text-2xl font-bold mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>공지사항 작성</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>내용</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  apiUrl={API_URL}
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>이미지 URL (한 줄에 하나씩)</label>
                <textarea
                  value={formData.imageUrls}
                  onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>상단 고정</span>
                </label>
              </div>
            </div>
            
            {status && (
              <div className={`mt-4 p-3 rounded-lg ${status.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                {status.message}
              </div>
            )}
            
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({ title: "", content: "", isPinned: false, imageUrls: "" });
                }}
                className="px-6 py-2 bg-muted rounded-lg hover:bg-muted/80"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                취소
              </button>
              <button
                onClick={handleCreateNotice}
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-80 disabled:opacity-50"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isLoading ? '작성 중...' : '작성'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <h2 className="text-2xl font-bold mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>공지사항 수정</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>내용</label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  apiUrl={API_URL}
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>이미지 URL (한 줄에 하나씩)</label>
                <textarea
                  value={formData.imageUrls}
                  onChange={(e) => setFormData({ ...formData, imageUrls: e.target.value })}
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>상단 고정</span>
                </label>
              </div>
            </div>
            
            {status && (
              <div className={`mt-4 p-3 rounded-lg ${status.success ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`} style={{ fontFamily: "'Inter', sans-serif" }}>
                {status.message}
              </div>
            )}
            
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingNotice(null);
                  setFormData({ title: "", content: "", isPinned: false, imageUrls: "" });
                }}
                className="px-6 py-2 bg-muted rounded-lg hover:bg-muted/80"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                취소
              </button>
              <button
                onClick={handleUpdateNotice}
                disabled={isLoading}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-80 disabled:opacity-50"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {isLoading ? '수정 중...' : '수정'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로딩 상태 - 전체 페이지 */}
      <>
        {!isLoading && (
          <>
            {/* 페이지 헤더 - 미니멀 스타일 */}
            <section className="bg-primary pt-20 md:pt-32 pb-20 md:pb-32 px-4 md:px-6 text-primary-foreground">
              <div className="max-w-7xl mx-auto">
                <div className="text-center">
                  <span className="uppercase tracking-[0.3em] text-[10px] mb-6 md:mb-8 block opacity-70 font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                    ANNOUNCEMENTS
                  </span>
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl mb-6 md:mb-8 leading-[1.05] tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    공지사항
                  </h1>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-light" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    한국자격검정평가진흥협회의 새로운 소식을 확인하세요
                  </p>
                </div>
              </div>
            </section>

            {/* 검색 */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-10 mb-12">
              <div className="bg-card border border-border p-6 shadow-sm">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <input
                    type="text"
                    name="notice-search"
                    id="notice-page-search"
                    autoComplete="off"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  />
                </div>
              </div>
            </section>

            {/* 공지사항 목록 */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-32">
              {/* 에러 상태 */}
              {error && (
                <div className="text-center py-20">
                  <p className="text-red-500 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>{error}</p>
                  <button 
                    onClick={fetchNotices}
                    className="px-6 py-3 bg-primary text-primary-foreground hover:opacity-80"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    다시 시도
                  </button>
                </div>
              )}

              {/* 공지사항 내용 */}
              {!error && filteredNotices.length === 0 && (
                <div className="text-center py-20">
                  <Bell size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.'}
                  </p>
                </div>
              )}
              {!error && filteredNotices.length > 0 && (
                <div className="space-y-6">
                  {/* 고정 공지사항 */}
                  {pinnedNotices.length > 0 && (
                    <div>
                      <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <Pin size={14} />
                        고정 공지사항 ({pinnedNotices.length}개)
                      </h2>
                      <div className="space-y-3">
                        {pinnedNotices.map((notice) => (
                          <button
                            key={notice.id}
                            onClick={() => handleNoticeClick(notice.id)}
                            className="w-full bg-primary/5 border border-primary/20 p-6 hover:bg-primary/10 transition-all text-left group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    고정됨
                                  </span>
                                  {isNewNotice(notice.createdAt) && (
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                                      NEW
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-serif text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  {notice.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {formatDate(notice.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye size={14} />
                                    {notice.views?.toLocaleString() || 0}
                                  </span>
                                  <span>{notice.author || '관리자'}</span>
                                </div>
                              </div>
                              <ChevronRight size={24} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 일반 공지사항 */}
                  {regularNotices.length > 0 && (
                    <div>
                      <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                        <Bell size={14} />
                        전체 공지사항 ({regularNotices.length}개)
                      </h2>
                      <div className="space-y-3">
                        {regularNotices.map((notice) => (
                          <button
                            key={notice.id}
                            onClick={() => handleNoticeClick(notice.id)}
                            className="w-full bg-card border border-border p-6 hover:bg-muted/50 transition-all text-left group"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                {isNewNotice(notice.createdAt) && (
                                  <div className="mb-2">
                                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                                      NEW
                                    </span>
                                  </div>
                                )}
                                <h3 className="font-serif text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                                  {notice.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {formatDate(notice.createdAt)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye size={14} />
                                    {notice.views?.toLocaleString() || 0}
                                  </span>
                                  <span>{notice.author || '관리자'}</span>
                                </div>
                              </div>
                              <ChevronRight size={24} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* 빠른 바로가기 - 미니멀 스타일 */}
            <section className="bg-background py-16 md:py-24">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                  <span className="uppercase tracking-[0.3em] text-[10px] mb-4 block text-muted-foreground font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>
                    QUICK LINKS
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
                    빠른 바로가기
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: '수강 방법 안내', desc: '온라인 강의 수강 절차', page: 'courses' },
                    { title: '자격증 발급 안내', desc: '발급 신청 및 절차', page: 'certificate' },
                    { title: '고객센터 문의', desc: '1:1 문의 및 상담', page: 'support' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigate(item.page)}
                      className="bg-card border border-border p-8 text-left hover:bg-muted/50 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-8 h-px bg-primary/30 mt-2"></div>
                        <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <h4 className="font-serif text-xl md:text-2xl mb-3 group-hover:text-primary transition-colors" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </>
        </>
      )}
    </div>
  );
}
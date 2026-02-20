import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Calendar, Eye, X, Pin, Search, Edit2, Trash2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { BannerDesign } from './BannerDesign';

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
  bannerDesign?: string;
  rowNumber?: number;
}

interface AdminNoticeManagementProps {
  currentUser: { name: string; email: string } | null;
}

export function AdminNoticeManagement({ currentUser }: AdminNoticeManagementProps) {
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isPinned: false,
    isPopup: false,
    bannerDesign: "design1"
  });

  const loadNotices = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setStatus(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        cache: 'no-cache',
        body: JSON.stringify({
          action: 'getNotices',
          timestamp: new Date().getTime()
        })
      });

      const result = await response.json();

      if (result.success) {
        setNotices(result.notices || []);
      } else {
        setStatus({ success: false, message: result.message || '공지사항 조회 실패' });
      }
    } catch (error) {
      setStatus({ success: false, message: '서버 연결 실패' });
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  // ✅ 컴포넌트 마운트 시 백그라운드에서 공지사항 로드 (로딩 화면 없이)
  useEffect(() => {
    loadNotices(false); // 백그라운드 로드 - 로딩 화면 표시 안 함
  }, []);

  const convertBase64ImagesToUrls = async (htmlContent: string): Promise<string> => {
    const imgRegex = /<img[^>]+src=\"data:image\/([^;]+);base64,([^\"]+)\"[^>]*>/g;
    let match;
    const base64Images: { fullTag: string; mimeType: string; base64Data: string }[] = [];

    while ((match = imgRegex.exec(htmlContent)) !== null) {
      base64Images.push({
        fullTag: match[0],
        mimeType: match[1],
        base64Data: match[2]
      });
    }

    if (base64Images.length === 0) return htmlContent;

    let updatedContent = htmlContent;

    for (let i = 0; i < base64Images.length; i++) {
      const { fullTag, mimeType, base64Data } = base64Images[i];

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            action: 'uploadImage',
            fileName: `notice-image-${Date.now()}-${i}.${mimeType}`,
            fileData: base64Data,
            mimeType: `image/${mimeType}`
          })
        });

        const result = await response.json();

        if (result.success && result.imageUrl) {
          const newTag = fullTag.replace(`data:image/${mimeType};base64,${base64Data}`, result.imageUrl);
          updatedContent = updatedContent.replace(fullTag, newTag);
        } else {
          return htmlContent;
        }
      } catch (error) {
        return htmlContent;
      }
    }

    return updatedContent;
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setStatus({ success: false, message: "제목과 내용을 입력해주세요." });
      return;
    }

    if (!currentUser) {
      setStatus({ success: false, message: "로그인 정보를 찾을 수 없습니다." });
      return;
    }

    try {
      setIsLoading(true);
      
      const updatedContent = await convertBase64ImagesToUrls(formData.content);

      const requestBody = editingNotice
        ? {
            action: 'updateNotice',
            noticeId: editingNotice.id,
            rowNumber: editingNotice.rowNumber || editingNotice.id,
            id: editingNotice.id,
            title: formData.title,
            content: updatedContent,
            isPinned: formData.isPinned,
            isPopup: formData.isPopup,
            images: [],
            bannerDesign: formData.isPopup ? (formData.bannerDesign || "design1") : ""
          }
        : {
            action: 'createNotice',
            title: formData.title,
            content: updatedContent,
            author: currentUser.name,
            isPinned: formData.isPinned,
            isPopup: formData.isPopup,
            images: [],
            bannerDesign: formData.isPopup ? (formData.bannerDesign || "design1") : ""
          };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          success: true,
          message: editingNotice ? '공지사항이 수정되었습니다.' : '공지사항이 생성되었습니다.'
        });
        closeModal();
        loadNotices();
      } else {
        setStatus({ success: false, message: result.message || '저장 실패' });
      }
    } catch (error) {
      setStatus({ success: false, message: '서버 연결 실패' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (noticeId: number) => {
    if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) return;

    try {
      setIsLoading(true);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'deleteNotice', noticeId: noticeId })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ success: true, message: '공지사항이 삭제되었습니다.' });
        loadNotices();
      } else {
        setStatus({ success: false, message: result.message || '삭제 실패' });
      }
    } catch (error) {
      setStatus({ success: false, message: '서버 연결 실패' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePin = async (notice: Notice) => {
    try {
      setIsLoading(true);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateNotice',
          noticeId: notice.id,
          title: notice.title,
          content: notice.content,
          isPinned: !notice.isPinned,
          images: notice.images || [],
          bannerDesign: notice.bannerDesign
        })
      });

      const result = await response.json();

      if (result.success) {
        loadNotices();
      } else {
        setStatus({ success: false, message: result.message || '상태 변경 실패' });
      }
    } catch (error) {
      setStatus({ success: false, message: '서버 연결 실패' });
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      isPinned: notice.isPinned,
      isPopup: notice.isPopup,
      bannerDesign: notice.bannerDesign || "design1"
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      content: "",
      isPinned: false,
      isPopup: false,
      bannerDesign: "design1"
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setFormData({
      title: "",
      content: "",
      isPinned: false,
      isPopup: false,
      bannerDesign: "design1"
    });
  };

  const filteredNotices = notices.filter(notice => {
    const search = searchTerm.toLowerCase();
    return (
      notice.title?.toLowerCase().includes(search) ||
      notice.content?.toLowerCase().includes(search)
    );
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);

  return (
    <div className="w-full">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="border border-border p-8 bg-card">
          <div 
            className="text-5xl mb-4 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {notices.length}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            전체 공지사항
          </div>
        </div>

        <div className="border border-border p-8 bg-card">
          <div 
            className="text-5xl mb-4 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {pinnedNotices.length}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            고정 공지사항
          </div>
        </div>

        <div className="border border-border p-8 bg-card">
          <div 
            className="text-5xl mb-4 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {notices.reduce((sum, n) => sum + (n.views || 0), 0)}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            총 조회수
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-12">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          <input
            type="text"
            name="notice-search"
            id="notice-search"
            autoComplete="off"
            placeholder="공지사항 검색..."
            className="w-full pl-12 pr-4 py-4 border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={loadNotices}
            disabled={isLoading}
            className="px-6 py-4 border border-border bg-card text-foreground hover:bg-muted transition-all disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={openCreateModal}
            className="px-8 py-4 bg-primary text-primary-foreground hover:opacity-90 transition-all"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            <Plus size={20} className="inline mr-2" />
            새 공지사항
          </button>
        </div>
      </div>

      {/* Status Message */}
      {status && (
        <div
          className={`mb-8 p-4 border ${
            status.success
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-destructive bg-destructive/5 text-destructive'
          }`}
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
        >
          {status.message}
        </div>
      )}

      {/* Notices List */}
      {filteredNotices.length === 0 ? (
        <div className="border border-border p-16 text-center bg-card">
          <p 
            className="text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Pinned Notices */}
          {pinnedNotices.length > 0 && (
            <div>
              <h3 
                className="text-2xl mb-8 flex items-center gap-3 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                <Pin className="text-primary" size={20} />
                고정 공지사항
              </h3>
              <div className="space-y-4">
                {pinnedNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="border-2 border-primary bg-card p-8"
                  >
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h4 
                            className="text-xl text-foreground"
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                          >
                            {notice.title}
                          </h4>
                          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs">
                            고정
                          </span>
                          {notice.isPopup && (
                            <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs">
                              팝업
                            </span>
                          )}
                        </div>
                        <div 
                          className="text-sm text-muted-foreground mb-4 line-clamp-2"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                          dangerouslySetInnerHTML={{ __html: notice.content.replace(/<[^>]*>/g, '').substring(0, 150) }}
                        />
                        <div 
                          className="flex items-center gap-4 text-xs text-muted-foreground"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(notice.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {notice.views || 0}
                          </span>
                          <span>{notice.author || '관리자'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTogglePin(notice)}
                          className="p-3 border border-border hover:bg-muted transition-all"
                          title="고정 해제"
                        >
                          <Pin size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(notice)}
                          className="p-3 border border-border hover:bg-muted transition-all"
                          title="수정"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-3 border border-border hover:bg-muted transition-all"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Notices */}
          {regularNotices.length > 0 && (
            <div>
              <h3 
                className="text-2xl mb-8 text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                전체 공지사항
              </h3>
              <div className="border border-border bg-card divide-y divide-border">
                {regularNotices.map((notice) => (
                  <div key={notice.id} className="p-8 hover:bg-muted/30 transition-all">
                    <div className="flex items-start justify-between gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h4 
                            className="text-lg text-foreground"
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                          >
                            {notice.title}
                          </h4>
                          {notice.isPopup && (
                            <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs">
                              팝업
                            </span>
                          )}
                        </div>
                        <div 
                          className="text-sm text-muted-foreground mb-4 line-clamp-2"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                          dangerouslySetInnerHTML={{ __html: notice.content.replace(/<[^>]*>/g, '').substring(0, 150) }}
                        />
                        <div 
                          className="flex items-center gap-4 text-xs text-muted-foreground"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {formatDate(notice.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {notice.views || 0}
                          </span>
                          <span>{notice.author || '관리자'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTogglePin(notice)}
                          className="p-3 border border-border hover:bg-muted transition-all"
                          title="고정하기"
                        >
                          <Pin size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(notice)}
                          className="p-3 border border-border hover:bg-muted transition-all"
                          title="수정"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(notice.id)}
                          className="p-3 border border-border hover:bg-muted transition-all"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-card w-full max-w-4xl max-h-[90vh] flex flex-col border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-8 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 
                  className="text-3xl text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {editingNotice ? '공지사항 수정' : '새 공지사항'}
                </h2>
                <button 
                  onClick={closeModal}
                  className="p-2 hover:bg-muted transition-all"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Title */}
              <div>
                <label 
                  className="block text-sm mb-3 text-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="공지사항 제목을 입력하세요"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, color: '#000000' }}
                />
              </div>

              {/* Content */}
              <div>
                <label 
                  className="block text-sm mb-3 text-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  내용
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  apiUrl={API_URL}
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPinned"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="w-5 h-5 cursor-pointer border-2 border-border rounded checked:bg-primary checked:border-primary"
                  />
                  <label 
                    htmlFor="isPinned"
                    className="text-sm text-foreground cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    공지사항 상단에 고정
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPopup"
                    checked={formData.isPopup}
                    onChange={(e) => setFormData({ ...formData, isPopup: e.target.checked })}
                    className="w-5 h-5 cursor-pointer border-2 border-border rounded checked:bg-primary checked:border-primary"
                  />
                  <label 
                    htmlFor="isPopup"
                    className="text-sm text-foreground cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    팝업으로 표시
                  </label>
                </div>
              </div>

              {/* Banner Design (only if popup) */}
              {formData.isPopup && (
                <div className="border border-border p-6 bg-background">
                  <label 
                    className="block text-sm mb-4 text-foreground"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    팝업 배너 디자인 선택
                  </label>
                  
                  {/* 디자인 선택 버튼 (작은 썸네일 포함) */}
                  <div className="grid grid-cols-5 gap-3 mb-6">
                    {['design1', 'design2', 'design3', 'design4', 'design5'].map((design) => (
                      <div
                        key={design}
                        onClick={() => setFormData({ ...formData, bannerDesign: design })}
                        className={`p-3 border-2 transition-all cursor-pointer ${
                          formData.bannerDesign === design
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        {/* 작은 썸네일 미리보기 */}
                        <div className="w-full aspect-[3/1] mb-2 overflow-hidden pointer-events-none">
                          <BannerDesign 
                            design={design} 
                            title="" 
                            onClose={() => {}} 
                            onClick={() => {}}
                          />
                        </div>
                        <div 
                          className="text-xs text-center text-primary"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                          {design === 'design1' && '디자인 1'}
                          {design === 'design2' && '디자인 2'}
                          {design === 'design3' && '디자인 3'}
                          {design === 'design4' && '디자인 4'}
                          {design === 'design5' && '디자인 5'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* 큰 미리보기 */}
                  <div>
                    <label 
                      className="block text-sm mb-3 text-foreground"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      선택된 디자인 미리보기
                    </label>
                    <div className="border-2 border-primary bg-card p-1">
                      <div className="w-full aspect-[5/1] overflow-hidden">
                        <BannerDesign 
                          design={formData.bannerDesign} 
                          title={formData.title || "공지사항 제목 미리보기"} 
                          onClose={() => {}} 
                          onClick={() => {}}
                        />
                      </div>
                    </div>
                    <p 
                      className="text-xs text-muted-foreground mt-2"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      실제 팝업은 화면 상단에 표시되며, 사용자가 닫기 버튼을 클릭할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-8 border-t border-border flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-8 py-3 border border-border bg-card text-foreground hover:bg-muted transition-all"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-8 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                {isLoading ? '처리 중...' : (editingNotice ? '수정' : '작성')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
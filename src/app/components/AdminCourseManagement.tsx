import { useState, useEffect } from 'react';
import { Video, Plus, Edit, Trash2, Upload, Loader2, CheckCircle, XCircle, FolderOpen, FileVideo, X, Play, Eye } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { SecurityUtils } from '@/utils/security';
import { UploadProgress } from '@/app/components/UploadProgress';

interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  categoryKey: string;
}

interface VideoItem {
  rowNumber: number;
  number: number;
  uploadDate: string;
  title: string;
  description: string;
  fileName: string;
  category: string;
  fileUrl: string;
  fileId: string;
  thumbnailUrl: string;
  embedUrl: string;
  fileSize: number;
  duration: string;
  viewCount: number;
  status: string;
}

export function AdminCourseManagement() {
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  
  const [courses] = useState<Course[]>([
    { id: 1, title: '축제기획사', category: '기획', description: '축제 기획 전문가 양성 과정', categoryKey: 'festival' },
    { id: 2, title: '이벤트기획사', category: '기획', description: '이벤트 기획 전문가 양성 과정', categoryKey: 'event' },
    { id: 3, title: '공연기획사', category: '기획', description: '공연 기획 전문가 양성 과정', categoryKey: 'performance' }
  ]);
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [allVideos, setAllVideos] = useState<{ [key: string]: VideoItem[] }>({}); // 모든 강의의 영상 저장
  const [isLoading, setIsLoading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'drive'>('file');
  const [driveLink, setDriveLink] = useState('');
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: ""
  });
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [viewingVideo, setViewingVideo] = useState<VideoItem | null>(null);

  // 컴포넌트 마운트 시 모든 강의의 영상 개수 로드
  useEffect(() => {
    loadAllVideos();
  }, []);

  // ✅ 페이지 로드 시 첫 번째 강의를 자동 선택
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [courses]);

  // 모든 강의의 영상을 한번에 로드
  const loadAllVideos = async () => {
    try {
      setIsLoading(true);
      const allVideosData: { [key: string]: VideoItem[] } = {};
      
      // 모든 카테고리에 대해 동시에 요청
      const promises = courses.map(async (course) => {
        try {
          const response = await fetch(`${API_URL}?action=getVideosByCategory&category=${course.categoryKey}&timestamp=${Date.now()}`, {
            method: 'GET',
            redirect: 'follow'
          });
          
          const result = await response.json();
          
          let videoList = [];
          if (Array.isArray(result)) {
            videoList = result;
          } else if (result && result.videos && Array.isArray(result.videos)) {
            videoList = result.videos;
          } else if (result && result.success && result.data && Array.isArray(result.data)) {
            videoList = result.data;
          }
          
          allVideosData[course.categoryKey] = videoList;
        } catch (error) {
          console.error(`❌ ${course.title} 영상 로딩 오류:`, error);
          allVideosData[course.categoryKey] = [];
        }
      });
      
      await Promise.all(promises);
      setAllVideos(allVideosData);
      console.log('✅ 모든 강의 영상 로드 완료:', allVideosData);
    } catch (error) {
      console.error('❌ 전체 영상 로딩 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse && allVideos[selectedCourse.categoryKey]) {
      // 이미 로드된 데이터가 있으면 바로 사용
      setVideos(allVideos[selectedCourse.categoryKey]);
      console.log(`✅ ${selectedCourse.title} 영상 즉시 로드 (${allVideos[selectedCourse.categoryKey].length}개)`);
    }
  }, [selectedCourse, allVideos]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 🛡️ 1. 파일 크기 검증 (100MB)
      if (!SecurityUtils.validateFileSize(file, 100)) {
        setStatus({
          success: false,
          message: "파일 크기는 100MB 이하여야 합니다. 큰 파일은 직접 Google Drive에 업로드한 후 링크를 공유해주세요."
        });
        e.target.value = '';
        return;
      }

      // 🛡️ 2. 종합 파일 보안 검증
      const validation = await SecurityUtils.validateFileUpload(file, 'video', 100);
      if (!validation.valid) {
        SecurityUtils.logSecurityEvent('error', 'File Upload Attack 차단', {
          fileName: file.name,
          size: file.size,
          type: file.type,
          error: validation.error
        });
        
        setStatus({
          success: false,
          message: validation.error || "파일 검증에 실패했습니다."
        });
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
      setStatus(null);
      SecurityUtils.logSecurityEvent('info', '파일 업로드 검증 통과', { fileName: file.name });

      // 영상 길이 자동 추출
      const videoUrl = URL.createObjectURL(file);
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      
      videoElement.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoUrl);
        const durationInMinutes = Math.ceil(videoElement.duration / 60);
        console.log('📹 영상 길이 자동 감지:', durationInMinutes, '분');
        setFormData(prev => ({ ...prev, duration: durationInMinutes.toString() }));
      };
      
      videoElement.onerror = () => {
        window.URL.revokeObjectURL(videoUrl);
        console.error('❌ 영상 메타데이터 로드 실패');
        setStatus({
          success: false,
          message: "영상 파일의 메타데이터를 읽을 수 없습니다."
        });
      };
      
      videoElement.src = videoUrl;
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // data:video/mp4;base64, 부분 제거
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Google Drive 링크에서 파일 ID 추출
  const extractDriveFileId = (link: string): string | null => {
    // https://drive.google.com/file/d/FILE_ID/view
    // https://drive.google.com/open?id=FILE_ID
    // https://drive.google.com/uc?id=FILE_ID
    
    let fileId = null;
    
    // /file/d/FILE_ID 패턴
    const match1 = link.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) {
      fileId = match1[1];
    }
    
    // ?id=FILE_ID 패턴
    const match2 = link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2) {
      fileId = match2[1];
    }
    
    // FILE_ID만 입력한 경우
    if (!fileId && link.match(/^[a-zA-Z0-9_-]{25,}$/)) {
      fileId = link;
    }
    
    return fileId;
  };

  const handleAddFromDrive = async () => {
    if (!selectedCourse || !formData.title.trim() || !driveLink.trim()) {
      setStatus({
        success: false,
        message: "강의, 제목, Google Drive 링크를 모두 입력해주세요."
      });
      return;
    }

    // 재생 시간 확인
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setStatus({
        success: false,
        message: "재생 시간(분)을 입력해주세요."
      });
      return;
    }

    // 파일 ID 추출
    const fileId = extractDriveFileId(driveLink);
    if (!fileId) {
      setStatus({
        success: false,
        message: "유효한 Google Drive 링크를 입력해주세요."
      });
      return;
    }

    try {
      setIsLoading(true);
      setStatus({
        success: true,
        message: "Google Drive 영상을 등록 중입니다..."
      });

      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'addVideoFromDrive',
          category: selectedCourse.categoryKey,
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          fileId: fileId
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          success: true,
          message: '영상이 성공적으로 등록되었습니다!'
        });
        
        setTimeout(() => {
          setShowVideoModal(false);
          setDriveLink('');
          setFormData({ title: "", description: "", duration: "" });
          setStatus(null);
          loadAllVideos(); // 전체 영상 개수 다시 로드
        }, 1500);
      } else {
        throw new Error(result.message || '등록 실패');
      }
    } catch (error) {
      console.error('Add from Drive error:', error);
      setStatus({
        success: false,
        message: error instanceof Error ? error.message : '등록 중 오류가 발생했습니다.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadVideo = async () => {
    if (!selectedCourse || !selectedFile || !formData.title.trim()) {
      setStatus({
        success: false,
        message: "강의, 파일, 제목을 모두 입력해주세요."
      });
      return;
    }

    // 재생 시간 확인
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setStatus({
        success: false,
        message: "재생 시간(분)을 입력해주세요."
      });
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10);
      setStatus({
        success: true,
        message: "파일을 변환 중입니다... (파일 크기에 따라 시간이 걸릴 수 있습니다)"
      });

      // Base64 변환
      const base64Data = await convertFileToBase64(selectedFile);
      setUploadProgress(30);
      
      const fileSizeMB = (selectedFile.size / 1024 / 1024).toFixed(2);
      setStatus({
        success: true,
        message: `Google Drive에 업로드 중입니다... (${fileSizeMB}MB) 이 작업은 최대 3분 정도 소요될 수 있습니다.`
      });

      // 타임아웃 설정 (3분)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000);

      try {
        // Google Apps Script로 업로드
        const response = await fetch(API_URL, {
          method: 'POST',
          redirect: 'follow',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify({
            action: 'uploadVideo',
            category: selectedCourse.categoryKey,
            title: formData.title,
            description: formData.description,
            fileName: selectedFile.name,
            mimeType: selectedFile.type,
            fileSize: selectedFile.size,
            duration: formData.duration,
            base64Data: base64Data
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        setUploadProgress(90);

        const result = await response.json();

        if (result.success) {
          setUploadProgress(100);
          setStatus({
            success: true,
            message: '영상이 성공적으로 업로드되었습니다!'
          });
          
          setTimeout(() => {
            setShowVideoModal(false);
            setSelectedFile(null);
            setFormData({ title: "", description: "", duration: "" });
            setUploadProgress(0);
            setStatus(null);
            loadAllVideos(); // 전체 영상 개수 다시 로드
          }, 1500);
        } else {
          throw new Error(result.message || '업로드 실패');
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('업로드 시간이 초과되었습니다. 파일 크기가 너무 크거나 네트워크가 불안정합니다. 더 작은 파일을 사용해주세요.');
        }
        throw fetchError;
      }
    } catch (error) {
      console.error('Upload error:', error);
      setStatus({
        success: false,
        message: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다. 파일 크기를 확인하거나 나중에 다시 시도해주세요.'
      });
      setUploadProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (video: VideoItem) => {
    if (!confirm(`"${video.title}" 영상을 삭제하시겠습니까?\nGoogle Drive에서도 삭제됩니다.`)) {
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
          action: 'deleteVideo',
          fileId: video.fileId,
          rowNumber: video.rowNumber,
          category: video.category
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          success: true,
          message: '영상이 성공적으로 삭제되었습니다.'
        });
        loadAllVideos(); // 전체 영상 개수 다시 로드
      } else {
        setStatus({
          success: false,
          message: result.message || '영상 삭제 실패'
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: '서버 연결 실패'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditVideo = (video: VideoItem) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      duration: video.duration
    });
    setShowVideoModal(true);
  };

  return (
    <div className="w-full px-8 md:px-16 lg:px-24 py-12">
      {/* 업로드 진행률 오버레이 */}
      {isLoading && uploadProgress > 0 && (
        <UploadProgress progress={uploadProgress} message="영상 업로드 중..." />
      )}
      
      <div className="max-w-[1500px] mx-auto">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 
            className="text-5xl md:text-6xl mb-4 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            강의 영상 관리
          </h1>
          <p 
            className="text-lg text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            강의별 영상을 업로드하고 관리하세요
          </p>
        </div>

        {/* 상태 메시지 */}
        {status && (
          <div 
            className={`mb-8 p-6 border ${status.success ? 'bg-primary/5 text-primary border-primary/20' : 'bg-red-50 text-red-700 border-red-200'}`}
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            {status.message}
          </div>
        )}

        {/* 강의 선택 */}
        <div className="mb-12">
          <h2 
            className="text-3xl mb-8 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            강의 선택
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`p-8 border text-left transition-all ${
                  selectedCourse?.id === course.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <FolderOpen 
                    className={selectedCourse?.id === course.id ? 'text-primary' : 'text-muted-foreground'} 
                    size={28}
                  />
                  <h3 
                    className="text-2xl text-foreground"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                  >
                    {course.title}
                  </h3>
                </div>
                <p 
                  className="text-sm text-muted-foreground mb-4"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {course.description}
                </p>
                <p 
                  className="text-xs text-muted-foreground"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {allVideos[course.categoryKey]?.length || 0}개의 영상
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 영상 목록 */}
        {selectedCourse && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 
                className="text-4xl text-foreground"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                {selectedCourse.title} 영상 목록
              </h2>
              <button
                onClick={() => {
                  setEditingVideo(null);
                  setFormData({ title: "", description: "", duration: "" });
                  setShowVideoModal(true);
                }}
                className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                <Plus size={20} />
                영상 추가
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-32 bg-card border border-border">
                <Video size={64} className="mx-auto mb-6 text-muted-foreground" />
                <p 
                  className="text-xl text-muted-foreground mb-8"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  등록된 영상이 없습니다
                </p>
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setFormData({ title: "", description: "", duration: "" });
                    setShowVideoModal(true);
                  }}
                  className="px-8 py-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  첫 영상 추가하기
                </button>
              </div>
            ) : (
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th 
                        className="px-6 py-4 text-left text-sm text-foreground"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        순서
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm text-foreground"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        제목
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm text-foreground"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        설명
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm text-foreground"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        시간(분)
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-sm text-foreground"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        영상 URL
                      </th>
                      <th 
                        className="px-6 py-4 text-center text-sm text-foreground"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.sort((a, b) => a.number - b.number).map((video) => (
                      <tr key={video.fileId} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td 
                          className="px-6 py-4 text-sm text-foreground"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                          {video.number}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm text-foreground"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                        >
                          {video.title}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                          {video.description || '-'}
                        </td>
                        <td 
                          className="px-6 py-4 text-sm text-foreground"
                          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                        >
                          {video.duration}분
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            href={video.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline max-w-[200px] truncate block"
                            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                          >
                            링크
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setViewingVideo(video)}
                              className="p-2 text-primary hover:bg-primary/10 transition-colors"
                              title="미리보기"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => startEditVideo(video)}
                              className="p-2 text-primary hover:bg-primary/10 transition-colors"
                              title="수정"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video)}
                              className="p-2 text-red-600 hover:bg-red-50 transition-colors"
                              title="삭제"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 영상 추가/수정 모달 */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground">
                {editingVideo ? '영상 수정' : '영상 추가'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">제목 *</label>
                  <input
                    type="text"
                    name="video-title"
                    id="video-title"
                    autoComplete="off"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="예: 축제 기획 개론"
                    className="w-full px-4 py-2 border border-border bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-foreground">설명</label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) => setFormData({ ...formData, description: value })}
                    apiUrl={API_URL}
                    placeholder="영상에 대한 설명을 입력하세요"
                  />
                </div>

                {/* 재생 시간 표시 (파일 업로드 시 자동 감지) */}
                {uploadMethod === 'file' && formData.duration && (
                  <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm text-primary">
                      📹 <strong>영상 길이:</strong> {formData.duration}분 (자동 감지됨)
                    </p>
                  </div>
                )}

                {/* Google Drive 링크 사용 시 재생 시간 수동 입력 */}
                {uploadMethod === 'drive' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-foreground">Google Drive 링크</label>
                      <input
                        type="text"
                        name="google-drive-link"
                        id="google-drive-link"
                        autoComplete="off"
                        value={driveLink}
                        onChange={(e) => setDriveLink(e.target.value)}
                        placeholder="https://drive.google.com/file/d/FILE_ID/view"
                        className="w-full px-4 py-2 border border-border bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400"
                      />
                      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <p className="text-xs text-blue-800 dark:text-blue-200 mb-2">
                          <strong>⚠️ 중요: 반드시 아래 설정을 확인하세요!</strong>
                        </p>
                        <ol className="text-xs text-blue-700 dark:text-blue-300 space-y-1 ml-4 list-decimal">
                          <li>Google Drive에서 영상 파일 우클릭 → <strong>공유</strong> 클릭</li>
                          <li><strong>"링크가 있는 모든 사용자"</strong>로 변경</li>
                          <li><strong>"뷰어" 권한</strong>으로 설정</li>
                          <li>링크 복사 후 여기에 붙여넣기</li>
                        </ol>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                          💡 공개 공유하지 않으면 영상이 재생되지 않습니다!
                        </p>
                      </div>
                      {driveLink && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                          ✅ 링크가 입력되었습니다
                        </p>
                      )}
                    </div>

                    {/* 재생 시간 입력 필드 추가 */}
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-foreground">재생 시간(분) *</label>
                      <input
                        type="number"
                        name="video-duration"
                        id="video-duration"
                        autoComplete="off"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="예: 45"
                        min="1"
                        className="w-full px-4 py-2 border border-border bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-gray-400"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 영상의 총 재생 시간을 분 단위로 입력하세요
                      </p>
                    </div>
                  </>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-2 text-foreground">업로드 방법 선택</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setUploadMethod('file')}
                      className={`px-4 py-2 border border-border rounded-lg transition-colors ${
                        uploadMethod === 'file' ? 'bg-blue-600 text-white' : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      파일 업로드
                    </button>
                    <button
                      onClick={() => setUploadMethod('drive')}
                      className={`px-4 py-2 border border-border rounded-lg transition-colors ${
                        uploadMethod === 'drive' ? 'bg-blue-600 text-white' : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      Google Drive 링크
                    </button>
                  </div>
                </div>

                {uploadMethod === 'file' && (
                  <div>
                    <div className="mb-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-xs text-yellow-800 dark:text-yellow-200">
                        ⚠️ <strong>중요:</strong> 파일 크기는 100MB 이하로 제한됩니다. 
                        큰 파일은 직접 Google Drive에 업로드한 후 링크를 공유해주세요.
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="w-full px-4 py-2 border border-border bg-input-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary/90"
                    />
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowVideoModal(false);
                    setEditingVideo(null);
                    setFormData({ title: "", description: "", duration: "" });
                    setSelectedFile(null);
                    setDriveLink('');
                  }}
                  className="px-6 py-2 bg-muted text-foreground border border-border rounded-lg hover:bg-muted/80 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={editingVideo ? handleUploadVideo : uploadMethod === 'file' ? handleUploadVideo : handleAddFromDrive}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? '처리 중...' : editingVideo ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 영상 미리보기 모달 */}
        {viewingVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 
                  className="text-2xl font-bold text-foreground"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                >
                  {viewingVideo.title}
                </h2>
                <button
                  onClick={() => setViewingVideo(null)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors text-foreground"
                >
                  <X size={24} />
                </button>
              </div>

              {/* 영상 플레이어 */}
              <div className="mb-6">
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={`https://drive.google.com/file/d/${viewingVideo.fileId}/preview`}
                    className="w-full h-full"
                    allow="autoplay"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* 영상 정보 */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p 
                      className="text-sm text-muted-foreground mb-1"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      카테고리
                    </p>
                    <p 
                      className="font-semibold text-foreground"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      {viewingVideo.category}
                    </p>
                  </div>
                  <div>
                    <p 
                      className="text-sm text-muted-foreground mb-1"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      재생 시간
                    </p>
                    <p 
                      className="font-semibold text-foreground"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      {viewingVideo.duration}분
                    </p>
                  </div>
                  <div>
                    <p 
                      className="text-sm text-muted-foreground mb-1"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      업로드일
                    </p>
                    <p 
                      className="font-semibold text-foreground"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      {viewingVideo.uploadDate}
                    </p>
                  </div>
                  <div>
                    <p 
                      className="text-sm text-muted-foreground mb-1"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      파일명
                    </p>
                    <p 
                      className="font-semibold text-sm truncate text-foreground"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      {viewingVideo.fileName}
                    </p>
                  </div>
                </div>

                {viewingVideo.description && (
                  <div>
                    <p 
                      className="text-sm text-muted-foreground mb-2"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                    >
                      설명
                    </p>
                    <div 
                      className="prose prose-sm max-w-none text-foreground bg-muted/30 p-4 rounded-lg border border-border"
                      dangerouslySetInnerHTML={{ __html: viewingVideo.description }}
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                  </div>
                )}

                {/* 링크들 */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <a
                    href={viewingVideo.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    Google Drive에서 열기
                  </a>
                  <button
                    onClick={() => {
                      setViewingVideo(null);
                      startEditVideo(viewingVideo);
                    }}
                    className="px-4 py-2 bg-muted text-foreground border border-border rounded-lg hover:bg-muted/80 transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 400 }}
                  >
                    수정
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Play, Clock, CheckCircle, Award, TrendingUp, Target, Calendar, Video, Loader2, AlertCircle, ChevronLeft, ChevronRight, Lock, FileText } from 'lucide-react';
import LoadingScreen from '@/app/components/LoadingScreen';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EnrolledCourse {
  id: number;
  courseId: number;
  userId: string;
  title: string;
  category: string;
  categoryKey: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  enrolledAt: string;
  image: string;
}

interface CourseVideo {
  id: number;
  courseId: number;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
  completed?: boolean;
}

interface UserProgress {
  userId: string;
  videoId: number;
  courseId: number;
  completedAt: string;
}

interface MyClassroomProps {
  userEmail: string;
  isMobile?: boolean; // ✅ 모바일 여부 추가
  onNavigate?: (page: string, category?: string) => void; // ✅ 시험 응시용
}

export function MyClassroom({ userEmail, isMobile = false, onNavigate }: MyClassroomProps) {
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [courseVideos, setCourseVideos] = useState<CourseVideo[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoStartTime, setVideoStartTime] = useState<number | null>(null);
  const [watchedSeconds, setWatchedSeconds] = useState(0); // ✅ 시청한 초 단위 시간
  const [isCompleting, setIsCompleting] = useState(false); // ✅ 완료 처리 로딩 상태
  const [screenWidth, setScreenWidth] = useState(window.innerWidth); // ✅ 화면 너비 상태 추가

  useEffect(() => {
    // props에서 받은 userEmail 사용
    if (userEmail) {
      setCurrentUser({ email: userEmail, name: userEmail.split('@')[0] });
      loadEnrolledCourses(userEmail);
    } else {
      setIsLoading(false);
    }
    // ✅ 컴포넌트 마운트 시 스크롤을 최상단으로 이동
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [userEmail]);

  // ✅ selectedCourse가 변경될 때마다 스크롤을 최상단으로 이동
  useEffect(() => {
    if (selectedCourse !== null) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [selectedCourse]);

  // ✅ courseVideos가 로드될 때 스크롤을 최상단으로 이동
  useEffect(() => {
    if (courseVideos.length > 0) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [courseVideos]);

  // 플로팅 버튼에서 영상 자동 재생 이벤트 리스너
  useEffect(() => {
    const handleOpenVideoEvent = async (event: any) => {
      const { courseId, videoId } = event.detail;
      console.log('🎬 플로팅 버튼에서 영상 열기 요청:', courseId, videoId);
      
      // 강의 상세 페이지로 이동
      await handleViewCourse(courseId);
      
      // 약간의 지연 후 특정 영상 열기
      setTimeout(() => {
        const video = courseVideos.find(v => v.id === videoId);
        if (video) {
          handleOpenVideo(video);
        }
      }, 500);
    };

    window.addEventListener('openVideo', handleOpenVideoEvent);
    return () => window.removeEventListener('openVideo', handleOpenVideoEvent);
  }, [courseVideos]);

  const loadEnrolledCourses = async (userEmail: string) => {
    try {
      setIsLoading(true);
      console.log('═══════════════════════════════════════');
      console.log('🔍 수강 강의 로딩 시작');
      console.log('═══════════════════════════════════════');
      console.log('📧 사용자 이메일:', userEmail);
      
      const requestBody = {
        action: 'getEnrolledCourses',
        userEmail: userEmail, // ✅ 파라미터로 받은 userEmail 사용
        timestamp: Date.now()
      };
      
      console.log('📤 요청 데이터:', requestBody);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 API 응답 상태:', response.status, response.statusText);
      
      const responseText = await response.text();
      console.log('📦 응답 원본 텍스트:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('✅ JSON 파싱 성공');
        console.log('📦 파싱된 데이터:', result);
      } catch (parseError) {
        console.error('❌ JSON 파싱 실패:', parseError);
        console.log('원본 응답:', responseText.substring(0, 500));
        throw new Error('서버 응답을 파싱할 수 없습니다.');
      }

      if (result.success) {
        const courses = result.courses || [];
        console.log('✅ 해금된 강의 개수:', courses.length);
        
        if (courses.length > 0) {
          console.log('📋 강의 상세 정보:');
          courses.forEach((course: any, index: number) => {
            console.log(`  ${index + 1}. ${course.title}`);
            console.log(`     - courseId: ${course.courseId}`);
            console.log(`     - 총 영상: ${course.totalLessons}개`);
            console.log(`     - 완료: ${course.completedLessons}개`);
            console.log(`     - 진도율: ${course.progress}%`);
          });
        } else {
          console.warn('⚠️ 강의 배열이 비어있습니다.');
        }
        
        setEnrolledCourses(courses);
        console.log('💾 enrolledCourses 상태 업데이트 완료');
        console.log('═══════════════════════════════════════');
      } else {
        console.error('❌ API 응답 실패');
        console.log('에러 메시지:', result.message);
        console.log('═══════════════════════════════════════');
      }
    } catch (error) {
      console.error('═══════════════════════════════════════');
      console.error('❌ 수강 강의 로드 오류');
      console.error('오류 내용:', error);
      console.error('═══════════════════════════════════════');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseVideos = async (courseId: number) => {
    try {
      setIsLoadingVideos(true);
      console.log('🎬 영상 로딩 시작, courseId:', courseId);
      
      // courseId를 category로 변환
      const categoryMap: { [key: number]: string } = {
        1: 'festival',
        2: 'event',
        3: 'performance'
      };
      
      const categoryKey = categoryMap[courseId] || 'festival';
      console.log('📂 카테고리:', categoryKey);
      
      // ✅ categoryKey를 직접 사용 (한글 이름 변환 제거)
      const videoUrl = `${API_URL}?action=getVideosByCategory&category=${categoryKey}&timestamp=${Date.now()}`;
      console.log('📡 영상 API 요청 URL:', videoUrl);
      
      const response = await fetch(videoUrl, {
        method: 'GET',
        redirect: 'follow'
      }).catch(err => {
        console.error('❌ 네트워크 오류 (영상 API):', err);
        throw new Error(`네트워크 연결 실패: ${err.message}`);
      });

      if (!response) {
        throw new Error('응답을 받을 수 없습니다.');
      }

      console.log('📡 응답 상태:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP 오류: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📦 받은 데이터:', result);

      // ✅ 사용자 진도 조회
      const progressUrl = `${API_URL}?action=getUserProgress&userEmail=${encodeURIComponent(userEmail)}&courseId=${courseId}&timestamp=${Date.now()}`;
      console.log('📡 진도 API 요청 URL:', progressUrl);
      
      const progressResponse = await fetch(progressUrl, {
        method: 'GET',
        redirect: 'follow'
      }).catch(err => {
        console.error('❌ 네트워크 오류 (진도 API):', err);
        throw new Error(`네트워크 연결 실패: ${err.message}`);
      });
      
      if (!progressResponse) {
        throw new Error('진도 응답을 받을 수 없습니다.');
      }

      if (!progressResponse.ok) {
        throw new Error(`HTTP 오류 (진도): ${progressResponse.status} ${progressResponse.statusText}`);
      }
      
      const progressResult = await progressResponse.json();
      console.log('📊 진도 데이터:', progressResult);
      
      const completedVideoIds = progressResult.success && progressResult.completedVideos 
        ? progressResult.completedVideos 
        : [];

      console.log('✅ 완료된 영상 ID 목록:', completedVideoIds);
      console.log('✅ completedVideoIds 타입:', completedVideoIds.map((id: any) => ({ id, type: typeof id })));
      
      // 배열 또는 {success: true, videos: [...]} 형태 모두 처리
      let videos = [];
      if (Array.isArray(result)) {
        videos = result;
      } else if (result && result.videos && Array.isArray(result.videos)) {
        videos = result.videos;
      } else if (result && result.success && result.data && Array.isArray(result.data)) {
        videos = result.data;
      }

      console.log('✅ 영상 개수:', videos.length);
      console.log('🎥 영상 목록:', videos);

      // 영상 데이터를 CourseVideo 형식으로 변환
      const videosWithProgress = videos.map((video: any) => {
        // ✅ [Fix] ID 매핑 로직 개선: video.number(순서)를 최우선으로 사용
        // 'number' 필드가 0일 수 있으므로 null/undefined 체크 사용
        let videoId: number;
        
        // Backend의 '순서' 컬럼(video.number)을 ID로 사용해야 함
        if (video.number !== undefined && video.number !== null && video.number !== '') {
          videoId = Number(video.number);
        } else if (video.id !== undefined && video.id !== null) {
           // video.id가 있는 경우 차선책
          videoId = Number(video.id);
        } else {
           // 최후의 수단으로 행 번호 사용 (권장하지 않음)
          videoId = Number(video.rowNumber);
        }
        
        const isCompleted = completedVideoIds.some(id => Number(id) === videoId);
        
        console.log(`🎬 영상 "${video.title}" - ID: ${videoId}, 완료 여부: ${isCompleted}, 원본 데이터:`, {
          'video.id': video.id,
          'video.number': video.number,
          'video.rowNumber': video.rowNumber,
          '최종 videoId': videoId,
          'completedVideoIds에 포함?': isCompleted
        });
        
        return {
          id: videoId,
          courseId: courseId,
          title: video.title,
          description: video.description,
          videoUrl: video.embedUrl || video.fileUrl,
          duration: parseInt(video.duration) || 0,
          order: video.number || video.rowNumber,
          // completedVideoIds는 숫자일 수도 있고 문자열일 수도 있음
          completed: isCompleted
        };
      });
      
      console.log('🔄 변환된 영상 데이터:', videosWithProgress);
      setCourseVideos(videosWithProgress);
      console.log('💾 courseVideos 상태 업데이트 완료');
    } catch (error) {
      console.error('❌ 영상 로드 오류:', error);
      console.error('❌ 오류 상세:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      setCourseVideos([]);
      // ✅ 사용자에게 친화적인 오류 메시지 표시 (선택사항)
      alert('영상을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      console.log('✅ 로딩 완료, isLoadingVideos = false');
      setIsLoadingVideos(false);
    }
  };

  const handleMarkComplete = async (videoId: number) => {
    if (!currentUser) return;
    
    // ✅ selectedCourse 확인
    if (!selectedCourse) {
      console.error('❌ selectedCourse가 없습니다.');
      return;
    }

    // courseId를 category로 변환 (API 호출에 필요할 수 있음)
    const categoryMap: { [key: number]: string } = {
      1: 'festival',
      2: 'event',
      3: 'performance'
    };
    const category = categoryMap[selectedCourse] || 'festival';

    try {
      setIsCompleting(true);
      
      // 1. Optimistic Update (UI 즉시 반영)
      setCourseVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, completed: true } : v
      ));
      
      if (selectedVideo && selectedVideo.id === videoId) {
        setSelectedVideo(prev => prev ? { ...prev, completed: true } : null);
      }

      // ✅ 상세 로깅 추가
      const requestPayload = {
        action: 'markVideoComplete',
        userEmail: currentUser.email,
        videoId: videoId,
        courseId: selectedCourse,
        timestamp: Date.now()
      };
      
      console.log('🔄 완료 표시 요청 전송:', requestPayload);
      console.log('📊 videoId 타입:', typeof videoId, '값:', videoId);
      console.log('📊 현재 영상 목록:', courseVideos.map(v => ({ id: v.id, title: v.title })));

      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestPayload)
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ 완료 표시 성공');
        console.log('🔄 강좌 목록 새로고침 시작...');
        // 전체 진도율 업데이트를 위해 강좌 목록만 새로고침 (영상 목록은 로컬 상태 유지)
        if (currentUser) {
          await loadEnrolledCourses(currentUser.email);
        }
        console.log('✅ 강좌 목록 새로고침 완료');
      } else {
        throw new Error(result.message || '완료 처리 실패');
      }
    } catch (error) {
      console.error('❌ 진도 업데이트 오류:', error);
      // 실패 시 롤백
      setCourseVideos(prev => prev.map(v => 
        v.id === videoId ? { ...v, completed: false } : v
      ));
      if (selectedVideo && selectedVideo.id === videoId) {
        setSelectedVideo(prev => prev ? { ...prev, completed: false } : null);
      }
      // alert 제거하고 콘솔에만 기록 (사용자 경험 개선)
      // alert('완료 처리에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleViewCourse = async (courseId: number) => {
    setSelectedCourse(courseId);
    setIsLoadingVideos(true);
    setCourseVideos([]); // 이전 영상 목록 초기화
    await loadCourseVideos(courseId);
    // ✅ 페이지 전환 시 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setCourseVideos([]);
    setIsLoadingVideos(false);
    // ✅ 강의 목록으로 돌아갈 때도 스크롤을 맨 위로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVideo = (video: CourseVideo) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
    setVideoStartTime(Date.now());
    setWatchedSeconds(0); // ✅ 시청 시간 초기화
    console.log('🎬 영상 재생 시작:', video.title, '시작 시간:', new Date().toLocaleTimeString());
    
    // ✅ 저장된 진행 정보 불러오기
    if (currentUser && selectedCourse) {
      const storageKey = `video_progress_${currentUser.email}_${selectedCourse}_${video.id}`;
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        const progressData = JSON.parse(savedProgress);
        console.log('📂 저장된 시청 기록 발견:', progressData);
        setWatchedSeconds(progressData.watchedSeconds || 0);
      }
    }
    
    // 마지막 시청 정보 저장
    if (selectedCourse) {
      const course = enrolledCourses.find(c => c.courseId === selectedCourse);
      if (course) {
        const lastWatchedInfo = {
          courseId: selectedCourse,
          courseTitle: course.title,
          videoId: video.id,
          videoTitle: video.title,
          timestamp: Date.now()
        };
        localStorage.setItem('lastWatchedVideo', JSON.stringify(lastWatchedInfo));
        // 커스텀 이벤트 발생 (같은 탭에서 플로팅 버튼 업데이트)
        window.dispatchEvent(new Event('lastWatchedUpdated'));
      }
    }
  };

  const handleCloseVideo = () => {
    // ✅ 모달 닫기 전에 진행 정보 저장
    if (selectedVideo && selectedCourse) {
      saveVideoProgress();
    }
    
    // 상태 초기화
    setSelectedVideo(null);
    setShowVideoModal(false);
    setVideoStartTime(null);
    setWatchedSeconds(0);
  };

  // ✅ 시청 시간 추적 타이머
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (showVideoModal && selectedVideo) {
      console.log('⏱️ 시청 시간 추적 시작:', selectedVideo.title);
      
      // 1초마다 시청 시간 증가
      interval = setInterval(() => {
        setWatchedSeconds(prev => {
          const newSeconds = prev + 1;
          const totalSeconds = selectedVideo.duration * 60;
          const watchedPercent = Math.round((newSeconds / totalSeconds) * 100);
          
          // 5초마다 로그 출력
          if (newSeconds % 5 === 0) {
            console.log(`📊 시청 진행률: ${watchedPercent}% (${Math.floor(newSeconds / 60)}분 ${newSeconds % 60}초 / ${selectedVideo.duration}분)`);
          }
          
          // ✅ 100% 시청 시 자동 완료
          if (watchedPercent >= 100 && !selectedVideo.completed && selectedCourse) {
            console.log('✅ 100% 시청 완료! 자동 완료 처리');
            handleMarkComplete(selectedVideo.id);
            selectedVideo.completed = true; // 중복 처리 방지
          }
          
          return newSeconds;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) {
        console.log('⏹️ 시청 시간 추적 종료');
        clearInterval(interval);
      }
    };
  }, [showVideoModal, selectedVideo, selectedCourse]);

  // ✅ 페이지 이탈 시 시청 정보 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (showVideoModal && selectedVideo && selectedCourse) {
        saveVideoProgress();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showVideoModal, selectedVideo, selectedCourse, watchedSeconds]);

  // ✅ 시청 진행 정보 저장 함수
  const saveVideoProgress = () => {
    if (!selectedVideo || !selectedCourse || !currentUser) return;

    const totalSeconds = selectedVideo.duration * 60;
    const watchedPercent = Math.round((watchedSeconds / totalSeconds) * 100);
    
    const progressData = {
      userEmail: currentUser.email,
      courseId: selectedCourse,
      videoId: selectedVideo.id,
      videoTitle: selectedVideo.title,
      watchedSeconds: watchedSeconds,
      totalSeconds: totalSeconds,
      watchedPercent: watchedPercent,
      lastWatchedAt: new Date().toISOString()
    };

    console.log('💾 시청 진행 정보 저장:', progressData);
    
    // localStorage에 저장
    const storageKey = `video_progress_${currentUser.email}_${selectedCourse}_${selectedVideo.id}`;
    localStorage.setItem(storageKey, JSON.stringify(progressData));
    
    // 전체 진행 정보도 업데이트
    const allProgressKey = `all_video_progress_${currentUser.email}`;
    const allProgress = JSON.parse(localStorage.getItem(allProgressKey) || '{}');
    allProgress[`${selectedCourse}_${selectedVideo.id}`] = progressData;
    localStorage.setItem(allProgressKey, JSON.stringify(allProgress));
  };

  // ✅ 모달 스케일 계산 (1920px~1024px: 스케일링, 1023px 이하: 전체 화면)
  const modalScale = useMemo(() => {
    if (screenWidth <= 1023) {
      return 1; // ✅ 모바일은 스케일 없음 (전체 화면)
    }
    if (screenWidth >= 1920) return 1;
    if (screenWidth >= 1024) {
      // 1920px → 1024px: 1400px → 746px (비례 축소)
      const scale = 746 / 1400;
      return Math.max(scale, (screenWidth - 100) / 1400);
    }
    return 1;
  }, [screenWidth]);

  // ✅ 화면 너비 변경 감지
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Google Drive URL을 Embed URL로 변환
  const convertToEmbedUrl = (url: string): string => {
    // https://drive.google.com/file/d/FILE_ID/view -> https://drive.google.com/file/d/FILE_ID/preview
    const fileIdMatch = url.match(/\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      // rm=minimal: 최소 UI (다운로드/새탭 버튼 제거)
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview?enablejsapi=1&fs=1&rm=minimal`;
    }
    return url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  // ✅ 카테고리별 기본 이미지 반환
  const getDefaultImage = (category: string): string => {
    const defaultImages: { [key: string]: string } = {
      '축제기획사': 'https://images.unsplash.com/photo-1550697797-f01b4e83a1be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZhbCUyMGV2ZW50JTIwc3RhZ2UlMjBjb25jZXJ0fGVufDF8fHx8MTc3MDE5MjY3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      '이벤트기획사': 'https://images.unsplash.com/photo-1768851142332-75f3d1b47452?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBsYW5uaW5nJTIwcGFydHklMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzAxOTI2Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      '공연기획사': 'https://images.unsplash.com/photo-1609039504401-47ac3940f378?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwcGVyZm9ybWFuY2UlMjBzdGFnZSUyMHNob3d8ZW58MXx8fHwxNzcwMTkyNjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    };
    return defaultImages[category] || defaultImages['축제기획사'];
  };

  const totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / enrolledCourses.length)
    : 0;

  const totalCompletedLessons = enrolledCourses.reduce((sum, course) => sum + course.completedLessons, 0);

  // 임시 데이터 (API 연동 전까지 표시용)
  const recentActivity = [
    { date: '2025-01-14', course: '축제기획사', lesson: '축제 기획 개론', duration: 45 },
    { date: '2025-01-13', course: '이벤트기획사', lesson: '이벤트 마케팅', duration: 60 },
    { date: '2025-01-12', course: '공연기획사', lesson: '공연 기획 실무', duration: 30 }
  ];

  const achievements = [
    { icon: '🏆', title: '첫 강의 완료', description: '첫 강의를 완강했습니다' },
    { icon: '⚡', title: '7일 연속 학습', description: '꾸준한 학습자' },
    { icon: '🎯', title: '진도율 80% 달성', description: '열정적인 수강생' },
    { icon: '📚', title: '30강 완료', description: '학습왕' }
  ];

  // 로딩 상태
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 등록된 강좌가 없는 경우
  if (!enrolledCourses || enrolledCourses.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-24 pb-12 px-4">
        <div className="text-center max-w-md">
          <BookOpen size={80} className="mx-auto mb-6 text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3\">등록된 강의가 없습니다</h2>
          <p className="text-gray-600 mb-8\">
            강의를 수강하려면 먼저 결제를 진행해주세요.
          </p>
          <button
            onClick={() => onNavigate('courses')}
            className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg\"
          >\n            강의 둘러보기\n          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 로딩 오버레이 */}
      {isLoading && <LoadingScreen isMobile={isMobile} />}
      
      {/* ✅ 영상 재생 모달 */}
      {showVideoModal && selectedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflowY: screenWidth <= 1023 ? 'auto' : 'hidden', // ✅ 모바일에서는 스크롤 가능
            padding: screenWidth <= 1023 ? '20px' : '0' // ✅ 모바일 여백
          }}
          onClick={(e) => {
            // 배경 클릭 시 모달 닫기
            if (e.target === e.currentTarget) {
              handleCloseVideo();
            }
          }}
        >
          <div 
            className="bg-background rounded-sm overflow-hidden shadow-2xl"
            style={{
              width: screenWidth <= 1023 ? '100%' : '1400px', // ✅ 모바일: 전체 너비
              height: screenWidth <= 1023 ? 'auto' : '800px', // ✅ 모바일: 자동 높이
              maxWidth: screenWidth <= 1023 ? '600px' : undefined, // ✅ 모바일 최대 너비
              transform: screenWidth <= 1023 ? 'none' : `scale(${modalScale})`, // ✅ 모바일: 스케일 없음
              transformOrigin: 'center center',
              display: 'flex',
              flexDirection: 'column',
              margin: screenWidth <= 1023 ? 'auto' : undefined // ✅ 모바일 중앙 정렬
            }}
          >
            {/* 모달 헤더 */}
            <div 
              className="flex items-center justify-between p-6 border-b border-border flex-shrink-0"
              style={{ height: screenWidth <= 1023 ? 'auto' : '90px', minHeight: '70px' }}
            >
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="font-['Playfair_Display'] text-2xl font-light text-foreground mb-1 truncate">
                  {selectedVideo.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {selectedVideo.description}
                </p>
              </div>
              <button
                onClick={handleCloseVideo}
                className="ml-4 w-10 h-10 flex-shrink-0 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="닫기"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 5L15 15M5 15L15 5" />
                </svg>
              </button>
            </div>

            {/* 영상 플레이어 - 16:9 비율 고정 */}
            <div 
              className="relative bg-black"
              style={{ 
                height: screenWidth <= 1023 ? 'auto' : '630px', // ✅ 모바일: 자동 높이
                aspectRatio: screenWidth <= 1023 ? '16/9' : undefined, // ✅ 모바일: 16:9 비율 유지
                flexShrink: 0
              }}
            >
              <iframe
                src={convertToEmbedUrl(selectedVideo.videoUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              />
              {/* ✅ 상단 우측 "새 탭에서 보기" 버튼 차단 오버레이 */}
              <div 
                className="absolute top-0 right-0 pointer-events-auto cursor-default"
                style={{ 
                  width: '100px',
                  height: '50px',
                  background: 'transparent',
                  zIndex: 999
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </div>

            {/* 모달 푸터 */}
            <div 
              className="p-6 border-t border-border flex items-center justify-between flex-shrink-0 flex-wrap gap-3"
              style={{ height: screenWidth <= 1023 ? 'auto' : '80px', minHeight: '70px' }}
            >
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Clock size={14} />
                  {selectedVideo.duration}분
                </span>
                {selectedVideo.completed && (
                  <span className="text-primary flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle size={14} />
                    완료
                  </span>
                )}
              </div>
              {!selectedVideo.completed && selectedCourse && (
                <button
                  onClick={() => handleMarkComplete(selectedVideo.id)}
                  disabled={isCompleting}
                  className={`px-6 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap ${isCompleting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isCompleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isCompleting ? "처리 중..." : "완료 표시"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* ✅ 강의 상세 뷰 (selectedCourse가 있을 때) */}
      {selectedCourse && (
        <div className={`w-full ${isMobile ? 'px-6' : 'max-w-[1400px]'} mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          {/* 뒤로 가기 버튼 */}
          <button
            onClick={handleBackToCourses}
            className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft size={20} />
            <span>강의 목록으로 돌아가기</span>
          </button>

          {/* 강의 제목 */}
          <div className="mb-12">
            <h1 className={`font-['Playfair_Display'] ${isMobile ? 'text-4xl' : 'text-6xl'} font-light text-foreground mb-4`}>
              {enrolledCourses.find(c => c.courseId === selectedCourse)?.title || '강의 영상'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {courseVideos.length}개의 영상
            </p>
          </div>

          {/* 로딩 중 */}
          {isLoadingVideos && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">영상 목록을 불러오는 중...</p>
            </div>
          )}

          {/* 영상 목록 */}
          {!isLoadingVideos && courseVideos.length > 0 && (
            <div className="space-y-8">
              {courseVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="group border border-border rounded-sm hover:border-primary/50 transition-all duration-500"
                >
                  <div className="flex items-center gap-8 p-8">
                    {/* 번호/상태 아이콘 */}
                    <div className="flex-shrink-0">
                      {video.completed ? (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-lg font-light text-muted-foreground">{index + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* 영상 정보 */}
                    <div className="flex-1">
                      <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-light text-foreground mb-2 group-hover:text-primary transition-colors`}>
                        {video.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {video.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {video.duration}분
                        </span>
                        {video.completed && (
                          <span className="text-primary flex items-center gap-1">
                            <CheckCircle size={14} />
                            완료
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 재생 버튼 */}
                    <button
                      onClick={() => handleOpenVideo(video)}
                      className="flex-shrink-0 w-12 h-12 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center group-hover:scale-110"
                    >
                      <Play size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 영상이 없을 때 */}
          {!isLoadingVideos && courseVideos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Video size={60} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">등록된 영상이 없습니다.</p>
            </div>
          )}
        </div>
      )}
      
      {/* ✅ 강의 목록 뷰 (selectedCourse가 없을 때) */}
      {!selectedCourse && (
        <div className={`w-full ${isMobile ? 'px-6' : 'max-w-[1400px]'} mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
          {/* ✨ 헤더 - Playfair Display */}
          <div className={`${isMobile ? 'mb-12' : 'mb-20'}`}>
            <h1 className={`font-['Playfair_Display'] ${isMobile ? 'text-5xl' : 'text-7xl'} font-light text-foreground mb-4 tracking-tight`}>
              나의 강의실
            </h1>
            <p className="text-lg text-muted-foreground">학습 현황과 진도를 확인하세요</p>
          </div>

          {/* ✨ 수강 중인 강좌 */}
          <div className={`${isMobile ? 'mb-16' : 'mb-24'}`}>
            <h2 className={`font-['Playfair_Display'] ${isMobile ? 'text-3xl' : 'text-4xl'} font-light text-foreground mb-8`}>
              수강 중인 강좌
            </h2>
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'} ${isMobile ? 'gap-8' : 'gap-12'}`}>
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="group"
                >
                  {/* 강좌 이미지 */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted/30 mb-6 rounded-sm">
                    <ImageWithFallback
                      src={course.image || getDefaultImage(course.category)}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                        <button 
                          onClick={() => handleViewCourse(course.courseId)}
                          className="bg-background text-foreground px-8 py-3 rounded-sm font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                        >
                          이어보기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 강좌 정보 */}
                  <div>
                    {/* 카테고리 */}
                    <div className="mb-3">
                      <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                        {course.category}
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 className={`font-['Playfair_Display'] ${isMobile ? 'text-2xl' : 'text-3xl'} font-light text-foreground mb-4 group-hover:text-primary transition-colors duration-300`}>
                      {course.title}
                    </h3>

                    {/* 강의 통계 - 미니멀 */}
                    <div className="flex items-center gap-8 mb-6 pb-6 border-b border-border">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-light text-foreground">{course.totalLessons}</span>
                        <span className="text-sm text-muted-foreground">총 영상</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-light text-primary">{course.completedLessons}</span>
                        <span className="text-sm text-muted-foreground">완료</span>
                      </div>
                    </div>

                    {/* 진도율 - 미니멀 */}
                    <div className="mb-6">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-sm tracking-wide text-muted-foreground">학습 진도</span>
                        <span className={`${isMobile ? 'text-3xl' : 'text-4xl'} font-light text-primary`}>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-muted/30 h-1">
                        <div
                          className="bg-primary h-1 transition-all duration-1000 ease-out"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* 시작 버튼 */}
                    <button
                      onClick={() => {
                        window.scrollTo(0, 0); // ✅ 버튼 클릭 즉시 스크롤 최상단 이동
                        handleViewCourse(course.courseId);
                      }}
                      className="w-full py-4 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wide font-medium rounded-sm"
                    >
                      <Play size={16} />
                      {course.progress === 0 ? '학습 시작' : '이어서 보기'}
                    </button>
                  </div>
                </div>
              ))}
              
              {/* ✨ 시험 응시 카드 (4번째 카드) */}
              {enrolledCourses.length > 0 && (
                <div className="group">
                  {/* 시험 응시 이미지 */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 mb-6 rounded-sm flex items-center justify-center">
                    <div className="text-center">
                      <FileText size={isMobile ? 64 : 80} className="text-primary mx-auto mb-4 opacity-80" strokeWidth={1} />
                      <p className={`font-['Playfair_Display'] ${isMobile ? 'text-2xl' : 'text-3xl'} font-light text-foreground`}>
                        자격증 시험
                      </p>
                    </div>
                  </div>

                  {/* 시험 정보 */}
                  <div>
                    {/* 카테고리 */}
                    <div className="mb-3">
                      <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-medium">
                        CERTIFICATION EXAM
                      </span>
                    </div>

                    {/* 제목 */}
                    <h3 className={`font-['Playfair_Display'] ${isMobile ? 'text-2xl' : 'text-3xl'} font-light text-foreground mb-4 group-hover:text-primary transition-colors duration-300`}>
                      자격증 시험
                    </h3>

                    {/* 시험 안내 */}
                    <div className="mb-6 pb-6 border-b border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        강좌별 자격증 시험에 응시하고 결���를 확인하세요
                      </p>
                      <div className="space-y-2">
                        {[
                          '총 10문제 (OX 문제)',
                          '합격 기준: 70점 이상',
                          '시험 시간: 90분'
                        ].map((text, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground" />
                            <span className="text-muted-foreground">{text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 시험 응시 & 결과 확인 버튼 */}
                    <div className="space-y-3">
                      {/* 시험 응시 버튼 - 수강 중인 첫 번째 강좌로 이동 */}
                      <button
                        onClick={() => {
                          if (onNavigate && enrolledCourses.length > 0) {
                            const firstCourse = enrolledCourses[0];
                            const categoryNameMap: { [key: string]: string } = {
                              '축제기획사': '축제기획사',
                              '이벤트기획사': '이벤트기획사',
                              '공연기획사': '공연기획사'
                            };
                            onNavigate('exam', categoryNameMap[firstCourse.category] || firstCourse.category);
                          }
                        }}
                        className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wide font-medium rounded-sm"
                      >
                        <FileText size={16} />
                        시험 응시
                      </button>
                      
                      {/* 시험 결과 확인 버튼 */}
                      <button
                        onClick={() => {
                          if (onNavigate) {
                            onNavigate('exam-results');
                          }
                        }}
                        className="w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wide font-medium rounded-sm"
                      >
                        <Award size={16} />
                        시험 결과 확인
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ✨ 최근 학습 활동 */}
          <div>
            <h2 className={`font-['Playfair_Display'] ${isMobile ? 'text-3xl' : 'text-4xl'} font-light text-foreground mb-8`}>
              최근 학습 활동
            </h2>
            <div className="space-y-1">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between py-6 border-b border-border last:border-0 hover:bg-muted/20 transition-colors duration-300 px-2"
                >
                  <div className="flex-1">
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} font-light text-foreground mb-1`}>
                      {activity.lesson}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.course}
                    </p>
                  </div>
                  <div className="flex items-center gap-8 text-sm text-muted-foreground">
                    <span>{formatDate(activity.date)}</span>
                    <span className="font-light">{activity.duration}분</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
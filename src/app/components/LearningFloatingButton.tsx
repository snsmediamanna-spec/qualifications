import { useState, useEffect } from 'react';
import { Play, ChevronRight, X, BookOpen, Clock } from 'lucide-react';

interface LastWatchedInfo {
  courseId: number;
  courseTitle: string;
  videoId: number;
  videoTitle: string;
  timestamp: number;
}

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

interface LearningFloatingButtonProps {
  userEmail: string;
  onNavigateToVideo: (courseId: number, videoId: number) => void;
  onNavigateToClassroom: () => void;
}

export function LearningFloatingButton({ userEmail, onNavigateToVideo, onNavigateToClassroom }: LearningFloatingButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastWatched, setLastWatched] = useState<LastWatchedInfo | null>(null);
  const [firstVideos, setFirstVideos] = useState<LastWatchedInfo[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);

  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";

  // 해금된 강의 로드
  useEffect(() => {
    loadEnrolledCourses();
  }, [userEmail]);

  const loadEnrolledCourses = async () => {
    if (!userEmail) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'getEnrolledCourses',
          userEmail: userEmail,
          timestamp: new Date().getTime()
        })
      });

      const result = await response.json();

      if (result.success) {
        const courses = result.courses || [];
        
        // categoryKey 추가
        const coursesWithCategory = courses.map((course: any) => {
          const categoryMap: { [key: number]: string } = {
            1: 'festival',
            2: 'event',
            3: 'performance'
          };
          
          return {
            ...course,
            categoryKey: categoryMap[course.courseId] || 'festival'
          };
        });
        
        setEnrolledCourses(coursesWithCategory);
      }
    } catch (error) {
      console.error('❌ 해금된 강의 로드 오류:', error);
    }
  };

  useEffect(() => {
    loadVideoInfo();
  }, [enrolledCourses]);

  const loadVideoInfo = async () => {
    console.log('🔍 플로팅 버튼: enrolledCourses 체크', enrolledCourses);
    
    if (enrolledCourses.length === 0) {
      console.log('❌ 플로팅 버튼: 해금된 강의 없음');
      setIsLoading(false);
      return;
    }

    console.log('✅ 플로팅 버튼: 해금된 강의 있음', enrolledCourses.length, '개');

    // localStorage에서 마지막 시청 정보 가져오기
    const saved = localStorage.getItem('lastWatchedVideo');
    let hasLastWatched = false;
    
    if (saved) {
      try {
        const data = JSON.parse(saved);
        console.log('📼 마지막 시청 정보:', data);
        // 현재 해금된 강의 중 하나인지 확인
        const isEnrolled = enrolledCourses.some(c => c.courseId === data.courseId);
        if (isEnrolled) {
          setLastWatched(data);
          hasLastWatched = true;
          console.log('✅ 마지막 시청 정보 설정됨');
        }
      } catch (error) {
        console.error('마지막 시청 정보 로드 실패:', error);
      }
    } else {
      console.log('📭 마지막 시청 정보 없음');
    }

    // 마지막 시청 정보가 없으면 각 강의의 첫 번째 영상 로드
    if (!hasLastWatched) {
      console.log('🎬 각 강의의 첫 번째 영상 로드 시작...');
      const firstVideosList: LastWatchedInfo[] = [];
      
      for (const course of enrolledCourses) {
        try {
          const categoryKey = course.categoryKey;
          console.log(`🔍 강의 ${course.title} (${categoryKey}) 첫 영상 로드 중...`);
          const response = await fetch(`${API_URL}?action=getVideosByCategory&category=${categoryKey}&timestamp=${Date.now()}`, {
            method: 'GET',
            redirect: 'follow'
          });

          if (!response.ok) {
            console.error(`❌ 강의 ${course.title} 응답 오류: ${response.status} ${response.statusText}`);
            continue;
          }

          const result = await response.json();
          console.log(`📦 강의 ${course.title} API 응답:`, result);
          
          let videos = [];
          if (Array.isArray(result)) {
            videos = result;
          } else if (result && result.videos && Array.isArray(result.videos)) {
            videos = result.videos;
          } else if (result && result.success && result.data && Array.isArray(result.data)) {
            videos = result.data;
          }

          console.log(`📹 강의 ${course.title} 영상 개수:`, videos.length);

          // 첫 번째 영상 정보 저장
          if (videos.length > 0) {
            const firstVideo = videos.sort((a: any, b: any) => (a.number || a.rowNumber) - (b.number || b.rowNumber))[0];
            console.log(`✅ 첫 번째 영상:`, firstVideo);
            firstVideosList.push({
              courseId: course.courseId,
              courseTitle: course.title,
              videoId: firstVideo.rowNumber || firstVideo.id,
              videoTitle: firstVideo.title,
              timestamp: Date.now()
            });
          }
        } catch (error) {
          console.error(`강의 ${course.courseId} 첫 영상 로드 실패:`, error);
          // 에러가 발생해도 다음 강의 로딩을 계속 진행
          continue;
        }
      }
      
      console.log('📋 전체 첫 영상 목록:', firstVideosList);
      setFirstVideos(firstVideosList);
      
      // 첫 번째 강의의 첫 번째 영상을 기본으로 설정
      if (firstVideosList.length > 0) {
        setLastWatched(firstVideosList[0]);
        console.log('✅ 기본 영상 설정:', firstVideosList[0]);
      }
    }
    
    setIsLoading(false);
    console.log('✅ 플로팅 버튼 로딩 완료');
  };

  useEffect(() => {
    // storage 이벤트 리스너 (다른 탭에서 변경 시)
    const handleStorageChange = () => loadVideoInfo();
    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트 리스너 (같은 탭에서 변경 시)
    const handleUpdate = () => loadVideoInfo();
    window.addEventListener('lastWatchedUpdated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lastWatchedUpdated', handleUpdate);
    };
  }, [enrolledCourses]);

  // 해금된 강의가 없거나 로딩 중이거나 숨김 상태면 표시하지 않음
  console.log('🎯 플로팅 버튼 렌더링 체크:', {
    enrolledCoursesLength: enrolledCourses.length,
    isLoading,
    isVisible,
    lastWatched
  });

  if (enrolledCourses.length === 0) {
    console.log('❌ 렌더링 중단: 해금된 강의 없음');
    return null;
  }
  
  if (isLoading) {
    console.log('⏳ 렌더링 중단: 로딩 중');
    return null;
  }
  
  if (!isVisible) {
    console.log('👁️ 렌더링 중단: 숨김 상태');
    return null;
  }
  
  if (!lastWatched) {
    console.log('❌ 렌더링 중단: lastWatched 없음');
    return null;
  }

  console.log('✅ 플로팅 버튼 렌더링!');

  const hasMultipleCourses = firstVideos.length > 1;
  const savedLastWatched = localStorage.getItem('lastWatchedVideo');

  return (
    <>
      {/* 플로팅 버튼 */}
      <div 
        className="fixed right-6 z-40 lg:bottom-8"
        style={{
          bottom: 'calc(140px + env(safe-area-inset-bottom, 0px))'
        }}
      >
        {isExpanded ? (
          // 확장된 카드
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 w-80 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#2851a3] to-[#1e3a8a] flex items-center justify-center">
                  <BookOpen size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    {savedLastWatched ? '학습 이어하기' : '학습 시작하기'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {savedLastWatched ? '마지막 시청' : '첫 강의부터'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3">
              {/* 마지막 시청 강의 또는 첫 번째 강의 */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600 mb-1">📚 {lastWatched.courseTitle}</p>
                    <p className="text-sm font-bold text-gray-900 truncate mb-3">
                      {lastWatched.videoTitle}
                    </p>
                    <button
                      onClick={() => {
                        onNavigateToVideo(lastWatched.courseId, lastWatched.videoId);
                        setIsExpanded(false);
                      }}
                      className="w-full px-4 py-2.5 bg-[#2851a3] text-white rounded-lg text-sm font-bold hover:bg-[#1e3a8a] transition-colors flex items-center justify-center gap-2"
                    >
                      <Play size={16} />
                      {savedLastWatched ? '이어서 보기' : '학습 시작'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 여러 강의가 해금되어 있는 경우 다른 강의들 표시 */}
              {hasMultipleCourses && firstVideos.length > 1 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2">다른 강의</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {firstVideos
                      .filter(video => video.courseId !== lastWatched.courseId)
                      .map((video, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            onNavigateToVideo(video.courseId, video.videoId);
                            setIsExpanded(false);
                          }}
                          className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-[#2851a3] hover:bg-gray-50 transition-all text-left"
                        >
                          <p className="text-xs text-gray-600 mb-1">{video.courseTitle}</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {video.videoTitle}
                          </p>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* 나의강의실로 이동 */}
              <button
                onClick={() => {
                  onNavigateToClassroom();
                  setIsExpanded(false);
                }}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-[#2851a3] transition-colors flex items-center justify-center gap-2"
              >
                전체 강의 보기
                <ChevronRight size={16} />
              </button>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              접기
            </button>
          </div>
        ) : (
          // 축소된 버튼
          <button
            onClick={() => setIsExpanded(true)}
            className="group bg-gradient-to-r from-[#2851a3] to-[#1e3a8a] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 p-4 flex items-center gap-3"
          >
            <div className="relative">
              <Play size={24} fill="white" className="text-white" />
              {!savedLastWatched && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
              {savedLastWatched && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <span className="font-bold text-sm pr-1 max-w-0 group-hover:max-w-xs overflow-hidden transition-all duration-300 whitespace-nowrap">
              {savedLastWatched ? '학습 이어하기' : '학습 시작'}
            </span>
          </button>
        )}
      </div>
    </>
  );
}
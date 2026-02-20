import { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, Mail, Calendar, Shield, ChevronDown, User, Phone, TrendingUp, Activity, Award, CheckCircle, XCircle, BookOpen, Lock, Unlock } from 'lucide-react';
import LoadingScreen from '@/app/components/LoadingScreen';

export function AdminUserManagement() {
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [isTogglingCourse, setIsTogglingCourse] = useState<number | null>(null);

  // 사용 가능한 강의 목록
  const availableCourses = [
    { id: 1, title: '축제기획사', category: '축제기획사' },
    { id: 2, title: '이벤트기획사', category: '이벤트기획사' },
    { id: 3, title: '공연기획사', category: '공연기획사' }
  ];

  const loadUsers = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    setStatus(null);

    try {
      console.log('📤 회원 목록 조회 요청');
      
      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify({
          action: 'getAllUsers',
          timestamp: Date.now()
        })
      });

      const text = await response.text();
      console.log('📥 응답:', text);
      
      try {
        const result = JSON.parse(text);
        console.log('✅ 파싱된 데이터:', result);
        
        if (result.success) {
          setUsers(result.users || []);
          if (showLoading) {
            setStatus({
              success: true,
              message: `총 ${result.total || result.users?.length || 0}명의 회원이 조회되었습니다.`
            });
          }
        } else {
          setStatus({
            success: false,
            message: result.message || "회원 조회 실패"
          });
        }
      } catch (parseError) {
        console.error('⚠️ JSON 파싱 오류:', parseError);
        
        if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
          setStatus({
            success: false,
            message: "API가 HTML을 반환했습니다. Google Apps Script 설정을 확인해주세요."
          });
        } else {
          setStatus({
            success: false,
            message: "데이터 형식 오류"
          });
        }
      }

    } catch (error) {
      console.error('❌ 회원 조회 오류:', error);
      setStatus({
        success: false,
        message: "서버 연결 실패"
      });
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
      setIsInitialLoad(false);
    }
  };

  // ✅ 컴포넌트 마운트 시 백그라운드에서 회원 목록 로드 (로딩 화면 없이)
  useEffect(() => {
    loadUsers(false); // 백그라운드 로드 - 로딩 화면 표시 안 함
  }, []);

  // 회원 정보 업데이트 함수
  const updateUserInfo = async (userId: string, field: string, value: any) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({
          action: 'updateUserInfo',
          userId: userId,
          field: field,
          value: value
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // 로컬 상태 업데이트
        setUsers(users.map(u => 
          u.id === userId || u.email === userId 
            ? { ...u, [field]: value }
            : u
        ));
        
        if (selectedUser && (selectedUser.id === userId || selectedUser.email === userId)) {
          setSelectedUser({ ...selectedUser, [field]: value });
        }
        
        setStatus({
          success: true,
          message: '회원 정보가 업데이트되었습니다.'
        });
      } else {
        throw new Error(result.message || '업데이트 실패');
      }
    } catch (error) {
      console.error('❌ 회원 정보 업데이트 오류:', error);
      setStatus({
        success: false,
        message: '회원 정보 업데이트에 실패했습니다.'
      });
    }
  };

  // 회원등급 변경 (일반 ↔ 관리자)
  const toggleMemberGrade = async (userId: string, currentGrade: string) => {
    const newGrade = currentGrade === '관리자' ? '일반' : '관리자';
    await updateUserInfo(userId, 'memberGrade', newGrade);
  };

  // 회원 상태 변경 (활성 ↔ 비활성)
  const toggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = (currentStatus === 'active' || currentStatus === '활성') ? 'inactive' : 'active';
    await updateUserInfo(userId, 'status', newStatus);
  };

  // 사용자의 등록된 강의 목록 불러오기
  const loadUserCourses = async (userEmail: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'getUserEnrolledCourses',
          userEmail: userEmail,
          timestamp: new Date().getTime()
        })
      });

      const result = await response.json();

      if (result.success) {
        const courseIds = result.courses?.map((c: any) => c.courseId) || [];
        setEnrolledCourses(courseIds);
      }
    } catch (error) {
      console.error('강의 목록 로드 오류:', error);
      setEnrolledCourses([]);
    }
  };

  // 강의 해금/차단
  const toggleCourseAccess = async (userEmail: string, courseId: number, courseName: string) => {
    setIsTogglingCourse(courseId);
    
    try {
      const isEnrolled = enrolledCourses.includes(courseId);
      const action = isEnrolled ? 'unenrollCourse' : 'enrollCourse';

      const response = await fetch(API_URL, {
        method: 'POST',
        redirect: 'follow',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: action,
          userEmail: userEmail,
          courseId: courseId,
          courseName: courseName,
          timestamp: new Date().getTime()
        })
      });

      const result = await response.json();

      if (result.success) {
        // 로컬 상태 업데이트
        if (isEnrolled) {
          setEnrolledCourses(enrolledCourses.filter(id => id !== courseId));
        } else {
          setEnrolledCourses([...enrolledCourses, courseId]);
        }

        setStatus({
          success: true,
          message: isEnrolled 
            ? `${courseName} 강의가 차단되었습니다.` 
            : `${courseName} 강의가 해금되었습니다.`
        });
      } else {
        throw new Error(result.message || '작업 실패');
      }
    } catch (error) {
      console.error('강의 액세스 토글 오류:', error);
      setStatus({
        success: false,
        message: '강의 액세스 변경에 실패했습니다.'
      });
    } finally {
      setIsTogglingCourse(null);
    }
  };

  // 모달이 열릴 때 사용자의 등록된 강의 목록 불러오기
  useEffect(() => {
    if (selectedUser) {
      loadUserCourses(selectedUser.email);
    }
  }, [selectedUser]);

  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.includes(search)
    );
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR');
    } catch {
      return dateString;
    }
  };

  // 통계 계산
  const stats = {
    total: users.length,
    admins: users.filter(u => u.memberGrade === '관리자').length,
    active: users.filter(u => u.status === 'active' || u.status === '활성').length,
    thisMonth: users.filter(u => {
      if (!u.joinDate && !u.timestamp) return false;
      const joinDate = new Date(u.joinDate || u.timestamp);
      const now = new Date();
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
    }).length
  };

  return (
    <div className="w-full">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-card border border-border p-8 transition-all hover:border-primary">
          <div className="flex items-center justify-between mb-6">
            <Users className="text-primary" size={32} />
          </div>
          <div 
            className="text-5xl mb-2 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {stats.total}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            전체 회원
          </div>
        </div>

        <div className="bg-card border border-border p-8 transition-all hover:border-primary">
          <div className="flex items-center justify-between mb-6">
            <Activity className="text-primary" size={32} />
          </div>
          <div 
            className="text-5xl mb-2 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {stats.active}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            활성 회원
          </div>
        </div>

        <div className="bg-card border border-border p-8 transition-all hover:border-primary">
          <div className="flex items-center justify-between mb-6">
            <Award className="text-primary" size={32} />
          </div>
          <div 
            className="text-5xl mb-2 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {stats.thisMonth}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            이번 달 가입
          </div>
        </div>

        <div className="bg-card border border-border p-8 transition-all hover:border-primary">
          <div className="flex items-center justify-between mb-6">
            <Shield className="text-primary" size={32} />
          </div>
          <div 
            className="text-5xl mb-2 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
          >
            {stats.admins}
          </div>
          <div 
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            관리자
          </div>
        </div>
      </div>

      {/* 컨트롤 바 */}
      <div className="bg-card border border-border p-8 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          {/* 검색 */}
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              name="user-search"
              id="user-search"
              autoComplete="off"
              placeholder="이름, 이메일, 전화번호로 검색..."
              className="w-full pl-12 pr-4 py-4 border border-border bg-input-background text-foreground focus:outline-none focus:border-primary transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            />
          </div>

          {/* 새로고침 버튼 */}
          <button
            onClick={loadUsers}
            disabled={isLoading}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            <RefreshCw className={isLoading ? 'animate-spin' : ''} size={20} />
            새로고침
          </button>
        </div>

        {status && (
          <div className={`mt-6 p-4 border text-sm ${
            status.success 
              ? 'bg-primary/5 text-primary border-primary/20' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            {status.message}
          </div>
        )}
      </div>

      {/* 회원 목록 */}
      {isLoading ? (
        <LoadingScreen />
      ) : filteredUsers.length === 0 ? (
        <div className="bg-card border border-border p-24 text-center">
          <User className="text-muted-foreground mx-auto mb-6" size={48} />
          <p 
            className="text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            {searchTerm ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              className="bg-card border border-border p-8 transition-all hover:border-primary cursor-pointer group"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                    {user.memberGrade === '관리자' ? (
                      <Shield className="text-primary" size={24} />
                    ) : (
                      <User className="text-muted-foreground group-hover:text-primary transition-colors" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 
                      className="text-xl mb-1 text-foreground group-hover:text-primary transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
                    >
                      {user.name}
                    </h3>
                    {user.memberGrade === '관리자' && (
                      <span 
                        className="inline-flex items-center gap-1 text-xs text-primary"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                      >
                        <Shield size={12} />
                        관리자
                      </span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs border ${
                  user.status === 'active' || user.status === '활성'
                    ? 'bg-primary/5 text-primary border-primary/20' 
                    : 'bg-muted text-muted-foreground border-border'
                }`}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                >
                  {user.status === 'active' || user.status === '활성' ? '활성' : '비활성'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail size={16} className="flex-shrink-0" />
                  <span 
                    className="truncate"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone size={16} className="flex-shrink-0" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    {user.phone}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar size={16} className="flex-shrink-0" />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    가입: {formatDate(user.joinDate || user.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 상세 모달 */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{selectedUser.name}</h2>
                    <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>회원 ID: {selectedUser.id || '-'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* 관리자 권한 및 계정 상태 관리 */}
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Shield className="h-4 w-4 text-primary" />
                    권한 및 상태 관리
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground font-medium block mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>회원등급</label>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMemberGrade(selectedUser.email, selectedUser.memberGrade || '일반');
                        }}
                        className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          selectedUser.memberGrade === '관리자'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-card border-2 border-border text-muted-foreground hover:border-primary hover:text-primary'
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {selectedUser.memberGrade === '관리자' ? (
                          <>
                            <Shield className="h-4 w-4" />
                            관리자
                          </>
                        ) : (
                          <>
                            <User className="h-4 w-4" />
                            일반 회원
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 font-medium block mb-2">계정 상태</label>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUserStatus(selectedUser.email, selectedUser.status || 'active');
                        }}
                        className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                          selectedUser.status === 'active' || selectedUser.status === '활성'
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-400 text-white hover:bg-gray-500'
                        }`}
                      >
                        {selectedUser.status === 'active' || selectedUser.status === '활성' ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            활성
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            비활성
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 강의 진도율 */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Award className="h-4 w-4 text-primary" />
                    강의 진도율
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>축제기획사 과정</span>
                        <span className="text-xs font-bold text-primary">{selectedUser.festivalProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${selectedUser.festivalProgress || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>이벤트기획사 과정</span>
                        <span className="text-xs font-bold text-[#8aab87]">{selectedUser.eventProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div 
                          className="bg-[#8aab87] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${selectedUser.eventProgress || 0}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>공연기획사 과정</span>
                        <span className="text-xs font-bold text-[#567d52]">{selectedUser.performanceProgress || 0}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div 
                          className="bg-[#567d52] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${selectedUser.performanceProgress || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 강의 해금 관리 */}
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <BookOpen className="h-4 w-4 text-primary" />
                    강의 해금 관리
                  </h3>
                  <div className="space-y-3">
                    {availableCourses.map((course) => {
                      const isEnrolled = enrolledCourses.includes(course.id);
                      const isProcessing = isTogglingCourse === course.id;
                      
                      return (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                        >
                          <div className="flex items-center gap-3">
                            {/* 스켈레톤 이미지 - 회색 배경 */}
                            <div className="w-12 h-12 rounded-lg bg-muted animate-pulse" />
                            <div>
                              <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{course.title}</p>
                              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>{course.category}</p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCourseAccess(selectedUser.email, course.id, course.title);
                            }}
                            disabled={isProcessing}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 min-w-[100px] justify-center ${
                              isEnrolled
                                ? 'bg-destructive text-destructive-foreground hover:opacity-90'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {isProcessing ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : isEnrolled ? (
                              <>
                                <Lock className="h-4 w-4" />
                                차단
                              </>
                            ) : (
                              <>
                                <Unlock className="h-4 w-4" />
                                해금
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    💡 해금된 강의는 회원의 "나의강의실"에 표시됩니다.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">기본 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium">이메일</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">전화번호</label>
                      <p className="text-sm text-gray-900 mt-1">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">날짜 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium">생년월일</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(selectedUser.birthDate)}</p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">가입일</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(selectedUser.joinDate || selectedUser.timestamp)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">주소</h3>
                  <p className="text-sm text-gray-900">
                    [{selectedUser.postalCode}] {selectedUser.address}
                    {selectedUser.addressDetail && `, ${selectedUser.addressDetail}`}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">설정</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium">마케팅 수신 동의</label>
                      <p className="text-sm text-gray-900 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          selectedUser.agreeMarketing === 'Y' || selectedUser.agreeMarketing === true
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedUser.agreeMarketing === 'Y' || selectedUser.agreeMarketing === true ? '동의' : '미동의'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium">계정 상태</label>
                      <p className="text-sm text-gray-900 mt-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          selectedUser.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {selectedUser.status === 'active' ? '활성' : '비활성'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
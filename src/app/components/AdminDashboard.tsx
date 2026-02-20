import { useState, useEffect } from 'react';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminNoticeManagement } from './AdminNoticeManagement';
import { AdminCourseManagement } from './AdminCourseManagement';
import { AdminExamManagement } from './admin/AdminExamManagement';
import { Users, Bell, Video, FileText } from 'lucide-react';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'notices' | 'courses' | 'exams'>('users');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

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
  }, []);

  return (
    <main className="min-h-screen bg-background">
      {/* Container with responsive padding */}
      <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-24 py-16 lg:py-24">
        
        {/* Header */}
        <header className="mb-16 lg:mb-20">
          <h1 
            className="text-5xl lg:text-7xl mb-6 text-foreground"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, letterSpacing: '0.02em' }}
          >
            Admin
          </h1>
          <p 
            className="text-base lg:text-lg text-muted-foreground mb-4"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, lineHeight: '1.8' }}
          >
            회원과 공지사항을 관리하고 통계를 확인하세요
          </p>
          {currentUser && (
            <p 
              className="text-sm text-muted-foreground"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              {currentUser.name} · {currentUser.email}
            </p>
          )}
        </header>

        {/* Tab Navigation */}
        <nav className="mb-16 lg:mb-20">
          <div className="flex flex-col lg:flex-row gap-4 border-b border-border pb-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`group flex items-center gap-4 px-0 py-3 transition-all $
                activeTab === 'users' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <Users className="text-primary" size={24} />
              <span 
                className={`text-2xl lg:text-3xl ${activeTab === 'users' ? 'text-foreground' : 'text-muted-foreground'}`}
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                회원 관리
              </span>
            </button>
            
            <div className="hidden lg:block w-px bg-border mx-6"></div>
            
            <button
              onClick={() => setActiveTab('notices')}
              className={`group flex items-center gap-4 px-0 py-3 transition-all ${
                activeTab === 'notices' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <Bell className="text-primary" size={24} />
              <span 
                className={`text-2xl lg:text-3xl ${activeTab === 'notices' ? 'text-foreground' : 'text-muted-foreground'}`}
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                공지사항
              </span>
            </button>
            
            <div className="hidden lg:block w-px bg-border mx-6"></div>
            
            <button
              onClick={() => setActiveTab('courses')}
              className={`group flex items-center gap-4 px-0 py-3 transition-all ${
                activeTab === 'courses' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <Video className="text-primary" size={24} />
              <span 
                className={`text-2xl lg:text-3xl ${activeTab === 'courses' ? 'text-foreground' : 'text-muted-foreground'}`}
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                강좌 관리
              </span>
            </button>
            
            <div className="hidden lg:block w-px bg-border mx-6"></div>
            
            <button
              onClick={() => setActiveTab('exams')}
              className={`group flex items-center gap-4 px-0 py-3 transition-all ${
                activeTab === 'exams' ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
            >
              <FileText className="text-primary" size={24} />
              <span 
                className={`text-2xl lg:text-3xl ${activeTab === 'exams' ? 'text-foreground' : 'text-muted-foreground'}`}
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400 }}
              >
                시험 관리
              </span>
            </button>
          </div>
        </nav>

        {/* Tab Content - 모든 탭을 미리 렌더링하고 CSS로 숨김 */}
        <div>
          <div style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
            <AdminUserManagement />
          </div>
          <div style={{ display: activeTab === 'notices' ? 'block' : 'none' }}>
            <AdminNoticeManagement currentUser={currentUser} />
          </div>
          <div style={{ display: activeTab === 'courses' ? 'block' : 'none' }}>
            <AdminCourseManagement />
          </div>
          <div style={{ display: activeTab === 'exams' ? 'block' : 'none' }}>
            <AdminExamManagement />
          </div>
        </div>
      </div>
    </main>
  );
}
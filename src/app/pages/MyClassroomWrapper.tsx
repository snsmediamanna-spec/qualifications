import { useOutletContext, Navigate, useNavigate } from 'react-router';
import { MyClassroom } from '../components/MyClassroom';

interface OutletContext {
  isMobile: boolean;
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  setExamCategory: (category: string) => void;
}

export function MyClassroomWrapper() {
  const { isMobile, isLoggedIn, user, setExamCategory } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  
  // 로그인하지 않은 경우 메인 페이지로 리다이렉트
  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <MyClassroom 
      userEmail={user.email} 
      isMobile={isMobile} 
      onNavigate={(page, category) => {
        if (page === 'exam' && category) {
          setExamCategory(category);
        }
        navigate(`/${page}`);
      }} 
    />
  );
}
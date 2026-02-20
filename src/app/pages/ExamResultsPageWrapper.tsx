import { useOutletContext, Navigate, useNavigate } from 'react-router';
import { ExamResultsPage } from '../components/ExamResultsPage';

interface OutletContext {
  isMobile: boolean;
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
}

export function ExamResultsPageWrapper() {
  const { isMobile, isLoggedIn, user } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  
  // 로그인하지 않은 경우 메인 페이지로 리다이렉트
  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <ExamResultsPage 
      userEmail={user.email} 
      onBack={() => navigate('/my-classroom')} 
      isMobile={isMobile} 
    />
  );
}
import { useOutletContext, Navigate, useNavigate } from 'react-router';
import { ExamPage } from '../components/ExamPage';

interface OutletContext {
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  examCategory: string;
}

export function ExamPageWrapper() {
  const { isLoggedIn, user, examCategory } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  
  // 로그인하지 않은 경우 메인 페이지로 리다이렉트
  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <ExamPage 
      userEmail={user.email} 
      examCategory={examCategory} 
      onBack={() => navigate('/my-classroom')} 
    />
  );
}
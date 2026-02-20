import { useOutletContext, Navigate } from 'react-router';
import { AdminDashboard } from '../components/AdminDashboard';

interface OutletContext {
  isMobile: boolean;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export function AdminPageWrapper() {
  const { isMobile, isAdmin, isLoggedIn } = useOutletContext<OutletContext>();
  
  // 관리자가 아닌 경우 메인 페이지로 리다이렉트
  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <AdminDashboard isMobile={isMobile} />;
}
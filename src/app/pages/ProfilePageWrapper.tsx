import { useOutletContext, Navigate } from 'react-router';
import { ProfilePage } from '../components/ProfilePage';

interface OutletContext {
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function ProfilePageWrapper() {
  const { isLoggedIn, user, onLogout } = useOutletContext<OutletContext>();
  
  // 로그인하지 않은 경우 메인 페이지로 리다이렉트
  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace />;
  }
  
  return <ProfilePage userEmail={user.email} onLogout={onLogout} />;
}
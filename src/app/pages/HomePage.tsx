import { useOutletContext } from 'react-router';
import { FestivalHomePage } from '../components/FestivalHomePage';

interface OutletContext {
  isMobile: boolean;
  isLoggedIn: boolean;
  user: { email: string; name: string } | null;
  onNavigate: (page: string) => void;
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export function HomePage() {
  const { isMobile, isLoggedIn, user, onNavigate, onLoginClick, onSignupClick } = useOutletContext<OutletContext>();
  
  return (
    <FestivalHomePage 
      onNavigate={onNavigate}
      onLoginClick={onLoginClick}
      onSignupClick={onSignupClick}
      user={isLoggedIn && user ? { email: user.email, name: user.name } : null}
      isMobile={isMobile}
    />
  );
}

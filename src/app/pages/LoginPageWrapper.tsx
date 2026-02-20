import { useOutletContext } from 'react-router';
import { LoginPage } from './LoginPage';

interface RootContext {
  onLoginSuccess: (email: string, isAdmin: boolean, name?: string) => void;
}

export function LoginPageWrapper() {
  const context = useOutletContext<RootContext>();
  
  const handleLogin = (email: string, isAdmin: boolean, name?: string) => {
    if (context?.onLoginSuccess) {
      context.onLoginSuccess(email, isAdmin, name);
    }
  };
  
  return <LoginPage onLogin={handleLogin} />;
}

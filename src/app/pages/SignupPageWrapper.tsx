import { useOutletContext } from 'react-router';
import { SignupPage } from './SignupPage';

interface RootContext {
  onSignupSuccess: () => void;
  onSignupSuccessWithLogin: (email: string, isAdmin: boolean, name?: string) => void;
}

export function SignupPageWrapper() {
  const context = useOutletContext<RootContext>();
  
  return (
    <SignupPage 
      onSignupSuccess={context?.onSignupSuccess || (() => {})}
      onSignupSuccessWithLogin={context?.onSignupSuccessWithLogin || (() => {})}
    />
  );
}

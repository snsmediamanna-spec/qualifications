import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ArrowUpRight, Eye, EyeOff, Lock, Loader2, Shield, AlertTriangle, Home } from 'lucide-react';
import { SecurityUtils } from '@/utils/security';

interface LoginPageProps {
  onLogin: (email: string, isAdmin: boolean, name?: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthStatus(null);

    try {
      // 🛡️ 1. 입력값 검증
      if (!SecurityUtils.validateEmail(email)) {
        setAuthStatus({
          success: false,
          message: '올바른 이메일 형식이 아닙니다.'
        });
        setIsLoading(false);
        return;
      }

      // 🛡️ 2. SQL Injection 패턴 감지
      if (SecurityUtils.detectSqlInjection(email) || SecurityUtils.detectSqlInjection(password)) {
        SecurityUtils.logSecurityEvent('error', 'SQL Injection 시도 감지', { email });
        setAuthStatus({
          success: false,
          message: '비정상적인 입력이 감지되었습니다.'
        });
        setIsLoading(false);
        return;
      }

      // 🛡️ 3. Brute Force 방어 - Rate Limiting
      const rateLimitCheck = SecurityUtils.checkLoginAttempt(email);
      if (!rateLimitCheck.allowed) {
        setAuthStatus({
          success: false,
          message: rateLimitCheck.message || '너무 많은 로그인 시도가 감지되었습니다.'
        });
        setIsLoading(false);
        return;
      }

      // ✅ 간단한 요청 데이터
      const requestData = {
        action: 'login',
        email: email,
        password: password,
        timestamp: Date.now()
      };

      const response = await fetch(API_URL, {
        redirect: "follow",
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      
      if (result.success) {
        // ✅ 로그인 성공 - Rate Limit 초기화
        SecurityUtils.clearRateLimit(`login:${email}`);
        SecurityUtils.logSecurityEvent('info', '로그인 성공', { email });

        const isAdmin = result.isAdmin !== undefined 
          ? result.isAdmin 
          : (result.memberGrade === '관리자');
        
        // 🛡️ XSS 방어 - 사용자 정보 이스케이프
        const userInfo = {
          memberNumber: SecurityUtils.escapeHtml(result.memberNumber || ''),
          name: SecurityUtils.escapeHtml(result.name || '사용자'),
          email: SecurityUtils.escapeHtml(result.email || email),
          memberGrade: SecurityUtils.escapeHtml(result.memberGrade || '일반회원'),
        };

        // 세션 저장 (rememberMe 체크 시 localStorage, 아니면 sessionStorage)
        const storage = rememberMe ? localStorage : sessionStorage;
        
        storage.setItem('authUser', JSON.stringify(userInfo));
        storage.setItem('authToken', SecurityUtils.generateCsrfToken()); // ✅ generateToken → generateCsrfToken
        storage.setItem('authExpiry', String(Date.now() + (rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)));
        
        // ✅ QnA 시스템과 호환을 위해 항상 sessionStorage에도 저장
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userInfo', JSON.stringify({
          email: userInfo.email,
          name: userInfo.name,
          isAdmin: isAdmin
        }));
        sessionStorage.setItem('authUser', JSON.stringify(userInfo));
        sessionStorage.setItem('userEmail', userInfo.email);

        setAuthStatus({ success: true, message: '로그인 성공!' });
        
        setTimeout(() => {
          onLogin(email, isAdmin, userInfo.name);
          navigate('/');
        }, 500);
      } else {
        // ❌ 로그인 실패
        SecurityUtils.logSecurityEvent('warning', '로그인 실패', { email, reason: result.message });
        setAuthStatus({
          success: false,
          message: result.message || '로그인에 실패했습니다.'
        });
        setIsLoading(false);
      }
    } catch (error) {
      SecurityUtils.logSecurityEvent('error', '로그인 중 오류 발생', { email, error });
      setAuthStatus({
        success: false,
        message: '서버와의 통신 중 오류가 발생했습니다.'
      });
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetStatus(null);

    try {
      if (!SecurityUtils.validateEmail(resetEmail)) {
        setResetStatus({
          success: false,
          message: '올바른 이메일 형식이 아닙니다.'
        });
        setIsResetting(false);
        return;
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'resetPassword',
          email: resetEmail,
          timestamp: Date.now()
        })
      });

      const result = await response.json();
      
      setResetStatus({
        success: result.success,
        message: result.message || (result.success ? '비밀번호 재설정 이메일이 전송되었습니다.' : '비밀번호 재설정에 실패했습니다.')
      });

      if (result.success) {
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail('');
          setResetStatus(null);
        }, 3000);
      }
    } catch (error) {
      setResetStatus({
        success: false,
        message: '서버와의 통신 중 오류가 발생했습니다.'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 py-6 sm:py-12 relative">
      {/* 왼쪽 상단 홈 버튼 */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group z-10"
        style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}
      >
        <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">홈으로</span>
      </button>

      <div className="w-full max-w-md my-auto">
        {/* 로고 */}
        <div className="text-center mb-6 sm:mb-12">
          <button 
            onClick={() => navigate('/')}
            className="inline-block hover:opacity-80 transition-opacity group"
          >
            <h1 
              className="text-foreground mb-2 tracking-tight"
              style={{ 
                fontFamily: 'Playfair Display', 
                fontWeight: 500,
                fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
                lineHeight: '1.2'
              }}
            >
              Festival Academy
            </h1>
            <p 
              className="text-muted-foreground"
              style={{ 
                fontFamily: 'Inter', 
                fontWeight: 300,
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                letterSpacing: '0.05em'
              }}
            >
              축제기획사 자격증 교육기관
            </p>
          </button>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-card border border-border rounded-sm shadow-sm p-5 sm:p-8">
          {!showForgotPassword ? (
            <>
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                <h2 
                  className="text-card-foreground"
                  style={{ 
                    fontFamily: 'Playfair Display', 
                    fontWeight: 500,
                    fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                    lineHeight: '1.3'
                  }}
                >
                  로그인
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label 
                    htmlFor="email"
                    style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}
                  >
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="h-11 sm:h-12 border-border focus:border-primary transition-colors"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  />
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="password"
                    style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}
                  >
                    비밀번호
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11 sm:h-12 pr-12 border-border focus:border-primary transition-colors"
                      style={{ fontFamily: 'Inter', fontWeight: 300 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 sm:pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="remember"
                      className="cursor-pointer"
                      style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                    >
                      로그인 상태 유지
                    </Label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-primary hover:text-primary/80 transition-colors"
                    disabled={isLoading}
                    style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                  >
                    비밀번호 찾기
                  </button>
                </div>

                {authStatus && (
                  <div
                    className={`flex items-start gap-3 p-3 sm:p-4 rounded-sm border transition-all ${
                      authStatus.success
                        ? 'bg-primary/5 text-primary border-primary/20'
                        : 'bg-destructive/5 text-destructive border-destructive/20'
                    }`}
                  >
                    {authStatus.success ? (
                      <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <span style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}>
                      {authStatus.message}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 sm:h-12 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  style={{ fontFamily: 'Inter', fontWeight: 500 }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      로그인 중...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      로그인
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border text-center">
                <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: 'var(--muted-foreground)' }}>
                  아직 계정이 없으신가요?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                    style={{ fontFamily: 'Inter', fontWeight: 500 }}
                  >
                    회원가입
                    <ArrowUpRight size={14} />
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                <h2 
                  className="text-card-foreground"
                  style={{ 
                    fontFamily: 'Playfair Display', 
                    fontWeight: 500,
                    fontSize: 'clamp(1.5rem, 4vw, 1.875rem)',
                    lineHeight: '1.3'
                  }}
                >
                  비밀번호 찾기
                </h2>
              </div>

              <p 
                className="text-muted-foreground mb-5 sm:mb-6 leading-relaxed"
                style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
              >
                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </p>

              <form onSubmit={handlePasswordReset} className="space-y-4 sm:space-y-5">
                <div className="space-y-2">
                  <Label 
                    htmlFor="resetEmail"
                    style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}
                  >
                    이메일
                  </Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    disabled={isResetting}
                    className="h-11 sm:h-12 border-border focus:border-primary transition-colors"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  />
                </div>

                {resetStatus && (
                  <div
                    className={`flex items-start gap-3 p-3 sm:p-4 rounded-sm border transition-all ${
                      resetStatus.success
                        ? 'bg-primary/5 text-primary border-primary/20'
                        : 'bg-destructive/5 text-destructive border-destructive/20'
                    }`}
                  >
                    {resetStatus.success ? (
                      <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <span style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}>
                      {resetStatus.message}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full h-11 sm:h-12 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                  style={{ fontFamily: 'Inter', fontWeight: 500 }}
                >
                  {isResetting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    '재설정 링크 전송'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetStatus(null);
                  }}
                  className="w-full h-11 sm:h-12 border border-border rounded-sm hover:bg-muted/50 transition-colors"
                  disabled={isResetting}
                  style={{ fontFamily: 'Inter', fontWeight: 500 }}
                >
                  로그인으로 돌아가기
                </button>
              </form>
            </>
          )}
        </div>

        {/* 푸터 정보 */}
        <div className="text-center mt-6 sm:mt-8">
          <p 
            className="text-muted-foreground"
            style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 'clamp(0.625rem, 1.5vw, 0.75rem)' }}
          >
            © 2024 Festival Academy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
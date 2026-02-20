import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { ArrowUpRight, Eye, EyeOff, Lock, Loader2, Shield, AlertTriangle } from 'lucide-react';
import { SecurityUtils } from '@/utils/security';
import { adminAPI } from '@/utils/gas-api'; // ✅ 새로운 GAS API 클라이언트

interface LoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, isAdmin: boolean, name?: string) => void;
  onSignupClick: () => void;
}

export function LoginDialog({ isOpen, onClose, onLogin, onSignupClick }: LoginDialogProps) {
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

      // ✅ 새로운 GAS API 클라이언트 사용
      const result = await adminAPI.login(email, password);
      
      if (result.success) {
        // ✅ 로그인 성공 - Rate Limit 초기화
        SecurityUtils.clearRateLimit(`login:${email}`);
        SecurityUtils.logSecurityEvent('info', '로그인 성공', { email });

        // 서버에서 보낸 isAdmin 값 사용
        const isAdmin = result.isAdmin === true;
        
        // 🛡️ 5. XSS 방어 - 사용자 정보 이스케이프
        const userInfo = {
          memberNumber: SecurityUtils.escapeHtml(result.memberNumber || ''),
          name: SecurityUtils.escapeHtml(result.name || '사용자'),
          email: SecurityUtils.escapeHtml(result.email || email),
          memberGrade: SecurityUtils.escapeHtml(result.memberGrade || '일반'),
          isAdmin: isAdmin,
          festivalProgress: result.festivalProgress || 0,
          eventProgress: result.eventProgress || 0,
          performanceProgress: result.performanceProgress || 0
        };
        
        console.log('✅ 로그인 성공 - 사용자 정보:', userInfo);
        console.log('✅ 서버 응답 result.name:', result.name);
        
        // 로그인 성공
        if (rememberMe) {
          localStorage.setItem('userEmail', email);
          localStorage.setItem('userName', userInfo.name);
        }
        
        // 세션 저장
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        // 즉시 로그인 처리
        console.log('📤 onLogin 호출 - name:', userInfo.name);
        onLogin(email, isAdmin, userInfo.name);
        
        // UI 피드백
        setAuthStatus({
          success: true,
          message: `환영합니다, ${userInfo.name}님!`
        });
        
        // 폼 초기화 및 다이얼로그 닫기
        setTimeout(() => {
          setEmail('');
          setPassword('');
          setAuthStatus(null);
          onClose();
        }, 1000);
        
      } else {
        // ❌ 로그인 실패
        SecurityUtils.logSecurityEvent('warning', '로그인 실패', { email, reason: result.message });
        
        setAuthStatus({
          success: false,
          message: result.message || "로그인에 실패했습니다."
        });
      }

    } catch (error) {
      SecurityUtils.logSecurityEvent('error', '로그인 오류', { email, error });
      
      setAuthStatus({
        success: false,
        message: "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetStatus(null);

    try {
      // 🛡️ 1. 입력값 검증
      if (!SecurityUtils.validateEmail(resetEmail)) {
        setResetStatus({
          success: false,
          message: '올바른 이메일 형식이 아닙니다.'
        });
        setIsResetting(false);
        return;
      }

      // 🛡️ 2. SQL Injection 패턴 감지
      if (SecurityUtils.detectSqlInjection(resetEmail)) {
        SecurityUtils.logSecurityEvent('error', 'SQL Injection 시도 감지', { email: resetEmail });
        setResetStatus({
          success: false,
          message: '비정상적인 입력이 감지되었습니다.'
        });
        setIsResetting(false);
        return;
      }

      // ✅ 새로운 GAS API 클라이언트 사용
      // TODO: forgotPassword API 구현 필요
      // const result = await adminAPI.forgotPassword(resetEmail);
      
      // 임시: 아직 API 미구현
      const result = {
        success: false,
        message: "비밀번호 재설정 기능은 준비 중입니다. 관리자에게 문의해주세요."
      };
      
      if (result.success) {
        // ✅ 비밀번호 재설정 성공
        SecurityUtils.logSecurityEvent('info', '비밀번호 재설정 성공', { email: resetEmail });

        // UI 피드백
        setResetStatus({
          success: true,
          message: "비밀번호 재설정 링크가 이메일로 전송되었습니다."
        });
        
        // 폼 초기화 및 다이얼로그 닫기
        setTimeout(() => {
          setResetEmail('');
          setResetStatus(null);
          setShowForgotPassword(false);
        }, 1000);
        
      } else {
        // ❌ 비밀번호 재설정 실패
        SecurityUtils.logSecurityEvent('warning', '비밀번호 재설정 실패', { email: resetEmail, reason: result.message });
        
        setResetStatus({
          success: false,
          message: result.message || "비밀번호 재설정에 실패했습니다."
        });
      }

    } catch (error) {
      SecurityUtils.logSecurityEvent('error', '비밀번호 재설정 오류', { email: resetEmail, error });
      
      setResetStatus({
        success: false,
        message: "서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요."
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95%] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle 
              className="sm:text-3xl font-normal text-center mb-2"
              style={{
                fontSize: window.innerWidth < 1024 ? '24px' : undefined,
                WebkitTextSizeAdjust: 'none',
                textSizeAdjust: 'none'
              }}
            >
              로그인
            </DialogTitle>
            <DialogDescription 
              className="text-center sm:text-sm text-gray-600"
              style={{
                fontSize: window.innerWidth < 1024 ? '14px' : undefined,
                WebkitTextSizeAdjust: 'none',
                textSizeAdjust: 'none'
              }}
            >
              계정에 로그인하세요
            </DialogDescription>
          </DialogHeader>

          {authStatus && (
            <div className={`p-3 rounded-lg text-xs sm:text-sm text-center ${
              authStatus.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {authStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs sm:text-sm text-gray-700">
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 sm:h-12 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm text-gray-700">
                비밀번호
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 sm:h-12 pr-10 text-sm sm:text-base"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-4 h-4">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="!w-4 !h-4 !min-w-[16px] !min-h-[16px] !max-w-[16px] !max-h-[16px]"
                  />
                </div>
                <label 
                  htmlFor="remember-me" 
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer select-none"
                >
                  로그인 상태 유지
                </label>
              </div>

              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  setShowForgotPassword(true);
                }}
                className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors"
              >
                비밀번호 찾기
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#3e4781] text-white py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-tight hover:bg-[#2e3761] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin" strokeWidth={2.5} />
                  처리 중...
                </>
              ) : (
                <>
                  <Lock size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
                  로그인
                  <ArrowUpRight size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
                </>
              )}
            </button>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
              <Shield size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
              <p>보안 정보: 비밀번호는 암호화되어 안전하게 검증됩니다.</p>
            </div>
          </form>

          <div className="text-center text-xs sm:text-sm pt-2 border-t border-gray-200">
            <p className="text-gray-600">
              계정이 없으신가요?{" "}
              <button 
                type="button"
                className="text-[#3e4781] font-medium hover:underline transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  onSignupClick();
                }}
              >
                회원가입
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 비밀번호 찾기 모달 */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="max-w-[95%] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle 
              className="sm:text-3xl font-normal text-center mb-2"
              style={{
                fontSize: window.innerWidth < 1024 ? '24px' : undefined,
                WebkitTextSizeAdjust: 'none',
                textSizeAdjust: 'none'
              }}
            >
              비밀번호 찾기
            </DialogTitle>
            <DialogDescription 
              className="text-center sm:text-sm text-gray-600"
              style={{
                fontSize: window.innerWidth < 1024 ? '14px' : undefined,
                WebkitTextSizeAdjust: 'none',
                textSizeAdjust: 'none'
              }}
            >
              가입하신 이메일을 입력하면 비밀번호 재설정 링크를 보내드립니다
            </DialogDescription>
          </DialogHeader>

          {resetStatus && (
            <div className={`p-3 rounded-lg text-xs sm:text-sm text-center ${
              resetStatus.success 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {resetStatus.message}
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-xs sm:text-sm text-gray-700">
                이메일
              </Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="example@email.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="h-10 sm:h-12 text-sm sm:text-base"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                  setResetStatus(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-tight hover:bg-gray-300 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isResetting}
                className="flex-1 bg-[#3e4781] text-white py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-tight hover:bg-[#2e3761] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isResetting ? (
                  <>
                    <Loader2 size={14} className="sm:w-4 sm:h-4 animate-spin" strokeWidth={2.5} />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Lock size={14} className="sm:w-4 sm:h-4" strokeWidth={2.5} />
                    재설정 링크 전송
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
              <Shield size={10} className="sm:w-3 sm:h-3 flex-shrink-0" />
              <p>등록된 이메일로 비밀번호 재설정 링크가 발송됩니다.</p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Loader2, Shield, Eye, EyeOff, AlertCircle, CheckCircle, UserX, AlertTriangle } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { SecurityUtils } from '@/utils/security';

interface ProfilePageProps {
  userEmail: string;
  onLogout?: () => void;
}

export function ProfilePage({ userEmail, onLogout }: ProfilePageProps) {
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // 사용자 정보
  const [userInfo, setUserInfo] = useState({
    memberNumber: '',
    name: '',
    email: '',
    phone: '',
    memberGrade: '',
    joinDate: ''
  });

  // 비밀번호 변경
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 회원 탈퇴
  const [showDeleteSection, setShowDeleteSection] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);

  // 회원정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        const requestData = {
          action: 'getUserInfo',
          email: userEmail,
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
          setUserInfo({
            memberNumber: result.memberNumber || '',
            name: result.name || '',
            email: result.email || '',
            phone: result.phone || '',
            memberGrade: result.memberGrade || '',
            joinDate: result.joinDate || ''
          });
        } else {
          setStatusMessage({ type: 'error', message: '회원정보를 불러오는데 실패했습니다.' });
        }
      } catch (error) {
        console.error('회원정보 조회 오류:', error);
        setStatusMessage({ type: 'error', message: '서버 연결에 실패했습니다.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userEmail]);

  // 회원정보 수정
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      // 입력값 검증
      if (!userInfo.name.trim()) {
        setStatusMessage({ type: 'error', message: '이름을 입력해주세요.' });
        setIsSaving(false);
        return;
      }

      if (userInfo.phone && !/^[0-9-]+$/.test(userInfo.phone)) {
        setStatusMessage({ type: 'error', message: '올바른 전화번호 형식이 아닙니다.' });
        setIsSaving(false);
        return;
      }

      const requestData = {
        action: 'updateUserInfo',
        email: userEmail,
        name: userInfo.name,
        phone: userInfo.phone,
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
        setStatusMessage({ type: 'success', message: '회원정보가 성공적으로 수정되었습니다.' });
        
        // 세션 스토리지 업데이트
        const sessionUserInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
        sessionUserInfo.name = userInfo.name;
        sessionStorage.setItem('userInfo', JSON.stringify(sessionUserInfo));
        
        // localStorage 업데이트 (로그인 상태 유지 시)
        if (localStorage.getItem('userName')) {
          localStorage.setItem('userName', userInfo.name);
        }
      } else {
        setStatusMessage({ type: 'error', message: result.message || '회원정보 수정에 실패했습니다.' });
      }
    } catch (error) {
      console.error('회원정보 수정 오류:', error);
      setStatusMessage({ type: 'error', message: '서버 연결에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  // 비밀번호 변경
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      // 입력값 검증
      if (!currentPassword || !newPassword || !confirmPassword) {
        setStatusMessage({ type: 'error', message: '모든 비밀번호 필드를 입력해주세요.' });
        setIsSaving(false);
        return;
      }

      if (newPassword.length < 8) {
        setStatusMessage({ type: 'error', message: '새 비밀번호는 최소 8자 이상이어야 합니다.' });
        setIsSaving(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setStatusMessage({ type: 'error', message: '새 비밀번호가 일치하지 않습니다.' });
        setIsSaving(false);
        return;
      }

      if (currentPassword === newPassword) {
        setStatusMessage({ type: 'error', message: '현재 비밀번호와 새 비밀번호가 동일합니다.' });
        setIsSaving(false);
        return;
      }

      // SQL Injection 패턴 감지
      if (SecurityUtils.detectSqlInjection(currentPassword) || SecurityUtils.detectSqlInjection(newPassword)) {
        SecurityUtils.logSecurityEvent('error', 'SQL Injection 시도 감지', { email: userEmail });
        setStatusMessage({ type: 'error', message: '비정상적인 입력이 감지되었습니다.' });
        setIsSaving(false);
        return;
      }

      const requestData = {
        action: 'changePassword',
        email: userEmail,
        currentPassword: currentPassword,
        newPassword: newPassword,
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
        setStatusMessage({ type: 'success', message: '비밀번호가 성공적으로 변경되었습니다.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordSection(false);
      } else {
        setStatusMessage({ type: 'error', message: result.message || '비밀번호 변경에 실패했습니다.' });
      }
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      setStatusMessage({ type: 'error', message: '서버 연결에 실패했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      // 입력값 검증
      if (!deleteConfirmPassword || !deleteConfirmText) {
        setStatusMessage({ type: 'error', message: '모든 필드를 입력해주세요.' });
        setIsSaving(false);
        return;
      }

      if (deleteConfirmText !== '탈퇴') {
        setStatusMessage({ type: 'error', message: '확인 텍스트가 일치하지 않습니다. "탈퇴"를 정확히 입력해주세요.' });
        setIsSaving(false);
        return;
      }

      // SQL Injection 패턴 감지
      if (SecurityUtils.detectSqlInjection(deleteConfirmPassword)) {
        SecurityUtils.logSecurityEvent('error', 'SQL Injection 시도 감지', { email: userEmail });
        setStatusMessage({ type: 'error', message: '비정상적인 입력이 감지되었습니다.' });
        setIsSaving(false);
        return;
      }

      console.log('🔄 회원 탈퇴 요청 시작:', userEmail);

      const requestData = {
        action: 'deleteAccount',
        email: userEmail,
        password: deleteConfirmPassword,
        timestamp: Date.now()
      };

      // console.log('📤 요청 데이터:', { action: requestData.action, email: requestData.email });

      const response = await fetch(API_URL, {
        redirect: "follow",
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestData)
      });

      console.log('📥 서버 응답 상태:', response.status);

      const result = await response.json();
      
      console.log('📦 서버 응답 데이터:', result);
      
      if (result.success) {
        setStatusMessage({ type: 'success', message: '회원탈퇴가 성공적으로 처리되었습니다. 3초 후 로그아웃됩니다...' });
        
        // 3초 후 로그아웃 처리
        setTimeout(() => {
          console.log('🚪 로그아웃 처리 시작');
          sessionStorage.removeItem('userInfo');
          localStorage.removeItem('userName');
          localStorage.removeItem('userEmail');
          
          if (onLogout) {
            onLogout();
          }
        }, 3000);
      } else {
        console.error('❌ 탈퇴 실패:', result.message);
        setStatusMessage({ type: 'error', message: result.message || '회원탈퇴에 실패했습니다.' });
      }
    } catch (error) {
      console.error('❌ 회원탈퇴 오류:', error);
      setStatusMessage({ type: 'error', message: '서버 연결에 실패했습니다. 다시 시도해주세요.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
          <p 
            className="text-xl text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            회원정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-12">
          <h1 
            className="text-6xl text-foreground mb-5 font-light tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            회원정보 수정
          </h1>
          <p 
            className="text-muted-foreground text-xl"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            회원님의 정보를 관리하고 수정할 수 있습니다
          </p>
        </div>

        {/* 상태 메시지 */}
        {statusMessage && (
          <div 
            className={`mb-8 p-6 rounded-sm border flex items-center gap-4 ${
              statusMessage.type === 'success' 
                ? 'bg-primary/5 border-primary/20 text-foreground' 
                : 'bg-destructive/5 border-destructive/20 text-foreground'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0 text-primary" />
            ) : (
              <AlertCircle className="w-6 h-6 flex-shrink-0 text-destructive" />
            )}
            <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }} className="text-lg">
              {statusMessage.message}
            </p>
          </div>
        )}

        {/* 회원정보 카드 */}
        <div className="bg-card border border-border rounded-sm p-12 mb-8 shadow-sm">
          <div className="flex items-center gap-5 mb-10 pb-8 border-b border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 
                className="text-4xl text-foreground font-light tracking-tight mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                기본 정보
              </h2>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                회원번호: {userInfo.memberNumber}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-8">
            {/* 이름 */}
            <div className="space-y-3">
              <Label 
                htmlFor="name" 
                className="text-foreground text-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                이름 *
              </Label>
              <Input
                id="name"
                name="profile-name"
                type="text"
                autoComplete="name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                required
                className="h-14 border-border rounded-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* 이메일 (읽기 전용) */}
            <div className="space-y-3">
              <Label 
                htmlFor="email" 
                className="text-foreground text-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                이메일
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={userInfo.email}
                  readOnly
                  className="h-14 pl-14 bg-muted text-muted-foreground border-border cursor-not-allowed rounded-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <p 
                className="text-sm text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                이메일은 변경할 수 없습니다
              </p>
            </div>

            {/* 전화번호 */}
            <div className="space-y-3">
              <Label 
                htmlFor="phone" 
                className="text-foreground text-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                전화번호
              </Label>
              <Input
                id="phone"
                type="tel"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                placeholder="010-1234-5678"
                className="h-14 bg-background text-foreground border-border rounded-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* 회원등급 & 가입일 (읽기 전용) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label 
                  htmlFor="memberGrade" 
                  className="text-foreground text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  회원등급
                </Label>
                <Input
                  id="memberGrade"
                  type="text"
                  value={userInfo.memberGrade}
                  readOnly
                  className="h-14 bg-muted text-muted-foreground border-border cursor-not-allowed rounded-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div className="space-y-3">
                <Label 
                  htmlFor="joinDate" 
                  className="text-foreground text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  가입일
                </Label>
                <Input
                  id="joinDate"
                  type="text"
                  value={userInfo.joinDate}
                  readOnly
                  className="h-14 bg-muted text-muted-foreground border-border cursor-not-allowed rounded-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* 저장 버튼 */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary text-primary-foreground h-16 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-lg"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  회원정보 저장
                </>
              )}
            </button>
          </form>
        </div>

        {/* 비밀번호 변경 카드 */}
        <div className="bg-card border border-border rounded-sm p-12 shadow-sm">
          <div className="flex items-center gap-5 mb-10 pb-8 border-b border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 
                className="text-4xl text-foreground font-light tracking-tight mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                비밀번호 변경
              </h2>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                보안을 위해 주기적으로 비밀번호를 변경해주세요
              </p>
            </div>
          </div>

          {!showPasswordSection ? (
            <button
              onClick={() => setShowPasswordSection(true)}
              className="w-full bg-muted text-foreground h-16 rounded-sm hover:bg-muted/80 transition-colors flex items-center justify-center gap-3 text-lg"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              <Lock className="w-6 h-6" />
              비밀번호 변경하기
            </button>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-8">
              {/* 현재 비밀번호 */}
              <div className="space-y-3">
                <Label 
                  htmlFor="currentPassword" 
                  className="text-foreground text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  현재 비밀번호 *
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="현재 비밀번호를 입력하세요"
                    className="h-14 pr-14 bg-background text-foreground border-border rounded-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 */}
              <div className="space-y-3">
                <Label 
                  htmlFor="newPassword" 
                  className="text-foreground text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  새 비밀번호 *
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="새 비밀번호 (최소 8자)"
                    className="h-14 pr-14 bg-background text-foreground border-border rounded-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* 새 비밀번호 확인 */}
              <div className="space-y-3">
                <Label 
                  htmlFor="confirmPassword" 
                  className="text-foreground text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  새 비밀번호 확인 *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="새 비밀번호를 다시 입력하세요"
                    className="h-14 pr-14 bg-background text-foreground border-border rounded-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* 보안 안내 */}
              <div className="flex items-start gap-4 bg-muted/30 p-6 rounded-sm border border-border">
                <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p 
                    className="text-foreground"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    안전한 비밀번호를 사용하세요
                  </p>
                  <ul 
                    className="text-sm text-muted-foreground space-y-1.5"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    <li>• 최소 8자 이상</li>
                    <li>• 영문, 숫자, 특수문자 조합 권장</li>
                    <li>• 다른 사이트와 동일한 비밀번호 사용 금지</li>
                  </ul>
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordSection(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setStatusMessage(null);
                  }}
                  className="flex-1 bg-muted text-foreground h-16 rounded-sm hover:bg-muted/80 transition-colors text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-primary text-primary-foreground h-16 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      변경 중...
                    </>
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      비밀번호 변경
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 회원 탈퇴 카드 */}
        <div className="bg-card border border-border rounded-sm p-12 shadow-sm">
          <div className="flex items-center gap-5 mb-10 pb-8 border-b border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserX className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 
                className="text-4xl text-foreground font-light tracking-tight mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                회원 탈퇴
              </h2>
              <p 
                className="text-muted-foreground"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                회원 탈퇴를 진행하시면 모든 정보가 삭제됩니다
              </p>
            </div>
          </div>

          {!showDeleteSection ? (
            <button
              onClick={() => setShowDeleteSection(true)}
              className="w-full bg-destructive/90 text-white h-16 rounded-sm hover:bg-destructive transition-colors flex items-center justify-center gap-3 text-lg"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              <UserX className="w-6 h-6" />
              회원 탈퇴하기
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-8">
              {/* 비밀번호 확인 */}
              <div className="space-y-3">
                <Label 
                  htmlFor="deleteConfirmPassword" 
                  className="text-foreground text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  비밀번호 확인 *
                </Label>
                <div className="relative">
                  <Input
                    id="deleteConfirmPassword"
                    type={showDeletePassword ? "text" : "password"}
                    value={deleteConfirmPassword}
                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                    required
                    placeholder="비밀번호를 입력하세요"
                    className="h-14 pr-14 bg-background text-foreground border-border rounded-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                  >
                    {showDeletePassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* 확인 텍스트 */}
              <div className="space-y-3">
                <Label 
                  htmlFor="deleteConfirmText" 
                  className="text-foreground text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  확인 텍스트 *
                </Label>
                <Input
                  id="deleteConfirmText"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  required
                  placeholder="탈퇴"
                  className="h-14 bg-background text-foreground border-border rounded-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>

              {/* 경고 메시지 */}
              <div className="flex items-start gap-4 bg-red-500/30 p-6 rounded-sm border border-border">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <p 
                    className="text-foreground"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                  >
                    주의: 이 작업은 되돌릴 수 없습니다
                  </p>
                  <ul 
                    className="text-sm text-muted-foreground space-y-1.5"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
                  >
                    <li>• 모든 정보가 삭제됩니다</li>
                    <li>• 다시 가입하려면 새로운 계정을 생성해야 합니다</li>
                  </ul>
                </div>
              </div>

              {/* 버튼 그룹 */}
              <div className="flex gap-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteSection(false);
                    setDeleteConfirmPassword('');
                    setDeleteConfirmText('');
                    setStatusMessage(null);
                  }}
                  className="flex-1 bg-muted text-foreground h-16 rounded-sm hover:bg-muted/80 transition-colors text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-destructive text-white h-16 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-lg"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      탈퇴 중...
                    </>
                  ) : (
                    <>
                      <UserX className="w-6 h-6" />
                      회원 탈퇴
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Eye, EyeOff, Lock, Mail, User, Check, Phone, MapPin, Calendar, Loader2, ArrowLeft, Home } from 'lucide-react';
import { SecurityUtils } from '@/utils/security';

interface SignupPageProps {
  onSignupSuccess: () => void;
  onSignupSuccessWithLogin: (email: string, isAdmin: boolean, name?: string) => void;
}

export function SignupPage({ onSignupSuccess, onSignupSuccessWithLogin }: SignupPageProps) {
  const navigate = useNavigate();
  const API_URL = "https://script.google.com/macros/s/AKfycby8kImnIvATKQy_zutkxnanft9xToe-GTw_uJUzIy4ZAnXK3R9OH-3q0HBWQ2AYRXsdGQ/exec";
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    address: "",
    addressDetail: "",
    postalCode: "",
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const years = Array.from({ length: 61 }, (_, i) => 2010 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Daum Postcode API 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, password: value });
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setFormData({ ...formData, phone: formatted });
  };

  // 주소 검색 기능
  const handleAddressSearch = () => {
    // @ts-ignore
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    // @ts-ignore
    new window.daum.Postcode({
      oncomplete: function(data: any) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
        }

        setFormData((prev) => ({
          ...prev,
          postalCode: data.zonecode,
          address: fullAddress
        }));

        setTimeout(() => {
          document.getElementById('address-detail')?.focus();
        }, 100);
      }
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setAuthStatus({
        success: false,
        message: "비밀번호가 일치하지 않습니다."
      });
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setAuthStatus({
        success: false,
        message: "필수 약관에 동의해주세요."
      });
      return;
    }

    if (passwordStrength < 3) {
      setAuthStatus({
        success: false,
        message: "더 강력한 비밀번호를 설정해주세요."
      });
      return;
    }

    if (!SecurityUtils.validateEmail(formData.email)) {
      setAuthStatus({
        success: false,
        message: "올바른 이메일 형식이 아닙니다."
      });
      return;
    }

    if (SecurityUtils.detectSqlInjection(formData.email) || 
        SecurityUtils.detectSqlInjection(formData.name) ||
        SecurityUtils.detectSqlInjection(formData.password)) {
      SecurityUtils.logSecurityEvent('error', 'SQL Injection 시도 감지 (회원가입)', { email: formData.email });
      setAuthStatus({
        success: false,
        message: "비정상적인 입력이 감지되었습니다."
      });
      return;
    }

    setIsLoading(true);
    setAuthStatus(null);

    try {
      const birthDate = `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`;
      
      const requestData = {
        action: 'signup',
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        birthDate: birthDate,
        address: formData.address,
        addressDetail: formData.addressDetail,
        postalCode: formData.postalCode,
        agreeMarketing: formData.agreeMarketing,
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
        SecurityUtils.logSecurityEvent('info', '회원가입 성공', { email: formData.email });
        setAuthStatus({
          success: true,
          message: result.message || "회원가입이 완료되었습니다!"
        });

        const userInfo = {
          memberNumber: SecurityUtils.escapeHtml(result.memberNumber || ''),
          name: SecurityUtils.escapeHtml(result.name || formData.name),
          email: SecurityUtils.escapeHtml(result.email || formData.email),
          memberGrade: SecurityUtils.escapeHtml(result.memberGrade || '일반회원'),
        };

        sessionStorage.setItem('authUser', JSON.stringify(userInfo));
        sessionStorage.setItem('authToken', SecurityUtils.generateCsrfToken()); // ✅ generateToken → generateCsrfToken
        sessionStorage.setItem('authExpiry', String(Date.now() + 24 * 60 * 60 * 1000));

        const isAdmin = result.memberGrade === '관리자';

        setTimeout(() => {
          onSignupSuccessWithLogin(formData.email, isAdmin, userInfo.name);
          navigate('/');
        }, 1500);
      } else {
        SecurityUtils.logSecurityEvent('warning', '회원가입 실패', { email: formData.email, reason: result.message });
        setAuthStatus({
          success: false,
          message: result.message || "회원가입에 실패했습니다."
        });
        setIsLoading(false);
      }
    } catch (error) {
      SecurityUtils.logSecurityEvent('error', '회원가입 중 오류 발생', { email: formData.email, error });
      setAuthStatus({
        success: false,
        message: "서버와의 통신 중 오류가 발생했습니다."
      });
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return '약함';
    if (passwordStrength <= 3) return '보통';
    return '강함';
  };

  return (
    <div className="min-h-screen bg-background px-6 py-24 pb-32 relative">
      {/* 왼쪽 상단 홈 버튼 */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}
      >
        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>홈으로</span>
      </button>

      <div className="max-w-3xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center gap-6 mb-12">
          <button
            onClick={() => navigate('/')}
            className="p-3 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 
              className="text-foreground mb-1"
              style={{ 
                fontFamily: 'Playfair Display', 
                fontWeight: 500,
                fontSize: '2.25rem',
                lineHeight: '1.2'
              }}
            >
              회원가입
            </h1>
            <p 
              className="text-muted-foreground"
              style={{ 
                fontFamily: 'Inter', 
                fontWeight: 300,
                fontSize: '0.875rem',
                letterSpacing: '0.02em'
              }}
            >
              Festival Academy에 오신 것을 환영합니다
            </p>
          </div>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-card border border-border rounded-sm shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 기본 정보 */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <User className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 
                  className="text-card-foreground"
                  style={{ 
                    fontFamily: 'Playfair Display', 
                    fontWeight: 500,
                    fontSize: '1.5rem',
                    lineHeight: '1.3'
                  }}
                >
                  기본 정보
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label 
                    htmlFor="name"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    이름 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 border-border focus:border-primary transition-colors"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  />
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="email"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    이메일 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                    className="h-12 border-border focus:border-primary transition-colors"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="phone"
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                >
                  전화번호 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-12 border-border focus:border-primary transition-colors"
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  maxLength={13}
                />
              </div>
            </div>

            {/* 생년월일 */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 
                  className="text-card-foreground"
                  style={{ 
                    fontFamily: 'Playfair Display', 
                    fontWeight: 500,
                    fontSize: '1.5rem',
                    lineHeight: '1.3'
                  }}
                >
                  생년월일
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="birthYear"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    년도
                  </Label>
                  <select
                    id="birthYear"
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                    required
                    disabled={isLoading}
                    className="w-full h-12 px-4 rounded-md border border-border bg-card text-card-foreground focus:border-primary transition-colors [&>option]:bg-card [&>option]:text-card-foreground"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    <option value="">선택</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}년</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="birthMonth"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    월
                  </Label>
                  <select
                    id="birthMonth"
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                    required
                    disabled={isLoading}
                    className="w-full h-12 px-4 rounded-md border border-border bg-card text-card-foreground focus:border-primary transition-colors [&>option]:bg-card [&>option]:text-card-foreground"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    <option value="">선택</option>
                    {months.map((month) => (
                      <option key={month} value={month}>{month}월</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="birthDay"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    일
                  </Label>
                  <select
                    id="birthDay"
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                    required
                    disabled={isLoading}
                    className="w-full h-12 px-4 rounded-md border border-border bg-card text-card-foreground focus:border-primary transition-colors [&>option]:bg-card [&>option]:text-card-foreground"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    <option value="">선택</option>
                    {days.map((day) => (
                      <option key={day} value={day}>{day}일</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 주소 */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 
                  className="text-card-foreground"
                  style={{ 
                    fontFamily: 'Playfair Display', 
                    fontWeight: 500,
                    fontSize: '1.5rem',
                    lineHeight: '1.3'
                  }}
                >
                  주소
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Input
                    type="text"
                    placeholder="우편번호"
                    value={formData.postalCode}
                    readOnly
                    disabled={isLoading}
                    className="h-12 flex-1 border-border"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddressSearch}
                    disabled={isLoading}
                    className="px-6 h-12 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all whitespace-nowrap shadow-sm"
                    style={{ fontFamily: 'Inter', fontWeight: 500 }}
                  >
                    주소 검색
                  </button>
                </div>

                <Input
                  type="text"
                  placeholder="주소"
                  value={formData.address}
                  readOnly
                  disabled={isLoading}
                  className="h-12 border-border"
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                />

                <Input
                  id="address-detail"
                  type="text"
                  placeholder="상세 주소"
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  disabled={isLoading}
                  className="h-12 border-border focus:border-primary transition-colors"
                  style={{ fontFamily: 'Inter', fontWeight: 300 }}
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 
                  className="text-card-foreground"
                  style={{ 
                    fontFamily: 'Playfair Display', 
                    fontWeight: 500,
                    fontSize: '1.5rem',
                    lineHeight: '1.3'
                  }}
                >
                  비밀번호
                </h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label 
                    htmlFor="password"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    비밀번호 <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="8자 이상, 영문/숫자/특수문자 포함"
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-12 pr-12 border-border focus:border-primary transition-colors"
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
                  
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength ? getPasswordStrengthColor() : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                      <p 
                        className="text-muted-foreground"
                        style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.75rem' }}
                      >
                        비밀번호 강도: {getPasswordStrengthText()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label 
                    htmlFor="confirmPassword"
                    style={{ fontFamily: 'Inter', fontWeight: 300 }}
                  >
                    비밀번호 확인 <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="비밀번호를 다시 입력하세요"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      disabled={isLoading}
                      className="h-12 pr-12 border-border focus:border-primary transition-colors"
                      style={{ fontFamily: 'Inter', fontWeight: 300 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {formData.confirmPassword && (
                    <div className="flex items-center gap-1.5">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <Check size={14} className="text-primary flex-shrink-0" />
                          <span 
                            className="text-primary"
                            style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.75rem' }}
                          >
                            비밀번호가 일치합니다
                          </span>
                        </>
                      ) : (
                        <span 
                          className="text-destructive"
                          style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.75rem' }}
                        >
                          비밀번호가 일치하지 않습니다
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="space-y-6">
              <h3 
                className="text-card-foreground pb-4 border-b border-border"
                style={{ 
                  fontFamily: 'Playfair Display', 
                  fontWeight: 500,
                  fontSize: '1.5rem',
                  lineHeight: '1.3'
                }}
              >
                약관 동의
              </h3>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    disabled={isLoading}
                    className="w-5 h-5 min-w-5 min-h-5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="agreeTerms" 
                      className="cursor-pointer leading-relaxed"
                      style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.9375rem' }}
                    >
                      <span className="text-destructive">*</span> 이용약관에 동의합니다{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/terms')}
                        className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                        style={{ fontFamily: 'Inter', fontWeight: 400 }}
                      >
                        (보기)
                      </button>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Checkbox
                    id="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreePrivacy: checked as boolean })}
                    disabled={isLoading}
                    className="w-5 h-5 min-w-5 min-h-5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="agreePrivacy" 
                      className="cursor-pointer leading-relaxed"
                      style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.9375rem' }}
                    >
                      <span className="text-destructive">*</span> 개인정보 처리방침에 동의합니다{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/privacy')}
                        className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
                        style={{ fontFamily: 'Inter', fontWeight: 400 }}
                      >
                        (보기)
                      </button>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Checkbox
                    id="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeMarketing: checked as boolean })}
                    disabled={isLoading}
                    className="w-5 h-5 min-w-5 min-h-5 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor="agreeMarketing" 
                      className="cursor-pointer leading-relaxed"
                      style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.9375rem' }}
                    >
                      마케팅 정보 수신에 동의합니다 (선택)
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* 상태 메시지 */}
            {authStatus && (
              <div
                className={`flex items-start gap-3 p-4 rounded-lg border transition-all ${
                  authStatus.success
                    ? 'bg-primary/5 text-primary border-primary/20'
                    : 'bg-destructive/5 text-destructive border-destructive/20'
                }`}
              >
                {authStatus.success ? (
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <span style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}>
                  {authStatus.message}
                </span>
              </div>
            )}

            {/* 제출 버튼 */}
            <div className="space-y-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '1rem' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    회원가입 처리 중...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    회원가입
                  </>
                )}
              </button>

              <div className="text-center">
                <span 
                  className="text-muted-foreground"
                  style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: '0.875rem' }}
                >
                  이미 계정이 있으신가요?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-primary hover:text-primary/80 transition-colors"
                    style={{ fontFamily: 'Inter', fontWeight: 500 }}
                  >
                    로그인
                  </button>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
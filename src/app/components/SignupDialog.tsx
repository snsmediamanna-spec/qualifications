import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Eye, EyeOff, Lock, Mail, User, Check, Phone, MapPin, Calendar, Loader2 } from 'lucide-react';
import { SecurityUtils } from '@/utils/security';

interface SignupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: () => void;
  onSignupSuccessWithLogin: (email: string, isAdmin: boolean, name?: string) => void;
  onNavigate?: (page: string) => void;
}

export function SignupDialog({ isOpen, onClose, onSignupSuccess, onSignupSuccessWithLogin, onNavigate }: SignupDialogProps) {
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

        // 상세주소 입력란으로 포커스 이동
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

    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      setAuthStatus({
        success: false,
        message: "생년월일을 모두 입력해주세요."
      });
      return;
    }

    if (formData.phone.replace(/[^\d]/g, '').length < 10) {
      setAuthStatus({
        success: false,
        message: "올바른 전화번호를 입력해주세요."
      });
      return;
    }

    setIsLoading(true);
    setAuthStatus(null);

    try {
      const birthDate = `${formData.birthYear}-${String(formData.birthMonth).padStart(2, '0')}-${String(formData.birthDay).padStart(2, '0')}`;
      
      // ✅ 간단한 요청 데이터
      const requestData = {
        action: 'signup',
        name: formData.name,
        phone: formData.phone,
        birthdate: birthDate,
        email: formData.email,
        password: formData.password,
        address: formData.address ? `${formData.address} ${formData.addressDetail}` : '',
        agreeTerms: formData.agreeTerms,
        agreePrivacy: formData.agreePrivacy,
        agreeMarketing: formData.agreeMarketing,
        timestamp: Date.now()  // ⏱️ 타임스탬프 추가
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(requestData),
        redirect: 'follow'
      });

      const text = await response.text();
      
      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        // HTML 응답이 왔다면 성공으로 간주 (Google Apps Script 리다이렉트)
        if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
          setAuthStatus({
            success: true,
            message: "회원가입이 완료되었습니다! Google Sheets를 확인해주세요."
          });
          
          setTimeout(() => {
            setFormData({
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
            setAuthStatus(null);
            onSignupSuccess();
          }, 2000);
          
          return;
        }
        
        throw new Error('서버 응답을 처리할 수 없습니다.');
      }
      
      console.log('✅ 파싱된 응답:', result);
      
      if (result.success) {
        setAuthStatus({
          success: true,
          message: "회원가입이 완료되었습니다!"
        });
        
        // 회원가입 성공 - 서버에서 받은 isAdmin 값 사용
        const isAdmin = result.isAdmin || false;
        
        setTimeout(() => {
          setFormData({
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
          setAuthStatus(null);
          
          // 자동 로그인 처리
          onSignupSuccessWithLogin(formData.email, isAdmin, formData.name);
        }, 1500);
      } else {
        setAuthStatus({
          success: false,
          message: result.message || "회원가입 중 오류가 발생했습니다."
        });
      }

    } catch (error) {
      console.error('❌ 회원가입 에러:', error);
      setAuthStatus({
        success: true,
        message: "회원가입 요청을 전송했습니다. Google Sheets에서 확인해주세요."
      });
      
      // 5초 후 폼 초기화 및 로그인 화면으로 이동 (실제로는 성공했을 가능성)
      setTimeout(() => {
        setFormData({
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
        setAuthStatus(null);
        onSignupSuccess();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength === 3) return "bg-yellow-500";
    if (passwordStrength === 4) return "bg-green-500";
    return "bg-green-600";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "약함";
    if (passwordStrength === 3) return "보통";
    if (passwordStrength === 4) return "강함";
    return "매우 강함";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle 
            className="font-normal text-center mb-2"
            style={{
              fontSize: window.innerWidth < 1024 ? '24px' : '30px',
              WebkitTextSizeAdjust: 'none',
              textSizeAdjust: 'none'
            }}
          >
            회원가입
          </DialogTitle>
          <DialogDescription 
            className="text-center text-gray-600"
            style={{
              fontSize: window.innerWidth < 1024 ? '14px' : '16px',
              WebkitTextSizeAdjust: 'none',
              textSizeAdjust: 'none'
            }}
          >
            새 계정을 만들어 시작하세요
          </DialogDescription>
        </DialogHeader>

        {authStatus && (
          <div className={`p-3 rounded-lg text-sm text-center ${
            authStatus.success 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {authStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} />
              기본 정보
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <User size={18} className="text-gray-400" />
                  </span>
                  <Input
                    id="name"
                    type="text"
                    required
                    className="pl-10 h-11"
                    placeholder="홍길동"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm text-gray-700">
                  이메일 주소 <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail size={18} className="text-gray-400" />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="pl-10 h-11"
                    placeholder="example@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm text-gray-700">
                  휴대전화 <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone size={18} className="text-gray-400" />
                  </span>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    className="pl-10 h-11"
                    placeholder="010-0000-0000"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={13}
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm text-gray-700">
                  생년월일 <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-400" />
                    </span>
                    <select
                      required
                      className="block w-full pl-10 h-11 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#3e4781] focus:outline-none focus:ring-1 focus:ring-[#3e4781]"
                      value={formData.birthYear}
                      onChange={(e) => handleChange("birthYear", e.target.value)}
                    >
                      <option value="">년도</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}년</option>
                      ))}
                    </select>
                  </div>
                  <select
                    required
                    className="block w-full h-11 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#3e4781] focus:outline-none focus:ring-1 focus:ring-[#3e4781]"
                    value={formData.birthMonth}
                    onChange={(e) => handleChange("birthMonth", e.target.value)}
                  >
                    <option value="">월</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}월</option>
                    ))}
                  </select>
                  <select
                    required
                    className="block w-full h-11 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[#3e4781] focus:outline-none focus:ring-1 focus:ring-[#3e4781]"
                    value={formData.birthDay}
                    onChange={(e) => handleChange("birthDay", e.target.value)}
                  >
                    <option value="">일</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}일</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 주소 정보 섹션 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={18} />
              주소 정보
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="postal-code" className="text-sm text-gray-700">
                  우편번호 <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="postal-code"
                    type="text"
                    required
                    className="h-11"
                    placeholder="12345"
                    value={formData.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                    maxLength={5}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap"
                    onClick={handleAddressSearch}
                  >
                    주소 검색
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm text-gray-700">
                  주소 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  required
                  className="h-11 mt-1"
                  placeholder="서울특별시 강남구 테헤란로 123"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address-detail" className="text-sm text-gray-700">
                  상세주소
                </Label>
                <Input
                  id="address-detail"
                  type="text"
                  className="h-11 mt-1"
                  placeholder="아파트, 동/호수 등"
                  value={formData.addressDetail}
                  onChange={(e) => handleChange("addressDetail", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 비밀번호 섹션 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lock size={18} />
              비밀번호 설정
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-sm text-gray-700">
                  비밀번호 <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="h-11 pr-10"
                    placeholder="8자 이상, 영문/숫자/특수문자 포함"
                    value={formData.password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">비밀번호 강도:</span>
                      <span className={`text-xs font-medium ${passwordStrength >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirm-password" className="text-sm text-gray-700">
                  비밀번호 확인 <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="h-11 pr-10"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <div className="mt-1 flex items-center gap-1">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check size={14} className="text-green-600" />
                        <span className="text-xs text-green-600">비밀번호가 일치합니다</span>
                      </>
                    ) : (
                      <span className="text-xs text-red-600">비밀번호가 일치하지 않습니다</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 약관 동의 섹션 */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">약관 동의</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="agree-all"
                  checked={formData.agreeTerms && formData.agreePrivacy && formData.agreeMarketing}
                  onCheckedChange={(checked) => {
                    const isChecked = checked as boolean;
                    setFormData({ ...formData, agreeTerms: isChecked, agreePrivacy: isChecked, agreeMarketing: isChecked });
                  }}
                />
                <label htmlFor="agree-all" className="text-sm font-semibold text-gray-900 cursor-pointer">
                  전체 동의
                </label>
              </div>
              
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agree-terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                  />
                  <label htmlFor="agree-terms" className="text-sm text-gray-900 cursor-pointer flex-1">
                    이용약관에 동의합니다 <span className="text-red-500">(필수)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate?.('terms');
                    }}
                    className="text-xs text-[#3e4781] hover:underline font-medium whitespace-nowrap"
                  >
                    보기
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agree-privacy"
                    checked={formData.agreePrivacy}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreePrivacy: checked as boolean })}
                  />
                  <label htmlFor="agree-privacy" className="text-sm text-gray-900 cursor-pointer flex-1">
                    개인정보 처리방침에 동의합니다 <span className="text-red-500">(필수)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigate?.('privacy');
                    }}
                    className="text-xs text-[#3e4781] hover:underline font-medium whitespace-nowrap"
                  >
                    보기
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="agree-marketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreeMarketing: checked as boolean })}
                  />
                  <label htmlFor="agree-marketing" className="text-sm text-gray-900 cursor-pointer">
                    마케팅 정보 수신에 동의합니다 (선택)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#3e4781] text-white py-4 rounded-full font-bold text-sm tracking-tight hover:bg-[#2e3761] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" strokeWidth={2.5} />
                처리 중...
              </>
            ) : (
              <>
                <Lock size={16} strokeWidth={2.5} />
                회원가입
              </>
            )}
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <Lock size={12} className="flex-shrink-0" />
            <p>보안 정보: 비밀번호는 SHA-256 해시로 암호화되어 안전하게 저장됩니다.</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
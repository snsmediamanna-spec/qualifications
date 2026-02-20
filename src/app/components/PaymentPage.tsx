import { useState } from 'react';
import { CreditCard, ShieldCheck, AlertCircle, Check, ChevronLeft } from 'lucide-react';

interface PaymentPageProps {
  courseId?: number;
  onBack: () => void;
}

export function PaymentPage({ courseId, onBack }: PaymentPageProps) {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);

  // 코스 정보 (실제로는 courseId로 데이터를 가져와야 함)
  const courseInfo = {
    title: '축제기획사 자격증 과정',
    duration: '8주',
    price: 350000,
    discountPrice: 199000
  };

  const handlePayment = () => {
    if (!agreeTerms || !agreeRefund) {
      alert('필수 약관에 동의해주세요.');
      return;
    }
    alert('결제가 완료되었습니다! 나의강의실에서 수강하실 수 있습니다.');
    onBack();
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* 헤더 */}
      <section className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-5 py-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="font-semibold">뒤로가기</span>
          </button>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-5 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">수강 신청 결제</h1>
        <p className="text-gray-600 mb-8">안전하고 편리한 결제 시스템을 제공합니다</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 결제 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 수강자 정보 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">수강자 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">이름</label>
                  <input
                    type="text"
                    name="payment-name"
                    id="payment-name"
                    autoComplete="name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">연락처</label>
                  <input
                    type="tel"
                    name="payment-phone"
                    id="payment-phone"
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="010-1234-5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">이메일</label>
                  <input
                    type="email"
                    name="payment-email"
                    id="payment-email"
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
            </div>

            {/* 결제 수단 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">결제 수단</h2>
              <div className="space-y-3">
                {[
                  { id: 'card', label: '신용/체크카드', icon: '💳' },
                  { id: 'trans', label: '실시간 계좌이체', icon: '🏦' },
                  { id: 'vbank', label: '무통장 입금', icon: '💰' },
                  { id: 'phone', label: '휴대폰 결제', icon: '📱' }
                ].map((payment) => (
                  <button
                    key={payment.id}
                    onClick={() => setSelectedPayment(payment.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      selectedPayment === payment.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{payment.icon}</span>
                    <span className="font-semibold text-gray-900">{payment.label}</span>
                    {selectedPayment === payment.id && (
                      <Check className="ml-auto text-blue-600" size={20} strokeWidth={3} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 약관 동의 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">약관 동의</h2>
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-900">
                      [필수] 이용약관 및 개인정보 처리방침 동의
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      서비스 이용을 위한 필수 약관입니다.
                    </p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeRefund}
                    onChange={(e) => setAgreeRefund(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-gray-900">
                      [필수] 환불 규정 안내 동의
                    </span>
                    <p className="text-xs text-gray-600 mt-1">
                      수강 시작 후 7일 이내 환불 가능합니다.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 오른쪽: 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">주문 요약</h2>
              
              {/* 코스 정보 */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold mb-2">
                  문화예술
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{courseInfo.title}</h3>
                <p className="text-sm text-gray-600">교육기간: {courseInfo.duration}</p>
              </div>

              {/* 가격 정보 */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">정가</span>
                  <span className="text-gray-400 line-through">
                    {courseInfo.price.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">할인금액</span>
                  <span className="text-red-600 font-semibold">
                    -{(courseInfo.price - courseInfo.discountPrice).toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* 총 결제금액 */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">총 결제금액</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {courseInfo.discountPrice.toLocaleString()}원
                    </div>
                    <div className="text-xs text-gray-500">
                      ({Math.round((courseInfo.price - courseInfo.discountPrice) / courseInfo.price * 100)}% 할인)
                    </div>
                  </div>
                </div>
              </div>

              {/* 결제 버튼 */}
              <button
                onClick={handlePayment}
                disabled={!agreeTerms || !agreeRefund}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                  agreeTerms && agreeRefund
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {courseInfo.discountPrice.toLocaleString()}원 결제하기
              </button>

              {/* 안전 결제 안내 */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck size={16} className="text-green-600" />
                  <span>안전한 결제를 위해 SSL 암호화를 사용합니다</span>
                </div>
              </div>

              {/* 환불 안내 */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                  <div className="text-xs text-gray-700">
                    <p className="font-semibold mb-1">환불 안내</p>
                    <p>• 수강 시작 전: 100% 환불</p>
                    <p>• 수강 시작 후 7일 이내: 부분 환불</p>
                    <p>• 수강 진도 50% 이상: 환불 불가</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
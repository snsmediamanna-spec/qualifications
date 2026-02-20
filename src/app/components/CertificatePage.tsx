import { useState } from 'react';
import { Search, FileCheck, Calendar, User, Mail, Phone, Award } from 'lucide-react';

export function CertificatePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
    studentId: '',
    completionDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('자격증 발급신청이 완료되었습니다. 처리 현황은 나의강의실에서 확인하실 수 있습니다.');
  };

  const certificates = [
    { name: '생활지원사', category: '복지', ministry: '보건복지부', period: '4주' },
    { name: '병원코디네이터', category: '병원', ministry: '보건복지부', period: '4주' },
    { name: '심리상담사', category: '심리', ministry: '보건복지부', period: '6주' },
    { name: '간병사', category: '복지', ministry: '보건복지부', period: '3주' },
    { name: '반려동물관리사', category: '동물', ministry: '농림축산식품부', period: '5주' },
    { name: '운동처방사', category: '체육', ministry: '문화체육관광부', period: '6주' }
  ];

  return (
    <div className="w-full">
      {/* 페이지 헤더 */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">자격증 발급신청</h1>
          <p className="text-xl text-blue-100">교육 수료 후 자격증 발급을 신청하세요</p>
        </div>
      </section>

      {/* 발급 절차 안내 */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-12">자격증 발급 절차</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: '📚', title: '교육 수료', desc: '온라인 강의 100% 수강' },
              { step: '2', icon: '✍️', title: '시험 응시', desc: '최종 평가 시험 합격' },
              { step: '3', icon: '📝', title: '발급 신청', desc: '자격증 발급 신청서 제출' },
              { step: '4', icon: '🎓', title: '자격증 수령', desc: '등기우편 발송 (3~5일)' }
            ].map((item) => (
              <div key={item.step} className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-blue-600 font-bold text-lg mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 발급 신청 양식 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[800px] mx-auto px-5">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileCheck className="text-blue-600" size={28} />
              자격증 발급 신청서
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  성명
                </label>
                <input
                  type="text"
                  name="certificate-name"
                  id="certificate-name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="홍길동"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  연락처
                </label>
                <input
                  type="tel"
                  name="certificate-phone"
                  id="certificate-phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="010-1234-5678"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={16} className="inline mr-1" />
                  이메일
                </label>
                <input
                  type="email"
                  name="certificate-email"
                  id="certificate-email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Award size={16} className="inline mr-1" />
                  자격증 종류
                </label>
                <select
                  name="certificate-course"
                  id="certificate-course"
                  autoComplete="off"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">선택하세요</option>
                  {certificates.map((cert, idx) => (
                    <option key={idx} value={cert.name}>{cert.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  수강생 번호
                </label>
                <input
                  type="text"
                  name="certificate-student-id"
                  id="certificate-student-id"
                  autoComplete="off"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="나의강의실에서 확인 가능"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  수료 날짜
                </label>
                <input
                  type="date"
                  name="certificate-completion-date"
                  id="certificate-completion-date"
                  autoComplete="off"
                  value={formData.completionDate}
                  onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                발급 신청하기
              </button>
            </form>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong className="text-yellow-700">📌 안내사항</strong><br/>
                • 자격증 발급 수수료: 30,000원 (등기우편 배송비 포함)<br/>
                • 발급 소요기간: 신청 후 3~5 영업일<br/>
                • 발급 취소 및 환불은 발송 전까지만 가능합니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 발급 가능 자격증 목록 */}
      <section className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-12">발급 가능 자격증</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certificates.map((cert, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                {/* 스켈레톤 이미지 - 회색 배경 */}
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">주무부처: {cert.ministry}</p>
                  <p className="text-sm text-gray-600 mb-3">교육기간: {cert.period}</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {cert.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-12">자주 묻는 질문</h2>
          <div className="space-y-4 max-w-[800px] mx-auto">
            {[
              { q: '자격증 발급 비용은 얼마인가요?', a: '자격증 발급 수수료는 30,000원이며, 등기우편 배송비가 포함되어 있습니다.' },
              { q: '발급까지 얼마나 걸리나요?', a: '신청 후 3~5 영업일 소요되며, 발송 후 1~2일 내 수령 가능합니다.' },
              { q: '자격증 재발급이 가능한가요?', a: '분실, 훼손 등의 사유로 재발급이 필요한 경우 고객센터로 문의해주시면 재발급 절차를 안내해드립니다.' },
              { q: '자격증의 유효기간이 있나요?', a: '본 기관에서 발급하는 민간자격증은 별도의 유효기간이 없으며, 평생 사용 가능합니다.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Q. {faq.q}</h3>
                <p className="text-gray-600">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
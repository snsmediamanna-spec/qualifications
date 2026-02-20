import { useState, useEffect } from 'react';
import { Award, TrendingUp, Target, Calendar, ChevronLeft, Loader2, FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ExamResult {
  email: string;
  date: string;
  score: number;
  passed: string; // '합격' or '불합격'
  answers: string;
  results: string;
}

interface ExamResultsPageProps {
  userEmail: string;
  onBack?: () => void;
  isMobile?: boolean;
}

export function ExamResultsPage({ userEmail, onBack, isMobile = false }: ExamResultsPageProps) {
  const EXAM_API_URL = "https://script.google.com/macros/s/AKfycbxKYxDp5_6ea8Bcf9mxQFli2kYHLXyKeSSnWP4YfWQwOnw3hSbqGvdFEamyHyA7ZhVY/exec";
  
  const [results, setResults] = useState<ExamResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExamResults();
  }, [userEmail]);

  const loadExamResults = async () => {
    try {
      setIsLoading(true);
      console.log('📊 시험 결과 로딩 시작...');
      console.log('🔗 API URL:', EXAM_API_URL);
      console.log('📧 사용자 이메일:', userEmail);
      
      const response = await fetch(`${EXAM_API_URL}?action=getUserExamResults&userEmail=${encodeURIComponent(userEmail)}&timestamp=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('📦 시험 결과 데이터:', result);
      
      if (result.success && result.results) {
        setResults(result.results);
        console.log('✅ 시험 결과 로드 완료:', result.results.length, '건');
      } else {
        console.error('❌ 시험 결과 로드 실패:', result.message);
      }
    } catch (error) {
      console.error('❌ 시험 결과 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // results 문자열에서 정답 개수 계산 (O와 X로 구성된 문자열)
  const calculateStats = (result: ExamResult) => {
    const resultsArray = result.results.split(',');
    const correctCount = resultsArray.filter(r => r.trim() === 'O').length;
    const totalCount = resultsArray.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    
    // 각 문제당 10점으로 가정 (testapp.js의 채점 로직에 따라 다를 수 있음)
    const maxScore = totalCount * 10;
    
    return {
      correctCount,
      totalCount,
      percentage,
      maxScore
    };
  };

  // 답안 다운로드 함수 (PDF)
  const downloadAnswers = (result: ExamResult, index: number) => {
    const answersArray = result.answers.split(',');
    const resultsArray = result.results.split(',');
    const stats = calculateStats(result);
    
    // PDF 생성
    const doc = new jsPDF();
    
    // 제목
    doc.setFontSize(18);
    doc.text('Festival Planner Certification Exam Answer Sheet', 105, 20, { align: 'center' });
    
    // 응시자 정보
    doc.setFontSize(12);
    let yPosition = 40;
    doc.text(`Examinee: ${userEmail}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Date: ${formatDate(result.date)}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Result: ${result.passed}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Score: ${result.score}/${stats.maxScore}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Correct Rate: ${stats.percentage}%`, 20, yPosition);
    yPosition += 8;
    doc.text(`Correct Answers: ${stats.correctCount}/${stats.totalCount}`, 20, yPosition);
    yPosition += 15;
    
    // 테이블 헤더
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Question No.', 20, yPosition);
    doc.text('Your Answer', 70, yPosition);
    doc.text('Result', 120, yPosition);
    yPosition += 8;
    
    // 구분선
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 8;
    
    // 답안 목록
    doc.setFont(undefined, 'normal');
    answersArray.forEach((answer, idx) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      const answerText = answer.trim() === '1' ? 'O' : answer.trim() === '2' ? 'X' : answer.trim();
      const resultText = resultsArray[idx]?.trim() || '-';
      
      doc.text(`${idx + 1}`, 35, yPosition, { align: 'center' });
      doc.text(answerText, 80, yPosition, { align: 'center' });
      doc.text(resultText, 130, yPosition, { align: 'center' });
      yPosition += 8;
    });
    
    // PDF 다운로드
    const dateStr = new Date(result.date).toISOString().split('T')[0];
    doc.save(`exam_answer_${dateStr}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            시험 결과를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className={`w-full ${isMobile ? 'px-6' : 'max-w-[1400px]'} mx-auto ${isMobile ? 'py-12' : 'py-20'}`}>
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
          <span>나의 강의실로 돌아가기</span>
        </button>

        {/* 헤더 */}
        <div className={`${isMobile ? 'mb-12' : 'mb-20'}`}>
          <h1 className={`font-['Playfair_Display'] ${isMobile ? 'text-5xl' : 'text-7xl'} font-light text-foreground mb-4 tracking-tight`}>
            시험 결과
          </h1>
          <p className="text-lg text-muted-foreground">지금까지 응시한 시험 결과를 확인하세요</p>
        </div>

        {/* 결과 없음 */}
        {results.length === 0 && (
          <div className="bg-card border border-border rounded-sm p-20 shadow-sm text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className={`font-['Playfair_Display'] ${isMobile ? 'text-2xl' : 'text-3xl'} font-light text-foreground mb-3`}>
              응시한 시험이 없습니다
            </h2>
            <p className="text-muted-foreground mb-8">
              시험에 응시하면 여기에서 결과를 확인할 수 있습니다
            </p>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
            >
              나의 강의실로 돌아가기
            </button>
          </div>
        )}

        {/* 시험 결과 목록 */}
        {results.length > 0 && (
          <div className="space-y-8">
            {results.map((result, index) => {
              const stats = calculateStats(result);
              const isPassed = result.passed === '합격';
              
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-sm p-10 shadow-sm hover:border-primary/50 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h2 className={`font-['Playfair_Display'] ${isMobile ? 'text-2xl' : 'text-3xl'} font-light text-foreground`}>
                          자격시험
                        </h2>
                        <span className={`px-4 py-1.5 rounded-sm text-sm font-medium ${
                          isPassed
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {result.passed}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar size={14} />
                        <span>{formatDate(result.date)}</span>
                      </div>
                    </div>
                    
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                      isPassed
                        ? 'bg-primary/10' 
                        : 'bg-destructive/10'
                    }`}>
                      {isPassed ? (
                        <CheckCircle className="w-10 h-10 text-primary" />
                      ) : (
                        <XCircle className="w-10 h-10 text-destructive" />
                      )}
                    </div>
                  </div>

                  {/* 성적 통계 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-muted/30 p-6 rounded-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Award className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">총점</span>
                      </div>
                      <p className={`font-['Playfair_Display'] ${isMobile ? 'text-3xl' : 'text-4xl'} font-light text-foreground`}>
                        {result.score}<span className="text-xl text-muted-foreground">/{stats.maxScore}</span>
                      </p>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">정답률</span>
                      </div>
                      <p className={`font-['Playfair_Display'] ${isMobile ? 'text-3xl' : 'text-4xl'} font-light text-foreground`}>
                        {stats.percentage}<span className="text-xl text-muted-foreground">%</span>
                      </p>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Target className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">정답 수</span>
                      </div>
                      <p className={`font-['Playfair_Display'] ${isMobile ? 'text-3xl' : 'text-4xl'} font-light text-foreground`}>
                        {stats.correctCount}<span className="text-xl text-muted-foreground">/{stats.totalCount}</span>
                      </p>
                    </div>
                  </div>

                  {/* 버튼 영역 */}
                  <div className={`${isPassed ? 'grid grid-cols-1 gap-4' : ''}`}>
                    {/* 합격 시 자격증 발급신청 버튼 */}
                    {isPassed && (
                      <button
                        onClick={() => alert('자격증 발급신청 기능은 준비 중입니다.')}
                        className="w-full bg-primary text-primary-foreground h-14 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        <Award className="w-5 h-5" />
                        자격증 발급신청
                      </button>
                    )}

                    {/* 답안 다운로드 버튼 */}
                    <button
                      onClick={() => downloadAnswers(result, index)}
                      className="w-full bg-muted text-foreground h-14 rounded-sm hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 border border-border"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      <Download className="w-5 h-5" />
                      답안 다운로드 (PDF)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
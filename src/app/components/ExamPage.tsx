import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight, FileText, Send, Loader2, Award, TrendingUp, Target, Circle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Question {
  id: number;
  question: string;
  imageUrl?: string; // 이미지 URL (선택사항)
  correctAnswer: number; // 1: O, 2: X
  score: number;
}

interface ExamPageProps {
  userEmail: string;
  examCategory: string; // '축제기획사', '이벤트기획사', '공연기획사'
  onBack?: () => void;
}

export function ExamPage({ userEmail, examCategory, onBack }: ExamPageProps) {
  // ✅ testapp.js의 배포 URL 사용 (시험 시스템 전용)
  const EXAM_API_URL = "https://script.google.com/macros/s/AKfycbxKYxDp5_6ea8Bcf9mxQFli2kYHLXyKeSSnWP4YfWQwOnw3hSbqGvdFEamyHyA7ZhVY/exec";

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90분
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<any>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // 문제 로드
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoadingQuestions(true);
      // 시험 문제 로딩 - 보안을 위해 콘솔 로그 제거
      
      // ✅ 카테고리 정보를 포함하여 요청
      const response = await fetch(`${EXAM_API_URL}?action=getExamQuestions&category=${encodeURIComponent(examCategory)}&timestamp=${Date.now()}`, {
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
      
      // 보안을 위해 문제 데이터 콘솔 출력 제거
      
      if (result.success && result.questions && result.questions.length > 0) {
        setQuestions(result.questions);
        setAnswers(new Array(result.questions.length).fill(0));
        // 문제 로드 성공 (로그 제거)
      } else {
        console.error('❌ 문제 로드 실패');
        alert('문제를 불러오는데 실패했습니다. Apps Script가 배포되어 있는지 확인하세요.');
      }
    } catch (error) {
      console.error('❌ 문제 로드 오류:', error);
      alert(`문제를 불러오는데 실패했습니다.\n\n1. Apps Script가 배포되었는지 확인하세요.\n2. API URL이 올바른지 확인하세요.\n3. 스프레드시트에 "시험문제" 시트가 있는지 확인하세요.\n\n에러: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // 타이머
  useEffect(() => {
    if (!isExamStarted || examResult || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, examResult, questions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleAutoSubmit = () => {
    alert('시험 시간이 종료되었습니다. 자동으로 제출됩니다.');
    handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setShowConfirmSubmit(false);

    try {
      // 시험 제출 처리 (보안을 위해 로그 제거)

      // ✅ Apps Script는 1/2 형식을 기대하므로, 숫자 그대로 문자열로 변환
      const answersString = answers.map(ans => {
        if (ans === 1) return '1'; // O → 1
        if (ans === 2) return '2'; // X → 2
        return ''; // 미응답
      });

      // ✅ POST 요청 본문으로 전송
      const response = await fetch(EXAM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // ✅ Google Apps Script 호환
        },
        body: JSON.stringify({
          action: 'submitExam',
          userEmail: userEmail,
          answers: answersString
        }),
        redirect: 'follow'
      });

      const result = await response.json();
      console.log('📊 채점 결과:', result);

      if (result.success && result.gradeResult) {
        setExamResult(result.gradeResult);
      } else {
        alert('시험 제출에 실패했습니다: ' + (result.message || '알 수 없는 오류'));
      }
    } catch (error) {
      console.error('❌ 시험 제출 오류:', error);
      alert('시험 제출 중 오류가 발생했습니다.\n\n1. Apps Script가 배포되었는지 확인하세요.\n2. API URL이 올바른지 확인하세요.\n3. 배포 액세스 권한을 "전체 사용자"로 설정했는지 확인하세요.\n\n에러: ' + (error instanceof Error ? error.message : '알 수 없는 오류'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.filter(a => a > 0).length;

  // 로딩 화면
  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
          <p className="text-xl text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
            문제를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 문제가 없을 때
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            <ChevronLeft className="w-5 h-5" />
            나의 강의실로 돌아가기
          </button>
          
          <div className="bg-card border border-border rounded-sm p-16 shadow-sm text-center">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 
              className="text-5xl text-foreground mb-4 font-light tracking-tight" 
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              문제가 없습니다
            </h2>
            <p className="text-lg text-muted-foreground mb-10" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              관리자가 아직 문제를 등록하지 않았습니다.
            </p>
            <button
              onClick={onBack}
              className="bg-primary text-primary-foreground px-10 py-4 rounded-sm hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 시험 시작 전 화면
  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            <ChevronLeft className="w-5 h-5" />
            나의 강의실로 돌아가기
          </button>

          <div className="bg-card border border-border rounded-sm p-16 shadow-sm">
            <div className="text-center mb-16">
              <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileText className="w-14 h-14 text-primary" />
              </div>
              <h1 
                className="text-6xl text-foreground mb-5 font-light tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {examCategory} 자격시험
              </h1>
              <p 
                className="text-muted-foreground text-xl"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                시험에 응시하기 전 안내사항을 확인해주세요
              </p>
            </div>

            <div className="space-y-5 mb-16">
              <div className="flex items-start gap-5 p-7 bg-muted/30 rounded-sm border border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground mb-2 text-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    시험 시간
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    90분 (1시간 30분)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 bg-muted/30 rounded-sm border border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground mb-2 text-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    문제 수
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    총 {questions.length}문제 (각 1점) - OX 문제
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 bg-muted/30 rounded-sm border border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-foreground mb-2 text-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    합격 기준
                  </p>
                  <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    60점 이상
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 p-7 bg-destructive/5 border border-destructive/20 rounded-sm">
                <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-foreground mb-3 text-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    주의사항
                  </p>
                  <ul className="text-muted-foreground space-y-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    <li>• 시험 시작 후에는 뒤로 가기가 불가능합니다</li>
                    <li>• 시간이 종료되면 자동으로 제출됩니다</li>
                    <li>• 모든 문제에 답변하지 않아도 제출 가능합니다</li>
                    <li>• 제출 후에는 답안 수정이 불가능합니다</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsExamStarted(true)}
              className="w-full bg-primary text-primary-foreground h-16 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-3 shadow-sm text-lg"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
            >
              <CheckCircle className="w-5 h-5" />
              시험 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 시험 결과 화면
  if (examResult) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-12 shadow-sm mb-6">
            <div className="text-center mb-10">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 ${
                examResult.passed 
                  ? 'bg-primary/10' 
                  : 'bg-destructive/10'
              }`}>
                {examResult.passed ? (
                  <CheckCircle className="w-14 h-14 text-primary" />
                ) : (
                  <XCircle className="w-14 h-14 text-destructive" />
                )}
              </div>
              <h1 
                className={`text-5xl mb-4 ${
                  examResult.passed 
                    ? 'text-primary' 
                    : 'text-destructive'
                }`}
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
              >
                {examResult.passed ? '합격' : '불합격'}
              </h1>
              <p 
                className="text-muted-foreground text-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                {examCategory} 자격시험
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-muted/50 p-8 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  총점
                </p>
                <p className="text-4xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                  {examResult.totalScore}<span className="text-xl text-muted-foreground">/{examResult.maxScore}</span>
                </p>
              </div>

              <div className="bg-muted/50 p-8 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  정답률
                </p>
                <p className="text-4xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                  {examResult.percentage}<span className="text-xl text-muted-foreground">%</span>
                </p>
              </div>

              <div className="bg-muted/50 p-8 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                  정답 수
                </p>
                <p className="text-4xl text-foreground" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}>
                  {examResult.correctCount}<span className="text-xl text-muted-foreground">/{examResult.questionCount}</span>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 bg-muted text-foreground h-14 rounded-lg hover:bg-muted/80 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                나의 강의실로 돌아가기
              </button>
              {examResult.passed ? (
                <button
                  onClick={() => alert('자격증 발급신청 기능은 준비 중입니다.')}
                  className="flex-1 bg-primary text-primary-foreground h-14 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  <Award className="w-5 h-5" />
                  자격증 발급신청
                </button>
              ) : (
                <button
                  onClick={() => {
                    setExamResult(null);
                    setIsExamStarted(false);
                    setAnswers(new Array(questions.length).fill(0));
                    setCurrentQuestionIndex(0);
                    setTimeRemaining(90 * 60);
                  }}
                  className="flex-1 bg-primary text-primary-foreground h-14 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  재응시하기
                </button>
              )}
            </div>
          </div>

          {/* 상세 결과 */}
          <div className="bg-card border border-border rounded-lg p-10 shadow-sm">
            <h2 
              className="text-3xl text-foreground mb-8"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
            >
              상세 결과
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {examResult.details && examResult.details.map((detail: any, index: number) => (
                <div 
                  key={index}
                  className={`p-5 rounded-lg border ${
                    detail.isCorrect 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-destructive/5 border-destructive/20'
                  }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      detail.isCorrect ? 'bg-primary/10' : 'bg-destructive/10'
                    }`}>
                      {detail.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-foreground mb-3"
                        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                      >
                        {detail.question}번. {questions[detail.question - 1]?.question}
                      </p>
                      <div className="text-sm space-y-1.5" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                        <p className={detail.isCorrect ? 'text-primary' : 'text-destructive'}>
                          선택한 답: {detail.studentAnswer?.toUpperCase() === 'O' ? 'O' : detail.studentAnswer?.toUpperCase() === 'X' ? 'X' : '미응답'}
                        </p>
                        {!detail.isCorrect && (
                          <p className="text-primary">
                            정답: {detail.correctAnswer?.toUpperCase() === 'O' ? 'O' : 'X'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 시험 진행 화면
  return (
    <div className="min-h-screen bg-background">
      {/* 문제 영역 */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-[rgb(255,255,255)] border border-border rounded-sm p-12 shadow-sm mb-10">
          {/* 시간과 진행률 */}
          <div className="flex items-center justify-between mb-12 pb-8 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                남은 시간
              </p>
              <p 
                className={`text-3xl font-light tracking-tight ${timeRemaining < 600 ? 'text-destructive' : 'text-foreground'}`}
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {formatTime(timeRemaining)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                진행률
              </p>
              <p className="text-3xl text-foreground font-light tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {answeredCount}<span className="text-xl text-muted-foreground">/{questions.length}</span>
              </p>
            </div>
          </div>

          <div className="mb-12">
            {/* 문제 번호 with 좌우 네비게이션 버튼 */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="p-3 rounded-full hover:bg-muted transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="이전 문제"
              >
                <ChevronLeft className="w-6 h-6 text-foreground" />
              </button>
              
              <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                문제 {currentQuestionIndex + 1} / {questions.length}
              </p>
              
              <button
                onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1}
                className="p-3 rounded-full hover:bg-muted transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                aria-label="다음 문제"
              >
                <ChevronRight className="w-6 h-6 text-foreground" />
              </button>
            </div>
            
            <h2 
              className="text-4xl text-foreground leading-relaxed font-light tracking-tight mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {currentQuestion?.question}
            </h2>
            
            {/* 이미지 표시 (있을 경우) */}
            {currentQuestion?.imageUrl && (
              <div className="mb-8">
                <div className="bg-muted/20 border border-border rounded-sm p-4">
                  <p className="text-xs text-muted-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                    문제 이미지
                  </p>
                  <ImageWithFallback 
                    src={currentQuestion.imageUrl} 
                    alt="문제 이미지" 
                    className="w-full max-w-2xl mx-auto rounded-sm border border-border shadow-sm bg-white"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* OX 버튼 */}
          <div className="grid grid-cols-2 gap-8">
            <button
              onClick={() => handleAnswerSelect(currentQuestionIndex, 1)}
              className={`p-12 rounded-sm border-2 transition-all duration-200 ${
                answers[currentQuestionIndex] === 1
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 hover:bg-muted/20'
              }`}
            >
              <div className="text-center">
                <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all ${
                  answers[currentQuestionIndex] === 1
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                    : 'bg-muted/50 text-muted-foreground'
                }`}>
                  <Circle className="w-20 h-20" strokeWidth={3} />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleAnswerSelect(currentQuestionIndex, 2)}
              className={`p-12 rounded-sm border-2 transition-all duration-200 ${
                answers[currentQuestionIndex] === 2
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/40 hover:bg-muted/20'
              }`}
            >
              <div className="text-center">
                <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all ${
                  answers[currentQuestionIndex] === 2
                    ? 'bg-primary text-primary-foreground shadow-lg scale-110'
                    : 'bg-muted/50 text-muted-foreground'
                }`}>
                  <XCircle className="w-20 h-20" strokeWidth={3} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex gap-5 mb-10">
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-3 px-10 py-5 bg-muted text-foreground rounded-sm hover:bg-muted/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          >
            <ChevronLeft className="w-5 h-5" />
            이전 문제
          </button>

          <button
            onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="flex-1 flex items-center justify-center gap-3 px-10 py-5 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
          >
            다음 문제
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* 제출 버튼 */}
        <button
          onClick={() => setShowConfirmSubmit(true)}
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground h-20 rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-4 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              제출 중...
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              시험 제출하기
            </>
          )}
        </button>
      </div>

      {/* 제출 확인 모달 */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-sm p-12 max-w-lg w-full shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
              <h3 
                className="text-4xl text-foreground mb-4 font-light tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                시험을 제출하시겠습니까?
              </h3>
              <p 
                className="text-muted-foreground text-lg"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
              >
                제출 후에는 답안을 수정할 수 없습니다
              </p>
            </div>

            <div className="mb-10 p-8 bg-muted/30 rounded-sm space-y-4">
              <div className="flex justify-between items-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                <span className="text-muted-foreground text-lg">답변한 문제</span>
                <span className="text-foreground font-medium text-xl">{answeredCount} / {questions.length}</span>
              </div>
              <div className="flex justify-between items-center" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                <span className="text-muted-foreground text-lg">미답변 문제</span>
                <span className="text-foreground font-medium text-xl">{questions.length - answeredCount}</span>
              </div>
            </div>

            <div className="flex gap-5">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1 bg-muted text-foreground h-16 rounded-sm hover:bg-muted/80 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                취소
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 bg-primary text-primary-foreground h-16 rounded-sm hover:opacity-90 transition-opacity"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                제출
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
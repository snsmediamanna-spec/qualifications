import { useState, useEffect } from 'react';
import { Download, Upload, FileText, Loader2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { ExamQuestionUploader } from '../ExamQuestionUploader';
import * as XLSX from 'xlsx';

interface Question {
  id: number;
  score: number;
  correctAnswer: number; // ✅ 숫자로 변경 (1: O, 2: X)
  question: string;
}

export function AdminExamManagement() {
  // ✅ testapp.js의 배포 URL 사용 (시험 시스템 전용)
  const EXAM_API_URL = "https://script.google.com/macros/s/AKfycbxKYxDp5_6ea8Bcf9mxQFli2kYHLXyKeSSnWP4YfWQwOnw3hSbqGvdFEamyHyA7ZhVY/exec";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // 문제 로드
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      // 문제 로딩 (보안을 위해 로그 제거)
      
      const response = await fetch(`${EXAM_API_URL}?action=getExamQuestions&category=${encodeURIComponent(selectedCategory)}&timestamp=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('📄 Raw response:', text.substring(0, 200));
      
      const result = JSON.parse(text);
      
      // 보안을 위해 문제 데이터 로그 제거
      
      if (result.success && result.questions) {
        setQuestions(result.questions);
        // 문제 로드 성공 (로그 제거)
      } else {
        console.error('❌ 문제 로드 실패:', result.message);
        setApiError(result.message);
        setQuestions([]);
      }
    } catch (error) {
      console.error('❌ 문제 로드 오류:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          alert('요청 시간이 초과되었습니다.\n\n원인:\n- Apps Script가 응답하지 않음\n- 네트워크 연결 문제\n\n해결:\n1. Apps Script를 재배포\n2. 페이지 새로고침 후 재시도');
        } else {
          alert(`문제를 불러올 수 없습니다.\n\n에러: ${error.message}\n\n해결 방법:\n1. Apps Script에서 testGetQuestions() 실행\n2. Apps Script 로그 확인\n3. Apps Script를 재배포`);
        }
      }
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 엑셀 다운로드
  const handleDownloadExcel = () => {
    setIsDownloading(true);
    
    try {
      // ✅ Excel 데이터 생성 (xlsx 라이브러리 사용)
      const excelData = questions.map((q) => {
        // ✅ correctAnswer를 O/X로 변환 (1, 2, "1", "2", "O", "X" 모두 처리)
        let displayAnswer = 'O';
        
        if (typeof q.correctAnswer === 'number') {
          displayAnswer = q.correctAnswer === 2 ? 'X' : 'O';
        } else if (typeof q.correctAnswer === 'string') {
          const answerStr = String(q.correctAnswer).trim().toUpperCase();
          if (answerStr === '2' || answerStr === 'X') {
            displayAnswer = 'X';
          } else {
            displayAnswer = 'O';
          }
        }
        
        return {
          '문제번호': q.id,
          '배점': q.score,
          '정답': displayAnswer, // ✅ O 또는 X로 표시
          '문제내용': q.question
        };
      });
      
      // 워크시트 생성
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // 열 너비 설정
      worksheet['!cols'] = [
        { wch: 10 },  // 문제번호
        { wch: 8 },   // 배점
        { wch: 8 },   // 정답
        { wch: 80 }   // 문제내용
      ];
      
      // 워크북 생성
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '시험문제');
      
      // ✅ Excel 파일(.xlsx)로 다운로드
      const fileName = `시험문제_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      alert('Excel 파일이 다운로드되었습니다.');
    } catch (error) {
      console.error('❌ 다운로드 오류:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 스프레드시트에서 다운로드 (URL 열기)
  const handleDownloadFromSpreadsheet = () => {
    const spreadsheetId = '15jiCLc57XAouv0rwbJejFosHkWa6uIdaXTRAspoaekY';
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 
            className="text-4xl font-light text-foreground mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            시험 관리
          </h2>
          <p 
            className="text-muted-foreground"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            시험 문제와 정답을 관리합니다
          </p>
        </div>
        
        <button
          onClick={loadQuestions}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                총 문제 수
              </p>
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {questions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                O 정답
              </p>
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {questions.filter(q => q.correctAnswer === 1).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                X 정답
              </p>
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {questions.filter(q => q.correctAnswer === 2).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowUploader(!showUploader)}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          <Upload className="w-5 h-5" />
          {showUploader ? '업로드 창 닫기' : 'MD/Excel 파일 업로드'}
        </button>

        <button
          onClick={handleDownloadExcel}
          disabled={isDownloading || questions.length === 0}
          className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              다운로드 중...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              문제/정답 엑셀 다운로드
            </>
          )}
        </button>

        <button
          onClick={handleDownloadFromSpreadsheet}
          className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-muted-foreground/30 text-foreground rounded-xl hover:bg-muted transition-colors"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          <FileText className="w-5 h-5" />
          스프레드시트 열기
        </button>
      </div>

      {/* 파일 업로드 섹션 */}
      {showUploader && (
        <ExamQuestionUploader 
          onUploadComplete={() => {
            loadQuestions();
            setShowUploader(false);
          }} 
        />
      )}

      {/* ⚠️ API 연결 오류 경고 */}
      {apiError && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 
                className="text-lg font-semibold text-red-800 dark:text-red-300 mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                ⚠️ Apps Script 연결 오류
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                {apiError}
              </p>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-sm text-red-900 dark:text-red-200 mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                  📋 해결 방법:
                </h4>
                <ol className="space-y-2 text-sm text-red-800 dark:text-red-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <li><strong>1단계:</strong> Google Apps Script 열기 (<a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-red-600">script.google.com</a>)</li>
                  <li><strong>2단계:</strong> testapp.gs.tsx 파일의 코드를 Apps Script 에디터에 복사</li>
                  <li><strong>3단계:</strong> 배포 → 배포 관리 → 새 배포 → 유형: 웹 앱</li>
                  <li><strong>4단계:</strong> 다음 사용자로 실행: "나" / 액세스 권한: "모든 사용자"</li>
                  <li><strong>5단계:</strong> 배포 후 생성된 URL을 AdminExamManagement.tsx의 EXAM_API_URL에 설정</li>
                  <li><strong>6단계:</strong> Apps Script에서 testGetQuestions() 함수 실행하여 테스트</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 
          className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          📝 시험 문제 관리 방법
        </h3>
        <ol className="space-y-2 text-sm text-blue-700 dark:text-blue-400" style={{ fontFamily: "'Inter', sans-serif" }}>
          <li><strong>1. 문제 다운로드:</strong> "문제/정답 엑셀 다운로드" 버튼을 클릭하여 현재 문제를 Excel 파일(.xlsx)로 다운로드합니다.</li>
          <li><strong>2. 문제 수정:</strong> "스프레드시트 열기" 버튼을 클릭하여 Google 스프레드시트에서 직접 문제를 추가/수정합니다.</li>
          <li><strong>3. 형식:</strong> A열(배점), B열(정답: 1=O, 2=X), C열(문제설명)</li>
          <li><strong>4. 적용:</strong> 스프레드시트 수정 후 "새로고침" 버튼을 클릭하면 변경사항이 반영됩니다.</li>
          <li><strong>5. 주의:</strong> 정답은 반드시 1(O) 또는 2(X)로 입력하세요.</li>
        </ol>
      </div>

      {/* 문제 목록 */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 
            className="text-xl font-semibold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            문제 목록
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                등록된 문제가 없습니다
              </p>
              <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                스프레드시트에서 문제를 추가해주세요
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    번호
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    배점
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    정답
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    문제
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((q, index) => (
                  <tr key={index} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {q.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {q.score}점
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        q.correctAnswer === 1
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}>
                        {q.correctAnswer === 1 ? 'O' : 'X'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {q.question}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
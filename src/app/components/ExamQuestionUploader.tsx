import { useState } from 'react';
import { Upload, FileText, Table, CheckCircle, XCircle, Loader2, Download, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Question {
  score: number;
  correctAnswer: number; // ✅ 숫자로 변경 (1: O, 2: X)
  question: string;
  imageUrl?: string;
}

interface ExamQuestionUploaderProps {
  onUploadComplete?: () => void;
}

export function ExamQuestionUploader({ onUploadComplete }: ExamQuestionUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [parseResult, setParseResult] = useState<{ success: boolean; message: string; questions?: Question[] } | null>(null);

  const EXAM_API_URL = "https://script.google.com/macros/s/AKfycbxKYxDp5_6ea8Bcf9mxQFli2kYHLXyKeSSnWP4YfWQwOnw3hSbqGvdFEamyHyA7ZhVY/exec";

  // MD 파일 파싱
  const parseMdFile = (content: string): Question[] => {
    const questions: Question[] = [];
    const lines = content.split('\n');
    
    let currentQuestion: Partial<Question> = {};
    let inQuestion = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 문제 시작 감지
      if (line.startsWith('## 문제') || line.startsWith('## Question')) {
        if (inQuestion && currentQuestion.question) {
          questions.push({
            score: currentQuestion.score || 1,
            correctAnswer: currentQuestion.correctAnswer || 1, // ✅ 숫자로 변경 (1: O, 2: X)
            question: currentQuestion.question,
            imageUrl: currentQuestion.imageUrl || ''
          });
        }
        currentQuestion = { score: 1 };
        inQuestion = true;
        continue;
      }
      
      if (inQuestion) {
        // 배점
        if (line.startsWith('**배점**:') || line.startsWith('**점수**:') || line.startsWith('**Score**:')) {
          const scoreMatch = line.match(/:\s*(\d+)/);
          if (scoreMatch) currentQuestion.score = parseInt(scoreMatch[1]);
        }
        // 정답
        else if (line.startsWith('**정답**:') || line.startsWith('**Answer**:')) {
          const answerMatch = line.match(/:\s*([OX])/i);
          if (answerMatch) currentQuestion.correctAnswer = answerMatch[1].toUpperCase() === 'O' ? 1 : 2; // ✅ 숫자로 변경 (1: O, 2: X)
        }
        // 문제
        else if (line.startsWith('**문제**:') || line.startsWith('**Question**:')) {
          currentQuestion.question = line.replace(/^\*\*.*?\*\*:\s*/, '').trim();
        }
        // 이미지
        else if (line.startsWith('**이미지**:') || line.startsWith('**Image**:')) {
          const imageMatch = line.match(/:\s*(https?:\/\/\S+)/);
          if (imageMatch) currentQuestion.imageUrl = imageMatch[1];
        }
        // 문제가 여러 줄인 경우
        else if (line && !line.startsWith('**') && currentQuestion.question && !line.startsWith('#')) {
          currentQuestion.question += ' ' + line;
        }
      }
    }
    
    // 마지막 문제 추가
    if (inQuestion && currentQuestion.question) {
      questions.push({
        score: currentQuestion.score || 1,
        correctAnswer: currentQuestion.correctAnswer || 1, // ✅ 숫자로 변경 (1: O, 2: X)
        question: currentQuestion.question,
        imageUrl: currentQuestion.imageUrl || ''
      });
    }
    
    return questions;
  };

  // 엑셀 파일 파싱
  const parseExcelFile = (file: File): Promise<Question[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
          
          const questions: Question[] = [];
          
          // 헤더 건너뛰기 (첫 번째 행)
          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            
            // 빈 행 건너뛰기
            if (!row || row.length === 0 || !row[2]) continue;
            
            questions.push({
              score: Number(row[0]) || 1,
              correctAnswer: String(row[1] || 'O').trim().toUpperCase() === 'O' ? 1 : 2, // ✅ 숫자로 변경 (1: O, 2: X)
              question: String(row[2] || '').trim(),
              imageUrl: row[3] ? String(row[3]).trim() : ''
            });
          }
          
          resolve(questions);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsArrayBuffer(file);
    });
  };

  // 파일 업로드 처리
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setParseResult(null);

    try {
      let questions: Question[] = [];

      // 파일 형식에 따라 파싱
      if (file.name.endsWith('.md')) {
        const content = await file.text();
        questions = parseMdFile(content);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        questions = await parseExcelFile(file);
      } else {
        throw new Error('지원하지 않는 파일 형식입니다. MD 또는 Excel 파일만 업로드 가능합니다.');
      }

      if (questions.length === 0) {
        throw new Error('파일에서 문제를 찾을 수 없습니다.');
      }

      // 보안을 위해 파싱된 문제 로그 제거

      // Apps Script로 전송
      const response = await fetch(EXAM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'bulkAddQuestions',
          questions: questions
        })
      });

      const result = await response.json();
      console.log('📊 업로드 결과:', result);

      if (result.success) {
        setParseResult({
          success: true,
          message: `${questions.length}개의 문제가 성공적으로 등록되었습니다!`,
          questions: questions
        });
        
        if (onUploadComplete) {
          setTimeout(() => {
            onUploadComplete();
          }, 2000);
        }
      } else {
        throw new Error(result.message || '문제 등록에 실패했습니다.');
      }

    } catch (error) {
      console.error('❌ 업로드 오류:', error);
      setParseResult({
        success: false,
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      });
    } finally {
      setIsUploading(false);
      // 파일 입력 초기화
      event.target.value = '';
    }
  };

  // 샘플 파일 다운로드
  const downloadSampleMd = () => {
    const sampleContent = `# 시험문제 샘플

## 문제 1
**배점**: 1
**정답**: O
**문제**: 축제기획의 첫 단계는 기획안 작성이다.
**이미지**: 

## 문제 2
**배점**: 1
**정답**: X
**문제**: 축제 마케팅은 홍보만 포함한다.
**이미지**: https://example.com/image.jpg

## 문제 3
**배점**: 2
**정답**: O
**문제**: 안전관리는 축제 운영의 필수 요소이다.
**이미지**: 

## 문제 4
**배점**: 1
**정답**: X
**문제**: 자원봉사자 관리는 불필요하다.
**이미지**: 
`;

    const blob = new Blob([sampleContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '시험문제_샘플.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      ['배점', '정답', '문제설명', '이미지URL'],
      [1, 'O', '축제기획의 첫 단계는 기획안 작성이다.', ''],
      [1, 'X', '축제 마케팅은 홍보만 포함한다.', 'https://example.com/image.jpg'],
      [2, 'O', '안전관리는 축제 운영의 필수 요소이다.', ''],
      [1, 'X', '자원봉사자 관리는 불필요하다.', '']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '시험문제');

    // 열 너비 설정
    worksheet['!cols'] = [
      { wch: 8 },  // 배점
      { wch: 8 },  // 정답
      { wch: 50 }, // 문제설명
      { wch: 40 }  // 이미지URL
    ];

    XLSX.writeFile(workbook, '시험문제_샘플.xlsx');
  };

  return (
    <div className="bg-card border border-border rounded-sm p-8 shadow-sm">
      <h3 
        className="text-2xl text-foreground mb-6"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        시험문제 일괄 등록
      </h3>

      {/* 설명 */}
      <div className="bg-muted/30 border border-border/50 rounded-sm p-6 mb-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              파일 업로드 방법
            </p>
            <ul className="text-sm text-muted-foreground space-y-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              <li>• <strong>MD 파일</strong>: 마크다운 형식으로 작성된 문제 (샘플 다운로드 참고)</li>
              <li>• <strong>Excel 파일</strong>: [배점 | 정답 | 문제설명 | 이미지URL] 형식</li>
              <li>• 이미지URL은 선택사항이며, Google Drive 링크 사용 가능</li>
              <li>• 정답은 <strong>O</strong> 또는 <strong>X</strong>로 입력</li>
            </ul>
            <div className="mt-4 pt-4 border-t border-border/30">
              <p className="text-sm font-semibold text-destructive flex items-center gap-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                <AlertCircle className="w-4 h-4" />
                ⚠️ 중요: 새 파일을 업로드하면 기존 문제가 모두 삭제되고 새 문제로 교체됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 샘플 다운로드 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={downloadSampleMd}
          className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-sm transition-colors border border-border"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
        >
          <Download className="w-4 h-4" />
          MD 샘플 다운로드
        </button>
        <button
          onClick={downloadSampleExcel}
          className="flex items-center gap-2 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-sm transition-colors border border-border"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
        >
          <Download className="w-4 h-4" />
          Excel 샘플 다운로드
        </button>
      </div>

      {/* 파일 업로드 */}
      <div className="border-2 border-dashed border-border rounded-sm p-12 text-center hover:border-primary/50 transition-colors mb-6">
        <input
          type="file"
          accept=".md,.xlsx,.xls"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="question-file-upload"
        />
        <label
          htmlFor="question-file-upload"
          className={`cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex flex-col items-center">
            {isUploading ? (
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
            ) : (
              <Upload className="w-16 h-16 text-primary mb-4" />
            )}
            <p className="text-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              {isUploading ? '업로드 중...' : '파일을 선택하거나 드래그하세요'}
            </p>
            <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              MD 또는 Excel 파일 (.md, .xlsx, .xls)
            </p>
          </div>
        </label>
      </div>

      {/* 결과 표시 */}
      {parseResult && (
        <div className={`p-6 rounded-sm border ${
          parseResult.success 
            ? 'bg-primary/5 border-primary/20' 
            : 'bg-destructive/5 border-destructive/20'
        }`}>
          <div className="flex items-start gap-4">
            {parseResult.success ? (
              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p 
                className={`mb-2 ${parseResult.success ? 'text-primary' : 'text-destructive'}`}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                {parseResult.success ? '✅ 업로드 성공' : '❌ 업로드 실패'}
              </p>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                {parseResult.message}
              </p>
              
              {parseResult.success && parseResult.questions && (
                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    등록된 문제 미리보기:
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {parseResult.questions.slice(0, 5).map((q, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-sm">
                        <span className="font-medium">문제 {idx + 1}:</span> {q.question.substring(0, 50)}
                        {q.question.length > 50 ? '...' : ''} 
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                          q.correctAnswer === 1 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}>
                          {q.correctAnswer === 1 ? 'O' : 'X'}
                        </span>
                      </div>
                    ))}
                    {parseResult.questions.length > 5 && (
                      <p className="text-xs text-muted-foreground italic">
                        외 {parseResult.questions.length - 5}개 문제...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// ==================== Q&A 설정 오류 안내 컴포넌트 ====================

import { AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function QnASetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Apps Script 설정이 필요합니다</AlertTitle>
          <AlertDescription className="mt-2">
            Google Apps Script가 올바르게 배포되지 않았습니다. 아래 가이드를 따라 설정해주세요.
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🚀 빠른 해결 방법</CardTitle>
            <CardDescription>
              Google Apps Script 배포 설정을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6cb25b] text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Apps Script 열기</p>
                  <p className="text-sm text-gray-600">
                    Google Sheets → 확장 프로그램 → Apps Script
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6cb25b] text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-900">배포 설정 확인</p>
                  <p className="text-sm text-gray-600 mb-2">
                    배포 → 배포 관리 → 수정
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded p-3">
                    <p className="text-sm font-medium text-amber-900 mb-1">⭐ 중요!</p>
                    <p className="text-sm text-amber-800">
                      <strong>액세스 권한:</strong> "모든 사용자"로 변경
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6cb25b] text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-900">새 버전 배포</p>
                  <p className="text-sm text-gray-600">
                    새 버전 생성 → 배포 → 웹 앱 URL 복사
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6cb25b] text-white flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-gray-900">.env 파일 업데이트</p>
                  <p className="text-sm text-gray-600 mb-2">
                    새 URL로 환경 변수 업데이트
                  </p>
                  <div className="bg-gray-50 rounded p-3 font-mono text-xs">
                    VITE_QNA_APPS_SCRIPT_URL=https://script.google.com/.../exec
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6cb25b] text-white flex items-center justify-center text-sm font-bold">
                  5
                </div>
                <div>
                  <p className="font-semibold text-gray-900">개발 서버 재시작</p>
                  <p className="text-sm text-gray-600">
                    터미널에서 Ctrl+C 후 다시 npm run dev
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>🔍 URL 확인 방법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">✅ 올바른 URL:</p>
                <div className="bg-green-50 border border-green-200 rounded p-3 font-mono text-xs break-all">
                  https://script.google.com/macros/s/AKfycbxXXXXXXXXX<strong className="text-green-700">/exec</strong>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900 mb-2">❌ 잘못된 URL:</p>
                <div className="bg-red-50 border border-red-200 rounded p-3 font-mono text-xs break-all">
                  https://script.google.com/macros/s/AKfycbxXXXXXXXXX<strong className="text-red-700">/dev</strong>
                </div>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ /dev는 개발 모드로 인증이 필요합니다!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900 mb-2">브라우저에서 직접 테스트</p>
                <p className="text-sm text-blue-800 mb-3">
                  Apps Script URL을 브라우저 주소창에 입력하여 테스트:
                </p>
                <div className="bg-white rounded p-3 font-mono text-xs break-all mb-3 border border-blue-200">
                  https://script.google.com/.../exec?action=getCategories
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <strong>성공:</strong> JSON 데이터가 표시됨
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      <strong>실패:</strong> HTML 페이지가 표시됨 → 배포 설정 확인
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button
            onClick={() => window.open('/QNA_DEPLOYMENT_TROUBLESHOOTING.md', '_blank')}
            className="bg-[#6cb25b] hover:bg-[#5a9a4d]"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            상세 가이드 보기
          </Button>
        </div>
      </div>
    </div>
  );
}

import { AlertCircle, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AppsScriptErrorProps {
  error: Error;
  system: 'ADMIN' | 'LOG' | 'QNA' | 'TEST';
}

export function AppsScriptError({ error, system }: AppsScriptErrorProps) {
  const isConfigError = error.message.includes('Apps Script 설정 오류') || 
                        error.message.includes('HTML을 반환');

  if (!isConfigError) {
    return null;
  }

  const systemNames = {
    ADMIN: '회원/공지/강의 시스템',
    LOG: '접속 로그 시스템',
    QNA: 'Q&A 게시판 시스템',
    TEST: '시험 시스템'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="max-w-2xl w-full border-destructive bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div>
              <CardTitle 
                className="text-destructive"
                style={{ fontFamily: 'Playfair Display', fontWeight: 500 }}
              >
                Google Apps Script 설정 오류
              </CardTitle>
              <CardDescription>
                {systemNames[system]}의 배포 설정을 확인해주세요
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>발생한 오류</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h3 
              className="font-medium"
              style={{ fontFamily: 'Inter', fontWeight: 500 }}
            >
              해결 방법:
            </h3>
            
            <ol 
              className="space-y-2 list-decimal list-inside"
              style={{ fontFamily: 'Inter', fontWeight: 300 }}
            >
              <li>
                Google Apps Script 프로젝트 열기
                <br />
                <code className="text-sm bg-muted px-2 py-1 rounded mt-1 inline-block">
                  https://script.google.com
                </code>
              </li>
              
              <li className="mt-2">
                <strong>배포 → 새 배포</strong> 클릭
              </li>
              
              <li className="mt-2">
                유형 선택: <strong>"웹 앱"</strong>
              </li>
              
              <li className="mt-2">
                <strong className="text-destructive">중요:</strong> 
                {' '}액세스 권한을 <strong>"모든 사용자"</strong>로 설정
              </li>
              
              <li className="mt-2">
                배포 후 <code className="text-sm bg-muted px-2 py-1 rounded">/exec</code> URL 복사
              </li>
              
              <li className="mt-2">
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  /src/app/utils/gas-api.ts
                </code>
                {' '}파일의 <code className="text-sm bg-muted px-2 py-1 rounded">GAS_API.{system}</code> URL 업데이트
              </li>
            </ol>

            <Alert>
              <Settings className="h-4 w-4" />
              <AlertTitle>자세한 설정 가이드</AlertTitle>
              <AlertDescription>
                전체 설정 과정은 프로젝트의{' '}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  /APPS_SCRIPT_SETUP.md
                </code>
                {' '}파일을 참조하세요.
              </AlertDescription>
            </Alert>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => window.open('https://script.google.com', '_blank')}
              className="flex-1"
              style={{ fontFamily: 'Inter', fontWeight: 400 }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Apps Script 열기
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex-1"
              style={{ fontFamily: 'Inter', fontWeight: 400 }}
            >
              새로고침
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

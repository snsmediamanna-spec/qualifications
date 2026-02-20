import { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadButtonProps {
  onImageUploaded: (imageUrl: string) => void;
  apiUrl: string;
}

export function ImageUploadButton({ onImageUploaded, apiUrl }: ImageUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일인지 확인
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('파일 크기는 50MB 이하여야 합니다.');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(10);

      // Base64 변환
      const base64 = await convertFileToBase64(file);
      setProgress(30);

      console.log('🔄 이미지 업로드 시작:', file.name);

      // ✅ Imgur API를 사용한 이미지 업로드 (무료, 안정적)
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': 'Client-ID 546c25a59c58ad7', // 공개 Client ID
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          image: base64,
          type: 'base64'
        })
      });

      setProgress(70);

      const result = await response.json();
      setProgress(100);

      console.log('📥 Imgur 응답:', result);

      if (result.success && result.data && result.data.link) {
        const imageUrl = result.data.link;
        console.log('✅ 이미지 업로드 성공:', imageUrl);
        onImageUploaded(imageUrl);
      } else {
        throw new Error('이미지 업로드 실패');
      }
    } catch (error) {
      console.error('❌ 이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
      setProgress(0);
      // 파일 입력 초기화
      e.target.value = '';
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
        className="hidden"
        id="image-upload-input"
      />
      <label
        htmlFor="image-upload-input"
        className={`inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg cursor-pointer transition-all hover:bg-purple-700 ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            업로드 중... {progress}%
          </>
        ) : (
          <>
            <ImageIcon className="h-4 w-4" />
            이미지 업로드
          </>
        )}
      </label>
    </div>
  );
}
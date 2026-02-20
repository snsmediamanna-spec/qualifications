import { useMemo, useRef, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageUploadButton } from './ImageUploadButton';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  apiUrl: string;
  placeholder?: string;
}

// Suppress findDOMNode deprecation warning from react-quill
// This is a known issue with react-quill and will be fixed in future versions
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args) => {
    const stringified = args.join(' ');
    if (stringified.includes('findDOMNode')) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args) => {
    const stringified = args.join(' ');
    if (stringified.includes('findDOMNode')) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export function RichTextEditor({ value, onChange, apiUrl, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null);

  // ✅ base64 이미지를 Google Drive URL로 변환하는 함수
  const convertBase64ToGoogleDrive = useCallback(async (base64: string, fileName: string, mimeType: string) => {
    try {
      console.log('🔄 Base64를 Google Drive로 변환 중...');
      
      const base64Data = base64.split(',')[1];
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'uploadImage',
          fileName: fileName || `image-${Date.now()}.png`,
          fileData: base64Data,
          mimeType: mimeType || 'image/png'
        })
      });

      const result = await response.json();
      
      if (result.success && result.imageUrl) {
        console.log('✅ 변환 성공:', result.imageUrl);
        return result.imageUrl;
      } else {
        console.error('❌ 변환 실패:', result);
        return null;
      }
    } catch (error) {
      console.error('변환 오류:', error);
      return null;
    }
  }, [apiUrl]);

  // 이미지 업로드 핸들러 (파일을 Imgur에 업로드)
  const handleImageUpload = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
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
        console.log('📷 이미지 업로드 시작:', file.name);

        // Base64 변환
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Full = reader.result as string;
          const base64Data = base64Full.split(',')[1];
          
          try {
            // ✅ Imgur API를 사용한 이미지 업로드
            const response = await fetch('https://api.imgur.com/3/image', {
              method: 'POST',
              headers: {
                'Authorization': 'Client-ID 546c25a59c58ad7',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                image: base64Data,
                type: 'base64'
              })
            });

            const result = await response.json();
            console.log('📥 Imgur 응답:', result);

            if (result.success && result.data && result.data.link) {
              const imageUrl = result.data.link;
              console.log('✅ 이미지 업로드 성공:', imageUrl);

              // Quill 에디터에 이미지 삽입
              const quill = quillRef.current?.getEditor();
              if (quill) {
                const range = quill.getSelection(true);
                const index = range ? range.index : quill.getLength();
                
                quill.insertEmbed(index, 'image', imageUrl);
                
                // 커서를 이미지 다음으로 이동하고 줄바꿈 추가
                quill.setSelection(index + 1);
                quill.insertText(index + 1, '\n');
                quill.setSelection(index + 2);
                quill.focus();
                
                console.log('✅ 이미지 삽입 완료!');
              }
            } else {
              throw new Error('이미지 업로드 실패');
            }
          } catch (error) {
            console.error('❌ 이미지 업로드 오류:', error);
            alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          }
        };
        reader.onerror = () => {
          alert('파일을 읽는 중 오류가 발생했습니다.');
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('이미지 업로드 오류:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };
  }, []);

  // Quill 에디터 모듈 설정
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'align': [] }],
          ['link', 'image', 'video'],
          ['blockquote', 'code-block'],
          ['clean'],
        ],
        handlers: {
          image: handleImageUpload  // ✅ 커스텀 이미지 핸들러 연결
        }
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [handleImageUpload]  // ✅ handleImageUpload 의존성 추가
  );

  // Quill 에디터 포맷 설정
  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'direction',
    'align',
    'link',
    'image',
    'video',
    'blockquote',
    'code-block',
  ];

  return (
    <div className="rich-text-editor-wrapper">
      {/* 이미지 업로드 버튼 */}
      <div className="mb-4 flex items-center gap-3 p-4 bg-muted border border-border">
        <ImageUploadButton 
          onImageUploaded={(imageUrl) => {
            const currentContent = value || '';
            const imageHtml = `<p><img src="${imageUrl}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="업로드된 이미지" /></p><p><br></p>`;
            onChange(currentContent + imageHtml);
          }} 
          apiUrl={apiUrl} 
        />
        <span 
          className="text-sm text-muted-foreground"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
        >
          이미지 추가
        </span>
      </div>

      {/* React Quill 에디터 */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder || '내용을 입력하세요...'}
        className="bg-input-background"
        style={{
          minHeight: '400px',
          fontFamily: "'Inter', sans-serif"
        }}
      />

      {/* 커스텀 스타일 */}
      <style>{`
        .rich-text-editor-wrapper .ql-container {
          min-height: 400px;
          font-size: 16px;
          font-family: 'Inter', sans-serif;
          border: 1px solid var(--color-border);
          background: #ffffff !important; /* 항상 흰색 배경 */
        }

        .rich-text-editor-wrapper .ql-editor {
          min-height: 400px;
          color: #000000 !important; /* 항상 검은색 텍스트 */
          background: #ffffff !important; /* 항상 흰색 배경 */
        }

        .rich-text-editor-wrapper .ql-editor * {
          color: #000000 !important; /* 모든 자식 요소도 검은색 */
        }

        .rich-text-editor-wrapper .ql-editor p,
        .rich-text-editor-wrapper .ql-editor ol,
        .rich-text-editor-wrapper .ql-editor ul {
          margin-bottom: 1em;
          color: #000000 !important; /* 항상 검은색 */
        }
        
        .rich-text-editor-wrapper .ql-editor h1,
        .rich-text-editor-wrapper .ql-editor h2,
        .rich-text-editor-wrapper .ql-editor h3,
        .rich-text-editor-wrapper .ql-editor h4,
        .rich-text-editor-wrapper .ql-editor h5,
        .rich-text-editor-wrapper .ql-editor h6 {
          color: #000000 !important; /* 항상 검은색 */
        }

        .rich-text-editor-wrapper .ql-editor div,
        .rich-text-editor-wrapper .ql-editor span,
        .rich-text-editor-wrapper .ql-editor strong,
        .rich-text-editor-wrapper .ql-editor em {
          color: #000000 !important; /* 모든 요소 검은색 */
        }

        .rich-text-editor-wrapper .ql-editor img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
        }

        .rich-text-editor-wrapper .ql-toolbar {
          background-color: var(--color-muted);
          border: 1px solid var(--color-border);
          border-bottom: none;
        }

        .rich-text-editor-wrapper .ql-toolbar button {
          width: 28px !important;
          height: 28px !important;
          padding: 4px !important;
        }

        .rich-text-editor-wrapper .ql-toolbar button svg {
          width: 18px !important;
          height: 18px !important;
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: var(--color-foreground);
          stroke-width: 2;
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-fill {
          fill: var(--color-foreground);
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-picker {
          font-size: 14px;
        }

        .rich-text-editor-wrapper .ql-toolbar .ql-picker-label {
          padding: 2px 8px;
        }

        .rich-text-editor-wrapper .ql-stroke {
          stroke: var(--color-foreground);
        }

        .rich-text-editor-wrapper .ql-fill {
          fill: var(--color-foreground);
        }

        .rich-text-editor-wrapper .ql-picker-label {
          color: var(--color-foreground);
        }

        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #999999 !important; /* placeholder 색상 */
          font-style: normal;
          font-weight: 300;
        }

        .rich-text-editor-wrapper .ql-editor h1 {
          font-size: 2em;
          font-weight: 400;
          margin: 0.67em 0;
          font-family: 'Playfair Display', serif;
        }

        .rich-text-editor-wrapper .ql-editor h2 {
          font-size: 1.5em;
          font-weight: 400;
          margin: 0.75em 0;
          font-family: 'Playfair Display', serif;
        }

        .rich-text-editor-wrapper .ql-editor h3 {
          font-size: 1.17em;
          font-weight: 400;
          margin: 0.83em 0;
          font-family: 'Playfair Display', serif;
        }

        .rich-text-editor-wrapper .ql-editor a {
          color: #6cb25b; /* 초록색 링크 */
          text-decoration: underline;
        }

        .rich-text-editor-wrapper .ql-editor blockquote {
          border-left: 4px solid var(--color-border);
          padding-left: 16px;
          margin-left: 0;
          margin-right: 0;
          color: #666666 !important; /* blockquote는 약간 회색 */
        }

        .rich-text-editor-wrapper .ql-editor pre {
          background-color: #f5f5f5; /* 코드 블록 배경 */
          border: 1px solid #dddddd;
          padding: 12px;
          overflow-x: auto;
          color: #000000 !important;
        }

        .rich-text-editor-wrapper .ql-editor code {
          background-color: #f5f5f5;
          padding: 2px 6px;
          font-family: 'Courier New', monospace;
          color: #000000 !important;
        }

        @media (max-width: 768px) {
          .rich-text-editor-wrapper .ql-container {
            min-height: 200px !important;
          }
          .rich-text-editor-wrapper .ql-editor {
            min-height: 200px !important;
          }
        }
      `}</style>
    </div>
  );
}
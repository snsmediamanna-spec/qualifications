import{r as p,j as o,k as j}from"./react-core-CXzVGR1A.js";import{n as v,a3 as N}from"./lucide-COJOwLBG.js";function D({onImageUploaded:c,apiUrl:m}){const[a,d]=p.useState(!1),[f,n]=p.useState(0),b=async i=>{var l;const r=(l=i.target.files)==null?void 0:l[0];if(r){if(!r.type.startsWith("image/")){alert("이미지 파일만 업로드 가능합니다.");return}if(r.size>50*1024*1024){alert("파일 크기는 50MB 이하여야 합니다.");return}try{d(!0),n(10);const e=await w(r);n(30),console.log("🔄 이미지 업로드 시작:",r.name);const u=await fetch("https://api.imgur.com/3/image",{method:"POST",headers:{Authorization:"Client-ID 546c25a59c58ad7","Content-Type":"application/json"},body:JSON.stringify({image:e,type:"base64"})});n(70);const t=await u.json();if(n(100),console.log("📥 Imgur 응답:",t),t.success&&t.data&&t.data.link){const h=t.data.link;console.log("✅ 이미지 업로드 성공:",h),c(h)}else throw new Error("이미지 업로드 실패")}catch(e){console.error("❌ 이미지 업로드 오류:",e),alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.")}finally{d(!1),n(0),i.target.value=""}}},w=i=>new Promise((r,l)=>{const e=new FileReader;e.onload=()=>{const t=e.result.split(",")[1];r(t)},e.onerror=l,e.readAsDataURL(i)});return o.jsxs("div",{className:"relative inline-block",children:[o.jsx("input",{type:"file",accept:"image/*",onChange:b,disabled:a,className:"hidden",id:"image-upload-input"}),o.jsx("label",{htmlFor:"image-upload-input",className:`inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg cursor-pointer transition-all hover:bg-purple-700 ${a?"opacity-50 cursor-not-allowed":""}`,children:a?o.jsxs(o.Fragment,{children:[o.jsx(v,{className:"h-4 w-4 animate-spin"}),"업로드 중... ",f,"%"]}):o.jsxs(o.Fragment,{children:[o.jsx(N,{className:"h-4 w-4"}),"이미지 업로드"]})})]})}if(typeof window<"u"){const c=console.error,m=console.warn;console.error=(...a)=>{a.join(" ").includes("findDOMNode")||c.apply(console,a)},console.warn=(...a)=>{a.join(" ").includes("findDOMNode")||m.apply(console,a)}}function z({value:c,onChange:m,apiUrl:a,placeholder:d}){const f=p.useRef(null);p.useCallback(async(i,r,l)=>{try{console.log("🔄 Base64를 Google Drive로 변환 중...");const e=i.split(",")[1],t=await(await fetch(a,{method:"POST",body:JSON.stringify({action:"uploadImage",fileName:r||`image-${Date.now()}.png`,fileData:e,mimeType:l||"image/png"})})).json();return t.success&&t.imageUrl?(console.log("✅ 변환 성공:",t.imageUrl),t.imageUrl):(console.error("❌ 변환 실패:",t),null)}catch(e){return console.error("변환 오류:",e),null}},[a]);const n=p.useCallback(()=>{const i=document.createElement("input");i.setAttribute("type","file"),i.setAttribute("accept","image/*"),i.click(),i.onchange=async()=>{var l;const r=(l=i.files)==null?void 0:l[0];if(r){if(!r.type.startsWith("image/")){alert("이미지 파일만 업로드 가능합니다.");return}if(r.size>50*1024*1024){alert("파일 크기는 50MB 이하여야 합니다.");return}try{console.log("📷 이미지 업로드 시작:",r.name);const e=new FileReader;e.onload=async()=>{var h;const t=e.result.split(",")[1];try{const g=await(await fetch("https://api.imgur.com/3/image",{method:"POST",headers:{Authorization:"Client-ID 546c25a59c58ad7","Content-Type":"application/json"},body:JSON.stringify({image:t,type:"base64"})})).json();if(console.log("📥 Imgur 응답:",g),g.success&&g.data&&g.data.link){const y=g.data.link;console.log("✅ 이미지 업로드 성공:",y);const s=(h=f.current)==null?void 0:h.getEditor();if(s){const k=s.getSelection(!0),x=k?k.index:s.getLength();s.insertEmbed(x,"image",y),s.setSelection(x+1),s.insertText(x+1,`
`),s.setSelection(x+2),s.focus(),console.log("✅ 이미지 삽입 완료!")}}else throw new Error("이미지 업로드 실패")}catch(q){console.error("❌ 이미지 업로드 오류:",q),alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.")}},e.onerror=()=>{alert("파일을 읽는 중 오류가 발생했습니다.")},e.readAsDataURL(r)}catch(e){console.error("이미지 업로드 오류:",e),alert("이미지 업로드에 실패했습니다.")}}}},[]),b=p.useMemo(()=>({toolbar:{container:[[{header:[1,2,3,4,5,6,!1]}],[{font:[]}],[{size:["small",!1,"large","huge"]}],["bold","italic","underline","strike"],[{color:[]},{background:[]}],[{script:"sub"},{script:"super"}],[{list:"ordered"},{list:"bullet"}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{align:[]}],["link","image","video"],["blockquote","code-block"],["clean"]],handlers:{image:n}},clipboard:{matchVisual:!1}}),[n]),w=["header","font","size","bold","italic","underline","strike","color","background","script","list","bullet","indent","direction","align","link","image","video","blockquote","code-block"];return o.jsxs("div",{className:"rich-text-editor-wrapper",children:[o.jsxs("div",{className:"mb-4 flex items-center gap-3 p-4 bg-muted border border-border",children:[o.jsx(D,{onImageUploaded:i=>{const r=c||"",l=`<p><img src="${i}" style="max-width: 100%; height: auto; margin: 10px 0;" alt="업로드된 이미지" /></p><p><br></p>`;m(r+l)},apiUrl:a}),o.jsx("span",{className:"text-sm text-muted-foreground",style:{fontFamily:"'Inter', sans-serif",fontWeight:300},children:"이미지 추가"})]}),o.jsx(j,{ref:f,theme:"snow",value:c,onChange:m,modules:b,formats:w,placeholder:d||"내용을 입력하세요...",className:"bg-input-background",style:{minHeight:"400px",fontFamily:"'Inter', sans-serif"}}),o.jsx("style",{children:`
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
      `})]})}export{z as R};

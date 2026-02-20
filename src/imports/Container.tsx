import svgPaths from "./svg-dzzgge1u5c";

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_2196_1591)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p17212180} id="Vector_2" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M1.66667 10H18.3333" id="Vector_3" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_2196_1591">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="bg-[rgba(108,178,91,0.1)] relative rounded-[33554400px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[14px] not-italic relative shrink-0 text-[#1a1c1b] text-[14px]">공개 질문</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[20px] left-0 not-italic text-[#6b6d6a] text-[14px] top-0">다른 회원들도 질문과 답변을 볼 수 있습니다.</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="flex-[1_0_0] h-[38px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <PrimitiveLabel />
        <Paragraph />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[40px] relative shrink-0 w-[311.422px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-start relative size-full">
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function PrimitiveSpan() {
  return <div className="bg-white rounded-[33554400px] shrink-0 size-[16px]" data-name="Primitive.span" />;
}

function PrimitiveButton() {
  return (
    <div className="bg-[#6cb25b] h-[44px] relative rounded-[33554400px] shrink-0 w-[105px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[33554400px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center pl-[15px] pr-px py-px relative size-full">
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[44px] relative shrink-0 w-[748px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between relative size-full">
        <Container2 />
        <PrimitiveButton />
      </div>
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-[rgba(229,225,216,0.3)] content-stretch flex flex-col items-start pb-px pl-[25px] pr-px pt-[17px] relative rounded-[12px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <Container1 />
    </div>
  );
}
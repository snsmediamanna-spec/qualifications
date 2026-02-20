import svgPaths from "./svg-dxs0jmenk0";

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[31.188px] relative shrink-0 w-[94.188px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Playfair_Display:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[31.2px] left-0 text-[#1a1c1b] text-[24px] top-[-1px]">기본 정보</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48.188px] items-center pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <Icon />
      <Heading />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute h-[14px] left-[33.77px] top-0 w-[7.016px]" data-name="Text">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#d4183d] text-[14px] top-0">*</p>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
      <p className="absolute font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#1a1c1b] text-[14px] top-0">{`이름 `}</p>
      <Text />
    </div>
  );
}

function TextInput() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">홍길동</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container4() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <PrimitiveLabel />
      <TextInput />
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute h-[14px] left-[46.64px] top-0 w-[7.016px]" data-name="Text">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#d4183d] text-[14px] top-0">*</p>
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
      <p className="absolute font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#1a1c1b] text-[14px] top-0">{`이메일 `}</p>
      <Text1 />
    </div>
  );
}

function EmailInput() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Email Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">your@email.com</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container5() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <PrimitiveLabel1 />
      <EmailInput />
    </div>
  );
}

function Container3() {
  return (
    <div className="gap-x-[20px] gap-y-[20px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[70px] relative shrink-0 w-full" data-name="Container">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute h-[14px] left-[59.53px] top-0 w-[7.016px]" data-name="Text">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#d4183d] text-[14px] top-0">*</p>
    </div>
  );
}

function PrimitiveLabel2() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
      <p className="absolute font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#1a1c1b] text-[14px] top-0">{`전화번호 `}</p>
      <Text2 />
    </div>
  );
}

function PhoneInput() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Phone Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">010-0000-0000</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel2 />
      <PhoneInput />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[228.188px] items-start relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
      <Container6 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[31.188px] relative shrink-0 w-[88.328px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Playfair_Display:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[31.2px] left-0 text-[#1a1c1b] text-[24px] top-[-1px]">생년월일</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48.188px] items-center pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <Icon1 />
      <Heading1 />
    </div>
  );
}

function PrimitiveLabel3() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] not-italic relative shrink-0 text-[#1a1c1b] text-[14px]">년도</p>
    </div>
  );
}

function Option() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option1() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option2() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option3() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option4() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option5() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option6() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option7() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option8() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option9() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option10() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option11() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option12() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option13() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option14() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option15() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option16() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option17() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option18() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option19() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option20() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option21() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option22() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option23() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option24() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option25() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option26() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option27() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option28() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option29() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option30() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option31() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option32() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option33() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option34() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option35() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option36() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option37() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option38() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option39() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option40() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option41() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option42() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option43() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option44() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option45() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option46() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option47() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option48() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option49() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option50() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option51() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option52() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option53() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option54() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option55() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option56() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option57() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option58() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option59() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option60() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option61() {
  return <div className="absolute left-[-369.5px] size-0 top-[177.44px]" data-name="Option" />;
}

function Dropdown() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Option />
      <Option1 />
      <Option2 />
      <Option3 />
      <Option4 />
      <Option5 />
      <Option6 />
      <Option7 />
      <Option8 />
      <Option9 />
      <Option10 />
      <Option11 />
      <Option12 />
      <Option13 />
      <Option14 />
      <Option15 />
      <Option16 />
      <Option17 />
      <Option18 />
      <Option19 />
      <Option20 />
      <Option21 />
      <Option22 />
      <Option23 />
      <Option24 />
      <Option25 />
      <Option26 />
      <Option27 />
      <Option28 />
      <Option29 />
      <Option30 />
      <Option31 />
      <Option32 />
      <Option33 />
      <Option34 />
      <Option35 />
      <Option36 />
      <Option37 />
      <Option38 />
      <Option39 />
      <Option40 />
      <Option41 />
      <Option42 />
      <Option43 />
      <Option44 />
      <Option45 />
      <Option46 />
      <Option47 />
      <Option48 />
      <Option49 />
      <Option50 />
      <Option51 />
      <Option52 />
      <Option53 />
      <Option54 />
      <Option55 />
      <Option56 />
      <Option57 />
      <Option58 />
      <Option59 />
      <Option60 />
      <Option61 />
    </div>
  );
}

function Container10() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[70px] items-start left-0 top-0 w-[223.328px]" data-name="Container">
      <PrimitiveLabel3 />
      <Dropdown />
    </div>
  );
}

function PrimitiveLabel4() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] not-italic relative shrink-0 text-[#1a1c1b] text-[14px]">월</p>
    </div>
  );
}

function Option62() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option63() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option64() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option65() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option66() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option67() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option68() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option69() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option70() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option71() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option72() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option73() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option74() {
  return <div className="absolute left-[-608.83px] size-0 top-[177.44px]" data-name="Option" />;
}

function Dropdown1() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Option62 />
      <Option63 />
      <Option64 />
      <Option65 />
      <Option66 />
      <Option67 />
      <Option68 />
      <Option69 />
      <Option70 />
      <Option71 />
      <Option72 />
      <Option73 />
      <Option74 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[70px] items-start left-[239.33px] top-0 w-[223.328px]" data-name="Container">
      <PrimitiveLabel4 />
      <Dropdown1 />
    </div>
  );
}

function PrimitiveLabel5() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] not-italic relative shrink-0 text-[#1a1c1b] text-[14px]">일</p>
    </div>
  );
}

function Option75() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option76() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option77() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option78() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option79() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option80() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option81() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option82() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option83() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option84() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option85() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option86() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option87() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option88() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option89() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option90() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option91() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option92() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option93() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option94() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option95() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option96() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option97() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option98() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option99() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option100() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option101() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option102() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option103() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option104() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option105() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Option106() {
  return <div className="absolute left-[-848.16px] size-0 top-[177.44px]" data-name="Option" />;
}

function Dropdown2() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Dropdown">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <Option75 />
      <Option76 />
      <Option77 />
      <Option78 />
      <Option79 />
      <Option80 />
      <Option81 />
      <Option82 />
      <Option83 />
      <Option84 />
      <Option85 />
      <Option86 />
      <Option87 />
      <Option88 />
      <Option89 />
      <Option90 />
      <Option91 />
      <Option92 />
      <Option93 />
      <Option94 />
      <Option95 />
      <Option96 />
      <Option97 />
      <Option98 />
      <Option99 />
      <Option100 />
      <Option101 />
      <Option102 />
      <Option103 />
      <Option104 />
      <Option105 />
      <Option106 />
    </div>
  );
}

function Container12() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[70px] items-start left-[478.66px] top-0 w-[223.328px]" data-name="Container">
      <PrimitiveLabel5 />
      <Dropdown2 />
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[70px] relative shrink-0 w-full" data-name="Container">
      <Container10 />
      <Container11 />
      <Container12 />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[138.188px] items-start relative shrink-0 w-full" data-name="Container">
      <Container8 />
      <Container9 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p26ddc800} id="Vector" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p35ba4680} id="Vector_2" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[31.188px] relative shrink-0 w-[44.172px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Playfair_Display:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[31.2px] left-0 text-[#1a1c1b] text-[24px] top-[-1px]">주소</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48.188px] items-center pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <Icon2 />
      <Heading2 />
    </div>
  );
}

function TextInput1() {
  return (
    <div className="bg-white flex-[1_0_0] h-[48px] min-h-px min-w-px relative rounded-[6px]" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">우편번호</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#6cb25b] h-[48px] relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] shrink-0 w-[111.156px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[24px] left-[56px] not-italic text-[16px] text-center text-white top-[11px]">주소 검색</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48px] items-start relative shrink-0 w-full" data-name="Container">
      <TextInput1 />
      <Button />
    </div>
  );
}

function TextInput2() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">주소</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function TextInput3() {
  return (
    <div className="bg-white h-[48px] relative rounded-[6px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">상세 주소</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] h-[168px] items-start relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <TextInput2 />
      <TextInput3 />
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[236.188px] items-start relative shrink-0 w-full" data-name="Container">
      <Container14 />
      <Container15 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2566d000} id="Vector" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1bf79e00} id="Vector_2" stroke="var(--stroke-0, #6CB25B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Heading3() {
  return (
    <div className="h-[31.188px] relative shrink-0 w-[88.328px]" data-name="Heading 3">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Playfair_Display:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[31.2px] left-0 text-[#1a1c1b] text-[24px] top-[-1px]">비밀번호</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex gap-[12px] h-[48.188px] items-center pb-px relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <Icon3 />
      <Heading3 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute h-[14px] left-[59.53px] top-0 w-[7.016px]" data-name="Text">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#d4183d] text-[14px] top-0">*</p>
    </div>
  );
}

function PrimitiveLabel6() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
      <p className="absolute font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#1a1c1b] text-[14px] top-0">{`비밀번호 `}</p>
      <Text3 />
    </div>
  );
}

function PasswordInput() {
  return (
    <div className="absolute bg-white h-[48px] left-0 rounded-[6px] top-0 w-[702px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip pl-[12px] pr-[48px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">8자 이상, 영문/숫자/특수문자 포함</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon4() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5008 11.9991">
            <path d={svgPaths.p2be95100} id="Vector" stroke="var(--stroke-0, #6B6D6A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.p93ea200} id="Vector" stroke="var(--stroke-0, #6B6D6A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[44px] items-start left-[668px] pt-[13px] top-[2px] w-[18px]" data-name="Button">
      <Icon4 />
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <PasswordInput />
      <Button1 />
    </div>
  );
}

function Container20() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel6 />
      <Container21 />
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute h-[14px] left-[89.22px] top-0 w-[7.016px]" data-name="Text">
      <p className="absolute font-['Inter:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#d4183d] text-[14px] top-0">*</p>
    </div>
  );
}

function PrimitiveLabel7() {
  return (
    <div className="h-[14px] relative shrink-0 w-full" data-name="Primitive.label">
      <p className="absolute font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[14px] left-0 not-italic text-[#1a1c1b] text-[14px] top-0">{`비밀번호 확인 `}</p>
      <Text4 />
    </div>
  );
}

function PasswordInput1() {
  return (
    <div className="absolute bg-white h-[48px] left-0 rounded-[6px] top-0 w-[702px]" data-name="Password Input">
      <div className="content-stretch flex items-center overflow-clip pl-[12px] pr-[48px] py-[4px] relative rounded-[inherit] size-full">
        <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[normal] not-italic relative shrink-0 text-[#6b6d6a] text-[16px]">비밀번호를 다시 입력하세요</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[6px]" />
    </div>
  );
}

function Icon5() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5008 11.9991">
            <path d={svgPaths.p2be95100} id="Vector" stroke="var(--stroke-0, #6B6D6A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.p93ea200} id="Vector" stroke="var(--stroke-0, #6B6D6A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[44px] items-start left-[668px] pt-[13px] top-[2px] w-[18px]" data-name="Button">
      <Icon5 />
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <PasswordInput1 />
      <Button2 />
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[70px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel7 />
      <Container23 />
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] h-[156px] items-start relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container22 />
    </div>
  );
}

function Container17() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[224.188px] items-start relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Container19 />
    </div>
  );
}

function Heading4() {
  return (
    <div className="h-[48.188px] relative shrink-0 w-full" data-name="Heading 3">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0.05)] border-b border-solid inset-0 pointer-events-none" />
      <p className="absolute font-['Playfair_Display:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[31.2px] left-0 text-[#1a1c1b] text-[24px] top-[-1px]">약관 동의</p>
    </div>
  );
}

function Text5() {
  return <div className="h-[24.375px] shrink-0 w-[7.516px]" data-name="Text" />;
}

function Button3() {
  return (
    <div className="h-[44px] relative shrink-0 w-[41.125px]" data-name="Button">
      <p className="-translate-x-1/2 absolute decoration-solid font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[21px] not-italic text-[#6cb25b] text-[16px] text-center top-[9px] underline">(보기)</p>
    </div>
  );
}

function PrimitiveLabel8() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[19px] items-center relative w-full">
        <Text5 />
        <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[24.375px] not-italic relative shrink-0 text-[#1a1c1b] text-[15px]">{`이용약관에 동의합니다 `}</p>
        <Button3 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-center justify-center left-px top-[3px] w-[18px]" data-name="Primitive.span">
      <Icon6 />
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="absolute bg-[#6cb25b] left-0 rounded-[4px] size-[20px] top-[12.06px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#6cb25b] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <PrimitiveSpan />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="content-stretch flex gap-[16px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel8 />
      <PrimitiveButton />
    </div>
  );
}

function Text6() {
  return <div className="h-[24.375px] shrink-0 w-[7.516px]" data-name="Text" />;
}

function Button4() {
  return (
    <div className="h-[44px] relative shrink-0 w-[42px]" data-name="Button">
      <p className="-translate-x-1/2 absolute decoration-solid font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[21px] not-italic text-[#6cb25b] text-[16px] text-center top-[9px] underline">(보기)</p>
    </div>
  );
}

function PrimitiveLabel9() {
  return (
    <div className="content-stretch flex gap-[19px] items-center relative shrink-0 w-[702px]" data-name="Primitive.label">
      <Text6 />
      <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[24.375px] not-italic relative shrink-0 text-[#1a1c1b] text-[15px] w-[208px] whitespace-pre-wrap">{`개인정보 처리방침에 동의합니다 `}</p>
      <Button4 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p3de7e600} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function PrimitiveSpan1() {
  return (
    <div className="absolute content-stretch flex h-[14px] items-center justify-center left-px top-[3px] w-[18px]" data-name="Primitive.span">
      <Icon7 />
    </div>
  );
}

function PrimitiveButton1() {
  return (
    <div className="absolute bg-[#6cb25b] left-0 rounded-[4px] size-[20px] top-[12.06px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[#6cb25b] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <PrimitiveSpan1 />
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel9 />
      <PrimitiveButton1 />
    </div>
  );
}

function PrimitiveButton2() {
  return <div className="absolute bg-white border border-[rgba(0,0,0,0.05)] border-solid left-0 rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] size-[20px] top-[2.06px]" data-name="Primitive.button" />;
}

function PrimitiveLabel10() {
  return (
    <div className="absolute content-stretch flex h-[24.375px] items-center left-[36px] top-0 w-[666px]" data-name="Primitive.label">
      <p className="font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[24.375px] not-italic relative shrink-0 text-[#1a1c1b] text-[15px]">마케팅 정보 수신에 동의합니다 (선택)</p>
    </div>
  );
}

function Container28() {
  return (
    <div className="h-[24.375px] relative shrink-0 w-full" data-name="Container">
      <PrimitiveButton2 />
      <PrimitiveLabel10 />
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] h-[152.375px] items-start relative shrink-0 w-full" data-name="Container">
      <Container26 />
      <Container27 />
      <Container28 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] h-[224.563px] items-start relative shrink-0 w-full" data-name="Container">
      <Heading4 />
      <Container25 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="absolute left-[307.55px] size-[20px] top-[18px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2026e800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#6cb25b] h-[56px] left-0 rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] top-[16px] w-[702px]" data-name="Button">
      <Icon8 />
      <p className="-translate-x-1/2 absolute font-['Inter:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[24px] left-[365.05px] not-italic text-[16px] text-center text-white top-[15px]">회원가입</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute h-[44px] left-[147.63px] top-[-14px] w-[44.172px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Medium','Noto_Sans_KR:Medium',sans-serif] font-medium leading-[24px] left-[22.5px] not-italic text-[#6cb25b] text-[16px] text-center top-[9px]">로그인</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute h-[17px] left-[255.09px] top-[102px] w-[191.797px]" data-name="Text">
      <p className="-translate-x-1/2 absolute font-['Inter:Light','Noto_Sans_KR:Light',sans-serif] font-light leading-[21px] left-[74px] not-italic text-[#6b6d6a] text-[14px] text-center top-[-2px] w-[148px] whitespace-pre-wrap">{`이미 계정이 있으신가요? `}</p>
      <Button6 />
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[132px] relative shrink-0 w-full" data-name="Container">
      <Button5 />
      <Text7 />
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[40px] h-[1383.313px] items-start relative shrink-0 w-full" data-name="Form">
      <Container1 />
      <Container7 />
      <Container13 />
      <Container17 />
      <Container24 />
      <Container29 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start pb-px pt-[33px] px-[33px] relative rounded-[4px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]" />
      <Form />
    </div>
  );
}
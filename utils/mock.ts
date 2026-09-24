import type { NewsBodyData } from '@/types/learning';

export const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1080&h=600&fit=crop',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1080&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&h=600&fit=crop',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1080&h=600&fit=crop',
  'https://images.unsplash.com/photo-1559526324-593bc073d938?w=1080&h=600&fit=crop',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1080&h=600&fit=crop',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1080&h=600&fit=crop',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&h=600&fit=crop',
];

export const CATEGORIES = [
  { id: 'all', name: '전체' },
  { id: 'youth', name: '청년', isNew: true },
  { id: 'policy', name: '정책' },
  { id: 'finance', name: '금융', isNew: true },
  { id: 'investment', name: '투자' },
  { id: 'real-estate', name: '부동산' },
  { id: 'economy', name: '경제' },
  { id: 'job', name: '취업' },
  { id: 'saving', name: '저축' },
];

export const CARD_NEWS = [
  [
    { type: 'image', title: '청년미래적금, 6월부터 시작합니다' },
    {
      type: 'content',
      title: '청년미래적금이란?',
      description: '청년의 목돈 마련을 돕기 위해 정부가 지원하는 정책형 적금입니다.',
    },
    {
      type: 'content',
      title: '얼마나 받을 수 있을까?',
      description: '매월 일정 금액을 꾸준히 납입하면 정부기여금과 이자를 함께 받을 수 있어요.',
    },
    {
      type: 'content',
      title: '가입 전에 확인하세요',
      description: '가입 대상과 소득 기준, 납입 한도 등 세부 조건을 꼭 확인해보세요.',
    },
  ],
  [
    { type: 'image', title: '월급날마다 사라지는 내 돈, 어디로 갈까?' },
    {
      type: 'content',
      title: '고정비부터 확인하기',
      description: '월세, 통신비, 구독료처럼 매달 자동으로 빠져나가는 돈부터 확인해보세요.',
    },
    {
      type: 'content',
      title: '생활비는 따로 관리하기',
      description: '식비와 교통비처럼 매달 달라지는 지출은 예산을 정해두면 관리하기 쉬워요.',
    },
    {
      type: 'content',
      title: '남은 돈이 진짜 저축',
      description: '저축하고 남은 돈을 쓰는 방식으로 바꾸면 목표 금액을 모으기가 훨씬 쉬워집니다.',
    },
  ],
  [
    { type: 'image', title: '청년이라면 놓치면 아까운 금융 혜택 3가지' },
    {
      type: 'content',
      title: '청년도약계좌',
      description: '정부기여금과 비과세 혜택을 활용해 중장기 목돈을 마련할 수 있는 상품입니다.',
    },
    {
      type: 'content',
      title: '청년 주거 지원',
      description: '월세 지원이나 전세자금 대출 등 주거비 부담을 줄여주는 정책을 확인해보세요.',
    },
    {
      type: 'content',
      title: '정책은 내가 직접 찾아야 해요',
      description: '나이와 소득, 거주 지역에 따라 받을 수 있는 혜택이 달라질 수 있습니다.',
    },
  ],
];

export const KEYWORD_NEWS = [
  {
    id: '1',
    keyword: 'AI 기술의 발전과 미래 전망',
    image:
      'https://images.unsplash.com/photo-1581091870620-3c7e5f6b8f4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    keyword: '에너지',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto  =format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    keyword: '스페이스x',
    image:
      'https://images.unsplash.com/photo-1581091870620-3c7e5f6b8f4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    keyword: '인스페이스x',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto              =format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    keyword: '청년 도약 계좌',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto              =format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    keyword: '인공지능과 의료 혁신',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto              =format&fit=crop&w=800&q=80',
  },
  {
    id: '7',
    keyword: '인공지능과 의료 혁신',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto              =format&fit=crop&w=800&q=80',
  },
  {
    id: '8',
    keyword: '인공지능과 의료 혁신',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto              =format&fit=crop&w=800&q=80',
  },
  {
    id: '9',
    keyword: '인공지능과 의료 혁신',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto              =format&fit=crop&w=800&q=80',
  },
];

export const newsBodyMock: NewsBodyData = {
  newsId: 'news-001',
  headline: '청년 로컬크리에이터 레벨업 사업, 최대 6000만 원 지원',
  subheadline: '부산시, 지역 기반 청년 창업팀 11개 사 선정 계획 발표',
  source: '부산일보',
  publishedAt: '2025.06.04',
  readingTime: 3,
  sections: [
    {
      id: 's1',
      text: '부산시는 지방소멸 위기 극복과 지역 경제 활성화를 위해 25일부터 청년 로컬크리에이터 레벨업 사업 참여 기업을 모집한다고 밝혔다.',
    },
    {
      id: 's2',
      text: '시에 따르면 로컬크리에이터란 지역의 자연·문화 자산과 특성을 기반으로 혁신적인 아이디어를 접목해 사업적 가치를 창출하는 창업가를 뜻한다. 이번 사업의 모집 대상은 창업 7년 미만, 만 39세 이하의 청년이 대표로 있는 기업이다.',
    },
    {
      id: 's3',
      text: '시는 개인·협업형 통합 육성 기업 7개 사와 지역자원 활용 프로젝트 발굴·운영 기업 4개 사 등 총 11개 사를 선정할 계획이다.',
    },
    {
      id: 's4',
      text: '선정된 기업에는 콘텐츠 강화와 판로 확대를 위한 맞춤형 혜택이 제공된다. 일반 육성 기업에는 최대 4000만 원의 사업화 자금과 함께 기초 진단 상담(컨설팅), 비즈니스 모델 고도화 등이 지원된다.',
    },
    {
      id: 's5',
      text: '또 기업의 인지도를 높이기 위해 팝업스토어 운영, 지역 판매전 개최, 성과 공유회 등 현장 프로그램이 마련된다. 우수 기업으로 선정될 경우 최대 6000만 원까지 추가 지원을 받을 수 있다.',
    },
    {
      id: 's6',
      text: '부산시 관계자는 "이번 사업은 단순한 자금 지원을 넘어, 청년 창업가들이 지역 안에서 지속 가능한 비즈니스 생태계를 만들어갈 수 있도록 종합적으로 지원하는 데 초점을 맞추고 있다"고 밝혔다.',
    },
  ],
  terms: [
    {
      term: '로컬크리에이터',
      definition:
        '지역의 자연·문화 자산을 기반으로 혁신적인 아이디어를 접목해 사업 가치를 창출하는 창업가.',
      example: '전통 시장을 활용한 팝업스토어 브랜드를 운영하는 청년 사업가',
      category: '창업',
    },
    {
      term: '지방소멸',
      definition:
        '인구 감소와 고령화로 인해 지방 도시가 점차 기능을 잃고 소멸 위기에 처하는 사회 현상.',
      example: '20년 후 전국 228개 시군구 중 절반 이상이 지방소멸 위험 지역으로 분류될 수 있음',
      category: '정책',
    },
    {
      term: '사업화 자금',
      definition:
        '아이디어나 기술을 실제 사업으로 발전시키기 위해 정부나 기관이 지원하는 초기 창업 자금.',
      category: '창업',
    },
    {
      term: '비즈니스 모델',
      definition: '기업이 어떻게 가치를 만들고, 전달하고, 수익을 얻는지를 설명하는 사업 구조.',
      example: '구독 모델, 광고 모델, 플랫폼 모델 등',
      category: '창업',
    },
    {
      term: '판로 확대',
      definition: '제품이나 서비스를 판매할 수 있는 새로운 시장이나 유통 채널을 넓히는 것.',
      category: '경제',
    },
    {
      term: '팝업스토어',
      definition: '일정 기간 동안만 운영하는 임시 매장. 브랜드 홍보나 신제품 체험을 목적으로 함.',
      category: '창업',
    },
  ],
  quizzes: [
    {
      id: 'q1',
      question: "이 기사에서 말하는 '로컬크리에이터'의 핵심 특징은 무엇인가요?",
      choices: [
        { id: 'a', text: '해외 시장 진출을 목표로 하는 창업가' },
        { id: 'b', text: '지역 자산·문화를 기반으로 사업 가치를 창출하는 창업가' },
        { id: 'c', text: '대기업과 협력해 제품을 생산하는 사업가' },
        { id: 'd', text: '온라인 플랫폼을 통해 전국 고객을 대상으로 하는 사업가' },
      ],
      answerIndex: 1,
      explanation:
        '로컬크리에이터는 지역의 자연·문화 자산을 기반으로 혁신적 아이디어를 접목해 사업 가치를 만드는 창업가입니다. 지역성이 핵심 조건이에요.',
      honey: 10,
    },
    {
      id: 'q2',
      question: '이번 부산시 사업의 모집 대상으로 올바른 것은?',
      choices: [
        { id: 'a', text: '창업 10년 미만, 만 45세 이하 대표 기업' },
        { id: 'b', text: '창업 5년 미만, 만 35세 이하 대표 기업' },
        { id: 'c', text: '창업 7년 미만, 만 39세 이하 대표 기업' },
        { id: 'd', text: '창업 3년 미만, 만 30세 이하 대표 기업' },
      ],
      answerIndex: 2,
      explanation:
        '기사에서 "창업 7년 미만, 만 39세 이하의 청년이 대표로 있는 기업"이라고 명시되어 있습니다.',
      honey: 10,
    },
    {
      id: 'q3',
      question: "'지방소멸'과 가장 관련 있는 현상은?",
      choices: [
        { id: 'a', text: '도시 인프라 과잉 공급' },
        { id: 'b', text: '인구 감소와 고령화로 지방 도시 기능 상실' },
        { id: 'c', text: '대기업의 지방 이전 증가' },
        { id: 'd', text: '지방 부동산 가격 급등' },
      ],
      answerIndex: 1,
      explanation:
        '지방소멸은 인구 감소와 고령화가 주된 원인으로, 지방 도시가 점차 기능을 잃어가는 현상을 의미합니다. 이 사업은 청년을 지역에 유입·정착시켜 이를 막으려는 목적입니다.',
      honey: 15,
    },
  ],
  tags: ['청년창업', '부산', '지역경제', '로컬', '정부지원'],
};

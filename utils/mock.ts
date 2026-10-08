import type { NewsBodyData } from '@/types/learning';

// 홈 헤더
export const mockHomeHeaderData = {
  streak: 12,
  todayHoney: 30,
};

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

// 카테고리 필터 - 확정X (카테고리 변경 가능)
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
  { id: 'tech', name: '기술' },
];

export const CARD_NEWS = [
  [
    { type: 'thumbnail', title: '청년미래적금, 6월부터 시작합니다' },
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
    keyword: '청년미래적금',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'tech',
  },
  {
    id: '2',
    keyword: '에너지',
    image:
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'environment',
  },
  {
    id: '3',
    keyword: '스페이스X',
    image:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'medical',
  },
  {
    id: '4',
    keyword: '전기차 배터리',
    image:
      'https://images.unsplash.com/photo-1558449041-6203cd03d0d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'mobility',
  },
  {
    id: '5',
    keyword: '청년 월세 지원',
    image:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'finance',
  },
  {
    id: '6',
    keyword: 'SK 하이닉스',
    image:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'society',
  },
  {
    id: '7',
    keyword: '로보틱스',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'tech',
  },
  {
    id: '8',
    keyword: '글로벌 공급망',
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'economy',
  },
  {
    id: '9',
    keyword: '메타버스',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'tech',
  },
  {
    id: '10',
    keyword: '메타버스',
    image:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'tech',
  },
];

export const newsBodyMock: NewsBodyData = {
  newsId: 'news-001',
  intro: '부산시에서 주최하는 청년 로컬크리에이터 레벨업 사업을 소개합니다.',
  source: '부산일보',
  publishedAt: '2025.06.04',
  sections: [
    {
      id: 's1',
      subtitle: '부산시가 청년 로컬크리에이터를 모집해요',
      text: '부산시는 지방소멸 위기를 극복하고 지역 경제를 활성화하기 위해 청년 로컬크리에이터 레벨업 사업 참여 기업을 모집해요. 지역에서 새로운 사업을 시작하고 성장시키려는 청년 기업을 지원하는 사업이에요.',
    },
    {
      id: 's2',
      subtitle: '지역의 자원을 활용하는 창업가를 찾아요',
      text: '로컬크리에이터는 지역의 자연·문화 자산과 특성을 바탕으로 새로운 아이디어를 더해 사업적 가치를 만드는 창업가를 말해요. 이번 사업은 창업 7년 미만이고 만 39세 이하의 청년이 대표로 있는 기업이 대상이에요.',
    },
    {
      id: 's3',
      subtitle: '총 11개 기업을 선정해 지원해요',
      text: '부산시는 개인·협업형 통합 육성 기업 7개 사와 지역자원 활용 프로젝트를 발굴·운영하는 기업 4개 사 등 총 11개 사를 선정할 계획이에요.',
    },
    {
      id: 's4',
      subtitle: '사업화 자금과 다양한 성장 기회를 제공해요',
      text: '선정된 기업에는 콘텐츠 강화와 판로 확대를 위한 맞춤형 혜택이 제공돼요. 일반 육성 기업에는 최대 4000만 원의 사업화 자금과 기초 진단 상담, 비즈니스 모델 고도화 등을 지원해요.',
    },
    {
      id: 's5',
      subtitle: '우수 기업은 추가 지원도 받을 수 있어요',
      text: '기업의 인지도를 높일 수 있도록 팝업스토어 운영, 지역 판매전, 성과 공유회 등 다양한 현장 프로그램도 마련돼요. 우수 기업으로 선정되면 최대 6000만 원까지 추가 지원을 받을 수 있어요. 부산시는 단순한 자금 지원을 넘어 청년 창업가가 지역 안에서 지속 가능한 비즈니스를 만들어갈 수 있도록 종합적으로 지원할 계획이에요.',
    },
  ],
  terms: [
    {
      term: '로컬크리에이터',
      definition:
        '지역의 자연·문화 자산을 기반으로 혁신적인 아이디어를 접목해 사업 가치를 창출하는 창업가.',
      example: '전통 시장을 활용한 팝업스토어 브랜드를 운영하는 청년 사업가',
    },
    {
      term: '지방소멸',
      definition:
        '인구 감소와 고령화로 인해 지방 도시가 점차 기능을 잃고 소멸 위기에 처하는 사회 현상.',
      example: '20년 후 전국 228개 시군구 중 절반 이상이 지방소멸 위험 지역으로 분류될 수 있음',
    },
    {
      term: '사업화 자금',
      definition:
        '아이디어나 기술을 실제 사업으로 발전시키기 위해 정부나 기관이 지원하는 초기 창업 자금.',
    },
    {
      term: '비즈니스 모델',
      definition: '기업이 어떻게 가치를 만들고, 전달하고, 수익을 얻는지를 설명하는 사업 구조.',
      example: '구독 모델, 광고 모델, 플랫폼 모델 등',
    },
    {
      term: '판로 확대',
      definition: '제품이나 서비스를 판매할 수 있는 새로운 시장이나 유통 채널을 넓히는 것.',
    },
    {
      term: '팝업스토어',
      definition: '일정 기간 동안만 운영하는 임시 매장. 브랜드 홍보나 신제품 체험을 목적으로 함.',
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
// 검색 목업데이터 ----------------

export const RECENT_SEARCHES = ['기준금리', '청년도약계좌', '부동산 PF', '인플레이션'];

export const TRENDING_KEYWORDS = [
  { rank: 1, keyword: '기준금리', change: 'up' as const },
  { rank: 2, keyword: '청년창업', change: 'up' as const },
  { rank: 3, keyword: '부동산', change: 'same' as const },
  { rank: 4, keyword: '주식시장', change: 'down' as const },
  { rank: 5, keyword: '청년도약계좌', change: 'up' as const },
  { rank: 6, keyword: '환율', change: 'down' as const },
  { rank: 7, keyword: '물가', change: 'same' as const },
  { rank: 8, keyword: '취업', change: 'up' as const },
];

//마이페이지 목업데이터 ----------------

import type {
  ActivityDay,
  LearningStats,
  MyActivity,
  NotificationSetting,
  ReadHistory,
  SavedTerm,
  UserProfile,
} from '@/types/mypage';

export const mockProfile: UserProfile = {
  id: 'user-001',
  nickname: '단지',
  bio: '매일 조금씩, 경제 공부 중 ',
  avatarId: 'default',
  oauthProvider: 'kakao',
  joinedAt: '2025.03.14',
};

export const mockLearningStats: LearningStats = {
  streak: 12,
  readNewsCount: 80,
  totalQuizCount: 80,
  totalHoney: 1_240,
};

export const mockMyActivity: MyActivity = {
  correctRate: 85,
  totalQuizCount: 80,
  interestedCategories: ['경제', '투자', '금융'],
  weakCategories: ['부동산', '세금'],
};

// 최근 18주(126일) 활동 데이터 생성
function generateActivityData(): ActivityDay[] {
  const days: ActivityDay[] = [];
  const today = new Date();

  for (let i = 125; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // 최근일수록 활동 많음
    const recency = (125 - i) / 125;
    const rand = Math.random();

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    let honey = 0;

    if (rand > 0.35) {
      const weighted = rand * recency;

      if (weighted > 0.6) {
        level = 4;
        honey = 40 + Math.floor(Math.random() * 20);
      } else if (weighted > 0.4) {
        level = 3;
        honey = 25 + Math.floor(Math.random() * 15);
      } else if (weighted > 0.25) {
        level = 2;
        honey = 12 + Math.floor(Math.random() * 10);
      } else {
        level = 1;
        honey = 5 + Math.floor(Math.random() * 7);
      }
    }

    days.push({ date: dateStr, level, honey });
  }

  return days;
}

export const mockActivityData: ActivityDay[] = generateActivityData();

export const mockSavedTerms: SavedTerm[] = [
  {
    id: 't1',
    term: '로컬크리에이터',
    definition: '지역 자산·문화를 기반으로 사업 가치를 만드는 창업가',
  },
  {
    id: 't2',
    term: '지방소멸',
    definition: '인구 감소와 고령화로 지방 도시 기능이 사라지는 현상',
  },
  {
    id: 't3',
    term: '기준금리',
    definition: '한국은행이 금융기관과 거래할 때 기준이 되는 금리',
  },
  {
    id: 't4',
    term: '인플레이션',
    definition: '물가가 전반적으로 지속적으로 오르는 현상',
  },
  {
    id: 't5',
    term: '사업화 자금',
    definition: '아이디어를 실제 사업으로 발전시키기 위한 초기 창업 자금',
  },
  {
    id: 't6',
    term: '판로 확대',
    definition: '제품·서비스를 판매할 수 있는 새로운 시장·채널을 넓히는 것',
  },
];

export const mockReadHistory: ReadHistory[] = [
  {
    id: 'r1',
    title: '청년 로컬크리에이터 레벨업 사업, 최대 6000만 원 지원',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
    readAt: '오늘',
    honey: 35,
  },
  {
    id: 'r2',
    title: '한국은행, 기준금리 3.25%로 동결... 하반기 인하 가능성은?',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    readAt: '어제',
    honey: 40,
  },
  {
    id: 'r3',
    title: '청년도약계좌 가입자 100만 돌파, 실질 수익률은?',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    readAt: '2일 전',
    honey: 30,
  },
  {
    id: 'r4',
    title: '부동산 PF 리스크, 청년 전세 시장에 미치는 영향',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80',
    readAt: '3일 전',
    honey: 25,
  },
];

export const mockNotificationSettings: NotificationSetting = {
  dailyDigest: true,
  quizReminder: true,
  streakAlert: false,
};

export const AVATAR_OPTIONS = [
  {
    id: 'default',
    source: require('@/assets/avatars/default.png'),
  },
  {
    id: 'shy',
    source: require('@/assets/avatars/shy.png'),
  },
  {
    id: 'fire',
    source: require('@/assets/avatars/fire.png'),
  },
  {
    id: 'happy',
    source: require('@/assets/avatars/happy.png'),
  },
  {
    id: 'oops',
    source: require('@/assets/avatars/wow.png'),
  },
];

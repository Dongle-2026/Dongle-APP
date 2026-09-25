import type {
  ActivityDay,
  Badge,
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
  avatarEmoji: '🐝',
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

export const mockBadges: Badge[] = [
  {
    id: 'first_read',
    emoji: '📰',
    label: '첫 기사',
    description: '첫 번째 뉴스를 완독했어요',
    unlockedAt: '2025.03.14',
  },
  {
    id: 'streak_7',
    emoji: '🔥',
    label: '7일 연속',
    description: '7일 연속 학습 달성',
    unlockedAt: '2025.03.21',
  },
  {
    id: 'quiz_master',
    emoji: '🧠',
    label: '퀴즈 마스터',
    description: '퀴즈 10개 이상 맞혔어요',
    unlockedAt: '2025.04.02',
  },
  {
    id: 'term_collector',
    emoji: '📖',
    label: '용어 수집가',
    description: '용어 20개 이상 저장',
    unlockedAt: '2025.04.10',
  },
  {
    id: 'sharer',
    emoji: '🔗',
    label: '공유왕',
    description: '기사를 5회 이상 공유',
    unlockedAt: '2025.05.01',
  },
  {
    id: 'early_bird',
    emoji: '🌅',
    label: '얼리버드',
    description: '오전 7시 이전 학습 완료',
    unlockedAt: null,
  },
  {
    id: 'streak_30',
    emoji: '💎',
    label: '30일 연속',
    description: '30일 연속 학습 달성',
    unlockedAt: null,
  },
  {
    id: 'night_owl',
    emoji: '🦉',
    label: '올빼미',
    description: '자정 이후 학습 3회 이상',
    unlockedAt: null,
  },
];

export const mockSavedTerms: SavedTerm[] = [
  {
    id: 't1',
    term: '로컬크리에이터',
    definition: '지역 자산·문화를 기반으로 사업 가치를 만드는 창업가',
    category: '창업',
    savedAt: '2025.06.04',
  },
  {
    id: 't2',
    term: '지방소멸',
    definition: '인구 감소와 고령화로 지방 도시 기능이 사라지는 현상',
    category: '정책',
    savedAt: '2025.06.04',
  },
  {
    id: 't3',
    term: '기준금리',
    definition: '한국은행이 금융기관과 거래할 때 기준이 되는 금리',
    category: '금융',
    savedAt: '2025.06.02',
  },
  {
    id: 't4',
    term: '인플레이션',
    definition: '물가가 전반적으로 지속적으로 오르는 현상',
    category: '경제',
    savedAt: '2025.06.01',
  },
  {
    id: 't5',
    term: '사업화 자금',
    definition: '아이디어를 실제 사업으로 발전시키기 위한 초기 창업 자금',
    category: '창업',
    savedAt: '2025.05.30',
  },
  {
    id: 't6',
    term: '판로 확대',
    definition: '제품·서비스를 판매할 수 있는 새로운 시장·채널을 넓히는 것',
    category: '경제',
    savedAt: '2025.05.28',
  },
];

export const mockReadHistory: ReadHistory[] = [
  {
    id: 'r1',
    title: '청년 로컬크리에이터 레벨업 사업, 최대 6000만 원 지원',
    source: '부산일보',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
    readAt: '오늘',
    honey: 35,
  },
  {
    id: 'r2',
    title: '한국은행, 기준금리 3.25%로 동결... 하반기 인하 가능성은?',
    source: '연합뉴스',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80',
    readAt: '어제',
    honey: 40,
  },
  {
    id: 'r3',
    title: '청년도약계좌 가입자 100만 돌파, 실질 수익률은?',
    source: '한겨레',
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    readAt: '2일 전',
    honey: 30,
  },
  {
    id: 'r4',
    title: '부동산 PF 리스크, 청년 전세 시장에 미치는 영향',
    source: '매일경제',
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

export const AVATAR_EMOJI_OPTIONS = [
  '🐝',
  '🦊',
  '🐼',
  '🐨',
  '🦁',
  '🐯',
  '🐸',
  '🐙',
  '🦋',
  '🐬',
  '🦄',
  '🐲',
];

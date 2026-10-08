// ─── 마이페이지 관련 타입 ─────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  nickname: string;
  bio: string;
  avatarId: string;
  oauthProvider: 'kakao' | 'google' | 'apple';
  joinedAt: string;
};

export type LearningStats = {
  streak: number;
  readNewsCount: number;
  totalQuizCount: number;
  totalHoney: number;
};

export type MyActivity = {
  correctRate: number;
  totalQuizCount: number;
  interestedCategories: string[];
  weakCategories: string[];
};

// 잔디처럼 날짜별 활동량 (0~4: 없음~많음)
export type ActivityDay = {
  date: string; // 'YYYY-MM-DD'
  level: 0 | 1 | 2 | 3 | 4;
  honey: number;
};

export type SavedTerm = {
  id: string;
  term: string;
  definition: string;
  example?: string;
};

export type ReadHistory = {
  id: string;
  title: string;
  thumbnail: string;
  readAt: string;
  honey: number; // 획득한 꿀
};

export type NotificationSetting = {
  dailyDigest: boolean; // 오늘의 뉴스 알림
  quizReminder: boolean; // 퀴즈 리마인더
  streakAlert: boolean; // 스트릭 위기 알림
};

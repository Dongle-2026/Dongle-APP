// ─── 마이페이지 관련 타입 ─────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  nickname: string;
  bio: string;
  avatarEmoji: string; // 이모지 아바타
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

export type BadgeId =
  | 'first_read'
  | 'streak_7'
  | 'streak_30'
  | 'quiz_master'
  | 'term_collector'
  | 'sharer'
  | 'early_bird'
  | 'night_owl';

export type Badge = {
  id: BadgeId;
  emoji: string;
  label: string;
  description: string;
  unlockedAt: string | null; // null이면 미획득
};

export type SavedTerm = {
  id: string;
  term: string;
  definition: string;
  category: string;
  savedAt: string;
};

export type ReadHistory = {
  id: string;
  title: string;
  source: string;
  thumbnail: string;
  readAt: string;
  honey: number;
};

export type NotificationSetting = {
  dailyDigest: boolean; // 오늘의 뉴스 알림
  quizReminder: boolean; // 퀴즈 리마인더
  streakAlert: boolean; // 스트릭 위기 알림
};

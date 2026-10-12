// ─── 마이페이지 관련 타입 ─────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  nickname: string;
  bio: string;
  avatarId: string;
  profileImageUrl?: string | null;
  oauthProvider?: 'kakao' | 'google'; // [변경] 백엔드는 kakao|google, 이메일 가입은 필드 없음
  joinedAt: string;
};

export type UserStats = {
  todayHoney: number;
  streak: number;
  readNewsCount: number;
  quizCount: number;
  correctCount: number;
  totalHoney: number;
  todayDone: boolean; // [추가] 오늘 학습 완료 여부 (홈 헤더 배너)
  learnedTermCount: number; // [추가] 선택
};

export type UserActivity = {
  interests: string[];
  weaks: string[];
};

// 잔디처럼 날짜별 활동량 (0~4: 없음~많음)
export type ActivityDay = {
  date: string; // 'YYYY-MM-DD'
  level: 0 | 1 | 2 | 3 | 4;
  honey: number;
};

export type NotificationSetting = {
  dailyDigest: boolean; // 오늘의 뉴스 알림
  quizReminder: boolean; // 퀴즈 리마인더
  streakAlert: boolean; // 스트릭 위기 알림
};

export type PickedImage = {
  uri: string; // file:// 로컬 경로
  mimeType?: string;
  fileName?: string | null;
  fileSize?: number;
  width?: number;
  height?: number;
};

export type ProfileEditInput = {
  nickname: string;
  bio: string;
  avatarId: string;
  /** undefined = 사진 변경 없음 / PickedImage = 새 사진 업로드 / null = 사진 삭제(아바타로 복귀) */
  image?: PickedImage | null;
};

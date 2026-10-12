export type SavedTerm = {
  id: string;
  term: string;
  definition: string;
  example?: string;
};

export type SavedNews = {
  id: string;
  title: string;
  image?: string; // [변경] 응답에 썸네일 없음
  category: string;
  createdAt: string;
  isSaved: boolean;
  savedAt: string;
};

export type ReadHistory = {
  id: string;
  title: string;
  image?: string; // [변경] 응답에 썸네일 없음
  readAt: string; // [변경] ISO 시각 (표시는 formatRelative)
  honey: number; // 획득한 꿀
};

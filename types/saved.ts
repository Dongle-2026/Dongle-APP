export type SavedTerm = {
  id: string;
  term: string;
  definition: string;
  example?: string;
};

export type SavedNews = {
  id: string;
  title: string;
  image: string;
  category: string;
  createdAt: string;
  isSaved: boolean;
  savedAt: string;
};

export type ReadHistory = {
  id: string;
  title: string;
  image: string;
  readAt: string;
  honey: number; // 획득한 꿀
};

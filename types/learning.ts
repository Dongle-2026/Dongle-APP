// ─── 본문 학습 관련 타입 ──────────────────────────────────────────────────────

export type TermDefinition = {
  term: string;
  definition: string;
  example?: string;
  category: '경제' | '정책' | '금융' | '창업' | '일반';
};

export type QuizChoice = {
  id: string;
  text: string;
};

export type Quiz = {
  id: string;
  question: string;
  choices: QuizChoice[];
  answerIndex: number;
  explanation: string;
  honey: number; // 획득 꿀 포인트
};

export type NewsBodySection = {
  id: string;
  text: string;
};

export type NewsBodyData = {
  newsId: string;
  headline: string;
  subheadline?: string;
  source: string;
  publishedAt: string;
  readingTime: number; // 분
  sections: NewsBodySection[];
  terms: TermDefinition[];
  quizzes: Quiz[];
  tags: string[];
};

export type QuizResult = {
  quizId: string;
  selectedIndex: number;
  isCorrect: boolean;
  earnedHoney: number;
};

export type LearningSession = {
  newsId: string;
  startedAt: Date;
  completedReading: boolean;
  quizResults: QuizResult[];
  totalEarnedHoney: number;
  savedTerms: string[];
};

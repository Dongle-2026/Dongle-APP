// ─── 본문 학습 관련 타입 ──────────────────────────────────────────────────────

export type TermDefinition = {
  term: string;
  definition: string;
  example?: string;
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

// 본문 내용 섹션 분리
export type NewsBodySection = {
  id: string;
  subtitle: string;
  text: string;
};

export type NewsBodyData = {
  newsId: string;
  intro: string;
  source: string; // 출처
  publishedAt: string;
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

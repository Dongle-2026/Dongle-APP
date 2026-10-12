import type { ISODate, ISODateTime } from './common';

export type QuizStatusDto = 'READY' | 'GENERATING' | 'UNAVAILABLE';
export interface QuizMyResultDto {
  attempts: number;
  solved: boolean;
  earnedHoney: number;
}
export interface QuizDto {
  id: number;
  question: string;
  choices: { id: string; text: string }[];
  honey: number;
  myResult?: QuizMyResultDto;
}
export interface BodyTermDto {
  termId: number;
  term: string;
  definition: string;
  category: string;
  saved?: boolean;
}
export interface NewsBodyDto {
  newsId: number;
  title: string;
  intro: string;
  source: string;
  publishedAt: ISODateTime;
  sections: { id: string; subtitle?: string; text: string }[];
  terms: BodyTermDto[];
  quizStatus: QuizStatusDto;
  quizzes: QuizDto[];
  tags: string[];
}
// 문서: choiceId("a"~"d") 또는 selectedIndex(0~3) 중 하나
export type QuizAnswerRequest =
  { selectedIndex: number; choiceId?: never } | { choiceId: string; selectedIndex?: never };
export interface QuizAnswerResponse {
  quizId: number;
  selectedIndex: number;
  isCorrect: boolean;
  earnedHoney: number;
  alreadySolved: boolean;
  correctIndex?: number;
  explanation?: string;
  totalHoney: number; // 오답이면 correctIndex·explanation 없음
}
export interface StatsDto {
  readNewsCount: number;
  learnedTermCount: number;
  consecutiveLearningDays: number;
  todayCompleted: boolean;
  totalHoney: number;
  totalQuizCount: number;
  todayHoney: number;
  correctCount: number;
}
export interface ActivityDayDto {
  date: ISODate;
  level: number;
  honey: number;
}
export interface InsightsDto {
  correctRate?: number;
  totalQuizCount: number;
  interestedCategories: string[];
  weakCategories: string[];
}

// ── 용어 ──
export interface TermListItemDto {
  id: number;
  name: string;
  path: string;
  simpleDefinition: string;
  difficultyLevel: number;
}
export interface TermFullDto extends TermListItemDto {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  definition: string;
}
export interface TermDetailDto extends TermListItemDto {
  definition: string;
  isLearned: boolean;
  relatedArticles: {
    id: number;
    title: string;
    category: string;
    sourceName: string;
    publishedAt: ISODateTime;
  }[];
}

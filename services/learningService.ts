import type {
  ActivityDayDto,
  InsightsDto,
  QuizAnswerRequest,
  QuizAnswerResponse,
  StatsDto,
} from '@/types/api/learning';
import { http } from './api/client';

export const learningService = {
  stats: () => http.get<StatsDto>('/api/me/stats'),
  activity: (days = 126) => http.get<ActivityDayDto[]>('/api/me/activity', { query: { days } }),
  insights: () => http.get<InsightsDto>('/api/me/insights'),
  answerQuiz: (quizId: string | number, body: QuizAnswerRequest) =>
    http.post<QuizAnswerResponse>(`/api/quizzes/${quizId}/answer`, { body }),
  // /api/users/me/learning-stats 는 "기존 호환" → /api/me/stats 사용 (미구현)
};

// 백엔드 DTO → 프로젝트의 화면용 타입. 화면에서 임시 변환하지 않고 이 파일에서만 변환한다.
import type { CardNews } from '@/types';
import type { ActivityDayDto, InsightsDto, NewsBodyDto, StatsDto } from '@/types/api/learning';
import type { MeDto, ReadHistoryDto, SavedNewsDto, SavedTermDto } from '@/types/api/me';
import type { NewsDetailDto, NewsListItemDto } from '@/types/api/news';
import type { CategoryDto, KeywordDto, SuggestionDto, TrendingDto } from '@/types/api/search';
import type { NewsBodyData } from '@/types/learning';
import type { ActivityDay, UserActivity, UserProfile, UserStats } from '@/types/mypage';
import type { ReadHistory, SavedNews, SavedTerm } from '@/types/saved';
import type { Category, Keyword, Suggestion, TrendingKeyword } from '@/types/search';

const id = (n: number | string) => String(n);

// 목록 응답엔 썸네일·저장 여부가 없다 (image 없음, isSaved=false 는 "알 수 없음"의 기본값)
export const toCardNews = (d: NewsListItemDto): CardNews => ({
  id: id(d.id),
  title: d.title,
  description: d.summary ?? '',
  content: '',
  category: d.category,
  createdAt: d.publishedAt ?? '',
  updatedAt: d.publishedAt ?? '',
  isSaved: false,
});

export const toCardNewsDetail = (d: NewsDetailDto, bookmarked = false): CardNews => ({
  id: id(d.id),
  title: d.title,
  description: d.summary,
  content: d.content,
  category: d.category,
  createdAt: d.publishedAt,
  updatedAt: d.publishedAt,
  url: d.sourceUrl,
  isSaved: bookmarked,
});

export const toNewsBody = (d: NewsBodyDto): NewsBodyData => ({
  newsId: id(d.newsId),
  intro: d.intro,
  source: d.source,
  publishedAt: d.publishedAt,
  sections: d.sections.map((s) => ({ id: s.id, subtitle: s.subtitle ?? '', text: s.text })),
  terms: d.terms.map((t) => ({
    id: id(t.termId),
    term: t.term,
    definition: t.definition,
    category: t.category,
    isSaved: t.saved ?? false,
  })),
  quizzes: d.quizzes.map((q) => ({
    id: id(q.id),
    question: q.question,
    choices: q.choices,
    honey: q.honey,
  })),
  tags: d.tags,
  quizStatus: d.quizStatus,
  // 푼 문제의 선택지·해설은 서버가 주지 않으므로 selectedIndex=-1
  quizResults: d.quizzes
    .filter((q) => q.myResult?.solved)
    .map((q) => ({
      quizId: id(q.id),
      selectedIndex: -1,
      isCorrect: true,
      earnedHoney: q.myResult?.earnedHoney ?? 0,
    })),
});

export const toProfile = (d: MeDto): UserProfile => ({
  id: id(d.id),
  nickname: d.nickname,
  bio: d.bio ?? '',
  avatarId: d.avatarId ?? 'default',
  profileImageUrl: d.profileImageUrl ?? null,
  oauthProvider: d.oauthProvider,
  joinedAt: d.joinedAt,
});

export const toUserStats = (d: StatsDto): UserStats => ({
  todayHoney: d.todayHoney,
  streak: d.consecutiveLearningDays,
  readNewsCount: d.readNewsCount,
  quizCount: d.totalQuizCount,
  correctCount: d.correctCount,
  totalHoney: d.totalHoney,
  todayDone: d.todayCompleted,
  learnedTermCount: d.learnedTermCount,
});

export const toUserActivity = (d: InsightsDto): UserActivity => ({
  interests: d.interestedCategories,
  weaks: d.weakCategories,
});

export const toActivityDay = (d: ActivityDayDto): ActivityDay => ({
  date: d.date,
  level: Math.min(4, Math.max(0, d.level)) as ActivityDay['level'],
  honey: d.honey,
});

export const toSavedTerm = (d: SavedTermDto): SavedTerm => ({
  id: id(d.termId),
  term: d.name,
  definition: d.simpleDefinition,
});

// 저장/읽음 응답에도 썸네일이 없어 image=''  (화면에서 falsy면 이미지를 그리지 않도록)
export const toSavedNews = (d: SavedNewsDto): SavedNews => ({
  id: id(d.articleId),
  title: d.title,
  image: '',
  category: d.category,
  createdAt: d.publishedAt,
  isSaved: true,
  savedAt: d.bookmarkedAt,
});
export const toReadHistory = (d: ReadHistoryDto): ReadHistory => ({
  id: id(d.articleId),
  title: d.title,
  image: '',
  readAt: d.lastReadAt,
  honey: d.honey,
});

// 전체 탭은 앱에서 추가 (문서: "8개 고정. 전체 탭은 앱에서 추가")
export const toCategories = (list: CategoryDto[]): Category[] => [
  { id: 'all', name: '전체' },
  ...list.map((c) => ({ id: c.id, name: c.name, isNew: c.isNew })),
];
export const toKeywords = (list: KeywordDto[]): Keyword[] =>
  list.map((k) => ({
    id: id(k.id),
    keyword: k.keyword,
    image: k.image,
    category: k.category ?? '',
  }));
// change 값 집합은 문서에 없음 → 대소문자 무시, 알 수 없으면 'same'
export const toTrending = (list: TrendingDto[]): TrendingKeyword[] =>
  list.map((t) => {
    const c = t.change?.toLowerCase();
    return {
      rank: t.rank,
      keyword: t.keyword,
      change: c === 'up' || c === 'down' ? c : 'same',
      isNew: t.isNew,
    };
  });
export const toSuggestions = (list: SuggestionDto[]): Suggestion[] =>
  list.map((s) => ({ keyword: s.keyword, type: s.type }));

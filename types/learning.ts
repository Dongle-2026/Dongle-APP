// ─── 본문 학습 관련 타입 ──────────────────────────────────────────────────────

export type Term = {
  id: string; // 서버 용어 id. 저장/해제 API의 키 (지금까지는 term 문자열로 구분 → 중복·표기 변경에 취약)
  term: string;
  definition: string;
  example?: string;
  isSaved?: boolean; // 서버가 내려주는 저장 여부 (초기 상태로 사용)
  category?: string; // [추가] 본문 응답 terms[].category
};

// POST /api/terms/:id/save | /unsave 의 응답 data
export type TermAction = {
  termId: string;
  action: 'save' | 'unsave';
  timestamp: string;
};

// 본문-퀴즈 풀기
export type QuizChoice = {
  id: string;
  text: string;
};

export type Quiz = {
  id: string;
  question: string;
  choices: QuizChoice[];
  honey: number; // 획득 꿀 포인트
  // [삭제] answerIndex / explanation — 본문 응답에 없고, 제출(A11) 응답으로만 내려옴
};

// 본문 내용 섹션 분리
export type NewsBodySection = {
  id: string;
  subtitle: string;
  text: string;
};

//본문 - 퀴즈 하나 당 결과
export type QuizResult = {
  quizId: string;
  selectedIndex: number;
  isCorrect: boolean;
  earnedHoney: number;
  alreadySolved?: boolean; // [추가] 제출 응답
  correctIndex?: number; // [추가] 정답일 때만 내려옴
  explanation?: string; // [추가] 정답일 때만 내려옴
};

export type QuizStatus = 'READY' | 'GENERATING' | 'UNAVAILABLE'; // [추가]

export type NewsBodyData = {
  newsId: string;
  intro: string;
  source: string; // 출처
  publishedAt: string;
  sections: NewsBodySection[];
  terms: Term[];
  quizzes: Quiz[];
  quizStatus: QuizStatus; // [추가] 퀴즈 생성 상태
  quizResults: QuizResult[]; // 복원된 결과는 selectedIndex = -1
  tags: string[];
};

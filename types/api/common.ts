export type ISODateTime = string;
export type ISODate = string; // YYYY-MM-DD

// Spring Page — 0부터 시작, 다음 페이지 = !last
export interface Page<T> {
  content: T[];
  last: boolean;
  number: number;
  size: number;
  totalElements: number;
}
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}

// 오류 본문. 문서에는 HTTP status와 업무 코드(4006 등)만 있고 본문 형식은 명시되지 않아 모두 선택 필드
export interface ApiErrorBody {
  code?: number;
  status?: number;
  message?: string;
}
export type Provider = 'kakao' | 'google';

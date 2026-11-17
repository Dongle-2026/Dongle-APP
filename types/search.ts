export interface Category {
  id: string;
  name: string;
  isNew?: boolean;
}

export interface Keyword {
  id: string;
  keyword: string;
  image?: string;
  category: string;
}
export interface TrendingKeyword {
  rank: number;
  keyword: string;
  change: 'up' | 'down' | 'same';
  isNew?: boolean;
}
export interface Suggestion {
  keyword: string;
  type?: string;
}

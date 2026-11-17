export interface CategoryDto {
  id: string;
  name: string;
  isNew?: boolean;
}
export interface KeywordDto {
  id: string;
  keyword: string;
  category?: string;
  categoryName?: string;
  articleCount?: number;
  image?: string;
}
export interface TrendingDto {
  rank: number;
  keyword: string;
  change?: string;
  isNew?: boolean;
}
export interface SuggestionDto {
  keyword: string;
  type: string;
}

import type { ISODate, ISODateTime, PageParams } from './common';

export interface NewsListItemDto {
  id: number | string;
  title: string;
  description: string;
  content?: string;
  sourceName?: string;
  category: string;
  summary?: string;
  publishedAt?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  isSaved?: boolean;
  slides?: Array<{
    id: number | string;
    type: string;
    title: string;
    description: string;
    image?: string;
  }>;
}
export interface NewsListParams extends PageParams {
  category?: string;
  keyword?: string;
  date?: ISODate;
  limit?: number;
}
export interface RecommendedNewsDto {
  id: number;
  title: string;
  category: string;
  score: number;
  reasonCode: string;
}
export interface TermHighlightDto {
  termId: number;
  termName: string;
  simpleDefinition: string;
  positionStart: number;
  positionEnd: number;
}
export interface NewsDetailDto {
  id: number;
  title: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  category: string;
  publishedAt: ISODateTime;
  summary: string;
  modelVersion: string;
  termHighlights: TermHighlightDto[];
}
export interface BookmarkStateDto {
  bookmarked: boolean;
}

export type CardTemplateType =
  'T01' | 'T02' | 'T03' | 'T04' | 'T05' | 'T06' | 'T07' | 'T08' | 'T09' | 'T10';
export type CardNewsStatus = 'DRAFT' | 'PUBLISHED';
export interface CardNewsSummaryDto {
  cardNewsId: number;
  articleId: number;
  articleTitle: string;
  articleCategory: string;
  totalCards: number;
  status: CardNewsStatus;
  createdAt: ISODateTime;
}
export interface CardDto {
  id: number;
  cardOrder: number;
  templateType: CardTemplateType;
  templateLabel: string;
  title: string;
  body: string;
  subBody: string;
  highlight: string;
  imageUrl: string;
  sourceSentenceIds: number[];
}
export interface CardNewsDetailDto extends CardNewsSummaryDto {
  cards: CardDto[];
  modelVersion: string;
  promptVersion: string;
}

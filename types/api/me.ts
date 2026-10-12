import type { ISODate, ISODateTime } from './common';

export interface MeDto {
  id: number;
  email: string;
  name: string;
  nickname: string;
  birthDate?: ISODate;
  gender?: string;
  regionCode?: string;
  occupation?: string;
  incomeLevel?: string;
  interests?: string[];
  bio?: string;
  avatarId?: string;
  profileImageUrl?: string;
  oauthProvider?: 'kakao' | 'google';
  joinedAt: ISODateTime;
}
// 문서상 text 필드는 "쿼리", 파일은 multipart body
export interface UpdateProfileParams {
  nickname?: string;
  bio?: string;
  avatarId?: string;
  removeImage?: boolean;
}
export interface SavedTermDto {
  termId: number;
  name: string;
  definition: string;
  simpleDefinition: string;
  path: string;
  difficultyLevel: number;
  savedAt: ISODateTime;
}
export interface SavedNewsDto {
  articleId: number;
  title: string;
  sourceName: string;
  category: string;
  publishedAt: ISODateTime;
  bookmarkedAt: ISODateTime;
}
export interface ReadHistoryDto {
  articleId: number;
  title: string;
  sourceName: string;
  category: string;
  publishedAt: ISODateTime;
  lastReadAt: ISODateTime;
  honey: number;
}
export interface LearnedTermDto {
  termId: number;
  name: string;
  simpleDefinition: string;
  difficultyLevel: number;
  learnedAt: ISODateTime;
}
export interface NotificationSettingsDto {
  dailyDigest: boolean;
  quizReminder: boolean;
  streakAlert: boolean;
}
export interface RegisterDeviceRequest {
  deviceId: string;
  token: string;
  platform: 'IOS' | 'ANDROID';
}
export interface NotificationDto {
  id: number;
  policyId: number;
  policyTitle: string;
  notifyBeforeDays: number;
  isSent: boolean;
  isRead: boolean;
  createdAt: ISODateTime;
}
export interface PolicyBookmarkDto {
  id: number;
  title: string;
  summary: string;
  organization: string;
  endDate: ISODate;
  ageMin: number;
  ageMax: number;
}
export interface PolicyProfileRequest {
  birthDate: ISODate;
  regionCode: string;
  occupation: string;
  incomeLevel: string;
}

import type { Page, PageParams } from '@/types/api/common';
import type {
  LearnedTermDto,
  MeDto,
  NotificationDto,
  NotificationSettingsDto,
  PolicyBookmarkDto,
  PolicyProfileRequest,
  ReadHistoryDto,
  RegisterDeviceRequest,
  SavedNewsDto,
  SavedTermDto,
  UpdateProfileParams,
} from '@/types/api/me';
import type { PickedImage } from '@/types/mypage';
import { http } from './api/client';

export const meService = {
  me: () => http.get<MeDto>('/api/me'),
  // 문서: nickname/bio/avatarId/removeImage 는 쿼리, image 는 multipart. bio="" 는 소개 삭제
  updateProfile: (params: UpdateProfileParams, image?: PickedImage | null) => {
    let form: FormData | undefined;
    if (image) {
      form = new FormData();
      form.append('image', {
        uri: image.uri,
        name: image.fileName ?? 'profile.jpg',
        type: image.mimeType ?? 'image/jpeg',
      } as unknown as Blob);
    }
    return http.patch<MeDto>('/api/me/profile', { query: { ...params }, form });
  },
  withdraw: () => http.delete<void>('/api/me'),
  savedTerms: (p: PageParams = {}) =>
    http.get<Page<SavedTermDto>>('/api/me/saved-terms', { query: { ...p } }),
  savedNews: (p: PageParams = {}) =>
    http.get<Page<SavedNewsDto>>('/api/me/saved-news', { query: { ...p } }),
  readHistory: (p: PageParams = {}) =>
    http.get<Page<ReadHistoryDto>>('/api/me/read-history', { query: { ...p } }),
  learnedTerms: () => http.get<LearnedTermDto[]>('/api/users/me/learned-terms'),
  updateInterestCategories: (categories: string[]) =>
    http.put<void>('/api/users/me/categories', { body: { categories } }),
  policyBookmarks: (p: PageParams = {}) =>
    http.get<Page<PolicyBookmarkDto>>('/api/users/me/policy-bookmarks', { query: { ...p } }),
  updatePolicyProfile: (body: PolicyProfileRequest) =>
    http.put<void>('/api/users/me/policy-profile', { body }),
  notificationSettings: () => http.get<NotificationSettingsDto>('/api/me/notification-settings'),
  updateNotificationSettings: (patch: Partial<NotificationSettingsDto>) =>
    http.patch<NotificationSettingsDto>('/api/me/notification-settings', { body: patch }),
  registerDevice: (body: RegisterDeviceRequest) => http.post<void>('/api/me/devices', { body }),
  removeDevice: (deviceId: string) => http.delete<void>(`/api/users/me/devices/${deviceId}`),
  notifications: () => http.get<NotificationDto[]>('/api/notifications'),
  markAllNotificationsRead: () => http.patch<number>('/api/notifications/read-all'),
  markNotificationRead: (id: number) => http.patch<void>(`/api/notifications/${id}/read`),
  // /api/users/me, /api/users/me/bookmarks, PUT /api/users/me/devices 는 "기존 호환" (미구현)
};

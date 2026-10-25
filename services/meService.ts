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
import { File } from 'expo-file-system';
import { http } from './api/client';

export const meService = {
  me: () => http.get<MeDto>('/api/me'),
  updateProfile: (params: UpdateProfileParams, image?: PickedImage | null) => {
    const form = new FormData();

    if (image && image.uri) {
      const imageFile = new File(image.uri);
      form.append('image', imageFile as any);
    } else {
      form.append('noop', '1');
    }

    return http.patch<MeDto>('/api/me/profile', {
      query: {
        nickname: params.nickname,
        bio: params.bio,
        avatarId: params.avatarId,
        removeImage: params.removeImage,
      },
      form,
    });
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

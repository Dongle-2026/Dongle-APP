import { authStore } from '@/auth/authStore';
import { authService } from '@/services/authService';
import { learningService } from '@/services/learningService';
import { toProfile } from '@/services/mappers';
import { meService } from '@/services/meService';
import { newsService } from '@/services/newsService';
import { termService } from '@/services/termService';
import type { NewsBodyDto } from '@/types/api/learning';
import type { MeDto, NotificationSettingsDto, UpdateProfileParams } from '@/types/api/me';
import type { BookmarkStateDto } from '@/types/api/news';
import type { PickedImage } from '@/types/mypage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qk } from './keys';

// 뉴스 저장/해제: 낙관적 업데이트 → 실패 시 롤백 → 저장 탭 목록 갱신
export function useToggleBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, next }: { id: string; next: boolean }) =>
      next ? newsService.save(id) : newsService.unsave(id),
    onMutate: async ({ id, next }) => {
      await qc.cancelQueries({ queryKey: qk.news.bookmark(id) });
      const prev = qc.getQueryData<BookmarkStateDto>(qk.news.bookmark(id));
      qc.setQueryData<BookmarkStateDto>(qk.news.bookmark(id), { bookmarked: next });
      return { prev };
    },
    onError: (_e, { id }, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.news.bookmark(id), ctx.prev);
    },
    onSettled: (_d, _e, { id }) => {
      void qc.invalidateQueries({ queryKey: qk.news.bookmark(id) });
      void qc.invalidateQueries({ queryKey: qk.me.savedNews });
    },
  });
}

// 읽음 기록 → 최근 읽은 기사·통계·히트맵(꿀 5) 갱신
export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, durationSeconds }: { id: string; durationSeconds?: number }) =>
      newsService.markRead(id, durationSeconds),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.me.readHistory });
      void qc.invalidateQueries({ queryKey: qk.me.stats });
      void qc.invalidateQueries({ queryKey: qk.me.activityAll });
    },
  });
}

// 퀴즈 제출. 본문(body) 캐시는 갱신하지 않는다(진행 중인 퀴즈 화면 상태가 되돌려지지 않도록)
export function useSubmitQuizAnswer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, selectedIndex }: { quizId: string; selectedIndex: number }) =>
      learningService.answerQuiz(quizId, { selectedIndex }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: qk.me.stats });
      void qc.invalidateQueries({ queryKey: qk.me.activityAll });
      void qc.invalidateQueries({ queryKey: qk.me.insights });
    },
  });
}

// 용어 저장/해제. newsId를 주면 해당 뉴스 본문의 terms[].saved도 낙관적으로 갱신
export function useToggleTermSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ termId, next }: { termId: string; next: boolean; newsId?: string }) =>
      next ? termService.save(termId) : termService.unsave(termId),
    onMutate: async ({ termId, next, newsId }) => {
      if (!newsId) return {};
      const key = qk.news.body(newsId);
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<NewsBodyDto>(key);
      qc.setQueryData<NewsBodyDto>(
        key,
        (old) =>
          old && {
            ...old,
            terms: old.terms.map((t) => (String(t.termId) === termId ? { ...t, saved: next } : t)),
          }
      );
      return { prev, key };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev && ctx.key) qc.setQueryData(ctx.key, ctx.prev);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: qk.me.savedTerms });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ params, image }: { params: UpdateProfileParams; image?: PickedImage | null }) =>
      meService.updateProfile(params, image),
    onSuccess: (dto: MeDto) => {
      qc.setQueryData(qk.me.profile, dto);
      void qc.invalidateQueries({ queryKey: qk.me.profile });
    },
  });
}

export function useUpdateNotificationSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<NotificationSettingsDto>) =>
      meService.updateNotificationSettings(patch),
    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: qk.me.notificationSettings });
      const prev = qc.getQueryData<NotificationSettingsDto>(qk.me.notificationSettings);
      qc.setQueryData<NotificationSettingsDto>(qk.me.notificationSettings, (old) =>
        old ? { ...old, ...patch } : old
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.me.notificationSettings, ctx.prev);
    },
    onSuccess: (res) => qc.setQueryData(qk.me.notificationSettings, res),
  });
}

// 로그아웃은 서버 호출이 실패해도 로컬 세션은 반드시 종료
export const useLogout = () =>
  useMutation({
    mutationFn: async () => {
      try {
        await authService.logout();
      } catch {
        /* ignore */
      }
    },
    onSettled: () => authStore.signOut(),
  });
export const useWithdraw = () =>
  useMutation({ mutationFn: meService.withdraw, onSuccess: () => authStore.signOut() });

export { toProfile };

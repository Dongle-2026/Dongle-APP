import type { ProfileEditInput, UserProfile } from '@/types/mypage';
// import { apiClient } from '@/utils/api';

// 지금은 mock. 실제 API 연결 시 아래 FormData 요청으로 교체하세요.
export const profileService = {
  async updateProfile(current: UserProfile, input: ProfileEditInput): Promise<UserProfile> {
    // const form = new FormData();
    // form.append('nickname', input.nickname);
    // form.append('bio', input.bio);
    // form.append('avatarId', input.avatarId);
    // if (input.image) {
    //   // React Native FormData는 { uri, name, type } 객체를 파일로 취급
    //   form.append('image', { uri: input.image.uri, name: input.image.fileName ?? 'profile.jpg', type: input.image.mimeType ?? 'image/jpeg' } as any);
    // } else if (input.image === null) {
    //   form.append('removeImage', 'true');
    // }
    // return (await apiClient.patch<UserProfile>('/api/me/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data;

    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            ...current,
            nickname: input.nickname,
            bio: input.bio,
            avatarId: input.avatarId,
            // mock: 업로드된 URL 대신 로컬 uri를 그대로 사용
            profileImageUrl:
              input.image === undefined ? current.profileImageUrl : (input.image?.uri ?? null),
          }),
        600
      )
    );
  },
};

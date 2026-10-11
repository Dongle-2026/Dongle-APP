import ProfileAvatar from '@/components/mypage/ProfileAvatar';
import type { PickedImage, ProfileEditInput, UserProfile } from '@/types/mypage';
import { AVATAR_OPTIONS } from '@/utils/mock';
import { ImagePlus, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB (서버 제한에 맞게 조정)

type Props = {
  visible: boolean;
  profile: UserProfile;
  onSave: (input: ProfileEditInput) => void | Promise<void>;
  onClose: () => void;
};

export default function ProfileEditModal({ visible, profile, onSave, onClose }: Props) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatarId);
  const selectedAvatarData = AVATAR_OPTIONS.find((avatar) => avatar.id === selectedAvatar);
  const [photoUri, setPhotoUri] = useState<string | null>(profile.profileImageUrl ?? null); // 화면 표시용 (서버 URL 또는 로컬 uri)
  const [picked, setPicked] = useState<PickedImage | null>(null); // 새로 고른 로컬 이미지 (업로드 대상)

  const slideAnim = useRef(new Animated.Value(600)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setNickname(profile.nickname);
      setBio(profile.bio);
      setSelectedAvatar(profile.avatarId);
      setPhotoUri(profile.profileImageUrl ?? null);
      setPicked(null);
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 180,
        }),
        Animated.timing(backdropAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      slideAnim.setValue(600);
      backdropAnim.setValue(0);
    }
  }, [visible]);

  const pickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // SDK 52+. 이전 버전은 ImagePicker.MediaTypeOptions.Images
        allowsEditing: true,
        aspect: [1, 1], // 프로필은 정사각형으로 크롭
        quality: 0.8, // 용량 절감
      });
      if (res.canceled) return;
      const a = res.assets[0];
      if (a.fileSize && a.fileSize > MAX_IMAGE_BYTES) {
        Alert.alert('이미지가 너무 커요', '5MB 이하의 사진을 선택해주세요.');
        return;
      }
      setPicked({
        uri: a.uri,
        mimeType: a.mimeType,
        fileName: a.fileName,
        fileSize: a.fileSize,
        width: a.width,
        height: a.height,
      });
      setPhotoUri(a.uri);
    } catch {
      Alert.alert('사진을 불러오지 못했어요', '잠시 후 다시 시도해주세요.');
    }
  };

  // 아바타를 고르면 사진은 해제 (= 서버에는 사진 삭제로 전달)
  const selectAvatar = (id: string) => {
    setSelectedAvatar(id);
    setPhotoUri(null);
    setPicked(null);
  };

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 600, duration: 240, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const handleSave = () => {
    if (!nickname.trim()) return;
    const image: ProfileEditInput['image'] = picked
      ? picked
      : photoUri === null && profile.profileImageUrl
        ? null
        : undefined;
    onSave({ nickname: nickname.trim(), bio: bio.trim(), avatarId: selectedAvatar, image });
    handleClose();
  };

  const screenH = Dimensions.get('window').height;

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', opacity: backdropAnim }}
        >
          <Pressable style={{ flex: 1 }} onPress={handleClose} />

          <Animated.View
            style={{
              transform: [{ translateY: slideAnim }],
              backgroundColor: '#fff',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              maxHeight: screenH * 0.85,
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#D9D9D9' }} />
            </View>

            {/* Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 14,
              }}
            >
              <Text
                style={{ fontSize: 18, fontWeight: '800', color: '#22272B', letterSpacing: -0.4 }}
              >
                프로필 편집
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#F0EEEC',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} color="#898989" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={{ paddingHorizontal: 20, paddingBottom: 40, gap: 24 }}>
                {/* Avatar picker */}
                <View>
                  <Text
                    style={{ fontSize: 13, fontWeight: '700', color: '#898989', marginBottom: 12 }}
                  >
                    아바타 선택
                  </Text>
                  {/* Big preview */}
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <ProfileAvatar
                      uri={photoUri}
                      avatarSource={selectedAvatarData?.source}
                      size={80}
                      radius={24}
                      bg="#FFF8D6"
                      style={{ borderWidth: 3, borderColor: '#FFDC53' }}
                    />
                    <Text
                      style={{ fontSize: 12, color: '#898989', textAlign: 'center', marginTop: 10 }}
                    >
                      갤러리 사진을 고르면 아바타 대신 표시돼요
                    </Text>
                  </View>
                  {/* Avatar grid */}
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 10,
                      justifyContent: 'center',
                    }}
                  >
                    <TouchableOpacity
                      onPress={pickImage}
                      activeOpacity={0.7}
                      accessibilityLabel="갤러리에서 사진 선택"
                      style={{
                        width: 58,
                        height: 58,
                        borderRadius: 14,
                        overflow: 'hidden',
                        backgroundColor: photoUri ? '#FFF8D6' : '#F9F9F9',
                        borderWidth: photoUri ? 2 : 1,
                        borderColor: photoUri ? '#FFDC53' : '#F0EEEC',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {photoUri ? (
                        <Image
                          source={{ uri: photoUri }}
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        <ImagePlus size={22} color="#898989" />
                      )}
                    </TouchableOpacity>
                    {AVATAR_OPTIONS.map((avatar) => {
                      const active = !photoUri && selectedAvatar === avatar.id;
                      return (
                        <TouchableOpacity
                          key={avatar.id}
                          onPress={() => selectAvatar(avatar.id)}
                          activeOpacity={0.7}
                          style={{
                            width: 58,
                            height: 58,
                            borderRadius: 14,
                            backgroundColor: selectedAvatar === avatar.id ? '#FFF8D6' : '#F9F9F9',
                            borderWidth: selectedAvatar === avatar.id ? 2 : 1,
                            borderColor: selectedAvatar === avatar.id ? '#FFDC53' : '#F0EEEC',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Image
                            source={avatar.source}
                            style={{
                              width: 43,
                              height: 50,
                            }}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Nickname */}
                <View>
                  <Text
                    style={{ fontSize: 13, fontWeight: '700', color: '#898989', marginBottom: 8 }}
                  >
                    닉네임
                  </Text>
                  <TextInput
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={12}
                    placeholder="닉네임을 입력하세요"
                    placeholderTextColor="#D9D9D9"
                    style={{
                      backgroundColor: '#F9F9F9',
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: '#F0EEEC',
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: '#22272B',
                      fontWeight: '600',
                    }}
                  />
                  <Text
                    style={{ fontSize: 11, color: '#D9D9D9', textAlign: 'right', marginTop: 4 }}
                  >
                    {nickname.length}/12
                  </Text>
                </View>

                {/* Bio */}
                <View>
                  <Text
                    style={{ fontSize: 13, fontWeight: '700', color: '#898989', marginBottom: 8 }}
                  >
                    한 줄 소개
                  </Text>
                  <TextInput
                    value={bio}
                    onChangeText={setBio}
                    maxLength={40}
                    placeholder="나를 소개해보세요"
                    placeholderTextColor="#D9D9D9"
                    multiline
                    style={{
                      backgroundColor: '#F9F9F9',
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: '#F0EEEC',
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 14,
                      color: '#22272B',
                      lineHeight: 22,
                      minHeight: 72,
                      textAlignVertical: 'top',
                    }}
                  />
                  <Text
                    style={{ fontSize: 11, color: '#D9D9D9', textAlign: 'right', marginTop: 4 }}
                  >
                    {bio.length}/40
                  </Text>
                </View>

                {/* Save button */}
                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!nickname.trim()}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: nickname.trim() ? '#22272B' : '#F0EEEC',
                    borderRadius: 16,
                    paddingVertical: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '800',
                      color: nickname.trim() ? '#FFDC53' : '#D9D9D9',
                      letterSpacing: -0.3,
                    }}
                  >
                    저장하기
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

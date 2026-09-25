import { AVATAR_EMOJI_OPTIONS } from '@/mocks/mypageMock';
import type { UserProfile } from '@/types/mypage';
import { X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
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

type Props = {
  visible: boolean;
  profile: UserProfile;
  onSave: (updated: Pick<UserProfile, 'nickname' | 'bio' | 'avatarEmoji'>) => void;
  onClose: () => void;
};

export default function ProfileEditModal({ visible, profile, onSave, onClose }: Props) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const [selectedEmoji, setSelectedEmoji] = useState(profile.avatarEmoji);

  const slideAnim = useRef(new Animated.Value(600)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setNickname(profile.nickname);
      setBio(profile.bio);
      setSelectedEmoji(profile.avatarEmoji);
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

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 600, duration: 240, useNativeDriver: true }),
      Animated.timing(backdropAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => onClose());
  };

  const handleSave = () => {
    if (!nickname.trim()) return;
    onSave({ nickname: nickname.trim(), bio: bio.trim(), avatarEmoji: selectedEmoji });
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
                    <View
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 24,
                        backgroundColor: '#FFF8D6',
                        borderWidth: 3,
                        borderColor: '#FFDC53',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 40 }}>{selectedEmoji}</Text>
                    </View>
                  </View>
                  {/* Emoji grid */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {AVATAR_EMOJI_OPTIONS.map((emoji) => (
                      <TouchableOpacity
                        key={emoji}
                        onPress={() => setSelectedEmoji(emoji)}
                        activeOpacity={0.7}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 14,
                          backgroundColor: selectedEmoji === emoji ? '#FFF8D6' : '#F9F9F9',
                          borderWidth: selectedEmoji === emoji ? 2 : 1,
                          borderColor: selectedEmoji === emoji ? '#FFDC53' : '#F0EEEC',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 26 }}>{emoji}</Text>
                      </TouchableOpacity>
                    ))}
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

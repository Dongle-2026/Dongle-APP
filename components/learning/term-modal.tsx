import type { TermDefinition } from '@/types/learning';
import { BookmarkCheck, Lightbulb, X } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const CATEGORY_COLOR: Record<TermDefinition['category'], { bg: string; text: string }> = {
  경제: { bg: '#EAF6F9', text: '#0e7fa3' },
  정책: { bg: '#EDF7EE', text: '#2a7a35' },
  금융: { bg: '#FFF8E6', text: '#b8720a' },
  창업: { bg: '#F3EEFF', text: '#6b3fa0' },
  일반: { bg: '#F0EEEC', text: '#555' },
};

type Props = {
  term: TermDefinition | null;
  isSaved: boolean;
  onSave: (term: TermDefinition) => void;
  onClose: () => void;
};

export default function TermModal({ term, isSaved, onSave, onClose }: Props) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (term) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      backdropAnim.setValue(0);
    }
  }, [term]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  if (!term) return null;

  const color = CATEGORY_COLOR[term.category];

  return (
    <Modal transparent visible={!!term} onRequestClose={handleClose} animationType="none">
      {/* Backdrop */}
      <Animated.View
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', opacity: backdropAnim }}
      >
        <Pressable style={{ flex: 1 }} onPress={handleClose} />

        {/* Sheet */}
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 36,
            maxHeight: Dimensions.get('window').height * 0.6,
          }}
        >
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#D9D9D9' }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ paddingHorizontal: 24, paddingBottom: 8 }}>
              {/* Header row */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  {/* Category badge */}
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: color.bg,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 20,
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '600', color: color.text }}>
                      {term.category}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '800',
                      color: '#22272B',
                      letterSpacing: -0.5,
                    }}
                  >
                    {term.term}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 16,
                    backgroundColor: '#F0EEEC',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={16} color="#898989" />
                </TouchableOpacity>
              </View>

              {/* Definition */}
              <View
                style={{
                  backgroundColor: '#F9F9F9',
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <Text style={{ fontSize: 15, lineHeight: 24, color: '#22272B' }}>
                  {term.definition}
                </Text>
              </View>

              {/* Example */}
              {term.example && (
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 8,
                    backgroundColor: '#EAF6F9',
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 16,
                    alignItems: 'flex-start',
                  }}
                >
                  <Lightbulb size={15} color="#0e7fa3" style={{ marginTop: 2 }} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontSize: 11, fontWeight: '700', color: '#0e7fa3', marginBottom: 3 }}
                    >
                      예시
                    </Text>
                    <Text style={{ fontSize: 13, color: '#22272B', lineHeight: 20 }}>
                      {term.example}
                    </Text>
                  </View>
                </View>
              )}

              {/* Save button */}
              <TouchableOpacity
                onPress={() => !isSaved && onSave(term)}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: isSaved ? '#FFDC53' : '#22272B',
                }}
              >
                <BookmarkCheck size={16} color={isSaved ? '#22272B' : '#fff'} />
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: isSaved ? '#22272B' : '#fff',
                  }}
                >
                  {isSaved ? '저장된 용어예요' : '내 용어장에 저장하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

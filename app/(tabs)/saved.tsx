import Section from '@/components/common/Section';
import SectionHeader from '@/components/common/SectionHeader';
import { mockReadHistory, mockSavedTerms } from '@/mocks/mypageMock';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, ChevronRight } from 'lucide-react-native';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function MiniNewsCard({ item }: { item: (typeof mockReadHistory)[number] }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        width: 128,
        flexShrink: 0,
      }}
    >
      <View
        style={{
          width: 128,
          aspectRatio: 0.72,
          borderRadius: 14,
          overflow: 'hidden',
          backgroundColor: '#F0EEEC',
          position: 'relative',
        }}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          pointerEvents="none"
        />

        <View
          style={{
            position: 'absolute',
            left: 12,
            right: 12,
            bottom: 12,
            zIndex: 10,
            elevation: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 19,
              fontWeight: '800',
              color: '#FFFFFF',
            }}
            numberOfLines={3}
          >
            {item.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SavedScreen() {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="bg-mono-100">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ── 저장한 용어 ── */}
        <Section>
          <SectionHeader
            title="저장한 용어"
            subtitle={`${mockSavedTerms.length}개 저장됨`}
            onMore={() => {}}
          />

          {/* 용어 칩 */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {mockSavedTerms.slice(0, 8).map((t) => (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.75}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  backgroundColor: '#F6F6F8',
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderWidth: 1,
                  borderColor: '#F0EEEC',
                }}
              >
                <BookOpen size={12} color="#898989" />
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#22272B' }}>{t.term}</Text>
              </TouchableOpacity>
            ))}

            {mockSavedTerms.length > 8 && (
              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 3,
                  backgroundColor: '#22272B',
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFDC53' }}>
                  +{mockSavedTerms.length - 8}개 더
                </Text>
                <ChevronRight size={13} color="#FFDC53" />
              </TouchableOpacity>
            )}
          </View>
        </Section>

        {/* ── 최근 읽은 기사 ── */}
        <Section>
          <SectionHeader title="최근 읽은 기사" onMore={() => {}} />
          <View style={{ overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {mockReadHistory.map((item) => (
                <MiniNewsCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        </Section>

        {/* ── 저장한 기사 ── */}
        <Section>
          <SectionHeader title="저장한 기사" onMore={() => {}} />
          <View style={{ overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {mockReadHistory.map((item) => (
                <MiniNewsCard key={item.id} item={item} />
              ))}
            </View>
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

import { GlassChip } from '@/components/common/glass';
import SectionHeader from '@/components/common/SectionHeader';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { mockReadHistory, mockSavedTerms } from '@/mocks/mypageMock';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const savedNews = mockReadHistory; // TODO: 저장 기사 데이터로 교체 (기존 코드도 동일 mock 사용)

// 기존 MiniNewsCard 디자인 유지 + 탭하면 기존 뉴스 상세로 연결, 가벼운 glass shadow 추가
function MiniNewsCard({ item }: { item: (typeof mockReadHistory)[number] }) {
  const { open } = useNewsDetail();
  const ref = useRef<View>(null);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{ width: 128, flexShrink: 0 }}
      onPress={() =>
        open({ newsId: item.id, thumbnail: item.thumbnail, title: item.title, cardRef: ref })
      }
    >
      <View
        ref={ref}
        collapsable={false}
        style={[
          {
            width: 128,
            aspectRatio: 0.72,
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: '#F0EEEC',
          },
        ]}
      >
        <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: '100%' }} />
        <LinearGradient
          colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={{ position: 'absolute', inset: 0 }}
          pointerEvents="none"
        />
        <View style={{ position: 'absolute', left: 12, right: 12, bottom: 12 }}>
          <Text
            numberOfLines={3}
            style={{ fontSize: 14, lineHeight: 19, fontWeight: '800', color: '#fff' }}
          >
            {item.title}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const Rail = ({ data }: { data: typeof mockReadHistory }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
    {data.map((item) => (
      <MiniNewsCard key={item.id} item={item} />
    ))}
  </ScrollView>
);

export default function SavedScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110, gap: 16 }}
      >
        <Text className="text-[32px]" style={{ paddingHorizontal: 16, paddingBottom: 12 }}>
          저장
        </Text>
        <View className="px-4 gap-8">
          <View>
            <SectionHeader
              title="저장한 용어"
              subtitle={`${mockSavedTerms.length}개 저장됨`}
              onMore={() => router.push('/saved-terms')}
            />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {mockSavedTerms.slice(0, 8).map((t) => (
                <GlassChip key={t.id} label={t.term} onPress={() => router.push('/saved-terms')} />
              ))}
              {mockSavedTerms.length > 8 && (
                <GlassChip
                  selected
                  label={`+${mockSavedTerms.length - 8}개 더`}
                  onPress={() => router.push('/saved-terms')}
                />
              )}
            </View>
          </View>
          <View>
            <SectionHeader
              title="저장한 기사"
              subtitle={`${savedNews.length}개`}
              onMore={() => router.push('/saved-news')}
            />
            <Rail data={savedNews} />
          </View>
          <View>
            <SectionHeader title="최근 읽은 기사" onMore={() => router.push('/recent-news')} />
            <Rail data={mockReadHistory} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

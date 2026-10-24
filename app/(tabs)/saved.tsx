import { GlassChip } from '@/components/common/glass';
import SectionHeader from '@/components/common/SectionHeader';
import { useNewsDetail } from '@/context/NewsDetailContext';
import { useReadHistory, useSavedNews, useSavedTermsAll } from '@/hooks/queries/queries';
import { ReadHistory, SavedNews } from '@/types/saved';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MiniNewsCardProps = {
  item: SavedNews | ReadHistory;
};

// 기존 MiniNewsCard 디자인 유지 + 탭하면 기존 뉴스 상세로 연결, 가벼운 glass shadow 추가
function MiniNewsCard({ item }: MiniNewsCardProps) {
  const { open } = useNewsDetail();
  const ref = useRef<View>(null);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={{
        width: 128,
        flexShrink: 0,
        // 가벼운 glass shadow 효과 추가
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
          android: {
            elevation: 3,
          },
        }),
      }}
      onPress={() =>
        open({ newsId: item.id, image: item.image ?? '', title: item.title, cardRef: ref })
      }
    >
      <View
        ref={ref}
        collapsable={false}
        style={{
          width: 128,
          aspectRatio: 0.72,
          borderRadius: 18,
          overflow: 'hidden',
          backgroundColor: '#F0EEEC',
        }}
      >
        {/* 저장/읽음 응답에 썸네일이 없음 → 없으면 배경색 박스만 */}
        {item.image ? (
          <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%' }} />
        ) : null}
        <LinearGradient
          colors={['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
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

export const Rail = ({ data }: { data: (SavedNews | ReadHistory)[] }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
    {data.length === 0 ? null : data.map((item) => <MiniNewsCard key={item.id} item={item} />)}
  </ScrollView>
);
export default function SavedScreen() {
  const terms = useSavedTermsAll().data ?? [];
  const savedNews = useSavedNews().data ?? [];
  const recent = useReadHistory().data ?? [];
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
              subtitle={`${terms.length}개 저장됨`}
              onMore={() => router.push('/saved-terms')}
            />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {terms.slice(0, 8).map((t) => (
                <GlassChip key={t.id} label={t.term} onPress={() => router.push('/saved-terms')} />
              ))}
              {terms.length > 8 && (
                <GlassChip
                  selected
                  label={`+${terms.length - 8}개 더`}
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
            <Rail data={recent} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
